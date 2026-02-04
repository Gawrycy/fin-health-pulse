-- 1. Create ENUM types for roles (subscription_tier already exists)
CREATE TYPE public.portal_role AS ENUM ('portal_admin', 'support', 'billing_specialist');
CREATE TYPE public.organization_role AS ENUM ('org_admin', 'cfo', 'manager', 'viewer');

-- 2. Create organizations table
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tax_id TEXT,
    billing_email TEXT,
    billing_address JSONB DEFAULT '{}',
    subscription_plan_id UUID,
    custom_features JSONB DEFAULT '[]',
    preferred_language TEXT DEFAULT 'pl',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create subscription_plans table
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_pl TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'PLN',
    billing_cycle TEXT DEFAULT 'monthly',
    features_list JSONB DEFAULT '[]',
    is_custom BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    max_users INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create portal_settings table (singleton for portal owner)
CREATE TABLE public.portal_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_tax_residency TEXT DEFAULT 'PL',
    company_name TEXT DEFAULT 'SmartController AI',
    company_address JSONB DEFAULT '{}',
    vat_id TEXT,
    vat_rate NUMERIC DEFAULT 23,
    currency TEXT DEFAULT 'PLN',
    supported_languages TEXT[] DEFAULT ARRAY['pl', 'en'],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create portal_staff table (portal employees)
CREATE TABLE public.portal_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role portal_role NOT NULL DEFAULT 'support',
    full_name TEXT,
    email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- 6. Create organization_members table (client organization staff)
CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    role organization_role NOT NULL DEFAULT 'viewer',
    full_name TEXT,
    email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, organization_id)
);

-- 7. Create invoices table
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'PLN',
    tax_amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending',
    pdf_url TEXT,
    tax_details JSONB DEFAULT '{}',
    billing_period_start DATE,
    billing_period_end DATE,
    due_date DATE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Create feature_modules table (for feature gating)
CREATE TABLE public.feature_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_pl TEXT NOT NULL,
    description TEXT,
    description_pl TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Add foreign key to organizations for subscription plan
ALTER TABLE public.organizations 
ADD CONSTRAINT fk_subscription_plan 
FOREIGN KEY (subscription_plan_id) 
REFERENCES public.subscription_plans(id) ON DELETE SET NULL;

-- 10. Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_modules ENABLE ROW LEVEL SECURITY;

-- 11. Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.is_portal_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.portal_staff
        WHERE user_id = _user_id AND is_active = true
    )
$$;

CREATE OR REPLACE FUNCTION public.is_portal_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.portal_staff
        WHERE user_id = _user_id AND role = 'portal_admin' AND is_active = true
    )
$$;

CREATE OR REPLACE FUNCTION public.get_user_organization(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT organization_id FROM public.organization_members
    WHERE user_id = _user_id AND is_active = true
    LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE user_id = _user_id AND role = 'org_admin' AND is_active = true
    )
$$;

CREATE OR REPLACE FUNCTION public.get_user_org_role(_user_id UUID)
RETURNS organization_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.organization_members
    WHERE user_id = _user_id AND is_active = true
    LIMIT 1
$$;

-- 12. RLS Policies for portal_staff
CREATE POLICY "Portal admins can manage all staff"
ON public.portal_staff FOR ALL
TO authenticated
USING (public.is_portal_admin(auth.uid()))
WITH CHECK (public.is_portal_admin(auth.uid()));

CREATE POLICY "Staff can view their own record"
ON public.portal_staff FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 13. RLS Policies for portal_settings
CREATE POLICY "Portal staff can view settings"
ON public.portal_settings FOR SELECT
TO authenticated
USING (public.is_portal_staff(auth.uid()));

CREATE POLICY "Portal admins can update settings"
ON public.portal_settings FOR UPDATE
TO authenticated
USING (public.is_portal_admin(auth.uid()))
WITH CHECK (public.is_portal_admin(auth.uid()));

-- 14. RLS Policies for subscription_plans
CREATE POLICY "Anyone can view active plans"
ON public.subscription_plans FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Portal admins can manage plans"
ON public.subscription_plans FOR ALL
TO authenticated
USING (public.is_portal_admin(auth.uid()))
WITH CHECK (public.is_portal_admin(auth.uid()));

-- 15. RLS Policies for organizations
CREATE POLICY "Portal staff can view all organizations"
ON public.organizations FOR SELECT
TO authenticated
USING (public.is_portal_staff(auth.uid()));

CREATE POLICY "Portal admins can manage organizations"
ON public.organizations FOR ALL
TO authenticated
USING (public.is_portal_admin(auth.uid()))
WITH CHECK (public.is_portal_admin(auth.uid()));

CREATE POLICY "Org members can view their organization"
ON public.organizations FOR SELECT
TO authenticated
USING (id = public.get_user_organization(auth.uid()));

CREATE POLICY "Org admins can update their organization"
ON public.organizations FOR UPDATE
TO authenticated
USING (id = public.get_user_organization(auth.uid()) AND public.is_org_admin(auth.uid()))
WITH CHECK (id = public.get_user_organization(auth.uid()) AND public.is_org_admin(auth.uid()));

-- 16. RLS Policies for organization_members
CREATE POLICY "Portal staff can view all members"
ON public.organization_members FOR SELECT
TO authenticated
USING (public.is_portal_staff(auth.uid()));

CREATE POLICY "Org admins can manage their members"
ON public.organization_members FOR ALL
TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()) AND public.is_org_admin(auth.uid()))
WITH CHECK (organization_id = public.get_user_organization(auth.uid()) AND public.is_org_admin(auth.uid()));

CREATE POLICY "Members can view their org colleagues"
ON public.organization_members FOR SELECT
TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Members can view their own record"
ON public.organization_members FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 17. RLS Policies for invoices
CREATE POLICY "Portal staff can view all invoices"
ON public.invoices FOR SELECT
TO authenticated
USING (public.is_portal_staff(auth.uid()));

CREATE POLICY "Portal admins can manage invoices"
ON public.invoices FOR ALL
TO authenticated
USING (public.is_portal_admin(auth.uid()))
WITH CHECK (public.is_portal_admin(auth.uid()));

CREATE POLICY "Org members can view their invoices"
ON public.invoices FOR SELECT
TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

-- 18. RLS Policies for feature_modules
CREATE POLICY "Anyone authenticated can view modules"
ON public.feature_modules FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Portal admins can manage modules"
ON public.feature_modules FOR ALL
TO authenticated
USING (public.is_portal_admin(auth.uid()))
WITH CHECK (public.is_portal_admin(auth.uid()));

-- 19. Create updated_at triggers
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portal_settings_updated_at
BEFORE UPDATE ON public.portal_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portal_staff_updated_at
BEFORE UPDATE ON public.portal_staff
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at
BEFORE UPDATE ON public.organization_members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 20. Insert default data
INSERT INTO public.portal_settings (company_name, owner_tax_residency, vat_rate, currency)
VALUES ('SmartController AI', 'PL', 23, 'PLN');

INSERT INTO public.subscription_plans (name, name_pl, price, currency, billing_cycle, features_list, max_users) VALUES
('Free', 'Darmowy', 0, 'PLN', 'monthly', '["basic_dashboard", "profit_calculator"]', 1),
('Basic', 'Podstawowy', 199, 'PLN', 'monthly', '["basic_dashboard", "profit_calculator", "file_upload", "basic_insights"]', 3),
('Pro', 'Profesjonalny', 499, 'PLN', 'monthly', '["basic_dashboard", "profit_calculator", "file_upload", "ai_insights", "benchmark_comparison", "pdf_reports"]', 10),
('Enterprise', 'Enterprise', 999, 'PLN', 'monthly', '["basic_dashboard", "profit_calculator", "file_upload", "ai_insights", "benchmark_comparison", "pdf_reports", "tdabc_analysis", "consulting_booking", "api_access"]', -1);

INSERT INTO public.feature_modules (code, name, name_pl, description, description_pl) VALUES
('basic_dashboard', 'Basic Dashboard', 'Podstawowy Panel', 'Core financial dashboard', 'Podstawowy panel finansowy'),
('profit_calculator', 'Profit Calculator', 'Kalkulator Zyskowności', 'Calculate profit margins', 'Oblicz marże zysku'),
('file_upload', 'File Upload', 'Import Danych', 'Upload financial files', 'Importuj pliki finansowe'),
('basic_insights', 'Basic Insights', 'Podstawowe Analizy', 'Simple financial insights', 'Proste analizy finansowe'),
('ai_insights', 'AI Insights', 'Analizy AI', 'AI-powered recommendations', 'Rekomendacje oparte na AI'),
('benchmark_comparison', 'Benchmark Comparison', 'Porównanie z Branżą', 'Compare with industry benchmarks', 'Porównanie z benchmarkami branżowymi'),
('pdf_reports', 'PDF Reports', 'Raporty PDF', 'Generate PDF reports', 'Generowanie raportów PDF'),
('tdabc_analysis', 'TDABC Analysis', 'Analiza TDABC', 'Time-driven activity-based costing', 'Rachunek kosztów działań oparty na czasie'),
('consulting_booking', 'Consulting Booking', 'Rezerwacja Konsultacji', 'Book expert consultations', 'Rezerwuj konsultacje eksperckie'),
('api_access', 'API Access', 'Dostęp API', 'REST API access', 'Dostęp do API REST');