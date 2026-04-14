
-- Fix 1: Replace overly permissive coupon SELECT policy with restricted one
DROP POLICY IF EXISTS "Coupons viewable by everyone" ON public.coupons;

CREATE POLICY "Active coupons viewable by everyone"
ON public.coupons
FOR SELECT
TO public
USING (
  is_active = true 
  AND (expires_at IS NULL OR expires_at > now())
  AND (max_uses IS NULL OR used_count < max_uses)
);

-- Fix 2: Add validation trigger on orders to prevent amount manipulation
CREATE OR REPLACE FUNCTION public.validate_order_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon RECORD;
  v_discount numeric := 0;
BEGIN
  -- Ensure total_amount is positive
  IF NEW.total_amount <= 0 THEN
    RAISE EXCEPTION 'Order total_amount must be positive';
  END IF;

  -- Ensure discount_amount is non-negative
  IF COALESCE(NEW.discount_amount, 0) < 0 THEN
    RAISE EXCEPTION 'Discount amount cannot be negative';
  END IF;

  -- Validate coupon if provided
  IF NEW.coupon_code IS NOT NULL AND NEW.coupon_code <> '' THEN
    SELECT * INTO v_coupon FROM public.coupons
    WHERE code = NEW.coupon_code
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
      AND (max_uses IS NULL OR used_count < max_uses);

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid, expired, or exhausted coupon code';
    END IF;

    -- Check minimum order amount
    IF v_coupon.min_order_amount IS NOT NULL AND (NEW.total_amount + COALESCE(NEW.discount_amount, 0)) < v_coupon.min_order_amount THEN
      RAISE EXCEPTION 'Order does not meet minimum amount for this coupon';
    END IF;

    -- Calculate max allowed discount
    IF v_coupon.discount_type = 'percentage' THEN
      v_discount := ROUND((NEW.total_amount + COALESCE(NEW.discount_amount, 0)) * v_coupon.discount_value / 100, 2);
    ELSE
      v_discount := v_coupon.discount_value;
    END IF;

    -- Ensure claimed discount doesn't exceed allowed
    IF COALESCE(NEW.discount_amount, 0) > v_discount THEN
      NEW.discount_amount := v_discount;
    END IF;

    -- Increment coupon used_count atomically
    UPDATE public.coupons SET used_count = used_count + 1 WHERE id = v_coupon.id;
  ELSE
    -- No coupon: discount must be 0
    NEW.discount_amount := 0;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_order_before_insert
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.validate_order_insert();
