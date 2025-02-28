# Testes Automatizados

Este diretório contém os testes automatizados para o projeto Tattoo Manager.

## Estrutura de Testes

Os testes estão organizados nas seguintes categorias:

- **components/**: Testes para componentes React
- **api/**: Testes para endpoints da API

## Executando os Testes

Para executar os testes, use os seguintes comandos:

```bash
# Executar todos os testes
npm test

# Executar testes em modo de observação (watch mode)
npm run test:watch

# Executar testes para integração contínua
npm run test:ci
```

## Configuração

O projeto utiliza Jest como framework de testes. A configuração está definida em:

- `jest.simple.config.js`: Configuração simplificada para execução local
- `jest.config.js`: Configuração completa para integração com Next.js (requer Node.js 18+)

## Integração Contínua

Os testes são executados automaticamente em cada push e pull request através do GitHub Actions. A configuração está definida em `.github/workflows/ci.yml`.

## Cobertura de Código

Os relatórios de cobertura de código são gerados automaticamente durante a execução dos testes e podem ser visualizados no diretório `coverage/`.

## Expandindo os Testes

Ao adicionar novos testes, siga estas diretrizes:

1. Crie arquivos de teste com o padrão `*.test.js`
2. Organize os testes em diretórios correspondentes à estrutura do projeto
3. Mantenha os testes simples e focados em uma única funcionalidade
4. Use mocks para isolar o código sendo testado de suas dependências
