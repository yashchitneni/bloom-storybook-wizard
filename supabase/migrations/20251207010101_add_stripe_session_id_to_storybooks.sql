
-- Add stripe_session_id column to storybooks table for idempotency
ALTER TABLE public.storybooks ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_storybooks_stripe_session_id ON public.storybooks(stripe_session_id);
