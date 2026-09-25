import { askAi } from "../services/openRouter.service.js";
import { runTestCases } from "../services/codeExecution.service.js";
import DSA_QUESTION_BANK from "../data/dsaQuestions.js";
import { getStarterCode, getFuncName } from "../data/dsaStarters.js";
import PRACTICE_HR_BANK from "../data/practiceQuestions.js";
import practiceAttemptModel from "../models/practiceAttempt.model.js";

const VALID_CODE_LANGUAGES = ["javascript", "python", "cpp", "java"];

export const getPracticeQuestions = async (req, res) => {
  try {
    const coding = DSA_QUESTION_BANK.map((q) => ({
      id: q.id,
      type: "coding",
      title: q.title,
      topic: q.topic,
      difficulty: q.difficulty,
      companies: q.companies || [],
      totalTests: q.testCases.length,
    }));

    const hr = PRACTICE_HR_BANK.map((q) => ({
      id: q.id,
      type: "hr",
      title: q.question,
      category: q.category,
      difficulty: q.difficulty,
    }));

    const topicMap = {};
    DSA_QUESTION_BANK.forEach((q) => {
      if (!topicMap[q.topic]) {
        topicMap[q.topic] = {
          topic: q.topic,
          total: 0,
          easy: 0,
          medium: 0,
          hard: 0,
        };
      }
      topicMap[q.topic].total += 1;
      if (q.difficulty === "easy") topicMap[q.topic].easy += 1;
      else if (q.difficulty === "medium") topicMap[q.topic].medium += 1;
      else if (q.difficulty === "hard") topicMap[q.topic].hard += 1;
    });

    const companySet = new Set();
    DSA_QUESTION_BANK.forEach((q) =>
      (q.companies || []).forEach((c) => companySet.add(c)),
    );

    return res.status(200).json({
      coding,
      hr,
      topics: Object.values(topicMap),
      companies: [...companySet].sort(),
      totalCoding: coding.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to load practice questions: ${error.message}`,
    });
  }
};

export const getPracticeQuestionDetail = async (req, res) => {
  try {
    const { type, id } = req.params;

    if (type === "coding") {
      const q = DSA_QUESTION_BANK.find((item) => item.id === id);
      if (!q) return res.status(404).json({ message: "Question not found." });

      const language = VALID_CODE_LANGUAGES.includes(req.query.language)
        ? req.query.language
        : "javascript";

      return res.status(200).json({
        type: "coding",
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        topic: q.topic,
        companies: q.companies || [],
        description: q.description,
        constraints: q.constraints || [],
        examples: q.examples || [],
        images: q.images || [],
        hints: q.hints || [],
        io: q.io,
        starterCode:
          getStarterCode(q.io, language, getFuncName(q.id, language), q.returns) || "",
        sampleTestCases: q.testCases.slice(0, 3),
        totalTests: q.testCases.length,
        languages: VALID_CODE_LANGUAGES,
      });
    }

    if (type === "hr") {
      const q = PRACTICE_HR_BANK.find((item) => item.id === id);
      if (!q) return res.status(404).json({ message: "Question not found." });

      return res.status(200).json({
        type: "hr",
        id: q.id,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
      });
    }

    return res.status(400).json({ message: "Invalid question type." });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to load question: ${error.message}`,
    });
  }
};

export const runPracticeCode = async (req, res) => {
  try {
    const { questionId, code, language } = req.body;

    if (!questionId || !code || !language) {
      return res.status(400).json({
        message: "questionId, code and language are required.",
      });
    }

    const dsaQuestion = DSA_QUESTION_BANK.find((q) => q.id === questionId);
    if (!dsaQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }

    const sampleCases = dsaQuestion.testCases.slice(0, 3);
    const runResult = await runTestCases({
      language,
      code,
      testCases: sampleCases,
      io: dsaQuestion.io,
      funcName: getFuncName(dsaQuestion.id, language),
      returns: dsaQuestion.returns,
    });

    if (!runResult.supported) {
      return res
        .status(200)
        .json({ results: [], supported: false, message: runResult.message });
    }

    return res.status(200).json({ results: runResult.results, supported: true });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to run code: ${error.message}`,
    });
  }
};

const logAttempt = async ({
  userId,
  questionType,
  questionId,
  category,
  difficulty,
  language,
  score,
  testsPassed,
  testsTotal,
}) => {
  try {
    await practiceAttemptModel.create({
      userId,
      questionType,
      questionId,
      category,
      difficulty,
      language: language || null,
      score,
      testsPassed: testsPassed ?? null,
      testsTotal: testsTotal ?? null,
    });
  } catch (error) {
    console.log("Failed to log practice attempt:", error.message);
  }
};

export const submitPracticeAnswer = async (req, res) => {
  try {
    const { type, questionId, answer, language } = req.body;

    if (!type || !questionId) {
      return res
        .status(400)
        .json({ message: "type and questionId are required." });
    }

    if (type === "coding") {
      const dsaQuestion = DSA_QUESTION_BANK.find((q) => q.id === questionId);
      if (!dsaQuestion) {
        return res.status(404).json({ message: "Question not found." });
      }

      if (!answer || !language) {
        return res
          .status(400)
          .json({ message: "answer (code) and language are required." });
      }

      const runResult = await runTestCases({
        language,
        code: answer,
        testCases: dsaQuestion.testCases,
        io: dsaQuestion.io,
        funcName: getFuncName(dsaQuestion.id, language),
        returns: dsaQuestion.returns,
      });

      if (!runResult.supported) {
        const fallbackMessages = [
          {
            role: "system",
            content: `You are a senior engineer reviewing practice code. Automated test
                execution isn't available for this language, so judge correctness,
                communication, and confidence yourself from reading the code.
                Score these (0 to 10): confidence, communication, correctness.
                finalScore = average, rounded to nearest whole number.
                Feedback: 10-20 words, natural code-review tone.
                Return ONLY JSON:
                { "confidence": number, "communication": number, "correctness": number, "finalScore": number, "feedback": "..." }`,
          },
          {
            role: "user",
            content: `Problem: ${dsaQuestion.title} — ${dsaQuestion.description}\nLanguage: ${language}\nCode:\n${answer}`,
          },
        ];

        let parsed;
        try {
          const raw = await askAi(fallbackMessages);
          parsed = JSON.parse(
            raw
              .replace(/^```(?:json)?\s*/i, "")
              .replace(/\s*```$/, "")
              .trim(),
          );
        } catch {
          parsed = {
            confidence: 5,
            communication: 5,
            correctness: 5,
            finalScore: 5,
            feedback:
              runResult.message ||
              "Automated grading unavailable for this language.",
          };
        }

        await logAttempt({
          userId: req.userId,
          questionType: "coding",
          questionId,
          category: dsaQuestion.topic,
          difficulty: dsaQuestion.difficulty,
          language,
          score: parsed.finalScore,
        });

        return res.status(200).json({
          score: parsed.finalScore,
          confidence: parsed.confidence,
          communication: parsed.communication,
          correctness: parsed.correctness,
          feedback: parsed.feedback,
          testResults: null,
        });
      }

      const testResults = runResult.results;
      const testsPassedCount = testResults.filter((r) => r.passed).length;
      const testsTotalCount = testResults.length;
      const correctness = testsTotalCount
        ? Math.round((testsPassedCount / testsTotalCount) * 10)
        : 0;

      const hasTle = testResults.some((r) => r.errorKind === "tle");
      const hasCompile = testResults.some((r) => r.errorKind === "compile");
      const hasRuntime = testResults.some((r) => r.errorKind === "runtime");
      const verdict =
        testsPassedCount === testsTotalCount
          ? "accepted"
          : hasTle
            ? "time_limit_exceeded"
            : hasCompile
              ? "compile_error"
              : hasRuntime
                ? "runtime_error"
                : "wrong_answer";

      const reviewMessages = [
        {
          role: "system",
          content: `You are a senior software engineer doing a quick code review.
              You already know how many hidden test cases passed (fixed, not yours to judge).
              Score ONLY these two (0 to 10): communication (readability/structure) and
              confidence (efficiency, robustness, edge cases). Do NOT judge correctness.
              Feedback: 10-20 words, natural code-review tone, one concrete observation,
              do NOT mention pass/fail counts.
              Return ONLY JSON:
              { "confidence": number, "communication": number, "feedback": "..." }`,
        },
        {
          role: "user",
          content: `Problem: ${dsaQuestion.title} — ${dsaQuestion.description}
              Language: ${language}
              Tests passed: ${testsPassedCount}/${testsTotalCount}
              Candidate's code:
              \`\`\`${language}
              ${answer}
              \`\`\``,
        },
      ];

      let reviewParsed;
      const needsReview = verdict === "accepted" || verdict === "wrong_answer";
      if (needsReview) {
        try {
          const raw = await Promise.race([
            askAi(reviewMessages),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("ai-timeout")), 15000),
            ),
          ]);
          reviewParsed = JSON.parse(
            raw
              .replace(/^```(?:json)?\s*/i, "")
              .replace(/\s*```$/, "")
              .trim(),
          );
        } catch {
          reviewParsed = null;
        }
      }
      if (!reviewParsed) {
        reviewParsed = {
          confidence: correctness,
          communication: correctness,
          feedback:
            testsPassedCount === testsTotalCount
              ? "All test cases passed."
              : `${testsPassedCount} of ${testsTotalCount} test cases passed.`,
        };
      }

      const confidence = reviewParsed.confidence ?? correctness;
      const communication = reviewParsed.communication ?? correctness;
      const finalScore = Math.round(
        (correctness + confidence + communication) / 3,
      );

      await logAttempt({
        userId: req.userId,
        questionType: "coding",
        questionId,
        category: dsaQuestion.topic,
        difficulty: dsaQuestion.difficulty,
        language,
        score: finalScore,
        testsPassed: testsPassedCount,
        testsTotal: testsTotalCount,
      });

      const failIdx = testResults.findIndex((r) => !r.passed && !r.skipped);
      const failedCase =
        failIdx >= 0
          ? {
              index: failIdx,
              input: testResults[failIdx].input,
              expectedOutput: testResults[failIdx].expectedOutput,
              actualOutput: testResults[failIdx].actualOutput,
              error: testResults[failIdx].error,
              errorKind: testResults[failIdx].errorKind,
            }
          : null;

      return res.status(200).json({
        score: finalScore,
        confidence,
        communication,
        correctness,
        feedback:
          `${testsPassedCount}/${testsTotalCount} test cases passed. ${reviewParsed.feedback || ""}`.trim(),
        verdict,
        testsPassedCount,
        testsTotalCount,
        failedCase,
        sampleResults: testResults.slice(0, 3),
        hiddenResults: testResults
          .slice(3)
          .map((r, i) => ({ index: i + 3, passed: r.passed, skipped: r.skipped })),
      });
    }

    if (type === "hr") {
      const hrQuestion = PRACTICE_HR_BANK.find((q) => q.id === questionId);
      if (!hrQuestion) {
        return res.status(404).json({ message: "Question not found." });
      }

      if (!answer || !answer.trim()) {
        return res.status(400).json({ message: "An answer is required." });
      }

      const messages = [
        {
          role: "system",
          content: `You are a professional interviewer evaluating a candidate's practice answer.
              Evaluate naturally and fairly. Score these (0 to 10): confidence, communication,
              correctness. Grading context for this question: ${hrQuestion.guidance}
              Rules:
              - Be realistic — vague/generic answers with no specifics score below 6.
              - finalScore = average of the three, rounded to nearest whole number.
              Feedback: 10-15 words, natural human tone, can suggest one improvement.
              Return ONLY JSON:
              { "confidence": number, "communication": number, "correctness": number, "finalScore": number, "feedback": "..." }`,
        },
        {
          role: "user",
          content: `Question: ${hrQuestion.question}\nAnswer: ${answer}`,
        },
      ];

      let parsed;
      try {
        const raw = await askAi(messages);
        parsed = JSON.parse(
          raw
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim(),
        );
      } catch {
        parsed = {
          confidence: 0,
          communication: 0,
          correctness: 0,
          finalScore: 0,
          feedback: "Could not evaluate this answer automatically.",
        };
      }

      await logAttempt({
        userId: req.userId,
        questionType: "hr",
        questionId,
        category: hrQuestion.category,
        difficulty: hrQuestion.difficulty,
        score: parsed.finalScore,
      });

      return res.status(200).json({
        score: parsed.finalScore,
        confidence: parsed.confidence,
        communication: parsed.communication,
        correctness: parsed.correctness,
        feedback: parsed.feedback,
      });
    }

    return res.status(400).json({ message: "Invalid question type." });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to submit practice answer: ${error.message}`,
    });
  }
};

export const getDsaProgress = async (req, res) => {
  try {
    const attempts = await practiceAttemptModel
      .find({ userId: req.userId, questionType: "coding" })
      .select("questionId score createdAt")
      .lean();

    const byQuestion = {};
    attempts.forEach((a) => {
      if (!byQuestion[a.questionId]) {
        byQuestion[a.questionId] = {
          attempts: 0,
          bestScore: 0,
          lastAttempt: null,
        };
      }
      byQuestion[a.questionId].attempts += 1;
      byQuestion[a.questionId].bestScore = Math.max(
        byQuestion[a.questionId].bestScore,
        a.score || 0,
      );
      if (
        !byQuestion[a.questionId].lastAttempt ||
        new Date(a.createdAt) > new Date(byQuestion[a.questionId].lastAttempt)
      ) {
        byQuestion[a.questionId].lastAttempt = a.createdAt;
      }
    });

    const progress = DSA_QUESTION_BANK.map((q) => {
      const entry = byQuestion[q.id];
      return {
        id: q.id,
        attempted: Boolean(entry),
        solved: (entry?.bestScore || 0) >= 7,
        bestScore: entry?.bestScore || 0,
        attempts: entry?.attempts || 0,
      };
    });

    const solvedCount = progress.filter((p) => p.solved).length;

    return res.status(200).json({
      progress,
      solvedCount,
      totalCount: DSA_QUESTION_BANK.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to load DSA progress: ${error.message}`,
    });
  }
};

const seededPick = (pool, seedStr) => {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  return pool[hash % pool.length];
};

export const getDailyChallenge = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);

    const dayOfYear = Math.floor(
      (new Date(todayStr) - new Date(todayStr.slice(0, 4) + "-01-01")) /
        (1000 * 60 * 60 * 24),
    );
    const wantsCoding = dayOfYear % 2 === 0;

    const pool = wantsCoding ? DSA_QUESTION_BANK : PRACTICE_HR_BANK;
    const picked = seededPick(pool, todayStr);
    const type = wantsCoding ? "coding" : "hr";
    const title = wantsCoding ? picked.title : picked.question;

    const alreadyDone = await practiceAttemptModel.exists({
      userId: req.userId,
      questionType: type,
      questionId: picked.id,
      createdAt: {
        $gte: new Date(todayStr + "T00:00:00.000Z"),
        $lte: new Date(todayStr + "T23:59:59.999Z"),
      },
    });

    return res.status(200).json({
      type,
      id: picked.id,
      title,
      category: wantsCoding ? picked.topic : picked.category,
      difficulty: picked.difficulty,
      date: todayStr,
      completed: Boolean(alreadyDone),
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to load daily challenge: ${error.message}`,
    });
  }
};

const computeStreak = (attemptDates) => {
  let streak = 0;
  const cursor = new Date();
  let cursorStr = cursor.toISOString().slice(0, 10);

  if (!attemptDates.has(cursorStr)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    cursorStr = cursor.toISOString().slice(0, 10);
  }

  while (attemptDates.has(cursorStr)) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    cursorStr = cursor.toISOString().slice(0, 10);
  }

  return streak;
};

export const getPracticeStats = async (req, res) => {
  try {
    const attempts = await practiceAttemptModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(200);

    if (!attempts.length) {
      return res.status(200).json({
        totalAttempts: 0,
        averageScore: 0,
        currentStreak: 0,
        categoryBreakdown: [],
        recentAttempts: [],
      });
    }

    const totalAttempts = attempts.length;
    const averageScore = Number(
      (
        attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts
      ).toFixed(1),
    );

    const attemptDates = new Set(
      attempts.map((a) => a.createdAt.toISOString().slice(0, 10)),
    );
    const currentStreak = computeStreak(attemptDates);

    const categoryMap = {};
    attempts.forEach((a) => {
      const key = `${a.questionType}:${a.category}`;
      if (!categoryMap[key]) {
        categoryMap[key] = {
          category: a.category,
          type: a.questionType,
          count: 0,
          totalScore: 0,
        };
      }
      categoryMap[key].count += 1;
      categoryMap[key].totalScore += a.score || 0;
    });

    const categoryBreakdown = Object.values(categoryMap)
      .map((c) => ({
        category: c.category,
        type: c.type,
        count: c.count,
        averageScore: Number((c.totalScore / c.count).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count);

    const recentAttempts = attempts.slice(0, 10).map((a) => ({
      questionId: a.questionId,
      type: a.questionType,
      category: a.category,
      score: a.score,
      createdAt: a.createdAt,
    }));

    return res.status(200).json({
      totalAttempts,
      averageScore,
      currentStreak,
      categoryBreakdown,
      recentAttempts,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to load practice stats: ${error.message}`,
    });
  }
};

const editorialCache = new Map();
const EDITORIAL_CACHE_MAX = 500;

const extractEditorialJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {}
  const m = String(text).match(/\{[\s\S]*\}/);
  if (m) {
    try {
      return JSON.parse(m[0]);
    } catch {}
  }
  return null;
};

export const getEditorial = async (req, res) => {
  try {
    const { questionId, language } = req.body || {};
    if (!questionId) {
      return res.status(400).json({ message: "questionId is required." });
    }
    const lang = VALID_CODE_LANGUAGES.includes(language) ? language : "javascript";
    const q = DSA_QUESTION_BANK.find((item) => item.id === questionId);
    if (!q) return res.status(404).json({ message: "Question not found." });

    const cacheKey = `${questionId}:${lang}`;
    if (editorialCache.has(cacheKey)) {
      return res.status(200).json({ ...editorialCache.get(cacheKey), cached: true });
    }

    const starter = getStarterCode(q.io, lang, getFuncName(q.id, lang), q.returns) || "";
    const examplesText = (q.examples || [])
      .map(
        (e, i) =>
          `Example ${i + 1}: Input: ${e.input} Output: ${e.output}${e.explanation ? ` Explanation: ${e.explanation}` : ""}`,
      )
      .join("\n");
    const messages = [
      {
        role: "system",
        content:
          "You are a crisp DSA editorial writer. Explain the optimal approach in plain, student-friendly words. Return ONLY valid JSON, no markdown, no code fences.",
      },
      {
        role: "user",
        content: `Problem: ${q.title}\n${q.description}\n${examplesText}\nConstraints: ${(q.constraints || []).join(" ")}\nLanguage: ${lang}\nFunction signature to implement:\n${starter}\nWrite the editorial as JSON: { "approach": ["paragraph 1", "paragraph 2", "paragraph 3"], "timeComplexity": "O(n)", "spaceComplexity": "O(1)", "code": "complete ${lang} solution implementing the signature above", "insights": ["one-line takeaway 1", "one-line takeaway 2"] }. Rules: approach is 2-4 short paragraphs with no markdown inside values; code MUST be pretty-printed with real line breaks, one statement per line, proper indentation, never a single line; no markdown fences anywhere.`,
      },
    ];

    const raw = await askAi(messages);
    const parsed = extractEditorialJson(raw || "");
    if (!parsed || !parsed.code) {
      return res.status(500).json({ message: "Editorial generation failed. Try again." });
    }
    let codeText = String(parsed.code || "")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "")
      .replace(/\\t/g, "\t")
      .replace(/^```[\w]*\n/, "")
      .replace(/\n```\s*$/, "")
      .trim();
    const payload = {
      approach: Array.isArray(parsed.approach)
        ? parsed.approach.map(String).filter((s) => s.trim())
        : [],
      timeComplexity: String(parsed.timeComplexity || ""),
      spaceComplexity: String(parsed.spaceComplexity || ""),
      code: codeText,
      insights: Array.isArray(parsed.insights)
        ? parsed.insights.map(String).filter((s) => s.trim())
        : [],
    };
    editorialCache.set(cacheKey, payload);
    if (editorialCache.size > EDITORIAL_CACHE_MAX) {
      editorialCache.delete(editorialCache.keys().next().value);
    }
    return res.status(200).json({ ...payload, cached: false });
  } catch (error) {
    return res.status(500).json({ message: "Editorial generation failed. Try again." });
  }
};
