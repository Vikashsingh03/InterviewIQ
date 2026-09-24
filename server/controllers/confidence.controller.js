const round1 = (n) => Math.round(n * 10) / 10;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, Number(n) || 0));

const scoreEyeContact = (pct) => round1(clamp(pct, 0, 100) / 10);
const scoreFillerUse = (ratio) => round1(clamp(10 - clamp(ratio, 0, 1) * 60, 0, 10));
const scorePace = (wpm) => {
  const w = Number(wpm) || 0;
  if (w <= 0) return 0;
  if (w >= 110 && w <= 170) return 10;
  if (w < 110) return round1(clamp(10 - (110 - w) / 12, 0, 10));
  return round1(clamp(10 - (w - 170) / 12, 0, 10));
};

export const sanitizeConfidenceMetrics = (raw) => {
  if (!raw || typeof raw !== "object") return null;
  const eyeContactPct =
    raw.eyeContactPct == null ? null : Math.round(clamp(raw.eyeContactPct, 0, 100));
  return {
    eyeContactPct,
    framesSampled: Math.max(0, Math.round(Number(raw.framesSampled) || 0)),
    fillerWords: Math.max(0, Math.round(Number(raw.fillerWords) || 0)),
    fillerRatio: clamp(raw.fillerRatio, 0, 1),
    wordCount: Math.max(0, Math.round(Number(raw.wordCount) || 0)),
    wordsPerMinute: Math.max(0, Math.round(Number(raw.wordsPerMinute) || 0)),
    speakingSeconds: Math.max(0, Math.round(Number(raw.speakingSeconds) || 0)),
    cameraUsed: Boolean(raw.cameraUsed) && eyeContactPct != null,
  };
};

export const scoreConfidence = (m) => {
  const notes = [];
  if (!m || m.wordCount < 5) {
    return { score: null, notes: ["Not enough speech to judge delivery."] };
  }
  const fillerScore = scoreFillerUse(m.fillerRatio);
  const paceScore = scorePace(m.wordsPerMinute);
  let score;
  let breakdown;
  if (m.cameraUsed) {
    const eyeScore = scoreEyeContact(m.eyeContactPct);
    score = round1(eyeScore * 0.4 + fillerScore * 0.3 + paceScore * 0.3);
    breakdown = { eye: eyeScore, filler: fillerScore, pace: paceScore };
    const pct = Math.round(m.eyeContactPct);
    if (pct >= 70) notes.push(`Strong eye contact — held the camera ${pct}% of the time.`);
    else if (pct >= 40) notes.push(`Eye contact was decent (${pct}%) — look at the camera a little more.`);
    else notes.push(`Eye contact was low (${pct}%) — looking at the camera builds trust.`);
  } else {
    score = round1(fillerScore * 0.5 + paceScore * 0.5);
    breakdown = { eye: null, filler: fillerScore, pace: paceScore };
    notes.push("Camera was off — eye-contact tracking skipped.");
  }
  if (m.fillerWords === 0) notes.push("Clean delivery — almost no filler words.");
  else if (m.fillerRatio <= 0.06)
    notes.push(`${m.fillerWords} filler word${m.fillerWords === 1 ? "" : "s"} — keep an eye on it.`);
  else
    notes.push(`${m.fillerWords} filler words slowed the answer — pause instead of filling silence.`);
  const w = m.wordsPerMinute;
  if (w < 90) notes.push(`Speaking pace was slow (${w} wpm) — pick up the energy a little.`);
  else if (w > 190) notes.push(`Speaking pace was fast (${w} wpm) — slow down so every word lands.`);
  else notes.push(`Steady, confident pace (${w} wpm).`);
  return { score: clamp(score, 0, 10), breakdown, notes };
};

export const buildConfidenceMetrics = (raw) => {
  const clean = sanitizeConfidenceMetrics(raw);
  if (!clean) return undefined;
  const { score, notes } = scoreConfidence(clean);
  return { ...clean, confidenceScore: score, notes };
};

export const summarizeInterviewConfidence = (questions) => {
  const verbal = (questions || []).filter((q) => !q.skipped && q.type !== "coding");
  let eyeTotal = 0, eyeN = 0, scoreTotal = 0, scoreN = 0, fillerTotal = 0;
  for (const q of verbal) {
    const cm = q.confidenceMetrics;
    if (!cm) continue;
    if (cm.eyeContactPct != null) { eyeTotal += cm.eyeContactPct; eyeN++; }
    if (cm.confidenceScore != null) { scoreTotal += cm.confidenceScore; scoreN++; }
    fillerTotal += cm.fillerWords || 0;
  }
  const avgEyeContactPct = eyeN ? Math.round(eyeTotal / eyeN) : null;
  const avgConfidenceScore = scoreN ? round1(scoreTotal / scoreN) : null;
  const lines = [];
  if (avgEyeContactPct != null)
    lines.push(
      avgEyeContactPct >= 70
        ? `Eye contact held ${avgEyeContactPct}% of the time — strong presence.`
        : avgEyeContactPct >= 40
          ? `Eye contact ${avgEyeContactPct}% of the time — look at the camera a little more.`
          : `Eye contact only ${avgEyeContactPct}% of the time — this is the biggest confidence lever.`,
    );
  else lines.push("Camera was off — eye contact wasn't tracked this interview.");
  if (fillerTotal > 0) lines.push(`${fillerTotal} filler words across the interview.`);
  else lines.push("No filler words detected — clean delivery.");
  return { avgEyeContactPct, avgConfidenceScore, totalFillerWords: fillerTotal, eyeSamples: eyeN, scoreSamples: scoreN, lines };
};
