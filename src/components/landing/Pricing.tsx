import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    subtitle: "Basic",
    price: "0",
    description: "Idealne na start. Podstawowa analiza Twojej firmy.",
    features: [
      "1 upload JPK miesięcznie",
      "Podstawowe 4 KPI",
      "Porównanie z branżą",
      "Dostęp do dashboardu",
    ],
    cta: "Zacznij za darmo",
    highlighted: false,
  },
  {
    name: "Starter",
    subtitle: "Automated Insights",
    price: "199",
    description: "Dla firm chcących automatyzacji i głębszej analizy.",
    features: [
      "Nielimitowane uploady",
      "Wszystkie KPI + trendy",
      "AI Recommendations",
      "Eksport raportów PDF",
      "Alerty email",
    ],
    cta: "Wybierz Starter",
    highlighted: true,
  },
  {
    name: "Pro",
    subtitle: "TDABC & Consulting",
    price: "499",
    description: "Pełne wsparcie z analizą kosztów i konsultacjami.",
    features: [
      "Wszystko ze Starter",
      "Analiza TDABC",
      "2h konsultacji miesięcznie",
      "Dedykowany opiekun",
      "Integracja API",
      "White-label raporty",
    ],
    cta: "Wybierz Pro",
    highlighted: false,
  },
];

export function Pricing() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Prosty, przejrzysty cennik
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Wybierz plan dopasowany do Twoich potrzeb. Bez ukrytych opłat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "relative rounded-2xl p-8 transition-all duration-300",
                plan.highlighted
                  ? "bg-primary text-primary-foreground scale-105 shadow-xl"
                  : "bg-card border shadow-sm hover:shadow-md"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Najpopularniejszy
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="text-sm font-medium opacity-70 mb-1">{plan.subtitle}</div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="opacity-70">PLN/msc</span>
                </div>
              </div>

              <p className={cn(
                "text-sm mb-6",
                plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3 text-sm">
                    <Check className={cn(
                      "h-4 w-4 shrink-0",
                      plan.highlighted ? "text-emerald-300" : "text-emerald-500"
                    )} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => navigate("/auth")}
                className={cn(
                  "w-full",
                  plan.highlighted
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
