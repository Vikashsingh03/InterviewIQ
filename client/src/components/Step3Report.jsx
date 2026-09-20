import React, { useState } from "react";
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
import { IoSparklesSharp, IoWarningOutline } from "react-icons/io5";
import { BsCode, BsPersonFill, BsChatDots } from "react-icons/bs";
import QuestionCoaching from "./QuestionCoaching";
import CoachChat from "./CoachChat";

// client-side labels only — matches PANEL_PERSONAS in Step2PanelInterview,
// kept separate (and this simple) since the report only needs a label + color
const PANEL_LABELS = {
  interviewerA: { label: "Interviewer A", subtitle: "Technical", accent: "#5EC8D8" },
  interviewerB: { label: "Interviewer B", subtitle: "Behavioral", accent: "#E8A94C" },
};

// ---- number formatting -------------------------------------------------
// The server can send 4.666666666666667. Everything shown on this page (and
// in the PDF) goes through these, so a score never has more than 1 decimal.
const round1 = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : 0;
};
const formatScore = (value) => String(round1(value)); // 4.7, 5, 2.4

// ---- score tiers (same thresholds the page always used) ----------------
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
  "bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)]";

const CARD_TITLE =
  "font-mono-studio text-[11px] tracking-wide text-[#8B92A0] uppercase";

// ---- score ring: own SVG so it looks right in light AND dark -----------
function ScoreRing({ value, color }) {
  const size = 176;
  const stroke = 12;
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
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-serif-display text-5xl tracking-tight leading-none"
          style={{ color }}
        >
          {formatScore(value)}
        </span>
        <span className="font-mono-studio text-[10px] tracking-[0.12em] text-[#8B92A0] mt-2">
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
      <p className="font-mono-studio text-[10px] tracking-wide text-[#8B92A0] uppercase">
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

function Step3Report({ report }) {
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
  } = report;

  const isPanel = interviewType === "panel" && perInterviewerScores;
  const wasTerminated = Boolean(proctoring?.terminatedForMisbehavior);

  // ---- everything numeric is rounded ONCE, here ----
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

  // ---- quick facts about this interview ----
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

    const DARK = [17, 19, 24]; // #111318
    const AMBER = [232, 169, 76]; // #E8A94C
    const CYAN = [94, 200, 216]; // #5EC8D8
    const MUTED = [139, 146, 160]; // #8B92A0
    const INK = [28, 31, 36]; // #1C1F24
    const CARD_BG = [247, 246, 243]; // #F7F6F3
    const scoreRgb = hexToRgb(progressColor);

    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // ================ COVER HEADER BAND ================
    doc.setFillColor(...DARK);
    doc.rect(0, 0, pageWidth, 34, "F");
    doc.setFillColor(...AMBER);
    doc.rect(0, 0, pageWidth, 1.4, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text(
      isPanel ? "AI Panel Interview Performance Report" : "AI Interview Performance Report",
      margin,
      15,
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(200, 204, 211);
    const subtitleParts = [role, company, today].filter(Boolean);
    doc.text(subtitleParts.join("   •   "), margin, 22);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...AMBER);
    doc.text("InterviewIQ.AI", pageWidth - margin, 15, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(160, 165, 175);
    doc.text("Performance Report", pageWidth - margin, 20, { align: "right" });

    let currentY = 44;

    // ================ MISBEHAVIOR NOTICE (if terminated) ================
    if (wasTerminated) {
      doc.setFillColor(254, 226, 226);
      doc.setDrawColor(248, 113, 113);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, currentY, contentWidth, 16, 3, 3, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(185, 28, 28);
      doc.text(
        "Interview was not successful - ended due to repeated fullscreen exits.",
        margin + 6,
        currentY + 10,
      );
      currentY += 22;
    }

    // ================ SCORE HERO CARD ================
    const scoreCardH = 32;
    doc.setFillColor(...CARD_BG);
    doc.roundedRect(margin, currentY, contentWidth, scoreCardH, 4, 4, "F");

    const circleCx = margin + 18;
    const circleCy = currentY + scoreCardH / 2;
    doc.setFillColor(...scoreRgb);
    doc.circle(circleCx, circleCy, 11, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(17, 19, 24);
    doc.text(formatScore(score), circleCx, circleCy + 1, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text("/ 10", circleCx, circleCy + 5.5, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("OVERALL PERFORMANCE", margin + 36, currentY + 11);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(performanceText, margin + 36, currentY + 19);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(shortTagline, margin + 36, currentY + 25);

    currentY += scoreCardH + 8;

    // ================ PANEL VERDICT (panel mode only) ================
    if (isPanel) {
      const halfW = (contentWidth - 6) / 2;
      const panelH = 26;
      const panels = [
        {
          x: margin,
          label: "INTERVIEWER A",
          sub: "Technical",
          score: perInterviewerScores.interviewerA,
          rgb: CYAN,
        },
        {
          x: margin + halfW + 6,
          label: "INTERVIEWER B",
          sub: "Behavioral",
          score: perInterviewerScores.interviewerB,
          rgb: AMBER,
        },
      ];

      panels.forEach((p) => {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(230, 229, 224);
        doc.setLineWidth(0.25);
        doc.roundedRect(p.x, currentY, halfW, panelH, 3, 3, "FD");
        doc.setFillColor(...p.rgb);
        doc.rect(p.x, currentY, 1.4, panelH, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...p.rgb);
        doc.text(p.label, p.x + 7, currentY + 9);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...MUTED);
        doc.text(p.sub, p.x + 7, currentY + 15);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...INK);
        doc.text(`${formatScore(p.score)}/10`, p.x + halfW - 7, currentY + 13, {
          align: "right",
        });
      });

      currentY += panelH + 8;
    }

    // ================ SKILLS CARD (with mini bars) ================
    const skillsCardH = 8 + skills.length * 11;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 229, 224);
    doc.setLineWidth(0.25);
    doc.roundedRect(margin, currentY, contentWidth, skillsCardH, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("SKILL EVALUATION", margin + 8, currentY + 9);

    skills.forEach((s, i) => {
      const rowY = currentY + 15 + i * 11;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
      doc.text(s.label, margin + 8, rowY);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...AMBER);
      doc.text(formatScore(s.value), pageWidth - margin - 8, rowY, {
        align: "right",
      });

      const barX = margin + 8;
      const barW = contentWidth - 16;
      const barY = rowY + 2;
      doc.setFillColor(239, 238, 234);
      doc.roundedRect(barX, barY, barW, 2, 1, 1, "F");
      doc.setFillColor(...AMBER);
      doc.roundedRect(barX, barY, Math.max(2, (barW * s.value) / 10), 2, 1, 1, "F");
    });

    currentY += skillsCardH + 8;

    // ================ ADVICE CARD ================
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

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 18);
    const adviceCardH = 16 + splitAdvice.length * 5;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 229, 224);
    doc.setLineWidth(0.25);
    doc.roundedRect(margin, currentY, contentWidth, adviceCardH, 4, 4, "FD");
    doc.setFillColor(...AMBER);
    doc.rect(margin, currentY, 1.4, adviceCardH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    doc.text("PROFESSIONAL ADVICE", margin + 8, currentY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(80, 85, 92);
    doc.text(splitAdvice, margin + 8, currentY + 17);

    currentY += adviceCardH + 10;

    // ================ QUESTION TABLE ================
    const tableHead = isPanel
      ? [["#", "Interviewer", "Question", "Score", "Feedback"]]
      : [["#", "Question", "Score", "Feedback"]];

    const tableBody = questionWiseScore.map((q, i) =>
      isPanel
        ? [
            `${i + 1}`,
            q.askedBy ? PANEL_LABELS[q.askedBy]?.label || "—" : "—",
            q.question,
            `${formatScore(q.score)}/10`,
            q.feedback,
          ]
        : [`${i + 1}`, q.question, `${formatScore(q.score)}/10`, q.feedback],
    );

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin, bottom: 16 },
      head: tableHead,
      body: tableBody,
      styles: {
        fontSize: 8.5,
        cellPadding: 4.5,
        valign: "top",
        lineColor: [235, 234, 230],
        lineWidth: 0.2,
        textColor: INK,
      },
      headStyles: {
        fillColor: AMBER,
        textColor: INK,
        fontStyle: "bold",
        halign: "center",
        fontSize: 8.5,
      },
      columnStyles: isPanel
        ? {
            0: { cellWidth: 8, halign: "center" },
            1: { cellWidth: 22 },
            2: { cellWidth: 45 },
            3: { cellWidth: 15, halign: "center", fontStyle: "bold" },
            4: { cellWidth: "auto" },
          }
        : {
            0: { cellWidth: 10, halign: "center" },
            1: { cellWidth: 55 },
            2: { cellWidth: 20, halign: "center", fontStyle: "bold" },
            3: { cellWidth: "auto" },
          },
      alternateRowStyles: {
        fillColor: [250, 249, 247],
      },
      // color the "Interviewer" column text to match each panelist's accent
      didParseCell: (data) => {
        if (
          isPanel &&
          data.section === "body" &&
          data.column.index === 1
        ) {
          const raw = questionWiseScore[data.row.index];
          const rgb = raw?.askedBy === "interviewerA" ? CYAN : AMBER;
          data.cell.styles.textColor = rgb;
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    // ================ FOOTER ON EVERY PAGE ================
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const pageH = doc.internal.pageSize.getHeight();
      doc.setDrawColor(230, 229, 224);
      doc.setLineWidth(0.2);
      doc.line(margin, pageH - 12, pageWidth - margin, pageH - 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...MUTED);
      doc.text("Generated by InterviewIQ.AI", margin, pageH - 7);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageH - 7, {
        align: "right",
      });
    }

    doc.save(isPanel ? "AI_Panel_Interview_report.pdf" : "AI_Interview_report.pdf");
  };

  return (
    <div className="min-h-screen relative bg-[#F7F6F3] dark:bg-[#0A0B0D] px-4 sm:px-6 lg:px-10 py-8 transition-colors duration-300 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
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

      {/* soft glow that follows the score tier */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-112 z-0"
        style={{
          background: `radial-gradient(circle at 12% 0%, ${progressColor}1F, transparent 45%), radial-gradient(circle at 92% 0%, rgba(94,200,216,0.10), transparent 40%)`,
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />

      <div className="report-root relative z-10 max-w-350 mx-auto">
        {/* ============ header ============ */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start gap-4 min-w-0">
            <button
              onClick={() => navigate("/history")}
              aria-label="Back to history"
              className="mt-1 w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#131519] border border-[#EAE9E5] dark:border-[#232830] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <FaArrowLeft className="text-[#5C6472] dark:text-[#9AA1AC]" size={14} />
            </button>

            <div className="min-w-0">
              <span className="font-mono-studio inline-flex items-center gap-1.5 text-[11px] tracking-wide text-[#B27E2E] dark:text-[#E8A94C] bg-[#E8A94C]/10 border border-[#E8A94C]/25 px-3 py-1 rounded-full mb-3">
                <IoSparklesSharp size={11} />
                AI-POWERED PERFORMANCE INSIGHTS
              </span>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-serif-display text-3xl sm:text-4xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
                  {isPanel ? "Panel Interview Analytics" : "Interview Analytics"}
                </h1>
                {isPanel && (
                  <span className="font-mono-studio text-[10px] px-2 py-1 rounded-full bg-[#8B7FD6]/10 text-[#6A5FBF] dark:text-[#B3A9F5] border border-[#8B7FD6]/20">
                    2 INTERVIEWERS
                  </span>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-2 mt-3">
                {role && (
                  <span className="font-mono-studio text-xs text-[#5C6472] dark:text-[#8B92A0]">
                    {role}
                    {company ? ` @ ${company}` : ""}
                  </span>
                )}
                {hasJobDescription && (
                  <span className="font-mono-studio text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    TAILORED TO PASTED JOB DESCRIPTION
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-[#1C1F24] dark:bg-[#EDEEF0] hover:opacity-90 text-white dark:text-[#0A0B0D] px-6 py-3 rounded-2xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] transition-all duration-200 font-semibold text-sm sm:text-base text-nowrap cursor-pointer"
            >
              <FaDownload size={13} />
              Download PDF
            </button>
            {interviewId && (
              <motion.button
                onClick={() => setShowCoach(true)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-linear-to-br from-[#F4C97A] to-[#E8A94C] text-[#1C1F24] px-6 py-3 rounded-2xl shadow-[0_10px_30px_-8px_rgba(232,169,76,0.55)] transition-all duration-200 font-semibold text-sm sm:text-base text-nowrap cursor-pointer"
              >
                <BsChatDots size={14} />
                Talk to AI Coach
              </motion.button>
            )}
          </div>
        </div>

        {/* ============ misbehavior banner ============ */}
        {wasTerminated && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-3xl border border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 sm:p-7"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 shrink-0 rounded-2xl bg-red-500/15 flex items-center justify-center">
                <IoWarningOutline className="text-red-600 dark:text-red-400" size={22} />
              </div>
              <div>
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

        {/* ============ grid ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ---------- left column ---------- */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${CARD} p-6 sm:p-8 text-center relative overflow-hidden`}
            >
              <div
                className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-25"
                style={{ backgroundColor: progressColor }}
              />
              <h3 className={`${CARD_TITLE} mb-6 relative`}>Overall Performance</h3>

              <div className="relative">
                <ScoreRing value={score} color={progressColor} />
              </div>

              <div className="mt-6 relative">
                <span
                  className={`font-mono-studio inline-block text-[10px] tracking-[0.12em] px-3 py-1 rounded-full mb-3 ${tier.pill}`}
                >
                  {tier.label}
                </span>
                <p className="font-semibold text-[#1C1F24] dark:text-[#EDEEF0] text-base leading-snug">
                  {performanceText}
                </p>
                <p className="text-[#8B92A0] text-sm mt-1.5 leading-relaxed">
                  {shortTagline}
                </p>
              </div>
            </motion.div>

            {/* ============ Panel Verdict ============ */}
            {isPanel && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 }}
                className={`${CARD} p-6 sm:p-8`}
              >
                <h3 className={`${CARD_TITLE} mb-6`}>Panel Verdict</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["interviewerA", "interviewerB"].map((key) => {
                    const persona = PANEL_LABELS[key];
                    const val = round1(perInterviewerScores[key] ?? 0);
                    return (
                      <div
                        key={key}
                        className="rounded-2xl p-4 text-center border"
                        style={{
                          borderColor: `${persona.accent}33`,
                          backgroundColor: `${persona.accent}0D`,
                        }}
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
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: persona.accent }}
                          />
                        </div>
                        <p
                          className="font-mono-studio text-[10px] tracking-wide mt-2.5"
                          style={{ color: persona.accent }}
                        >
                          {persona.label}
                        </p>
                        <p className="text-[10px] text-[#8B92A0]">{persona.subtitle}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============ Skill evaluation ============ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className={`${CARD} p-6 sm:p-8`}
            >
              <h3 className={`${CARD_TITLE} mb-6`}>Skill Evaluation</h3>
              <div className="space-y-5">
                {skills.map((s) => {
                  const skillTier = TIERS[tierFor(s.value)];
                  return (
                    <div key={s.label}>
                      <div className="flex justify-between items-baseline mb-2 text-sm">
                        <span className="text-[#3D4148] dark:text-[#C7CBD1]">
                          {s.label}
                        </span>
                        <span
                          className={`font-mono-studio font-semibold ${skillTier.text}`}
                        >
                          {formatScore(s.value)}
                          <span className="text-[10px] text-[#8B92A0] font-normal">
                            /10
                          </span>
                        </span>
                      </div>

                      <div className="bg-[#EFEEEA] dark:bg-[#1B1E24] h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value * 10}%` }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${skillTier.color}99, ${skillTier.color})`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* ============ Delivery (only when there were spoken answers) ============ */}
            {hasDelivery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`${CARD} p-6 sm:p-8`}
              >
                <h3 className={`${CARD_TITLE} mb-6`}>Speaking Delivery</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-serif-display text-2xl text-[#1C1F24] dark:text-[#EDEEF0]">
                      {formatScore(avgDeliveryScore)}
                    </p>
                    <p className="font-mono-studio text-[9px] tracking-wide text-[#8B92A0] mt-1">
                      DELIVERY /10
                    </p>
                  </div>
                  <div>
                    <p className="font-serif-display text-2xl text-[#1C1F24] dark:text-[#EDEEF0]">
                      {wpm}
                    </p>
                    <p className="font-mono-studio text-[9px] tracking-wide text-[#8B92A0] mt-1">
                      WORDS / MIN
                    </p>
                  </div>
                  <div>
                    <p className="font-serif-display text-2xl text-[#1C1F24] dark:text-[#EDEEF0]">
                      {totalFillerWords}
                    </p>
                    <p className="font-mono-studio text-[9px] tracking-wide text-[#8B92A0] mt-1">
                      FILLER WORDS
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#8B92A0] mt-5 text-center">
                  {paceLabel}. A steady pace is roughly 90 to 190 words a minute.
                </p>
              </motion.div>
            )}

            {/* ============ Proctoring ============ */}
            {proctoring && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className={`${CARD} p-6 sm:p-8`}
              >
                <h3 className={`${CARD_TITLE} mb-6`}>Proctoring Summary</h3>
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
                        className={`font-mono-studio inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          row.ok
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${row.ok ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ---------- right column ---------- */}
          <div className="lg:col-span-2 space-y-6">
            {/* quick facts */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
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

            {/* trend chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${CARD} p-6 sm:p-8`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={CARD_TITLE}>Performance Trend</h3>
                <span className="font-mono-studio text-[10px] tracking-wide text-[#8B92A0]">
                  SCORE PER QUESTION
                </span>
              </div>

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

            {/* questions breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`${CARD} p-6 sm:p-8`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className={CARD_TITLE}>Questions Breakdown</h3>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((f) => {
                    const count = filterCount(f.id);
                    const active = filter === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilter(f.id)}
                        disabled={f.id !== "all" && count === 0}
                        className={`font-mono-studio text-[11px] tracking-wide px-3 py-1.5 rounded-full border transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
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
                            <p className="font-mono-studio text-[11px] text-[#9AA1AC]">
                              Question {String(i + 1).padStart(2, "0")}
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
                          <div className="font-mono-studio bg-[#8B92A0]/12 text-[#8B92A0] px-3 py-1 rounded-full font-bold text-xs w-fit shrink-0 tracking-wide">
                            SKIPPED
                          </div>
                        ) : (
                          <div
                            className={`font-mono-studio px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit shrink-0 ${qTier.pill}`}
                          >
                            {formatScore(qScore)}/10
                          </div>
                        )}
                      </div>

                      {q.type === "coding" && q.answer && (
                        <div className="mb-4">
                          <p className="font-mono-studio text-[11px] text-[#9AA1AC] mb-1.5 flex items-center gap-1.5">
                            <BsCode size={11} /> Submitted code
                            {q.language ? ` · ${q.language}` : ""}
                          </p>
                          <pre className="font-mono-studio bg-[#0C0E11] text-[#D8DCE3] text-xs sm:text-sm p-4 rounded-xl overflow-x-auto whitespace-pre-wrap border border-[#1E2229]">
                            <code>{q.answer}</code>
                          </pre>
                        </div>
                      )}

                      <div className="bg-white dark:bg-[#111318] border border-[#E8A94C]/25 p-4 rounded-xl">
                        <p className="font-mono-studio text-[10px] text-[#B27E2E] dark:text-[#E8A94C] tracking-wide uppercase mb-1.5">
                          AI feedback
                        </p>
                        <p className="text-sm text-[#3D4148] dark:text-[#C7CBD1] leading-relaxed">
                          {q.feedback && q.feedback.trim() !== ""
                            ? q.feedback
                            : "No feedback available for this question."}
                        </p>
                      </div>

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