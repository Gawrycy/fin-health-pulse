import { BarChart3 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-emerald-500/20 p-2">
                <BarChart3 className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-xl font-bold">SmartController AI</span>
            </div>
            <p className="text-primary-foreground/70 max-w-sm">
              Inteligentna analiza finansowa dla polskich przedsiębiorstw. 
              Wykorzystaj moc AI i danych JPK.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produkt</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Funkcje</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Cennik</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Integracje</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Firma</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">O nas</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Kariera</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Kontakt</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © 2024 SmartController AI. Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <a href="#" className="hover:text-emerald-400 transition-colors">Polityka prywatności</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Regulamin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
