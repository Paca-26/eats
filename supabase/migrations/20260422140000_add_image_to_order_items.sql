-- Adicionar coluna de imagem nos itens da encomenda para histórico
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS product_image TEXT;

COMMENT ON COLUMN public.order_items.product_image IS 'Imagem do produto no momento da compra';
