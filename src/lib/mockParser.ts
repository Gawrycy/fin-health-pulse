// Mock JPK_KR Parser - generates realistic financial data based on industry type

export type IndustryType = 'manufacturing' | 'it_services' | 'ecommerce';

export interface FinancialReport {
  period: string;
  revenue: number;
  grossProfit: number;
  adminCosts: number;
  payrollCosts: number;
  inventoryValue: number;
  accountsReceivable: number;
  accountsPayable: number;
}

export interface ParsedMetrics {
  grossMargin: number;
  adminBurden: number;
  efficiency: number;
  cashCycle: number;
}

// Industry-specific ranges for realistic data generation
const industryRanges = {
  manufacturing: {
    revenueBase: 5000000, // 5M PLN
    revenueVariance: 2000000,
    marginRange: { min: 18, max: 28 },
    adminRange: { min: 8, max: 14 },
    efficiencyRange: { min: 3.5, max: 6.0 },
    cashCycleRange: { min: 50, max: 90 },
  },
  it_services: {
    revenueBase: 3000000,
    revenueVariance: 1500000,
    marginRange: { min: 30, max: 48 },
    adminRange: { min: 14, max: 24 },
    efficiencyRange: { min: 1.8, max: 3.2 },
    cashCycleRange: { min: 25, max: 50 },
  },
  ecommerce: {
    revenueBase: 8000000,
    revenueVariance: 4000000,
    marginRange: { min: 12, max: 25 },
    adminRange: { min: 9, max: 17 },
    efficiencyRange: { min: 7.0, max: 12.0 },
    cashCycleRange: { min: 15, max: 35 },
  },
};

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomVariance(base: number, variance: number): number {
  return base + (Math.random() - 0.5) * 2 * variance;
}

export function simulateJPKParsing(industry: IndustryType): FinancialReport {
  const ranges = industryRanges[industry];
  
  const revenue = Math.round(randomVariance(ranges.revenueBase, ranges.revenueVariance));
  const grossMarginPercent = randomInRange(ranges.marginRange.min, ranges.marginRange.max);
  const grossProfit = Math.round(revenue * (grossMarginPercent / 100));
  
  const adminBurdenPercent = randomInRange(ranges.adminRange.min, ranges.adminRange.max);
  const adminCosts = Math.round(revenue * (adminBurdenPercent / 100));
  
  const efficiency = randomInRange(ranges.efficiencyRange.min, ranges.efficiencyRange.max);
  const payrollCosts = Math.round(revenue / efficiency);
  
  // Calculate inventory and receivables based on cash cycle
  const cashCycle = Math.round(randomInRange(ranges.cashCycleRange.min, ranges.cashCycleRange.max));
  const dailyRevenue = revenue / 365;
  
  // Inventory days (component of cash cycle)
  const inventoryDays = cashCycle * 0.4;
  const inventoryValue = Math.round(dailyRevenue * inventoryDays * 0.7); // at cost
  
  // Receivables days
  const receivableDays = cashCycle * 0.5;
  const accountsReceivable = Math.round(dailyRevenue * receivableDays);
  
  // Payables days (reduces cash cycle)
  const payableDays = cashCycle * 0.3;
  const accountsPayable = Math.round(dailyRevenue * payableDays * 0.6);
  
  const currentDate = new Date();
  const period = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  return {
    period,
    revenue,
    grossProfit,
    adminCosts,
    payrollCosts,
    inventoryValue,
    accountsReceivable,
    accountsPayable,
  };
}

export function calculateMetrics(report: FinancialReport): ParsedMetrics {
  const grossMargin = (report.grossProfit / report.revenue) * 100;
  const adminBurden = (report.adminCosts / report.revenue) * 100;
  const efficiency = report.revenue / report.payrollCosts;
  
  // Simplified cash conversion cycle calculation
  const dailyRevenue = report.revenue / 365;
  const dailyCOGS = (report.revenue - report.grossProfit) / 365;
  
  const inventoryDays = report.inventoryValue / dailyCOGS;
  const receivableDays = report.accountsReceivable / dailyRevenue;
  const payableDays = report.accountsPayable / dailyCOGS;
  
  const cashCycle = Math.round(inventoryDays + receivableDays - payableDays);
  
  return {
    grossMargin: Math.round(grossMargin * 100) / 100,
    adminBurden: Math.round(adminBurden * 100) / 100,
    efficiency: Math.round(efficiency * 100) / 100,
    cashCycle: Math.max(0, cashCycle),
  };
}

export interface Benchmark {
  industryType: string;
  industryName: string;
  avgMargin: number;
  avgAdminBurden: number;
  avgEfficiency: number;
  avgCashCycle: number;
}

export interface AIRecommendation {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  metric: string;
  difference: number;
}

export function generateAIRecommendations(
  metrics: ParsedMetrics,
  benchmark: Benchmark
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  
  // Margin comparison
  const marginDiff = metrics.grossMargin - benchmark.avgMargin;
  if (marginDiff < -3) {
    recommendations.push({
      type: 'warning',
      title: 'Marża poniżej średniej rynkowej',
      description: 'Twoja marża jest poniżej średniej rynkowej. AI sugeruje sprawdzenie kosztów bezpośrednich i cen zakupu materiałów.',
      metric: 'grossMargin',
      difference: marginDiff,
    });
  } else if (marginDiff > 5) {
    recommendations.push({
      type: 'success',
      title: 'Doskonała marża!',
      description: 'Twoja marża przewyższa średnią branżową. Utrzymuj obecną strategię cenową.',
      metric: 'grossMargin',
      difference: marginDiff,
    });
  }
  
  // Admin burden comparison
  const adminDiff = metrics.adminBurden - benchmark.avgAdminBurden;
  if (adminDiff > 2) {
    recommendations.push({
      type: 'warning',
      title: 'Wysokie koszty administracyjne',
      description: 'Koszty administracyjne przekraczają standardy branżowe. Rozważ wdrożenie automatyzacji procesów back-office lub modelu TDABC.',
      metric: 'adminBurden',
      difference: adminDiff,
    });
  } else if (adminDiff < -3) {
    recommendations.push({
      type: 'success',
      title: 'Efektywna administracja',
      description: 'Twoje koszty administracyjne są niższe od średniej branżowej. To dobry znak efektywności operacyjnej.',
      metric: 'adminBurden',
      difference: adminDiff,
    });
  }
  
  // Efficiency comparison
  const effDiff = metrics.efficiency - benchmark.avgEfficiency;
  if (effDiff < -0.5) {
    recommendations.push({
      type: 'warning',
      title: 'Niska efektywność pracy',
      description: 'Stosunek przychodów do kosztów wynagrodzeń jest niższy od średniej. Rozważ optymalizację procesów lub przegląd struktury zatrudnienia.',
      metric: 'efficiency',
      difference: effDiff,
    });
  } else if (effDiff > 1) {
    recommendations.push({
      type: 'success',
      title: 'Wysoka produktywność zespołu',
      description: 'Twój zespół generuje więcej przychodów na złotówkę wynagrodzenia niż konkurencja.',
      metric: 'efficiency',
      difference: effDiff,
    });
  }
  
  // Cash cycle comparison
  const cycleDiff = metrics.cashCycle - benchmark.avgCashCycle;
  if (cycleDiff > 10) {
    recommendations.push({
      type: 'warning',
      title: 'Wydłużony cykl konwersji gotówki',
      description: 'Twój cykl konwersji gotówki jest dłuższy od średniej. Rozważ negocjacje z dostawcami lub usprawnienie windykacji należności.',
      metric: 'cashCycle',
      difference: cycleDiff,
    });
  } else if (cycleDiff < -5) {
    recommendations.push({
      type: 'success',
      title: 'Zoptymalizowany przepływ gotówki',
      description: 'Twój cykl konwersji gotówki jest krótszy od średniej branżowej. To pozytywnie wpływa na płynność finansową.',
      metric: 'cashCycle',
      difference: cycleDiff,
    });
  }
  
  // Add general info recommendation if no warnings
  if (recommendations.filter(r => r.type === 'warning').length === 0) {
    recommendations.push({
      type: 'info',
      title: 'Ogólna kondycja finansowa',
      description: 'Twoje wskaźniki finansowe są zgodne ze standardami branżowymi. Kontynuuj monitoring i szukaj możliwości dalszej optymalizacji.',
      metric: 'general',
      difference: 0,
    });
  }
  
  return recommendations;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
