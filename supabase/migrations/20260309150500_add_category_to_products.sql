
-- Adiciona a coluna category à tabela products para permitir categorias em formato de texto
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
