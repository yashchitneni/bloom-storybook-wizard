// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.8.0?target=deno";

console.log("Stripe checkout function started");

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
    // Get request data
    const body = await req.json();
    const { email, customData } = body;
    
    console.log("[stripe-checkout] Incoming payload:", JSON.stringify(body));
    if (!email) {
      console.error("[stripe-checkout] Missing email in payload");
      throw new Error("Email is required");
    }
    
    // Get Stripe secret key and determine environment
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const testPriceId = Deno.env.get("STRIPE_PRICE_ID_TEST");
    const livePriceId = Deno.env.get("STRIPE_PRICE_ID_LIVE");
    
    // Debug logging for environment variables
    console.log(`[stripe-checkout] STRIPE_SECRET_KEY exists: ${!!stripeSecretKey}`);
    console.log(`[stripe-checkout] STRIPE_SECRET_KEY starts with sk_test_: ${stripeSecretKey?.startsWith("sk_test_")}`);
    console.log(`[stripe-checkout] STRIPE_SECRET_KEY starts with sk_live_: ${stripeSecretKey?.startsWith("sk_live_")}`);
    console.log(`[stripe-checkout] STRIPE_PRICE_ID_TEST exists: ${!!testPriceId}`);
    console.log(`[stripe-checkout] STRIPE_PRICE_ID_LIVE exists: ${!!livePriceId}`);
    console.log(`[stripe-checkout] STRIPE_PRICE_ID_TEST value: ${testPriceId}`);
    console.log(`[stripe-checkout] STRIPE_PRICE_ID_LIVE value: ${livePriceId}`);
    
    if (!stripeSecretKey) {
      console.error("[stripe-checkout] STRIPE_SECRET_KEY is missing or empty!");
      throw new Error("Stripe secret key is required");
    }
    
    // Detect environment based on Stripe key type
    const isTestMode = stripeSecretKey.startsWith("sk_test_");
    const environment = isTestMode ? "test" : "live";
    
    console.log(`[stripe-checkout] Environment: ${environment}`);
    
    // Get the appropriate price ID for the environment
    const defaultTestPriceId = "price_1RQtaNQLJPVbk0GnzR2F4EPT"; // Your test price ID
    const defaultLivePriceId = "price_1RS768D73M4NkP7peWpponNH"; // Your live price ID
    
    const priceId = isTestMode ? (testPriceId || defaultTestPriceId) : (livePriceId || defaultLivePriceId);
    
    console.log(`[stripe-checkout] Using price ID: ${priceId} (${environment} mode)`);
    console.log(`[stripe-checkout] Creating checkout session for email: ${email}`, customData);
    
    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/wizard`,
      metadata: {
        wizard_data: JSON.stringify(customData || {}),
        environment: environment,
      },
    });
    
    console.log(`[stripe-checkout] Checkout session created: ${session.id} in ${environment} mode`);
    
    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(`[stripe-checkout] Error creating checkout session: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
