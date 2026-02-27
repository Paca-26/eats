
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('client', 'store', 'logistics', 'admin');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  zone_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'client',
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Zones
CREATE TABLE public.zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Luanda',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;

-- Add FK for profiles.zone_id
ALTER TABLE public.profiles ADD CONSTRAINT profiles_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zones(id);

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Stores
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  address TEXT,
  phone TEXT,
  logo_url TEXT,
  cover_url TEXT,
  opening_time TIME DEFAULT '08:00',
  closing_time TIME DEFAULT '22:00',
  is_active BOOLEAN NOT NULL DEFAULT true,
  average_rating NUMERIC(2,1) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  zone_id UUID REFERENCES public.zones(id),
  commission_pct NUMERIC(4,2) DEFAULT 10.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  unit TEXT DEFAULT 'un',
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  store_id UUID NOT NULL REFERENCES public.stores(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','preparing','ready','delivering','delivered','cancelled')),
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_address TEXT,
  delivery_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  total_price NUMERIC(12,2) NOT NULL
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id),
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  store_id UUID NOT NULL REFERENCES public.stores(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Cart items (using localStorage for cart, but DB for persistence)
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- has_role function (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Trigger to auto-create profile and client role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Zones (public read)
CREATE POLICY "Anyone can view active zones" ON public.zones FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage zones" ON public.zones FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Categories (public read)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Stores
CREATE POLICY "Anyone can view active stores" ON public.stores FOR SELECT USING (is_active = true);
CREATE POLICY "Store owners can manage own store" ON public.stores FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "Admins can manage all stores" ON public.stores FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Products
CREATE POLICY "Anyone can view available products" ON public.products FOR SELECT USING (is_available = true);
CREATE POLICY "Store owners can manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins can manage all products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE POLICY "Customers can view own orders" ON public.orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Customers can create orders" ON public.orders FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Store owners can view store orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND owner_id = auth.uid())
);
CREATE POLICY "Store owners can update store orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Order items
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND customer_id = auth.uid())
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND customer_id = auth.uid())
);
CREATE POLICY "Store owners can view order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o JOIN public.stores s ON s.id = o.store_id WHERE o.id = order_id AND s.owner_id = auth.uid())
);
CREATE POLICY "Admins can manage all order items" ON public.order_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews" ON public.reviews FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Cart items
CREATE POLICY "Users can manage own cart" ON public.cart_items FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can insert cart items" ON public.cart_items FOR INSERT WITH CHECK (user_id = auth.uid());

-- Seed initial data
INSERT INTO public.zones (name, city, is_active) VALUES ('Talatona', 'Luanda', true);
INSERT INTO public.categories (name, description, icon, sort_order) VALUES
  ('Talhos', 'Carnes frescas e processadas', '🥩', 1),
  ('Peixarias', 'Peixes e mariscos frescos', '🐟', 2),
  ('Mercearias', 'Produtos do dia-a-dia', '🛒', 3),
  ('Restaurantes', 'Refeições prontas', '🍽️', 4),
  ('Supermercados', 'Tudo num só lugar', '🏪', 5);
