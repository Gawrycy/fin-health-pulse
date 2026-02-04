import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSubscriptionPlans, useCreatePlan, useUpdatePlan, useFeatureModules } from '@/hooks/useAdminData';

interface PlanFormData {
  name: string;
  name_pl: string;
  price: number;
  currency: string;
  billing_cycle: string;
  features_list: string[];
  max_users: number;
  is_custom: boolean;
}

const defaultFormData: PlanFormData = {
  name: '',
  name_pl: '',
  price: 0,
  currency: 'PLN',
  billing_cycle: 'monthly',
  features_list: [],
  max_users: 5,
  is_custom: false,
};

export function PlansManagement() {
  const { t, i18n } = useTranslation();
  const { data: plans, isLoading } = useSubscriptionPlans();
  const { data: modules } = useFeatureModules();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState<PlanFormData>(defaultFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPlan) {
      await updatePlan.mutateAsync({ id: editingPlan, ...formData });
    } else {
      await createPlan.mutateAsync(formData);
    }
    
    setIsDialogOpen(false);
    setEditingPlan(null);
    setFormData(defaultFormData);
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan.id);
    setFormData({
      name: plan.name,
      name_pl: plan.name_pl,
      price: plan.price,
      currency: plan.currency,
      billing_cycle: plan.billing_cycle,
      features_list: plan.features_list || [],
      max_users: plan.max_users,
      is_custom: plan.is_custom,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (plan: any) => {
    await updatePlan.mutateAsync({ id: plan.id, is_active: !plan.is_active });
  };

  const toggleFeature = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      features_list: prev.features_list.includes(code)
        ? prev.features_list.filter((f) => f !== code)
        : [...prev.features_list, code],
    }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('admin.plans.title')}</h1>
          <p className="text-muted-foreground">Manage subscription tiers and features</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingPlan(null);
            setFormData(defaultFormData);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('admin.plans.addPlan')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? t('admin.plans.editPlan') : t('admin.plans.addPlan')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('admin.plans.planName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_pl">{t('admin.plans.planNamePl')}</Label>
                  <Input
                    id="name_pl"
                    value={formData.name_pl}
                    onChange={(e) => setFormData({ ...formData, name_pl: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{t('admin.plans.price')}</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{t('admin.plans.currency')}</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLN">PLN</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing_cycle">{t('admin.plans.billingCycle')}</Label>
                  <Select
                    value={formData.billing_cycle}
                    onValueChange={(value) => setFormData({ ...formData, billing_cycle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">{t('admin.plans.monthly')}</SelectItem>
                      <SelectItem value="yearly">{t('admin.plans.yearly')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_users">{t('admin.plans.maxUsers')}</Label>
                  <Input
                    id="max_users"
                    type="number"
                    min="-1"
                    value={formData.max_users}
                    onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">-1 = {t('admin.plans.unlimited')}</p>
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <Switch
                    id="is_custom"
                    checked={formData.is_custom}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_custom: checked })}
                  />
                  <Label htmlFor="is_custom">{t('admin.plans.isCustom')}</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('admin.plans.features')}</Label>
                <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg bg-muted/50">
                  {modules?.map((module) => (
                    <div
                      key={module.code}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                        formData.features_list.includes(module.code)
                          ? 'bg-primary/10 border border-primary'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => toggleFeature(module.code)}
                    >
                      {formData.features_list.includes(module.code) ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <div className="h-4 w-4 border rounded" />
                      )}
                      <span className="text-sm">
                        {i18n.language === 'pl' ? module.name_pl : module.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={createPlan.isPending || updatePlan.isPending}>
                  {t('common.save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <Card key={plan.id} className={!plan.is_active ? 'opacity-60' : ''}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">
                  {i18n.language === 'pl' ? plan.name_pl : plan.name}
                </CardTitle>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.currency}/{plan.billing_cycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {plan.is_custom && <Badge variant="secondary">Custom</Badge>}
                {!plan.is_active && <Badge variant="destructive">Inactive</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {plan.max_users === -1 ? t('admin.plans.unlimited') : plan.max_users} {t('admin.plans.maxUsers').toLowerCase()}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {(plan.features_list as string[])?.slice(0, 4).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature.replace(/_/g, ' ')}
                  </Badge>
                ))}
                {(plan.features_list as string[])?.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{(plan.features_list as string[]).length - 4}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={plan.is_active}
                    onCheckedChange={() => handleToggleActive(plan)}
                  />
                  <span className="text-sm">{plan.is_active ? t('common.active') : t('common.inactive')}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
