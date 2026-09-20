import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import userModel from "../models/user.model.js";
import interviewModel from "../models/interview.model.js";
import DSA_QUESTION_BANK from "../data/dsaQuestions.js";
import { runTestCases } from "../services/codeExecution.service.js";
import { getCompanyStyleGuidance } from "../data/companyStyles.js";

// ---------------- panel mode: interviewer personas ----------------
const INTERVIEWER_PERSONAS = {
  interviewerA: {
    label: "Interviewer A",
    voice: "male",
    styleGuidance: `You are Interviewer A — sharp, technical, detail-oriented. You dig into
      correctness, edge cases, and depth of understanding. Your tone is direct and probing,
      but always professional, never rude.`,
  },
  interviewerB: {
    label: "Interviewer B",
    voice: "female",
    styleGuidance: `You are Interviewer B — warm, behavioral-focused, people-oriented. You care
      about communication, ownership, teamwork, and culture fit. Your tone is friendly and
      conversational, focused on how the candidate thinks and works with others.`,
  },
};

const getPersonaGuidance = (askedBy) =>
  askedBy && INTERVIEWER_PERSONAS[askedBy]
    ? INTERVIEWER_PERSONAS[askedBy].styleGuidance
    : "";

// alternates speaker every question — first panel question is always A
const nextPanelSpeaker = (interview) => {
  const lastQuestion = interview.questions[interview.questions.length - 1];
  return lastQuestion?.askedBy === "interviewerA"
    ? "interviewerB"
    : "interviewerA";
};

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

                For "name", extract the candidate's actual full name as it
                appears at the top of the resume. If no clear name is found,
                return null for it — never guess or invent one.

                Return strictly JSON :
                {
                "name": "string or null",
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
      name: parsed.name || null,
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

const FILLER_WORD_REGEX =
  /\b(um+|uh+|erm+|like|you know|i mean|basically|actually|so yeah|kind of|sort of)\b/gi;

// ---- spoken acknowledgement -------------------------------------------
// A real interviewer doesn't announce a verdict after every answer; they
// react briefly ("okay, got it") and move on. The detailed feedback still
// lives in the report. The AI writes a context-aware reaction; anything
// that sounds like grading, or is missing/too long, falls back to a neutral one.
const NEUTRAL_ACKS = [
  "Okay, got it.",
  "Alright, thanks for that.",
  "Mm-hmm, understood.",
  "Okay, I see. Thank you.",
  "Right, noted.",
];

const JUDGEMENT_WORDS_REGEX =
  /\b(great|excellent|perfect|correct|incorrect|wrong|good job|well done|impressive|nice answer|weak|poor|score|marks?|out of)\b/i;

const cleanAck = (raw) => {
  const fallback = () =>
    NEUTRAL_ACKS[Math.floor(Math.random() * NEUTRAL_ACKS.length)];
  if (typeof raw !== "string") return fallback();
  const text = raw.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  if (!text || words < 2 || words > 24) return fallback();
  if (JUDGEMENT_WORDS_REGEX.test(text)) return fallback();
  if (text.includes("?")) return fallback(); // acknowledgements never ask
  return text;
};

// Words the speech recogniser should be primed to hear correctly: project
// names and skills from the resume (e.g. "BrokerBase", "Redis") are exactly
// what generic speech-to-text mangles.
const buildSttKeyterms = (interview) => {
  const raw = [
    ...(interview.projects || []),
    ...(interview.skills || []),
    interview.role,
    interview.company,
  ];
  const seen = new Set();
  const terms = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const term = item.trim();
    const key = term.toLowerCase();
    if (term.length < 2 || term.length > 40 || seen.has(key)) continue;
    seen.add(key);
    terms.push(term);
    if (terms.length >= 40) break;
  }
  return terms;
};

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

// ---------------- DSA coding-question selection ----------------
const pickCodingQuestion = (interview) => {
  const alreadyUsedIds = interview.questions
    .filter((q) => q.type === "coding" && q.dsaQuestionId)
    .map((q) => q.dsaQuestionId);

  const available = DSA_QUESTION_BANK.filter(
    (q) => !alreadyUsedIds.includes(q.id),
  );
  const pool = available.length ? available : DSA_QUESTION_BANK;

  const preferMedium = Math.random() < 0.6;
  const preferredPool = pool.filter(
    (q) => q.difficulty === (preferMedium ? "medium" : "easy"),
  );
  const finalPool = preferredPool.length ? preferredPool : pool;

  return finalPool[Math.floor(Math.random() * finalPool.length)];
};

// `askedBy` is only set in panel mode — solo interviews pass null and the
// field stays null on the saved question, exactly like before this feature
const buildCodingQuestion = (dsaQuestion, askedBy = null) => ({
  question: `Alright, let's move to a quick coding round — solve "${dsaQuestion.title}". You can write your solution in JavaScript, Python, C++, or Java, whichever you're most comfortable with.`,
  difficulty: dsaQuestion.difficulty,
  timeLimit: 600,
  topicHint: "coding-question",
  type: "coding",
  dsaQuestionId: dsaQuestion.id,
  title: dsaQuestion.title,
  description: dsaQuestion.description,
  topic: dsaQuestion.topic,
  starterCode: dsaQuestion.starterCode,
  sampleTestCases: dsaQuestion.testCases.slice(0, 2),
  askedBy,
});

// ---------------- Resume <-> Job Description match score ----------------
export const getResumeJobMatch = async (req, res) => {
  try {
    let { resumeText, skills, projects, jobDescription } = req.body;

    jobDescription = jobDescription?.trim().slice(0, 4000) || "";
    resumeText = resumeText?.trim() || "";

    if (jobDescription.length < 30) {
      return res.status(400).json({
        message: "Paste a fuller job description to check your match.",
      });
    }
    if (!resumeText) {
      return res.status(400).json({
        message: "Upload and analyze your resume first.",
      });
    }

    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeProjects = Array.isArray(projects) ? projects : [];

    const messages = [
      {
        role: "system",
        content: `
          You are an expert technical recruiter comparing a candidate's resume
          against a specific job description.

          Score the overall fit from 0 to 100 based on how well the candidate's
          actual skills, projects, and experience align with what THIS job
          description specifically asks for.

          Be realistic, not flattering — a generic resume with little real
          overlap against a specific posting should score low (below 40).
          A strong, specific match should score high (75+).

          Return ONLY valid JSON in this exact format, nothing else:
          {
            "matchScore": number (0-100),
            "matchedSkills": ["skill1", "skill2"],
            "missingSkills": ["skill3", "skill4"],
            "summary": "one or two honest sentences, 20-35 words"
          }

          Rules:
          - matchedSkills: skills/keywords from the job description that the
            resume clearly demonstrates. Max 8 items, short keywords only.
          - missingSkills: important skills/keywords the job description asks
            for that the resume does not evidence. Max 8 items, short keywords only.
          - Do not invent skills that aren't actually mentioned in either text.
          `,
      },
      {
        role: "user",
        content: `
          Job Description:
          ${jobDescription}

          Candidate's Skills: ${safeSkills.join(", ") || "None listed"}
          Candidate's Projects: ${safeProjects.join(", ") || "None listed"}
          Resume Text: ${resumeText.slice(0, 6000)}
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
      return res.status(500).json({
        message: "Couldn't analyze the match right now. Please try again.",
      });
    }

    const matchScore = Math.max(
      0,
      Math.min(100, Math.round(Number(parsed.matchScore) || 0)),
    );

    return res.status(200).json({
      matchScore,
      matchedSkills: Array.isArray(parsed.matchedSkills)
        ? parsed.matchedSkills.slice(0, 8)
        : [],
      missingSkills: Array.isArray(parsed.missingSkills)
        ? parsed.missingSkills.slice(0, 8)
        : [],
      summary: parsed.summary || "",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to compute match score: ${error.message}`,
    });
  }
};

export const generateQuestion = async (req, res) => {
  try {
    // NEW: `company` and `jobDescription` are both optional — jobDescription
    // lets the candidate paste a real posting so questions target that
    // specific role's requirements, not just the general job title.
    // `interviewType` is also optional — "panel" turns on Mock Panel Mode
    // (two alternating AI interviewers), anything else stays "solo".
    let {
      role,
      experience,
      mode,
      company,
      jobDescription,
      resumeText,
      projects,
      skills,
      interviewType,
      candidateName,
    } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();
    company = company?.trim() || null;
    // cap length so a huge pasted posting can't blow up prompt size/cost
    jobDescription = jobDescription?.trim().slice(0, 4000) || null;
    interviewType = interviewType === "panel" ? "panel" : "solo";
    candidateName = candidateName?.trim() || null;

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

    // the resume's actual name is preferred over the account's Google-login
    // name — a candidate's account name may be a nickname or spelled
    // differently from how they'd want to be addressed in the interview
    const displayName = candidateName || user.name;
    const firstName = displayName.trim().split(/\s+/)[0];

    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeSkills = Array.isArray(skills) ? skills : [];

    const projectText = safeProjects.length ? safeProjects.join(", ") : "None";
    const skillsText = safeSkills.length ? safeSkills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";

    const companyGuidance = getCompanyStyleGuidance(company);

    const userPrompt = `
        Role : ${role},
        Experience : ${experience},
        InterviewMode : ${mode},
        TargetCompany : ${company || "Not specified"},
        Projects : ${projectText},
        skills : ${skillsText},
        Resume : ${safeResume}
        `;

    if (!userPrompt.trim()) {
      return res.status(400).json({
        message: "Prompt content is empty.",
      });
    }

    // the opening question is always this exact, fixed line — greeting the
    // candidate by their real (resume) name and asking them to introduce
    // themselves. No AI call needed here: this must be 100% consistent
    // every single time, not AI-varied wording.
    const firstQuestion = `Ok ${firstName}, let's begin — first, introduce yourself. Walk me through your background and experience.`;

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
      interviewType,
      company,
      candidateName: displayName,
      jobDescription,
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
          // the opening "introduce yourself" question always comes from
          // Interviewer A in panel mode — B's turn starts from question 2
          askedBy: interviewType === "panel" ? "interviewerA" : null,
        },
      ],
    });

    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: interview.candidateName,
      role: interview.role,
      company: interview.company,
      hasJobDescription: Boolean(interview.jobDescription),
      interviewType: interview.interviewType,
      questions: interview.questions,
      sttKeyterms: buildSttKeyterms(interview),
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

  // panel mode: figure out whose turn it is next — used both for the
  // coding-question early exits below and the normal AI-generated path
  const isPanel = interview.interviewType === "panel";
  const nextAskedBy = isPanel ? nextPanelSpeaker(interview) : null;

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
    const dsaQuestion = pickCodingQuestion(interview);
    return {
      continueInterview: true,
      nextQuestion: buildCodingQuestion(
        dsaQuestion,
        isPanel ? "interviewerA" : null,
      ),
    };
  }

  // ---- follow-ups: how a real interviewer probes ----
  // "followup": the answer was thin, push for something concrete.
  // "probe":    the answer was solid, dig deeper into something specific the
  //             candidate actually said (why X over Y, what breaks at scale...).
  // Both stay on the SAME topic and each topic gets at most one of them.
  const lastAnswerText =
    !wasSkipped && typeof lastQuestion?.answer === "string"
      ? lastQuestion.answer.trim()
      : "";
  const lastAnswerWords = lastAnswerText.split(/\s+/).filter(Boolean).length;

  // a probe must never crowd out topics still waiting to be covered, so it
  // only happens when the interview budget has spare room after them
  const hasSpareSlot =
    remainingSlots - 1 >=
    uncoveredOrdered.length + (canAskCodingQuestion ? 1 : 0);

  const eligibleFollowUp =
    !wasSkipped &&
    isRealTopic &&
    topicUseCount === 1 &&
    lastScore > 0 &&
    lastScore < 6;

  const eligibleProbe =
    !wasSkipped &&
    isRealTopic &&
    topicUseCount === 1 &&
    lastScore >= 6 &&
    lastAnswerWords >= 25 &&
    hasSpareSlot;

  let action;
  let targetTopic = null;

  if (eligibleFollowUp) {
    action = "followup";
    targetTopic = lastTopic;
  } else if (eligibleProbe) {
    action = "probe";
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
    const dsaQuestion = pickCodingQuestion(interview);
    return {
      continueInterview: true,
      nextQuestion: buildCodingQuestion(
        dsaQuestion,
        isPanel ? "interviewerA" : null,
      ),
    };
  }

  const modeGuidance =
    interview.mode === "Technical"
      ? `This is a TECHNICAL interview — lean toward implementation details, tech stack
         choices, and how they solved a real problem.`
      : `This is an HR/behavioral interview — lean toward their role, ownership, decisions,
         and how they handled pressure or teamwork (STAR-style).`;


  const companyGuidance = getCompanyStyleGuidance(interview.company);

  const companyBlock = companyGuidance
    ? `
      COMPANY CONTEXT:
      ${companyGuidance}
      Let this shape HOW you probe (depth, framework, what you consider a strong answer).
      It must NOT change the SUBJECT of the question — the topic decided above still wins.
      Never mention the company name in the question itself.
      `
    : "";

  // panel mode: tells the AI which of the two interviewers is speaking next,
  // so the phrasing matches that persona's voice — the topic itself is
  // still decided above and never changes because of this
  const personaBlock = isPanel
    ? `
      YOUR PERSONA:
      ${getPersonaGuidance(nextAskedBy)}
      Write the question reflecting this persona's style and focus, while still following the
      topic instruction below — the persona changes HOW you ask, never WHAT topic is covered.
      `
    : "";

  // NEW: keeps every follow-up grounded in the actual posting's
  // responsibilities/required skills, when the candidate pasted one
  const jobDescriptionBlock = interview.jobDescription
    ? `
      JOB DESCRIPTION (this candidate is interviewing for exactly this posting):
      ${interview.jobDescription}

      When relevant to the topic you're asking about, favor angles that connect to what
      this specific posting actually asks for — its responsibilities and required skills —
      rather than generic questions about the role title alone. Don't quote the posting text
      verbatim in your question.
      `
    : "";

  const instructionLine =
    action === "followup"
      ? `The candidate's last answer (topic: "${lastTopic}") scored low (${lastScore}/10) and felt
         thin or vague. Ask ONE follow-up question that pushes for something concrete — a specific
         example, a number, or exactly what THEY personally did. Anchor it in something they
         actually said so it is clear you listened. Stay on this SAME topic.
         Do not introduce a new subject.
         Their last answer, word for word: """${lastAnswerText.slice(0, 1200)}"""`
      : action === "probe"
        ? `The candidate just gave a solid answer about "${lastTopic}". Ask ONE natural cross-question
           that digs deeper into something SPECIFIC they actually said: pick a concrete claim, tool,
           or decision from their last answer (quote or closely paraphrase it) and ask why they chose
           it over the alternatives, what the trade-off was, what could go wrong, or how it would
           change at larger scale. It must clearly build on their own words, the way a real
           interviewer probes. Stay on this SAME topic; do not introduce a new subject.
         Their last answer, word for word: """${lastAnswerText.slice(0, 1200)}"""`
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
      ${companyBlock}
      ${personaBlock}
      ${jobDescriptionBlock}
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
      Target Company: ${interview.company || "Not specified"}

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
        askedBy: nextAskedBy,
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
        askedBy: nextAskedBy,
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
      askedBy: nextAskedBy,
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

export const runCode = async (req, res) => {
  try {
    const { interviewId, questionIndex, code, language } = req.body;

    if (!interviewId || questionIndex === undefined || !code || !language) {
      return res.status(400).json({
        message: "interviewId, questionIndex, code and language are required.",
      });
    }

    const interview = await interviewModel.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const question = interview.questions[questionIndex];
    if (!question || question.type !== "coding" || !question.dsaQuestionId) {
      return res.status(400).json({ message: "This is not a coding question." });
    }

    const dsaQuestion = DSA_QUESTION_BANK.find(
      (q) => q.id === question.dsaQuestionId,
    );
    if (!dsaQuestion) {
      return res.status(404).json({ message: "Question data not found." });
    }

    const sampleCases = dsaQuestion.testCases.slice(0, 2);
    const runResult = await runTestCases({
      language,
      code,
      testCases: sampleCases,
    });

    if (!runResult.supported) {
      return res.status(200).json({
        results: [],
        supported: false,
        message: runResult.message,
      });
    }

    return res.status(200).json({ results: runResult.results, supported: true });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to run code: ${error.message}`,
    });
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
      skipped,
      language,
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

    const isCodingQuestion = question.type === "coding";

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

    if (!answer) {
      question.score = 0;
      question.feedback = isCodingQuestion
        ? "You did not submit any code."
        : "You did not submit an answer.";
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

    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = isCodingQuestion
        ? "Time limit exceeded. Code not evaluated."
        : "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;
      if (isCodingQuestion) question.language = language || null;

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

    if (isCodingQuestion) {
      const dsaQuestion = DSA_QUESTION_BANK.find(
        (q) => q.id === question.dsaQuestionId,
      );

      if (!dsaQuestion) {
        question.answer = answer;
        question.language = language || null;
        question.score = 0;
        question.feedback = "Could not grade this question — question data missing.";
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
          speakingMetrics: null,
        });
      }

      const runResult = await runTestCases({
        language,
        code: answer,
        testCases: dsaQuestion.testCases,
      });

      if (!runResult.supported) {
        const fallbackReviewMessages = [
          {
            role: "system",
            content: `
                You are a senior engineer reviewing code during a live interview. Automated
                test execution isn't available for this language, so judge correctness,
                communication, and confidence yourself, as carefully as you can from reading
                the code.

                Score these (0 to 10): confidence, communication, correctness.
                finalScore = average, rounded to nearest whole number.

                Feedback: 10-20 words, natural code-review tone.

                Return ONLY JSON:
                { "confidence": number, "communication": number, "correctness": number, "finalScore": number, "feedback": "..." }
                `,
          },
          {
            role: "user",
            content: `Problem: ${dsaQuestion.title} — ${dsaQuestion.description}\nLanguage: ${language}\nCode:\n${answer}`,
          },
        ];

        let fallbackParsed = null;
        try {
          const fbResponse = await askAi(fallbackReviewMessages);
          const cleanedFb = fbResponse
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();
          fallbackParsed = JSON.parse(cleanedFb);
        } catch {
          fallbackParsed = {
            confidence: 5,
            communication: 5,
            correctness: 5,
            finalScore: 5,
            feedback: runResult.message || "Automated grading unavailable for this language.",
          };
        }

        question.answer = answer;
        question.language = language || null;
        question.confidence = fallbackParsed.confidence;
        question.communication = fallbackParsed.communication;
        question.correctness = fallbackParsed.correctness;
        question.score = fallbackParsed.finalScore;
        question.feedback = fallbackParsed.feedback;

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
          speakingMetrics: null,
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
          content: `
              You are a senior software engineer doing a quick code review during a live interview.
              You are given a candidate's code for a DSA problem, and you already know how many
              of the hidden test cases it passed (that number is fixed and NOT yours to judge).

              Score ONLY these two things (0 to 10):
              1. communication – Is the code readable and reasonably well-structured (naming,
                 organization, clarity)?
              2. confidence – Does the approach look efficient and robust (reasonable time/space
                 complexity, handles edge cases, not a lucky hack)?

              Do NOT judge correctness — that has already been measured by running the code.

              Feedback Rules:
              - 10 to 20 words, natural code-review tone.
              - Mention one concrete thing about the approach or code quality.
              - Do NOT mention test pass/fail counts — that's added separately.

              Return ONLY valid JSON:
              {
                "confidence": number,
                "communication": number,
                "feedback": "short code-review comment"
              }
              `,
        },
        {
          role: "user",
          content: `
              Problem: ${dsaQuestion.title} — ${dsaQuestion.description}
              Language: ${language || "not specified"}
              Tests passed: ${testsPassedCount}/${testsTotalCount}

              Candidate's code:
              \`\`\`${language || ""}
              ${answer}
              \`\`\`
              `,
        },
      ];

      let reviewParsed = null;
      try {
        const reviewResponse = await askAi(reviewMessages);
        const cleanedReview = reviewResponse
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/, "")
          .trim();
        reviewParsed = JSON.parse(cleanedReview);
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
      const finalScore = Math.round(
        (correctness + confidence + communication) / 3,
      );

      question.answer = answer;
      question.language = language || null;
      question.confidence = confidence;
      question.communication = communication;
      question.correctness = correctness;
      question.score = finalScore;
      question.testResults = testResults;
      question.testsPassedCount = testsPassedCount;
      question.testsTotalCount = testsTotalCount;
      question.feedback = `${testsPassedCount}/${testsTotalCount} test cases passed. ${reviewParsed.feedback || ""}`.trim();

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
        speakingMetrics: null,
        testResults,
        testsPassedCount,
        testsTotalCount,
      });
    }

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
            ${
              interview.interviewType === "panel"
                ? `${getPersonaGuidance(question.askedBy)}\nWrite the "feedback" line in a tone that matches this persona.\n`
                : ""
            }
            - Write natural human feedback.
            - 10 to 15 words only.
            - Sound like real interview feedback.
            - Can suggest improvement if needed.
            - Do NOT repeat the question.
            - Do NOT explain scoring.
            - Keep tone professional and honest.

            Spoken reaction ("ack"):
            - This is what you say OUT LOUD right after hearing the answer, before moving on.
            - 6 to 14 words. Mention ONE specific thing the candidate actually said (a tool,
              decision or detail) so it is obvious you listened.
            - Stay neutral-to-warm. NEVER reveal or hint at quality: no "great", "excellent",
              "correct", "wrong", "weak", no scores.
            - Do NOT ask a question and do NOT give advice here.
            - If the answer was vague or had no specifics, just acknowledge it plainly,
              for example: "Okay, I see. Thank you."
            - Example: "Okay, so Redis handled your caching layer, got it."

            Return ONLY valid JSON in this format:

            {
            "confidence": number,
            "communication": number,
            "correctness": number,
            "finalScore": number,
            "feedback": "short human feedback",
            "ack": "short spoken reaction"
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
      ack: cleanAck(parsed.ack),
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

// panel mode: split the per-question scores by which interviewer asked
// them, so the report can show "Interviewer A: 7.5/10" separately from
// "Interviewer B: 8/10" instead of just one blended number
const computePerInterviewerScores = (interview, scorableQuestions) => {
  if (interview.interviewType !== "panel") return null;

  const byInterviewer = {
    interviewerA: { total: 0, count: 0 },
    interviewerB: { total: 0, count: 0 },
  };

  scorableQuestions.forEach((q) => {
    if (q.askedBy && byInterviewer[q.askedBy]) {
      byInterviewer[q.askedBy].total += q.score || 0;
      byInterviewer[q.askedBy].count += 1;
    }
  });

  return {
    interviewerA: byInterviewer.interviewerA.count
      ? Number(
          (
            byInterviewer.interviewerA.total / byInterviewer.interviewerA.count
          ).toFixed(1),
        )
      : 0,
    interviewerB: byInterviewer.interviewerB.count
      ? Number(
          (
            byInterviewer.interviewerB.total / byInterviewer.interviewerB.count
          ).toFixed(1),
        )
      : 0,
  };
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId, proctoring } = req.body;

    if (!interviewId) {
      return res.status(400).json({ message: "interviewId is required." });
    }

    const interview = await interviewModel.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "failed to find the interview",
      });
    }

    if (proctoring && typeof proctoring === "object") {
      interview.proctoring = {
        cameraEnabled: Boolean(proctoring.cameraEnabled),
        cameraDenied: Boolean(proctoring.cameraDenied),
        screenShared: Boolean(proctoring.screenShared),
        locationShared: Boolean(proctoring.locationShared),
        latitude:
          typeof proctoring.latitude === "number" ? proctoring.latitude : null,
        longitude:
          typeof proctoring.longitude === "number"
            ? proctoring.longitude
            : null,
        tabSwitchCount: Number(proctoring.tabSwitchCount) || 0,
        fullscreenExitCount: Number(proctoring.fullscreenExitCount) || 0,
        terminatedForMisbehavior: Boolean(proctoring.terminatedForMisbehavior),
      };
    }

    const scorableQuestions = interview.questions.filter((q) => !q.skipped);
    const totalQuestions = scorableQuestions.length;

    const verbalQuestions = scorableQuestions.filter(
      (q) => q.type !== "coding",
    );
    const totalVerbalQuestions = verbalQuestions.length;

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
    });

    verbalQuestions.forEach((q) => {
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
    const avgDeliveryScore = totalVerbalQuestions
      ? totalDeliveryScore / totalVerbalQuestions
      : 0;
    const avgWpm = totalVerbalQuestions ? totalWpm / totalVerbalQuestions : 0;

    const perInterviewerScores = computePerInterviewerScores(
      interview,
      scorableQuestions,
    );

    interview.finalScore = finalScore;
    interview.status = "Completed";

    await interview.save();

    return res.status(200).json({
      // NEW: report header shows "Software Engineer @ Google" when company is set
      role: interview.role,
      company: interview.company || null,
      hasJobDescription: Boolean(interview.jobDescription),
      interviewType: interview.interviewType,
      perInterviewerScores,
      proctoring: interview.proctoring || null,
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
        type: q.type || "verbal",
        askedBy: q.askedBy || null,
        language: q.language || null,
        answer: q.answer || "",
        testsPassedCount: q.testsPassedCount || 0,
        testsTotalCount: q.testsTotalCount || 0,
        testResults: q.testResults || null,
        speakingMetrics: q.type === "coding" ? null : q.speakingMetrics || null,
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
      // NEW: `company` included so the history list can show the target company
      .select("role company experience mode interviewType finalScore status createdAt");

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

    const verbalQuestions = scorableQuestions.filter(
      (q) => q.type !== "coding",
    );
    const totalVerbalQuestions = verbalQuestions.length;

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
    });

    verbalQuestions.forEach((q) => {
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
    const avgDeliveryScore = totalVerbalQuestions
      ? totalDeliveryScore / totalVerbalQuestions
      : 0;
    const avgWpm = totalVerbalQuestions ? totalWpm / totalVerbalQuestions : 0;

    const perInterviewerScores = computePerInterviewerScores(
      interview,
      scorableQuestions,
    );

    interview.status = "Completed";

    return res.status(200).json({

      role: interview.role,
      company: interview.company || null,
      hasJobDescription: Boolean(interview.jobDescription),
      interviewType: interview.interviewType,
      perInterviewerScores,
      proctoring: interview.proctoring || null,
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

export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await interviewModel.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found or you don't have permission to delete it.",
      });
    }

    return res.status(200).json({ message: "Interview deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Couldn't delete the interview. Please try again." });
  }
};

export const getAnalyticsSummary = async (req, res) => {
  try {
    const interviews = await interviewModel
      .find({ userId: req.userId, status: "Completed" })
      .sort({ createdAt: 1 })
      .select("role company mode finalScore createdAt questions proctoring");

    if (!interviews.length) {
      return res.status(200).json({
        totalInterviews: 0,
        averageScore: 0,
        currentStreak: 0,
        scoreTrend: [],
        skillAverages: { confidence: 0, communication: 0, correctness: 0 },
        weakTopics: [],
      });
    }

    const totalInterviews = interviews.length;
    const averageScore =
      interviews.reduce((sum, i) => sum + (i.finalScore || 0), 0) /
      totalInterviews;

    const scoreTrend = interviews.map((i, index) => ({
      label: `#${index + 1}`,
      date: i.createdAt,
      score: Number((i.finalScore || 0).toFixed(1)),
      role: i.role,
      company: i.company || null,
    }));

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;
    let scoredQuestionCount = 0;
    const topicScores = {};

    interviews.forEach((interview) => {
      (interview.questions || []).forEach((q) => {
        if (q.skipped) return;
        totalConfidence += q.confidence || 0;
        totalCommunication += q.communication || 0;
        totalCorrectness += q.correctness || 0;
        scoredQuestionCount += 1;

        const topic = q.topicHint || "general";
        if (topic === "general" || topic === "introduction") return;

        if (!topicScores[topic]) {
          topicScores[topic] = { total: 0, count: 0 };
        }
        topicScores[topic].total += q.score || 0;
        topicScores[topic].count += 1;
      });
    });

    const skillAverages = {
      confidence: scoredQuestionCount
        ? Number((totalConfidence / scoredQuestionCount).toFixed(1))
        : 0,
      communication: scoredQuestionCount
        ? Number((totalCommunication / scoredQuestionCount).toFixed(1))
        : 0,
      correctness: scoredQuestionCount
        ? Number((totalCorrectness / scoredQuestionCount).toFixed(1))
        : 0,
    };

    const weakTopics = Object.entries(topicScores)
      .map(([topic, { total, count }]) => ({
        topic: topic
          .replace("project: ", "Project: ")
          .replace("skills: ", "Skills: ")
          .replace("coding-question", "Coding Round")
          .replace(
            "activity-or-certification (find in resume text if present)",
            "Achievements / Certifications",
          ),
        averageScore: Number((total / count).toFixed(1)),
        count,
      }))
      .filter((t) => t.averageScore < 6)
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 5);

    const dayKeys = new Set(
      interviews.map((i) => new Date(i.createdAt).toDateString()),
    );
    let currentStreak = 0;
    let cursor = new Date();
    while (dayKeys.has(cursor.toDateString())) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return res.status(200).json({
      totalInterviews,
      averageScore: Number(averageScore.toFixed(1)),
      currentStreak,
      scoreTrend,
      skillAverages,
      weakTopics,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to load analytics summary: ${error}`,
    });
  }
};