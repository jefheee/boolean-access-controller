"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ToggleSwitchProps {
  id?: string;
  label: string;
  symbol: string;
  value: boolean;
  onChange: (val: boolean) => void;
  description?: string;
}

export default function ToggleSwitch({
  id,
  label,
  symbol,
  value,
  onChange,
  description,
}: ToggleSwitchProps) {
  const trackRef = useRef<HTMLButtonElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  // GSAP animation context for state transitions
  useGSAP(
    () => {
      // Animate Thumb Position and Color
      gsap.to(thumbRef.current, {
        x: value ? 22 : 0, // Track width is 48px (inner 46px), thumb is 20px, x: 22 matches right edge
        backgroundColor: value ? "#000000" : "#737373", // black thumb when active, neutral-500 when inactive
        duration: 0.25,
        ease: "power2.out",
      });

      // Animate Track Background and Border
      gsap.to(trackRef.current, {
        backgroundColor: value ? "#ffffff" : "#171717", // white track when active, neutral-900 when inactive
        borderColor: value ? "#ffffff" : "#404040", // white border when active, neutral-700 when inactive
        duration: 0.25,
        ease: "power2.out",
      });

      // Subtle pulse scale for binary badge on toggle change
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.85 },
        { scale: 1, duration: 0.2, ease: "back.out(2)" }
      );

      // Animate binary badge color
      gsap.to(badgeRef.current, {
        color: value ? "#ffffff" : "#a3a3a3",
        borderColor: value ? "#ffffff" : "#262626",
        backgroundColor: value ? "#171717" : "#0a0a0a",
        duration: 0.25,
      });
    },
    { dependencies: [value], scope: trackRef }
  );

  return (
    <div className="flex flex-col space-y-2 p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 hover:border-neutral-800 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            ref={trackRef}
            id={id}
            type="button"
            role="switch"
            aria-checked={value}
            onClick={() => onChange(!value)}
            className="relative w-12 h-6 rounded-full border border-neutral-700 bg-neutral-900 flex items-center px-[2px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:ring-offset-1 focus:ring-offset-black transition-shadow"
          >
            <span
              ref={thumbRef}
              className="block w-4 h-4 rounded-full bg-neutral-500 shadow-sm"
            />
          </button>
          <span className="font-mono text-sm font-medium select-none text-neutral-300">
            {label}
          </span>
        </div>

        <span
          ref={badgeRef}
          className="font-mono text-xs font-semibold px-2 py-0.5 border border-neutral-800 rounded bg-neutral-950 select-none tabular-nums"
        >
          {symbol} = {value ? "1" : "0"}
        </span>
      </div>
      {description && (
        <p className="text-xs text-neutral-500 pl-15 select-none leading-relaxed font-sans">
          {description}
        </p>
      )}
    </div>
  );
}
