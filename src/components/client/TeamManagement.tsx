import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Plus, MoreHorizontal, Mail, Shield } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Database } from '@/integrations/supabase/types';

type OrganizationRole = Database['public']['Enums']['organization_role'];

const roleColors: Record<OrganizationRole, string> = {
  org_admin: 'bg-purple-500/10 text-purple-700 border-purple-200',
  cfo: 'bg-blue-500/10 text-blue-700 border-blue-200',
  manager: 'bg-green-500/10 text-green-700 border-green-200',
  viewer: 'bg-gray-500/10 text-gray-700 border-gray-200',
};

export function TeamManagement() {
  const { t } = useTranslation();
  const { roles: userRoles } = useAuth();
  const { members, addMember, updateMember, removeMember, loading } = useClientData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  
  // Form state
  const [newMember, setNewMember] = useState({
    email: '',
    full_name: '',
    role: 'viewer' as OrganizationRole,
    user_id: '', // Would need to be set when user accepts invite
  });

  const handleAddMember = async () => {
    // In a real app, this would send an invite and create the member when accepted
    // For now, we'll just create the member with a placeholder user_id
    await addMember.mutateAsync({
      ...newMember,
      user_id: crypto.randomUUID(), // Placeholder - should be actual user ID
    });
    setNewMember({ email: '', full_name: '', role: 'viewer', user_id: '' });
    setIsAddOpen(false);
  };

  const handleUpdateRole = async (memberId: string, role: OrganizationRole) => {
    await updateMember.mutateAsync({ id: memberId, role });
    setEditingMember(null);
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMember.mutateAsync(memberId);
  };

  const activeMembers = members.filter(m => m.is_active);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            {t('client.members.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('client.members.subtitle')}
          </p>
        </div>
        
        {userRoles.isOrgAdmin && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('client.members.addMember')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('client.members.addMember')}</DialogTitle>
                <DialogDescription>
                  {t('client.members.addDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('common.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="member@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">{t('client.members.fullName')}</Label>
                  <Input
                    id="name"
                    value={newMember.full_name}
                    onChange={(e) => setNewMember({ ...newMember, full_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t('common.role')}</Label>
                  <Select
                    value={newMember.role}
                    onValueChange={(value: OrganizationRole) => 
                      setNewMember({ ...newMember, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org_admin">{t('client.members.roles.org_admin')}</SelectItem>
                      <SelectItem value="cfo">{t('client.members.roles.cfo')}</SelectItem>
                      <SelectItem value="manager">{t('client.members.roles.manager')}</SelectItem>
                      <SelectItem value="viewer">{t('client.members.roles.viewer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleAddMember} disabled={!newMember.email}>
                  {t('common.add')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('client.members.teamList')}</CardTitle>
          <CardDescription>
            {t('client.members.teamCount', { count: activeMembers.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('client.members.fullName')}</TableHead>
                <TableHead>{t('common.email')}</TableHead>
                <TableHead>{t('common.role')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                {userRoles.isOrgAdmin && <TableHead className="w-[100px]">{t('common.actions')}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {t('client.members.noMembers')}
                  </TableCell>
                </TableRow>
              ) : (
                activeMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {member.full_name?.charAt(0)?.toUpperCase() || member.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{member.full_name || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        {member.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingMember === member.id && userRoles.isOrgAdmin ? (
                        <Select
                          value={member.role}
                          onValueChange={(value: OrganizationRole) => handleUpdateRole(member.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="org_admin">{t('client.members.roles.org_admin')}</SelectItem>
                            <SelectItem value="cfo">{t('client.members.roles.cfo')}</SelectItem>
                            <SelectItem value="manager">{t('client.members.roles.manager')}</SelectItem>
                            <SelectItem value="viewer">{t('client.members.roles.viewer')}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline" className={roleColors[member.role]}>
                          <Shield className="h-3 w-3 mr-1" />
                          {t(`client.members.roles.${member.role}`)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.is_active ? 'default' : 'secondary'}>
                        {member.is_active ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </TableCell>
                    {userRoles.isOrgAdmin && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingMember(member.id)}>
                              {t('client.members.changeRole')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              {t('client.members.remove')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
