import { AlertTriangle, CheckCircle, Info, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AIRecommendation } from "@/lib/mockParser";

interface AIInsightsPanelProps {
  recommendations: AIRecommendation[];
  onBookConsulting?: () => void;
}

export function AIInsightsPanel({ recommendations, onBookConsulting }: AIInsightsPanelProps) {
  const getIcon = (type: AIRecommendation["type"]) => {
    switch (type) {
      case "warning":
        return AlertTriangle;
      case "success":
        return CheckCircle;
      case "info":
        return Info;
    }
  };

  const getIconStyles = (type: AIRecommendation["type"]) => {
    switch (type) {
      case "warning":
        return "text-amber-400";
      case "success":
        return "text-emerald-400";
      case "info":
        return "text-blue-400";
    }
  };

  return (
    <div className="insight-panel">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-emerald-500/20 p-2">
          <Sparkles className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Agent AI Recommendations</h3>
          <p className="text-sm text-white/60">Automatyczna analiza Twoich danych finansowych</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const Icon = getIcon(rec.type);
          return (
            <div
              key={index}
              className={cn(
                "rounded-lg p-4 transition-all duration-300 hover:translate-x-1",
                rec.type === "warning" && "bg-amber-500/10 border border-amber-500/20",
                rec.type === "success" && "bg-emerald-500/10 border border-emerald-500/20",
                rec.type === "info" && "bg-blue-500/10 border border-blue-500/20"
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", getIconStyles(rec.type))} />
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{rec.title}</h4>
                  <p className="text-sm text-white/70 leading-relaxed">{rec.description}</p>
                  {rec.difference !== 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        rec.type === "warning" && "bg-amber-500/20 text-amber-300",
                        rec.type === "success" && "bg-emerald-500/20 text-emerald-300"
                      )}>
                        {rec.difference > 0 ? "+" : ""}{rec.difference.toFixed(1)} vs avg
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consulting CTA */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Potrzebujesz ludzkiej ekspertyzy?</p>
            <p className="text-xs text-white/60">Umów konsultację z certyfikowanym kontrolerem</p>
          </div>
          <Button
            onClick={onBookConsulting}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Zarezerwuj <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
