-- Settings tables for admin: payment/banking and invoice/business details
CREATE TABLE IF NOT EXISTS public.payment_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_key_id text,
  razorpay_mode text DEFAULT 'test',
  bank_account_holder text,
  bank_name text,
  bank_account_number text,
  bank_ifsc text,
  upi_id text,
  pan_number text,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invoice_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text,
  legal_name text,
  gstin text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  pincode text,
  country text DEFAULT 'India',
  contact_email text,
  contact_phone text,
  invoice_prefix text DEFAULT 'INV-',
  next_invoice_number integer DEFAULT 1,
  tax_percentage numeric DEFAULT 0,
  terms_and_conditions text,
  footer_note text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage payment settings" ON public.payment_settings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage invoice settings" ON public.invoice_settings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_payment_settings_updated BEFORE UPDATE ON public.payment_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_invoice_settings_updated BEFORE UPDATE ON public.invoice_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed singleton rows
INSERT INTO public.payment_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;
INSERT INTO public.invoice_settings (id, business_name) VALUES (gen_random_uuid(), 'The Women') ON CONFLICT DO NOTHING;