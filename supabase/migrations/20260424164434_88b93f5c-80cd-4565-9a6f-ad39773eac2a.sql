
-- 1) Restrict coupon SELECT to authenticated users only
DROP POLICY IF EXISTS "Active coupons viewable by everyone" ON public.coupons;

CREATE POLICY "Active coupons viewable by authenticated users"
ON public.coupons
FOR SELECT
TO authenticated
USING (
  is_active = true
  AND (expires_at IS NULL OR expires_at > now())
  AND (max_uses IS NULL OR used_count < max_uses)
);

-- 2) Add restrictive policies on user_roles to explicitly block non-admin writes
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
