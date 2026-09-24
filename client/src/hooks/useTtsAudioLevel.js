import { useEffect, useRef, useState } from "react";
export function useTtsAudioLevel(getAudio) {
  const [level, setLevel] = useState(0);
  const getAudioRef = useRef(getAudio);
  getAudioRef.current = getAudio;
  const lastSentRef = useRef(-1);
  useEffect(() => {
    let raf = 0;
    let ctx = null;
    let analyser = null;
    let source = null;
    let currentEl = null;
    let smooth = 0;
    const detach = () => {
      try {
        if (source) source.disconnect();
      } catch {}
      source = null;
      analyser = null;
      currentEl = null;
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      try {
        const el = getAudioRef.current ? getAudioRef.current() : null;
        if (el && el !== currentEl) {
          detach();
          try {
            if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (ctx.state === "suspended") ctx.resume();
            source = ctx.createMediaElementSource(el);
            analyser = ctx.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.55;
            source.connect(analyser);
            analyser.connect(ctx.destination);
            currentEl = el;
          } catch {
            detach();
          }
        }
        if (!el && currentEl) detach();
        let target = 0;
        if (analyser) {
          const buf = new Uint8Array(analyser.fftSize);
          analyser.getByteTimeDomainData(buf);
          let sum = 0;
          for (let i = 0; i < buf.length; i++) {
            const v = (buf[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / buf.length);
          target = Math.min(1, Math.max(0, (rms - 0.018) * 7));
        }
        smooth += (target - smooth) * (target > smooth ? 0.45 : 0.1);
        const q = Math.round(smooth * 40) / 40;
        if (q !== lastSentRef.current) {
          lastSentRef.current = q;
          setLevel(q);
        }
      } catch {}
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      detach();
      try {
        if (ctx) ctx.close();
      } catch {}
    };
  }, []);
  return level;
}
