CREATE TABLE IF NOT EXISTS public.shipping_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  default_fee numeric NOT NULL DEFAULT 99,
  free_shipping_threshold numeric NOT NULL DEFAULT 1999,
  enabled boolean NOT NULL DEFAULT true,
  notes text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.shipping_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage shipping settings"
ON public.shipping_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read shipping settings"
ON public.shipping_settings
FOR SELECT
TO anon, authenticated
USING (true);

CREATE TRIGGER update_shipping_settings_updated_at
BEFORE UPDATE ON public.shipping_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.shipping_settings (default_fee, free_shipping_threshold, enabled)
VALUES (99, 1999, true);