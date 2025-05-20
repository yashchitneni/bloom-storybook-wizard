
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.8.0?target=deno";

console.log("Stripe webhook handler started");

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    
    // Verify webhook signature using the webhook secret
    let event;
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    // If we have a webhook secret, verify the signature using the synchronous method
    if (webhookSecret) {
      try {
        // Use synchronous constructEvent instead of asynchronous constructEventAsync
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log("Webhook signature verified successfully");
      } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(`Webhook signature verification failed: ${err.message}`, { 
          status: 400,
          headers: corsHeaders
        });
      }
    } else {
      // If no webhook secret, parse event directly
      event = JSON.parse(body);
      console.warn("No webhook secret configured - skipping signature verification");
    }
    
    console.log(`Received Stripe event: ${event.type}`);
    
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
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
      
      console.log("Forwarding data to n8n webhook:", payload);
      
      // Forward to n8n webhook
      try {
        // Update the URL to your actual n8n webhook URL
        const response = await fetch("https://n8n.dearkidbooks.com/webhook/story-generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to forward to n8n: ${response.statusText}`);
        }
        
        console.log("Successfully forwarded to n8n webhook");
      } catch (error) {
        console.error(`Error forwarding to n8n: ${error.message}`);
        // Continue processing even if n8n call fails
      }
      
      // Store the order in the database
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
            created_at: new Date().toISOString()
          })
        }).then(res => res.json());
        
        if (error) {
          console.error("Error storing order in database:", error);
        } else {
          console.log("Successfully stored order in database");
        }
      } catch (err) {
        console.error("Error storing order in database:", err.message);
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
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
