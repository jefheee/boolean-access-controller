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
  // Pegamos a referência (refs) dos cards e textos.
  // O GSAP precisa dessas referências para poder mudar as cores, bordas e glows direto na árvore do DOM.
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Guardamos o último estado do acesso para fazer uma transição suave de fade no texto.
  const prevL = useRef(valL);

  // Animação de transição do Card de Acesso usando GSAP.
  useGSAP(
    () => {
      if (valL) {
        // --- CASO 1: ACESSO LIBERADO ---
        // Aqui a gente deixa o card branco brilhante (bg-white, text-black) e aplica um glow branco irado!
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
        
        // Fica pulsando o brilho (glow) infinitamente usando yoyo e repeat: -1.
        tl.to(
          cardRef.current,
          {
            boxShadow: "0 0 30px rgba(255, 255, 255, 0.35)",
            repeat: -1,
            yoyo: true,
            duration: 1.2,
            ease: "sine.inOut",
          },
          "+=0.05"
        );
      } else {
        // --- CASO 2: ACESSO NEGADO ---
        // Para resolver a acessibilidade e não sumir no fundo preto:
        // Colocamos o card com fundo cinza bg-neutral-900 (#171717), borda border-neutral-600 (#525252)
        // e o texto em cinza claro text-neutral-400 (#a3a3a3). Zero glow pra economizar energia visual!
        gsap.killTweensOf(cardRef.current);
        gsap.to(cardRef.current, {
          backgroundColor: "#171717",
          borderColor: "#525252",
          color: "#a3a3a3",
          scale: 1.0,
          boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
          duration: 0.25,
          ease: "power2.out",
        });
      }

      // Toda vez que o estado muda, o cadeado dá uma girada de leve e um bump na escala (feedback tátil).
      gsap.fromTo(
        iconRef.current,
        { scale: 0.8, rotate: valL ? -30 : 30 },
        { scale: 1, rotate: 0, duration: 0.3, ease: "back.out(1.5)" }
      );
    },
    { dependencies: [valL] }
  );

  // Aqui a gente faz a transição do texto de status com um efeito discreto de sumir e subir.
  // Esse useEffect escuta as mudanças em valL. Se mudou, ele esconde o texto deslizando 4 pixels para cima,
  // atualiza o estado interno da ref e depois mostra o texto novo subindo do fundo.
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
    <div className="flex flex-col h-full justify-between p-4 rounded-xl border-2 border-neutral-700/70 bg-neutral-950/40 space-y-3">
      
      {/* Cabeçalho da visualização */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
            {/* Título usando Saira para chamar atenção de forma limpa */}
            <span className="font-saira text-[10px] tracking-widest text-neutral-300 uppercase">
              EQUAÇÃO DE CIRCUITO
            </span>
          </div>
          {/* Badge de saída lógica. Fica laranja se a saída (L) for verdadeira (1) */}
          <span className={`font-mono text-[9px] font-bold select-none transition-colors duration-200 ${
            valL ? "text-[#FC8337]" : "text-neutral-500"
          }`}>
            [CIRCUIT OUT]
          </span>
        </div>
        
        {/* Monospace display mostrando a fórmula lógica ativa e pintando as variáveis acesas em laranja! */}
        <div className="py-2.5 px-4 rounded-lg bg-neutral-950 border border-neutral-800 flex justify-center items-center">
          <code className="text-base font-mono tracking-wider select-none">
            {/* O resultado final (L). Se for 1, brilha em laranja. */}
            <span
              className={`transition-all duration-200 ${
                valL ? "text-[#FC8337] font-bold drop-shadow-[0_0_8px_rgba(252,131,55,0.5)]" : "text-neutral-400"
              }`}
            >
              L
            </span>
            <span className="text-neutral-650 mx-2">=</span>
            
            {/* Variável A. Se o admin estiver ativado, brilha no laranja #FC8337 */}
            <span
              className={`transition-all duration-200 ${
                valA ? "text-[#FC8337] font-bold drop-shadow-[0_0_8px_rgba(252,131,55,0.5)]" : "text-neutral-500"
              }`}
            >
              A
            </span>
            <span className="text-neutral-650 mx-2">∨</span>
            <span className="text-neutral-650">(</span>
            
            {/* Variável S (Senha). Fica laranja se estiver correta. */}
            <span
              className={`transition-all duration-200 ${
                valS ? "text-[#FC8337] font-bold drop-shadow-[0_0_8px_rgba(252,131,55,0.5)]" : "text-neutral-500"
              }`}
            >
              S
            </span>
            <span className="text-neutral-650 mx-2">∧</span>
            
            {/* Variável T (Token). Fica laranja se estiver validado. */}
            <span
              className={`transition-all duration-200 ${
                valT ? "text-[#FC8337] font-bold drop-shadow-[0_0_8px_rgba(252,131,55,0.5)]" : "text-neutral-500"
              }`}
            >
              T
            </span>
            <span className="text-neutral-650">)</span>
          </code>
        </div>
      </div>

      {/* Caixa de status do Acesso físico (Cadeado e Resumo) */}
      <div className="flex-1 flex flex-col justify-center">
        <div
          ref={cardRef}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3 flex items-center justify-between select-none"
        >
          {/* Agrupamos ícone e texto numa linha para economizar altura de tela */}
          <div className="flex items-center space-x-3.5">
            <div ref={iconRef} className="shrink-0">
              {valL ? (
                // Se liberado, ícone de destravado.
                <Unlock className="w-7 h-7 stroke-[1.5] text-black" />
              ) : (
                // Se negado, ícone de cadeado trancado.
                <Lock className="w-7 h-7 stroke-[1.5] text-neutral-400" />
              )}
            </div>
            
            {/* Rótulo de status usando Saira pros títulos. Super legível em ambas as cores. */}
            <div ref={textRef} className="text-left space-y-0.5">
              <h2 className="font-saira text-xs tracking-wider font-bold uppercase leading-none">
                {valL ? "ACESSO LIBERADO" : "ACESSO NEGADO"}
              </h2>
              <p className="font-mono text-[9px] tracking-wider uppercase opacity-85 leading-none">
                SAÍDA [OUT: L = {valL ? "1" : "0"}]
              </p>
            </div>
          </div>
          
          {/* Badge extra indicando boolean puro (TRUE/FALSE) aceso em laranja se ativo */}
          <span className={`font-mono text-[9px] font-bold opacity-80 shrink-0 transition-colors duration-200 ${
            valL ? "text-[#FC8337]" : "text-neutral-500"
          }`}>
            {valL ? "[TRUE]" : "[FALSE]"}
          </span>
        </div>
      </div>
    </div>
  );
}
