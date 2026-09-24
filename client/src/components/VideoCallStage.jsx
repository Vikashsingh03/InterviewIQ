import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaClosedCaptioning } from "react-icons/fa";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
function Equalizer({
  level,
  active
}) {
  const bars = [0.55, 0.9, 0.7, 1, 0.62];
  return <span className="flex items-end gap-[2.5px] h-3.5" aria-hidden="true">
      {bars.map((m, i) => <span key={i} className="w-0.75 rounded-full bg-[#E8A94C]" style={{
      height: active ? `${Math.max(3, 3 + level * 13 * m)}px` : "3px",
      opacity: active ? 0.65 + level * 0.35 : 0.35,
      transition: "height 110ms ease-out, opacity 200ms"
    }} />)}
    </span>;
}
function Waveform({
  level,
  active
}) {
  const bars = 52;
  return <div className="flex items-center justify-center gap-0.75 h-8 px-5" aria-hidden="true">
      {Array.from({
      length: bars
    }).map((_, i) => {
      const phase = 0.3 + 0.7 * Math.abs(Math.sin(i * 0.62));
      const h = active ? Math.max(3, 3 + level * 26 * phase) : 3;
      return <span key={i} className="w-[2.5px] rounded-full bg-[#E8A94C]" style={{
        height: `${h}px`,
        opacity: active ? 0.3 + Math.min(0.7, level * 1.4) : 0.15,
        transition: "height 120ms ease-out, opacity 250ms"
      }} />;
    })}
    </div>;
}
function InterviewerTile({
  tile,
  aspect,
  delay
}) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const level = tile.audioLevel || 0;
  const live = tile.speaking && level > 0.02;
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (tile.speaking) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [tile.speaking, tile.video]);
  return <div className="relative vcs-rise" style={{
    animationDelay: `${delay || 0}ms`
  }}>
      <div className={`absolute -inset-1.5 rounded-[20px] pointer-events-none transition-opacity duration-300 ${live ? "opacity-100" : "opacity-0"}`} style={{
      boxShadow: `0 0 ${26 + level * 60}px rgba(232,169,76,${0.35 + level * 0.45})`
    }} />
      <div className={`relative rounded-2xl overflow-hidden bg-[#0E1013] ring-1 transition-all duration-500 ${live ? "ring-[#E8A94C]/60" : "ring-white/10"}`}>
        <div className={`${aspect} relative overflow-hidden`}>
          {!ready && <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-[#0E1013]">
              <span className="vcs-shimmer w-10 h-10 rounded-full" />
              <span className="font-mono-studio text-[8px] tracking-[0.28em] text-white/40">CONNECTING</span>
            </div>}
          <video ref={videoRef} src={tile.video} key={tile.video} muted loop playsInline preload="auto" onLoadedData={() => setReady(true)} onLoadStart={() => setReady(false)} className={`w-full h-full object-cover transition-all duration-700 ${ready ? "opacity-100" : "opacity-0"} ${tile.speaking ? "vcs-kenburns" : ""}`} style={{
          filter: tile.speaking ? "brightness(1.03)" : "brightness(0.8) saturate(0.9)"
        }} />
          <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(120% 95% at 50% 18%, transparent 52%, rgba(0,0,0,0.5) 100%)"
        }} />
          <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {tile.speaking ? <span className="flex items-center gap-2 bg-black/55 backdrop-blur-md pl-2 pr-3 py-1.5 rounded-full ring-1 ring-[#E8A94C]/50">
                <Equalizer level={level} active={live} />
                <span className="font-mono-studio text-[8px] tracking-[0.24em] text-[#E8A94C]">SPEAKING</span>
              </span> : tile.listening ? <span className="flex items-center gap-1.5 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-full ring-1 ring-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 vcs-live-dot" />
                <span className="font-mono-studio text-[8px] tracking-[0.24em] text-white/80">LISTENING</span>
              </span> : null}
          </div>
          <div className="absolute top-3 right-3">
            <span className={`flex items-center justify-center w-7 h-7 rounded-full backdrop-blur-md ring-1 transition-colors duration-300 ${tile.speaking ? "bg-[#E8A94C] ring-[#E8A94C] text-black" : "bg-black/55 ring-white/15 text-white/70"}`}>
              <FaMicrophone size={11} />
            </span>
          </div>
          <div className="absolute bottom-9 left-3.5 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-linear-to-br from-[#E8A94C] to-[#7a5c28] flex items-center justify-center font-serif-display italic text-[15px] text-black ring-1 ring-white/25">
              {tile.name.charAt(0)}
            </span>
            <span className="flex flex-col leading-none gap-1">
              <span className="font-serif-display italic text-[17px] text-white/95">{tile.name}</span>
              <span className="font-mono-studio text-[7px] tracking-[0.24em] text-[#E8A94C]/90">{tile.role}</span>
            </span>
          </div>
          <span className="absolute bottom-9 right-3.5 font-mono-studio text-[8px] tracking-[0.14em] text-white/50 bg-black/50 backdrop-blur px-2 py-1 rounded-md ring-1 ring-white/10">HD</span>
          <div className={`absolute bottom-0 inset-x-0 transition-opacity duration-500 ${tile.speaking ? "opacity-100" : "opacity-0"}`}>
            <Waveform level={level} active={live} />
          </div>
        </div>
      </div>
    </div>;
}
function SelfTile({
  cameraStream,
  selfVideoRef,
  micOn,
  cameraOn,
  selfName,
  userLevel,
  wide
}) {
  const live = micOn && userLevel > 0.06;
  return <div className={`relative rounded-xl overflow-hidden bg-[#101216] ring-1 transition-all duration-300 ${live ? "ring-[#E8A94C]/60" : "ring-white/10"} ${wide ? "w-full aspect-video" : ""}`} style={live ? {
    boxShadow: `0 0 ${18 + userLevel * 36}px rgba(232,169,76,${0.3 + userLevel * 0.45})`
  } : undefined}>
      {cameraStream && cameraOn ? <video ref={selfVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" /> : <div className="w-full h-full min-h-23 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_50%_30%,rgba(232,169,76,0.07),transparent_70%)]">
          <span className="w-11 h-11 rounded-full bg-linear-to-br from-[#E8A94C]/25 to-[#E8A94C]/5 ring-1 ring-[#E8A94C]/35 flex items-center justify-center font-serif-display italic text-[19px] text-[#E8A94C]">
            {selfName.charAt(0).toUpperCase()}
          </span>
          <span className="font-mono-studio text-[7px] tracking-[0.26em] text-white/35">CAMERA OFF</span>
        </div>}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md ring-1 ring-white/10">
        <span className="font-mono-studio text-[8px] tracking-[0.18em] text-white/85">{selfName.toUpperCase()}</span>
      </div>
      <div className="absolute top-2 right-2">
        <span className={`flex items-center justify-center w-6 h-6 rounded-full backdrop-blur-md ring-1 transition-colors duration-300 ${micOn ? "bg-black/60 ring-white/15 text-white/70" : "bg-red-500 ring-red-400/60 text-white"}`}>
          {micOn ? <FaMicrophone size={10} /> : <FaMicrophoneSlash size={10} />}
        </span>
      </div>
      <span className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-red-500 vcs-live-dot" />
    </div>;
}
export default function VideoCallStage({
  interviewers = [],
  selfName = "You",
  cameraStream = null,
  selfVideoRef,
  micOn = true,
  cameraOn = true,
  userLevel = 0,
  roomLabel = "SOLO SESSION",
  timerText = "00:00",
  captionText = "",
  onToggleMic,
  onToggleCamera,
  onEndCall,
  tileAspect = "aspect-video",
  mode = "solo",
  progress = 0
}) {
  const [captionsOn, setCaptionsOn] = useState(true);
  const [confirmEnd, setConfirmEnd] = useState(false);
  useEffect(() => {
    if (!confirmEnd) return;
    const t = setTimeout(() => setConfirmEnd(false), 3200);
    return () => clearTimeout(t);
  }, [confirmEnd]);
  const handleEnd = () => {
    if (!confirmEnd) {
      setConfirmEnd(true);
      return;
    }
    setConfirmEnd(false);
    if (onEndCall) onEndCall();
  };
  const controlBtn = "flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-md ring-1 transition-all duration-200 active:scale-95";
  const progressPct = Math.max(0, Math.min(100, Math.round(progress * 100)));
  return <div className="relative vcs-rise">
      <div className="pointer-events-none absolute -inset-5 rounded-[36px] bg-[radial-gradient(ellipse_at_center,rgba(232,169,76,0.09),transparent_65%)] blur-2xl" />
      <div className="relative rounded-[26px] overflow-hidden bg-[#07090B] ring-1 ring-white/10 shadow-[0_32px_90px_-24px_rgba(0,0,0,0.7)]">
        <style>{`
        @keyframes vcsLivePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .vcs-live-dot { animation: vcsLivePulse 1.6s ease-in-out infinite; }
        @keyframes vcsKenBurns { 0% { transform: scale(1); } 100% { transform: scale(1.07); } }
        .vcs-kenburns { animation: vcsKenBurns 9s ease-in-out infinite alternate; transform-origin: 50% 38%; }
        @keyframes vcsShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .vcs-shimmer { background: linear-gradient(110deg, rgba(255,255,255,0.06) 40%, rgba(232,169,76,0.28) 50%, rgba(255,255,255,0.06) 60%); background-size: 200% 100%; animation: vcsShimmer 1.6s linear infinite; }
        @keyframes vcsCaptionIn { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
        .vcs-caption-in { animation: vcsCaptionIn 0.25s ease-out; }
        @keyframes vcsRise { 0% { opacity: 0; transform: translateY(14px) scale(0.985); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .vcs-rise { animation: vcsRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .vcs-grain { position: absolute; inset: 0; pointer-events: none; opacity: 0.05; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
      `}</style>
        <div className="vcs-grain" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-linear-to-b from-white/4.5 via-transparent to-transparent" />
        <div className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 vcs-live-dot shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
              <span className="font-mono-studio text-[10px] tracking-[0.26em] text-red-400 font-semibold">LIVE</span>
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="font-mono-studio text-[9px] tracking-[0.22em] text-white/55 truncate">{roomLabel}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex -space-x-1.5">
              {interviewers.map(t => <span key={t.id} title={t.name} className="w-6 h-6 rounded-full ring-2 ring-[#07090B] bg-linear-to-br from-[#E8A94C] to-[#7a5c28] flex items-center justify-center text-[9px] font-bold text-black">
                  {t.name.charAt(0)}
                </span>)}
              <span title={selfName} className="w-6 h-6 rounded-full ring-2 ring-[#07090B] bg-white/10 backdrop-blur flex items-center justify-center text-[9px] font-bold text-white/80">
                {selfName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-mono-studio text-[9px] tracking-[0.16em] text-white/45">{interviewers.length + 1} IN CALL</span>
            <span className="font-mono-studio text-[12px] text-white/90 tracking-wider tabular-nums bg-white/6 ring-1 ring-white/10 px-3 py-1 rounded-full">{timerText}</span>
          </div>
        </div>
        <div className="relative z-10 h-0.5 mx-5 rounded-full bg-white/6 overflow-hidden">
          <div className="h-full rounded-full bg-linear-to-r from-[#9A7B24] via-[#E8A94C] to-[#E8A94C] transition-all duration-700 shadow-[0_0_8px_rgba(232,169,76,0.7)]" style={{
          width: `${progressPct}%`
        }} />
        </div>
        <div className="relative z-10 p-4 sm:p-5">
          <span className="pointer-events-none absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-[#E8A94C]/30 rounded-tl-lg z-20" />
          <span className="pointer-events-none absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-[#E8A94C]/30 rounded-tr-lg z-20" />
          <span className="pointer-events-none absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-[#E8A94C]/30 rounded-bl-lg z-20" />
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-[#E8A94C]/30 rounded-br-lg z-20" />
          {mode === "panel" ? <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3.5">
                {interviewers.map((t, i) => <InterviewerTile key={t.id} tile={t} aspect={tileAspect} delay={i * 90} />)}
              </div>
              <div className="vcs-rise" style={{
            animationDelay: "200ms"
          }}>
                <SelfTile cameraStream={cameraStream} selfVideoRef={selfVideoRef} micOn={micOn} cameraOn={cameraOn} selfName={selfName} userLevel={userLevel} wide />
              </div>
            </div> : <div className="relative">
              {interviewers.map(t => <InterviewerTile key={t.id} tile={t} aspect={tileAspect} />)}
              <div className="absolute bottom-4 right-4 w-28 sm:w-36 z-20 vcs-rise" style={{
            animationDelay: "250ms"
          }}>
                <SelfTile cameraStream={cameraStream} selfVideoRef={selfVideoRef} micOn={micOn} cameraOn={cameraOn} selfName={selfName} userLevel={userLevel} />
              </div>
            </div>}
        </div>
        {captionsOn && captionText ? <div className="relative z-10 flex justify-center px-6 pb-1">
            <div className="vcs-caption-in max-w-xl border-l-2 border-[#E8A94C] bg-black/70 backdrop-blur-md rounded-r-xl rounded-l-sm px-4 py-2.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)]">
              <p className="text-[13px] leading-relaxed text-white/90 line-clamp-2">{captionText}</p>
            </div>
          </div> : null}
        <div className="relative z-10 flex items-center justify-center px-4 pb-5 pt-2.5">
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 backdrop-blur-xl ring-1 ring-white/12 px-2.5 py-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]">
            <button onClick={onToggleMic} title={micOn ? "Mute microphone" : "Unmute microphone"} className={`${controlBtn} ${micOn ? "bg-white/8 ring-white/15 text-white hover:bg-white/[0.14]" : "bg-red-500 ring-red-400/50 text-white hover:bg-red-600"}`}>
              {micOn ? <FaMicrophone size={15} /> : <FaMicrophoneSlash size={15} />}
            </button>
            <button onClick={onToggleCamera} title={cameraOn ? "Turn camera off" : "Turn camera on"} className={`${controlBtn} ${cameraOn ? "bg-white/8 ring-white/15 text-white hover:bg-white/[0.14]" : "bg-red-500 ring-red-400/50 text-white hover:bg-red-600"}`}>
              {cameraOn ? <BsCameraVideo size={16} /> : <BsCameraVideoOff size={16} />}
            </button>
            <button onClick={() => setCaptionsOn(v => !v)} title="Toggle captions" className={`${controlBtn} ${captionsOn ? "bg-[#E8A94C]/15 ring-[#E8A94C]/45 text-[#E8A94C]" : "bg-white/8 ring-white/15 text-white/55 hover:bg-white/[0.14]"}`}>
              <FaClosedCaptioning size={16} />
            </button>
            <span className="w-px h-7 bg-white/10 mx-1.5" />
            <button onClick={handleEnd} title="End interview" className={`flex items-center gap-2 h-11 pl-4 pr-5 rounded-full ring-1 transition-all duration-200 active:scale-95 ${confirmEnd ? "bg-amber-400 ring-amber-200 text-black font-semibold shadow-[0_0_24px_rgba(251,191,36,0.45)]" : "bg-red-500/90 ring-red-400/50 text-white hover:bg-red-500 shadow-[0_8px_24px_-8px_rgba(239,68,68,0.6)]"}`}>
              <FaPhoneSlash size={14} />
              <span className="font-mono-studio text-[10px] tracking-[0.2em]">{confirmEnd ? "SURE?" : "END"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>;
}
