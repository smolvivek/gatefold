"use client";

import { useEffect, useState } from "react";
import { isSoundEnabled, setSoundEnabled, playClick } from "@/lib/sound/click";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    // localStorage is unavailable during SSR, so `enabled` must default to
    // false on the server and sync here after mount — can't be a lazy
    // useState initializer without causing a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(isSoundEnabled());

    // First-visit nudge: show "Sound: OFF" label for 3s if preference not yet set
    if (localStorage.getItem("gatefold-sound") === null) {
      setShowLabel(true);
      const t = setTimeout(() => setShowLabel(false), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    setShowLabel(false);
    if (next) playClick();
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors duration-150 cursor-pointer"
      aria-label={enabled ? "Disable sound effects" : "Enable sound effects"}
      title={enabled ? "Sound: ON" : "Sound: OFF"}
    >
      {showLabel && !enabled && (
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-disabled transition-opacity duration-300">
          Sound: OFF
        </span>
      )}
      <SoundIcon enabled={enabled} />
    </button>
  );
}

function SoundIcon({ enabled }: { enabled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Speaker body */}
      <path
        d="M2 5.5H4.5L8 2.5V13.5L4.5 10.5H2V5.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        fill="none"
      />
      {enabled ? (
        /* Sound waves */
        <>
          <path d="M10 5.5C11.1 6.1 11.8 7 11.8 8S11.1 9.9 10 10.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" fill="none" />
          <path d="M12 3.5C13.8 4.8 14.8 6.3 14.8 8S13.8 11.2 12 12.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" fill="none" />
        </>
      ) : (
        /* X mark */
        <>
          <line x1="10" y1="5.5" x2="14" y2="10.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <line x1="14" y1="5.5" x2="10" y2="10.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
