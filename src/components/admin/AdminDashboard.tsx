import { useTranslation } from 'react-i18next';
import { Building2, CreditCard, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganizations, useSubscriptionPlans, useInvoices } from '@/hooks/useAdminData';

export function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const { data: organizations } = useOrganizations();
  const { data: plans } = useSubscriptionPlans();
  const { data: invoices } = useInvoices();

  const totalClients = organizations?.length ?? 0;
  const activeSubscriptions = organizations?.filter(org => org.subscription_plan_id)?.length ?? 0;
  
  const monthlyRevenue = organizations?.reduce((acc, org) => {
    const plan = plans?.find(p => p.id === org.subscription_plan_id);
    return acc + (plan?.price ?? 0);
  }, 0) ?? 0;

  const pendingInvoices = invoices?.filter(inv => inv.status === 'pending')?.length ?? 0;

  const stats = [
    {
      title: t('admin.dashboard.totalClients'),
      value: totalClients,
      icon: Building2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: t('admin.dashboard.activeSubscriptions'),
      value: activeSubscriptions,
      icon: CreditCard,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: t('admin.dashboard.monthlyRevenue'),
      value: new Intl.NumberFormat(i18n.language, { 
        style: 'currency', 
        currency: 'PLN' 
      }).format(monthlyRevenue),
      icon: DollarSign,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: t('admin.dashboard.pendingInvoices'),
      value: pendingInvoices,
      icon: FileText,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('admin.subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity / Quick Actions could go here */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            {organizations?.slice(0, 5).map((org) => (
              <div key={org.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="font-medium">{org.name}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(org.created_at).toLocaleDateString(i18n.language)}
                </span>
              </div>
            )) || (
              <p className="text-muted-foreground text-sm">No organizations yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscription Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {plans?.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="font-medium">
                  {i18n.language === 'pl' ? plan.name_pl : plan.name}
                </span>
                <span className="text-sm font-semibold text-primary">
                  {plan.price} {plan.currency}
                </span>
              </div>
            )) || (
              <p className="text-muted-foreground text-sm">No plans configured</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
