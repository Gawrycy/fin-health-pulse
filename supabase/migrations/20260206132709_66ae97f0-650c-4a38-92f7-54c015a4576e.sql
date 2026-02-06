
-- Fix portal_staff policies: drop restrictive, create permissive
DROP POLICY IF EXISTS "Staff can view their own record" ON public.portal_staff;
DROP POLICY IF EXISTS "Portal admins can manage all staff" ON public.portal_staff;

CREATE POLICY "Staff can view their own record"
ON public.portal_staff FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Portal admins can manage all staff"
ON public.portal_staff FOR ALL TO authenticated
USING (is_portal_admin(auth.uid()))
WITH CHECK (is_portal_admin(auth.uid()));

-- Fix organization_members policies: drop restrictive, create permissive
DROP POLICY IF EXISTS "Members can view their own record" ON public.organization_members;
DROP POLICY IF EXISTS "Members can view their org colleagues" ON public.organization_members;
DROP POLICY IF EXISTS "Org admins can manage their members" ON public.organization_members;
DROP POLICY IF EXISTS "Portal staff can view all members" ON public.organization_members;

CREATE POLICY "Members can view their own record"
ON public.organization_members FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Members can view their org colleagues"
ON public.organization_members FOR SELECT TO authenticated
USING (organization_id = get_user_organization(auth.uid()));

CREATE POLICY "Org admins can manage their members"
ON public.organization_members FOR ALL TO authenticated
USING ((organization_id = get_user_organization(auth.uid())) AND is_org_admin(auth.uid()))
WITH CHECK ((organization_id = get_user_organization(auth.uid())) AND is_org_admin(auth.uid()));

CREATE POLICY "Portal staff can view all members"
ON public.organization_members FOR SELECT TO authenticated
USING (is_portal_staff(auth.uid()));

-- Fix organizations policies
DROP POLICY IF EXISTS "Org members can view their organization" ON public.organizations;
DROP POLICY IF EXISTS "Org admins can update their organization" ON public.organizations;
DROP POLICY IF EXISTS "Portal admins can manage organizations" ON public.organizations;
DROP POLICY IF EXISTS "Portal staff can view all organizations" ON public.organizations;

CREATE POLICY "Org members can view their organization"
ON public.organizations FOR SELECT TO authenticated
USING (id = get_user_organization(auth.uid()));

CREATE POLICY "Org admins can update their organization"
ON public.organizations FOR UPDATE TO authenticated
USING ((id = get_user_organization(auth.uid())) AND is_org_admin(auth.uid()))
WITH CHECK ((id = get_user_organization(auth.uid())) AND is_org_admin(auth.uid()));

CREATE POLICY "Portal admins can manage organizations"
ON public.organizations FOR ALL TO authenticated
USING (is_portal_admin(auth.uid()))
WITH CHECK (is_portal_admin(auth.uid()));

CREATE POLICY "Portal staff can view all organizations"
ON public.organizations FOR SELECT TO authenticated
USING (is_portal_staff(auth.uid()));

-- Fix other tables too
DROP POLICY IF EXISTS "Anyone authenticated can view modules" ON public.feature_modules;
DROP POLICY IF EXISTS "Portal admins can manage modules" ON public.feature_modules;

CREATE POLICY "Anyone authenticated can view modules"
ON public.feature_modules FOR SELECT TO authenticated
USING (is_active = true);

CREATE POLICY "Portal admins can manage modules"
ON public.feature_modules FOR ALL TO authenticated
USING (is_portal_admin(auth.uid()))
WITH CHECK (is_portal_admin(auth.uid()));

-- Fix invoices
DROP POLICY IF EXISTS "Org members can view their invoices" ON public.invoices;
DROP POLICY IF EXISTS "Portal admins can manage invoices" ON public.invoices;
DROP POLICY IF EXISTS "Portal staff can view all invoices" ON public.invoices;

CREATE POLICY "Org members can view their invoices"
ON public.invoices FOR SELECT TO authenticated
USING (organization_id = get_user_organization(auth.uid()));

CREATE POLICY "Portal admins can manage invoices"
ON public.invoices FOR ALL TO authenticated
USING (is_portal_admin(auth.uid()))
WITH CHECK (is_portal_admin(auth.uid()));

CREATE POLICY "Portal staff can view all invoices"
ON public.invoices FOR SELECT TO authenticated
USING (is_portal_staff(auth.uid()));

-- Fix portal_settings
DROP POLICY IF EXISTS "Portal staff can view settings" ON public.portal_settings;
DROP POLICY IF EXISTS "Portal admins can update settings" ON public.portal_settings;

CREATE POLICY "Portal staff can view settings"
ON public.portal_settings FOR SELECT TO authenticated
USING (is_portal_staff(auth.uid()));

CREATE POLICY "Portal admins can update settings"
ON public.portal_settings FOR UPDATE TO authenticated
USING (is_portal_admin(auth.uid()))
WITH CHECK (is_portal_admin(auth.uid()));

-- Fix subscription_plans
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Portal admins can manage plans" ON public.subscription_plans;

CREATE POLICY "Anyone can view active plans"
ON public.subscription_plans FOR SELECT TO authenticated
USING (is_active = true);

CREATE POLICY "Portal admins can manage plans"
ON public.subscription_plans FOR ALL TO authenticated
USING (is_portal_admin(auth.uid()))
WITH CHECK (is_portal_admin(auth.uid()));

-- Fix profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Fix financial_reports
DROP POLICY IF EXISTS "Users can view their own reports" ON public.financial_reports;
DROP POLICY IF EXISTS "Users can insert their own reports" ON public.financial_reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.financial_reports;
DROP POLICY IF EXISTS "Users can delete their own reports" ON public.financial_reports;

CREATE POLICY "Users can view their own reports"
ON public.financial_reports FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
ON public.financial_reports FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
ON public.financial_reports FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
ON public.financial_reports FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Fix industry_benchmarks
DROP POLICY IF EXISTS "Anyone can view benchmarks" ON public.industry_benchmarks;

CREATE POLICY "Anyone can view benchmarks"
ON public.industry_benchmarks FOR SELECT TO authenticated
USING (true);
