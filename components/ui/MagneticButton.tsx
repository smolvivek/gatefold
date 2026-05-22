"use client";

import { useRef, useCallback, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

const MAX_OFFSET = 12;

export function MagneticButton({ children, strength = 0.35, className = "" }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, (e.clientX - cx) * strength));
    const dy = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, (e.clientY - cy) * strength));
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out touch-none ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
