-- Permitir transportador ver as encomendas atribuídas a si
CREATE POLICY "Logistics can view assigned orders"
ON public.orders
FOR SELECT
USING (logistics_id = auth.uid());

-- Permitir transportador atualizar estados das suas encomendas atribuídas
CREATE POLICY "Logistics can update assigned orders"
ON public.orders
FOR UPDATE
USING (logistics_id = auth.uid());

-- Permitir transportador ver os itens das encomendas atribuídas
CREATE POLICY "Logistics can view items of assigned orders"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.logistics_id = auth.uid()
  )
);