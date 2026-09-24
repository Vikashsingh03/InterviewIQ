import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IoWarningOutline } from "react-icons/io5";
import { BsCode, BsPersonFill, BsChatDots } from "react-icons/bs";
import QuestionCoaching from "./QuestionCoaching";
import CoachChat from "./CoachChat";

const PANEL_LABELS = {
  interviewerA: { label: "Interviewer A", subtitle: "Technical", accent: "#5EC8D8" },
  interviewerB: { label: "Interviewer B", subtitle: "Behavioral", accent: "#E8A94C" },
};

const round1 = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : 0;
};
const formatScore = (value) => String(round1(value));

const tierFor = (value) => (value >= 8 ? "high" : value >= 5 ? "mid" : "low");

const TIERS = {
  high: {
    color: "#4ADE80",
    text: "text-[#1F8A4C] dark:text-[#4ADE80]",
    pill: "bg-[#4ADE80]/12 text-[#1F8A4C] dark:text-[#4ADE80]",
    label: "STRONG",
  },
  mid: {
    color: "#E8A94C",
    text: "text-[#B27E2E] dark:text-[#E8A94C]",
    pill: "bg-[#E8A94C]/12 text-[#B27E2E] dark:text-[#E8A94C]",
    label: "GOOD START",
  },
  low: {
    color: "#F87171",
    text: "text-[#D64545] dark:text-[#F87171]",
    pill: "bg-[#F87171]/12 text-[#D64545] dark:text-[#F87171]",
    label: "NEEDS WORK",
  },
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "weak", label: "Needs work" },
  { id: "strong", label: "Strong" },
  { id: "skipped", label: "Skipped" },
];

const CARD =
  "bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl";

function useCountUp(target, duration, active, delay) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const t0 = performance.now() + delay * 1000;
    const tick = (t) => {
      if (t < t0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased * 10) / 10);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active, delay]);
  return val;
}

function SectionHead({ num, label }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <span className="font-mono-studio text-[11px] font-bold tracking-[0.2em] text-[#B27E2E] dark:text-[#E8A94C]">
        {num}
      </span>
      <span className="font-mono-studio text-[11px] tracking-[0.18em] text-[#8B92A0] uppercase">
        {label}
      </span>
      <span className="flex-1 h-px bg-[#EAE9E5] dark:bg-[#1E2229]" />
    </div>
  );
}

function ScoreRing({ value, color }) {
  const display = useCountUp(value, 1200, true, 0.25);
  const size = 188;
  const stroke = 13;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(1, value / 10));

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-[#EFEEEA] dark:stroke-[#1E2229]"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - fraction) }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.25 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-serif-display text-6xl tracking-tight leading-none"
          style={{ color }}
        >
          {formatScore(display)}
        </span>
        <span className="font-mono-studio text-[10px] tracking-[0.14em] text-[#8B92A0] mt-2.5">
          OUT OF 10
        </span>
      </div>
    </div>
  );
}

function StatTile({ label, value, sub, onClick, accent }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`text-left bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-2xl p-4 ${
        onClick
          ? "hover:-translate-y-0.5 hover:border-[#E8A94C]/40 transition-all duration-200 cursor-pointer"
          : ""
      }`}
    >
      <p className="font-mono-studio text-[10px] tracking-[0.14em] text-[#8B92A0] uppercase">
        {label}
      </p>
      <p
        className="font-serif-display text-2xl mt-1.5 text-[#1C1F24] dark:text-[#EDEEF0]"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-[#8B92A0] mt-0.5">{sub}</p>}
    </Tag>
  );
}

function SkillRow({ s, index }) {
  const skillTier = TIERS[tierFor(s.value)];
  const barVal = useCountUp(s.value, 1000, true, 0.3 + index * 0.12);
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2 text-sm">
        <span className="text-[#3D4148] dark:text-[#C7CBD1]">
          {s.label}
        </span>
        <span
          className={`font-mono-studio font-semibold ${skillTier.text}`}
        >
          {formatScore(barVal)}
          <span className="text-[10px] text-[#8B92A0] font-normal">
            /10
          </span>
        </span>
      </div>

      <div className="bg-[#EFEEEA] dark:bg-[#1B1E24] h-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-out"
          style={{
            width: `${barVal * 10}%`,
            backgroundColor: skillTier.color,
          }}
        />
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#EAE9E5] dark:border-[#262B34] bg-white dark:bg-[#15181D] px-3 py-2 shadow-lg">
      <p className="font-mono-studio text-[10px] tracking-wide text-[#8B92A0]">
        {label}
      </p>
      <p className="font-mono-studio text-sm font-semibold text-[#B27E2E] dark:text-[#E8A94C]">
        {formatScore(payload[0].value)}/10
      </p>
    </div>
  );
}

function Step3Report({ report, showBackButton = true }) {
  const navigate = useNavigate();
  const [showCoach, setShowCoach] = useState(false);
  const [filter, setFilter] = useState("all");

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3] dark:bg-[#0A0B0D] transition-colors duration-300">
        <p className="text-[#8B92A0] text-lg font-['Manrope',sans-serif]">
          Loading Report...
        </p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
    role,
    company,
    hasJobDescription,
    proctoring,
    interviewType,
    perInterviewerScores,
    interviewId,
    avgDeliveryScore = 0,
    avgWordsPerMinute = 0,
    totalFillerWords = 0,
    avgEyeContactPct = null,
    avgConfidenceScore = null,
    confidenceSummaryLines = [],
  } = report;

  const isPanel = interviewType === "panel" && perInterviewerScores;
  const wasTerminated = Boolean(proctoring?.terminatedForMisbehavior);

  const score = round1(finalScore);
  const tierKey = tierFor(score);
  const tier = TIERS[tierKey];
  const progressColor = tier.color;

  const skills = [
    { label: "Confidence", value: round1(confidence) },
    { label: "Communication", value: round1(communication) },
    { label: "Correctness", value: round1(correctness) },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (tierKey === "high") {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (tierKey === "mid") {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const questionScoreData = questionWiseScore.map((q, index) => ({
    name: `Q${index + 1}`,
    score: round1(q.score || 0),
  }));

  const totalQuestions = questionWiseScore.length;
  const skippedCount = questionWiseScore.filter((q) => q.skipped).length;
  const answeredCount = totalQuestions - skippedCount;
  const scoredQuestions = questionWiseScore
    .map((q, index) => ({ ...q, index }))
    .filter((q) => !q.skipped);
  const bestQuestion = scoredQuestions.length
    ? scoredQuestions.reduce((a, b) => ((b.score || 0) > (a.score || 0) ? b : a))
    : null;
  const weakestQuestion = scoredQuestions.length
    ? scoredQuestions.reduce((a, b) => ((b.score || 0) < (a.score || 0) ? b : a))
    : null;

  const wpm = Math.round(Number(avgWordsPerMinute) || 0);
  const hasDelivery = wpm > 0;
  const paceLabel = wpm < 90 ? "A little slow" : wpm > 190 ? "A little fast" : "Steady pace";
  const hasConfidence = avgEyeContactPct != null || avgConfidenceScore != null;
  const confTier = TIERS[tierFor(avgConfidenceScore ?? 0)];

  const jumpToQuestion = (index) => {
    setFilter("all");
    setTimeout(() => {
      document
        .getElementById(`question-${index + 1}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  };

  const matchesFilter = (q) => {
    if (filter === "all") return true;
    if (filter === "skipped") return Boolean(q.skipped);
    if (filter === "weak") return !q.skipped && (q.score || 0) < 5;
    if (filter === "strong") return !q.skipped && (q.score || 0) >= 7;
    return true;
  };
  const filterCount = (id) =>
    questionWiseScore.filter((q) => {
      if (id === "all") return true;
      if (id === "skipped") return Boolean(q.skipped);
      if (id === "weak") return !q.skipped && (q.score || 0) < 5;
      return !q.skipped && (q.score || 0) >= 7;
    }).length;
  const visibleCount = questionWiseScore.filter(matchesFilter).length;

  const hexToRgb = (hex) => {
    const n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    const DARK = [14, 16, 20];
    const INK = [28, 31, 36];
    const AMBER = [232, 169, 76];
    const AMBER_DK = [178, 126, 46];
    const MUTED = [139, 146, 160];
    const PAPER = [247, 246, 243];
    const LINE = [228, 227, 222];
    const scoreRgb = hexToRgb(progressColor);
    const refNo = String(interviewId || "report").slice(-6).toUpperCase();
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const label = (text, x, y, size, color) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(size || 7.5);
      doc.setTextColor(...(color || MUTED));
      doc.text(String(text).toUpperCase(), x, y, { charSpace: 1.4 });
    };

    const serifHead = (text, x, y, size, color) => {
      doc.setFont("times", "bold");
      doc.setFontSize(size);
      doc.setTextColor(...(color || INK));
      doc.text(text, x, y);
    };

    const sectionHead = (num, title, y) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...AMBER_DK);
      doc.text(String(num).padStart(2, "0"), margin, y, { charSpace: 1.2 });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(String(title).toUpperCase(), margin + 10, y, { charSpace: 1.6 });
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.3);
      doc.line(margin, y + 3, pageWidth - margin, y + 3);
      return y + 10;
    };

    doc.setFillColor(...DARK);
    doc.rect(0, 0, pageWidth, 38, "F");
    doc.setFillColor(...AMBER);
    doc.rect(0, 0, pageWidth, 1.6, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...AMBER);
    doc.text("InterviewIQ.AI", pageWidth - margin, 12, { align: "right", charSpace: 1.6 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(150, 155, 165);
    doc.text("PERFORMANCE REPORT", pageWidth - margin, 17, { align: "right", charSpace: 1.2 });

    serifHead(
      isPanel ? "AI Panel Interview Report" : "AI Interview Performance Report",
      margin,
      16,
      19,
      [255, 255, 255],
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(195, 199, 206);
    const subtitleParts = [role, company, today].filter(Boolean);
    doc.text(subtitleParts.join("   ·   "), margin, 24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...AMBER);
    doc.text(`REF Nº ${refNo}`, margin, 31, { charSpace: 1.4 });

    let currentY = 48;

    if (wasTerminated) {
      doc.setFillColor(254, 226, 226);
      doc.setDrawColor(248, 113, 113);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, currentY, contentWidth, 15, 3, 3, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(185, 28, 28);
      doc.text(
        "Interview was not successful — ended early due to repeated fullscreen exits.",
        margin + 6,
        currentY + 9.5,
      );
      currentY += 21;
    }

    currentY = sectionHead("01", "Overall verdict", currentY);
    const verdictLines = doc.splitTextToSize(
      `${performanceText} ${shortTagline}`,
      contentWidth - 66,
    );
    const verdictH = Math.max(34, 16 + verdictLines.length * 5.5);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, contentWidth, verdictH, 4, 4, "FD");
    doc.setFillColor(...scoreRgb);
    doc.rect(margin, currentY, 1.6, verdictH, "F");

    const ringCx = margin + 22;
    const ringCy = currentY + verdictH / 2;
    doc.setFillColor(...scoreRgb);
    doc.circle(ringCx, ringCy, 12, "F");
    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text(formatScore(score), ringCx, ringCy + 2, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text("/ 10", ringCx, ringCy + 7, { align: "center" });

    label("Verdict", margin + 40, currentY + 10, 7.5, scoreRgb);
    serifHead(tier.label.charAt(0) + tier.label.slice(1).toLowerCase(), margin + 40, currentY + 19, 15, INK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(80, 85, 92);
    doc.text(verdictLines, margin + 40, currentY + 26);

    currentY += verdictH + 10;

    if (isPanel) {
      currentY = sectionHead("02", "Panel verdict", currentY);
      const halfW = (contentWidth - 6) / 2;
      const panelH = 27;
      const panels = [
        { x: margin, key: "interviewerA", rgb: [94, 200, 216] },
        { x: margin + halfW + 6, key: "interviewerB", rgb: AMBER },
      ];
      panels.forEach((p) => {
        const persona = PANEL_LABELS[p.key];
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(...LINE);
        doc.setLineWidth(0.3);
        doc.roundedRect(p.x, currentY, halfW, panelH, 3, 3, "FD");
        doc.setFillColor(...p.rgb);
        doc.rect(p.x, currentY, 1.6, panelH, "F");
        label(`${persona.label} · ${persona.subtitle}`, p.x + 8, currentY + 9, 7.5, p.rgb);
        serifHead(`${formatScore(perInterviewerScores[p.key])}/10`, p.x + halfW - 8, currentY + 20, 15, INK);
      });
      currentY += panelH + 10;
    }

    currentY = sectionHead(isPanel ? "03" : "02", "Skill evaluation", currentY);
    const skillsH = 10 + skills.length * 12;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, contentWidth, skillsH, 4, 4, "FD");
    skills.forEach((s, i) => {
      const rowY = currentY + 12 + i * 12;
      const sRgb = hexToRgb(TIERS[tierFor(s.value)].color);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...INK);
      doc.text(s.label, margin + 8, rowY);
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...sRgb);
      doc.text(`${formatScore(s.value)}/10`, pageWidth - margin - 8, rowY, { align: "right" });
      const barX = margin + 8;
      const barW = contentWidth - 16;
      doc.setFillColor(239, 238, 234);
      doc.roundedRect(barX, rowY + 2.5, barW, 2.2, 1, 1, "F");
      doc.setFillColor(...sRgb);
      doc.roundedRect(barX, rowY + 2.5, Math.max(2.5, (barW * s.value) / 10), 2.2, 1, 1, "F");
    });
    currentY += skillsH + 10;

    if (hasConfidence) {
      currentY = sectionHead(isPanel ? "04" : "03", "Body language & confidence", currentY);
      if (avgConfidenceScore != null) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...INK);
        doc.text(`Confidence score: ${formatScore(avgConfidenceScore)}/10`, margin, currentY);
        currentY += 7;
      }
      if (avgEyeContactPct != null) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 85, 92);
        doc.text(`Eye contact held ${avgEyeContactPct}% of the time.`, margin, currentY);
        currentY += 7;
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80, 85, 92);
      (confidenceSummaryLines || []).forEach((line) => {
        const split = doc.splitTextToSize(`\u2022 ${line}`, contentWidth - 8);
        doc.text(split, margin, currentY);
        currentY += split.length * 5.5;
      });
      currentY += 6;
    }

    let advice = "";
    if (tierKey === "high") {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue supporting your answers with strong real-world examples.";
    } else if (tierKey === "mid") {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    }
    currentY = sectionHead(isPanel ? (hasConfidence ? "05" : "04") : (hasConfidence ? "04" : "03"), "Professional advice", currentY);
    doc.setFont("times", "bold");
    doc.setFontSize(26);
    doc.setTextColor(...AMBER);
    doc.text("\u201C", margin + 4, currentY + 8);
    const adviceLines = doc.splitTextToSize(advice, contentWidth - 20);
    doc.setFont("times", "italic");
    doc.setFontSize(11.5);
    doc.setTextColor(...INK);
    doc.text(adviceLines, margin + 12, currentY + 8);
    currentY += 10 + adviceLines.length * 5.5;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    currentY = sectionHead(isPanel ? (hasConfidence ? "06" : "05") : (hasConfidence ? "05" : "04"), "Question analysis", currentY);

    const tableHead = isPanel
      ? [["#", "Interviewer", "Question", "Score", "Feedback"]]
      : [["#", "Question", "Score", "Feedback"]];

    const tableBody = questionWiseScore.map((q, i) =>
      isPanel
        ? [
            `${i + 1}`,
            q.askedBy ? PANEL_LABELS[q.askedBy]?.label || "—" : "—",
            q.question,
            q.skipped ? "Skipped" : `${formatScore(q.score)}/10`,
            q.feedback,
          ]
        : [`${i + 1}`, q.question, q.skipped ? "Skipped" : `${formatScore(q.score)}/10`, q.feedback],
    );

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin, bottom: 18 },
      head: tableHead,
      body: tableBody,
      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: 4.5,
        valign: "top",
        lineColor: LINE,
        lineWidth: 0.2,
        textColor: INK,
      },
      headStyles: {
        font: "times",
        fontStyle: "bold",
        fontSize: 10,
        fillColor: DARK,
        textColor: AMBER,
        halign: "center",
        cellPadding: 5,
      },
      columnStyles: isPanel
        ? {
            0: { cellWidth: 8, halign: "center" },
            1: { cellWidth: 22 },
            2: { cellWidth: 45 },
            3: { cellWidth: 16, halign: "center", fontStyle: "bold" },
            4: { cellWidth: "auto" },
          }
        : {
            0: { cellWidth: 10, halign: "center" },
            1: { cellWidth: 55 },
            2: { cellWidth: 20, halign: "center", fontStyle: "bold" },
            3: { cellWidth: "auto" },
          },
      alternateRowStyles: { fillColor: [250, 249, 247] },
      didParseCell: (data) => {
        if (isPanel && data.section === "body" && data.column.index === 1) {
          const raw = questionWiseScore[data.row.index];
          const rgb = raw?.askedBy === "interviewerA" ? [94, 200, 216] : AMBER;
          data.cell.styles.textColor = rgb;
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const pageH = doc.internal.pageSize.getHeight();
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.25);
      doc.line(margin, pageH - 13, pageWidth - margin, pageH - 13);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text(`InterviewIQ.AI  ·  REF Nº ${refNo}`, margin, pageH - 8, { charSpace: 1 });
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageH - 8, { align: "right" });
    }

    doc.save(isPanel ? "AI_Panel_Interview_report.pdf" : "AI_Interview_report.pdf");
  };

  return (
    <div className="min-h-screen relative bg-[#F7F6F3] dark:bg-[#0A0B0D] px-4 sm:px-6 lg:px-10 py-8 transition-colors duration-300 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .report-root, .report-root * { font-family: 'Manrope', sans-serif; }
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }

        .film-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.025;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/rect%3E%3C/svg%3E");
          z-index: 0;
        }
      `}</style>

      <div className="film-grain" />

      <div className="report-root relative z-10 max-w-350 mx-auto">
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="flex items-start gap-4 min-w-0">
            {showBackButton && (
              <button
                onClick={() => navigate("/history")}
                aria-label="Back to history"
                className="mt-1 w-11 h-11 shrink-0 cursor-pointer flex items-center justify-center rounded-full bg-white dark:bg-[#131519] border border-[#EAE9E5] dark:border-[#232830] hover:-translate-y-0.5 transition-all duration-200"
              >
                <FaArrowLeft className="text-[#5C6472] dark:text-[#9AA1AC]" size={14} />
              </button>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="min-w-0"
            >
              <div className="inline-flex items-center gap-2 bg-[#E8A94C]/8 border border-[#E8A94C]/20 px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#E8A94C] shrink-0" />
                <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#B27E2E] dark:text-[#E8A94C]">
                  AI-POWERED PERFORMANCE INSIGHTS
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-serif-display text-4xl sm:text-5xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight leading-[1.05]">
                  {isPanel ? "Panel Interview Analytics" : "Interview Analytics"}
                </h1>
                {isPanel && (
                  <span className="font-mono-studio text-[10px] tracking-[0.12em] px-2.5 py-1 rounded-md bg-[#8B7FD6]/10 text-[#6A5FBF] dark:text-[#B3A9F5] border border-[#8B7FD6]/20">
                    2 INTERVIEWERS
                  </span>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-2.5 mt-3.5">
                {role && (
                  <span className="font-mono-studio text-xs tracking-[0.06em] text-[#5C6472] dark:text-[#8B92A0]">
                    {role}
                    {company ? ` @ ${company}` : ""}
                  </span>
                )}
                {hasJobDescription && (
                  <span className="font-mono-studio text-[10px] tracking-widest px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    TAILORED TO PASTED JOB DESCRIPTION
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex items-center gap-3 flex-wrap shrink-0"
          >
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-[#1C1F24] dark:bg-[#EDEEF0] hover:-translate-y-0.5 text-white dark:text-[#0A0B0D] px-6 py-3 rounded-2xl transition-all duration-200 font-semibold text-sm sm:text-base text-nowrap cursor-pointer"
            >
              <FaDownload size={13} />
              Download PDF
            </button>
            {interviewId && (
              <motion.button
                onClick={() => setShowCoach(true)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-[#E8A94C] hover:bg-[#F0B865] text-[#1C1F24] px-6 py-3 rounded-2xl transition-all duration-200 font-semibold text-sm sm:text-base text-nowrap cursor-pointer"
              >
                <BsChatDots size={14} />
                Talk to AI Coach
              </motion.button>
            )}
          </motion.div>
        </div>

        {wasTerminated && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-3xl border-2 border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-6 sm:p-7"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 shrink-0 rounded-2xl bg-red-500/15 flex items-center justify-center">
                <IoWarningOutline className="text-red-600 dark:text-red-400" size={22} />
              </div>
              <div>
                <p className="font-mono-studio text-[10px] tracking-[0.2em] text-red-500 dark:text-red-400 mb-2">
                  PROCTOR NOTICE
                </p>
                <h2 className="font-serif-display text-xl sm:text-2xl text-red-700 dark:text-red-300 mb-1.5">
                  Interview was not successful
                </h2>
                <p className="text-sm text-red-700/80 dark:text-red-300/80 leading-relaxed">
                  This session was ended early because fullscreen mode was
                  exited {proctoring?.fullscreenExitCount ?? 3} times during the
                  interview, despite warnings. The scores below reflect only the
                  questions that were completed before termination.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${CARD} p-6 sm:p-8 text-center relative overflow-hidden`}
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="absolute top-0 left-10 right-10 h-0.5 origin-center"
                style={{ backgroundColor: progressColor }}
              />
              <SectionHead num="01" label="Overall Performance" />

              <ScoreRing value={score} color={progressColor} />

              <div className="mt-7">
                <span
                  className={`font-mono-studio inline-block text-[10px] tracking-[0.14em] px-3.5 py-1.5 rounded-md border-2 mb-4 ${tier.pill} border-current`}
                >
                  {tier.label}
                </span>
                <p className="font-serif-display text-[#1C1F24] dark:text-[#EDEEF0] text-xl leading-snug">
                  {performanceText}
                </p>
                <p className="text-[#8B92A0] text-sm mt-2 leading-relaxed">
                  {shortTagline}
                </p>
              </div>
            </motion.div>

            {isPanel && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className={`${CARD} p-6 sm:p-8`}
              >
                <SectionHead num="02" label="Panel Verdict" />
                <div className="grid grid-cols-2 gap-3">
                  {["interviewerA", "interviewerB"].map((key) => {
                    const persona = PANEL_LABELS[key];
                    const val = round1(perInterviewerScores[key] ?? 0);
                    return (
                      <div
                        key={key}
                        className="rounded-2xl p-4 text-center border-2"
                        style={{ borderColor: `${persona.accent}44` }}
                      >
                        <BsPersonFill
                          size={14}
                          style={{ color: persona.accent }}
                          className="mx-auto mb-1.5"
                        />
                        <p className="font-serif-display text-3xl text-[#1C1F24] dark:text-[#EDEEF0] leading-none">
                          {formatScore(val)}
                          <span className="text-xs text-[#8B92A0]">/10</span>
                        </p>
                        <div className="h-1 rounded-full bg-black/5 dark:bg-white/8 mt-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${val * 10}%` }}
                            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: persona.accent }}
                          />
                        </div>
                        <p
                          className="font-mono-studio text-[10px] tracking-[0.12em] mt-2.5"
                          style={{ color: persona.accent }}
                        >
                          {persona.label.toUpperCase()}
                        </p>
                        <p className="text-[10px] text-[#8B92A0]">{persona.subtitle}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className={`${CARD} p-6 sm:p-8`}
            >
              <SectionHead num={isPanel ? "03" : "02"} label="Skill Evaluation" />
              <div className="space-y-5">
                {skills.map((s, i) => (
                  <SkillRow key={s.label} s={s} index={i} />
                ))}
              </div>
            </motion.div>

            {hasDelivery && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`${CARD} p-6 sm:p-8`}
              >
                <SectionHead num={isPanel ? "04" : "03"} label="Speaking Delivery" />
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-serif-display text-2xl text-[#1C1F24] dark:text-[#EDEEF0]">
                      {formatScore(avgDeliveryScore)}
                    </p>
                    <p className="font-mono-studio text-[9px] tracking-[0.12em] text-[#8B92A0] mt-1">
                      DELIVERY /10
                    </p>
                  </div>
                  <div>
                    <p className="font-serif-display text-2xl text-[#1C1F24] dark:text-[#EDEEF0]">
                      {wpm}
                    </p>
                    <p className="font-mono-studio text-[9px] tracking-[0.12em] text-[#8B92A0] mt-1">
                      WORDS / MIN
                    </p>
                  </div>
                  <div>
                    <p className="font-serif-display text-2xl text-[#1C1F24] dark:text-[#EDEEF0]">
                      {totalFillerWords}
                    </p>
                    <p className="font-mono-studio text-[9px] tracking-[0.12em] text-[#8B92A0] mt-1">
                      FILLER WORDS
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#8B92A0] mt-5 text-center">
                  {paceLabel}. A steady pace is roughly 90 to 190 words a minute.
                </p>
              </motion.div>
            )}

            {hasConfidence && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.11 }}
                className={`${CARD} p-6 sm:p-8`}
              >
                <SectionHead num={isPanel ? (hasDelivery ? "05" : "04") : (hasDelivery ? "04" : "03")} label="Body Language & Confidence" />
                {avgConfidenceScore != null && (
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${confTier.color}1A` }}>
                      <span className="font-serif-display text-3xl" style={{ color: confTier.color }}>
                        {formatScore(avgConfidenceScore)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1C1F24] dark:text-[#EDEEF0]">Confidence score</p>
                      <p className="text-xs text-[#8B92A0] mt-0.5 leading-relaxed">Blends eye contact, filler words and speaking pace.</p>
                    </div>
                  </div>
                )}
                {avgEyeContactPct != null && (
                  <div className="mb-5">
                    <div className="flex justify-between items-baseline mb-2 text-sm">
                      <span className="text-[#3D4148] dark:text-[#C7CBD1]">Eye contact</span>
                      <span className="font-mono-studio font-semibold text-[#1C1F24] dark:text-[#EDEEF0]">
                        {avgEyeContactPct}
                        <span className="text-[10px] text-[#8B92A0] font-normal">% of the time</span>
                      </span>
                    </div>
                    <div className="bg-[#EFEEEA] dark:bg-[#1B1E24] h-2 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${avgEyeContactPct}%` }} transition={{ duration: 0.9, ease: "easeOut" }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${confTier.color}99, ${confTier.color})` }} />
                    </div>
                  </div>
                )}
                {confidenceSummaryLines.length > 0 && (
                  <ul className="space-y-2">
                    {confidenceSummaryLines.map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-[#3D4148] dark:text-[#C7CBD1] leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: confTier.color }} />
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}

            {proctoring && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className={`${CARD} p-6 sm:p-8`}
              >
                <SectionHead num={isPanel ? (hasDelivery ? (hasConfidence ? "06" : "05") : (hasConfidence ? "05" : "04")) : (hasDelivery ? (hasConfidence ? "05" : "04") : (hasConfidence ? "04" : "03"))} label="Proctoring Summary" />
                <div className="space-y-3.5 text-sm">
                  {[
                    {
                      label: "Camera",
                      value: proctoring.cameraEnabled
                        ? "Enabled"
                        : proctoring.cameraDenied
                          ? "Denied"
                          : "Not used",
                      ok: proctoring.cameraEnabled,
                    },
                    {
                      label: "Screen share",
                      value: proctoring.screenShared ? "Shared" : "Not shared",
                      ok: proctoring.screenShared,
                    },
                    {
                      label: "Location",
                      value: proctoring.locationShared
                        ? `${proctoring.latitude?.toFixed(2)}, ${proctoring.longitude?.toFixed(2)}`
                        : "Not shared",
                      ok: proctoring.locationShared,
                    },
                    {
                      label: "Tab switches",
                      value: proctoring.tabSwitchCount ?? 0,
                      ok: (proctoring.tabSwitchCount ?? 0) === 0,
                    },
                    {
                      label: "Fullscreen exits",
                      value: proctoring.fullscreenExitCount ?? 0,
                      ok: (proctoring.fullscreenExitCount ?? 0) === 0,
                    },
                    {
                      label: "Session outcome",
                      value: wasTerminated ? "Terminated" : "Completed",
                      ok: !wasTerminated,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-[#3D4148] dark:text-[#C7CBD1]">
                        {row.label}
                      </span>
                      <span
                        className={`font-mono-studio inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                          row.ok
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rotate-45 ${row.ok ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
              <StatTile
                label="Answered"
                value={`${answeredCount}/${totalQuestions}`}
                sub="questions attempted"
              />
              <StatTile
                label="Skipped"
                value={skippedCount}
                sub={skippedCount === 0 ? "none, nice" : "questions skipped"}
              />
              <StatTile
                label="Best answer"
                value={bestQuestion ? `Q${bestQuestion.index + 1}` : "-"}
                sub={bestQuestion ? `${formatScore(bestQuestion.score)}/10 · tap to view` : "no answers yet"}
                accent={bestQuestion ? TIERS[tierFor(bestQuestion.score || 0)].color : undefined}
                onClick={bestQuestion ? () => jumpToQuestion(bestQuestion.index) : undefined}
              />
              <StatTile
                label="Needs most work"
                value={weakestQuestion ? `Q${weakestQuestion.index + 1}` : "-"}
                sub={weakestQuestion ? `${formatScore(weakestQuestion.score)}/10 · tap to view` : "no answers yet"}
                accent={weakestQuestion ? TIERS[tierFor(weakestQuestion.score || 0)].color : undefined}
                onClick={weakestQuestion ? () => jumpToQuestion(weakestQuestion.index) : undefined}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`${CARD} p-6 sm:p-8`}
            >
              <SectionHead num={isPanel ? (hasDelivery ? (hasConfidence ? "07" : "06") : (hasConfidence ? "06" : "05")) : (hasDelivery ? (hasConfidence ? "06" : "05") : (hasConfidence ? "05" : "04"))} label="Performance Trend" />

              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={questionScoreData}
                    margin={{ top: 8, right: 12, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E8A94C" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#E8A94C" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(139,146,160,0.2)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#8B92A0", fontFamily: "JetBrains Mono", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 10]}
                      ticks={[0, 2, 4, 6, 8, 10]}
                      tick={{ fill: "#8B92A0", fontFamily: "JetBrains Mono", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ stroke: "#E8A94C", strokeOpacity: 0.35, strokeDasharray: "3 3" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#E8A94C"
                      strokeWidth={2.5}
                      fill="url(#scoreFill)"
                      dot={{ r: 3, fill: "#E8A94C", strokeWidth: 0 }}
                      activeDot={{ r: 5.5, fill: "#E8A94C", stroke: "#fff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className={`${CARD} p-6 sm:p-8`}
            >
              <div className="mb-6">
                <SectionHead num={isPanel ? (hasDelivery ? (hasConfidence ? "08" : "07") : (hasConfidence ? "07" : "06")) : (hasDelivery ? (hasConfidence ? "07" : "06") : (hasConfidence ? "06" : "05"))} label="Questions Breakdown" />
                <div className="flex flex-wrap gap-2 -mt-2">
                  {FILTERS.map((f) => {
                    const count = filterCount(f.id);
                    const active = filter === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilter(f.id)}
                        disabled={f.id !== "all" && count === 0}
                        className={`font-mono-studio text-[11px] tracking-[0.08em] px-3 py-1.5 rounded-full border transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          active
                            ? "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] border-transparent"
                            : "border-[#EAE9E5] dark:border-[#262B34] text-[#5C6472] dark:text-[#8B92A0] hover:bg-[#F5F5F3] dark:hover:bg-[#181B20]"
                        }`}
                      >
                        {f.label} · {count}
                      </button>
                    );
                  })}
                </div>
              </div>

              {visibleCount === 0 && (
                <p className="text-sm text-[#8B92A0] text-center py-8">
                  No questions match this filter.
                </p>
              )}

              <div className="space-y-5">
                {questionWiseScore.map((q, i) => {
                  const persona = q.askedBy ? PANEL_LABELS[q.askedBy] : null;
                  const qScore = round1(q.score ?? 0);
                  const qTier = TIERS[tierFor(qScore)];
                  const accentColor = q.skipped ? "#8B92A0" : qTier.color;
                  return (
                    <div
                      key={q._id || i}
                      id={`question-${i + 1}`}
                      className={`relative bg-[#FAFAF8] dark:bg-[#0C0E11] p-4 sm:p-6 pl-5 sm:pl-7 rounded-2xl border border-[#EAE9E5] dark:border-[#1E2229] ${
                        matchesFilter(q) ? "" : "hidden"
                      }`}
                    >
                      <span
                        className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full"
                        style={{ backgroundColor: accentColor }}
                      />
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-mono-studio text-[11px] tracking-[0.14em] text-[#B27E2E] dark:text-[#E8A94C]">
                              Q.{String(i + 1).padStart(2, "0")}
                            </p>
                            {persona && (
                              <span
                                className="font-mono-studio inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] tracking-wide"
                                style={{
                                  backgroundColor: `${persona.accent}1A`,
                                  color: persona.accent,
                                }}
                              >
                                <BsPersonFill size={8} /> {persona.label}
                              </span>
                            )}
                            {q.type === "coding" && (
                              <span className="font-mono-studio inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] tracking-wide bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8]">
                                <BsCode size={9} /> CODING
                              </span>
                            )}
                          </div>
                          <p className="font-serif-display text-[#1C1F24] dark:text-[#EDEEF0] text-base sm:text-lg leading-relaxed mt-0.5 wrap-break-word">
                            {q.question || "Question not available"}
                          </p>
                        </div>

                        {q.skipped ? (
                          <div className="font-mono-studio bg-[#8B92A0]/12 text-[#8B92A0] px-3 py-1 rounded-md font-bold text-xs w-fit shrink-0 tracking-[0.12em]">
                            SKIPPED
                          </div>
                        ) : (
                          <div
                            className={`font-mono-studio px-3 py-1 rounded-md font-bold text-xs sm:text-sm w-fit shrink-0 ${qTier.pill}`}
                          >
                            {formatScore(qScore)}/10
                          </div>
                        )}
                      </div>

                      {q.type === "coding" && q.answer && (
                        <div className="mb-4">
                          <p className="font-mono-studio text-[11px] tracking-widest text-[#9AA1AC] mb-1.5 flex items-center gap-1.5">
                            <BsCode size={11} /> SUBMITTED CODE
                            {q.language ? ` · ${q.language.toUpperCase()}` : ""}
                          </p>
                          <pre className="font-mono-studio bg-[#0C0E11] text-[#D8DCE3] text-xs sm:text-sm p-4 rounded-xl overflow-x-auto whitespace-pre-wrap border border-[#1E2229]">
                            <code>{q.answer}</code>
                          </pre>
                        </div>
                      )}

                      <div className="bg-white dark:bg-[#111318] border border-[#E8A94C]/25 p-4 rounded-xl">
                        <p className="font-mono-studio text-[10px] tracking-[0.16em] text-[#B27E2E] dark:text-[#E8A94C] uppercase mb-1.5">
                          AI feedback
                        </p>
                        <p className="text-sm text-[#3D4148] dark:text-[#C7CBD1] leading-relaxed">
                          {q.feedback && q.feedback.trim() !== ""
                            ? q.feedback
                            : "No feedback available for this question."}
                        </p>
                      </div>

                      {q.confidenceMetrics && (
                        <div className="mt-3 rounded-xl border border-[#5EC8D8]/25 bg-[#5EC8D8]/5 px-3.5 py-2.5">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-mono-studio text-[10px] text-[#2E8494] dark:text-[#5EC8D8] tracking-wide uppercase">Body language</p>
                            {q.confidenceMetrics.confidenceScore != null && (
                              <span className="font-mono-studio text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${TIERS[tierFor(q.confidenceMetrics.confidenceScore)].color}1A`, color: TIERS[tierFor(q.confidenceMetrics.confidenceScore)].color }}>
                                {formatScore(q.confidenceMetrics.confidenceScore)}/10
                              </span>
                            )}
                          </div>
                          {(q.confidenceMetrics.notes || []).map((note, ni) => (
                            <p key={ni} className="text-[13px] text-[#3D4148] dark:text-[#C7CBD1] leading-relaxed">{note}</p>
                          ))}
                        </div>
                      )}
                      <QuestionCoaching question={q} />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCoach && interviewId && (
          <CoachChat interviewId={interviewId} onClose={() => setShowCoach(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Step3Report;
