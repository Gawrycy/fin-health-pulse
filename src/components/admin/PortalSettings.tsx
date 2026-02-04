import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
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
import { usePortalSettings, useUpdatePortalSettings } from '@/hooks/useAdminData';

interface AddressData extends Record<string, string> {
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export function PortalSettings() {
  const { t } = useTranslation();
  const { data: settings, isLoading } = usePortalSettings();
  const updateSettings = useUpdatePortalSettings();

  const [formData, setFormData] = useState({
    company_name: '',
    owner_tax_residency: 'PL',
    vat_id: '',
    vat_rate: 23,
    currency: 'PLN',
    company_address: {
      street: '',
      city: '',
      postal_code: '',
      country: 'Poland',
    } as AddressData,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name || '',
        owner_tax_residency: settings.owner_tax_residency || 'PL',
        vat_id: settings.vat_id || '',
        vat_rate: settings.vat_rate || 23,
        currency: settings.currency || 'PLN',
        company_address: (settings.company_address as AddressData) || {
          street: '',
          city: '',
          postal_code: '',
          country: 'Poland',
        },
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings.mutateAsync(formData);
  };

  const updateAddress = (key: keyof AddressData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      company_address: {
        ...prev.company_address,
        [key]: value,
      },
    }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.settings.title')}</h1>
        <p className="text-muted-foreground">Configure your portal's tax and business settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Your company details for invoicing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company_name">{t('admin.settings.companyName')}</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat_id">{t('admin.settings.vatId')}</Label>
                <Input
                  id="vat_id"
                  value={formData.vat_id}
                  onChange={(e) => setFormData({ ...formData, vat_id: e.target.value })}
                  placeholder="PL1234567890"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.settings.companyAddress')}</CardTitle>
            <CardDescription>Physical address for legal documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">{t('admin.settings.street')}</Label>
              <Input
                id="street"
                value={formData.company_address.street || ''}
                onChange={(e) => updateAddress('street', e.target.value)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">{t('admin.settings.city')}</Label>
                <Input
                  id="city"
                  value={formData.company_address.city || ''}
                  onChange={(e) => updateAddress('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">{t('admin.settings.postalCode')}</Label>
                <Input
                  id="postal_code"
                  value={formData.company_address.postal_code || ''}
                  onChange={(e) => updateAddress('postal_code', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t('admin.settings.country')}</Label>
                <Input
                  id="country"
                  value={formData.company_address.country || ''}
                  onChange={(e) => updateAddress('country', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Configuration</CardTitle>
            <CardDescription>VAT and currency settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="tax_residency">{t('admin.settings.taxResidency')}</Label>
                <Select
                  value={formData.owner_tax_residency}
                  onValueChange={(value) => setFormData({ ...formData, owner_tax_residency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PL">Poland (PL)</SelectItem>
                    <SelectItem value="DE">Germany (DE)</SelectItem>
                    <SelectItem value="UK">United Kingdom (UK)</SelectItem>
                    <SelectItem value="US">United States (US)</SelectItem>
                    <SelectItem value="FR">France (FR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat_rate">{t('admin.settings.vatRate')}</Label>
                <Input
                  id="vat_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.vat_rate}
                  onChange={(e) => setFormData({ ...formData, vat_rate: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">{t('admin.settings.defaultCurrency')}</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLN">PLN (Polish Zloty)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="gap-2" disabled={updateSettings.isPending}>
            <Save className="h-4 w-4" />
            {t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
}
