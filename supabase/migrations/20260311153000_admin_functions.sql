-- =========================================================================
-- Funções de Apoio ao Painel de Administração
-- =========================================================================

-- 1. Obter todos os utilizadores (unindo auth.users com profiles e roles)
-- Como auth.users é restrito, esta função roda com privilégios de owner (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
  id UUID,
  email VARCHAR,
  full_name TEXT,
  phone TEXT,
  role public.app_role,
  created_at TIMESTAMPTZ,
  total_orders BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Apenas admins podem executar
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem ver a lista de utilizadores.';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email::VARCHAR,
    p.full_name,
    p.phone,
    ur.role,
    p.created_at,
    (SELECT COUNT(*) FROM public.orders o WHERE o.customer_id = u.id) as total_orders
  FROM 
    auth.users u
  JOIN 
    public.profiles p ON u.id = p.id
  JOIN 
    public.user_roles ur ON u.id = ur.user_id
  ORDER BY 
    p.created_at DESC;
END;
$$;

-- 2. Eliminar um utilizador (acesso restrito a admin)
CREATE OR REPLACE FUNCTION public.delete_user_admin(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Apenas admins podem executar
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem eliminar utilizadores.';
  END IF;

  -- Impede auto-exclusão
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Não é permitido excluir a própria conta de administrador.';
  END IF;

  -- A exclusão em auth.users cascateará para profiles, roles, lojas, etc (devido aos ON DELETE CASCADE)
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;

-- 3. Obter estatísticas do painel (tudo em uma chamada)
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_users INT;
  active_stores INT;
  orders_today INT;
  monthly_revenue NUMERIC;
  pending_stores INT;
BEGIN
  -- Apenas admins
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado.';
  END IF;

  -- Conta totais
  SELECT COUNT(*) INTO total_users FROM public.profiles;
  SELECT COUNT(*) INTO active_stores FROM public.stores WHERE is_active = true;
  SELECT COUNT(*) INTO pending_stores FROM public.stores WHERE is_active = false;
  
  -- Encomendas de hoje
  SELECT COUNT(*) INTO orders_today 
  FROM public.orders 
  WHERE DATE(created_at) = CURRENT_DATE;

  -- Receita mensal (soma do total das encomendas entregues no mês atual)
  SELECT COALESCE(SUM(total), 0) INTO monthly_revenue
  FROM public.orders
  WHERE status = 'delivered' 
    AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE);

  RETURN json_build_object(
    'total_users', total_users,
    'active_stores', active_stores,
    'pending_stores', pending_stores,
    'orders_today', orders_today,
    'monthly_revenue', monthly_revenue
  );
END;
$$;
