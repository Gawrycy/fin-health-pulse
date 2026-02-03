-- Create industry type enum
CREATE TYPE public.industry_type AS ENUM ('manufacturing', 'it_services', 'ecommerce');

-- Create subscription tier enum
CREATE TYPE public.subscription_tier AS ENUM ('free', 'starter', 'pro');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    company_name TEXT,
    industry_type public.industry_type DEFAULT 'manufacturing',
    subscription_tier public.subscription_tier DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create financial_reports table
CREATE TABLE public.financial_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    period TEXT NOT NULL,
    revenue DECIMAL(15,2) NOT NULL DEFAULT 0,
    gross_profit DECIMAL(15,2) NOT NULL DEFAULT 0,
    admin_costs DECIMAL(15,2) NOT NULL DEFAULT 0,
    payroll_costs DECIMAL(15,2) NOT NULL DEFAULT 0,
    inventory_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    accounts_receivable DECIMAL(15,2) NOT NULL DEFAULT 0,
    accounts_payable DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on financial_reports
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;

-- Financial reports policies
CREATE POLICY "Users can view their own reports"
ON public.financial_reports FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
ON public.financial_reports FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
ON public.financial_reports FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
ON public.financial_reports FOR DELETE
USING (auth.uid() = user_id);

-- Create industry_benchmarks table (public read access)
CREATE TABLE public.industry_benchmarks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    industry_type public.industry_type NOT NULL UNIQUE,
    industry_name TEXT NOT NULL,
    avg_margin DECIMAL(5,2) NOT NULL,
    avg_admin_burden DECIMAL(5,2) NOT NULL,
    avg_efficiency DECIMAL(5,2) NOT NULL,
    avg_cash_cycle INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on industry_benchmarks (public read)
ALTER TABLE public.industry_benchmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view benchmarks"
ON public.industry_benchmarks FOR SELECT
TO authenticated
USING (true);

-- Insert seed data for industry benchmarks
INSERT INTO public.industry_benchmarks (industry_type, industry_name, avg_margin, avg_admin_burden, avg_efficiency, avg_cash_cycle) VALUES
('manufacturing', 'Produkcja (SME)', 22.50, 10.20, 4.80, 68),
('it_services', 'IT Services / Software House', 38.00, 18.50, 2.40, 35),
('ecommerce', 'E-commerce', 18.20, 12.80, 9.50, 22);

-- Create function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-creating profiles
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();