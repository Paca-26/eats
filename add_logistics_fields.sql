-- Adicionar campos de logística na tabela orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS logistics_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS logistics_status TEXT DEFAULT 'pending_assignment';
-- Estados possíveis para logistics_status: 'pending_assignment', 'assigned', 'accepted', 'rejected', 'in_transit', 'delivered'

COMMENT ON COLUMN public.orders.logistics_id IS 'ID do transportador (logistics) atribuído a esta encomenda';
COMMENT ON COLUMN public.orders.logistics_status IS 'Estado da logística: pending_assignment, assigned, accepted, rejected, in_transit, delivered';
