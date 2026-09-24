export const FILLER_WORDS = [
  "um",
  "umm",
  "uh",
  "uhh",
  "er",
  "ah",
  "hmm",
  "like",
  "actually",
  "basically",
  "literally",
  "you know",
  "i mean",
  "sort of",
  "kind of",
  "right",
  "well",
  "so",
  "yeah",
];

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const FILLER_REGEX = new RegExp(
  FILLER_WORDS.map((w) =>
    w.includes(" ")
      ? `\\b${w.split(" ").map(escapeRegExp).join("\\s+")}\\b`
      : `\\b${escapeRegExp(w)}\\b`,
  ).join("|"),
  "gi",
);

const round1 = (n) => Math.round(n * 10) / 10;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export function countFillerWords(text) {
  const clean = (text || "").trim().toLowerCase();
  if (!clean) return { count: 0, top: [], ratio: 0 };
  const matches = clean.match(FILLER_REGEX) || [];
  const freq = {};
  for (const m of matches) {
    const key = m.replace(/\s+/g, " ").trim();
    freq[key] = (freq[key] || 0) + 1;
  }
  const top = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word, n]) => ({ word, n }));
  const wordCount = clean.split(/\s+/).length;
  return {
    count: matches.length,
    top,
    ratio: wordCount ? round1((matches.length / wordCount) * 1000) / 1000 : 0,
  };
}

export function computeWpm(wordCount, seconds) {
  const s = Math.max(Number(seconds) || 0, 1);
  return Math.round(((Number(wordCount) || 0) / s) * 60);
}

export function scoreEyeContact(eyeContactPct) {
  const pct = clamp(Number(eyeContactPct) || 0, 0, 100);
  return round1(pct / 10);
}

export function scoreFillerUse(fillerRatio) {
  const r = clamp(Number(fillerRatio) || 0, 0, 1);
  return round1(clamp(10 - r * 60, 0, 10));
}

export function scorePace(wpm) {
  const w = Number(wpm) || 0;
  if (w <= 0) return 0;
  if (w >= 110 && w <= 170) return 10;
  if (w < 110) return round1(clamp(10 - ((110 - w) / 12), 0, 10));
  return round1(clamp(10 - ((w - 170) / 12), 0, 10));
}

export function computeConfidenceScore({
  eyeContactPct = null,
  fillerRatio = 0,
  wpm = 0,
  cameraUsed = false,
  wordCount = 0,
}) {
  const words = Number(wordCount) || 0;
  if (words < 5) {
    return {
      score: null,
      breakdown: null,
      notes: ["Not enough speech to judge delivery."],
    };
  }

  const fillerScore = scoreFillerUse(fillerRatio);
  const paceScore = scorePace(wpm);
  const notes = [];
  let score;

  if (cameraUsed && eyeContactPct != null) {
    const eyeScore = scoreEyeContact(eyeContactPct);
    score = round1(eyeScore * 0.4 + fillerScore * 0.3 + paceScore * 0.3);
    const pct = Math.round(eyeContactPct);
    if (pct >= 70) notes.push(`Strong eye contact — held the camera ${pct}% of the time.`);
    else if (pct >= 40)
      notes.push(`Eye contact was decent (${pct}%) — look at the camera a little more.`);
    else
      notes.push(`Eye contact was low (${pct}%) — looking at the camera builds trust.`);
    var breakdown = { eye: eyeScore, filler: fillerScore, pace: paceScore };
  } else {
    score = round1(fillerScore * 0.5 + paceScore * 0.5);
    notes.push("Camera was off — eye-contact tracking skipped.");
    var breakdown = { eye: null, filler: fillerScore, pace: paceScore };
  }

  const fillerCount = Math.round(fillerRatio * words);
  const topNote = fillerCount === 0
    ? "Clean delivery — almost no filler words."
    : fillerRatio <= 0.06
      ? `${fillerCount} filler word${fillerCount === 1 ? "" : "s"} — keep an eye on it.`
      : `${fillerCount} filler words slowed the answer — pause instead of filling silence.`;
  notes.push(topNote);

  if (wpm < 90) notes.push(`Speaking pace was slow (${wpm} wpm) — pick up the energy a little.`);
  else if (wpm > 190) notes.push(`Speaking pace was fast (${wpm} wpm) — slow down so every word lands.`);
  else notes.push(`Steady, confident pace (${wpm} wpm).`);

  return { score: clamp(score, 0, 10), breakdown, notes };
}

export function summarizeQuestionMetrics(m) {
  if (!m) return "";
  const parts = [];
  if (m.cameraUsed && m.eyeContactPct != null)
    parts.push(`eye contact ${Math.round(m.eyeContactPct)}% of the time`);
  else parts.push("camera off");
  parts.push(
    m.fillerWords === 0
      ? "no filler words"
      : `${m.fillerWords} filler word${m.fillerWords === 1 ? "" : "s"}`,
  );
  if (m.wordsPerMinute != null) {
    const w = m.wordsPerMinute;
    parts.push(
      w < 90 ? "pace slightly slow" : w > 190 ? "pace slightly fast" : "steady pace",
    );
  }
  return parts.join(" · ");
}
