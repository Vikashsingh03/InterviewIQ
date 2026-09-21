// ---------------------------------------------------------------------------
// voiceCommands — the single source of truth for spoken interview commands.
//
// A voice COMMAND is an imperative addressed to the interviewer ("skip",
// "repeat the question", "wait a second"). It almost always OPENS the
// utterance, so matching is anchored at the START (after stripping polite
// filler openers like "please" / "can you" / "yeah"). An answer that merely
// *mentions* one of these words mid-sentence ("we used a skip list", "I want
// to repeat the deployment") is NEVER treated as a command.
//
// Used in two places, which must always agree with each other:
//   1. useVoiceAnswer's real-time spotter — fires onCommand the instant the
//      browser's interim recognition opens with a command (no waiting).
//   2. The post-transcription safety net in Step2Interview /
//      Step2PanelInterview — a short, command-shaped Deepgram transcript is
//      handled as a command and is NEVER submitted as an answer.
// ---------------------------------------------------------------------------

// filler openers people put before a command: "please skip", "can you repeat
// the question", "yeah, wait a second", "umm, hold on"
const LEAD_FILLER =
  "please|can you|could you|would you|yeah|yes|yep|ok|okay|so|uh|um|umm|hmm|er|well|hey|just|actually";

// zero or more filler words, each followed by whitespace
const LEAD = `(?:(?:${LEAD_FILLER})\\s+)*`;

export const VOICE_COMMAND_PATTERNS = [
  {
    id: "repeat",
    re: new RegExp(`^(?:${LEAD})(repeat|say that again|come again|pardon)\\b`, "i"),
  },
  {
    id: "skip",
    re: new RegExp(`^(?:${LEAD})(skip|next question|move on)\\b`, "i"),
  },
  {
    id: "wait",
    re: new RegExp(
      `^(?:${LEAD})(wait|hold on|one moment|give me a (?:second|moment))\\b`,
      "i",
    ),
  },
];

// an utterance longer than this is answer content, not a command — even if it
// opens with a command word ("skip the duplicates by using a hash set…")
export const VOICE_COMMAND_MAX_WORDS = 6;

export function getVoiceCommand(text) {
  let t = (text || "").toLowerCase();
  // speech recognition / Deepgram punctuation is noise for command spotting
  t = t.replace(/[.,!?;:…]+/g, " ").replace(/\s+/g, " ").trim();
  if (!t) return null;
  if (t.split(" ").length > VOICE_COMMAND_MAX_WORDS) return null;
  const hit = VOICE_COMMAND_PATTERNS.find((c) => c.re.test(t));
  return hit ? hit.id : null;
}
