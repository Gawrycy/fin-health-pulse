import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ClientLayout } from '@/components/client/ClientLayout';
import { ClientDashboard } from '@/components/client/ClientDashboard';
import { TeamManagement } from '@/components/client/TeamManagement';
import { ClientInvoices } from '@/components/client/ClientInvoices';
import { ClientSubscription } from '@/components/client/ClientSubscription';
import { OrganizationSettings } from '@/components/client/OrganizationSettings';
import { ClientAnalytics } from '@/components/client/ClientAnalytics';
import { ClientReports } from '@/components/client/ClientReports';

export default function Client() {
  const { user, loading, roles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!roles.organizationId && !roles.isPortalStaff) {
        // User is not part of any organization
        navigate('/');
      }
    }
  }, [user, loading, roles, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || (!roles.organizationId && !roles.isPortalStaff)) {
    return null;
  }

  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<ClientDashboard />} />
        <Route path="/analytics" element={<ClientAnalytics />} />
        <Route path="/reports" element={<ClientReports />} />
        <Route path="/team" element={<TeamManagement />} />
        <Route path="/invoices" element={<ClientInvoices />} />
        <Route path="/subscription" element={<ClientSubscription />} />
        <Route path="/settings" element={<OrganizationSettings />} />
      </Routes>
    </ClientLayout>
  );
}
