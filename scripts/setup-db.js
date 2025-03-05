require('dotenv').config();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Configuração do pool de conexões
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

// Adiciona SSL apenas em produção (Vercel)
if (process.env.VERCEL === '1') {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

// Criar pool de conexões
const pool = new Pool(poolConfig);

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando setup do banco de dados...');
    
    // Remover tabelas existentes para garantir uma configuração limpa
    console.log('Removendo tabelas existentes...');
    await client.query('DROP TABLE IF EXISTS agendamentos');
    await client.query('DROP TABLE IF EXISTS funcionarios');
    await client.query('DROP TABLE IF EXISTS servicos');
    
    // Criar tabela de funcionários
    console.log('Criando tabela funcionarios...');
    await client.query(`
      CREATE TABLE funcionarios (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        especialidade TEXT NOT NULL,
        telefone TEXT
      )
    `);
    
    // Criar tabela de serviços
    console.log('Criando tabela servicos...');
    await client.query(`
      CREATE TABLE servicos (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco DECIMAL(10, 2) NOT NULL,
        duracao INTEGER NOT NULL
      )
    `);
    
    // Criar tabela de agendamentos
    console.log('Criando tabela agendamentos...');
    await client.query(`
      CREATE TABLE agendamentos (
        id TEXT PRIMARY KEY,
        clienteNome TEXT NOT NULL,
        clienteTelefone TEXT NOT NULL,
        funcionarioId TEXT NOT NULL,
        servicoId TEXT NOT NULL,
        horaInicio TIMESTAMP NOT NULL,
        horaFim TIMESTAMP NOT NULL,
        observacoes TEXT
      )
    `);
    
    // Inserir dados iniciais
    console.log('Inserindo dados iniciais...');
    
    // Funcionários
    const funcionarioId1 = uuidv4();
    const funcionarioId2 = uuidv4();
    
    await client.query(`
      INSERT INTO funcionarios (id, nome, especialidade, telefone)
      VALUES 
        ($1, 'João Silva', 'Tatuador', '(11) 98765-4321'),
        ($2, 'Maria Oliveira', 'Piercer', '(11) 91234-5678')
    `, [funcionarioId1, funcionarioId2]);
    
    // Serviços
    const servicoId1 = uuidv4();
    const servicoId2 = uuidv4();
    const servicoId3 = uuidv4();
    
    await client.query(`
      INSERT INTO servicos (id, nome, descricao, preco, duracao)
      VALUES 
        ($1, 'Tatuagem Pequena', 'Tatuagem de até 10cm', 150.00, 60),
        ($2, 'Tatuagem Média', 'Tatuagem de 10cm a 20cm', 300.00, 120),
        ($3, 'Piercing', 'Aplicação de piercing', 80.00, 30)
    `, [servicoId1, servicoId2, servicoId3]);
    
    // Agendamentos (exemplos)
    const dataAtual = new Date();
    const amanha = new Date(dataAtual);
    amanha.setDate(dataAtual.getDate() + 1);
    
    const proximaSemana = new Date(dataAtual);
    proximaSemana.setDate(dataAtual.getDate() + 7);
    
    const horaInicio1 = new Date(amanha.setHours(10, 0, 0));
    const horaFim1 = new Date(amanha.setHours(11, 0, 0));
    
    const horaInicio2 = new Date(proximaSemana.setHours(14, 0, 0));
    const horaFim2 = new Date(proximaSemana.setHours(16, 0, 0));
    
    await client.query(`
      INSERT INTO agendamentos (id, clienteNome, clienteTelefone, funcionarioId, servicoId, horaInicio, horaFim, observacoes)
      VALUES 
        ($1, 'Carlos Pereira', '(11) 99999-8888', $2, $3, $4, $5, 'Primeira vez'),
        ($6, 'Ana Souza', '(11) 97777-6666', $7, $8, $9, $10, 'Segunda tatuagem')
    `, [
      uuidv4(), funcionarioId1, servicoId1, horaInicio1, horaFim1,
      uuidv4(), funcionarioId2, servicoId2, horaInicio2, horaFim2
    ]);
    
    console.log('Setup do banco de dados concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o setup do banco de dados:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
