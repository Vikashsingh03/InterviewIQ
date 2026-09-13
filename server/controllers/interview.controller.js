import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import userModel from "../models/user.model.js";
import interviewModel from "../models/interview.model.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const filePath = req.file.path;

    const fileBuffer = await fs.promises.readFile(filePath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const textItems = content.items.map((item) => item.str);
      const pageText = textItems.join(" ");

      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

    const messages = [
      {
        role: "system",
        content: `Extract structeured data from resume.
                
                Return strictly JSON :
                {
                "role": "string",
                "experience" : "string",
                "projects" : ["project1", "project2"],
                "skills" : ["skill1", "skill2"]
                }
                `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askAi(messages);

    const cleanedResponse = aiResponse
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    const parsed = JSON.parse(cleanedResponse);

    fs.unlinkSync(filePath);

    res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: "Error analyzing resume" });
  }
};

const buildTopicPool = ({ projects = [], skills = [] } = {}) => {
  const topics = [];

  projects.forEach((p) => {
    topics.push(`project: ${p}`);
  });

  if (skills.length) {
    topics.push(`skills: ${skills.join(", ")}`);
  }

  topics.push("activity-or-certification (find in resume text if present)");

  return topics;
};

const computeQuestionBudget = (topicPool, mode) => {
  const topicCount = topicPool.length;
  const codingBuffer = mode === "Technical" ? 1 : 0;

  const maxQuestions = Math.min(12, Math.max(6, topicCount + codingBuffer + 3));
  const minQuestions = Math.min(maxQuestions - 1, Math.max(4, topicCount));

  return { minQuestions, maxQuestions };
};

const CODING_QUESTION_BANK = [
  "How would you find duplicate rows in a large SQL table without hurting performance?",
  "Can you explain how you'd reverse a singly linked list, and why that approach works?",
  "How would you go about optimizing a database query that's running slowly in production?",
  "What's the real difference between an INNER JOIN and a LEFT JOIN, and when would you use each?",
  "How would you detect and fix a memory leak in a long-running Node.js server?",
  "How would you design a database schema to avoid duplicate or inconsistent data across tables?",
  "Can you explain the time complexity trade-off between using a hash map versus a sorted array for lookups?",
];

const FILLER_WORD_REGEX =
  /\b(um+|uh+|erm+|like|you know|i mean|basically|actually|so yeah|kind of|sort of)\b/gi;

const computeSpeakingMetrics = (answerText, durationSeconds) => {
  const cleanText = (answerText || "").trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;

  const safeDuration = Math.max(durationSeconds || 0, 1);
  const wordsPerMinute = Math.round((wordCount / safeDuration) * 60);

  const fillerMatches = cleanText.match(FILLER_WORD_REGEX) || [];
  const fillerWordCount = fillerMatches.length;
  const fillerRatio = wordCount
    ? Number((fillerWordCount / wordCount).toFixed(3))
    : 0;

  let deliveryScore = 10;

  if (wordCount >= 5) {
    if (wordsPerMinute < 90) {
      deliveryScore -= Math.min(4, (90 - wordsPerMinute) / 15);
    } else if (wordsPerMinute > 190) {
      deliveryScore -= Math.min(4, (wordsPerMinute - 190) / 15);
    }
  }

  deliveryScore -= Math.min(4, fillerRatio * 25);

  if (wordCount < 10) {
    deliveryScore = Math.min(deliveryScore, 5);
  }

  deliveryScore = Math.max(
    0,
    Math.min(10, Math.round(deliveryScore * 10) / 10),
  );

  return {
    wordsPerMinute,
    wordCount,
    durationSeconds: Math.round(safeDuration),
    fillerWordCount,
    fillerRatio,
    deliveryScore,
  };
};

export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res.status(400).json({
        message: "Role, experience and mode are required.",
      });
    }

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 required.",
      });
    }

    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeSkills = Array.isArray(skills) ? skills : [];

    const projectText = safeProjects.length ? safeProjects.join(", ") : "None";
    const skillsText = safeSkills.length ? safeSkills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
        Role : ${role},
        Experience : ${experience},
        InterviewMode : ${mode},
        Projects : ${projectText},
        skills : ${skillsText},
        Resume : ${safeResume}
        `;

    if (!userPrompt.trim()) {
      return res.status(400).json({
        message: "Prompt content is empty.",
      });
    }

    const messages = [
      {
        role: "system",
        content: `
                You are a real human interviewer starting a live ${mode} interview.

                speak in simple, natural english as if you are directly talking to the candidate,
                the way a warm, experienced interviewer opens a conversation.

                Your ONLY job here is to generate the OPENING question, and it must be an
                "introduce yourself" style question — asking the candidate to walk you through
                their background, experience, and what they've worked on. Keep it broad and
                welcoming — do NOT ask about a specific project or skill yet, that comes later.

                strict rules:
                - The question must contain 20 to 35 words.
                - It must be a single complete sentence (you may use one comma-joined clause).
                - Do NOT number it.
                - Do NOT add explanations.
                - Do NOT add extra text before or after.
                - Output ONLY the question text, nothing else.

                Base it on the candidate's role, experience, and interviewMode.
                `,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askAi(messages);

    if (!aiResponse || !aiResponse.trim()) {
      return res.status(500).json({
        message: "AI returned empty response.",
      });
    }

    const firstQuestion = aiResponse.trim().split("\n")[0].trim();

    if (!firstQuestion) {
      return res.status(500).json({
        message: "Ai failed to genrate questions",
      });
    }

    user.credits -= 50;
    await user.save();

    const topicPool = buildTopicPool({
      projects: safeProjects,
      skills: safeSkills,
    });
    const { minQuestions, maxQuestions } = computeQuestionBudget(
      topicPool,
      mode,
    );

    const interview = await interviewModel.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      projects: safeProjects,
      skills: safeSkills,
      minQuestions,
      maxQuestions,
      coveredTopics: ["introduction"],
      questions: [
        {
          question: firstQuestion,
          difficulty: "easy",
          timeLimit: 90,
          topicHint: "introduction",
        },
      ],
    });

    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const buildFallbackQuestion = (topicLabel, mode) => {
  if (topicLabel.startsWith("project: ")) {
    const name = topicLabel.replace("project: ", "");
    return mode === "Technical"
      ? `Let's switch gears — could you walk me through the ${name} project, the tech stack you used, and the toughest part of building it?`
      : `Let's talk about ${name} — what was your specific role, and what would you do differently if you built it again?`;
  }

  if (topicLabel.startsWith("skills: ")) {
    return mode === "Technical"
      ? `Switching topics — looking at the skills on your resume, which one are you strongest in and how have you actually applied it?`
      : `Switching topics — which skill on your resume are you most confident about, and why?`;
  }

  if (topicLabel.startsWith("activity-or-certification")) {
    return "Before we move on, is there any activity, certification, or achievement on your resume you'd like to highlight?";
  }

  return "Looking back at everything we've discussed, which project or skill are you personally most proud of, and why?";
};

const topicDisplayName = (topicLabel) => {
  if (topicLabel.startsWith("project: ")) {
    return `the project titled "${topicLabel.replace("project: ", "")}" — you MUST name it explicitly in your question`;
  }
  if (topicLabel.startsWith("skills: ")) {
    return `their listed technical skills (${topicLabel.replace("skills: ", "")})`;
  }
  if (topicLabel.startsWith("activity-or-certification")) {
    return "any activity, certification, extracurricular involvement, or achievement mentioned in their resume text";
  }
  return topicLabel;
};

const decideNextStep = async (interview) => {
  const askedCount = interview.questions.length;

  const history = interview.questions
    .map(
      (q, i) =>
        `Q${i + 1} [topic: ${q.topicHint || "general"}] (${q.difficulty}): ${q.question}\nCandidate's Answer: ${
          q.skipped ? "Skipped by candidate" : q.answer || "No answer given"
        }\nScore: ${q.score ?? 0}/10`,
    )
    .join("\n\n");

  const mustContinue = askedCount < interview.minQuestions;
  const mustStop = askedCount >= interview.maxQuestions;

  if (mustStop) {
    return { continueInterview: false, nextQuestion: null };
  }

  const lastQuestion = interview.questions[askedCount - 1];
  const lastTopic = lastQuestion?.topicHint || "general";
  const lastScore = lastQuestion?.score ?? 0;
  const wasSkipped = !!lastQuestion?.skipped;
  const topicUseCount = interview.questions.filter(
    (q) => q.topicHint === lastTopic,
  ).length;
  const isRealTopic =
    lastTopic !== "general" &&
    lastTopic !== "introduction" &&
    lastTopic !== "coding-question";

  const topicPool = buildTopicPool({
    projects: interview.projects,
    skills: interview.skills,
  });
  const uncoveredOrdered = topicPool.filter(
    (t) => !interview.coveredTopics?.includes(t),
  );

  const canAskCodingQuestion =
    interview.mode === "Technical" && !interview.askedCodingQuestion;
  const remainingSlots = interview.maxQuestions - askedCount;

  if (canAskCodingQuestion && remainingSlots <= 1) {
    const askedTexts = interview.questions.map((q) => q.question);
    const unusedBank = CODING_QUESTION_BANK.filter(
      (q) => !askedTexts.includes(q),
    );
    const pool = unusedBank.length ? unusedBank : CODING_QUESTION_BANK;
    const question = pool[Math.floor(Math.random() * pool.length)];

    return {
      continueInterview: true,
      nextQuestion: {
        question,
        difficulty: "medium",
        timeLimit: 90,
        topicHint: "coding-question",
      },
    };
  }

  // skipped answers never trigger a same-topic follow-up — a skip means
  // "move on", not "this was weak, dig deeper"
  const eligibleFollowUp =
    !wasSkipped &&
    isRealTopic &&
    topicUseCount === 1 &&
    lastScore > 0 &&
    lastScore < 6;

  let action;
  let targetTopic = null;

  if (eligibleFollowUp) {
    action = "followup";
    targetTopic = lastTopic;
  } else if (uncoveredOrdered.length > 0) {
    action = "nextTopic";
    targetTopic = uncoveredOrdered[0];
  } else if (canAskCodingQuestion) {
    action = "coding";
  } else if (mustContinue) {
    action = "general";
  } else {
    action = "end";
  }

  if (action === "end") {
    return { continueInterview: false, nextQuestion: null };
  }

  if (action === "coding") {
    const askedTexts = interview.questions.map((q) => q.question);
    const unusedBank = CODING_QUESTION_BANK.filter(
      (q) => !askedTexts.includes(q),
    );
    const pool = unusedBank.length ? unusedBank : CODING_QUESTION_BANK;
    const question = pool[Math.floor(Math.random() * pool.length)];

    return {
      continueInterview: true,
      nextQuestion: {
        question,
        difficulty: "medium",
        timeLimit: 90,
        topicHint: "coding-question",
      },
    };
  }

  const modeGuidance =
    interview.mode === "Technical"
      ? `This is a TECHNICAL interview — lean toward implementation details, tech stack
         choices, and how they solved a real problem.`
      : `This is an HR/behavioral interview — lean toward their role, ownership, decisions,
         and how they handled pressure or teamwork (STAR-style).`;

  const instructionLine =
    action === "followup"
      ? `The candidate's last answer (topic: "${lastTopic}") scored low (${lastScore}/10) and felt
         thin or vague. Ask ONE follow-up question that pushes for something concrete — a specific
         example, a number, or exactly what THEY personally did — staying on this SAME topic.
         Do not introduce a new subject.`
      : action === "general"
        ? `All resume topics are already covered, but the interview hasn't hit its minimum length
           yet. Ask one thoughtful, natural reflective question that doesn't repeat anything
           already asked (e.g. about a broader lesson learned, or how they'd approach a new
           challenge in this role).`
        : `You must ask about exactly this topic next: ${topicDisplayName(targetTopic)}.
           Make the question feel like a natural next line from an interviewer who read their
           resume closely — reference the last answer briefly for flow if it fits naturally,
           but the SUBJECT of the question must be the topic given above, nothing else.`;

  const messages = [
    {
      role: "system",
      content: `
      You are a real, experienced interviewer conducting a live ${interview.mode} interview.
      The interview has a fixed plan for what to cover next — that decision has already been
      made for you. Your ONLY job is to phrase ONE natural-sounding question for it.

      ${instructionLine}

      ${modeGuidance}

      Rules:
      - 15 to 30 words, one natural sentence (one comma-joined clause allowed).
      - Vary your conversational lead-in style across the interview — don't reuse the same
        opening phrase every time (mix short direct questions with reflective lead-ins).
      - Do not repeat a question already asked.
      - Choose a difficulty ("easy", "medium", or "hard") appropriate to the question.

      Return ONLY valid JSON in this exact format, nothing else:
      {
        "question": "the question text",
        "difficulty": "easy" or "medium" or "hard"
      }
      `,
    },
    {
      role: "user",
      content: `
      Role: ${interview.role}
      Experience: ${interview.experience}
      Interview Mode: ${interview.mode}

      Conversation so far:
      ${history}
      `,
    },
  ];

  const aiResponse = await askAi(messages);

  const cleaned = aiResponse
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const timeLimitByDifficulty = { easy: 60, medium: 90, hard: 120 };
  const finalTopicHint = targetTopic || "general";

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return {
      continueInterview: true,
      nextQuestion: {
        question: buildFallbackQuestion(finalTopicHint, interview.mode),
        difficulty: "medium",
        timeLimit: 90,
        topicHint: finalTopicHint,
      },
    };
  }

  if (!parsed.question || !parsed.question.trim()) {
    return {
      continueInterview: true,
      nextQuestion: {
        question: buildFallbackQuestion(finalTopicHint, interview.mode),
        difficulty: "medium",
        timeLimit: 90,
        topicHint: finalTopicHint,
      },
    };
  }

  return {
    continueInterview: true,
    nextQuestion: {
      question: parsed.question.trim(),
      difficulty: parsed.difficulty || "medium",
      timeLimit: timeLimitByDifficulty[parsed.difficulty] || 90,
      topicHint: finalTopicHint,
    },
  };
};

const recordTopic = (interview, topicHint) => {
  if (!topicHint || topicHint === "general") return;

  if (topicHint === "coding-question") {
    interview.askedCodingQuestion = true;
  }

  if (!interview.coveredTopics.includes(topicHint)) {
    interview.coveredTopics.push(topicHint);
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const {
      interviewId,
      questionIndex,
      answer,
      timeTaken,
      durationSeconds,
      skipped, // NEW
    } = req.body;

    if (!interviewId || questionIndex === undefined || questionIndex === null) {
      return res.status(400).json({
        message: "interviewId and questionIndex are required.",
      });
    }

    const interview = await interviewModel.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.status === "Completed") {
      return res
        .status(400)
        .json({ message: "This interview has already been completed." });
    }

    const question = interview.questions[questionIndex];

    if (!question) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    // ---- NEW case: candidate explicitly skipped this question ----
    if (skipped) {
      question.score = 0;
      question.feedback = "Skipped by the candidate.";
      question.answer = "";
      question.skipped = true;

      await interview.save();

      const { continueInterview, nextQuestion } =
        await decideNextStep(interview);

      if (continueInterview) {
        recordTopic(interview, nextQuestion.topicHint);
        interview.questions.push(nextQuestion);
        await interview.save();
      }

      return res.json({
        feedback: "No problem, let's move on to the next question.",
        isLast: !continueInterview,
        nextQuestion: continueInterview ? nextQuestion : null,
        speakingMetrics: null,
      });
    }

    // ---- case: no answer given ----
    if (!answer) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";

      await interview.save();

      const { continueInterview, nextQuestion } =
        await decideNextStep(interview);

      if (continueInterview) {
        recordTopic(interview, nextQuestion.topicHint);
        interview.questions.push(nextQuestion);
        await interview.save();
      }

      return res.json({
        feedback: question.feedback,
        isLast: !continueInterview,
        nextQuestion: continueInterview ? nextQuestion : null,
      });
    }

    // ---- case: time exceeded ----
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;

      await interview.save();

      const { continueInterview, nextQuestion } =
        await decideNextStep(interview);

      if (continueInterview) {
        recordTopic(interview, nextQuestion.topicHint);
        interview.questions.push(nextQuestion);
        await interview.save();
      }

      return res.json({
        feedback: question.feedback,
        isLast: !continueInterview,
        nextQuestion: continueInterview ? nextQuestion : null,
      });
    }

    // ---- normal evaluation ----
    const messages = [
      {
        role: "system",
        content: `
            You are a professional human interviewer evaluating a candidate's answer in a real interview.

            Evaluate naturally and fairly, like a real person would.

            Score the answer in these areas (0 to 10):

            1. Confidence – Does the answer sound clear, confident, and well-presented?
            2. Communication – Is the language simple, clear, and easy to understand?
            3. Correctness – Is the answer accurate, relevant, and complete?

            Rules:
            - Be realistic and unbiased.
            - Do not give random high scores.
            - If the answer is weak, generic, or vague — score it low (below 6).
            - If the answer is strong, specific, and detailed — score it high.
            - A vague answer that avoids specifics (no example, no numbers, no personal
              ownership — "we did this", "it was managed") should score noticeably lower
              than one with concrete details, even if both sound confident.
            - Consider clarity, structure, and relevance.

            Calculate:
            finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

            Feedback Rules:
            - Write natural human feedback.
            - 10 to 15 words only.
            - Sound like real interview feedback.
            - Can suggest improvement if needed.
            - Do NOT repeat the question.
            - Do NOT explain scoring.
            - Keep tone professional and honest.

            Return ONLY valid JSON in this format:

            {
            "confidence": number,
            "communication": number,
            "correctness": number,
            "finalScore": number,
            "feedback": "short human feedback"
            }
            `,
      },
      {
        role: "user",
        content: `
            Question: ${question.question}
            Answer: ${answer}
            `,
      },
    ];

    const aiResponse = await askAi(messages);

    const cleanedEval = aiResponse
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedEval);
    } catch {
      question.answer = answer;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.score = 0;
      question.feedback = "Could not evaluate this answer automatically.";
      question.speakingMetrics = computeSpeakingMetrics(
        answer,
        durationSeconds,
      );

      await interview.save();

      const { continueInterview, nextQuestion } =
        await decideNextStep(interview);

      if (continueInterview) {
        recordTopic(interview, nextQuestion.topicHint);
        interview.questions.push(nextQuestion);
        await interview.save();
      }

      return res.status(200).json({
        feedback: question.feedback,
        isLast: !continueInterview,
        nextQuestion: continueInterview ? nextQuestion : null,
        speakingMetrics: question.speakingMetrics,
      });
    }

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;
    question.speakingMetrics = computeSpeakingMetrics(answer, durationSeconds);

    await interview.save();

    const { continueInterview, nextQuestion } = await decideNextStep(interview);

    if (continueInterview) {
      recordTopic(interview, nextQuestion.topicHint);
      interview.questions.push(nextQuestion);
      await interview.save();
    }

    return res.status(200).json({
      feedback: parsed.feedback,
      isLast: !continueInterview,
      nextQuestion: continueInterview ? nextQuestion : null,
      speakingMetrics: question.speakingMetrics,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to submit answer : ${error} `,
    });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({ message: "interviewId is required." });
    }

    const interview = await interviewModel.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "failed to find the interview",
      });
    }

    // skipped questions don't count toward scoring — they represent
    // topics the candidate opted out of, not weak answers
    const scorableQuestions = interview.questions.filter((q) => !q.skipped);
    const totalQuestions = scorableQuestions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;
    let totalDeliveryScore = 0;
    let totalWpm = 0;
    let totalFillerWords = 0;

    scorableQuestions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
      totalDeliveryScore += q.speakingMetrics?.deliveryScore || 0;
      totalWpm += q.speakingMetrics?.wordsPerMinute || 0;
      totalFillerWords += q.speakingMetrics?.fillerWordCount || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;
    const avgDeliveryScore = totalQuestions
      ? totalDeliveryScore / totalQuestions
      : 0;
    const avgWpm = totalQuestions ? totalWpm / totalQuestions : 0;

    interview.finalScore = finalScore;
    interview.status = "Completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      avgDeliveryScore: Number(avgDeliveryScore.toFixed(1)),
      avgWordsPerMinute: Math.round(avgWpm),
      totalFillerWords,
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
        skipped: q.skipped || false,
        speakingMetrics: q.speakingMetrics || null,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to finish interview .",
    });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await interviewModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interviews);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to find current user interview ${error}` });
  }
};

export const getInterviewReport = async (req, res) => {
  try {
    const interview = await interviewModel.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const scorableQuestions = interview.questions.filter((q) => !q.skipped);
    const totalQuestions = scorableQuestions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;
    let totalDeliveryScore = 0;
    let totalWpm = 0;
    let totalFillerWords = 0;

    scorableQuestions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
      totalDeliveryScore += q.speakingMetrics?.deliveryScore || 0;
      totalWpm += q.speakingMetrics?.wordsPerMinute || 0;
      totalFillerWords += q.speakingMetrics?.fillerWordCount || 0;
    });

    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;
    const avgDeliveryScore = totalQuestions
      ? totalDeliveryScore / totalQuestions
      : 0;
    const avgWpm = totalQuestions ? totalWpm / totalQuestions : 0;

    interview.status = "Completed";

    return res.status(200).json({
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      avgDeliveryScore: Number(avgDeliveryScore.toFixed(1)),
      avgWordsPerMinute: Math.round(avgWpm),
      totalFillerWords,
      questionWiseScore: interview.questions,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to find currentUser Interview ${error}` });
  }
};
