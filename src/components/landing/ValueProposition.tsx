import { FileText, BarChart2, Brain, Users } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Import danych JPK",
    description: "Automatyczne przetwarzanie plików JPK_KR. Wyciągamy kluczowe wskaźniki bez ręcznej pracy.",
  },
  {
    icon: BarChart2,
    title: "Benchmarking branżowy",
    description: "Porównaj swoją firmę do tysięcy innych w tej samej branży. Produkcja, IT, e-commerce.",
  },
  {
    icon: Brain,
    title: "AI Recommendations",
    description: "Algorytmy AI identyfikują anomalie i sugerują konkretne działania optymalizacyjne.",
  },
  {
    icon: Users,
    title: "Konsultacje z ekspertami",
    description: "Potrzebujesz ludzkiego wsparcia? Umów się na rozmowę z certyfikowanym kontrolerem.",
  },
];

export function ValueProposition() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Jak to działa?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Od surowych danych do actionable insights w 3 prostych krokach
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Step number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              <div className="rounded-lg bg-primary/5 p-3 w-fit mb-4 group-hover:bg-emerald-500/10 transition-colors">
                <feature.icon className="h-6 w-6 text-primary group-hover:text-emerald-500 transition-colors" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Profit leakage calculator preview */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Kalkulator "Profit Leakage"
              </h3>
              <p className="text-white/70 mb-8 max-w-xl">
                Sprawdź, ile pieniędzy możesz odzyskać optymalizując procesy. 
                Wprowadź swoje dane, a pokażemy potencjalne oszczędności.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-lg p-4">
                  <label className="text-sm text-white/60 block mb-2">Roczne przychody</label>
                  <div className="text-2xl font-bold">5 000 000 PLN</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <label className="text-sm text-white/60 block mb-2">Aktualna marża</label>
                  <div className="text-2xl font-bold">18.5%</div>
                </div>
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
                  <label className="text-sm text-emerald-300 block mb-2">Potencjalne oszczędności</label>
                  <div className="text-2xl font-bold text-emerald-400">+200 000 PLN</div>
                </div>
              </div>

              <p className="text-sm text-white/50">
                * Szacunek oparty na średnich wynikach optymalizacji w branży produkcyjnej
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
