

const DEEPGRAM_WS_URL = "wss://api.deepgram.com/v1/listen";
const MAX_KEYTERMS = 40;
const QUICK_FAIL_MS = 2000; // a session dying sooner than this counts as a failure
const MAX_FAILURES_BEFORE_FALLBACK = 2;
const FLUSH_TIMEOUT_MS = 1200; // how long stop() waits for Deepgram's last words

const pickMimeType = (MediaRecorderCtor) => {
  if (!MediaRecorderCtor || typeof MediaRecorderCtor.isTypeSupported !== "function") {
    return undefined;
  }
  return ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((t) =>
    MediaRecorderCtor.isTypeSupported(t),
  );
};

// shaped like a SpeechRecognitionResult: array-like of alternatives + isFinal
const makeResult = (text, isFinal) => {
  const result = [{ transcript: text, confidence: 1 }];
  result.isFinal = isFinal;
  return result;
};

const buildDeepgramUrl = (cfg, keyterms) => {
  const model = cfg.model || "nova-3";
  const params = new URLSearchParams({
    model,
    language: cfg.language || "en",
    smart_format: "true",
    interim_results: "true",
    endpointing: "800",
    utterance_end_ms: "1500",
    access_token: cfg.token,
  });
  const isNova3 = model.startsWith("nova-3");
  keyterms.slice(0, MAX_KEYTERMS).forEach((term) => {
    // nova-3 uses `keyterm`, older models use `keywords=term:boost`
    params.append(isNova3 ? "keyterm" : "keywords", isNova3 ? term : `${term}:2`);
  });
  return `${DEEPGRAM_WS_URL}?${params.toString()}`;
};

// one Deepgram connection = one listening session (start() -> stop())
class DeepgramSession {
  constructor({ url, getStream, deps, handlers }) {
    this.url = url;
    this.getStream = getStream;
    this.deps = deps;
    this.handlers = handlers;
    this.ws = null;
    this.recorder = null;
    this.finals = []; // finished utterances, exposed like SpeechRecognition results
    this.pending = []; // is_final pieces waiting for the utterance to end
    this.openedAt = 0;
    this.closed = false; // stop()/abort() requested
    this.stoppedByUser = false;
    this.finished = false; // _finish() already ran
    this.aborted = false;
    this.closeTimer = null;
  }

  async begin() {
    let stream;
    try {
      stream = await this.getStream();
    } catch (err) {
      if (this.closed) return;
      this.finished = true;
      const denied = err?.name === "NotAllowedError" || err?.name === "SecurityError";
      this.handlers.onError({ error: denied ? "not-allowed" : "audio-capture" });
      this.handlers.onEnd();
      return;
    }
    if (this.closed) return; // stopped while waiting for the mic

    let ws;
    try {
      ws = new this.deps.WebSocket(this.url);
    } catch {
      this._finish();
      return;
    }
    this.ws = ws;

    ws.onopen = () => {
      this.openedAt = Date.now();
      if (this.closed) {
        this._forceClose();
        return;
      }
      try {
        const mimeType = pickMimeType(this.deps.MediaRecorder);
        this.recorder = new this.deps.MediaRecorder(
          stream,
          mimeType ? { mimeType } : undefined,
        );
      } catch {
        this._forceClose();
        return;
      }
      this.recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0 && ws.readyState === 1) ws.send(e.data);
      };
      this.recorder.start(250);
    };
    ws.onmessage = (m) => this._onMessage(m);
    ws.onerror = () => {};
    ws.onclose = () => this._finish();
  }

  _onMessage(m) {
    let msg;
    try {
      msg = JSON.parse(m.data);
    } catch {
      return;
    }

    if (msg.type === "Results") {
      const text = (msg.channel?.alternatives?.[0]?.transcript || "").trim();
      if (msg.is_final) {
        if (text) this.pending.push(text);
        if (msg.speech_final) this._commit();
        else if (text) this._emitInterim("");
      } else if (text) {
        this._emitInterim(text);
      }
    } else if (msg.type === "UtteranceEnd") {
      this._commit();
    }
  }

  // words still being spoken: everything not yet committed, as one interim
  _emitInterim(extra) {
    const text = [...this.pending, extra].filter(Boolean).join(" ").trim();
    if (!text) return;
    this.handlers.onSpoke();
    this.handlers.onResult({
      resultIndex: this.finals.length,
      results: [...this.finals, makeResult(text, false)],
    });
  }

  // the speaker paused long enough: everything pending becomes ONE final
  // utterance (so "skip this question" arrives as a single phrase)
  _commit() {
    if (!this.pending.length) return;
    const text = this.pending.join(" ").trim();
    this.pending = [];
    if (!text) return;
    this.finals.push(makeResult(text, true));
    this.handlers.onSpoke();
    this.handlers.onResult({
      resultIndex: this.finals.length - 1,
      results: this.finals,
    });
  }

  stop() {
    if (this.closed) return;
    this.closed = true;
    this.stoppedByUser = true;

    const requestClose = () => {
      if (this.ws && this.ws.readyState === 1) {
        try {
          this.ws.send(JSON.stringify({ type: "CloseStream" }));
        } catch {
          /* socket already closing */
        }
        // give Deepgram a moment to flush the last words, then hang up
        this.closeTimer = setTimeout(() => this._forceClose(), FLUSH_TIMEOUT_MS);
      } else {
        this._forceClose();
      }
    };

    if (this.recorder && this.recorder.state !== "inactive") {
      // send CloseStream only AFTER the recorder has delivered its last chunk
      this.recorder.onstop = requestClose;
      try {
        this.recorder.stop();
      } catch {
        requestClose();
      }
    } else {
      requestClose();
    }
  }

  abort() {
    this.closed = true;
    this.stoppedByUser = true;
    this.aborted = true;
    this._forceClose();
  }

  _forceClose() {
    try {
      this.ws?.close();
    } catch {
      /* ignore */
    }
    this._finish(); // don't wait for onclose, it may never come
  }

  _finish() {
    if (this.finished) return;
    this.finished = true;
    clearTimeout(this.closeTimer);
    if (this.recorder && this.recorder.state !== "inactive") {
      try {
        this.recorder.stop();
      } catch {
        /* ignore */
      }
    }
    if (this.aborted) return;

    this._commit(); // never lose the last words

    const lived = this.openedAt ? Date.now() - this.openedAt : 0;
    const failedEarly = !this.stoppedByUser && (!this.openedAt || lived < QUICK_FAIL_MS);
    if (failedEarly) this.handlers.onFatal();
    else this.handlers.onEnd();
  }
}

class HybridRecognition {
  constructor({ fetchConfig, keyterms = [], deps = {} }) {
    this.deps = {
      WebSocket: globalThis.WebSocket,
      MediaRecorder: globalThis.MediaRecorder,
      BrowserRecognition:
        globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition,
      mediaDevices: globalThis.navigator?.mediaDevices,
      ...deps,
    };
    this.fetchConfig = fetchConfig;
    this.keyterms = keyterms;

    // same knobs as webkitSpeechRecognition (lang etc. apply to the browser fallback)
    this.lang = "en-US";
    this.continuous = true;
    this.interimResults = true;
    this.maxAlternatives = 1;
    this.onresult = null;
    this.onend = null;
    this.onerror = null;

    this._active = false;
    this._session = 0;
    this._backend = null; // "deepgram" | "browser" | null
    this._dg = null;
    this._browser = null;
    this._forceBrowser = false; // set once Deepgram proved unusable
    this._failures = 0;
    this._cfg = null;
    this._cfgExpiresAt = 0;
    this._streamPromise = null;
  }

  // ---- webkitSpeechRecognition-compatible API ----
  start() {
    if (this._active) {
      // the real API throws here too; callers wrap start() in try/catch
      throw new Error("InvalidStateError: recognition has already started");
    }
    this._active = true;
    this._begin(++this._session);
  }

  stop() {
    if (!this._active) return;
    this._active = false;
    if (this._backend === "deepgram") this._dg?.stop();
    else if (this._backend === "browser") this._stopBrowser();
  }

  abort() {
    this._active = false;
    this._dg?.abort();
    this._dg = null;
    if (this._browser) {
      try {
        this._browser.abort();
      } catch {
        /* ignore */
      }
    }
    this._backend = null;
    this._releaseStream();
  }

  // ---- internals ----
  async _begin(session) {
    let cfg = { provider: "browser" };
    if (!this._forceBrowser) {
      try {
        cfg = await this._getConfig();
      } catch {
        cfg = { provider: "browser" }; // transient: browser for THIS session only
      }
    }
    if (session !== this._session || !this._active) return; // stopped meanwhile

    if (cfg.provider === "deepgram" && !this._forceBrowser) {
      this._startDeepgram(session, cfg);
    } else {
      this._startBrowser(session);
    }
  }

  async _getConfig() {
    if (this._cfg && Date.now() < this._cfgExpiresAt) return this._cfg;
    const cfg = await this.fetchConfig();
    if (cfg?.provider === "deepgram" && cfg.token) {
      this._cfg = cfg;
      // reuse the short-lived token for reconnects until just before it expires
      this._cfgExpiresAt = Date.now() + Math.max(5, (cfg.expiresIn || 60) - 15) * 1000;
    } else {
      this._forceBrowser = true; // server has no Deepgram key: stop asking
      this._cfg = { provider: "browser" };
      this._cfgExpiresAt = Infinity;
    }
    return this._cfg;
  }

  _getStream() {
    if (this._streamPromise) {
      return this._streamPromise.then((stream) => {
        const live = stream.getAudioTracks().some((t) => t.readyState === "live");
        if (live) return stream;
        this._streamPromise = null;
        return this._getStream();
      });
    }
    const md = this.deps.mediaDevices;
    if (!md?.getUserMedia) {
      return Promise.reject(Object.assign(new Error("no mic"), { name: "NotSupportedError" }));
    }
    this._streamPromise = md
      .getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      })
      .catch((err) => {
        this._streamPromise = null;
        throw err;
      });
    return this._streamPromise;
  }

  _releaseStream() {
    const p = this._streamPromise;
    this._streamPromise = null;
    p?.then((s) => s.getTracks().forEach((t) => t.stop())).catch(() => {});
  }

  _startDeepgram(session, cfg) {
    this._backend = "deepgram";
    console.info("[speech] using Deepgram");
    const dg = new DeepgramSession({
      url: buildDeepgramUrl(cfg, this.keyterms),
      getStream: () => this._getStream(),
      deps: this.deps,
      handlers: {
        onResult: (event) => this.onresult?.(event),
        onSpoke: () => {
          this._failures = 0;
        },
        onError: (event) => {
          this._active = false;
          this.onerror?.(event);
        },
        onEnd: () => {
          if (session === this._session) this._active = false;
          this.onend?.();
        },
        onFatal: () => this._onDeepgramFailed(session),
      },
    });
    this._dg = dg;
    dg.begin();
  }

  // Deepgram wouldn't connect / died instantly: use the browser instead
  _onDeepgramFailed(session) {
    this._failures += 1;
    if (this._failures >= MAX_FAILURES_BEFORE_FALLBACK) {
      this._forceBrowser = true;
      this._releaseStream(); // free the mic so the browser engine can take it
    }
    this._cfg = null; // don't reuse a token that just failed
    if (session === this._session && this._active) {
      this._startBrowser(session);
    } else if (session === this._session) {
      this.onend?.();
    }
  }

  _startBrowser(session) {
    this._backend = "browser";
    console.info("[speech] using browser speech recognition");
    const Ctor = this.deps.BrowserRecognition;
    if (!Ctor) {
      this._active = false;
      this.onerror?.({ error: "not-supported" });
      this.onend?.();
      return;
    }
    if (!this._browser) {
      const r = new Ctor();
      r.onresult = (e) => this.onresult?.(e);
      r.onerror = (e) => this.onerror?.(e);
      r.onend = () => {
        this._active = false;
        this.onend?.();
      };
      this._browser = r;
    }
    this._browser.lang = this.lang;
    this._browser.continuous = this.continuous;
    this._browser.interimResults = this.interimResults;
    this._browser.maxAlternatives = this.maxAlternatives;
    try {
      this._browser.start();
    } catch {
      /* already running */
    }
    void session;
  }

  _stopBrowser() {
    try {
      this._browser?.stop();
    } catch {
      /* ignore */
    }
  }
}

export const createRecognition = ({ fetchConfig, keyterms = [], deps } = {}) =>
  new HybridRecognition({ fetchConfig, keyterms, deps });

export { buildDeepgramUrl }; 