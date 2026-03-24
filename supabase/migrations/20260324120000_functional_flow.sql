-- Update status constraint for orders
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'validating', 'awaiting_payment', 'paid', 'preparing', 'ready_for_delivery', 'in_transit', 'delivered', 'completed', 'cancelled'));

-- Add new columns for the functional flow
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS accept_substitution BOOLEAN DEFAULT FALSE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_type TEXT DEFAULT 'immediate' CHECK (delivery_type IN ('immediate', 'scheduled'));
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS scheduled_date DATE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS scheduled_time TIME;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS suggestion_pending BOOLEAN DEFAULT FALSE;

-- Add comment to explain statuses mapping to the requirement
-- pending: Pedido criado (Aguardando Validação)
-- validating: (Optional extra state if needed, but 'pending' already used)
-- awaiting_payment: Loja validou, aguardando cliente pagar
-- paid: Cliente pagou
-- preparing: Loja em preparação
-- ready_for_delivery: Admin atribuiu transportador
-- in_transit: Transportador recolheu
-- delivered: Transportador entregou
-- completed: Cliente confirmou receção
-- cancelled: Pedido cancelado/rejeitado
