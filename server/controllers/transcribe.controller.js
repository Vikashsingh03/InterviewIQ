import axios from "axios";
import multer from "multer";

// Multer sits in FRONT of the handler (see SERVER_STEPS.md for the route
// line): it parses the multipart upload into memory — the audio never
// touches the server's disk, it goes straight from RAM to Deepgram.
export const transcribeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB — plenty for a few minutes of opus audio
}).single("audio");

// nova-3 is Deepgram's most accurate English model; smart_format adds
// punctuation/capitalization so the transcript reads like a real answer.
const LISTEN_URL =
  "https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&punctuate=true&language=en";
const TRANSCRIBE_TIMEOUT_MS = 60000;

// POST /api/interview/transcribe  (auth middleware applied at the route)
// Body: multipart/form-data with a single "audio" file field.
// Answers: { transcript } — empty string when Deepgram heard nothing.
export const transcribeAudio = async (req, res) => {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "transcription not configured" });
  }

  if (!req.file || !req.file.buffer || !req.file.buffer.length) {
    return res.status(400).json({ error: "audio file is required" });
  }

  try {
    const { data } = await axios.post(LISTEN_URL, req.file.buffer, {
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": req.file.mimetype || "audio/webm",
      },
      timeout: TRANSCRIBE_TIMEOUT_MS,
      // Deepgram answers JSON for /listen
      responseType: "json",
    });

    const transcript =
      data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
    return res.json({ transcript });
  } catch (err) {
    console.error(
      "[stt] Deepgram listen failed:",
      err?.response?.status,
      err?.response?.data?.err_msg || err?.message,
    );
    return res
      .status(502)
      .json({ error: "transcription temporarily unavailable" });
  }
};
