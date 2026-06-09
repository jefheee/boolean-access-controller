"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TableProperties } from "lucide-react";

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

  // GSAP animation for active row highlight
  useGSAP(
    () => {
      // Reset all rows to default (darker text for better legibility than original)
      gsap.to(".truth-row", {
        backgroundColor: "transparent",
        color: "#a3a3a3", // neutral-400 (excellent contrast on dark background)
        borderColor: "transparent",
        fontWeight: "normal",
        duration: 0.2,
      });

      // Highlight the active row (white background, black text)
      gsap.to(`.truth-row-${activeIndex}`, {
        backgroundColor: "#ffffff",
        color: "#000000",
        borderColor: "#ffffff",
        fontWeight: "bold",
        duration: 0.25,
        ease: "power2.out",
      });
    },
    { dependencies: [activeIndex], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-xl border border-neutral-800 bg-neutral-950/40 p-3.5 flex flex-col justify-between"
    >
      {/* Title */}
      <div className="flex items-center space-x-2 select-none mb-1.5">
        <TableProperties className="w-4 h-4 text-neutral-400 shrink-0" />
        <h3 className="font-mono text-xs tracking-wide text-neutral-300 font-medium">
          TABELA-VERDADE [CIRCUIT MAP]
        </h3>
      </div>

      {/* Table Area */}
      <div className="overflow-hidden flex-1 flex flex-col justify-center">
        <table className="w-full border-collapse text-left font-mono text-[11px] select-none">
          <thead>
            <tr className="text-neutral-500 border-b border-neutral-800">
              <th className="pb-1 px-2">ESTADO</th>
              <th className="pb-1 px-2 text-center">A</th>
              <th className="pb-1 px-2 text-center">S</th>
              <th className="pb-1 px-2 text-center">T</th>
              <th className="pb-1 px-2 text-center border-l border-neutral-800">L</th>
              <th className="pb-1 px-2 text-right">SAÍDA</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isActive = row.id === activeIndex;
              return (
                <tr
                  key={row.id}
                  className={`truth-row truth-row-${row.id} border-y border-transparent transition-all rounded duration-150`}
                >
                  <td className="py-[3px] px-2 font-semibold">Estado {row.id}</td>
                  <td className="py-[3px] px-2 text-center tabular-nums">{row.a}</td>
                  <td className="py-[3px] px-2 text-center tabular-nums">{row.s}</td>
                  <td className="py-[3px] px-2 text-center tabular-nums">{row.t}</td>
                  <td
                    className={`py-[3px] px-2 text-center tabular-nums border-l ${
                      isActive ? "border-neutral-900" : "border-neutral-800"
                    }`}
                  >
                    {row.l}
                  </td>
                  <td className="py-[3px] px-2 text-right font-sans text-[9px] tracking-wider uppercase">
                    {row.l === 1 ? "Liberado" : "Negado"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
