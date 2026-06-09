import type { Metadata } from "next";
// Galera, aqui a gente importa o carregador de fontes do Next.js direto do Google Fonts.
// Isso evita que a página demore a carregar ou dê aquele "pulo" chato na hora de renderizar os textos.
import { Saira, Roboto } from "next/font/google";
import "./globals.css";

// Criamos a variável da fonte Saira (Medium - peso 500) para ser usada em títulos e destaques lógicos.
const sairaFont = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["500"],
});

// E aqui criamos a variável da fonte Roboto (Normal - peso 400) para textos longos, explicações e logs.
const robotoFont = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400"],
});

// Esse objeto é o que o Next.js lê para colocar as tags de título e descrição na aba do navegador.
// Bom para o SEO (indexação do Google encontrar o projeto do Jefherson!).
export const metadata: Metadata = {
  title: "Simulador de Lógica Booleana - Controlo de Acesso",
  description: "Simulador interativo de controle de acesso usando a equação booleana L = A ∨ (S ∧ T). Desenvolvido com Next.js, Tailwind CSS e GSAP.",
};

// Esse é o layout geral ("casca" ou shell) que abraça todas as páginas do nosso app.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Passamos as classes das fontes na tag html para podermos usá-las no nosso CSS e Tailwind.
    <html
      lang="pt-BR"
      className={`${sairaFont.variable} ${robotoFont.variable} h-full antialiased`}
    >
      {/* O body vai ocupar a altura mínima inteira da tela e usar flex para organizar as coisas */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
