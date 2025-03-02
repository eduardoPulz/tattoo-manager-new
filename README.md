# Tattoo Manager - Sistema Simplificado

Uma aplicação simples para gerenciamento de estúdio de tatuagem desenvolvida com Next.js e banco de dados baseado em arquivos JSON.

## Visão Geral

O Tattoo Manager é um sistema completo para gestão de estúdios de tatuagem, permitindo o gerenciamento de:

- **Funcionários**: Cadastro e gerenciamento da equipe
- **Serviços**: Catálogo de serviços oferecidos
- **Agendamentos**: Sistema de agendamento de tatuagens

## Tecnologias

- **Frontend**: Next.js, React, CSS Modules
- **Backend**: Next.js API Routes
- **Banco de Dados**: Arquivo JSON para persistência de dados
- **Deploy**: Railway.app

## Características

- Interface simples e intuitiva
- Sistema de abas para navegação entre seções
- Validação de dados no cliente e servidor
- Tratamento robusto de erros
- Design responsivo

## Funcionalidades

### Gerenciamento de Funcionários
- Cadastro de funcionários (nome, cargo, email)
- Listagem e exclusão de funcionários

### Gerenciamento de Serviços
- Cadastro de serviços (nome, preço, duração)
- Listagem e exclusão de serviços

### Gerenciamento de Agendamentos
- Agendamento de tatuagens (cliente, data, hora, funcionário, serviço)
- Listagem e exclusão de agendamentos

## Como Executar Localmente

```bash
# Instalar dependências
npm install

# Configurar o banco de dados
npm run setup

# Iniciar o servidor de desenvolvimento
npm run dev
```

## Estrutura do Projeto

```
tattoo-manager/
├── db.json                 # Banco de dados baseado em arquivo
├── public/                 # Arquivos estáticos
├── scripts/                # Scripts de configuração
│   ├── generate-env.js     # Gera variáveis de ambiente
│   └── setup-db.js         # Configura o banco de dados
├── src/
│   ├── app/
│   │   ├── api/            # Endpoints da API
│   │   ├── components/     # Componentes React
│   │   ├── lib/            # Biblioteca de utilitários
│   │   └── page.js         # Página principal
└── package.json            # Dependências e scripts
```

## Scripts de Configuração

O projeto inclui scripts de configuração que são executados automaticamente durante o processo de build e desenvolvimento:

- **setup-db.js**: Cria o arquivo db.json com a estrutura inicial se ele não existir
- **generate-env.js**: Configura variáveis de ambiente necessárias para o projeto

Estes scripts são executados automaticamente quando você roda:
- `npm run dev` (inicia o servidor de desenvolvimento)
- `npm run build` (compila o projeto para produção)
- `npm run setup` (configura manualmente o banco de dados)

## Sobre a Versão 2.0

A versão 2.0 do Tattoo Manager foi significativamente simplificada para facilitar a manutenção e o deploy.

### Banco de Dados Simplificado
- Sistema de banco de dados baseado em arquivo JSON
- Eliminação de dependências de banco de dados relacional
- Persistência direta em um arquivo `db.json` na raiz do projeto

### APIs Simplificadas
- Padrão consistente para todas as APIs
- Tratamento de erros melhorado
- Validações simplificadas

### Frontend mais Robusto
- Tratamento de erros melhorado na interface
- Fallbacks para garantir funcionamento contínuo
- Validações no cliente

## Deploy

Este projeto está configurado para deploy no Railway.app. O deploy é automático a partir da branch main.