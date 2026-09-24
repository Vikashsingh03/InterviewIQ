import React from "react";
import { useNavigate } from "react-router-dom";
import { BrandMark } from "./Navbar";

const FOOTER_LINKS = [
  { label: "Start Interview", path: "/interview" },
  { label: "Practice Hub", path: "/practice" },
  { label: "My Progress", path: "/progress" },
  { label: "Interview History", path: "/history" },
  { label: "Pricing", path: "/pricing" },
];

const NOTES = [
  "Free unlimited practice",
  "Scored on every answer",
  "Full history & PDF reports",
];

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-[#E5E4E0] dark:border-[#1E2229]">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <BrandMark size="sm" />
              <h2 className="font-serif-display text-lg text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
                InterviewIQ<span className="text-[#B27E2E] dark:text-[#E8A94C]">.</span>
              </h2>
            </div>
            <p className="text-[#5C6472] dark:text-[#8B92A0] text-[15px] leading-relaxed">
              Mock interviews with honest scoring — built for people who'd
              rather be nervous here than in the real room.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6">
              {NOTES.map((t) => (
                <span
                  key={t}
                  className="font-mono-studio inline-flex items-center gap-2 text-[10px] tracking-[0.08em] text-[#8B92A0]"
                >
                  <span className="w-1 h-1 rotate-45 bg-[#E8A94C]" />
                  {t.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#9AA1AC] mb-5">
              EXPLORE
            </p>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="group cursor-pointer text-[15px] text-[#5C6472] dark:text-[#8B92A0] hover:text-[#1C1F24] dark:hover:text-[#EDEEF0] transition-colors duration-200 flex items-center gap-2.5"
                  >
                    <span className="w-3 h-px bg-[#E8A94C]/0 group-hover:bg-[#E8A94C] group-hover:w-4 transition-all duration-200" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E5E4E0] dark:border-[#1E2229] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono-studio text-[#9AA1AC] dark:text-[#565D68] text-[10px] tracking-[0.08em]">
            © {new Date().getFullYear()} INTERVIEWIQ
          </p>
          <p className="font-mono-studio text-[#9AA1AC] dark:text-[#565D68] text-[10px] tracking-[0.08em]">
            REACT · NODE.JS · MONGODB · OPENROUTER AI
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
