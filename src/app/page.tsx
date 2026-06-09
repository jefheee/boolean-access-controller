"use client";

import React, { useState } from "react";
import ToggleSwitch from "@/components/ToggleSwitch";
import StatusDisplay from "@/components/StatusDisplay";
import TruthTable from "@/components/TruthTable";
import { Info, Cpu, ShieldCheck } from "lucide-react";

export default function Home() {
  // 1. States for our Boolean variables
  const [valA, setValA] = useState<boolean>(false);
  const [valS, setValS] = useState<boolean>(false);
  const [valT, setValT] = useState<boolean>(false);

  // 2. Compute the result: L = A ∨ (S ∧ T)
  const valL = valA || (valS && valT);

  return (
    <main className="flex-1 w-full bg-black text-white flex flex-col justify-between min-h-screen">
      {/* Container with grid */}
      <div className="max-w-6xl w-full mx-auto px-4 py-8 md:py-12 flex-1 flex flex-col justify-center space-y-8">
        
        {/* Header Section */}
        <header className="space-y-3 border-b border-neutral-900 pb-6">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
              Micro-Simulador de Portas Lógicas
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-mono tracking-tight font-bold text-neutral-100">
                Boolean Access Controller
              </h1>
              <p className="text-xs text-neutral-500 max-w-xl mt-1 leading-relaxed">
                Um simulador digital interativo concebido sob estética monocromática para demonstrar
                matematicamente a liberação de portões sob a lógica de redundância de segurança.
              </p>
            </div>
            {/* Short status badge */}
            <div className="flex items-center space-x-2 self-start md:self-auto px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/40 text-[10px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-400 uppercase">Fórmula: L = A ∨ (S ∧ T)</span>
            </div>
          </div>
        </header>

        {/* Core Simulation Area */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          
          {/* Left Panel: Control Toggles */}
          <div className="flex flex-col space-y-6 p-6 rounded-2xl border border-neutral-900 bg-neutral-950/20 backdrop-blur-sm justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-neutral-700 animate-pulse" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                  Painel de Controlo (Entradas)
                </h2>
              </div>
              
              <div className="space-y-4">
                <ToggleSwitch
                  id="toggle-admin"
                  label="Privilégio de Administrador"
                  symbol="A"
                  value={valA}
                  onChange={setValA}
                  description="Bypass completo de autenticação. Concede acesso direto se ativo."
                />
                
                <ToggleSwitch
                  id="toggle-password"
                  label="Senha Correta"
                  symbol="S"
                  value={valS}
                  onChange={setValS}
                  description="Primeiro fator de segurança. Requer segundo fator (T) para autorizar."
                />
                
                <ToggleSwitch
                  id="toggle-token"
                  label="Token Validado / 2FA"
                  symbol="T"
                  value={valT}
                  onChange={setValT}
                  description="Segundo fator de segurança (2FA). Requer primeiro fator (S) para autorizar."
                />
              </div>
            </div>

            {/* Instruction tooltip card */}
            <div className="mt-6 p-4 rounded-xl border border-neutral-900 bg-neutral-950 flex items-start space-x-3 text-[10px] text-neutral-500 font-mono">
              <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Interaja com os switches acima para alternar os estados binários (0 ou 1). 
                Observe em tempo real a reavaliação da equação lógica e a reação visual
                do indicador de acesso no painel lateral.
              </p>
            </div>
          </div>

          {/* Right Panel: Live Visualizer */}
          <div>
            <StatusDisplay
              valA={valA}
              valS={valS}
              valT={valT}
              valL={valL}
            />
          </div>
        </section>

        {/* Bottom Section: Collapsible Truth Table */}
        <section>
          <TruthTable
            valA={valA}
            valS={valS}
            valT={valT}
          />
        </section>

      </div>

      {/* Elegant minimalist footer */}
      <footer className="w-full border-t border-neutral-900 bg-neutral-950 py-6 text-center text-[10px] font-mono text-neutral-600 select-none">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MICRO-SIMULADOR BOOLEANO v1.0.0</span>
          <span>ESTADO ATUAL DO SINAL DE SAÍDA: L = {valL ? "1 (LIBERADO)" : "0 (NEGADO)"}</span>
          <span>ANTIGRAVITY LABS</span>
        </div>
      </footer>
    </main>
  );
}
