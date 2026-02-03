import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: LucideIcon;
  status?: "positive" | "negative" | "neutral";
  children?: React.ReactNode;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  status = "neutral",
  children,
}: KPICardProps) {
  return (
    <div
      className={cn(
        "kpi-card",
        status === "positive" && "kpi-positive",
        status === "negative" && "kpi-negative",
        status === "neutral" && "kpi-neutral"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {subtitle && (
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            )}
          </div>
        </div>
        
        <div className={cn(
          "rounded-lg p-2",
          status === "positive" && "bg-emerald-500/10 text-emerald-500",
          status === "negative" && "bg-coral-500/10 text-coral-500",
          status === "neutral" && "bg-amber-500/10 text-amber-500"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {/* Trend indicator */}
      {trend && trendValue && (
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          trend === "up" && "text-emerald-500",
          trend === "down" && "text-coral-500",
          trend === "neutral" && "text-amber-500"
        )}>
          {trend === "up" && "↑"}
          {trend === "down" && "↓"}
          {trend === "neutral" && "→"}
          <span>{trendValue}</span>
        </div>
      )}
      
      {/* Optional custom content (charts, gauges, etc.) */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
