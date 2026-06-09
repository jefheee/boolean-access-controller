# Boolean Access Controller 🎛️⚡

O **Boolean Access Controller** é um micro-simulador interativo de circuitos e portas lógicas digitais aplicados a controle de acesso físico redundante (liberação de portão/fechadura eletrônica). O projeto foi desenvolvido de forma didática para fins de demonstração prática em aulas de **Matemática Computacional e Lógica Digital**.

O simulador apresenta uma interface inspirada na estética premium **Bento Box**, contando com efeitos de desfoque (glassmorphism), animações dinâmicas via **GSAP** e suporte a dispositivos móveis com design 100% fluido e responsivo.

---

## 🔬 A Lógica do Circuito

A regra de negócio e o comportamento do circuito são baseados na seguinte equação booleana de controle:

$$\mathbf{L = A \lor (S \land T)}$$

Em linguagem de programação convencional, equivale a:
`L = A || (S && T)`

### Elementos do Painel:
*   **`A` (Admin Bypass / Privilégio de Administrador):** Um bypass físico completo. Se o interruptor administrador estiver ativado (1), o acesso é concedido diretamente.
*   **`S` (Senha Correta):** O primeiro fator de segurança de usuário comum. Requer que o segundo fator (Token) também seja validado.
*   **`T` (Token Validado / 2FA):** O segundo fator de verificação (MFA). Só valida o acesso de usuário comum em conjunto com a Senha (`S`).
*   **`L` (Acesso Liberado / Saída Lógica):** Indica o estado final do circuito lógico (1 para Acesso Liberado e 0 para Acesso Negado).

---

## 🛠️ Tecnologias Utilizadas

*   **Framework:** [Next.js](https://nextjs.org/) (App Router com TypeScript)
*   **Biblioteca UI:** [React](https://react.dev/) (Hooks reativos para controle de sinal `useState`, `useEffect` e referências do DOM com `useRef`)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Sistema de Grid responsivo com breakpoints e animações customizadas)
*   **Motor de Animação:** [GSAP (GreenSock Animation Platform)](https://gsap.com/) & `@gsap/react` (Animações de entrada e efeitos táteis/transições de estado dinâmicas nos cards)
*   **Pacote de Ícones:** [Lucide React](https://lucide.dev/) (Ícones modernos de hardware e status)

---

## ✨ Funcionalidades do Simulador

1.  **Chaves Físicas (Toggle Switches):** Interruptores com visual de hardware real, que alteram instantaneamente o sinal lógico propagado no circuito.
2.  **Visor de Status Interativo:** Mostra a representação booleana atual do circuito. As variáveis ativas na fórmula acendem dinamicamente em laranja (`#FC8337`), e o painel de cadeado rotaciona e brilha para dar feedback imediato de `ACESSO LIBERADO` ou `ACESSO NEGADO`.
3.  **Tabela-Verdade Viva:** Um mapa lógico dinâmico com 8 estados possíveis. O sistema realiza um cálculo binário baseado nas posições das chaves e destaca com precisão (com fundo laranja e texto negrito) a linha exata correspondente ao estado físico do simulador.
4.  **Terminal de Logs (Audit Log):** Um console virtual que grava instantaneamente cada modificação nas chaves de entrada (`IN`) e na saída (`OUT`), com registro de data/hora (timestamp).
5.  **Modal "Sobre o Projeto":** Pop-up explicativo detalhando a lógica matemática e o contexto de engenharia.
6.  **Modal de Compartilhamento (QR Code):** Painel de acesso rápido gerando um QR Code do dashboard para facilitar o compartilhamento em telas de apresentação ou dispositivos móveis.

---

## 📱 Responsividade (Mobile-First)

O sistema foi refatorado sob diretrizes de design responsivo:
*   **Mobile (Padrão):** Os módulos são empilhados verticalmente e ocupam 100% da largura da tela (`w-full`), habilitando rolagem vertical suave. O Audit Log possui altura máxima fixada (`max-h-48`) com rolagem interna para não esticar a visualização, e a Tabela-Verdade tem rolagem horizontal interna (`overflow-x-auto`) em celulares de baixa resolução.
*   **Desktop (`lg:`):** A partir de telas grandes (>= 1024px), o layout Bento Box original com 2 colunas principais e altura travada (`h-screen` com `overflow-hidden`) é restaurado perfeitamente.

---

## 🚀 Como Executar Localmente

Certifique-se de ter o **Node.js** instalado em sua máquina.

1. Clone o repositório do projeto:
   ```bash
   git clone https://github.com/jefheee/boolean-access-controller.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd boolean-access-controller
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o simulador funcionando.
