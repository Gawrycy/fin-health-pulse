import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PlansManagement } from '@/components/admin/PlansManagement';
import { StaffManagement } from '@/components/admin/StaffManagement';
import { PortalSettings } from '@/components/admin/PortalSettings';
import { OrganizationsManagement } from '@/components/admin/OrganizationsManagement';
import { InvoicesManagement } from '@/components/admin/InvoicesManagement';
import { FeaturesManagement } from '@/components/admin/FeaturesManagement';

export default function Admin() {
  const { user, loading, roles } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // For now, show the admin portal to any authenticated user
  // In production, you'd check: if (!roles.isPortalStaff) { return <Navigate to="/dashboard" replace />; }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="organizations" element={<OrganizationsManagement />} />
        <Route path="plans" element={<PlansManagement />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="invoices" element={<InvoicesManagement />} />
        <Route path="features" element={<FeaturesManagement />} />
        <Route path="settings" element={<PortalSettings />} />
      </Routes>
    </AdminLayout>
  );
}
