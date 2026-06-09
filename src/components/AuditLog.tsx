"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Terminal } from "lucide-react";

// Definimos a tipagem de cada linha de log para o TypeScript ficar feliz e não reclamar de tipo any.
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
  // A scrollRef serve pra gente mexer na div que tem o scroll vertical.
  // A terminalRef serve pra pegarmos o container das linhas de log e animarmos a última linha adicionada.
  const terminalRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Esse useEffect roda toda vez que a nossa lista de logs ("logs") é atualizada no estado global.
  useEffect(() => {
    // AUTO-SCROLL DO TERMINAL:
    // A gente faz uma conta simples: pegamos a altura total da barra de rolagem (scrollHeight)
    // e jogamos esse valor na posição atual do scroll (scrollTop).
    // Com isso, a div de logs rola automaticamente para o final toda vez que chega informação nova,
    // mantendo a tela do usuário sempre atualizada na última ação realizada.
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    // ANIMAÇÃO DE ENTRADA DO LOG:
    // Se a lista de logs tiver registros, a gente acessa o último elemento inserido (lastElementChild)
    // na nossa div de referência e aplica um efeito discreto do GSAP.
    // O log surge do transparente (opacity: 0) e desliza levemente da esquerda para a direita (x: -8 para x: 0) em 0.3 segundos.
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
    <div className="w-full h-full rounded-xl border-2 border-neutral-700/70 bg-neutral-950/40 p-3.5 flex flex-col justify-between space-y-2">
      
      {/* Cabeçalho do Terminal */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-neutral-400 shrink-0" />
          {/* Título com a fonte Saira (Medium) e tom cinza claro */}
          <h3 className="font-saira text-xs tracking-wider text-neutral-300 font-medium uppercase">
            REGISTO DE AUDITORIA [TERMINAL]
          </h3>
        </div>
        {/* Luz de atividade do terminal (led laranja piscando de leve) */}
        <span className="w-1.5 h-1.5 rounded-full bg-[#FC8337] animate-pulse" />
      </div>

      {/* Janela de Logs com fundo bem escuro e fonte monospace clássica */}
      <div
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent rounded bg-neutral-950 border border-neutral-900 p-2 font-mono text-[10px] text-neutral-400 space-y-1 select-none min-h-[140px] max-h-[180px] md:max-h-none"
      >
        {logs.length === 0 ? (
          // Mensagem caso não tenha acontecido nenhuma ação ainda.
          <div className="text-neutral-600 italic select-none">Aguardando alteração de sinal de entrada...</div>
        ) : (
          <div ref={terminalRef} className="space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="leading-relaxed border-b border-neutral-950/60 pb-0.5 font-mono">
                {/* Timestamp formatado como [HH:MM:SS] */}
                <span className="text-neutral-500 mr-1.5">[{log.timestamp}]</span>
                <span className="text-neutral-400 font-bold">IN:</span>{" "}
                
                {/* Destaque para as entradas que vieram com valor lógico 1 (acesas em branco puro) */}
                <span className={log.a ? "text-white font-bold" : "text-neutral-500"}>A={log.a}</span>
                <span className="text-neutral-600 font-bold">,</span>{" "}
                <span className={log.s ? "text-white font-bold" : "text-neutral-500"}>S={log.s}</span>
                <span className="text-neutral-600 font-bold">,</span>{" "}
                <span className={log.t ? "text-white font-bold" : "text-neutral-500"}>T={log.t}</span>
                
                <span className="text-neutral-500 mx-1.5">|</span>
                
                <span className="text-neutral-400 font-bold">OUT:</span>{" "}
                
                {/* Se a saída lógica (L) for 1 (Acesso Liberado), a gente destaca em laranja #FC8337! */}
                <span className={log.l ? "text-[#FC8337] font-bold" : "text-neutral-500"}>L={log.l}</span>{" "}
                
                {/* Badge minimalista com cor correspondente: laranja para Liberado, cinza para Negado */}
                <span className={`px-1 py-[0.5px] rounded text-[8px] font-sans font-bold leading-none ${
                  log.l 
                    ? "bg-[#FC8337]/15 text-[#FC8337] border border-[#FC8337]/35" 
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800"
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
