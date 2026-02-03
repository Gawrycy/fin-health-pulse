import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Percent, 
  Users, 
  Clock, 
  Building2,
  Calendar,
  LogOut,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KPICard } from "@/components/dashboard/KPICard";
import { GaugeChart } from "@/components/ui/GaugeChart";
import { FileUploadZone } from "@/components/dashboard/FileUploadZone";
import { BenchmarkChart } from "@/components/dashboard/BenchmarkChart";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import {
  simulateJPKParsing,
  calculateMetrics,
  generateAIRecommendations,
  formatCurrency,
  formatPercent,
  type IndustryType,
  type FinancialReport,
  type ParsedMetrics,
  type Benchmark,
  type AIRecommendation,
} from "@/lib/mockParser";
import type { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [showConsultingModal, setShowConsultingModal] = useState(false);

  // Financial data state
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [metrics, setMetrics] = useState<ParsedMetrics | null>(null);
  const [benchmark, setBenchmark] = useState<Benchmark | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>("manufacturing");

  // Auth check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setIsLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setIsLoading(false);
        loadExistingData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load existing financial reports
  const loadExistingData = async (userId: string) => {
    try {
      const { data: reports } = await supabase
        .from("financial_reports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (reports && reports.length > 0) {
        const latestReport = reports[0];
        const financialReport: FinancialReport = {
          period: latestReport.period,
          revenue: Number(latestReport.revenue),
          grossProfit: Number(latestReport.gross_profit),
          adminCosts: Number(latestReport.admin_costs),
          payrollCosts: Number(latestReport.payroll_costs),
          inventoryValue: Number(latestReport.inventory_value),
          accountsReceivable: Number(latestReport.accounts_receivable),
          accountsPayable: Number(latestReport.accounts_payable),
        };

        setReport(financialReport);
        const calculatedMetrics = calculateMetrics(financialReport);
        setMetrics(calculatedMetrics);
        setHasData(true);

        // Load benchmark for manufacturing (default)
        await loadBenchmark("manufacturing", calculatedMetrics);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Load benchmark data
  const loadBenchmark = async (industry: IndustryType, currentMetrics: ParsedMetrics) => {
    try {
      const { data: benchmarks } = await supabase
        .from("industry_benchmarks")
        .select("*")
        .eq("industry_type", industry)
        .single();

      if (benchmarks) {
        const benchmarkData: Benchmark = {
          industryType: benchmarks.industry_type,
          industryName: benchmarks.industry_name,
          avgMargin: Number(benchmarks.avg_margin),
          avgAdminBurden: Number(benchmarks.avg_admin_burden),
          avgEfficiency: Number(benchmarks.avg_efficiency),
          avgCashCycle: benchmarks.avg_cash_cycle,
        };

        setBenchmark(benchmarkData);

        // Generate AI recommendations
        const recs = generateAIRecommendations(currentMetrics, benchmarkData);
        setRecommendations(recs);
      }
    } catch (error) {
      console.error("Error loading benchmark:", error);
    }
  };

  // Handle file upload (simulated parsing)
  const handleUpload = useCallback(async (industry: IndustryType) => {
    if (!user) return;

    setSelectedIndustry(industry);

    // Simulate parsing and generate mock data
    const mockReport = simulateJPKParsing(industry);
    const calculatedMetrics = calculateMetrics(mockReport);

    // Save to database
    try {
      const { error } = await supabase.from("financial_reports").insert({
        user_id: user.id,
        period: mockReport.period,
        revenue: mockReport.revenue,
        gross_profit: mockReport.grossProfit,
        admin_costs: mockReport.adminCosts,
        payroll_costs: mockReport.payrollCosts,
        inventory_value: mockReport.inventoryValue,
        accounts_receivable: mockReport.accountsReceivable,
        accounts_payable: mockReport.accountsPayable,
      });

      if (error) throw error;

      setReport(mockReport);
      setMetrics(calculatedMetrics);
      setHasData(true);

      // Load appropriate benchmark
      await loadBenchmark(industry, calculatedMetrics);

      toast({
        title: "Dane przetworzone!",
        description: "Twój raport finansowy został przeanalizowany.",
      });
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const getMetricStatus = (
    value: number,
    benchmarkValue: number,
    inverted: boolean = false
  ): "positive" | "negative" | "neutral" => {
    const diff = value - benchmarkValue;
    const threshold = benchmarkValue * 0.1;

    if (Math.abs(diff) < threshold) return "neutral";
    if (inverted) return diff < 0 ? "positive" : "negative";
    return diff > 0 ? "positive" : "negative";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <BarChart3 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">SmartController AI</h1>
              <p className="text-xs text-muted-foreground">Financial Health Check</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Plan: Free</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Upload Section */}
        {!hasData && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <FileUploadZone onUpload={handleUpload} />
            </CardContent>
          </Card>
        )}

        {/* Dashboard Content */}
        {hasData && metrics && benchmark && report && (
          <>
            {/* Summary bar */}
            <div className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-xl bg-card border">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Branża:</span>
                <span className="text-sm font-medium">{benchmark.industryName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Okres:</span>
                <span className="text-sm font-medium">{report.period}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Przychód:</span>
                <span className="text-sm font-medium">{formatCurrency(report.revenue)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setHasData(false);
                  setReport(null);
                  setMetrics(null);
                }}
              >
                Wgraj nowy plik
              </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="Marża brutto"
                value={formatPercent(metrics.grossMargin)}
                subtitle="vs industry"
                icon={TrendingUp}
                status={getMetricStatus(metrics.grossMargin, benchmark.avgMargin)}
                trend={metrics.grossMargin > benchmark.avgMargin ? "up" : "down"}
                trendValue={`${Math.abs(metrics.grossMargin - benchmark.avgMargin).toFixed(1)}% vs avg`}
              >
                <GaugeChart
                  value={metrics.grossMargin}
                  max={50}
                  benchmark={benchmark.avgMargin}
                  label=""
                  size="sm"
                />
              </KPICard>

              <KPICard
                title="Efektywność pracownika"
                value={`${metrics.efficiency.toFixed(1)}x`}
                subtitle="PLN/PLN"
                icon={Users}
                status={getMetricStatus(metrics.efficiency, benchmark.avgEfficiency)}
                trend={metrics.efficiency > benchmark.avgEfficiency ? "up" : "down"}
                trendValue={`${Math.abs(metrics.efficiency - benchmark.avgEfficiency).toFixed(1)}x vs avg`}
              >
                <GaugeChart
                  value={metrics.efficiency}
                  max={15}
                  benchmark={benchmark.avgEfficiency}
                  label=""
                  unit="x"
                  size="sm"
                />
              </KPICard>

              <KPICard
                title="Obciążenie admin."
                value={formatPercent(metrics.adminBurden)}
                subtitle="kosztów"
                icon={Percent}
                status={getMetricStatus(metrics.adminBurden, benchmark.avgAdminBurden, true)}
                trend={metrics.adminBurden < benchmark.avgAdminBurden ? "up" : "down"}
                trendValue={`${Math.abs(metrics.adminBurden - benchmark.avgAdminBurden).toFixed(1)}% vs avg`}
              >
                <GaugeChart
                  value={metrics.adminBurden}
                  max={30}
                  benchmark={benchmark.avgAdminBurden}
                  label=""
                  size="sm"
                  inverted
                />
              </KPICard>

              <KPICard
                title="Cykl konwersji gotówki"
                value={`${metrics.cashCycle}`}
                subtitle="dni"
                icon={Clock}
                status={getMetricStatus(metrics.cashCycle, benchmark.avgCashCycle, true)}
                trend={metrics.cashCycle < benchmark.avgCashCycle ? "up" : "down"}
                trendValue={`${Math.abs(metrics.cashCycle - benchmark.avgCashCycle)} dni vs avg`}
              >
                <GaugeChart
                  value={metrics.cashCycle}
                  max={100}
                  benchmark={benchmark.avgCashCycle}
                  label=""
                  unit=" dni"
                  size="sm"
                  inverted
                />
              </KPICard>
            </div>

            {/* Charts and Insights */}
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Benchmark Chart */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Porównanie z branżą</CardTitle>
                </CardHeader>
                <CardContent>
                  <BenchmarkChart metrics={metrics} benchmark={benchmark} />
                </CardContent>
              </Card>

              {/* AI Insights */}
              <div className="lg:col-span-2">
                <AIInsightsPanel
                  recommendations={recommendations}
                  onBookConsulting={() => setShowConsultingModal(true)}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Consulting Modal */}
      <Dialog open={showConsultingModal} onOpenChange={setShowConsultingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Zarezerwuj konsultację</DialogTitle>
            <DialogDescription>
              Umów się na rozmowę z certyfikowanym kontrolerem finansowym.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">1h konsultacji</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Szczegółowa analiza Twoich danych z rekomendacjami eksperta.
              </p>
              <p className="text-2xl font-bold text-emerald-500">299 PLN</p>
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
              Wybierz termin
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Dostępność: Pon-Pt, 9:00-17:00
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
