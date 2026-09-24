import crypto from "crypto";
import { askAi } from "../services/openRouter.service.js";

const solutionCache = new Map();
const MAX_CACHE = 500;

const cacheKey = (question, options, answerIndex) => {
  return crypto.createHash("sha256").update(JSON.stringify({ question, options, answerIndex })).digest("hex");
};

const extractJson = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {}
  const m = String(text).match(/\{[\s\S]*\}/);
  if (m) {
    try {
      return JSON.parse(m[0]);
    } catch (e) {}
  }
  return null;
};

export const generateAptitudeSolution = async (req, res) => {
  try {
    const { question, options, answerIndex, sectionLabel } = req.body || {};
    if (!question || typeof question !== "string" || !Array.isArray(options) || options.length < 2 || typeof answerIndex !== "number" || answerIndex < 0 || answerIndex >= options.length) {
      return res.status(400).json({ message: "Invalid payload" });
    }
    const key = cacheKey(question, options, answerIndex);
    if (solutionCache.has(key)) {
      return res.status(200).json({ ...solutionCache.get(key), cached: true });
    }
    const letters = ["A", "B", "C", "D", "E", "F"];
    const optionsText = options.map((o, i) => `${letters[i]}) ${o}`).join("\n");
    const messages = [
      { role: "system", content: "You are an expert aptitude trainer for Indian MNC placement exams (TCS NQT, Infosys, Wipro, HCL). Explain every solution with clear step-by-step calculations. Return ONLY valid JSON with no markdown and no code fences." },
      { role: "user", content: `Section: ${sectionLabel || "Aptitude"}\nQuestion: ${question}\nOptions:\n${optionsText}\nCorrect option: ${letters[answerIndex]}\nWrite 3 to 5 short steps showing the actual calculation, then the final answer. JSON format: {"steps": ["step 1", "step 2"], "answer": "Answer: ..."}` }
    ];
    const raw = await askAi(messages);
    const parsed = extractJson(raw || "");
    let steps = [];
    let answer = "";
    if (parsed && Array.isArray(parsed.steps)) {
      steps = parsed.steps.map((s) => String(s)).filter((s) => s.trim());
    }
    if (parsed && parsed.answer) {
      answer = String(parsed.answer);
    }
    if (!steps.length) {
      steps = [String(raw).trim()];
      answer = "Answer: " + options[answerIndex];
    }
    const payload = { steps, answer };
    solutionCache.set(key, payload);
    if (solutionCache.size > MAX_CACHE) {
      solutionCache.delete(solutionCache.keys().next().value);
    }
    return res.status(200).json({ ...payload, cached: false });
  } catch (err) {
    return res.status(500).json({ message: "AI solution failed" });
  }
};
