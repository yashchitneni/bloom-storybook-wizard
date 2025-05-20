
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

console.log("LemonSqueezy webhook handler started");

serve(async (req) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }
  
  try {
    const payload = await req.json();
    console.log("Webhook received:", payload);
    
    // Ideally we would validate the webhook signature here
    // https://docs.lemonsqueezy.com/help/webhooks/verifying-webhooks
    
    // Extract important data from the payload
    if (payload.meta?.event_name === "order.paid") {
      const { order, customer, product_variant } = payload.data;
      const { custom } = payload.meta.custom_data || {};
      
      console.log("Order paid:", {
        order_id: order?.id,
        customer_email: customer?.email,
        amount: order?.total_formatted,
        variant: product_variant?.id,
        custom_data: custom
      });
      
      // Here you would trigger story generation based on the order
      // For now we just log the data
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/lemon-squeezy-webhook' \
//   --header 'Content-Type: application/json' \
//   --data '{"meta": {"event_name": "order.paid"}, "data": {"order": {"id": "123", "total_formatted": "$7.99"}, "customer": {"email": "test@example.com"}, "product_variant": {"id": "variant-123"}}, "meta": {"custom_data": {"custom": {"childName": "Alex", "theme": "Adventure"}}}}'
