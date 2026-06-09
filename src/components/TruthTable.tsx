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
  // A referência que guarda o controle da tabela no DOM para o GSAP poder animar.
  const containerRef = useRef<HTMLDivElement>(null);

  // GALERA, ESSA É A PARTE MAIS MASSA:
  // Fiz essa conta (A*4 + S*2 + T*1) para achar a linha da tabela direto pelo valor binário,
  // sem precisar de vários IFs e ifs aninhados poluindo o código!
  // Como são 3 variáveis booleanas (A, S, T), elas se comportam como bits de um número de 3 bits.
  // - A é o bit mais significativo (vale 4 se for 1).
  // - S é o bit do meio (vale 2 se for 1).
  // - T é o bit menos significativo (vale 1 se for 1).
  // Somando os valores correspondentes, temos um índice de 0 a 7 que bate direto com o ID da linha!
  const activeIndex = (valA ? 4 : 0) + (valS ? 2 : 0) + (valT ? 1 : 0);

  // Aqui estão as 8 combinações matemáticas possíveis da nossa tabela-verdade.
  // A fórmula lógica calculada é: L = A ∨ (S ∧ T)
  const rows: RowData[] = [
    { id: 0, a: 0, s: 0, t: 0, l: 0 },
    { id: 1, a: 0, s: 0, t: 1, l: 0 },
    { id: 2, a: 0, s: 1, t: 0, l: 0 },
    { id: 3, a: 0, s: 1, t: 1, l: 1 }, // Se Senha e Token forem 1, libera!
    { id: 4, a: 1, s: 0, t: 0, l: 1 }, // Se Admin for 1, libera direto!
    { id: 5, a: 1, s: 0, t: 1, l: 1 },
    { id: 6, a: 1, s: 1, t: 0, l: 1 },
    { id: 7, a: 1, s: 1, t: 1, l: 1 },
  ];

  // Hook do GSAP que atualiza o destaque da linha toda vez que o "activeIndex" mudar.
  useGSAP(
    () => {
      // 1. Reseta todas as linhas da tabela para a cor cinza legível padrão e sem fundo.
      gsap.to(".truth-row", {
        backgroundColor: "transparent",
        color: "#a3a3a3", // neutral-400, garantindo o contraste necessário.
        fontWeight: "normal",
        duration: 0.15,
      });

      // 2. Destaca com estilo a linha do estado ativo no simulador.
      // Pinta o fundo com o nosso laranja de destaque #FC8337 e o texto em preto para ler super bem!
      gsap.to(`.truth-row-${activeIndex}`, {
        backgroundColor: "#FC8337",
        color: "#000000",
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
      {/* Título do painel usando a fonte Saira (Medium) e o estilo de circuito */}
      <div className="flex items-center space-x-2 select-none mb-1.5">
        <TableProperties className="w-4 h-4 text-neutral-400 shrink-0" />
        <h3 className="font-saira text-xs tracking-wider text-neutral-300 font-medium uppercase">
          TABELA-VERDADE [CIRCUIT MAP]
        </h3>
      </div>

      {/* Conteúdo da Tabela */}
      <div className="overflow-hidden flex-1 flex flex-col justify-center">
        {/* Forçamos a fonte Roboto nas células para ficar com cara de folha técnica organizada */}
        <table className="w-full border-collapse text-left font-roboto text-[11px] select-none">
          <thead>
            {/* Cabeçalho da tabela com fonte mono e cores cinza */}
            <tr className="text-neutral-500 border-b border-neutral-800 font-mono text-[10px]">
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
                  className={`truth-row truth-row-${row.id} font-mono border-y border-transparent transition-all rounded duration-100`}
                >
                  <td className="py-[3px] px-2 font-semibold">Estado {row.id}</td>
                  <td className="py-[3px] px-2 text-center tabular-nums">{row.a}</td>
                  <td className="py-[3px] px-2 text-center tabular-nums">{row.s}</td>
                  <td className="py-[3px] px-2 text-center tabular-nums">{row.t}</td>
                  {/* Se a linha estiver ativa, a borda do divisor se ajusta para não quebrar a estética */}
                  <td
                    className={`py-[3px] px-2 text-center tabular-nums border-l ${
                      isActive ? "border-transparent" : "border-neutral-800"
                    }`}
                  >
                    {row.l}
                  </td>
                  {/* Exibe o status legível da saída */}
                  <td className="py-[3px] px-2 text-right font-sans text-[9px] tracking-wider uppercase font-semibold">
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
