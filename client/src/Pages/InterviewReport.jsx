import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ServerUrl } from "../App";
import axios from "axios";
import Step3Report from "../components/Step3Report";
import { FaArrowLeft } from "react-icons/fa";

function InterviewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await axios.get(
          ServerUrl + "/api/interview/report/" + id,
          { withCredentials: true },
        );

        setReport(result.data);
      } catch (err) {
        console.log(err);
        setError(
          err?.response?.data?.message ||
            "Couldn't load this report. It may not exist or you may not have access to it.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3] dark:bg-gray-950 transition-colors duration-300">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Loading Report...
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f3f3f3] dark:bg-gray-950 transition-colors duration-300 px-4">
        <p className="text-red-500 dark:text-red-400 text-lg text-center">
          {error || "Report not found."}
        </p>
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <FaArrowLeft size={14} /> Back to History
        </button>
      </div>
    );
  }

  return <Step3Report report={report} />;
}

export default InterviewReport;
