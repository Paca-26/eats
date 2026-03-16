-- Adicionar campos de veículo na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS vehicle_type TEXT,
ADD COLUMN IF NOT EXISTS license_plate TEXT,
ADD COLUMN IF NOT EXISTS vehicle_capacity TEXT;

COMMENT ON COLUMN public.profiles.vehicle_type IS 'Tipo de transporte (ex: Mota, Carro, Bicicleta)';
COMMENT ON COLUMN public.profiles.license_plate IS 'Matrícula do veículo';
COMMENT ON COLUMN public.profiles.vehicle_capacity IS 'Capacidade de carga do veículo';
