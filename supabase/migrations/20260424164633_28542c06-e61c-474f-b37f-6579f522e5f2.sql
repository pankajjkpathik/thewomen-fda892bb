
-- Remove broad authenticated SELECT on coupons
DROP POLICY IF EXISTS "Active coupons viewable by authenticated users" ON public.coupons;

-- (Admins still have ALL via existing "Admins can manage coupons" policy)

-- Provide a SECURITY DEFINER RPC for shoppers to validate a single coupon code
CREATE OR REPLACE FUNCTION public.validate_coupon(_code text, _order_amount numeric)
RETURNS TABLE (
  code text,
  discount_type text,
  discount_value numeric,
  discount_amount numeric,
  min_order_amount numeric,
  is_valid boolean,
  message text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v RECORD;
  v_disc numeric := 0;
BEGIN
  SELECT * INTO v FROM public.coupons
  WHERE coupons.code = _code
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR used_count < max_uses);

  IF NOT FOUND THEN
    RETURN QUERY SELECT _code, NULL::text, NULL::numeric, 0::numeric, NULL::numeric, false, 'Invalid or expired coupon';
    RETURN;
  END IF;

  IF v.min_order_amount IS NOT NULL AND _order_amount < v.min_order_amount THEN
    RETURN QUERY SELECT v.code, v.discount_type, v.discount_value, 0::numeric, v.min_order_amount, false,
      'Minimum order amount not met';
    RETURN;
  END IF;

  IF v.discount_type = 'percentage' THEN
    v_disc := ROUND(_order_amount * v.discount_value / 100, 2);
  ELSE
    v_disc := v.discount_value;
  END IF;

  RETURN QUERY SELECT v.code, v.discount_type, v.discount_value, v_disc, v.min_order_amount, true, 'Coupon applied';
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_coupon(text, numeric) TO authenticated, anon;
