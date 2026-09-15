import React from "react";
import { FaArrowLeft } from "react-icons/fa";
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

function Step3Report({ report }) {
  const navigate = useNavigate();
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3] dark:bg-gray-950 transition-colors duration-300">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
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
    progressColor = "#10b981"; // emerald — matches the ring color
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
    progressColor = "#f59e0b"; // amber
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
    progressColor = "#ef4444"; // red
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
    doc.setTextColor(34, 197, 94);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;

    // underline
    doc.setDrawColor(34, 197, 94);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;

    // ================ FINAL SCORE BOX ================
    doc.setFillColor(240, 253, 244);
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
        fillColor: [34, 197, 94],
        textColor: 255,
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50 dark:from-gray-950 dark:to-gray-950 px-4 sm:px-6 lg:px-10 py-8 transition-colors duration-300">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="md:mb-10 w-full flex items-start gap-4 flex-wrap">
          <button
            onClick={() => navigate("/history")}
            className="mt-1 p-3 rounded-full bg-white dark:bg-gray-900 dark:border dark:border-gray-800 shadow hover:shadow-md transition "
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50 flex-nowrap">
              Interview Analytics Dashboard
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Ai-powered performance insights
            </p>
          </div>
        </div>

        <button
          onClick={downloadPDF}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-md shadow-emerald-900/20 transition-all duration-300 font-semibold text-sm sm:text-base text-nowrap"
        >
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-2xl sm:rounded-3xl shadow-lg dark:shadow-black/30 p-6 sm:p-8 text-center"
          >
            <h3 className="text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Overall Performance
            </h3>
            <div className="relative w-20 h-20 sm:w-25 sm:h-25 mx-auto">
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: progressColor,
                  textColor: progressColor,
                  trailColor: "#e5e7eb",
                })}
              />
            </div>

            <div className="mt-4">
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                {performanceText}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
                {shortTagline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-2xl sm:rounded-3xl shadow-lg dark:shadow-black/30 p-6 sm:p-8 "
          >
            <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-6 text-base sm:text-lg">
              Skill Evaluation
            </h3>
            <div className="space-y-5">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span className="text-gray-700 dark:text-gray-300">
                      {s.label}
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {s.value}
                    </span>
                  </div>

                  <div className="bg-gray-200 dark:bg-gray-800 h-2 sm:h-3 rounded-full">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{ width: `${s.value * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-2xl sm:rounded-3xl shadow-lg dark:shadow-black/30 p-6 sm:p-8 "
          >
            <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-4 sm:mb-6 text-base sm:text-lg">
              Performance Trend
            </h3>

            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-800"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "currentColor" }}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fill: "currentColor" }}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg, #fff)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    fill="#bbf7d0"
                    fillOpacity={0.5}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-2xl sm:rounded-3xl shadow-lg dark:shadow-black/30 p-6 sm:p-8 "
          >
            <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-4 sm:mb-6 text-base sm:text-lg">
              Questions Breakdown
            </h3>

            <div className="space-y-6">
              {questionWiseScore.map((q, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Question {i + 1}
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base leading-relaxed">
                        {q.question || "Question not available"}
                      </p>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit">
                      {q.score ?? 0}/10
                    </div>
                  </div>

                  {q.type === "coding" && q.answer && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                        Submitted code
                        {q.language ? ` (${q.language})` : ""}
                      </p>
                      <pre className="bg-gray-900 text-gray-100 text-xs sm:text-sm p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                        <code>{q.answer}</code>
                      </pre>
                    </div>
                  )}

                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/40 p-4 rounded-lg">
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">
                      AI feedback
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
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
  );
}

export default Step3Report;
