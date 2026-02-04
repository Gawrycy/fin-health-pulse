import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Subscription Plans
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (plan: {
      name: string;
      name_pl: string;
      price: number;
      currency: string;
      billing_cycle: string;
      features_list: string[];
      max_users: number;
      is_custom: boolean;
    }) => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([plan])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast.success(t('common.success'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, ...plan }: { id: string } & Partial<{
      name: string;
      name_pl: string;
      price: number;
      currency: string;
      billing_cycle: string;
      features_list: string[];
      max_users: number;
      is_custom: boolean;
      is_active: boolean;
    }>) => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(plan)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast.success(t('common.updated'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

// Portal Staff
export function usePortalStaff() {
  return useQuery({
    queryKey: ['portal-staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portal_staff')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

// Portal Settings
export function usePortalSettings() {
  return useQuery({
    queryKey: ['portal-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portal_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdatePortalSettings() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (settings: Partial<{
      company_name: string;
      owner_tax_residency: string;
      vat_id: string;
      vat_rate: number;
      currency: string;
      company_address: Record<string, string>;
    }>) => {
      const { data: existing } = await supabase
        .from('portal_settings')
        .select('id')
        .limit(1)
        .single();

      if (!existing) {
        throw new Error('Portal settings not found');
      }

      const { data, error } = await supabase
        .from('portal_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-settings'] });
      toast.success(t('common.updated'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

// Organizations
export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          *,
          subscription_plans (
            id,
            name,
            name_pl
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

// Feature Modules
export function useFeatureModules() {
  return useQuery({
    queryKey: ['feature-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_modules')
        .select('*')
        .order('code', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
}

// Invoices
export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          organizations (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}
