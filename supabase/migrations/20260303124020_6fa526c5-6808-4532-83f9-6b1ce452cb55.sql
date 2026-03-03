
-- Create storage bucket for store images
INSERT INTO storage.buckets (id, name, public) VALUES ('store-images', 'store-images', true);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- RLS policies for store-images bucket
CREATE POLICY "Anyone can view store images" ON storage.objects FOR SELECT USING (bucket_id = 'store-images');
CREATE POLICY "Authenticated users can upload store images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'store-images');
CREATE POLICY "Users can update own store images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'store-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own store images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'store-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS policies for product-images bucket
CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Users can update own product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);
