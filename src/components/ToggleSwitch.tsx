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

  useGSAP(
    () => {
      // Animate Thumb Position and Color
      gsap.to(thumbRef.current, {
        x: value ? 22 : 0,
        backgroundColor: value ? "#000000" : "#a3a3a3", // neutral-400 for better visibility when off
        duration: 0.2,
        ease: "power2.out",
      });

      // Animate Track Background and Border
      gsap.to(trackRef.current, {
        backgroundColor: value ? "#ffffff" : "#171717",
        borderColor: value ? "#ffffff" : "#404040",
        duration: 0.2,
        ease: "power2.out",
      });

      // Subtle pulse scale for binary badge
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.9 },
        { scale: 1, duration: 0.15, ease: "back.out(2)" }
      );

      // Animate binary badge color
      gsap.to(badgeRef.current, {
        color: value ? "#ffffff" : "#d4d4d4", // brighter text for accessibility
        borderColor: value ? "#ffffff" : "#404040", // visible border
        backgroundColor: value ? "#262626" : "#09090b",
        duration: 0.2,
      });
    },
    { dependencies: [value], scope: trackRef }
  );

  return (
    <div className="flex flex-col space-y-1.5 p-3 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 transition-colors duration-200">
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
              className="block w-4 h-4 rounded-full bg-neutral-400 shadow-sm"
            />
          </button>
          <span className="font-mono text-sm font-medium select-none text-neutral-200">
            {label}
          </span>
        </div>

        <div className="flex items-center space-x-2 select-none">
          <span className="font-mono text-[9px] text-neutral-500 tracking-wider font-bold">
            [IN]
          </span>
          <span
            ref={badgeRef}
            className="font-mono text-xs font-semibold px-2 py-0.5 border border-neutral-700 rounded bg-neutral-900 select-none tabular-nums"
          >
            {symbol} = {value ? "1" : "0"}
          </span>
        </div>
      </div>
      {description && (
        <p className="text-[11px] text-neutral-400 select-none leading-normal font-sans pl-[60px]">
          {description}
        </p>
      )}
    </div>
  );
}
