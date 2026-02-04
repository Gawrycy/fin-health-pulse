import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BarChart3, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortalStaff, setIsPortalStaff] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('portal_staff')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .maybeSingle();
        setIsPortalStaff(!!data);
      } else {
        setIsPortalStaff(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('portal_staff')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .maybeSingle();
        setIsPortalStaff(!!data);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-white/10">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-500/20 p-1.5">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-lg font-bold text-white">SmartController AI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-sm text-white/70 hover:text-white transition-colors">
              {t('nav.home')}
            </Link>
            <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">
              {t('landing.pricing.title')}
            </a>
            
            <LanguageSwitcher />
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                {isPortalStaff && (
                  <Link to="/admin">
                    <Button variant="ghost" className="text-white hover:bg-white/10 gap-1">
                      <Shield className="h-4 w-4" />
                      {t('nav.admin')}
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  {t('common.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    {t('auth.signIn')}
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    {t('auth.signUp')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-white/70 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <a
                href="#pricing"
                className="text-white/70 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('landing.pricing.title')}
              </a>
              <div className="py-2">
                <LanguageSwitcher />
              </div>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white/70 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  {isPortalStaff && (
                    <Link
                      to="/admin"
                      className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4" />
                      {t('nav.admin')}
                    </Link>
                  )}
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 w-fit"
                  >
                    {t('common.logout')}
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    {t('auth.signIn')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
