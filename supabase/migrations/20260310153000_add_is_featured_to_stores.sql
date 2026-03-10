-- Add is_featured column to stores table
ALTER TABLE public.stores ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;

-- Update existing stores to have some featured (optional, for testing)
-- UPDATE public.stores SET is_featured = true WHERE name = 'MMM'' All4You';

-- Refresh the schema cache if necessary (handled by Supabase usually)
COMMENT ON COLUMN public.stores.is_featured IS 'Whether the store should be displayed in the featured section on the home page';
