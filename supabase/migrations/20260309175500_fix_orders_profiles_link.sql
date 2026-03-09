-- Add explicit relationship between orders and profiles
ALTER TABLE public.orders 
  ADD CONSTRAINT orders_customer_id_fkey_profiles 
  FOREIGN KEY (customer_id) REFERENCES public.profiles(id);

-- Update RLS for profiles to allow store owners to see who ordered from them
CREATE POLICY "Store owners can view customer profiles of their orders" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.stores s ON s.id = o.store_id
    WHERE o.customer_id = public.profiles.id 
    AND s.owner_id = auth.uid()
  )
);
