-- Migration: 20260311170000_store_approval_and_product_fees.sql
-- Description: Changes default store status to pending (false) and adds admin_fee to products

-- 1. Alter the default value of is_active in the stores table so new stores need approval
ALTER TABLE public.stores ALTER COLUMN is_active SET DEFAULT false;

-- 2. Add the admin_fee column to the products table to allow admins to set a custom fee for transport/selling
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS admin_fee NUMERIC(12,2) DEFAULT 0;

-- 3. Update existing stores that might be pending to be correctly tracked if needed (optional)
-- We'll leave existing data alone as requested, only new stores will default to false.
