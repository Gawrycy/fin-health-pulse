import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

type PortalRole = 'portal_admin' | 'support' | 'billing_specialist';
type OrganizationRole = 'org_admin' | 'cfo' | 'manager' | 'viewer';

interface UserRole {
  isPortalStaff: boolean;
  isPortalAdmin: boolean;
  portalRole: PortalRole | null;
  organizationId: string | null;
  organizationRole: OrganizationRole | null;
  isOrgAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  roles: UserRole;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
}

const defaultRoles: UserRole = {
  isPortalStaff: false,
  isPortalAdmin: false,
  portalRole: null,
  organizationId: null,
  organizationRole: null,
  isOrgAdmin: false,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  roles: defaultRoles,
  signOut: async () => {},
  refreshRoles: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<UserRole>(defaultRoles);

  const fetchRoles = async (userId: string) => {
    try {
      console.log("fetchRoles called for:", userId);
      // Check portal staff role
      const { data: staffData, error: staffError } = await supabase
        .from('portal_staff')
        .select('role, is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      console.log("staffData:", staffData, "staffError:", staffError);

      // Check organization membership
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id, role, is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      console.log("memberData:", memberData, "memberError:", memberError);

      setRoles({
        isPortalStaff: !!staffData,
        isPortalAdmin: staffData?.role === 'portal_admin',
        portalRole: staffData?.role as PortalRole | null,
        organizationId: memberData?.organization_id || null,
        organizationRole: memberData?.role as OrganizationRole | null,
        isOrgAdmin: memberData?.role === 'org_admin',
      });
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setRoles(defaultRoles);
    }
  };

  const refreshRoles = async () => {
    if (user) {
      await fetchRoles(user.id);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRoles(defaultRoles);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRoles(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchRoles(session.user.id);
        } else {
          setRoles(defaultRoles);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, roles, signOut, refreshRoles }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
