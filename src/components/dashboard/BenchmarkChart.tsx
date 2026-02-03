import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ParsedMetrics, Benchmark } from "@/lib/mockParser";

interface BenchmarkChartProps {
  metrics: ParsedMetrics;
  benchmark: Benchmark;
}

export function BenchmarkChart({ metrics, benchmark }: BenchmarkChartProps) {
  const data = [
    {
      name: "Marża brutto",
      "Twoja firma": metrics.grossMargin,
      "Średnia branżowa": benchmark.avgMargin,
      "Best in class": benchmark.avgMargin * 1.25,
      unit: "%",
    },
    {
      name: "Obciążenie admin.",
      "Twoja firma": metrics.adminBurden,
      "Średnia branżowa": benchmark.avgAdminBurden,
      "Best in class": benchmark.avgAdminBurden * 0.75,
      unit: "%",
      inverted: true,
    },
    {
      name: "Efektywność",
      "Twoja firma": metrics.efficiency,
      "Średnia branżowa": benchmark.avgEfficiency,
      "Best in class": benchmark.avgEfficiency * 1.3,
      unit: "x",
    },
    {
      name: "Cykl gotówki",
      "Twoja firma": metrics.cashCycle,
      "Średnia branżowa": benchmark.avgCashCycle,
      "Best in class": benchmark.avgCashCycle * 0.7,
      unit: " dni",
      inverted: true,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = data.find(d => d.name === label);
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-foreground">
                {entry.value.toFixed(1)}{item?.unit}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => (
              <span className="text-sm text-foreground">{value}</span>
            )}
          />
          <Bar
            dataKey="Twoja firma"
            fill="hsl(var(--emerald-500))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Średnia branżowa"
            fill="hsl(var(--navy-600))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Best in class"
            fill="hsl(var(--navy-800))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
