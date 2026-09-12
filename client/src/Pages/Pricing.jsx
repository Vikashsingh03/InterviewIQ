import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { HiSparkles } from "react-icons/hi";

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

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job prepration.",
      features: [
        "650 AI Interview Credits",
        "Advance AI feedback",
        "skill Trend Anlysis",
        "Priority Ai Processing",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;

      const result = await axios.post(
        ServerUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits,
        },
        { withCredentials: true },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewAI.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          const verifypay = await axios.post(
            ServerUrl + "/api/payment/verify",
            response,
            { withCredentials: true },
          );
          dispatch(setUserData(verifypay.data.user));

          alert("Payment Successful Credits Added!");
          navigate("/");
        },
        theme: {
          color: "#10b981",
        },
      };

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert(
          "Unable to load payment gateway. Please check your internet connection.",
        );
        setLoadingPlan(null);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoadingPlan(null);
    } catch (error) {
      console.log(error);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f3f3f3] dark:bg-gray-950 py-16 px-6 transition-colors duration-300 overflow-hidden">
      {/* background glow, consistent with rest of app */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-125 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.14),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(20,184,166,0.12),transparent_35%)]"></div>
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-green-300/25 dark:bg-green-700/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob"></div>
        <div className="absolute top-20 -right-24 w-80 h-80 bg-emerald-300/25 dark:bg-emerald-700/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto mb-14 flex items-start gap-4">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate("/")}
          className="mt-2 p-3 rounded-full bg-white/80 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-md border border-white/60 dark:border-gray-800 transition"
        >
          <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
        </motion.button>

        <div className="text-center w-full">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
            <HiSparkles size={12} />
            SIMPLE, TRANSPARENT PRICING
          </span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">
            Choose Your Plan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">
            Flexible pricing to match your interview prepration goals.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
        {plans.map((plan, index) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={!plan.default ? { scale: 1.03, y: -6 } : {}}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative p-8 rounded-3xl transition-all duration-300 border backdrop-blur-md
                ${
                  isSelected
                    ? "bg-linear-to-br from-emerald-600 to-green-700 border-transparent shadow-2xl shadow-emerald-900/30 text-white"
                    : "bg-white/80 dark:bg-gray-900/70 border-gray-200 dark:border-gray-800 shadow-md dark:shadow-black/20"
                }
                ${plan.default ? "cursor-default" : "cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-800"}
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-6 right-6 bg-linear-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className="absolute top-6 right-6 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
                  Default
                </div>
              )}

              {/* Plan Name */}
              <h3
                className={`text-xl font-semibold ${isSelected ? "text-white" : "text-gray-800 dark:text-gray-100"}`}
              >
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4">
                <span
                  className={`text-3xl font-bold ${isSelected ? "text-white" : "bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent"}`}
                >
                  {plan.price}
                </span>
                <p
                  className={`mt-1 ${isSelected ? "text-emerald-100" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {plan.credits} Credits
                </p>
              </div>

              {/* Description */}
              <p
                className={`mt-4 text-sm leading-relaxed ${isSelected ? "text-emerald-50" : "text-gray-500 dark:text-gray-400"}`}
              >
                {plan.description}
              </p>

              {/* Features */}
              <div className="mt-6 space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FaCheckCircle
                      className={`text-sm shrink-0 ${isSelected ? "text-emerald-200" : "text-emerald-500 dark:text-emerald-400"}`}
                    />
                    <span
                      className={`text-sm ${isSelected ? "text-white/90" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!plan.default && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loadingPlan === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!selectedPlan) {
                      setSelectedPlan(plan.id);
                    } else {
                      handlePayment(plan);
                    }
                  }}
                  className={`w-full mt-8 py-3 rounded-xl transition font-semibold
                    ${
                      isSelected
                        ? "bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg"
                        : "text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    }
                  `}
                >
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : isSelected
                      ? "Proceed to pay"
                      : "Select plan"}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Pricing;
