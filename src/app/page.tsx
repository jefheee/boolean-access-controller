"use client";

import React, { useState, useEffect, useRef } from "react";
import ToggleSwitch from "@/components/ToggleSwitch";
import StatusDisplay from "@/components/StatusDisplay";
import TruthTable from "@/components/TruthTable";
import AuditLog, { LogEntry } from "@/components/AuditLog";
import { Info, Cpu } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Centralized Boolean States
  const [valA, setValA] = useState<boolean>(false);
  const [valS, setValS] = useState<boolean>(false);
  const [valT, setValT] = useState<boolean>(false);

  // 2. State for the Audit Terminal Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // 3. Computed output state: L = A ∨ (S ∧ T)
  const valL = valA || (valS && valT);

  // 4. GSAP Intro Stagger Animation for Bento elements
  useGSAP(
    () => {
      gsap.from(".bento-box", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: containerRef }
  );

  // 5. Reactive Logging of state changes
  const isFirstRender = useRef(true);

  useEffect(() => {
    const time = new Date().toLocaleTimeString("pt-PT", { hour12: false });
    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: time,
      a: valA ? 1 : 0,
      s: valS ? 1 : 0,
      t: valT ? 1 : 0,
      l: valL ? 1 : 0,
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Log initialization
      setLogs([
        {
          id: "sys-init",
          timestamp: time,
          a: 0,
          s: 0,
          t: 0,
          l: 0,
        },
      ]);
    } else {
      setLogs((prev) => [...prev, newLog]);
    }
  }, [valA, valS, valT]); // valL is computed sync, so tracking inputs guarantees accuracy

  return (
    <div
      ref={containerRef}
      className="min-h-screen md:h-screen md:overflow-hidden bg-black text-white flex flex-col justify-between p-4 md:p-6 font-sans space-y-4"
    >
      {/* Header Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-900 pb-3 shrink-0 gap-2 select-none">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-neutral-900 border border-neutral-800">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-mono text-[11px] font-semibold tracking-[0.25em] text-neutral-200 uppercase">
            Boolean Access Controller
          </h1>
        </div>
        <p className="text-[10px] text-neutral-400 font-mono">
          ESTADO DO CIRCUITO: L = A ∨ (S ∧ T)
        </p>
      </header>

      {/* Main Grid: Single Page Layout (Desktop) */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        
        {/* Left Column (Module 1): Inputs */}
        <div className="bento-box md:col-span-5 h-full flex flex-col justify-between p-4 rounded-xl border border-neutral-850 bg-neutral-950/20 backdrop-blur-sm space-y-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between select-none">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-300">
                  ENTRADAS LÓGICAS [IN]
                </h2>
              </div>
              <span className="font-mono text-[9px] text-neutral-500 tracking-wider font-bold">
                [GATE PANEL]
              </span>
            </div>

            <div className="space-y-2.5">
              <ToggleSwitch
                id="toggle-admin"
                label="Privilégio de Admin"
                symbol="A"
                value={valA}
                onChange={setValA}
                description="Bypass completo de segurança de acesso."
              />
              <ToggleSwitch
                id="toggle-password"
                label="Senha Correta"
                symbol="S"
                value={valS}
                onChange={setValS}
                description="Hash de palavra-passe válido."
              />
              <ToggleSwitch
                id="toggle-token"
                label="Token Validado / 2FA"
                symbol="T"
                value={valT}
                onChange={setValT}
                description="Autenticação de dois fatores aprovada."
              />
            </div>
          </div>

          {/* Compact Instructions card inside Module 1 to optimize space */}
          <div className="p-3 rounded-lg border border-neutral-900 bg-neutral-950 flex items-start space-x-2.5 text-[9.5px] text-neutral-400 font-mono leading-relaxed select-none shrink-0">
            <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
            <p>
              Alterar qualquer interruptor de entrada propaga o sinal pelas portas booleanas.
              A saída resultante (L) é avaliada no visor de status e registada no terminal de auditoria.
            </p>
          </div>
        </div>

        {/* Right Column (Modules 2, 3, 4) */}
        <div className="md:col-span-7 flex flex-col gap-4 h-full min-h-0">
          
          {/* Top Half (Module 2): Status Display */}
          <div className="bento-box h-[38%] min-h-0">
            <StatusDisplay
              valA={valA}
              valS={valS}
              valT={valT}
              valL={valL}
            />
          </div>

          {/* Bottom Half: Split row for Truth Table and Audit Log */}
          <div className="h-[62%] grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-0">
            
            {/* Module 3: Truth Table */}
            <div className="bento-box h-full min-h-0">
              <TruthTable
                valA={valA}
                valS={valS}
                valT={valT}
              />
            </div>

            {/* Module 4: Terminal Audit Log */}
            <div className="bento-box h-full min-h-0">
              <AuditLog logs={logs} />
            </div>

          </div>
        </div>

      </main>

      {/* Tiny Status Bar Footer */}
      <footer className="w-full border-t border-neutral-950 pt-2 text-center text-[9px] font-mono text-neutral-600 select-none flex flex-col sm:flex-row items-center justify-between shrink-0 gap-1">
        <span>MICRO-SIMULADOR BOOLEANO v1.1.0</span>
        <span>L = {valL ? "1 (LIBERADO)" : "0 (NEGADO)"}</span>
        <span>ANTIGRAVITY LABS</span>
      </footer>
    </div>
  );
}
