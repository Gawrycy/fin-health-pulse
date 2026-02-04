import { useTranslation } from 'react-i18next';
import { Puzzle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useFeatureModules } from '@/hooks/useAdminData';

export function FeaturesManagement() {
  const { t, i18n } = useTranslation();
  const { data: modules, isLoading } = useFeatureModules();

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('nav.features')}</h1>
          <p className="text-muted-foreground">Manage available feature modules for subscription plans</p>
        </div>
      </div>

      {modules && modules.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Puzzle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {i18n.language === 'pl' ? module.name_pl : module.name}
                    </CardTitle>
                    <code className="text-xs text-muted-foreground">{module.code}</code>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {i18n.language === 'pl' ? module.description_pl : module.description}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant={module.is_active ? 'default' : 'secondary'}>
                    {module.is_active ? t('common.active') : t('common.inactive')}
                  </Badge>
                  <Switch checked={module.is_active} disabled />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Puzzle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No feature modules configured</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
