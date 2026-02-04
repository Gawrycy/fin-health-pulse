import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Organization = Tables<'organizations'>;
type OrganizationMember = Tables<'organization_members'>;
type SubscriptionPlan = Tables<'subscription_plans'>;
type FeatureModule = Tables<'feature_modules'>;
type Invoice = Tables<'invoices'>;

export function useClientData() {
  const queryClient = useQueryClient();
  const { roles } = useAuth();
  const organizationId = roles.organizationId;

  // Fetch current organization
  const { data: organization, isLoading: loadingOrg } = useQuery({
    queryKey: ['client-organization', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      const { data, error } = await supabase
        .from('organizations')
        .select('*, subscription_plans(*)')
        .eq('id', organizationId)
        .single();
      if (error) throw error;
      return data as Organization & { subscription_plans: SubscriptionPlan | null };
    },
    enabled: !!organizationId,
  });

  // Fetch team members
  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ['client-members', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      const { data, error } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as OrganizationMember[];
    },
    enabled: !!organizationId,
  });

  // Fetch organization invoices
  const { data: invoices = [], isLoading: loadingInvoices } = useQuery({
    queryKey: ['client-invoices', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!organizationId,
  });

  // Fetch available features based on subscription
  const { data: features = [], isLoading: loadingFeatures } = useQuery({
    queryKey: ['client-features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_modules')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data as FeatureModule[];
    },
  });

  // Update organization
  const updateOrganization = useMutation({
    mutationFn: async (updates: TablesUpdate<'organizations'>) => {
      if (!organizationId) throw new Error('No organization');
      const { error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', organizationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-organization'] });
      toast({ title: 'Organization updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error updating organization', description: error.message, variant: 'destructive' });
    },
  });

  // Add team member
  const addMember = useMutation({
    mutationFn: async (member: Omit<TablesInsert<'organization_members'>, 'organization_id'>) => {
      if (!organizationId) throw new Error('No organization');
      const { error } = await supabase
        .from('organization_members')
        .insert({ ...member, organization_id: organizationId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-members'] });
      toast({ title: 'Team member added successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error adding member', description: error.message, variant: 'destructive' });
    },
  });

  // Update team member
  const updateMember = useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'organization_members'> & { id: string }) => {
      const { error } = await supabase
        .from('organization_members')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-members'] });
      toast({ title: 'Member updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error updating member', description: error.message, variant: 'destructive' });
    },
  });

  // Remove team member
  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('organization_members')
        .update({ is_active: false })
        .eq('id', memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-members'] });
      toast({ title: 'Member removed successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error removing member', description: error.message, variant: 'destructive' });
    },
  });

  return {
    organization,
    members,
    invoices,
    features,
    loading: loadingOrg || loadingMembers || loadingInvoices || loadingFeatures,
    updateOrganization,
    addMember,
    updateMember,
    removeMember,
  };
}
