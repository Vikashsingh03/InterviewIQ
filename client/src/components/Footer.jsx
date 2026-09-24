import React from "react";
import { useNavigate } from "react-router-dom";
import { BsArrowUp } from "react-icons/bs";
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
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative">
      <div className="h-px bg-linear-to-r from-transparent via-[#9A7B24]/40 dark:via-[#E8A94C]/30 to-transparent" />
      <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-20 pb-8">
        <div className="grid md:grid-cols-[1.5fr_1fr_auto] gap-12 md:gap-8">
          <div>
            <button
              onClick={() => navigate("/")}
              className="group cursor-pointer flex items-center gap-2.5 mb-6"
            >
              <span className="group-hover:scale-105 transition-transform duration-200 flex">
                <BrandMark size="sm" />
              </span>
              <span className="font-serif-display text-xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight">
                InterviewIQ<span className="text-[#9A7B24] dark:text-[#E8A94C]">.</span>
              </span>
            </button>
            <p className="text-[#3E4650] dark:text-[#8B92A0] text-[15px] leading-relaxed max-w-sm">
              Mock interviews with honest scoring — built for people who'd
              rather be nervous here than in the real room.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-7">
              {NOTES.map((t) => (
                <span
                  key={t}
                  className="font-mono-studio inline-flex items-center gap-2 text-[10px] tracking-[0.08em] text-[#5B636E] dark:text-[#8B92A0] border border-[#E8E6E1] dark:border-[#232830] rounded-full px-3.5 py-1.5"
                >
                  <span className="w-1 h-1 rotate-45 bg-[#9A7B24] dark:bg-[#E8A94C]" />
                  {t.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8A929C] dark:text-[#565D68] mb-6">
              EXPLORE
            </p>
            <ul className="space-y-3.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="group cursor-pointer text-[15px] text-[#3E4650] dark:text-[#8B92A0] hover:text-[#14171B] dark:hover:text-[#EDEEF0] transition-colors duration-200 flex items-center gap-2.5"
                  >
                    <span className="w-3 h-px bg-[#9A7B24]/0 dark:bg-[#E8A94C]/0 group-hover:bg-[#9A7B24] dark:group-hover:bg-[#E8A94C] group-hover:w-5 transition-all duration-200" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex md:flex-col items-start md:items-end justify-between gap-8">
            <div className="md:text-right">
              <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8A929C] dark:text-[#565D68] mb-4">
                BACK TO TOP
              </p>
              <button
                onClick={toTop}
                aria-label="Back to top"
                className="cursor-pointer w-12 h-12 rounded-full border border-[#E8E6E1] dark:border-[#2A2F38] flex items-center justify-center text-[#3E4650] dark:text-[#8B92A0] hover:text-[#9A7B24] dark:hover:text-[#E8A94C] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 hover:-translate-y-1 transition-all duration-200"
              >
                <BsArrowUp size={16} />
              </button>
            </div>
            <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] md:text-right leading-relaxed">
              PRACTICE — SCORE
              <br />
              IMPROVE
            </p>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none select-none overflow-hidden mt-14 -mb-4 md:-mb-8 mask-[linear-gradient(to_bottom,black_55%,transparent_98%)]"
        >
          <p className="font-serif-display italic whitespace-nowrap text-center leading-[0.85] text-[26vw] md:text-[10.5rem] text-[#14171B]/4.5 dark:text-[#EDEEF0]/5">
            InterviewIQ.
          </p>
        </div>

        <div className="relative mt-2 pt-6 border-t border-[#E8E6E1] dark:border-[#1E2229] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono-studio text-[#8A929C] dark:text-[#565D68] text-[10px] tracking-widest">
            © {new Date().getFullYear()} INTERVIEWIQ
          </p>
          <p className="font-mono-studio text-[#8A929C] dark:text-[#565D68] text-[10px] tracking-widest">
            REACT · NODE.JS · MONGODB · OPENROUTER AI
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
