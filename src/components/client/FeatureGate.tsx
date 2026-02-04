import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeatureGateProps {
  featureCode: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

export function FeatureGate({ 
  featureCode, 
  children, 
  fallback,
  showUpgradePrompt = true 
}: FeatureGateProps) {
  const { t } = useTranslation();
  const { hasFeature, loading, plan } = useFeatureAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (hasFeature(featureCode)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <Card className="border-dashed border-2 bg-muted/30">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">{t('client.features.locked')}</CardTitle>
        <CardDescription>
          {t('client.features.upgradeMessage', { feature: featureCode })}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {t('client.features.currentPlan')}: <strong>{plan?.name || t('client.features.noPlan')}</strong>
        </p>
        <Button variant="default">
          {t('client.subscription.upgrade')}
        </Button>
      </CardContent>
    </Card>
  );
}
