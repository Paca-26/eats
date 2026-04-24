-- Private chat between admin and logistics courier per order
CREATE TABLE IF NOT EXISTS public.logistics_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('admin','logistics')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_logistics_messages_order_id ON public.logistics_messages(order_id);

ALTER TABLE public.logistics_messages ENABLE ROW LEVEL SECURITY;

-- Admins: full read/write
CREATE POLICY "Admins can view logistics messages"
  ON public.logistics_messages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can send logistics messages"
  ON public.logistics_messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND public.has_role(auth.uid(), 'admin'));

-- Logistics: only on orders assigned to them
CREATE POLICY "Logistics can view their order messages"
  ON public.logistics_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = logistics_messages.order_id
        AND o.logistics_id = auth.uid()
    )
  );

CREATE POLICY "Logistics can send messages on their orders"
  ON public.logistics_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = logistics_messages.order_id
        AND o.logistics_id = auth.uid()
    )
  );

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.logistics_messages;