import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Tables, Json } from '@/integrations/supabase/types';

type FeatureModule = Tables<'feature_modules'>;
type SubscriptionPlan = Tables<'subscription_plans'>;

interface FeatureAccess {
  hasFeature: (featureCode: string) => boolean;
  availableFeatures: string[];
  allFeatures: FeatureModule[];
  plan: SubscriptionPlan | null;
  loading: boolean;
}

export function useFeatureAccess(): FeatureAccess {
  const { roles } = useAuth();
  const organizationId = roles.organizationId;

  // Fetch organization with subscription plan
  const { data: orgData, isLoading: loadingOrg } = useQuery({
    queryKey: ['feature-access-org', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      const { data, error } = await supabase
        .from('organizations')
        .select('subscription_plan_id, custom_features, subscription_plans(*)')
        .eq('id', organizationId)
        .single();
      if (error) throw error;
      return data as {
        subscription_plan_id: string | null;
        custom_features: Json | null;
        subscription_plans: SubscriptionPlan | null;
      };
    },
    enabled: !!organizationId,
  });

  // Fetch all feature modules
  const { data: allFeatures = [], isLoading: loadingFeatures } = useQuery({
    queryKey: ['all-feature-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_modules')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data as FeatureModule[];
    },
  });

  // Calculate available features based on plan + custom features
  const availableFeatures = useMemo(() => {
    if (!orgData) return [];
    
    const planFeatures: string[] = [];
    
    // Get features from subscription plan
    if (orgData.subscription_plans?.features_list) {
      const featuresList = orgData.subscription_plans.features_list;
      if (Array.isArray(featuresList)) {
        planFeatures.push(...(featuresList as string[]));
      }
    }
    
    // Add custom features if any
    if (orgData.custom_features && Array.isArray(orgData.custom_features)) {
      planFeatures.push(...(orgData.custom_features as string[]));
    }
    
    return [...new Set(planFeatures)];
  }, [orgData]);

  const hasFeature = (featureCode: string): boolean => {
    // Portal staff has access to all features
    if (roles.isPortalStaff) return true;
    
    return availableFeatures.includes(featureCode);
  };

  return {
    hasFeature,
    availableFeatures,
    allFeatures,
    plan: orgData?.subscription_plans ?? null,
    loading: loadingOrg || loadingFeatures,
  };
}
