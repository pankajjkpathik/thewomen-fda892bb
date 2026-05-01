CREATE OR REPLACE FUNCTION public.admin_list_customers()
RETURNS TABLE(
  user_id uuid,
  email text,
  full_name text,
  phone text,
  created_at timestamp with time zone,
  order_count bigint,
  total_spent numeric,
  last_order_at timestamp with time zone,
  last_address text,
  last_city text,
  last_state text,
  last_pincode text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
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
    COALESCE(NULLIF(p.full_name, ''), lo.shipping_name)::text AS full_name,
    COALESCE(NULLIF(p.phone, ''), lo.shipping_phone)::text AS phone,
    u.created_at,
    COALESCE(order_totals.cnt, 0)::bigint AS order_count,
    COALESCE(order_totals.total, 0)::numeric AS total_spent,
    lo.created_at AS last_order_at,
    lo.shipping_address::text AS last_address,
    lo.shipping_city::text AS last_city,
    lo.shipping_state::text AS last_state,
    lo.shipping_pincode::text AS last_pincode
  FROM auth.users AS u
  LEFT JOIN public.profiles AS p ON p.user_id = u.id
  LEFT JOIN (
    SELECT
      orders.user_id AS order_user_id,
      COUNT(*)::bigint AS cnt,
      SUM(orders.total_amount)::numeric AS total
    FROM public.orders AS orders
    GROUP BY orders.user_id
  ) AS order_totals ON order_totals.order_user_id = u.id
  LEFT JOIN LATERAL (
    SELECT
      latest_order.shipping_name,
      latest_order.shipping_phone,
      latest_order.shipping_address,
      latest_order.shipping_city,
      latest_order.shipping_state,
      latest_order.shipping_pincode,
      latest_order.created_at
    FROM public.orders AS latest_order
    WHERE latest_order.user_id = u.id
    ORDER BY latest_order.created_at DESC
    LIMIT 1
  ) AS lo ON true
  ORDER BY u.created_at DESC;
END;
$function$;