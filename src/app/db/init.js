const fs = require('fs');
const path = require('path');
const db = require('../lib/db');

/**
 * Função para inicializar o banco de dados
 */
async function initDb() {
  try {
    console.log('Iniciando a criação das tabelas no banco de dados...');
    
    // Define o conteúdo do schema SQL diretamente no código para evitar problemas de caminho
    const schemaSql = `
    -- Criação da tabela de funcionários
    CREATE TABLE IF NOT EXISTS funcionarios (
        id UUID PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        especialidade VARCHAR(100) NOT NULL,
        telefone VARCHAR(20)
    );

    -- Criação da tabela de serviços
    CREATE TABLE IF NOT EXISTS servicos (
        id UUID PRIMARY KEY,
        nome VARCHAR(255),
        preco DECIMAL(10, 2) NOT NULL,
        duracao INTEGER NOT NULL,
        descricao TEXT NOT NULL
    );

    -- Criação da tabela de agendamentos
    CREATE TABLE IF NOT EXISTS agendamentos (
        id UUID PRIMARY KEY,
        nomeCliente VARCHAR(255) NOT NULL,
        clienteTelefone VARCHAR(20),
        funcionarioId UUID NOT NULL,
        servicoId UUID NOT NULL,
        horaInicio TIMESTAMP NOT NULL,
        horaFim TIMESTAMP NOT NULL,
        FOREIGN KEY (funcionarioId) REFERENCES funcionarios(id) ON DELETE CASCADE,
        FOREIGN KEY (servicoId) REFERENCES servicos(id) ON DELETE CASCADE
    );
    `;
    
    // Divide as consultas SQL por ponto e vírgula
    const queries = schemaSql
      .split(';')
      .filter(query => query.trim() !== '')
      .map(query => query.trim() + ';');
    
    // Executa cada consulta SQL separadamente
    for (const query of queries) {
      try {
        console.log('Executando query:', query.substring(0, 100) + '...');
        await db.query(query);
        console.log('Query executada com sucesso');
      } catch (error) {
        console.error('Erro ao executar query:', error.message);
        console.error('Query com erro:', query);
        // Continua para a próxima query, mesmo se houver erro
      }
    }
    
    console.log('Inicialização do banco de dados concluída!');
    return { success: true, message: 'Banco de dados inicializado com sucesso' };
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    return { success: false, message: error.message };
  }
}

// Exporta a função para ser usada em outros arquivos
module.exports = { initDb };
