-- Correção das restrições de chave estrangeira na tabela orders
-- Permite a exclusão de utilizadores e lojas sem violar a integridade referencial

DO $$ 
BEGIN
    -- 1. Cliente (Customer)
    -- Removemos a restrição antiga e adicionamos com ON DELETE CASCADE
    -- (Ao apagar um cliente, as suas encomendas são apagadas)
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_customer_id_fkey') THEN
        ALTER TABLE public.orders DROP CONSTRAINT orders_customer_id_fkey;
    END IF;
    ALTER TABLE public.orders 
    ADD CONSTRAINT orders_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

    -- 2. Loja (Store)
    -- Removemos a restrição antiga e adicionamos com ON DELETE CASCADE
    -- (Ao apagar uma loja, as encomendas dessa loja são apagadas)
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_store_id_fkey') THEN
        ALTER TABLE public.orders DROP CONSTRAINT orders_store_id_fkey;
    END IF;
    ALTER TABLE public.orders 
    ADD CONSTRAINT orders_store_id_fkey 
    FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;

    -- 3. Logística / Transportador (Logistics)
    -- Removemos a restrição antiga e adicionamos com ON DELETE SET NULL
    -- (Ao apagar um transportador, a encomenda permanece mas o campo logistics_id fica vazio)
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_logistics_id_fkey') THEN
        ALTER TABLE public.orders DROP CONSTRAINT orders_logistics_id_fkey;
    END IF;
    ALTER TABLE public.orders 
    ADD CONSTRAINT orders_logistics_id_fkey 
    FOREIGN KEY (logistics_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

END $$;
