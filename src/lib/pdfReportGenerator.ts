import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { FinancialReport, ParsedMetrics, Benchmark, AIRecommendation } from "./mockParser";

interface ReportData {
  companyName?: string;
  report: FinancialReport;
  metrics: ParsedMetrics;
  benchmark: Benchmark;
  recommendations: AIRecommendation[];
}

// Colors
const NAVY = "#1e293b";
const EMERALD = "#10b981";
const SOFT_RED = "#ef4444";
const MUTED = "#64748b";
const LIGHT_BG = "#f8fafc";

export function generateFinancialReport(data: ReportData): void {
  const { companyName, report, metrics, benchmark, recommendations } = data;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Helper functions
  const addPageIfNeeded = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 30) {
      doc.addPage();
      yPos = margin;
    }
  };

  const getStatus = (
    value: number,
    benchmarkValue: number,
    inverted: boolean = false
  ): { text: string; color: string } => {
    const diff = value - benchmarkValue;
    const threshold = benchmarkValue * 0.1;

    if (Math.abs(diff) < threshold) return { text: "Neutralny", color: MUTED };
    if (inverted) {
      return diff < 0
        ? { text: "Dobry", color: EMERALD }
        : { text: "Alert", color: SOFT_RED };
    }
    return diff > 0
      ? { text: "Dobry", color: EMERALD }
      : { text: "Alert", color: SOFT_RED };
  };

  // ========== HEADER ==========
  doc.setFillColor(NAVY);
  doc.rect(0, 0, pageWidth, 45, "F");

  // App name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("SmartController AI", margin, 22);

  // Subtitle
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Financial Health Check", margin, 32);

  yPos = 60;

  // ========== DOCUMENT TITLE ==========
  doc.setTextColor(NAVY);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Raport: Mapa Rentowności Twojej Firmy", margin, yPos);
  yPos += 12;

  // Metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED);

  const generationDate = new Date().toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const metadataLines = [
    `Firma: ${companyName || "Nie podano"}`,
    `Branża: ${benchmark.industryName}`,
    `Okres: ${report.period}`,
    `Data generacji: ${generationDate}`,
  ];

  metadataLines.forEach((line) => {
    doc.text(line, margin, yPos);
    yPos += 5;
  });

  yPos += 10;

  // ========== EXECUTIVE SUMMARY ==========
  addPageIfNeeded(50);

  doc.setFillColor(LIGHT_BG);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 40, 3, 3, "F");

  yPos += 8;
  doc.setTextColor(NAVY);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Podsumowanie Wykonawcze", margin + 8, yPos);

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED);

  const marginDiff = metrics.grossMargin - benchmark.avgMargin;
  const leakageText =
    marginDiff < 0
      ? `Wykryto wyciek marży na poziomie ${Math.abs(marginDiff).toFixed(1)} p.p. poniżej średniej branżowej (${benchmark.avgMargin.toFixed(1)}%). ` +
        `Twoja marża brutto wynosi ${metrics.grossMargin.toFixed(1)}%. Potencjał do odzyskania rentowności jest znaczący.`
      : `Twoja marża brutto (${metrics.grossMargin.toFixed(1)}%) przewyższa średnią branżową (${benchmark.avgMargin.toFixed(1)}%) o ${marginDiff.toFixed(1)} p.p. ` +
        `Firma wykazuje dobrą kondycję finansową w porównaniu z konkurencją.`;

  const summaryLines = doc.splitTextToSize(leakageText, pageWidth - 2 * margin - 16);
  doc.text(summaryLines, margin + 8, yPos);

  yPos += 35;

  // ========== BENCHMARK TABLE ==========
  addPageIfNeeded(80);

  doc.setTextColor(NAVY);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Porównanie z Benchmarkiem Branżowym", margin, yPos);
  yPos += 8;

  const marginStatus = getStatus(metrics.grossMargin, benchmark.avgMargin);
  const efficiencyStatus = getStatus(metrics.efficiency, benchmark.avgEfficiency);
  const adminStatus = getStatus(metrics.adminBurden, benchmark.avgAdminBurden, true);
  const cashStatus = getStatus(metrics.cashCycle, benchmark.avgCashCycle, true);

  const tableData = [
    [
      "Marża Brutto",
      `${metrics.grossMargin.toFixed(1)}%`,
      `${benchmark.avgMargin.toFixed(1)}%`,
      marginStatus.text,
    ],
    [
      "Efektywność Pracownika",
      `${metrics.efficiency.toFixed(2)}x`,
      `${benchmark.avgEfficiency.toFixed(2)}x`,
      efficiencyStatus.text,
    ],
    [
      "Obciążenie Administracyjne",
      `${metrics.adminBurden.toFixed(1)}%`,
      `${benchmark.avgAdminBurden.toFixed(1)}%`,
      adminStatus.text,
    ],
    [
      "Cykl Konwersji Gotówki",
      `${metrics.cashCycle} dni`,
      `${benchmark.avgCashCycle} dni`,
      cashStatus.text,
    ],
  ];

  const statusColors = [marginStatus, efficiencyStatus, adminStatus, cashStatus];

  autoTable(doc, {
    startY: yPos,
    head: [["Wskaźnik", "Twój Wynik", "Średnia Branżowa", "Status"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: NAVY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 10,
      textColor: NAVY,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 55 },
      1: { halign: "center", cellWidth: 35 },
      2: { halign: "center", cellWidth: 40 },
      3: { halign: "center", cellWidth: 30 },
    },
    margin: { left: margin, right: margin },
    didParseCell: function (data) {
      if (data.section === "body" && data.column.index === 3) {
        const status = statusColors[data.row.index];
        if (status.color === EMERALD) {
          data.cell.styles.textColor = [16, 185, 129];
          data.cell.styles.fontStyle = "bold";
        } else if (status.color === SOFT_RED) {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // ========== DETAILED INSIGHTS ==========
  addPageIfNeeded(60);

  doc.setTextColor(NAVY);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Wykryte Wycieki Marży", margin, yPos);
  yPos += 10;

  const warnings = recommendations.filter((r) => r.type === "warning");
  const successes = recommendations.filter((r) => r.type === "success");

  if (warnings.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(SOFT_RED);
    doc.text("Obszary wymagające uwagi:", margin, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(MUTED);
    doc.setFontSize(10);

    warnings.forEach((rec) => {
      addPageIfNeeded(20);
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(margin, yPos - 4, pageWidth - 2 * margin, 18, 2, 2, "F");

      doc.setTextColor(SOFT_RED);
      doc.setFont("helvetica", "bold");
      doc.text(`• ${rec.title}`, margin + 4, yPos);
      yPos += 5;

      doc.setTextColor(MUTED);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(rec.description, pageWidth - 2 * margin - 12);
      doc.text(descLines, margin + 8, yPos);
      yPos += descLines.length * 4 + 8;
    });
  }

  if (successes.length > 0) {
    yPos += 5;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(EMERALD);
    doc.text("Mocne strony:", margin, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(MUTED);
    doc.setFontSize(10);

    successes.forEach((rec) => {
      addPageIfNeeded(20);
      doc.setFillColor(236, 253, 245);
      doc.roundedRect(margin, yPos - 4, pageWidth - 2 * margin, 18, 2, 2, "F");

      doc.setTextColor(EMERALD);
      doc.setFont("helvetica", "bold");
      doc.text(`• ${rec.title}`, margin + 4, yPos);
      yPos += 5;

      doc.setTextColor(MUTED);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(rec.description, pageWidth - 2 * margin - 12);
      doc.text(descLines, margin + 8, yPos);
      yPos += descLines.length * 4 + 8;
    });
  }

  // ========== STRATEGIC ROADMAP ==========
  addPageIfNeeded(80);
  yPos += 10;

  doc.setTextColor(NAVY);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Strategiczna Mapa Drogowa", margin, yPos);
  yPos += 12;

  const roadmapSteps = [
    {
      step: "1",
      title: "Alokacja MPK",
      description:
        "Wprowadź miejsca powstawania kosztów (MPK) dla precyzyjnego śledzenia kosztów w każdym dziale.",
    },
    {
      step: "2",
      title: "Budżetowanie AI",
      description:
        "Wykorzystaj sztuczną inteligencję do predykcji budżetu i automatycznego wykrywania odchyleń.",
    },
    {
      step: "3",
      title: "Model TDABC",
      description:
        "Wdróż Time-Driven Activity-Based Costing dla dokładnej alokacji kosztów pośrednich.",
    },
  ];

  roadmapSteps.forEach((item, index) => {
    addPageIfNeeded(35);

    // Step circle
    doc.setFillColor(EMERALD);
    doc.circle(margin + 8, yPos + 6, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(item.step, margin + 5.5, yPos + 9);

    // Title
    doc.setTextColor(NAVY);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(item.title, margin + 22, yPos + 4);

    // Description
    doc.setTextColor(MUTED);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(item.description, pageWidth - margin - 45);
    doc.text(descLines, margin + 22, yPos + 10);

    yPos += 28;

    // Connector line (except for last item)
    if (index < roadmapSteps.length - 1) {
      doc.setDrawColor(EMERALD);
      doc.setLineWidth(0.5);
      doc.line(margin + 8, yPos - 14, margin + 8, yPos - 4);
    }
  });

  // ========== FOOTER ==========
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setPage(pageNum);

    // Footer line
    doc.setDrawColor(NAVY);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);

    // CTA
    doc.setTextColor(NAVY);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Chcesz odzyskać zysk? Umów sesję z Controllerem.",
      margin,
      pageHeight - 18
    );

    // Page number
    doc.setFont("helvetica", "normal");
    doc.setTextColor(MUTED);
    doc.setFontSize(9);
    doc.text(
      `Strona ${pageNum} z ${totalPages}`,
      pageWidth - margin - 25,
      pageHeight - 18
    );

    // Branding
    doc.setFontSize(8);
    doc.text("SmartController AI © 2025", margin, pageHeight - 10);
  };

  // Apply footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    addFooter(i, totalPages);
  }

  // Save the PDF
  const fileName = `SmartController_Report_${report.period}_${Date.now()}.pdf`;
  doc.save(fileName);
}
