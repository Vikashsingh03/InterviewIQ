import React from "react";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
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
import { IoSparklesSharp } from "react-icons/io5";
import { BsCode } from "react-icons/bs";

function Step3Report({ report }) {
  const navigate = useNavigate();
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
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  // single source of truth for the score tiers — used for the headline
  // text, the PDF advice section, and the progress-bar color, so all
  // three always agree on where "excellent" starts.
  let performanceText = "";
  let shortTagline = "";
  let progressColor = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
    progressColor = "#4ADE80"; // green — matches the "passed" signal used across the app
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
    progressColor = "#E8A94C"; // amber — the app's brand accent
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
    progressColor = "#F87171"; // coral — matches the "failed" signal used across the app
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    // ================ TITLE ================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 33, 38);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;

    // underline — brand amber
    doc.setDrawColor(232, 169, 76);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;

    // ================ FINAL SCORE BOX ================
    doc.setFillColor(247, 246, 243);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, {
      align: "center",
    });

    currentY += 30;

    // ================ SKILLS BOX ================
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

    doc.setFontSize(12);

    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    currentY += 45;

    // ================ ADVICE ================
    // uses the same >=8 / >=5 tiers as the on-screen headline above,
    // so the PDF and the dashboard never disagree on a score like exactly 8
    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue supporting your answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;

    // ================ QUESTION TABLE ================
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
      },
      headStyles: {
        fillColor: [232, 169, 76],
        textColor: 30,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" }, // index
        1: { cellWidth: 55 }, // question
        2: { cellWidth: 20, halign: "center" }, // score
        3: { cellWidth: "auto" }, // feedback
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    doc.save("AI_Interview_report.pdf");
  };

  return (
    <div className="min-h-screen relative bg-[#F7F6F3] dark:bg-[#0A0B0D] px-4 sm:px-6 lg:px-10 py-8 transition-colors duration-300">
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

      <div className="report-root relative z-10 max-w-350 mx-auto">
        {/* ============ header ============ */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full flex items-start gap-4 flex-wrap">
            <button
              onClick={() => navigate("/history")}
              className="mt-1 w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#131519] border border-[#EAE9E5] dark:border-[#232830] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <FaArrowLeft className="text-[#5C6472] cursor-pointer dark:text-[#9AA1AC]" size={14} />
            </button>

            <div>
              <div className="flex items-center gap-2.5">
                <IoSparklesSharp className="text-[#E8A94C]" size={18} />
                <h1 className="font-serif-display text-2xl sm:text-3xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
                  Interview Analytics Dashboard
                </h1>
              </div>

              <p className="text-[#5C6472] dark:text-[#8B92A0] mt-2 text-sm">
                AI-powered performance insights
                {role && (
                  <span className="font-mono-studio text-[#8B92A0]">
                    {" "}
                    · {role}
                    {company ? ` @ ${company}` : ""}
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-[#1C1F24] dark:bg-[#EDEEF0] hover:opacity-90 text-white dark:text-[#0A0B0D] px-6 py-3 rounded-2xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] transition-all duration-200 font-semibold text-sm sm:text-base text-nowrap shrink-0"
          >
            <FaDownload size={13} />
            Download PDF
          </button>
        </div>

        {/* ============ grid ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] p-6 sm:p-8 text-center"
            >
              <h3 className="font-mono-studio text-[11px] tracking-wide text-[#8B92A0] mb-6 uppercase">
                Overall Performance
              </h3>
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto">
                <CircularProgressbar
                  value={percentage}
                  text={`${score}/10`}
                  styles={buildStyles({
                    textSize: "17px",
                    pathColor: progressColor,
                    textColor: progressColor,
                    trailColor: "var(--report-trail, #EFEEEA)",
                    pathTransitionDuration: 0.8,
                  })}
                />
              </div>

              <div className="mt-5">
                <p className="font-semibold text-[#1C1F24] dark:text-[#EDEEF0] text-sm sm:text-base">
                  {performanceText}
                </p>
                <p className="text-[#8B92A0] text-xs sm:text-sm mt-1.5 leading-relaxed">
                  {shortTagline}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] p-6 sm:p-8"
            >
              <h3 className="font-mono-studio text-[11px] tracking-wide text-[#8B92A0] mb-6 uppercase">
                Skill Evaluation
              </h3>
              <div className="space-y-5">
                {skills.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-[#3D4148] dark:text-[#C7CBD1]">
                        {s.label}
                      </span>
                      <span className="font-mono-studio font-semibold text-[#E8A94C]">
                        {s.value}
                      </span>
                    </div>

                    <div className="bg-[#EFEEEA] dark:bg-[#1B1E24] h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.value * 10}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-[#E8A94C] h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] p-6 sm:p-8"
            >
              <h3 className="font-mono-studio text-[11px] tracking-wide text-[#8B92A0] mb-6 uppercase">
                Performance Trend
              </h3>

              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={questionScoreData}>
                    <defs>
                      <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E8A94C" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#E8A94C" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-[#EAE9E5] dark:stroke-[#1E2229]"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "currentColor", fontFamily: "JetBrains Mono", fontSize: 11 }}
                      className="text-[#8B92A0]"
                    />
                    <YAxis
                      domain={[0, 10]}
                      tick={{ fill: "currentColor", fontFamily: "JetBrains Mono", fontSize: 11 }}
                      className="text-[#8B92A0]"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--tooltip-bg, #fff)",
                        border: "1px solid #EAE9E5",
                        borderRadius: "10px",
                        fontFamily: "JetBrains Mono",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#E8A94C"
                      strokeWidth={2.5}
                      fill="url(#scoreFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] p-6 sm:p-8"
            >
              <h3 className="font-mono-studio text-[11px] tracking-wide text-[#8B92A0] mb-6 uppercase">
                Questions Breakdown
              </h3>

              <div className="space-y-5">
                {questionWiseScore.map((q, i) => (
                  <div
                    key={i}
                    className="bg-[#FAFAF8] dark:bg-[#0C0E11] p-4 sm:p-6 rounded-2xl border border-[#EAE9E5] dark:border-[#1E2229]"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                      <div>
                        <p className="font-mono-studio text-[11px] text-[#9AA1AC]">
                          Question {String(i + 1).padStart(2, "0")}
                        </p>
                        <p className="font-serif-display text-[#1C1F24] dark:text-[#EDEEF0] text-base sm:text-lg leading-relaxed mt-0.5">
                          {q.question || "Question not available"}
                        </p>
                      </div>

                      <div className="font-mono-studio bg-[#E8A94C]/10 text-[#B27E2E] dark:text-[#E8A94C] px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit shrink-0">
                        {q.score ?? 0}/10
                      </div>
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
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step3Report;