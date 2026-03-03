
-- We need a function to assign a specific role on signup instead of always 'client'
-- The handle_new_user trigger will keep assigning 'client' by default
-- We'll add a mechanism to update the role after signup based on user metadata

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _role app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  -- Get role from user metadata, default to 'client'
  _role := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'role', '')::app_role,
    'client'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
