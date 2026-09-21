import axios from "axios";

// Neural interviewer voices (Deepgram Aura). The exact model can be swapped
// via env without touching code, e.g.:
//   DEEPGRAM_TTS_VOICE_FEMALE=aura-2-athena-en
//   DEEPGRAM_TTS_VOICE_MALE=aura-2-ares-en
const FEMALE_VOICE =
  process.env.DEEPGRAM_TTS_VOICE_FEMALE || "aura-2-thalia-en";
const MALE_VOICE = process.env.DEEPGRAM_TTS_VOICE_MALE || "aura-2-orion-en";

const TTS_TIMEOUT_MS = 30000;
// Deepgram speak accepts ~2000 chars per request; the client chunks longer
// text itself, this is just a server-side guard.
const MAX_CHARS = 2000;

const voiceModelFor = (voiceGender) =>
  voiceGender === "male" ? MALE_VOICE : FEMALE_VOICE;

// Lightweight capability check — the client calls this once per interview,
// then speaks through POST /tts directly (or uses the browser voice when the
// server has no Deepgram key).
export const getTtsConfig = async (req, res) => {
  if (!process.env.DEEPGRAM_API_KEY) {
    return res.json({ provider: "browser" });
  }
  return res.json({ provider: "deepgram" });
};

// Proxies text to Deepgram's Aura TTS and streams the MP3 back, so the API
// key never leaves the server. On any failure we answer with
// { provider: "browser" } instead of an error — the client then falls back to
// the browser's built-in voice and the interview never breaks mid-flow.
export const synthesizeSpeech = async (req, res) => {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      provider: "browser",
      message: "Neural voice is not configured on the server.",
    });
  }

  const { text, voiceGender } = req.body || {};
  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ message: "text is required" });
  }

  const clean = text.trim().slice(0, MAX_CHARS);
  const model = voiceModelFor(voiceGender);

  try {
    const { data } = await axios.post(
      `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(model)}&encoding=mp3`,
      { text: clean },
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
        timeout: TTS_TIMEOUT_MS,
      },
    );
    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "public, max-age=86400");
    return res.send(Buffer.from(data));
  } catch (err) {
    console.error(
      "[tts] Deepgram speak failed:",
      err?.response?.status,
      err?.message,
    );
    return res.status(502).json({
      provider: "browser",
      message: "Neural voice temporarily unavailable.",
    });
  }
};
