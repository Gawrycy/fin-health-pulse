import { ArrowRight, TrendingUp, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px"
          }}
        />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-white/80 mb-8 animate-fade-in">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span>Powered by AI & JPK Data Analysis</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
            Stop guessing.{" "}
            <span className="hero-text-gradient">See where your profit leaks.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Compare your company to thousands of competitors using AI & JPK data. 
            Identify inefficiencies in minutes, not months.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button
              onClick={() => navigate("/auth")}
              className="btn-hero group"
            >
              Rozpocznij za darmo
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="px-8 py-4 text-lg bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              Zobacz demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {[
              { value: "500+", label: "Firm w systemie" },
              { value: "3", label: "Branże" },
              { value: "<5min", label: "Do pierwszego raportu" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating cards preview */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-5xl px-4 hidden lg:block">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, title: "Marża brutto", value: "+5.2%", color: "emerald" },
              { icon: BarChart3, title: "Efektywność", value: "4.8x", color: "emerald" },
              { icon: Zap, title: "Cykl gotówki", value: "-12 dni", color: "emerald" },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 shadow-xl border animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2">
                    <card.icon className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
                </div>
                <div className="text-2xl font-bold text-emerald-500">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
