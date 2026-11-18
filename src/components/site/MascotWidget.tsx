import { X } from "lucide-react";
import { useState } from "react";

const MESSAGES = [
  "Hi! I'm Baymini, your health companion. Ready to build your plan?",
  "Tip: sip some water — your body will thank you.",
  "Tip: a short walk after meals does wonders.",
  "Tip: aim for 7–8 hours of sleep tonight.",
  "Tip: take three slow, deep breaths with me.",
] as const;

/** Original Baymini mascot: a chubby white healthcare companion robot. */
function MascotSvg() {
  return (
    <svg viewBox="0 0 96 96" role="img" aria-hidden="true" className="h-full w-full drop-shadow-md">
      {/* waving arm */}
      <g className="mascot-wave" style={{ transformOrigin: "78px 52px" }}>
        <path
          d="M74 52 Q86 46 88 34"
          fill="none"
          stroke="var(--leaf)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="88" cy="32" r="6" fill="var(--surface)" stroke="var(--leaf)" strokeWidth="2.5" />
      </g>
      {/* resting arm */}
      <path
        d="M22 54 Q12 58 12 66"
        fill="none"
        stroke="var(--leaf)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* chubby round body */}
      <ellipse cx="48" cy="56" rx="30" ry="28" fill="var(--surface)" stroke="var(--border)" strokeWidth="2" />
      {/* antenna sprout */}
      <path d="M48 28 Q48 20 54 17" fill="none" stroke="var(--leaf)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="56" cy="16" r="4" fill="var(--leaf)" />
      {/* face: dot eyes joined by a thin line, gentle smile */}
      <g className="mascot-blink" style={{ transformOrigin: "48px 50px" }}>
        <line x1="38" y1="50" x2="58" y2="50" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="38" cy="50" r="3.4" fill="var(--primary)" />
        <circle cx="58" cy="50" r="3.4" fill="var(--primary)" />
      </g>
      <path d="M42 60 Q48 65 54 60" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
      {/* rosy cheeks */}
      <circle cx="32" cy="57" r="3" fill="var(--sage)" opacity="0.7" />
      <circle cx="64" cy="57" r="3" fill="var(--sage)" opacity="0.7" />
      {/* little health cross badge */}
      <g>
        <circle cx="48" cy="74" r="7" fill="var(--sage-soft)" stroke="var(--leaf)" strokeWidth="1.5" />
        <path d="M48 71 v6 M45 74 h6" stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function MascotWidget() {
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [index, setIndex] = useState(0);

  function handleMascotClick() {
    if (!bubbleOpen) {
      setBubbleOpen(true);
      return;
    }
    setIndex((i) => (i + 1) % MESSAGES.length);
  }

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-30 flex flex-col items-end gap-2 sm:bottom-5 sm:right-5">
      {bubbleOpen ? (
        <div
          role="status"
          className="pointer-events-auto relative max-w-[220px] animate-fade-up rounded-2xl rounded-br-sm border border-border bg-card px-4 py-3 shadow-lift sm:max-w-[240px]"
        >
          <button
            type="button"
            onClick={() => setBubbleOpen(false)}
            aria-label="Hide Baymini's message"
            className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <p className="font-body text-xs leading-relaxed text-foreground sm:text-sm">{MESSAGES[index]}</p>
          <p className="mt-1 font-body text-[10px] text-muted-foreground">Tap Baymini for another tip</p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={handleMascotClick}
        aria-label="Baymini mascot — hear a wellness tip"
        className="pointer-events-auto h-16 w-16 rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-20 sm:w-20"
      >
        <span className="mascot-float block h-full w-full">
          <MascotSvg />
        </span>
      </button>
    </div>
  );
}
