"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown, ChevronUp, TableProperties } from "lucide-react";

interface TruthTableProps {
  valA: boolean;
  valS: boolean;
  valT: boolean;
}

interface RowData {
  id: number;
  a: number;
  s: number;
  t: number;
  l: number;
}

export default function TruthTable({ valA, valS, valT }: TruthTableProps) {
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute active row index (binary representation: A*4 + S*2 + T*1)
  const activeIndex = (valA ? 4 : 0) + (valS ? 2 : 0) + (valT ? 1 : 0);

  // Table rows data
  const rows: RowData[] = [
    { id: 0, a: 0, s: 0, t: 0, l: 0 },
    { id: 1, a: 0, s: 0, t: 1, l: 0 },
    { id: 2, a: 0, s: 1, t: 0, l: 0 },
    { id: 3, a: 0, s: 1, t: 1, l: 1 },
    { id: 4, a: 1, s: 0, t: 0, l: 1 },
    { id: 5, a: 1, s: 0, t: 1, l: 1 },
    { id: 6, a: 1, s: 1, t: 0, l: 1 },
    { id: 7, a: 1, s: 1, t: 1, l: 1 },
  ];

  // GSAP animation for collapse/expand
  useGSAP(
    () => {
      if (isOpen) {
        gsap.to(contentRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          overflow: "visible",
        });
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          overflow: "hidden",
        });
      }
    },
    { dependencies: [isOpen], scope: containerRef }
  );

  // GSAP animation for active row highlight
  useGSAP(
    () => {
      // Reset all rows to default (dark, semi-transparent text)
      gsap.to(".truth-row", {
        backgroundColor: "transparent",
        color: "#525252", // neutral-600/500
        borderColor: "transparent",
        fontWeight: "normal",
        duration: 0.25,
      });

      // Highlight the active row (white background, black text)
      gsap.to(`.truth-row-${activeIndex}`, {
        backgroundColor: "#ffffff",
        color: "#000000",
        borderColor: "#ffffff",
        fontWeight: "bold",
        duration: 0.3,
        ease: "power2.out",
      });
    },
    { dependencies: [activeIndex], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl border border-neutral-900 bg-neutral-950/40 p-4 md:p-6"
    >
      {/* Header button to toggle collapse */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left select-none cursor-pointer focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <TableProperties className="w-5 h-5 text-neutral-400" />
          <div>
            <h3 className="font-mono text-sm tracking-wide text-neutral-300 font-medium">
              TABELA-VERDADE DINÂMICA
            </h3>
            <p className="text-[10px] font-sans text-neutral-500">
              Destaque em tempo real para o estado das variáveis de controlo
            </p>
          </div>
        </div>
        <div className="p-1 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </div>
      </button>

      {/* Collapsible Content */}
      <div ref={contentRef} className="mt-4">
        {/* Legend */}
        <div className="mb-4 text-[10px] font-mono text-neutral-500 border-b border-neutral-900 pb-2 flex flex-wrap gap-x-4 gap-y-1">
          <span>A = Privilégio Admin</span>
          <span>•</span>
          <span>S = Senha Correta</span>
          <span>•</span>
          <span>T = Token Validado</span>
          <span>•</span>
          <span>L = Acesso Liberado</span>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs select-none">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-900">
                <th className="py-2 px-3"># ESTADO</th>
                <th className="py-2 px-3 text-center">A</th>
                <th className="py-2 px-3 text-center">S</th>
                <th className="py-2 px-3 text-center">T</th>
                <th className="py-2 px-3 text-center border-l border-neutral-900">L = A ∨ (S ∧ T)</th>
                <th className="py-2 px-3 text-right hidden sm:table-cell">RESULTADO</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isActive = row.id === activeIndex;
                return (
                  <tr
                    key={row.id}
                    className={`truth-row truth-row-${row.id} border-y border-transparent transition-all rounded duration-200`}
                  >
                    <td className="py-2 px-3 font-semibold">Estado {row.id}</td>
                    <td className="py-2 px-3 text-center tabular-nums">{row.a}</td>
                    <td className="py-2 px-3 text-center tabular-nums">{row.s}</td>
                    <td className="py-2 px-3 text-center tabular-nums">{row.t}</td>
                    <td
                      className={`py-2 px-3 text-center tabular-nums border-l ${
                        isActive ? "border-neutral-900" : "border-neutral-900/40"
                      }`}
                    >
                      {row.l}
                    </td>
                    <td className="py-2 px-3 text-right hidden sm:table-cell font-sans text-[10px] tracking-wider uppercase">
                      {row.l === 1 ? "Liberado" : "Negado"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
