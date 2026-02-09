  🩺 Questionário de Inflamação e Risco Mental


  Aplicação interativa desenvolvida para o Dr. Bruno Paschoalini, focada em triagem de saúde
  integrativa. O sistema permite que pacientes avaliem seus níveis de inflamação e riscos à
  saúde mental de forma rápida e segura.


  🚀 Funcionalidades


   - Questionário Multi-etapas: Interface amigável dividida em Passos (Dados Pessoais,
     Inflamação, Risco Mental).
   - Cálculo em Tempo Real: Escores calculados instantaneamente com base em algoritmos
     clínicos.
   - Relatório PDF: Geração automática de um relatório detalhado com destaques para os
     pontos críticos.
   - Sincronização com Planilha: Envio automático dos resultados para o Google Sheets para
     acompanhamento clínico.
   - Design Responsivo: Otimizado para dispositivos móveis e desktops usando Tailwind CSS.
   - Analytics Integrado: Monitoramento de uso via Vercel Analytics.

  🛠️ Tecnologias Utilizadas


   - Frontend: HTML5, JavaScript (ES6+), Tailwind CSS (https://tailwindcss.com/).
   - Build Tool: Vite (https://vitejs.dev/).
   - Backend (Proxy): Node.js via Vercel Serverless Functions
     (https://vercel.com/docs/functions).
   - Integração: Google Apps Script (https://developers.google.com/apps-script).
   - Bibliotecas:
     - jsPDF & autoTable (Geração de PDFs).
     - Vitest (Testes unitários).
     - xlsx (Geração de relatórios de análise).


  📂 Estrutura do Projeto


   1 ├── api/              # Proxy Serverless para evitar erros de CORS
   
   2 ├── scripts/          # Scripts de automação e código Apps Script
   
   3 ├── src/
   
   4 │   ├── services/     # Comunicação com APIs externas
   
   5 │   ├── dom.js        # Manipulação de interface (UI)
   
   6 │   ├── logic.js      # Regras de negócio e cálculos
   
   7 │   └── main.js       # Ponto de entrada da aplicação
   
   8 ├── tests/            # Testes automatizados (Vitest)
   
   9 └── index.html        # Estrutura principal


  ⚙️ Configuração e Instalação

  Pré-requisitos
   - Node.js (v18 ou superior)
   - NPM ou Yarn

  Instalação
   1. Clone o repositório.
   2. Instale as dependências:
   1    npm install


  Desenvolvimento
  Inicie o servidor de desenvolvimento local:
   1 npm run dev

  Testes
  Para garantir que os cálculos estão corretos:
   1 npm test
