
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.2.0?target=deno";
import { createHmac } from "https://deno.land/std@0.131.0/node/crypto.ts";

console.log("Stripe webhook handler started");

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Manual webhook signature verification function
async function verifyStripeSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    console.log("Manually verifying webhook signature...");
    
    // Extract timestamp and signatures from the signature header
    const signatureParts = signature.split(",");
    if (signatureParts.length < 2) {
      throw new Error("Invalid signature format");
    }
    
    // Extract timestamp (t=) and signature (v1=)
    const timestampHeader = signatureParts[0].trim();
    const signatureHeader = signatureParts[1].trim();
    
    if (!timestampHeader.startsWith("t=") || !signatureHeader.startsWith("v1=")) {
      throw new Error("Invalid signature format: missing t= or v1=");
    }
    
    const timestamp = timestampHeader.substring(2);
    const signatureValue = signatureHeader.substring(3);
    
    // Create the signed payload string that Stripe expects
    const signedPayload = `${timestamp}.${payload}`;
    
    // Create HMAC using webhook secret
    const hmac = createHmac("sha256", secret);
    hmac.update(signedPayload);
    const expectedSignature = hmac.digest("hex");
    
    // Compare expected signature with the one from header
    const isValid = expectedSignature === signatureValue;
    console.log(`Signature verification ${isValid ? "succeeded" : "failed"}`);
    return isValid;
  } catch (error) {
    console.error(`Error during signature verification: ${error.message}`);
    return false;
  }
}

// Function to check if a session has already been processed
async function isSessionProcessed(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/storybooks?stripe_session_id=eq.${sessionId}&select=id`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""}`
      }
    });
    
    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    console.error(`Error checking if session was processed: ${err.message}`);
    return false;
  }
}

// Synchronous HTTP request implementation
function syncHttpRequest(url: string, method: string, headers: Record<string, string>, body: string): { status: number, body: string } {
  try {
    const req = new XMLHttpRequest();
    req.open(method, url, false);  // false makes the request synchronous
    
    // Set headers
    Object.entries(headers).forEach(([key, value]) => {
      req.setRequestHeader(key, value);
    });
    
    // Send request
    req.send(body);
    
    return {
      status: req.status,
      body: req.responseText
    };
  } catch (error) {
    console.error(`Synchronous request failed: ${error.message}`);
    return {
      status: 500,
      body: `Error: ${error.message}`
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Get the Stripe signature from headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No Stripe signature found in request");
    }
    
    // Get request body as text for verification
    const body = await req.text();
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Verify webhook signature manually
    let event;
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (webhookSecret) {
      const isValid = await verifyStripeSignature(body, signature, webhookSecret);
      if (isValid) {
        // Parse the event JSON directly since we've verified the signature
        try {
          event = JSON.parse(body);
          console.log("Webhook signature verified successfully");
        } catch (err) {
          console.error(`Failed to parse event JSON: ${err.message}`);
          return new Response(`Failed to parse event JSON: ${err.message}`, { 
            status: 400,
            headers: corsHeaders
          });
        }
      } else {
        console.error("Webhook signature verification failed");
        return new Response("Webhook signature verification failed", { 
          status: 400,
          headers: corsHeaders
        });
      }
    } else {
      // If no webhook secret, parse event directly
      event = JSON.parse(body);
      console.warn("No webhook secret configured - skipping signature verification");
    }
    
    console.log(`Received Stripe event: ${event.type} with ID: ${event.id}`);
    
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Check if this session has already been processed (idempotency check)
      const sessionAlreadyProcessed = await isSessionProcessed(session.id);
      if (sessionAlreadyProcessed) {
        console.log(`Session ${session.id} has already been processed. Skipping to prevent duplicate orders.`);
        return new Response(JSON.stringify({ received: true, status: "already_processed" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      // Extract the metadata
      const wizardDataString = session.metadata?.wizard_data || "{}";
      let wizardData;
      try {
        wizardData = JSON.parse(wizardDataString);
      } catch (e) {
        console.error("Failed to parse wizard_data JSON:", e);
        wizardData = {};
      }
      
      // Create payload for n8n webhook with the same structure as before
      const payload = {
        order_id: session.id,
        customer: {
          email: session.customer_details?.email || session.customer_email
        },
        wizard_data: {
          childName: wizardData.childName || "",
          childGender: wizardData.childGender || "",
          ageCategory: wizardData.age || "",
          theme: wizardData.theme || "",
          subject: wizardData.subject || "",
          message: wizardData.message || "",
          style: wizardData.style || "",
          customNote: wizardData.customNote || "",
          childPhotoUrl: wizardData.childPhotoUrl || ""
        }
      };
      
      console.log(`Forwarding data to n8n webhook for event ID: ${event.id}`, payload);
      
      // Forward to n8n webhook using synchronous request
      try {
        // Use synchronous XMLHttpRequest instead of fetch
        const result = syncHttpRequest(
          "https://n8n.dearkidbooks.com/webhook/story-generate",
          "POST",
          { "Content-Type": "application/json" },
          JSON.stringify(payload)
        );
        
        if (result.status < 200 || result.status >= 300) {
          throw new Error(`Failed to forward to n8n: HTTP status ${result.status}`);
        }
        
        console.log(`Successfully forwarded to n8n webhook for event ID: ${event.id}`);
      } catch (error) {
        console.error(`Error forwarding to n8n for event ID: ${event.id}: ${error.message}`);
        // Continue processing even if n8n call fails
      }
      
      // Store the order in the database with stripe_session_id for idempotency
      try {
        const { error } = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/storybooks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""}`
          },
          body: JSON.stringify({
            email: session.customer_details?.email || session.customer_email,
            child_name: wizardData.childName || "",
            child_gender: wizardData.childGender || "",
            age_category: wizardData.age || "",
            theme: wizardData.theme || "",
            subject: wizardData.subject || "",
            message: wizardData.message || "",
            style: wizardData.style || "",
            custom_note: wizardData.customNote || "",
            child_photo_url: wizardData.childPhotoUrl || null,
            status: "payment_received",
            stripe_session_id: session.id, // Store session ID for idempotency
            created_at: new Date().toISOString()
          })
        }).then(res => res.json());
        
        if (error) {
          console.error(`Error storing order in database for event ID: ${event.id}:`, error);
        } else {
          console.log(`Successfully stored order in database for event ID: ${event.id} and session ID: ${session.id}`);
        }
      } catch (err) {
        console.error(`Error storing order in database for event ID: ${event.id}:`, err.message);
      }
    }
    
    return new Response(JSON.stringify({ received: true, eventId: event.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(`Error handling webhook: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
