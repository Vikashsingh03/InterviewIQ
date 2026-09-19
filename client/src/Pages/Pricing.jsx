import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import {
  BsShieldCheck,
  BsLightningCharge,
  BsCreditCard2Front,
  BsStars,
} from "react-icons/bs";
import { IoSparklesSharp, IoWarningOutline } from "react-icons/io5";

// each mock interview costs this many credits — keep in sync with the server
// (interview.controller.js deducts the same amount when an interview starts)
const CREDITS_PER_INTERVIEW = 50;

// display data only. The server decides the real price/credits for a plan
// from planId (payment.controller.js), so tampering here changes nothing.
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
    icon: BsShieldCheck,
    title: "Secure checkout",
    text: "Payments are processed by Razorpay. We never see your card details.",
  },
  {
    icon: BsLightningCharge,
    title: "Credits added instantly",
    text: "Your balance updates the moment your payment is confirmed.",
  },
  {
    icon: BsCreditCard2Front,
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

const interviewsFor = (credits) => Math.floor(credits / CREDITS_PER_INTERVIEW);
const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;

function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [notice, setNotice] = useState(null); // { type: "success" | "error", text }
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
      // load checkout first, so a blocked script never leaves a dangling order
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
          // the server ignores these two and uses its own plan table; they are
          // only sent so an older server build keeps working
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
            // "Already processed" replies carry no user: never wipe the
            // logged-in user by dispatching undefined
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
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          z-index: 0;
        }
      `}</style>

      <div className="film-grain" />

      {/* soft amber + teal glow, same as the rest of the app */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-125 overflow-hidden z-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(232,169,76,0.12),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(94,200,216,0.08),transparent_35%)]"></div>
      </div>

      <div className="pricing-root relative z-10 w-[92vw] max-w-6xl mx-auto py-12 sm:py-16">
        {/* ============ header ============ */}
        <div className="relative mb-12 sm:mb-14">
          <motion.button
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/")}
            className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#131519]/90 backdrop-blur-md shadow-sm hover:shadow-md border border-[#EAE9E5] dark:border-[#232830] transition-all duration-200"
          >
            <FaArrowLeft
              className="text-[#5C6472] cursor-pointer dark:text-[#9AA1AC]"
              size={14}
            />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center px-14"
          >
            <span className="font-mono-studio inline-flex items-center gap-1.5 text-[11px] tracking-wide text-[#B27E2E] dark:text-[#E8A94C] bg-[#E8A94C]/10 border border-[#E8A94C]/25 px-3 py-1 rounded-full mb-4">
              <IoSparklesSharp size={11} />
              SIMPLE, TRANSPARENT PRICING
            </span>
            <h1 className="font-serif-display text-4xl md:text-5xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
              Choose your plan
            </h1>
            <p className="text-[#5C6472] dark:text-[#8B92A0] mt-3 text-base sm:text-lg max-w-xl mx-auto">
              Pay once, practise as much as you need. Every mock interview uses{" "}
              {CREDITS_PER_INTERVIEW} credits.
            </p>

            {typeof balance === "number" && (
              <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-white/90 dark:bg-[#111318]/90 backdrop-blur-md border border-[#EAE9E5] dark:border-[#1E2229] rounded-2xl sm:rounded-full px-5 py-2.5 shadow-sm">
                <BsStars className="text-[#E8A94C]" size={14} />
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

        {/* ============ payment result ============ */}
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
                  <FaCheck
                    size={14}
                    className="text-[#2E9C5A] dark:text-[#4ADE80] mt-1 shrink-0"
                  />
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

        {/* ============ plans ============ */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan, index) => {
            const featured = !!plan.featured;
            const isLoading = loadingPlan === plan.id;

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
                key={plan.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={plan.isDefault ? {} : { y: -6 }}
                className={`relative flex flex-col rounded-3xl p-7 sm:p-8 border transition-colors duration-300 ${
                  featured
                    ? "bg-[#15181D] border-[#E8A94C]/40 shadow-[0_30px_80px_-30px_rgba(232,169,76,0.35)]"
                    : "bg-white/90 dark:bg-[#111318]/90 backdrop-blur-md border-[#EAE9E5] dark:border-[#1E2229] shadow-[0_20px_50px_-28px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_-28px_rgba(0,0,0,0.7)] hover:border-[#E8A94C]/40"
                }`}
              >
                {featured && (
                  <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-[#E8A94C] to-transparent" />
                )}

                {/* badge */}
                {plan.badge && (
                  <span className="font-mono-studio absolute top-6 right-6 text-[10px] tracking-wide font-semibold px-3 py-1 rounded-full bg-[#E8A94C] text-[#1C1F24]">
                    {plan.badge}
                  </span>
                )}
                {plan.isDefault && (
                  <span className="font-mono-studio absolute top-6 right-6 text-[10px] tracking-wide px-3 py-1 rounded-full border border-[#EAE9E5] dark:border-[#262B34] text-[#8B92A0]">
                    DEFAULT
                  </span>
                )}

                <h3 className={`font-serif-display text-xl ${title}`}>
                  {plan.name}
                </h3>

                {/* price */}
                <div className="mt-5 flex items-baseline gap-2">
                  <span
                    className={`font-serif-display text-5xl tracking-tight ${title}`}
                  >
                    {formatPrice(plan.price)}
                  </span>
                  <span className={`text-sm ${muted}`}>
                    {plan.price === 0 ? "forever" : "one-time"}
                  </span>
                </div>

                {/* what you get */}
                <div className="mt-5 flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-mono-studio text-[11px] tracking-wide px-2.5 py-1 rounded-full border ${
                      featured
                        ? "bg-[#E8A94C]/15 border-[#E8A94C]/30 text-[#E8A94C]"
                        : "bg-[#E8A94C]/10 border-[#E8A94C]/25 text-[#B27E2E] dark:text-[#E8A94C]"
                    }`}
                  >
                    {plan.credits} CREDITS
                  </span>
                  <span className={`text-xs ${muted}`}>
                    ≈ {interviewsFor(plan.credits)} mock interviews
                  </span>
                </div>

                <p className={`mt-5 text-sm leading-relaxed md:min-h-12 ${muted}`}>
                  {plan.description}
                </p>

                <div className={`my-6 border-t ${divider}`} />

                {/* features */}
                <ul className="space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${
                          featured
                            ? "bg-[#E8A94C]/20 text-[#E8A94C]"
                            : "bg-[#E8A94C]/10 text-[#B27E2E] dark:text-[#E8A94C]"
                        }`}
                      >
                        <FaCheck size={9} />
                      </span>
                      <span className={`text-sm ${featureText}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* action */}
                <div className="mt-auto pt-8">
                  {plan.isDefault ? (
                    <div className="w-full py-3.5 rounded-2xl text-center text-sm font-semibold border border-[#EAE9E5] dark:border-[#262B34] text-[#8B92A0] cursor-default">
                      Included with your account
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={!!loadingPlan}
                      onClick={() => handlePayment(plan)}
                      className={`w-full py-3.5 rounded-2xl font-semibold text-sm cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                        featured
                          ? "bg-[#E8A94C] hover:bg-[#F0B865] text-[#1C1F24] shadow-[0_10px_30px_-8px_rgba(232,169,76,0.5)]"
                          : "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] hover:shadow-[0_14px_36px_-8px_rgba(0,0,0,0.4)]"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
                          />
                          Opening checkout...
                        </>
                      ) : (
                        `Get ${plan.name}`
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ============ trust strip ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 grid sm:grid-cols-3 gap-4"
        >
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-2xl p-5 bg-white/70 dark:bg-[#111318]/70 border border-[#EAE9E5] dark:border-[#1E2229]"
            >
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#E8A94C]/10 border border-[#E8A94C]/25 flex items-center justify-center text-[#B27E2E] dark:text-[#E8A94C]">
                <Icon size={17} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C1F24] dark:text-[#EDEEF0]">
                  {title}
                </p>
                <p className="text-xs leading-relaxed text-[#5C6472] dark:text-[#8B92A0] mt-1">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Pricing;