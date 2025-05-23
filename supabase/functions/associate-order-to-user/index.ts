import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { order_id_to_claim, story_email } = await req.json(); // story_email is optional for an extra check

    if (!order_id_to_claim) {
      return new Response(JSON.stringify({ error: 'Order ID to claim is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(`[associate-order] User ${user.id} attempting to claim order/session ID: ${order_id_to_claim}`);

    // Use service role client for backend database operations
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the storybook record by stripe_session_id
    const { data: storybook, error: fetchError } = await serviceClient
      .from('storybooks')
      .select('id, email, author_id')
      .eq('stripe_session_id', order_id_to_claim)
      .maybeSingle();

    if (fetchError) {
      console.error('[associate-order] Error fetching storybook:', fetchError);
      return new Response(JSON.stringify({ error: 'Failed to fetch story details: ' + fetchError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    if (!storybook) {
      console.warn(`[associate-order] No storybook found for stripe_session_id: ${order_id_to_claim}`);
      return new Response(JSON.stringify({ error: 'Order not found or already claimed by this session ID.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Security check: Ensure the email on the story matches the authenticated user's email
    // This is a strong link to prevent arbitrary claiming if someone guesses a session ID.
    if (storybook.email !== user.email) {
      console.warn(`[associate-order] Email mismatch: Story email (${storybook.email}) vs User email (${user.email}) for session ${order_id_to_claim}`);
      return new Response(JSON.stringify({ error: 'Email on order does not match your account email.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403, // Forbidden
      });
    }
    
    if (storybook.author_id && storybook.author_id === user.id) {
        console.log(`[associate-order] Order ${storybook.id} already associated with user ${user.id}`);
        return new Response(JSON.stringify({ message: 'Order already associated with this account.', storybook_id: storybook.id }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200, 
        });
    } else if (storybook.author_id && storybook.author_id !== user.id) {
        console.warn(`[associate-order] Order ${storybook.id} is already associated with a DIFFERENT user ${storybook.author_id}. User ${user.id} attempted to claim.`);
        return new Response(JSON.stringify({ error: 'This order is already claimed by another account.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 409, // Conflict
        });
    }

    // Associate the storybook with the user
    const { error: updateError } = await serviceClient
      .from('storybooks')
      .update({ author_id: user.id, status: 'claimed_by_user' }) // Optionally update status
      .eq('id', storybook.id)
      .is('author_id', null); // Ensure we only update if author_id is still null

    if (updateError) {
      console.error('[associate-order] Error updating storybook:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to associate order with your account: ' + updateError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log(`[associate-order] Successfully associated storybook ${storybook.id} with user ${user.id}`);
    return new Response(JSON.stringify({ message: 'Order successfully associated with your account.', storybook_id: storybook.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[associate-order] Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred: ' + error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 