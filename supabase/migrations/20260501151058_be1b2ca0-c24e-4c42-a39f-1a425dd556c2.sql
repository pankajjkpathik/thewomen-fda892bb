DROP FUNCTION IF EXISTS public.admin_list_customers();

CREATE OR REPLACE FUNCTION public.admin_list_customers()
 RETURNS TABLE(user_id uuid, email text, full_name text, phone text, created_at timestamp with time zone, order_count bigint, total_spent numeric, last_order_at timestamp with time zone, last_address text, last_city text, last_state text, last_pincode text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT
    u.id AS user_id,
    u.email::text,
    COALESCE(NULLIF(p.full_name, ''), lo.shipping_name) AS full_name,
    COALESCE(NULLIF(p.phone, ''), lo.shipping_phone) AS phone,
    u.created_at,
    COALESCE(o.cnt, 0) AS order_count,
    COALESCE(o.total, 0) AS total_spent,
    lo.created_at AS last_order_at,
    lo.shipping_address AS last_address,
    lo.shipping_city AS last_city,
    lo.shipping_state AS last_state,
    lo.shipping_pincode AS last_pincode
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  LEFT JOIN (
    SELECT user_id, COUNT(*)::bigint AS cnt, SUM(total_amount) AS total
    FROM public.orders
    GROUP BY user_id
  ) o ON o.user_id = u.id
  LEFT JOIN LATERAL (
    SELECT shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_pincode, created_at
    FROM public.orders
    WHERE orders.user_id = u.id
    ORDER BY created_at DESC
    LIMIT 1
  ) lo ON true
  ORDER BY u.created_at DESC;
END;
$function$;