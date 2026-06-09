"use client";

// Aqui a gente importa o React e os hooks que vão dar vida ao nosso simulador.
// - useState: serve pra guardar as variáveis na "memória" do navegador (tipo se o interruptor tá ligado ou desligado).
// - useEffect: roda um código extra sempre que alguma variável específica mudar (bom para gerar novos logs!).
// - useRef: cria uma "âncora" para elementos do HTML para podermos manipulá-los no GSAP ou no scroll.
import React, { useState, useEffect, useRef } from "react";

// Aqui importamos os nossos componentes filhos que criamos e refatoramos.
import ToggleSwitch from "@/components/ToggleSwitch";
import StatusDisplay from "@/components/StatusDisplay";
import TruthTable from "@/components/TruthTable";
import AuditLog, { LogEntry } from "@/components/AuditLog";

// Ícones irados do Lucide React pra dar aquela cara de software corporativo de ponta!
import { Info, Cpu, X } from "lucide-react";

// O GSAP é o motor de animação que deixa tudo rodando liso na tela.
// E o useGSAP é o hook oficial dele que resolve todo o ciclo de vida no React de forma limpa.
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {
  // Esse ref aponta pro container principal. 
  // O GSAP usa ele para limitar o escopo da animação de entrada (só mexe em elementos daqui de dentro).
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs pro Modal elegante do rodapé (pop-up de explicação do projeto).
  // A overlayRef cuida do fundo desfocado escuro, e a modalRef é a caixinha com o texto.
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 1. MEMÓRIA DO CIRCUITO (ESTADOS DO REACT)
  // Declaramos os estados das nossas 3 chaves de entrada:
  // - valA (Admin bypass)
  // - valS (Senha Correta)
  // - valT (Token / 2FA validado)
  const [valA, setValA] = useState<boolean>(false);
  const [valS, setValS] = useState<boolean>(false);
  const [valT, setValT] = useState<boolean>(false);

  // Estado para controlar se o Modal "Sobre o Projeto" está aberto ou fechado.
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Estado que acumula a lista de logs gerados no terminal.
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // ESSA É A FÓRMULA MATEMÁTICA RODANDO DE VERDADE!
  // Calculamos em tempo real a saída L baseada na equação do circuito: L = A ∨ (S ∧ T).
  // Ou seja: L é verdadeiro se Admin for ativado OU se Senha e Token forem ativados juntos.
  const valL = valA || (valS && valT);

  // 2. ANIMAÇÃO DE ENTRADA (INTRO STAGGER COM GSAP)
  // Quando a página termina de carregar, esse código roda uma única vez.
  // Ele procura tudo que tem a classe ".bento-box", empurra 20px pra baixo (y: 20)
  // e faz eles subirem em "efeito cascata" (stagger: 0.08) surgindo do transparente.
  useGSAP(
    () => {
      gsap.from(".bento-box", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "all", // Limpa os estilos inline depois que a animação acaba para não travar o CSS responsivo.
      });
    },
    { scope: containerRef }
  );

  // 3. ANIMAÇÃO DO MODAL SOBRE O PROJETO (GSAP AUTOALPHA)
  // Esse hook ouve as alterações no estado "isAboutOpen".
  // Se abrir, o fundo desfocado aparece (autoAlpha: 1) e o card do modal surge de escala 0.9 para 1.0.
  // Se fechar, o GSAP esconde tudo de forma suave mudando a visibilidade do HTML.
  useGSAP(
    () => {
      if (isAboutOpen) {
        gsap.to(modalOverlayRef.current, {
          autoAlpha: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.fromTo(
          modalRef.current,
          { scale: 0.9, y: 10 },
          { scale: 1, y: 0, duration: 0.3, ease: "back.out(1.5)" }
        );
      } else {
        gsap.to(modalOverlayRef.current, {
          autoAlpha: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    },
    { dependencies: [isAboutOpen] }
  );

  // 4. REGISTRO REATIVO DOS LOGS DO TERMINAL
  // Usamos uma ref para saber se é o primeiro carregamento da página e não duplicar logs indesejados.
  const isFirstRender = useRef(true);

  useEffect(() => {
    const time = new Date().toLocaleTimeString("pt-PT", { hour12: false });

    // Objeto formatado com os sinais de entrada atuais [IN] e a saída avaliada [OUT].
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
      // Adiciona o log inicial do sistema ligando.
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
      // Se não for o primeiro carregamento, adiciona a mudança de estado na fila de logs.
      setLogs((prev) => [...prev, newLog]);
    }
  }, [valA, valS, valT]); // Ouve a alteração de qualquer uma das chaves físicas de entrada.

  return (
    <div
      ref={containerRef}
      className="min-h-screen md:h-screen md:overflow-hidden bg-transparent text-white flex flex-col justify-between p-4 md:p-6 font-roboto space-y-4 relative"
    >
      {/* 
        FUNDO DESFOCADO DE ALTA QUALIDADE (Estilo Gamma Slides)
        Colocamos uma div absoluta com z-0 e uma imagem de alta qualidade com desfoque de 50% (blur-[30px]).
        Deixamos a opacidade em 25% (opacity-25) para que o fundo continue muito sutil,
        sem atrapalhar a leitura do texto ou contrastar demais com as cores laranja e branca.
        A largura w-[110%] e as posições negativas previnem o efeito de borda vazada do desfoque.
      */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/assets/background.jpeg"
          alt="Fundo Desfocado do Circuito"
          className="w-[110%] h-[110%] object-cover opacity-25 blur-[30px] absolute -top-[5%] -left-[5%] select-none"
        />
      </div>

      {/* 5. BARRA DE CABEÇALHO DO APP */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-900 pb-3 shrink-0 gap-2 select-none z-10">
        <div className="flex items-center space-x-2">
          {/* Caixa de circuito estilizada no header com a nossa logo customizada */}
          <div className="p-0.5 rounded bg-neutral-900 border border-neutral-850 overflow-hidden w-6 h-6 flex items-center justify-center shrink-0">
            <img
              src="/assets/logo.jpeg"
              alt="Logo do Projeto"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          {/* Usamos font-saira para títulos destacados técnicos */}
          <h1 className="font-saira text-[11px] font-semibold tracking-[0.25em] text-neutral-200 uppercase">
            Boolean Access Controller
          </h1>
        </div>
        <p className="text-[10px] text-neutral-400 font-mono">
          ESTADO DO CIRCUITO: L = A ∨ (S ∧ T)
        </p>
      </header>

      {/* 6. GRADE BENTO BOX (LAYOUT DE PAINEL ÚNICO NO DESKTOP) */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0 z-10">

        {/* MÓDULO 1: PAINEL DE CONTROLE (COLUNA DA ESQUERDA - 5/12 DA LARGURA) */}
        <section className="bento-box md:col-span-5 h-full flex flex-col justify-between p-4 rounded-xl border border-neutral-850 bg-neutral-950/20 backdrop-blur-sm space-y-4">
          <div className="space-y-3.5">
            {/* Título do painel em fonte Saira */}
            <div className="flex items-center justify-between select-none">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                <h2 className="font-saira text-xs font-medium uppercase tracking-widest text-neutral-300">
                  ENTRADAS LÓGICAS [IN]
                </h2>
              </div>
              <span className="font-mono text-[9px] text-neutral-500 tracking-wider font-bold">
                [GATE PANEL]
              </span>
            </div>

            {/* Os 3 switches interativos compactos */}
            <div className="space-y-2.5">
              <ToggleSwitch
                id="toggle-admin"
                label="Privilégio de Admin (A)"
                symbol="A"
                value={valA}
                onChange={setValA}
                description="Bypass completo de segurança. Concede acesso direto se ativo."
              />
              <ToggleSwitch
                id="toggle-password"
                label="Senha Correta (S)"
                symbol="S"
                value={valS}
                onChange={setValS}
                description="Primeiro fator de segurança. Requer segundo fator (T) ativo."
              />
              <ToggleSwitch
                id="toggle-token"
                label="Token Validado / 2FA (T)"
                symbol="T"
                value={valT}
                onChange={setValT}
                description="Segundo fator de segurança (2FA). Requer primeiro fator (S) ativo."
              />
            </div>
          </div>

          {/* Banner didático explicativo no rodapé do painel */}
          <div className="p-3 rounded-lg border border-neutral-900 bg-neutral-950 flex items-start space-x-2.5 text-[9.5px] text-neutral-400 font-mono leading-relaxed select-none shrink-0">
            <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
            <p>
              Alterar qualquer interruptor [IN] propaga o sinal eletrônico pelas portas booleanas.
              A saída final (L) é calculada no visor e gravada instantaneamente no terminal de auditoria.
            </p>
          </div>
        </section>

        {/* COLUNA DA DIREITA (7/12 DA LARGURA) */}
        <div className="md:col-span-7 flex flex-col gap-4 h-full min-h-0">

          {/* MÓDULO 2: VISOR DE STATUS (ALTURA DE 38%) */}
          <section className="bento-box h-[38%] min-h-0">
            <StatusDisplay
              valA={valA}
              valS={valS}
              valT={valT}
              valL={valL}
            />
          </section>

          {/* PARTE INFERIOR DA DIREITA (DIVIDIDA EM DOIS COMPONENTES DE ALTURA IGUAL) */}
          <div className="h-[62%] grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-0">

            {/* MÓDULO 3: TABELA-VERDADE COMPACTA */}
            <section className="bento-box h-full min-h-0">
              <TruthTable
                valA={valA}
                valS={valS}
                valT={valT}
              />
            </section>

            {/* MÓDULO 4: TERMINAL DE LOGS DE AUDITORIA */}
            <section className="bento-box h-full min-h-0">
              <AuditLog logs={logs} />
            </section>

          </div>
        </div>

      </main>

      {/* 7. RODAPÉ DO SIMULADOR (RODAPÉ ATUALIZADO SEM LABELS EXCESSIVOS) */}
      <footer className="w-full border-t border-neutral-900 pt-2 text-center text-[10px] font-mono text-neutral-500 select-none flex flex-col sm:flex-row items-center justify-between shrink-0 gap-3 z-10">

        {/* Lado esquerdo: Versão do Simulador */}
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FC8337] animate-pulse" />
          <span>MICRO-SIMULADOR BOOLEANO v1.2.0</span>
        </div>

        {/* Lado direito: Ações e Botões de Redirecionamento e Pop-up */}
        <div className="flex items-center space-x-3.5">
          {/* Botão para abrir o Modal elegante com o contexto do projeto */}
          <button
            onClick={() => setIsAboutOpen(true)}
            className="text-neutral-400 hover:text-white hover:border-neutral-500 transition-all duration-200 cursor-pointer font-saira font-medium text-[10px] tracking-wider uppercase border border-neutral-800 px-3 py-1 rounded bg-neutral-950/80 active:scale-95"
          >
            Sobre o Projeto
          </button>

          {/* Link para o GitHub do Jefherson com a logo do GitHub */}
          <a
            href="https://github.com/jefheee/boolean-access-controller"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-neutral-400 hover:text-[#FC8337] hover:border-[#FC8337]/50 transition-all duration-200 font-saira font-medium text-[10px] tracking-wider uppercase border border-neutral-800 px-3 py-1 rounded bg-neutral-950/80 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 shrink-0"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </footer>

      {/* 8. MODAL ELEGANTE "SOBRE O PROJETO" (POP-UP DE CONTEXTO) */}
      {/* Este div cobre toda a tela com desfoque de fundo e fundo semi-transparente */}
      <div
        ref={modalOverlayRef}
        style={{ display: "none" }} // O GSAP com autoAlpha resolve a visibilidade e impede flashes na tela.
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Card do Modal com sombra laranja sutil no fundo */}
        <div
          ref={modalRef}
          className="bg-neutral-950 border border-neutral-850 p-6 rounded-xl max-w-md w-full space-y-4 shadow-[0_0_50px_rgba(252,131,55,0.08)] relative"
        >
          {/* Botão fechar (X) no topo direito */}
          <button
            onClick={() => setIsAboutOpen(false)}
            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer p-0.5 rounded border border-neutral-900 bg-neutral-950"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Cabeçalho do modal */}
          <div className="space-y-1">
            <h3 className="font-saira text-base font-bold text-white uppercase tracking-wider">
              SOBRE O PROJETO
            </h3>
            <span className="font-mono text-[9px] text-[#FC8337] tracking-widest uppercase font-bold">
              [CONTEXTO DE ENGENHARIA]
            </span>
          </div>

          {/* Texto de descrição do projeto em fonte Roboto */}
          <div className="font-roboto text-xs text-neutral-300 space-y-3 leading-relaxed">
            <p>
              Fala galera! Este simulador foi desenvolvido pelo <strong>Jefherson</strong> para
              aulas de <em>Matemática Computacional e Lógica Digital</em>. O objetivo é demonstrar,
              de forma clara e interativa, um circuito digital de redundância física usado em controle de acessos.
            </p>
            <p>
              A regra de negócio aplica a equação <code className="text-[#FC8337] bg-neutral-900 px-1 py-0.5 rounded font-mono font-bold">L = A ∨ (S ∧ T)</code>.
              Isso garante que um portão físico seja liberado se o sinal de Administrador (<code className="font-mono font-bold">A</code>) for 1,
              OU se o usuário digitar a Senha correta (<code className="font-mono font-bold">S</code>) e tiver o Token 2FA (<code className="font-mono font-bold">T</code>) validado.
            </p>
            <p>
              Tudo foi implementado usando <strong>Next.js</strong> e <strong>TypeScript</strong> para termos tipagem estática e segura.
              As animações foram feitas com <strong>GSAP</strong> para ficarem ultra-suaves, e o design Bento Box segue uma estética
              monocromática premium com estrelas estáticas de fundo e detalhes destacados no laranja hexadecimal <strong>#FC8337</strong>.
            </p>
          </div>

          {/* Botão fechar principal no rodapé do modal */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="px-4 py-1.5 bg-[#FC8337] hover:bg-[#ff9a59] text-black font-saira font-bold text-xs tracking-wider uppercase rounded transition-colors duration-150 cursor-pointer active:scale-95 shadow-md"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
