import { useTranslation } from 'react-i18next';
import { TrendingUp } from 'lucide-react';
import { FeatureGate } from './FeatureGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ClientReports() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          {t('client.nav.reports')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('client.reports.subtitle')}
        </p>
      </div>

      <FeatureGate featureCode="reports">
        <Card>
          <CardHeader>
            <CardTitle>{t('client.reports.title')}</CardTitle>
            <CardDescription>
              {t('client.reports.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">
                {t('client.reports.placeholder')}
              </p>
            </div>
          </CardContent>
        </Card>
      </FeatureGate>
    </div>
  );
}
