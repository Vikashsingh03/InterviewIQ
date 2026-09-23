export const INTERVIEW_LANGUAGES = ["english", "hinglish", "hindi"];

export const sanitizeInterviewLanguage = (value) =>
  INTERVIEW_LANGUAGES.includes(value) ? value : "english";

export const STT_LANGUAGES = ["en", "hi"];

export const sanitizeSttLanguage = (value, fallback) =>
  STT_LANGUAGES.includes(value) ? value : fallback || "en";

const EXAMPLES_NOTE =
  "Any example sentences shown in English elsewhere in this prompt are style examples only — always rewrite them in the interview language.";

const HINGLISH_INSTRUCTION = [
  "INTERVIEW LANGUAGE: Hinglish.",
  "Write everything the candidate will read or hear — questions, spoken reactions, feedback, coaching, chat replies — in natural Hinglish: the Roman-script Hindi-English mix Indians actually speak in interviews (example: \"aap apne project ke baare me batao, wahan sabse tough part kya tha?\").",
  "Never use Devanagari script. Keep the candidate's own words, project names and technical terms exactly as they said them.",
  "Keep ALL JSON keys, enum values (\"easy\", \"medium\", \"hard\") and the JSON structure exactly in English — only the human-readable string values switch to Hinglish.",
  EXAMPLES_NOTE,
].join("\n");

const HINDI_INSTRUCTION = [
  "INTERVIEW LANGUAGE: Hindi.",
  "Write everything the candidate will read or hear — questions, spoken reactions, feedback, coaching, chat replies — in natural, respectful Hindi using Devanagari script (example: \"आप अपने प्रोजेक्ट के बारे में बताइए, वहां सबसे कठिन हिस्सा क्या था?\").",
  "Keep the candidate's own words, project names and technical terms exactly as they said them.",
  "Keep ALL JSON keys, enum values (\"easy\", \"medium\", \"hard\") and the JSON structure exactly in English — only the human-readable string values switch to Hindi.",
  EXAMPLES_NOTE,
].join("\n");

export const buildLanguageInstruction = (language) => {
  if (language === "hinglish") return HINGLISH_INSTRUCTION;
  if (language === "hindi") return HINDI_INSTRUCTION;
  return "";
};

export const spokenStyleFor = (language) =>
  language === "hindi"
    ? "natural spoken Hindi in Devanagari script"
    : language === "hinglish"
      ? "natural spoken Hinglish in Roman script"
      : "natural spoken English";

export const firstQuestionFor = (firstName, language) => {
  const name = String(firstName || "there").trim() || "there";
  if (language === "hinglish")
    return `Ok ${name}, chalo shuru karte hain — pehle apne baare me batao. Apna background aur experience share karo.`;
  if (language === "hindi")
    return `ठीक है ${name}, चलो शुरू करते हैं — पहले अपना परिचय दीजिए। अपने background और experience के बारे में बताइए।`;
  return `Ok ${name}, let's begin — first, introduce yourself. Walk me through your background and experience.`;
};

const ENGLISH_ACKS = [
  "Okay, got it.",
  "Alright, thanks for that.",
  "Mm-hmm, understood.",
  "Okay, I see. Thank you.",
  "Right, noted.",
];

const HINGLISH_ACKS = [
  "Okay, samajh gaya.",
  "Alright, thanks — batao aage.",
  "Hmm, got it.",
  "Okay, I see. Thank you.",
  "Right, noted.",
];

const HINDI_ACKS = [
  "ठीक है, समझ गया।",
  "अच्छा, धन्यवाद।",
  "हम्म, समझ गया।",
  "ठीक है, नोट कर लिया।",
];

export const neutralAcksFor = (language) => {
  if (language === "hinglish") return HINGLISH_ACKS;
  if (language === "hindi") return HINDI_ACKS;
  return ENGLISH_ACKS;
};

export const neutralAckFor = (language) => {
  const list = neutralAcksFor(sanitizeInterviewLanguage(language));
  return list[Math.floor(Math.random() * list.length)];
};

export const isJudgementalAck = (text) => {
  if (typeof text !== "string") return false;
  if (
    /\b(great|excellent|perfect|correct|incorrect|wrong|good job|well done|impressive|nice answer|weak|poor|score|marks?|out of)\b/i.test(
      text,
    )
  )
    return true;
  if (/(बहुत बढ़िया|बहुत अच्छा|बहुत खूब|शाबाश|बढ़िया)/.test(text)) return true;
  return /\b(shabash|shabaash|badhiya|bahut badhiya|bahut achha|bilkul sahi|bilkul galat)\b/i.test(
    text,
  );
};

const FIXED_LINES = {
  english: {
    skippedFeedback: "Skipped by the candidate.",
    gradingUnavailable: "Automated grading unavailable for this language.",
    evalUnavailable: "Could not evaluate this answer automatically.",
    coachOpening:
      "Hey! I went through your interview — want to talk through where you can improve the most?",
    coachReply:
      "Sorry, I couldn't think that through just now — mind trying again?",
  },
  hinglish: {
    skippedFeedback: "Candidate ne skip kar diya.",
    gradingUnavailable: "Is language ke liye automated grading available nahi hai.",
    evalUnavailable: "Is jawab ko automatically evaluate nahi kar paye.",
    coachOpening:
      "Hey! Maine tumhara interview dekha — batao, sabse zyada improve kahan kar sakte ho, uspe baat karein?",
    coachReply: "Sorry, abhi soch nahi paya — ek baar phir try karoge?",
  },
  hindi: {
    skippedFeedback: "उम्मीदवार ने छोड़ दिया।",
    gradingUnavailable: "इस language के लिए automated grading उपलब्ध नहीं है।",
    evalUnavailable: "इस जवाब का automatic मूल्यांकन नहीं हो पाया।",
    coachOpening:
      "नमस्ते! मैंने तुम्हारा interview देखा — बताओ, सबसे ज़्यादा सुधार कहां कर सकते हो, उस पर बात करें?",
    coachReply: "माफ़ करना, अभी सोच नहीं पाया — एक बार फिर कोशिश करोगे?",
  },
};

export const fixedLineFor = (key, language) => {
  const lines =
    FIXED_LINES[sanitizeInterviewLanguage(language)] || FIXED_LINES.english;
  return lines[key] || FIXED_LINES.english[key] || "";
};
