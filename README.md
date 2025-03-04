# Tattoo Manager

Sistema de gerenciamento para estúdios de tatuagem com cadastro de funcionários, serviços e agendamentos.

## Recursos

- Cadastro e gestão de funcionários
- Cadastro e gestão de serviços
- Agendamento de horários
- Interface moderna e responsiva
- Sistema de banco de dados simplificado

## Deploy na Vercel

Siga as instruções abaixo para fazer o deploy do Tattoo Manager na plataforma Vercel:

### 1. Prepare seu projeto

O projeto já está configurado para funcionar na Vercel. As seguintes alterações foram implementadas:

- Sistema de banco de dados adaptado para funcionar em memória no ambiente Vercel
- Arquivo `vercel.json` criado com as configurações necessárias
- Scripts ajustados para funcionarem corretamente na Vercel

### 2. Conecte ao GitHub (Recomendado)

1. Faça upload do seu projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e crie uma conta ou faça login
3. Clique em "New Project"
4. Escolha a opção "Import Git Repository" e selecione seu repositório do GitHub
5. Na configuração do projeto, mantenha as configurações padrão:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run vercel-build
   - Output Directory: .next

### 3. Deploy Direto (Alternativa)

Se preferir não usar o GitHub:

1. Instale a CLI da Vercel: `npm i -g vercel`
2. No diretório do projeto, execute: `vercel`
3. Siga as instruções para login e configuração

### 4. Variáveis de Ambiente (se necessário)

Não são necessárias variáveis de ambiente específicas para o funcionamento básico, mas você pode configurar:

- `VERCEL=1` (já configurado automaticamente pela plataforma)
- `NODE_ENV=production` (já configurado automaticamente pela plataforma)

### 5. Considerações sobre o Banco de Dados

No ambiente Vercel, o banco de dados funciona em memória, o que significa:

- Os dados serão resetados após cada deploy ou reinicialização da aplicação
- Ideal para demonstração, mas para um ambiente de produção real, considere migrar para um banco de dados permanente como MongoDB, PostgreSQL ou serviços como Supabase

## Desenvolvimento Local

Para executar o projeto localmente:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Licença

Este projeto é disponibilizado como código aberto.


## 2.5 METODOLOGIA
```
A metodologia utilizada será apresentada cronologicamente.
No dia 10 de agosto de 2024, foi feita a análise do novo projeto e suas exigências. Seguiremos com o desenvolvimento de uma agenda para um estúdio de tatuagens, utilizando React para o frontend (devido à sua eficiência em componentes reutilizáveis e experiência dinâmica) e Railway para o backend e deploy (garantindo escalabilidade e integração contínua). O projeto integrante anterior nos trouxe familiaridade com JavaScript, mas neste queríamos aprofundar conhecimentos em React e explorar soluções modernas de estilização com Styled Components.

Em 20 de agosto de 2024, configuramos o projeto do zero. No frontend, utilizamos React com JavaScript para toda a lógica de estado, formulários e interações, enquanto Styled Components foi adotado para a estilização modular e responsiva. Para o banco de dados, optamos por um serviço gerenciado pelo Railway, evitando a complexidade de configurações manuais. Utilizamos o DBDiagram para modelar a estrutura do banco antes de implementá-lo diretamente via interface do Railway.

Em 05 de setembro de 2024, iniciamos a construção do layout. Apesar da flexibilidade do React, enfrentamos desafios na organização dos componentes e no alinhamento de elementos, especialmente com a integração do Styled Components para garantir consistência visual.

No dia 12 de setembro de 2024, refinamos a abordagem de design, focando em um sistema de componentes reutilizáveis com Styled Components. Buscamos equilibrar estética e funcionalidade, priorizando uma experiência fluída para o usuário final.

Em 25 de outubro de 2024, identificamos excesso de navegação entre páginas, algo comum em aplicações tradicionais. Para resolver, migramos para uma abordagem SPA (Single Page Application) com React Router, substituindo recarregamentos de página por transições dinâmicas e modais.

No dia 28 de outubro de 2024, reestruturamos a UX integrando modais e formulários controlados por estado no React. Enfrentamos desafios com bibliotecas de calendário (como react-datepicker) dentro de modais, resolvidos através de ajustes no gerenciamento de z-index e eventos no Styled Components.

Em 1 de novembro de 2024, finalizamos a integração entre frontend e backend. O deploy do frontend foi realizado na Vercel, enquanto o backend e o banco de dados foram configurados no Railway. Subimos a versão estável para o repositório Git.

Em 02 de novembro de 2024, enfrentamos erros durante o build na Vercel devido a conflitos de dependências (especificamente com otimizações do Styled Components e pacotes do React). Os logs apontavam falhas genéricas no processo de npm run build.

No dia 3 de novembro de 2024, resolvemos os problemas identificando incompatibilidades na versão do Node.js exigida pela Vercel. Atualizamos o ambiente para Node.js 18.x e revisamos a configuração do vite.config.js, garantindo a compatibilidade com os recursos do Styled Components. O projeto foi então publicado com sucesso em:
https://tattoo-manager-two.vercel.app/home
```