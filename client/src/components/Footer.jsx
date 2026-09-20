import React from "react";
import { BsRobot, BsLightningCharge, BsGraphUp, BsClockHistory } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "Start Interview", path: "/interview" },
  { label: "Practice Hub", path: "/practice" },
  { label: "My Progress", path: "/progress" },
  { label: "Interview History", path: "/history" },
  { label: "Pricing", path: "/pricing" },
];

const HIGHLIGHTS = [
  { icon: <BsLightningCharge size={12} />, text: "Free unlimited practice" },
  { icon: <BsGraphUp size={12} />, text: "Scored on every answer" },
  { icon: <BsClockHistory size={12} />, text: "Full history & PDF reports" },
];

function Footer() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center px-4 pb-10 py-4 pt-4">
      <div className="relative w-full max-w-6xl rounded-[28px] overflow-hidden bg-white/70 dark:bg-[#0F1115]/70 backdrop-blur-xl border border-white/60 dark:border-[#1E2229] shadow-lg shadow-black/5 transition-colors duration-300">
        {/* ambient glows */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#E8A94C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -left-16 w-56 h-56 bg-[#5EC8D8]/8 rounded-full blur-3xl pointer-events-none" />
        {/* amber hairline along the very top edge */}
        <span className="pointer-events-none absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-[#E8A94C]/40 to-transparent" />

        <div className="relative z-10 px-7 sm:px-10 pt-10 pb-7">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-9">
            {/* ---- brand ---- */}
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#1C1F24] dark:bg-[#E8A94C] text-[#E8A94C] dark:text-[#0A0B0D] p-2 rounded-lg shadow-md">
                  <BsRobot size={16} />
                </div>
                <h2 className="font-serif-display text-lg text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
                  InterviewIQ.AI
                </h2>
              </div>

              <p className="text-[#5C6472] dark:text-[#8B92A0] text-sm leading-relaxed">
                An AI-powered interview preparation platform built to sharpen
                communication, technical depth, and professional confidence —
                one honest rep at a time.
              </p>

              <div className="flex flex-wrap gap-2 mt-5">
                {HIGHLIGHTS.map((h) => (
                  <span
                    key={h.text}
                    className="font-mono-studio inline-flex items-center gap-1.5 text-[10px] tracking-wide px-2.5 py-1.5 rounded-full bg-[#F0EFEA]/70 dark:bg-[#181B20] border border-[#EAE9E5] dark:border-[#1E2229] text-[#5C6472] dark:text-[#8B92A0]"
                  >
                    <span className="text-[#E8A94C]">{h.icon}</span>
                    {h.text}
                  </span>
                ))}
              </div>
            </div>

            {/* ---- quick links ---- */}
            <div className="shrink-0">
              <p className="font-mono-studio text-[10px] tracking-[0.12em] uppercase text-[#9AA1AC] mb-4">
                Explore
              </p>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="group cursor-pointer text-sm text-[#5C6472] dark:text-[#8B92A0] hover:text-[#1C1F24] dark:hover:text-[#EDEEF0] transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#E8A94C]/0 group-hover:bg-[#E8A94C] transition-all duration-200" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- bottom bar ---- */}
          <div className="mt-9 pt-5 border-t border-[#EAE9E5] dark:border-[#1E2229] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-mono-studio text-[#9AA1AC] dark:text-[#565D68] text-[10px] tracking-wide text-center sm:text-left">
              BUILT WITH REACT · NODE.JS · MONGODB · OPENROUTER AI
            </p>
            <p className="font-mono-studio text-[#9AA1AC] dark:text-[#565D68] text-[10px] tracking-wide">
              © {new Date().getFullYear()} INTERVIEWIQ.AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;