import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { IoWarningOutline } from "react-icons/io5";

const CREDITS_PER_INTERVIEW = 50;

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    credits: 100,
    description: "Perfect for beginners starting their interview preparation.",
    features: [
      "100 AI interview credits",
      "Basic performance report",
      "Voice interview access",
      "Limited history tracking",
    ],
    isDefault: true,
  },
  {
    id: "basic",
    name: "Starter Pack",
    price: 100,
    credits: 150,
    description: "Great for focused practice and steady skill improvement.",
    features: [
      "150 AI interview credits",
      "Detailed feedback",
      "Performance analytics",
      "Full interview history",
    ],
  },
  {
    id: "pro",
    name: "Pro Pack",
    price: 500,
    credits: 650,
    description: "Best value for serious, job-focused preparation.",
    features: [
      "650 AI interview credits",
      "Advanced AI feedback",
      "Skill trend analysis",
      "Priority AI processing",
    ],
    featured: true,
    badge: "BEST VALUE",
  },
];

const TRUST = [
  {
    title: "Secure checkout",
    text: "Payments are processed by Razorpay. We never see your card details.",
  },
  {
    title: "Credits added instantly",
    text: "Your balance updates the moment your payment is confirmed.",
  },
  {
    title: "One-time payment",
    text: "No subscription and no auto-renewal. Buy credits only when you need them.",
  },
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function useCountUp(target, duration, active, delay) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    let started = false;
    const t0 = performance.now() + delay * 1000;
    const tick = (t) => {
      if (t < t0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      started = true;
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active, delay]);
  return val;
}

const interviewsFor = (credits) => Math.floor(credits / CREDITS_PER_INTERVIEW);
const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;

function PlanCard({ plan, index, loadingPlan, onPay }) {
  const featured = !!plan.featured;
  const isLoading = loadingPlan === plan.id;
  const num = String(index + 1).padStart(2, "0");
  const animPrice = useCountUp(plan.price, 1000, true, 0.45 + index * 0.12);

  const title = featured
    ? "text-white"
    : "text-[#1C1F24] dark:text-[#EDEEF0]";
  const muted = featured
    ? "text-[#9AA1AC]"
    : "text-[#5C6472] dark:text-[#8B92A0]";
  const divider = featured
    ? "border-white/10"
    : "border-[#EAE9E5] dark:border-[#1E2229]";
  const featureText = featured
    ? "text-[#D8DCE3]"
    : "text-[#3D4148] dark:text-[#C7CBD1]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={plan.isDefault ? {} : { y: -8 }}
      className={`relative flex flex-col rounded-3xl p-7 sm:p-8 border transition-all duration-300 overflow-hidden ${
        featured
          ? "bg-[#0C0E11] border-2 border-[#E8A94C]/70 md:scale-[1.045] z-10"
          : "bg-white dark:bg-[#111318] border-[#EAE9E5] dark:border-[#1E2229] hover:border-[#E8A94C]/40"
      }`}
    >
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.35 + index * 0.1, ease: "easeOut" }}
        className="absolute top-0 left-8 right-8 h-0.5 bg-[#E8A94C] origin-left"
      />

      {featured && (
        <>
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-[#E8A94C]/8 to-transparent shine-sweep" />
          <span className="pointer-events-none absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#E8A94C]" />
          <span className="pointer-events-none absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#E8A94C]" />
          <span className="pointer-events-none absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#E8A94C]" />
          <span className="pointer-events-none absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#E8A94C]" />
        </>
      )}

      <div className="relative flex items-start justify-between mb-7">
        <span className="font-mono-studio text-sm font-bold tracking-[0.2em] text-[#B27E2E] dark:text-[#E8A94C]">
          {num}
        </span>
        {plan.badge && (
          <span className="font-mono-studio text-[10px] tracking-wide font-semibold px-3 py-1 rounded-full bg-[#E8A94C] text-[#1C1F24]">
            {plan.badge}
          </span>
        )}
        {plan.isDefault && (
          <span className="font-mono-studio text-[10px] tracking-wide px-3 py-1 rounded-full border border-[#EAE9E5] dark:border-[#262B34] text-[#8B92A0]">
            DEFAULT
          </span>
        )}
      </div>

      <h3 className={`relative font-serif-display text-2xl tracking-tight ${title}`}>
        {plan.name}
      </h3>

      <div className="relative mt-4 flex items-baseline gap-3">
        <span className={`font-serif-display text-6xl tracking-tight leading-none ${title}`}>
          {formatPrice(animPrice)}
        </span>
        <span className={`font-mono-studio text-[10px] tracking-[0.18em] ${muted}`}>
          {plan.price === 0 ? "FOREVER" : "ONE-TIME"}
        </span>
      </div>

      <div className="relative mt-5 flex items-center gap-2.5 flex-wrap">
        <span
          className={`font-mono-studio text-[11px] tracking-[0.14em] px-2.5 py-1 rounded-md border ${
            featured
              ? "bg-[#E8A94C]/15 border-[#E8A94C]/30 text-[#E8A94C]"
              : "bg-[#E8A94C]/10 border-[#E8A94C]/25 text-[#B27E2E] dark:text-[#E8A94C]"
          }`}
        >
          {plan.credits} CREDITS
        </span>
        <span className={`font-mono-studio text-[10px] tracking-[0.12em] ${muted}`}>
          ≈ {interviewsFor(plan.credits)} MOCK INTERVIEWS
        </span>
      </div>

      <p className={`relative mt-5 text-sm leading-relaxed md:min-h-12 ${muted}`}>
        {plan.description}
      </p>

      <div className={`relative my-6 border-t ${divider}`} />

      <ul className="relative space-y-3.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#E8A94C] shrink-0 mt-1.5" />
            <span className={`text-sm ${featureText}`}>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-8">
        {plan.isDefault ? (
          <div className="w-full py-4 rounded-2xl text-center text-sm font-semibold border border-[#EAE9E5] dark:border-[#262B34] text-[#8B92A0] cursor-default">
            Included with your account
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            disabled={!!loadingPlan}
            onClick={() => onPay(plan)}
            className={`relative w-full py-4 rounded-2xl font-semibold text-sm cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden ${
              featured
                ? "bg-[#E8A94C] hover:bg-[#F0B865] text-[#1C1F24]"
                : "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D]"
            }`}
          >
            {featured && !isLoading && (
              <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/40 to-transparent shine-sweep" />
            )}
            {isLoading ? (
              <span className="relative flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
                />
                Opening checkout...
              </span>
            ) : (
              <span className="relative">Get {plan.name}</span>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [notice, setNotice] = useState(null);
  const redirectTimerRef = useRef(null);

  useEffect(() => {
    loadRazorpayScript();
    return () => clearTimeout(redirectTimerRef.current);
  }, []);

  const handlePayment = async (plan) => {
    if (loadingPlan) return;
    setNotice(null);
    setLoadingPlan(plan.id);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setNotice({
          type: "error",
          text: "Unable to load the payment gateway. Please check your internet connection and try again.",
        });
        return;
      }

      const result = await axios.post(
        ServerUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: plan.price,
          credits: plan.credits,
        },
        { withCredentials: true },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewIQ.AI",
        description: `${plan.name} · ${plan.credits} credits`,
        order_id: result.data.id,

        handler: async function (response) {
          try {
            const verifypay = await axios.post(
              ServerUrl + "/api/payment/verify",
              response,
              { withCredentials: true },
            );
            if (verifypay.data?.user) {
              dispatch(setUserData(verifypay.data.user));
            }
            setNotice({
              type: "success",
              text: "Payment successful. Your credits have been added.",
            });
            redirectTimerRef.current = setTimeout(() => navigate("/"), 1600);
          } catch (err) {
            console.log(err);
            setNotice({
              type: "error",
              text:
                err?.response?.data?.message ||
                "We couldn't confirm your payment. If money was deducted, please contact support with your payment ID.",
            });
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(null),
        },
        theme: {
          color: "#E8A94C",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        setNotice({
          type: "error",
          text:
            resp?.error?.description ||
            "The payment didn't go through. Please try again.",
        });
      });
      rzp.open();
    } catch (error) {
      console.log(error);
      setNotice({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Something went wrong while starting the payment. Please try again.",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const balance = userData?.credits;

  return (
    <div className="relative min-h-screen bg-[#F7F6F3] dark:bg-[#0A0B0D] transition-colors duration-300 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .pricing-root, .pricing-root * { font-family: 'Manrope', sans-serif; }
        .pricing-root .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .pricing-root .font-mono-studio { font-family: 'JetBrains Mono', monospace; }

        .film-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.025;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/rect%3E%3C/svg%3E");
          z-index: 0;
        }

        @keyframes shineSweep {
          0% { transform: translateX(-130%) skewX(-12deg); opacity: 0; }
          12% { opacity: 1; }
          45% { transform: translateX(340%) skewX(-12deg); opacity: 1; }
          60%, 100% { transform: translateX(340%) skewX(-12deg); opacity: 0; }
        }
        .shine-sweep { animation: shineSweep 7s ease-in-out infinite; }
      `}</style>

      <div className="film-grain" />

      <div className="pricing-root relative z-10 w-[92vw] max-w-6xl mx-auto py-12 sm:py-16">
        <div className="relative mb-12 sm:mb-14">
          <motion.button
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/")}
            aria-label="Go back to home"
            className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-[#131519] border border-[#EAE9E5] dark:border-[#232830] transition-all duration-200 cursor-pointer"
          >
            <FaArrowLeft
              className="text-[#5C6472] dark:text-[#9AA1AC]"
              size={14}
            />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="text-center px-14"
          >
            <div className="inline-flex items-center gap-2 bg-[#E8A94C]/8 border border-[#E8A94C]/20 px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#E8A94C] shrink-0" />
              <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#B27E2E] dark:text-[#E8A94C]">
                SIMPLE, TRANSPARENT PRICING
              </span>
            </div>
            <h1 className="font-serif-display text-4xl sm:text-6xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight leading-[1.05]">
              Choose your plan
            </h1>
            <p className="text-[#5C6472] dark:text-[#8B92A0] mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Pay once, practise as much as you need. Every mock interview uses{" "}
              {CREDITS_PER_INTERVIEW} credits.
            </p>

            {typeof balance === "number" && (
              <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-full px-5 py-2.5">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#E8A94C] shrink-0" />
                <span className="text-sm text-[#5C6472] dark:text-[#9AA1AC] whitespace-nowrap">
                  Your balance
                </span>
                <span className="font-mono-studio text-sm font-semibold text-[#1C1F24] dark:text-[#EDEEF0] whitespace-nowrap">
                  {balance} credits
                </span>
                <span className="text-xs text-[#9AA1AC] dark:text-[#565D68] whitespace-nowrap">
                  ≈ {interviewsFor(balance)} interviews
                </span>
              </div>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`mb-8 max-w-2xl mx-auto rounded-2xl p-4 flex items-start justify-between gap-3 border ${
                notice.type === "success"
                  ? "bg-[#4ADE80]/10 border-[#4ADE80]/30"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/40"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {notice.type === "success" ? (
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#4ADE80] shrink-0 mt-1.5" />
                ) : (
                  <IoWarningOutline
                    size={17}
                    className="text-red-600 dark:text-red-400 mt-0.5 shrink-0"
                  />
                )}
                <p
                  className={`text-sm leading-relaxed ${
                    notice.type === "success"
                      ? "text-[#1F6B3F] dark:text-[#86EFAC]"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {notice.text}
                </p>
              </div>
              <button
                onClick={() => setNotice(null)}
                className="text-xs font-semibold text-[#5C6472] dark:text-[#9AA1AC] shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={index}
              loadingPlan={loadingPlan}
              onPay={handlePayment}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 grid sm:grid-cols-3 rounded-3xl border border-[#EAE9E5] dark:border-[#1E2229] overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-[#EAE9E5] dark:divide-[#1E2229]"
        >
          {TRUST.map((t, i) => (
            <div key={t.title} className="bg-white dark:bg-[#111318] p-6">
              <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8B92A0] mb-3">
                {String(i + 1).padStart(2, "0")} · {t.title.toUpperCase()}
              </p>
              <p className="text-sm leading-relaxed text-[#3D4148] dark:text-[#C7CBD1]">
                {t.text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Pricing;
