-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'order_update', 'substitution', etc.
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications 
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications (mark as read)" ON public.notifications 
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all notifications" ON public.notifications 
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Add substitution_notes to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS substitution_notes TEXT;

-- Index for better notification fetching
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read) WHERE is_read = FALSE;
