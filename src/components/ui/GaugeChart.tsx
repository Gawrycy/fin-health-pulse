import { cn } from "@/lib/utils";

interface GaugeChartProps {
  value: number;
  max: number;
  benchmark: number;
  label: string;
  unit?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean; // For metrics where lower is better (like admin burden)
}

export function GaugeChart({
  value,
  max,
  benchmark,
  label,
  unit = "%",
  size = "md",
  inverted = false,
}: GaugeChartProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const benchmarkPercentage = Math.min((benchmark / max) * 100, 100);
  
  // Determine status based on comparison to benchmark
  const diff = value - benchmark;
  const isGood = inverted ? diff <= 0 : diff >= 0;
  const isNeutral = Math.abs(diff) < (benchmark * 0.1);
  
  const status = isNeutral ? "neutral" : isGood ? "positive" : "negative";
  
  const sizes = {
    sm: { width: 100, stroke: 8, radius: 40 },
    md: { width: 140, stroke: 10, radius: 55 },
    lg: { width: 180, stroke: 12, radius: 70 },
  };
  
  const { width, stroke, radius } = sizes[size];
  const circumference = radius * Math.PI; // Half circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const benchmarkOffset = circumference - (benchmarkPercentage / 100) * circumference;
  
  const center = width / 2;
  const viewBox = `0 0 ${width} ${width / 2 + 20}`;
  
  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={width / 2 + 20} viewBox={viewBox} className="overflow-visible">
        {/* Background track */}
        <path
          d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
          className="gauge-track"
          strokeWidth={stroke}
        />
        
        {/* Benchmark marker */}
        <path
          d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
          fill="none"
          stroke="hsl(var(--navy-500))"
          strokeWidth={2}
          strokeDasharray={`1 ${circumference - 1}`}
          strokeDashoffset={-benchmarkOffset}
          opacity={0.6}
        />
        
        {/* Value fill */}
        <path
          d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
          className={cn(
            "gauge-fill",
            status === "positive" && "gauge-positive",
            status === "negative" && "gauge-negative",
            status === "neutral" && "gauge-neutral"
          )}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transformOrigin: `${center}px ${center}px`,
          }}
        />
        
        {/* Center value display */}
        <text
          x={center}
          y={center - 5}
          textAnchor="middle"
          className="fill-foreground text-2xl font-bold"
          style={{ fontSize: size === "lg" ? "28px" : size === "md" ? "22px" : "18px" }}
        >
          {value.toFixed(1)}{unit}
        </text>
        
        {/* Label */}
        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
          style={{ fontSize: size === "lg" ? "12px" : "10px" }}
        >
          vs {benchmark.toFixed(1)}{unit} avg
        </text>
      </svg>
      
      <span className="mt-2 text-sm font-medium text-muted-foreground">{label}</span>
      
      {/* Status indicator */}
      <div className={cn(
        "mt-1 flex items-center gap-1 text-xs font-medium",
        status === "positive" && "text-emerald-500",
        status === "negative" && "text-coral-500",
        status === "neutral" && "text-amber-500"
      )}>
        {status === "positive" && "↑"}
        {status === "negative" && "↓"}
        {status === "neutral" && "→"}
        {Math.abs(diff).toFixed(1)}{unit} {inverted ? (diff > 0 ? "powyżej" : "poniżej") : (diff > 0 ? "powyżej" : "poniżej")} avg
      </div>
    </div>
  );
}
