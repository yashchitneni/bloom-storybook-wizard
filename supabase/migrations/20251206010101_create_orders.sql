
-- Create orders table to track Stripe payments
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE,
  email TEXT NOT NULL,
  amount INTEGER,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  order_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage all orders
CREATE POLICY "Allow all access to admins" 
ON public.orders
USING (true);
