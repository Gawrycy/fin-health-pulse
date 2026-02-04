import { useTranslation } from 'react-i18next';
import { CreditCard, Check, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useClientData } from '@/hooks/useClientData';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Tables } from '@/integrations/supabase/types';

type SubscriptionPlan = Tables<'subscription_plans'>;

export function ClientSubscription() {
  const { t, i18n } = useTranslation();
  const { organization, loading: loadingOrg } = useClientData();
  const { plan: currentPlan, availableFeatures } = useFeatureAccess();

  // Fetch all available plans
  const { data: plans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .eq('is_custom', false)
        .order('price', { ascending: true });
      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });

  if (loadingOrg || loadingPlans) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string = 'PLN') => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(amount);
  };

  const getPlanName = (plan: SubscriptionPlan) => {
    return i18n.language === 'pl' ? plan.name_pl : plan.name;
  };

  const getFeaturesList = (plan: SubscriptionPlan): string[] => {
    if (!plan.features_list) return [];
    if (Array.isArray(plan.features_list)) {
      return plan.features_list as string[];
    }
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          {t('client.subscription.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('client.subscription.subtitle')}
        </p>
      </div>

      {/* Current Plan */}
      {currentPlan && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t('client.subscription.currentPlan')}
                </CardTitle>
                <CardDescription>{t('client.subscription.currentDescription')}</CardDescription>
              </div>
              <Badge variant="default" className="text-lg px-4 py-1">
                {getPlanName(currentPlan)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">{t('client.subscription.price')}</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(currentPlan.price, currentPlan.currency || 'PLN')}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{currentPlan.billing_cycle === 'yearly' ? t('common.year') : t('common.month')}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('client.subscription.maxUsers')}</p>
                <p className="text-2xl font-bold">
                  {currentPlan.max_users || t('admin.plans.unlimited')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('client.subscription.features')}</p>
                <p className="text-2xl font-bold">{availableFeatures.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t('client.subscription.availablePlans')}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id;
            const features = getFeaturesList(plan);
            
            return (
              <Card 
                key={plan.id} 
                className={isCurrentPlan ? 'border-primary border-2' : ''}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{getPlanName(plan)}</CardTitle>
                    {isCurrentPlan && (
                      <Badge variant="default">{t('client.subscription.current')}</Badge>
                    )}
                  </div>
                  <CardDescription>
                    <span className="text-2xl font-bold text-foreground">
                      {formatCurrency(plan.price, plan.currency || 'PLN')}
                    </span>
                    <span className="text-muted-foreground">
                      /{plan.billing_cycle === 'yearly' ? t('common.year') : t('common.month')}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {features.slice(0, 5).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {features.length > 5 && (
                      <p className="text-sm text-muted-foreground">
                        +{features.length - 5} {t('client.subscription.moreFeatures')}
                      </p>
                    )}
                  </div>
                  <Button 
                    className="w-full" 
                    variant={isCurrentPlan ? 'outline' : 'default'}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan 
                      ? t('client.subscription.current') 
                      : t('client.subscription.upgrade')
                    }
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
