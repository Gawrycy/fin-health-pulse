import { useTranslation } from 'react-i18next';
import { Building2, Users, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOrganizations } from '@/hooks/useAdminData';

export function OrganizationsManagement() {
  const { t, i18n } = useTranslation();
  const { data: organizations, isLoading } = useOrganizations();

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('admin.organizations.title')}</h1>
          <p className="text-muted-foreground">View and manage client organizations</p>
        </div>
      </div>

      {organizations && organizations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card key={org.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    {org.tax_id && (
                      <p className="text-xs text-muted-foreground">NIP: {org.tax_id}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {org.billing_email && (
                  <p className="text-sm text-muted-foreground">{org.billing_email}</p>
                )}
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {org.subscription_plans 
                      ? (i18n.language === 'pl' 
                          ? org.subscription_plans.name_pl 
                          : org.subscription_plans.name)
                      : 'No Plan'}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    🌐 {org.preferred_language?.toUpperCase() || 'PL'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    {t('common.created')}: {new Date(org.created_at).toLocaleDateString(i18n.language)}
                  </span>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Users className="h-3 w-3" />
                    {t('admin.organizations.viewMembers')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No organizations yet</p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Organizations are created when clients sign up and complete onboarding.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
