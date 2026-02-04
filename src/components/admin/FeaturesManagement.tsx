import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Puzzle, Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  useFeatureModules, 
  useCreateFeatureModule, 
  useUpdateFeatureModule, 
  useDeleteFeatureModule 
} from '@/hooks/useAdminData';

interface ModuleFormData {
  name: string;
  name_pl: string;
  code: string;
  description: string;
  description_pl: string;
  is_active: boolean;
}

const defaultFormData: ModuleFormData = {
  name: '',
  name_pl: '',
  code: '',
  description: '',
  description_pl: '',
  is_active: true,
};

export function FeaturesManagement() {
  const { t, i18n } = useTranslation();
  const { data: modules, isLoading } = useFeatureModules();
  const createModule = useCreateFeatureModule();
  const updateModule = useUpdateFeatureModule();
  const deleteModule = useDeleteFeatureModule();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [formData, setFormData] = useState<ModuleFormData>(defaultFormData);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate code from name if not provided
    const code = formData.code || formData.name.toLowerCase().replace(/\s+/g, '_');
    
    if (editingModule) {
      await updateModule.mutateAsync({ id: editingModule, ...formData, code });
    } else {
      await createModule.mutateAsync({ ...formData, code });
    }
    
    setIsDialogOpen(false);
    setEditingModule(null);
    setFormData(defaultFormData);
  };

  const handleEdit = (module: any) => {
    setEditingModule(module.id);
    setFormData({
      name: module.name,
      name_pl: module.name_pl,
      code: module.code,
      description: module.description || '',
      description_pl: module.description_pl || '',
      is_active: module.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (module: any) => {
    await updateModule.mutateAsync({ id: module.id, is_active: !module.is_active });
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteModule.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('nav.features')}</h1>
          <p className="text-muted-foreground">{t('admin.features.subtitle')}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingModule(null);
            setFormData(defaultFormData);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('admin.features.addModule')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingModule ? t('admin.features.editModule') : t('admin.features.addModule')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('admin.features.moduleName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dashboard Analytics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_pl">{t('admin.features.moduleNamePl')}</Label>
                  <Input
                    id="name_pl"
                    value={formData.name_pl}
                    onChange={(e) => setFormData({ ...formData, name_pl: e.target.value })}
                    placeholder="Analityka Dashboard"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">{t('admin.features.moduleCode')}</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="dashboard_analytics"
                  disabled={!!editingModule}
                />
                <p className="text-xs text-muted-foreground">{t('admin.features.codeHint')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('admin.features.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Access to advanced dashboard analytics..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_pl">{t('admin.features.descriptionPl')}</Label>
                <Textarea
                  id="description_pl"
                  value={formData.description_pl}
                  onChange={(e) => setFormData({ ...formData, description_pl: e.target.value })}
                  placeholder="Dostęp do zaawansowanej analityki..."
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">{t('admin.features.activeByDefault')}</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={createModule.isPending || updateModule.isPending}>
                  {t('common.save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {modules && modules.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.id} className={!module.is_active ? 'opacity-60' : ''}>
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
                <p className="text-sm text-muted-foreground min-h-[40px]">
                  {i18n.language === 'pl' ? module.description_pl : module.description}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={module.is_active ?? true} 
                      onCheckedChange={() => handleToggleActive(module)}
                    />
                    <Badge variant={module.is_active ? 'default' : 'secondary'}>
                      {module.is_active ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(module)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(module.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Puzzle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">{t('admin.features.noModules')}</p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('admin.features.addFirst')}
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.features.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.features.deleteConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
