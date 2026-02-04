import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Save } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function OrganizationSettings() {
  const { t } = useTranslation();
  const { roles } = useAuth();
  const { organization, updateOrganization, loading } = useClientData();
  
  const [formData, setFormData] = useState({
    name: '',
    tax_id: '',
    billing_email: '',
    preferred_language: 'pl',
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        tax_id: organization.tax_id || '',
        billing_email: organization.billing_email || '',
        preferred_language: organization.preferred_language || 'pl',
      });
    }
  }, [organization]);

  const handleSave = async () => {
    await updateOrganization.mutateAsync(formData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const canEdit = roles.isOrgAdmin;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          {t('client.organization.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('client.organization.subtitle')}
        </p>
      </div>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t('client.organization.basicInfo')}</CardTitle>
          <CardDescription>
            {canEdit 
              ? t('client.organization.editDescription')
              : t('client.organization.viewOnly')
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t('client.organization.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_id">{t('client.organization.taxId')}</Label>
              <Input
                id="tax_id"
                value={formData.tax_id}
                onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                disabled={!canEdit}
                placeholder="PL1234567890"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="billing_email">{t('client.organization.billingEmail')}</Label>
              <Input
                id="billing_email"
                type="email"
                value={formData.billing_email}
                onChange={(e) => setFormData({ ...formData, billing_email: e.target.value })}
                disabled={!canEdit}
                placeholder="billing@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">{t('client.organization.language')}</Label>
              <Select
                value={formData.preferred_language}
                onValueChange={(value) => setFormData({ ...formData, preferred_language: value })}
                disabled={!canEdit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pl">{t('languages.pl')}</SelectItem>
                  <SelectItem value="en">{t('languages.en')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {canEdit && (
            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={updateOrganization.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateOrganization.isPending ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
