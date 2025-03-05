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