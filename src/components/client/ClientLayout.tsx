import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  FileText,
  BarChart3,
  TrendingUp,
  Menu,
  X,
  ChevronRight,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { useClientData } from '@/hooks/useClientData';
import { Badge } from '@/components/ui/badge';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/client', featureCode: null },
  { key: 'analytics', icon: BarChart3, path: '/client/analytics', featureCode: 'analytics' },
  { key: 'reports', icon: TrendingUp, path: '/client/reports', featureCode: 'reports' },
  { key: 'team', icon: Users, path: '/client/team', featureCode: null },
  { key: 'invoices', icon: FileText, path: '/client/invoices', featureCode: null },
  { key: 'subscription', icon: CreditCard, path: '/client/subscription', featureCode: null },
  { key: 'orgSettings', icon: Settings, path: '/client/settings', featureCode: null },
];

export function ClientLayout({ children }: ClientLayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, signOut, roles } = useAuth();
  const { organization } = useClientData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/client" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SC</span>
              </div>
              <span className="font-semibold text-lg hidden sm:inline">
                SmartController AI
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {organization && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{organization.name}</span>
              </div>
            )}
            <LanguageSwitcher />
            <span className="text-sm text-muted-foreground hidden md:inline">
              {user?.email}
            </span>
            {roles.isOrgAdmin && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {t('client.members.roles.org_admin')}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={signOut}>
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 mt-16 w-64 transform bg-card border-r transition-transform duration-200 lg:translate-x-0 lg:static lg:mt-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="flex flex-col gap-1 p-4 pt-6">
            <div className="mb-4 px-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('client.title')}
              </h2>
            </div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/client' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {t(`client.nav.${item.key}`)}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
