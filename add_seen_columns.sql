-- Adicionar colunas para rastrear se as encomendas foram vistas
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS seen_by_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS seen_by_vendor BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.orders.seen_by_admin IS 'Indica se a encomenda já foi visualizada por um administrador';
COMMENT ON COLUMN public.orders.seen_by_vendor IS 'Indica se a encomenda já foi visualizada pelo vendedor';
