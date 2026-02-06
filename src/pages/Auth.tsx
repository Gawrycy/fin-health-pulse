import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Mail, ArrowRight, Loader2, AlertTriangle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";

const DEMO_ACCOUNTS = [
  { email: "andrzej.juchta@gmail.com", password: "testpassword1", label: "Admin", role: "Portal Administrator" },
  { email: "juchta.andrzej@zabka.pl", password: "testpassword2", label: "Client", role: "Client Administrator" },
];

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, roles } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    if (roles.isPortalStaff) {
      navigate("/admin");
    } else if (roles.organizationId) {
      navigate("/client");
    } else {
      navigate("/dashboard");
    }
  }, [user, loading, roles, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Błąd logowania", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { company_name: companyName },
        },
      });
      if (error) throw error;
      toast({ title: "Sprawdź swoją skrzynkę!", description: "Wysłaliśmy link potwierdzający na Twój adres email." });
    } catch (error: any) {
      toast({ title: "Błąd rejestracji", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast({ title: "Wprowadź email", description: "Podaj adres email, aby otrzymać magic link.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + "/dashboard" },
      });
      if (error) throw error;
      toast({ title: "Sprawdź email!", description: "Wysłaliśmy magic link na Twój adres." });
    } catch (error: any) {
      toast({ title: "Błąd", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/dashboard" },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Błąd", description: error.message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + "/auth",
      });
      if (error) throw error;
      toast({ title: "Email wysłany!", description: "Sprawdź skrzynkę, aby zresetować hasło." });
      setShowForgotPassword(false);
    } catch (error: any) {
      toast({ title: "Błąd", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Demo Mode Banner */}
        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200 text-sm">
            <strong>Tryb Demo</strong> — Użyj poniższych kont testowych do zalogowania.
            <div className="mt-3 space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => fillDemoCredentials(account)}
                  className="w-full flex items-center justify-between rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-left transition-colors hover:bg-amber-500/15"
                >
                  <div>
                    <span className="font-medium text-amber-300">{account.label}</span>
                    <span className="text-amber-200/70 text-xs ml-2">({account.role})</span>
                    <p className="text-xs text-amber-200/60 mt-0.5">{account.email}</p>
                  </div>
                  <KeyRound className="h-3.5 w-3.5 text-amber-400/70" />
                </button>
              ))}
            </div>
          </AlertDescription>
        </Alert>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="rounded-lg bg-emerald-500/20 p-2">
              <BarChart3 className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">SmartController AI</h1>
          <p className="text-white/60 mt-2">Zaloguj się, aby rozpocząć analizę</p>
        </div>

        {/* Auth card */}
        <div className="bg-card rounded-2xl p-8 shadow-xl border">
          {showForgotPassword ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Resetowanie hasła</h3>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="jan@firma.pl"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Wyślij link resetujący"}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setShowForgotPassword(false)}>
                  ← Powrót do logowania
                </Button>
              </form>
            </div>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Logowanie</TabsTrigger>
                <TabsTrigger value="register">Rejestracja</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input id="email-login" type="email" placeholder="jan@firma.pl" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Hasło</Label>
                    <Input id="password-login" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Zaloguj się <ArrowRight className="ml-2 h-4 w-4" /></>)}
                  </Button>
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="w-full text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                    Zapomniałeś hasła?
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">lub</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button type="button" variant="outline" className="w-full" onClick={handleMagicLink} disabled={isLoading}>
                    <Mail className="mr-2 h-4 w-4" />Magic Link
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Kontynuuj z Google
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Nazwa firmy</Label>
                    <Input id="company" type="text" placeholder="Moja Firma Sp. z o.o." value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input id="email-register" type="email" placeholder="jan@firma.pl" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Hasło</Label>
                    <Input id="password-register" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                    <p className="text-xs text-muted-foreground">Minimum 6 znaków</p>
                  </div>
                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Utwórz konto <ArrowRight className="ml-2 h-4 w-4" /></>)}
                  </Button>
                </form>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Rejestrując się, akceptujesz nasz{" "}
                  <a href="#" className="text-emerald-500 hover:underline">Regulamin</a>{" "}oraz{" "}
                  <a href="#" className="text-emerald-500 hover:underline">Politykę Prywatności</a>
                </p>
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Back link */}
        <p className="text-center mt-6">
          <a href="/" className="text-white/60 hover:text-white text-sm transition-colors">
            ← Powrót do strony głównej
          </a>
        </p>
      </div>
    </div>
  );
}
