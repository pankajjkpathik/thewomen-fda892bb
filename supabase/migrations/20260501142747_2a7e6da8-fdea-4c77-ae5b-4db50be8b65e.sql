CREATE OR REPLACE FUNCTION public.admin_list_customers()
RETURNS TABLE(user_id uuid, email text, full_name text, phone text, created_at timestamptz, order_count bigint, total_spent numeric)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT
    u.id AS user_id,
    u.email::text,
    p.full_name,
    p.phone,
    u.created_at,
    COALESCE(o.cnt, 0) AS order_count,
    COALESCE(o.total, 0) AS total_spent
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  LEFT JOIN (
    SELECT user_id, COUNT(*)::bigint AS cnt, SUM(total_amount) AS total
    FROM public.orders
    GROUP BY user_id
  ) o ON o.user_id = u.id
  ORDER BY u.created_at DESC;
END;
$$;

-- Update handle_new_user to also save phone from signup metadata (already does)
-- No change needed; signup will pass phone via raw_user_meta_data.