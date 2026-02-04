import { useTranslation } from 'react-i18next';
import { Building2, Users, FileText, CreditCard, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClientData } from '@/hooks/useClientData';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ClientDashboard() {
  const { t, i18n } = useTranslation();
  const { organization, members, invoices, loading } = useClientData();
  const { plan, availableFeatures } = useFeatureAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const activeMembers = members.filter(m => m.is_active);
  const pendingInvoices = invoices.filter(i => i.status === 'pending');
  const planName = i18n.language === 'pl' ? plan?.name_pl : plan?.name;

  const stats = [
    {
      title: t('client.dashboard.teamSize'),
      value: activeMembers.length,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: t('client.dashboard.pendingInvoices'),
      value: pendingInvoices.length,
      icon: FileText,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: t('client.dashboard.activeFeatures'),
      value: availableFeatures.length,
      icon: BarChart3,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            {organization?.name || t('client.dashboard.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('client.dashboard.subtitle')}
          </p>
        </div>
        {plan && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm py-1.5 px-3">
              <CreditCard className="h-3.5 w-3.5 mr-1.5" />
              {planName}
            </Badge>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              {t('client.members.title')}
            </CardTitle>
            <CardDescription>
              {t('client.dashboard.manageTeam')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/client/team">
              <Button variant="outline" className="w-full">
                {t('client.dashboard.viewTeam')}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('client.nav.reports')}
            </CardTitle>
            <CardDescription>
              {t('client.dashboard.viewReports')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/client/reports">
              <Button variant="outline" className="w-full">
                {t('client.dashboard.openReports')}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              {t('client.nav.invoices')}
            </CardTitle>
            <CardDescription>
              {pendingInvoices.length > 0 
                ? t('client.dashboard.pendingPayments', { count: pendingInvoices.length })
                : t('client.dashboard.allPaid')
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/client/invoices">
              <Button variant="outline" className="w-full">
                {t('client.dashboard.viewInvoices')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Organization Info */}
      {organization && (
        <Card>
          <CardHeader>
            <CardTitle>{t('client.organization.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">{t('client.organization.name')}</p>
                <p className="font-medium">{organization.name}</p>
              </div>
              {organization.tax_id && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('client.organization.taxId')}</p>
                  <p className="font-medium">{organization.tax_id}</p>
                </div>
              )}
              {organization.billing_email && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('client.organization.billingEmail')}</p>
                  <p className="font-medium">{organization.billing_email}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
