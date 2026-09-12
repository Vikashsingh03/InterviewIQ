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

// ---------------- generates ONLY the opening question ----------------
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

    // The opening question always plays the role of a real interviewer's
    // opener: "tell me about yourself", lightly anchored to the resume so
    // it doesn't feel like a generic template question.
    const messages = [
      {
        role: "system",
        content: `
                You are a real human interviewer starting a live ${mode} interview.

                speak in simple, natural english as if you are directly talking to the candidate,
                the way a warm, experienced interviewer opens a conversation.

                Your ONLY job here is to generate the OPENING question, and it must be an
                "introduce yourself" style question — asking the candidate to walk you through
                their background, experience, and what they've worked on. If the resume mentions
                specific projects or skills, you may lightly reference ONE of them to make it feel
                personal (e.g. "...and I see you've worked with ${safeSkills[0] || "your listed skills"} — feel free to touch on that too"),
                but do not turn it into a technical question yet. This is purely a warm-up.

                strict rules:
                - The question must contain 20 to 35 words.
                - It must be a single complete sentence (you may use one comma-joined clause).
                - Do NOT number it.
                - Do NOT add explanations.
                - Do NOT add extra text before or after.
                - Output ONLY the question text, nothing else.

                Base it on the candidate's role, experience, interviewMode, projects, skills, and resume details.
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

    const interview = await interviewModel.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      projects: safeProjects,
      skills: safeSkills,
      minQuestions: 4,
      maxQuestions: 8,
      questions: [
        {
          question: firstQuestion,
          difficulty: "easy",
          timeLimit: 90,
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

// ---------------- helper: AI decides continue-or-stop + next question ----------------
const decideNextStep = async (interview) => {
  const askedCount = interview.questions.length;

  const history = interview.questions
    .map(
      (q, i) =>
        `Q${i + 1} (${q.difficulty}): ${q.question}\nCandidate's Answer: ${
          q.answer || "No answer given"
        }\nScore: ${q.score ?? 0}/10 (confidence: ${q.confidence ?? 0}, communication: ${q.communication ?? 0}, correctness: ${q.correctness ?? 0})`,
    )
    .join("\n\n");

  // hard safety limits, AI cannot override these
  const mustContinue = askedCount < interview.minQuestions;
  const mustStop = askedCount >= interview.maxQuestions;

  if (mustStop) {
    return { continueInterview: false, nextQuestion: null };
  }

  const projects = interview.projects?.length
    ? interview.projects.join(", ")
    : "None listed";
  const skills = interview.skills?.length
    ? interview.skills.join(", ")
    : "None listed";
  const resumeSummary = interview.resumeText?.trim() || "None provided";

  const modeGuidance =
    interview.mode === "Technical"
      ? `Lean toward technical depth: implementation details, architecture choices,
         trade-offs, debugging stories, and how they'd solve related problems today.
         When they mention a project or skill, drill into HOW they built it, not just what it does.`
      : `Lean toward behavioral and situational depth: how they handled conflict,
         pressure, teamwork, ownership, and decision-making. Use the STAR angle
         (Situation, Task, Action, Result) implicitly — ask about a specific
         moment, not a general opinion.`;

  const messages = [
    {
      role: "system",
      content: `
      You are a real, experienced human interviewer conducting a live ${interview.mode} interview.
      You are warm but sharp — you actually listen to what the candidate says and
      react to it, the way a good interviewer builds each question out of the last answer.

      Candidate's resume context (use this to stay grounded in their real background):
      - Projects: ${projects}
      - Skills: ${skills}
      - Resume summary: ${resumeSummary}

      You will see the full conversation so far: questions asked, the candidate's
      answers, and their scores.

      Decide ONE of two things:
      1. If you now have a clear, well-rounded picture of the candidate's skills,
         experience, communication, and problem-solving ability — end the interview.
      2. Otherwise, ask ONE more question that feels like a natural next line from
         a real interviewer — not a random new topic.

      How to choose the next question, in priority order:
      a) If the candidate's LAST answer mentioned something specific (a project, a
         technology, a decision, a challenge) that deserves a deeper follow-up,
         dig into THAT specific thing by name. Quote or reference what they said.
      b) Otherwise, if the resume/projects/skills list has something relevant and
         unexplored so far, bring that in naturally (e.g. "You mentioned X on your
         resume — walk me through that.").
      c) Only fall back to a generic question if neither of the above applies.

      ${modeGuidance}

      ${mustContinue ? "IMPORTANT: You must continue and ask another question — the interview has not reached the minimum length yet." : ""}

      Consider: has the candidate covered technical depth, real project experience,
      problem-solving, and communication clearly? If most answers were strong and
      topics feel sufficiently covered, prefer ending.

      Return ONLY valid JSON in this exact format, nothing else:
      {
        "continue": true or false,
        "question": "next question text if continue is true, else empty string",
        "difficulty": "easy" or "medium" or "hard"
      }

      Question rules if continuing:
      - 15 to 30 words, single complete sentence (one comma-joined clause allowed).
      - Sound conversational — a short natural lead-in is fine (e.g. "That's interesting —",
        "Good, so building on that,", "Alright,") before the actual question.
      - Do not repeat a question already asked.
      - Reference something concrete from their answer or resume whenever possible —
        do not ask a generic, could-apply-to-anyone question if a specific angle exists.
      `,
    },
    {
      role: "user",
      content: `
      Role: ${interview.role}
      Experience: ${interview.experience}
      Interview Mode: ${interview.mode}
      Questions asked so far: ${askedCount}

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

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // fallback if AI response isn't clean JSON — just end gracefully
    return { continueInterview: false, nextQuestion: null };
  }

  if (!parsed.continue || !parsed.question) {
    return { continueInterview: false, nextQuestion: null };
  }

  const timeLimitByDifficulty = { easy: 60, medium: 90, hard: 120 };

  return {
    continueInterview: true,
    nextQuestion: {
      question: parsed.question.trim(),
      difficulty: parsed.difficulty || "medium",
      timeLimit: timeLimitByDifficulty[parsed.difficulty] || 90,
    },
  };
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

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

    // ---- case: no answer given ----
    if (!answer) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";

      await interview.save();

      const { continueInterview, nextQuestion } =
        await decideNextStep(interview);

      if (continueInterview) {
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
            - If the answer is weak, score low.
            - If the answer is strong and detailed, score high.
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
      // AI gave malformed JSON — don't crash, fall back to a neutral score
      question.answer = answer;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.score = 0;
      question.feedback = "Could not evaluate this answer automatically.";

      await interview.save();

      const { continueInterview, nextQuestion } =
        await decideNextStep(interview);

      if (continueInterview) {
        interview.questions.push(nextQuestion);
        await interview.save();
      }

      return res.status(200).json({
        feedback: question.feedback,
        isLast: !continueInterview,
        nextQuestion: continueInterview ? nextQuestion : null,
      });
    }

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;

    await interview.save();

    // ---- AI decides: ask another question, or wrap up? ----
    const { continueInterview, nextQuestion } = await decideNextStep(interview);

    if (continueInterview) {
      interview.questions.push(nextQuestion);
      await interview.save();
    }

    return res.status(200).json({
      feedback: parsed.feedback,
      isLast: !continueInterview,
      nextQuestion: continueInterview ? nextQuestion : null,
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

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "Completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
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

    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.status = "Completed";

    return res.status(200).json({
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to find currentUser Interview ${error}` });
  }
};
