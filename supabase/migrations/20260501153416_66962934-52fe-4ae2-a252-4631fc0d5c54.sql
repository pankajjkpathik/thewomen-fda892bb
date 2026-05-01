REVOKE EXECUTE ON FUNCTION public.admin_list_customers() FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_list_customers() TO authenticated;