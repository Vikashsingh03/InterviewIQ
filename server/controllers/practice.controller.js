import { askAi } from "../services/openRouter.service.js";
import { runTestCases } from "../services/codeExecution.service.js";
import DSA_QUESTION_BANK from "../data/dsaQuestions.js";
import PRACTICE_HR_BANK from "../data/practiceQuestions.js";
import practiceAttemptModel from "../models/practiceAttempt.model.js";

// ---------------- browse / list ----------------

// Lightweight combined listing for the Practice Hub grid — no test cases,
// no starter code, just enough metadata to render and filter cards.
export const getPracticeQuestions = async (req, res) => {
  try {
    const coding = DSA_QUESTION_BANK.map((q) => ({
      id: q.id,
      type: "coding",
      title: q.title,
      category: q.topic,
      difficulty: q.difficulty,
    }));

    const hr = PRACTICE_HR_BANK.map((q) => ({
      id: q.id,
      type: "hr",
      title: q.question,
      category: q.category,
      difficulty: q.difficulty,
    }));

    return res.status(200).json({ coding, hr });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to load practice questions: ${error.message}`,
    });
  }
};

// Full detail for a single question — fetched when the candidate opens it.
export const getPracticeQuestionDetail = async (req, res) => {
  try {
    const { type, id } = req.params;

    if (type === "coding") {
      const q = DSA_QUESTION_BANK.find((item) => item.id === id);
      if (!q) return res.status(404).json({ message: "Question not found." });

      return res.status(200).json({
        type: "coding",
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        topic: q.topic,
        description: q.description,
        starterCode: q.starterCode,
        sampleTestCases: q.testCases.slice(0, 2),
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

// ---------------- run (coding only, sample tests, no scoring) ----------------

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

    const sampleCases = dsaQuestion.testCases.slice(0, 2);
    const runResult = await runTestCases({
      language,
      code,
      testCases: sampleCases,
    });

    if (!runResult.supported) {
      return res
        .status(200)
        .json({ results: [], supported: false, message: runResult.message });
    }

    return res
      .status(200)
      .json({ results: runResult.results, supported: true });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to run code: ${error.message}`,
    });
  }
};

// ---------------- submit (scored + logged, free — no credits touched) ----------------

const logAttempt = async ({
  userId,
  questionType,
  questionId,
  category,
  difficulty,
  language,
  score,
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
    });
  } catch (error) {
    // logging failure shouldn't block the candidate from seeing their result
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
      });

      // language not supported by the execution engine — fall back to an
      // AI code review, same pattern as the full interview's coding round
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
              runResult.message || "Automated grading unavailable for this language.",
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
      try {
        const raw = await askAi(reviewMessages);
        reviewParsed = JSON.parse(
          raw
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim(),
        );
      } catch {
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
      const finalScore = Math.round((correctness + confidence + communication) / 3);

      await logAttempt({
        userId: req.userId,
        questionType: "coding",
        questionId,
        category: dsaQuestion.topic,
        difficulty: dsaQuestion.difficulty,
        language,
        score: finalScore,
      });

      return res.status(200).json({
        score: finalScore,
        confidence,
        communication,
        correctness,
        feedback: `${testsPassedCount}/${testsTotalCount} test cases passed. ${reviewParsed.feedback || ""}`.trim(),
        testResults,
        testsPassedCount,
        testsTotalCount,
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

// ---------------- daily challenge ----------------

// Deterministic pick, seeded by today's date — every user sees the SAME
// question on a given day (classic "daily challenge" pattern), and it
// naturally rotates through the whole question bank over time.
const seededPick = (pool, seedStr) => {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  return pool[hash % pool.length];
};

export const getDailyChallenge = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // alternate coding/HR by day-of-year so it isn't always the same type
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

// ---------------- stats ----------------

const computeStreak = (attemptDates) => {
  // attemptDates: Set of "YYYY-MM-DD" strings (UTC)
  let streak = 0;
  const cursor = new Date();
  let cursorStr = cursor.toISOString().slice(0, 10);

  // if there's no attempt today yet, the streak isn't broken until midnight
  // passes without one — so start counting from yesterday instead
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