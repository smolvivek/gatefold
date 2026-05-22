"use client";

interface PulseDotProps {
  size?: number;
  className?: string;
  active?: boolean;
}

export function PulseDot({ size = 8, className = "", active = true }: PulseDotProps) {
  return (
    <span
      className={`inline-block rounded-full bg-pop ${active ? "led-pulse" : "opacity-30"} ${className}`}
      style={{ width: size, height: size, flexShrink: 0 }}
      aria-hidden="true"
    />
  );
}
