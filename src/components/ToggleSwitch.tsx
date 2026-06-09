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
  // Criamos as referências (refs) para os elementos HTML.
  // É como usar o document.getElementById(), mas do jeito certo dentro do React.
  // Assim o GSAP sabe exatamente qual elemento ele deve animar na tela.
  const trackRef = useRef<HTMLButtonElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const inLabelRef = useRef<HTMLSpanElement>(null);

  // Aqui a gente usa o useGSAP, que é o hook oficial do GSAP para React.
  // Ele cuida de limpar as animações da memória e roda de novo sempre que o valor do botão mudar (true/false).
  useGSAP(
    () => {
      // 1. Movemos a bolinha (thumb) do switch. 
      // Se "value" for true, ela corre 22 pixels para a direita (x: 22). Se for false, volta para a esquerda (x: 0).
      // Também mudamos a cor da bolinha: preta quando ligada, cinza claro quando desligada.
      gsap.to(thumbRef.current, {
        x: value ? 22 : 0,
        backgroundColor: value ? "#000000" : "#a3a3a3",
        duration: 0.2,
        ease: "power2.out",
      });

      // 2. Mudamos o fundo (track) do interruptor.
      // Se tiver ativo, fica branco com borda branca; se não, fica cinza escuro (neutral-900).
      gsap.to(trackRef.current, {
        backgroundColor: value ? "#ffffff" : "#171717",
        borderColor: value ? "#ffffff" : "#404040",
        duration: 0.2,
        ease: "power2.out",
      });

      // 3. Efeito de pulsação suave no badge que mostra o valor lógico (0 ou 1).
      // Ele dá um "pulinho" de leve (escala de 0.9 para 1.0) sempre que clicamos.
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.9 },
        { scale: 1, duration: 0.15, ease: "back.out(2)" }
      );

      // 4. Aplicamos o laranja de destaque (#FC8337) nos elementos de texto/borda ativos.
      // O badge do sinal lógico brilha em laranja quando ativado, e volta para o cinza quando desativado.
      gsap.to(badgeRef.current, {
        color: value ? "#FC8337" : "#d4d4d4",
        borderColor: value ? "#FC8337" : "#404040",
        backgroundColor: value ? "#262626" : "#09090b",
        duration: 0.2,
      });

      // Também acendemos o texto [IN] (sinal de entrada) em laranja se o botão estiver ativado (1).
      gsap.to(inLabelRef.current, {
        color: value ? "#FC8337" : "#525252",
        duration: 0.2,
      });
    },
    { dependencies: [value], scope: trackRef }
  );

  return (
    // Esse é o container externo de cada interruptor. 
    // Tem um efeito de hover que ilumina a borda cinza quando passamos o mouse por cima.
    <div className="flex flex-col space-y-1.5 p-3 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 transition-colors duration-200">
      <div className="flex items-center justify-between">
        
        {/* Lado esquerdo: Interruptor físico e rótulo */}
        <div className="flex items-center space-x-3">
          {/* Botão interativo do interruptor. A borda de foco (focus:ring) brilha em laranja (#FC8337) ao navegar por teclado! */}
          <button
            ref={trackRef}
            id={id}
            type="button"
            role="switch"
            aria-checked={value}
            onClick={() => onChange(!value)}
            className="relative w-12 h-6 rounded-full border border-neutral-700 bg-neutral-900 flex items-center px-[2px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FC8337] focus:ring-offset-1 focus:ring-offset-black transition-shadow"
          >
            <span
              ref={thumbRef}
              className="block w-4 h-4 rounded-full bg-neutral-400 shadow-sm"
            />
          </button>
          
          {/* Título do botão. Usamos a classe font-saira (fonte do Google Saira, peso Medium) para ficar bem destacado. */}
          <span className="font-saira text-sm font-medium select-none text-neutral-200">
            {label}
          </span>
        </div>

        {/* Lado direito: O indicador técnico de circuito [IN] e a representação matemática (ex: S = 1) */}
        <div className="flex items-center space-x-2 select-none">
          <span
            ref={inLabelRef}
            className="font-mono text-[9px] text-neutral-500 tracking-wider font-bold"
          >
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
      
      {/* Texto de descrição complementar, usando a fonte Roboto com cor cinza suave e bom contraste. */}
      {/* O padding pl-[60px] alinha o texto perfeitamente embaixo do título, pulando a largura do interruptor. */}
      {description && (
        <p className="font-roboto text-[11px] text-neutral-400 select-none leading-normal pl-[60px]">
          {description}
        </p>
      )}
    </div>
  );
}
