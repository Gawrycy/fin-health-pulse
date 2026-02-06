import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requirePortalStaff?: boolean;
  requireOrganization?: boolean;
}

export default function ProtectedRoute({
  children,
  requirePortalStaff = false,
  requireOrganization = false,
}: ProtectedRouteProps) {
  const { user, loading, roles } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requirePortalStaff && !roles.isPortalStaff) {
    return <Navigate to="/auth" replace />;
  }

  if (requireOrganization && !roles.organizationId) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
