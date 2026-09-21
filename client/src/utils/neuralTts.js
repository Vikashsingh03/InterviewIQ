// Neural interviewer voice engine.
//
// Tries the server's neural TTS (Deepgram Aura, proxied through
// POST /api/interview/tts so the API key never leaves the server) and falls
// back to the browser's built-in speech synthesis when the server has no key.
//
// Resilience policy: a single failed neural request only affects that one
// chunk (spoken with the browser voice instead) — the engine keeps trying
// neural for the next chunks. Only after 3 consecutive failures does it
// degrade to the browser voice for the rest of the session, and it reports
// that via onProviderChange so the UI badge stays truthful.
//
// Usage:
//   const tts = createTts({
//     getConfig: async () => (await axios.get(url + "/api/interview/tts-config", { withCredentials: true })).data,
//     fetchAudio: async (chunk, voiceGender) => (await axios.post(url + "/api/interview/tts", { text: chunk, voiceGender }, { withCredentials: true, responseType: "arraybuffer" })).data,
//     browser: {
//       speak: (chunk, voiceGender) => Promise,   // resolves when the utterance ends
//       cancel: () => void,
//     },
//     onProviderChange: (p) => {}, // "deepgram" | "browser"
//   });
//   await tts.speak("Hello!", "female");
//   tts.cancel();

const MAX_CHARS_PER_REQUEST = 1800;
// consecutive neural failures before giving up on it for the session
const MAX_CONSECUTIVE_FAILURES = 3;

// split long text at sentence boundaries so no single TTS request gets huge
const splitIntoChunks = (text) => {
  const clean = text.trim();
  if (clean.length <= MAX_CHARS_PER_REQUEST) return [clean];
  const sentences = clean.match(/[^.!?]+[.!?]+["']?\s*/g) || [clean];
  const chunks = [];
  let current = "";
  for (const s of sentences) {
    if (current && current.length + s.length > MAX_CHARS_PER_REQUEST) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [clean];
};

// strip markdown / code / links so the voice doesn't read out "asterisk asterisk"
export const cleanTextForSpeech = (text) =>
  String(text || "")
    .replace(/```[\s\S]*?```/g, " code sample ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/[*_#>|~]/g, "")
    .replace(/https?:\/\/\S+/g, " link ")
    .replace(/\s+/g, " ")
    .trim();

export const createTts = ({ getConfig, fetchAudio, browser, onProviderChange }) => {
  let configPromise = null;
  let generation = 0; // bumped on every speak()/cancel() so stale loops stop
  let currentAudio = null;
  let provider = null; // "deepgram" | "browser" — resolved lazily, then cached
  let consecutiveFailures = 0;
  const audioCache = new Map(); // `${voiceGender}::${chunk}` -> Blob

  const setProvider = (p) => {
    if (provider === p) return;
    provider = p;
    if (typeof onProviderChange === "function") {
      try {
        onProviderChange(p);
      } catch {
        /* noop */
      }
    }
  };

  const resolveProvider = async () => {
    if (provider) return provider;
    if (!configPromise) {
      configPromise = Promise.resolve()
        .then(() => getConfig())
        .then((cfg) => (cfg && cfg.provider === "deepgram" ? "deepgram" : "browser"))
        .catch(() => "browser");
    }
    setProvider(await configPromise);
    return provider;
  };

  // for UI badges ("Neural voice" vs "Standard voice")
  const getProvider = () => resolveProvider();

  const playBlob = (blob) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudio = audio;
      const done = (fn) => () => {
        URL.revokeObjectURL(url);
        if (currentAudio === audio) currentAudio = null;
        fn();
      };
      audio.onended = done(resolve);
      audio.onerror = done(() => reject(new Error("audio playback failed")));
      audio.play().catch(done(() => reject(new Error("audio play() rejected"))));
    });

  const speakNeural = async (chunk, voiceGender, myGeneration) => {
    const key = `${voiceGender}::${chunk}`;
    let blob = audioCache.get(key);
    if (!blob) {
      const buf = await fetchAudio(chunk, voiceGender); // ArrayBuffer
      blob = new Blob([buf], { type: "audio/mpeg" });
      // keep the cache small — repeated prompts ("Are you still there?")
      // hit it, everything else is one-shot
      if (audioCache.size > 40) audioCache.clear();
      audioCache.set(key, blob);
    }
    if (myGeneration !== generation) return; // cancelled while fetching
    await playBlob(blob);
  };

  // one chunk: neural first; on failure speak just this chunk with the
  // browser voice but keep neural as the primary provider
  const speakChunk = async (chunk, voiceGender, myGeneration) => {
    if (provider !== "deepgram") {
      await browser.speak(chunk, voiceGender);
      return;
    }
    try {
      await speakNeural(chunk, voiceGender, myGeneration);
      consecutiveFailures = 0;
    } catch (err) {
      consecutiveFailures += 1;
      console.warn(
        `[tts] neural voice chunk failed (${consecutiveFailures} in a row):`,
        err && err.message ? err.message : err,
      );
      if (myGeneration !== generation) return; // cancelled meanwhile
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.warn(
          "[tts] neural voice keeps failing — using browser voice from here on",
        );
        setProvider("browser");
      }
      // the chunk still gets spoken, just with the browser voice this once
      await browser.speak(chunk, voiceGender);
    }
  };

  const speak = async (text, voiceGender = "female") => {
    const myGeneration = ++generation;
    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return;
    await resolveProvider();
    const chunks = splitIntoChunks(cleaned);
    for (const chunk of chunks) {
      if (myGeneration !== generation) return; // cancelled
      await speakChunk(chunk, voiceGender, myGeneration);
      if (myGeneration !== generation) return;
    }
  };

  const cancel = () => {
    generation += 1;
    try {
      if (currentAudio) currentAudio.pause();
    } catch {
      /* noop */
    }
    currentAudio = null;
    try {
      browser.cancel();
    } catch {
      /* noop */
    }
  };

  return { speak, cancel, getProvider };
};
