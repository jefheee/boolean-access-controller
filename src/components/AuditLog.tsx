"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Terminal } from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  a: number;
  s: number;
  t: number;
  l: number;
}

interface AuditLogProps {
  logs: LogEntry[];
}

export default function AuditLog({ logs }: AuditLogProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when logs change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    // Animate the last added log line
    if (logs.length > 0) {
      const lastLine = terminalRef.current?.lastElementChild;
      if (lastLine) {
        gsap.fromTo(
          lastLine,
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power1.out" }
        );
      }
    }
  }, [logs]);

  return (
    <div className="w-full h-full rounded-xl border border-neutral-800 bg-black p-3.5 flex flex-col justify-between space-y-2">
      {/* Title */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-neutral-400 shrink-0" />
          <h3 className="font-mono text-xs tracking-wide text-neutral-300 font-medium">
            REGISTO DE AUDITORIA [TERMINAL]
          </h3>
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-pulse" />
      </div>

      {/* Terminal logs list */}
      <div
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-850 scrollbar-track-transparent rounded bg-neutral-950 border border-neutral-900 p-2 font-mono text-[10px] text-neutral-400 space-y-1 select-none min-h-[140px] max-h-[180px] md:max-h-none"
      >
        {logs.length === 0 ? (
          <div className="text-neutral-600 italic select-none">Aguardando alteração de sinal de entrada...</div>
        ) : (
          <div ref={terminalRef} className="space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="leading-relaxed border-b border-neutral-950/60 pb-0.5 font-mono">
                <span className="text-neutral-500 mr-1.5">[{log.timestamp}]</span>
                <span className="text-neutral-400">IN: </span>
                <span className={log.a ? "text-white font-bold" : "text-neutral-500"}>A={log.a}</span>
                <span className="text-neutral-650">,</span>
                <span className={log.s ? "text-white font-bold" : "text-neutral-500"}>S={log.s}</span>
                <span className="text-neutral-650">,</span>
                <span className={log.t ? "text-white font-bold" : "text-neutral-500"}>T={log.t}</span>
                <span className="text-neutral-500 mx-2">|</span>
                <span className="text-neutral-450">OUT: </span>
                <span className={log.l ? "text-white font-bold" : "text-neutral-500"}>L={log.l}</span>{" "}
                <span className={`px-1 py-px rounded text-[8px] font-sans ${
                  log.l ? "bg-neutral-850 text-white font-semibold" : "bg-neutral-900 text-neutral-500"
                }`}>
                  {log.l ? "LIBERADO" : "NEGADO"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
