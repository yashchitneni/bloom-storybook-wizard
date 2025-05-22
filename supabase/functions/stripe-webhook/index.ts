// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "std/http/server.ts";
import Stripe from "stripe";

// Add Deno namespace declaration
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Add type declarations for global objects
declare global {
  interface Window {
    console: Console;
  }
  const console: Console;
  const fetch: typeof globalThis.fetch;
  const Response: typeof globalThis.Response;
}

console.log("Stripe webhook handler started");

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`Error checking if session was processed: ${error.message}`);
    return false;
  }
}

serve(async (req: Request) => {
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
    
    // Verify webhook signature using Stripe's built-in constructEvent function
    let event;
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log("Webhook signature verified successfully");
      } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response("Webhook signature verification failed", {
          status: 400,
          headers: corsHeaders,
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
      
      // Forward to n8n webhook using async fetch
      try {
        const n8nResponse = await fetch(
          "https://n8n.dearkidbooks.com/webhook/story-generate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!n8nResponse.ok) {
          throw new Error(`Failed to forward to n8n: HTTP status ${n8nResponse.status}`);
        }
        console.log(`Successfully forwarded to n8n webhook for event ID: ${event.id}`);
      } catch (error) {
        console.error(`Error forwarding to n8n for event ID: ${event.id}: ${error.message}`);
        // Continue processing even if n8n call fails
      }
      
      // Store the order in the database with stripe_session_id for idempotency
      try {
        const insertPayload = {
          email: session.customer_details?.email || session.customer_email || "",
          child_name: wizardData.childName || "Your Child",
          child_gender: wizardData.childGender || "",
          age_category: wizardData.age || "0-2",
          theme: wizardData.theme || "",
          subject: wizardData.subject || "",
          message: wizardData.message || "",
          style: wizardData.style || "",
          custom_note: wizardData.customNote || null,
          child_photo_url: wizardData.childPhotoUrl || null,
          status: "payment_received",
          stripe_session_id: session.id
        };
        
        console.log("Attempting to insert into storybooks with payload:", insertPayload);
        const supabaseRes = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/storybooks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""}`
          },
          body: JSON.stringify(insertPayload)
        });
        const rawText = await supabaseRes.text();
        console.log("Supabase raw response text:", rawText);
        let supabaseData;
        try {
          supabaseData = JSON.parse(rawText);
        } catch (e) {
          console.error("Failed to parse Supabase response as JSON:", e, rawText);
          supabaseData = null;
        }
        if (supabaseData && supabaseData.error) {
          console.error(`Error storing order in database for event ID: ${event.id}:`, supabaseData.error);
        } else if (supabaseData) {
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
