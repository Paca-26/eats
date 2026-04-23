-- Adicionar campos de disponibilidade do pedido
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS vendor_notes TEXT,
ADD COLUMN IF NOT EXISTS availability_updated_at TIMESTAMPTZ;

COMMENT ON COLUMN public.orders.availability_status IS 'Estado de disponibilidade indicado pelo vendedor: pending, available, partial, unavailable';

-- Criar tabela de mensagens (chat por encomenda)
CREATE TABLE IF NOT EXISTS public.order_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_messages_order_id_idx ON public.order_messages(order_id);

ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customer can view own order messages"
  ON public.order_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid()));

CREATE POLICY "Store owner can view order messages"
  ON public.order_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o JOIN public.stores s ON s.id = o.store_id WHERE o.id = order_id AND s.owner_id = auth.uid()));

CREATE POLICY "Admins can view all order messages"
  ON public.order_messages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customer can send order messages"
  ON public.order_messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid()));

CREATE POLICY "Store owner can send order messages"
  ON public.order_messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.orders o JOIN public.stores s ON s.id = o.store_id WHERE o.id = order_id AND s.owner_id = auth.uid()));

CREATE POLICY "Admins can send order messages"
  ON public.order_messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND public.has_role(auth.uid(), 'admin'));

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;