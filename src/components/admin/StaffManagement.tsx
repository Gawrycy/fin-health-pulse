import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePortalStaff } from '@/hooks/useAdminData';

const roleColors: Record<string, string> = {
  portal_admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  support: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  billing_specialist: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
};

export function StaffManagement() {
  const { t, i18n } = useTranslation();
  const { data: staff, isLoading } = usePortalStaff();

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('admin.staff.title')}</h1>
          <p className="text-muted-foreground">Manage portal employees and their access</p>
        </div>
      </div>

      {staff && staff.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <Card key={member.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">{member.full_name || 'Unnamed'}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                {!member.is_active && <Badge variant="destructive">Inactive</Badge>}
              </CardHeader>
              <CardContent>
                <Badge className={roleColors[member.role] || ''} variant="outline">
                  {t(`admin.staff.roles.${member.role}`)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('common.created')}: {new Date(member.created_at).toLocaleDateString(i18n.language)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No staff members yet</p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Staff members are added when users register and are assigned portal roles. 
              The first admin should be created manually in the database.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
