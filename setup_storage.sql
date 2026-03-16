-- Criar o bucket 'avatars' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de acesso para o bucket 'avatars'
-- Permitir acesso público de leitura
CREATE POLICY "Avatar Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Permitir upload a utilizadores autenticados
CREATE POLICY "Avatar Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Permitir atualização a utilizadores autenticados (os seus próprios ficheiros)
CREATE POLICY "Avatar Authenticated Update" ON storage.objects
  FOR UPDATE WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
