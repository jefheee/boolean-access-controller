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
  const prevL = useRef(valL);

  useGSAP(
    () => {
      if (valL) {
        // Access Granted - Glowy White Card, Black Text
        gsap.killTweensOf(cardRef.current);
        const tl = gsap.timeline();
        tl.to(cardRef.current, {
          backgroundColor: "#ffffff",
          borderColor: "#ffffff",
          color: "#000000",
          scale: 1.01,
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
          duration: 0.25,
          ease: "power2.out",
        });
        
        tl.to(
          cardRef.current,
          {
            boxShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
            repeat: -1,
            yoyo: true,
            duration: 1.2,
            ease: "sine.inOut",
          },
          "+=0.05"
        );
      } else {
        // Access Denied - High contrast neutral gray/border
        gsap.killTweensOf(cardRef.current);
        gsap.to(cardRef.current, {
          backgroundColor: "#171717", // bg-neutral-900
          borderColor: "#525252", // border-neutral-600
          color: "#a3a3a3", // text-neutral-400
          scale: 1.0,
          boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
          duration: 0.25,
          ease: "power2.out",
        });
      }

      // Icon rotation & scale effect
      gsap.fromTo(
        iconRef.current,
        { scale: 0.8, rotate: valL ? -30 : 30 },
        { scale: 1, rotate: 0, duration: 0.3, ease: "back.out(1.5)" }
      );
    },
    { dependencies: [valL] }
  );

  useEffect(() => {
    if (prevL.current !== valL) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.to(textRef.current, {
          opacity: 0,
          y: -4,
          duration: 0.1,
          ease: "power1.in",
          onComplete: () => {
            prevL.current = valL;
          },
        }).to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.18,
          ease: "power2.out",
        });
      });
      return () => ctx.revert();
    }
  }, [valL]);

  return (
    <div className="flex flex-col h-full justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-950/20 backdrop-blur-sm space-y-3">
      {/* Top Header: Monospace formula */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300">
              EQUAÇÃO DE CIRCUITO
            </span>
          </div>
          <span className="font-mono text-[9px] text-neutral-500 tracking-wider font-bold select-none">
            [CIRCUIT OUT]
          </span>
        </div>
        
        <div className="py-2 px-4 rounded-lg bg-neutral-950 border border-neutral-800 flex justify-center items-center">
          <code className="text-base font-mono tracking-wider select-none">
            <span
              className={`transition-all duration-200 ${
                valL ? "text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-neutral-300"
              }`}
            >
              L
            </span>
            <span className="text-neutral-600 mx-2">=</span>
            <span
              className={`transition-all duration-200 ${
                valA ? "text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-neutral-500"
              }`}
            >
              A
            </span>
            <span className="text-neutral-600 mx-2">∨</span>
            <span className="text-neutral-600">(</span>
            <span
              className={`transition-all duration-200 ${
                valS ? "text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-neutral-500"
              }`}
            >
              S
            </span>
            <span className="text-neutral-600 mx-2">∧</span>
            <span
              className={`transition-all duration-200 ${
                valT ? "text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-neutral-500"
              }`}
            >
              T
            </span>
            <span className="text-neutral-600">)</span>
          </code>
        </div>
      </div>

      {/* Main Access Panel */}
      <div className="flex-1 flex flex-col justify-center">
        <div
          ref={cardRef}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3.5 flex items-center justify-between select-none"
        >
          {/* Icon and Text in a Row to save vertical space */}
          <div className="flex items-center space-x-3.5">
            <div ref={iconRef} className="shrink-0">
              {valL ? (
                <Unlock className="w-7 h-7 stroke-[1.5] text-black" />
              ) : (
                <Lock className="w-7 h-7 stroke-[1.5] text-neutral-400" />
              )}
            </div>
            <div ref={textRef} className="text-left space-y-0.5">
              <h2 className="text-xs font-mono tracking-widest font-bold uppercase leading-none">
                {valL ? "ACESSO LIBERADO" : "ACESSO NEGADO"}
              </h2>
              <p className="text-[9px] font-mono tracking-wider uppercase opacity-85 leading-none">
                SAÍDA [OUT: L = {valL ? "1" : "0"}]
              </p>
            </div>
          </div>
          <span className="font-mono text-[9px] text-neutral-500 font-bold opacity-80 shrink-0">
            {valL ? "[TRUE]" : "[FALSE]"}
          </span>
        </div>
      </div>
    </div>
  );
}
