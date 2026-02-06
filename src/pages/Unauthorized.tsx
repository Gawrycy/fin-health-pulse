import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-destructive/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 text-center max-w-md">
        <div className="inline-flex items-center justify-center rounded-full bg-destructive/15 p-4 mb-6">
          <ShieldX className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Brak dostępu</h1>
        <p className="text-muted-foreground mb-8">
          Nie masz uprawnień do wyświetlenia tej strony. Skontaktuj się z administratorem, jeśli uważasz, że to błąd.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Wróć
          </Button>
          <Button onClick={handleSignOut} variant="destructive">
            Zaloguj na inne konto
          </Button>
        </div>
      </div>
    </div>
  );
}
