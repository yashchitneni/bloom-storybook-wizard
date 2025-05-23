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

// Log Supabase configuration
console.log("Supabase Configuration:", {
  url: Deno.env.get("SUPABASE_URL"),
  hasServiceRoleKey: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  hasStripeKey: !!Deno.env.get("STRIPE_SECRET_KEY"),
  hasWebhookSecret: !!Deno.env.get("STRIPE_WEBHOOK_SECRET")
});

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
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
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
      
      // --- BEGIN FETCH STORYBOOK AND CHARACTERS FROM DATABASE ---
      let storybookDetailsFromDb = null;
      let charactersFromDb: any[] = [];
      let storybookIdFromDb = null;

      try {
        console.log(`Fetching storybook details for stripe_session_id: ${session.id}`);
        const storybookResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/storybooks?stripe_session_id=eq.${session.id}&select=*,characters(*)`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""}`
          }
        });

        if (!storybookResponse.ok) {
          throw new Error(`Failed to fetch storybook: ${storybookResponse.status} ${await storybookResponse.text()}`);
        }

        const storybooksData = await storybookResponse.json();
        if (storybooksData && storybooksData.length > 0) {
          storybookDetailsFromDb = storybooksData[0];
          storybookIdFromDb = storybookDetailsFromDb.id;
          // Explicitly log what storybookDetailsFromDb.characters contains
          console.log("Raw characters from DB query:", storybookDetailsFromDb.characters);
          charactersFromDb = storybookDetailsFromDb.characters || []; 
          console.log(`Successfully fetched storybook (ID: ${storybookIdFromDb}) and ${charactersFromDb.length} characters from DB.`);
        } else {
          console.warn(`No storybook found in DB for stripe_session_id: ${session.id}. Will rely on metadata only if available or fail if critical data is missing.`);
          // If the storybook record *must* exist at this point, you might want to throw an error here.
        }
      } catch (dbError) {
        console.error(`Error fetching storybook/characters from DB for stripe_session_id ${session.id}:`, dbError.message);
        // Decide if this is a fatal error. If n8n requires full character data, it might be.
        // For now, we'll allow it to proceed with potentially incomplete data for n8n.
      }
      // --- END FETCH STORYBOOK AND CHARACTERS FROM DATABASE ---
      
      // Create payload for n8n webhook
      // Combine data from metadata (less priority) and DB (more priority)
      const n8nWizardData = {
        childName: storybookDetailsFromDb?.child_name || wizardData.childName || "",
        childGender: storybookDetailsFromDb?.child_gender || wizardData.childGender || "",
        ageCategory: storybookDetailsFromDb?.age_category || wizardData.age || "", // 'age' from metadata, 'age_category' from DB
        theme: storybookDetailsFromDb?.theme || wizardData.theme || "",
        subject: storybookDetailsFromDb?.subject || wizardData.subject || "",
        message: storybookDetailsFromDb?.message || wizardData.message || "",
        style: storybookDetailsFromDb?.style || wizardData.style || "",
        customNote: storybookDetailsFromDb?.custom_note || wizardData.customNote || "",
        childPhotoUrl: storybookDetailsFromDb?.child_photo_url || wizardData.childPhotoUrl || "",
        // Add characters from DB to the n8n payload
        characters: charactersFromDb.map(char => ({
          id: char.id,
          name: char.name,
          relation: char.relation,
          gender: char.gender,
          photoUrl: char.photo_url || null // Ensure field name matches what n8n expects
        })),
        // Include other DB fields if n8n needs them
        storybookId: storybookIdFromDb, 
        moral: storybookDetailsFromDb?.moral || wizardData.moral || "",
        email: session.customer_details?.email || session.customer_email || storybookDetailsFromDb?.email || "", // Prioritize Stripe email
      };


      const payload = {
        order_id: session.id,
        customer: {
          email: session.customer_details?.email || session.customer_email
        },
        wizard_data: n8nWizardData // Use the enriched wizard_data
      };
      
      console.log(`Forwarding data to n8n webhook for event ID: ${event.id}`, JSON.stringify(payload, null, 2));
      
      // Forward to n8n webhook using async fetch
      try {
        const n8nResponse = await fetch(
          "https://yashchitneni.app.n8n.cloud/webhook/story-generate",
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
      // This part might be redundant if the storybook is already created/updated before Stripe checkout
      // or needs to be an UPDATE if the record was created pre-checkout.
      // For now, assuming it's an INSERT for a new story, or that your pre-checkout logic handles this.
      // If storybookDetailsFromDb is found, this should ideally be an UPDATE operation
      // or this block should be conditional.
      
      if (!storybookDetailsFromDb) { // Only insert if no record was found via stripe_session_id
        try {
          const insertPayload = {
            email: session.customer_details?.email || session.customer_email || "",
            child_name: n8nWizardData.childName || "Your Child",
            child_gender: n8nWizardData.childGender || "",
            age_category: n8nWizardData.ageCategory || "0-2",
            theme: n8nWizardData.theme || "",
            subject: n8nWizardData.subject || "",
            message: n8nWizardData.message || "",
            style: n8nWizardData.style || "",
            custom_note: n8nWizardData.customNote || null,
            child_photo_url: n8nWizardData.childPhotoUrl || null,
            moral: n8nWizardData.moral || null,
            // status: "payment_received", // Set by your application logic, possibly before this webhook
            // If the storybook is created *before* checkout, its status might already be set.
            // If created *by* this webhook, 'payment_received' or 'pending_fulfillment' is appropriate.
            status: "payment_received", 
            stripe_session_id: session.id // Critical for linking
          };
          
          console.log("Attempting to insert into storybooks with payload (no existing record found):", insertPayload);
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
            // If rawText is empty (common for successful POST with no return=representation)
            // and response was OK, consider it a success without data to parse.
            if (supabaseRes.ok && !rawText.trim()) {
              console.log("Supabase POST successful with empty response body.");
              supabaseData = { success: true }; // Indicate success
            } else {
              supabaseData = JSON.parse(rawText);
            }
          } catch (e) {
            console.error("Failed to parse Supabase response as JSON:", e, "Raw text:", rawText);
            supabaseData = null; // Indicate parsing failure
          }
          if (supabaseData && supabaseData.error) {
            console.error(`Error storing order in database for event ID: ${event.id}:`, supabaseData.error);
          } else if (supabaseData) {
            console.log(`Successfully stored order in database for event ID: ${event.id} and session ID: ${session.id}`);
          }
        } catch (err) {
          console.error(`Error storing order in database for event ID: ${event.id}:`, err.message);
        }
      } else {
        // If storybookDetailsFromDb exists, the record is already there. 
        // You might want to update its status here if needed, e.g., from 'pending_payment' to 'payment_received'.
        console.log(`Storybook record with stripe_session_id ${session.id} already exists. Skipping insert, consider update if status needs change.`);
        // Example: Update status (uncomment and adjust if needed)
        /*
        try {
          const updateStatusPayload = { status: "payment_received" };
          console.log(`Attempting to update storybook ${storybookIdFromDb} status to payment_received`);
          const updateResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/storybooks?id=eq.${storybookIdFromDb}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Prefer": "return=minimal",
              "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""}`
            },
            body: JSON.stringify(updateStatusPayload)
          });
          if (!updateResponse.ok) {
            throw new Error(`Failed to update storybook status: ${updateResponse.status} ${await updateResponse.text()}`);
          }
          console.log(`Successfully updated storybook ${storybookIdFromDb} status.`);
        } catch (updateErr) {
          console.error(`Error updating storybook status for ${storybookIdFromDb}:`, updateErr.message);
        }
        */
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
