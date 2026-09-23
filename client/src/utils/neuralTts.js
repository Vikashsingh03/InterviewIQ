const MAX_CHARS_PER_REQUEST = 1800;
const MAX_CONSECUTIVE_FAILURES = 3;
const splitIntoChunks = text => {
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
export const cleanTextForSpeech = text => String(text || "").replace(/```[\s\S]*?```/g, " code sample ").replace(/`([^`]*)`/g, "$1").replace(/[*_#>|~]/g, "").replace(/https?:\/\/\S+/g, " link ").replace(/\s+/g, " ").trim();
export const createTts = ({
  getConfig,
  fetchAudio,
  browser,
  onProviderChange,
  forceBrowser
}) => {
  let configPromise = null;
  let generation = 0;
  let currentAudio = null;
  let provider = null;
  let consecutiveFailures = 0;
  const audioCache = new Map();
  const setProvider = p => {
    if (provider === p) return;
    provider = p;
    if (typeof onProviderChange === "function") {
      try {
        onProviderChange(p);
      } catch {}
    }
  };
  const resolveProvider = async () => {
    if (provider) return provider;
    if (forceBrowser) {
      setProvider("browser");
      return provider;
    }
    if (!configPromise) {
      configPromise = Promise.resolve().then(() => getConfig()).then(cfg => cfg && cfg.provider === "deepgram" ? "deepgram" : "browser").catch(() => "browser");
    }
    setProvider(await configPromise);
    return provider;
  };
  const getProvider = () => resolveProvider();
  const playBlob = blob => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;
    const done = fn => () => {
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
      const buf = await fetchAudio(chunk, voiceGender);
      blob = new Blob([buf], {
        type: "audio/mpeg"
      });
      if (audioCache.size > 40) audioCache.clear();
      audioCache.set(key, blob);
    }
    if (myGeneration !== generation) return;
    await playBlob(blob);
  };
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
      console.warn(`[tts] neural voice chunk failed (${consecutiveFailures} in a row):`, err && err.message ? err.message : err);
      if (myGeneration !== generation) return;
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.warn("[tts] neural voice keeps failing — using browser voice from here on");
        setProvider("browser");
      }
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
      if (myGeneration !== generation) return;
      await speakChunk(chunk, voiceGender, myGeneration);
      if (myGeneration !== generation) return;
    }
  };
  const cancel = () => {
    generation += 1;
    try {
      if (currentAudio) currentAudio.pause();
    } catch {}
    currentAudio = null;
    try {
      browser.cancel();
    } catch {}
  };
  return {
    speak,
    cancel,
    getProvider
  };
};
