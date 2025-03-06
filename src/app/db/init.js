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
    -- Primeiro, desativar verificação de chaves estrangeiras para poder dropar as tabelas na ordem correta
    BEGIN;
    
    -- Drop de tabelas na ordem inversa de dependência
    DROP TABLE IF EXISTS agendamentos;
    DROP TABLE IF EXISTS servicos;
    DROP TABLE IF EXISTS funcionarios;
    
    -- Criação da tabela de funcionários
    CREATE TABLE funcionarios (
        id UUID PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        especialidade VARCHAR(100) NOT NULL,
        telefone VARCHAR(20)
    );
    
    -- Criação da tabela de serviços
    CREATE TABLE servicos (
        id UUID PRIMARY KEY,
        nome VARCHAR(255),
        preco DECIMAL(10, 2) NOT NULL,
        duracao INTEGER NOT NULL,
        descricao TEXT NOT NULL
    );

    -- Criação da tabela de agendamentos
    CREATE TABLE agendamentos (
        id UUID PRIMARY KEY,
        "nomeCliente" VARCHAR(255) NOT NULL,
        "clienteTelefone" VARCHAR(20),
        funcionarioid UUID NOT NULL,
        servicoid UUID NOT NULL,
        "horaInicio" TIMESTAMP NOT NULL,
        "horaFim" TIMESTAMP NOT NULL,
        FOREIGN KEY (funcionarioid) REFERENCES funcionarios(id) ON DELETE CASCADE,
        FOREIGN KEY (servicoid) REFERENCES servicos(id) ON DELETE CASCADE
    );
    `;
    
    // Executa o script SQL completo como uma única transação
    await db.query(schemaSql);
    
    console.log('Inicialização do banco de dados concluída!');
    return { success: true, message: 'Banco de dados inicializado com sucesso' };
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    return { success: false, message: error.message };
  }
}

// Exporta a função para ser usada em outros arquivos
module.exports = { initDb };
