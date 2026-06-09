"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Lock, Unlock } from "lucide-react";

interface StatusDisplayProps {
  valA: boolean;
  valS: boolean;
  valT: boolean;
  valL: boolean;
}

export default function StatusDisplay({
  valA,
  valS,
  valT,
  valL,
}: StatusDisplayProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Track previous state to trigger entry/exit text animation
  const prevL = useRef(valL);

  useGSAP(
    () => {
      // 1. Card Styles Transition
      if (valL) {
        // Access Granted - Light Mode (white bg, black text, subtle white glow)
        gsap.killTweensOf(cardRef.current);
        const tl = gsap.timeline();
        tl.to(cardRef.current, {
          backgroundColor: "#ffffff",
          borderColor: "#ffffff",
          color: "#000000",
          scale: 1.02,
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.15)",
          duration: 0.4,
          ease: "power3.out",
        });
        
        // Continuous subtle pulsing glow for the active card
        tl.to(
          cardRef.current,
          {
            boxShadow: "0 0 45px rgba(255, 255, 255, 0.25)",
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: "sine.inOut",
          },
          "+=0.1"
        );
      } else {
        // Access Denied - Dark Mode (zinc-950 bg, gray text, no glow)
        gsap.killTweensOf(cardRef.current);
        gsap.to(cardRef.current, {
          backgroundColor: "#09090b",
          borderColor: "#262626",
          color: "#737373", // zinc-500
          scale: 1.0,
          boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
          duration: 0.4,
          ease: "power3.out",
        });
      }

      // 2. Icon Rotation and Scale effect
      gsap.fromTo(
        iconRef.current,
        { scale: 0.7, rotate: valL ? -45 : 45 },
        { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" }
      );
    },
    { dependencies: [valL] }
  );

  // Separate animation for text fade-and-slide on changes
  useEffect(() => {
    if (prevL.current !== valL) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.to(textRef.current, {
          opacity: 0,
          y: -8,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            prevL.current = valL;
          },
        }).to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power3.out",
        });
      });
      return () => ctx.revert();
    }
  }, [valL]);

  return (
    <div className="flex flex-col h-full justify-between p-6 md:p-8 rounded-2xl border border-neutral-900 bg-neutral-950/20 backdrop-blur-sm">
      {/* Top Header: Monospace formula */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-neutral-700 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Expressão Lógica
          </span>
        </div>
        
        <div className="py-4 px-6 rounded-xl bg-neutral-950 border border-neutral-900 flex justify-center items-center">
          <code className="text-xl md:text-2xl font-mono tracking-wider select-all select-none">
            <span
              className={`transition-all duration-300 font-bold ${
                valL ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "text-neutral-400"
              }`}
            >
              L
            </span>
            <span className="text-neutral-600 mx-2">=</span>
            <span
              className={`transition-all duration-300 ${
                valA ? "text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "text-neutral-600"
              }`}
            >
              A
            </span>
            <span className="text-neutral-600 mx-2">∨</span>
            <span className="text-neutral-600">(</span>
            <span
              className={`transition-all duration-300 ${
                valS ? "text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "text-neutral-600"
              }`}
            >
              S
            </span>
            <span className="text-neutral-600 mx-2">∧</span>
            <span
              className={`transition-all duration-300 ${
                valT ? "text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "text-neutral-600"
              }`}
            >
              T
            </span>
            <span className="text-neutral-600">)</span>
          </code>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
          <div className="px-2 py-1.5 rounded border border-neutral-900 bg-neutral-950/60">
            <span className="text-neutral-500">A = </span>
            <span className={valA ? "text-white font-bold" : "text-neutral-600"}>{valA ? "1" : "0"}</span>
          </div>
          <div className="px-2 py-1.5 rounded border border-neutral-900 bg-neutral-950/60">
            <span className="text-neutral-500">S = </span>
            <span className={valS ? "text-white font-bold" : "text-neutral-600"}>{valS ? "1" : "0"}</span>
          </div>
          <div className="px-2 py-1.5 rounded border border-neutral-900 bg-neutral-950/60">
            <span className="text-neutral-500">T = </span>
            <span className={valT ? "text-white font-bold" : "text-neutral-600"}>{valT ? "1" : "0"}</span>
          </div>
        </div>
      </div>

      {/* Bottom Main Access Panel */}
      <div className="mt-8 md:mt-0 flex flex-col items-center justify-center py-12">
        <div
          ref={cardRef}
          className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-950 p-6 md:p-8 flex flex-col items-center justify-center text-center transition-shadow select-none"
        >
          {/* Animated Lock Icon Wrapper */}
          <div ref={iconRef} className="mb-4">
            {valL ? (
              <Unlock className="w-12 h-12 stroke-[1.5]" />
            ) : (
              <Lock className="w-12 h-12 stroke-[1.5]" />
            )}
          </div>

          {/* Animated Text Wrapper */}
          <div ref={textRef} className="space-y-1">
            <h2 className="text-lg md:text-xl font-mono tracking-[0.2em] font-bold">
              {valL ? "ACESSO LIBERADO" : "ACESSO NEGADO"}
            </h2>
            <p className="text-[10px] font-mono tracking-widest uppercase opacity-60">
              {valL ? "Sinal lógico de saída L = 1" : "Sinal lógico de saída L = 0"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
