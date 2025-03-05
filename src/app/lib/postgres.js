const pg = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv/config');

// Criar pool de conexões
let pool;

try {
  // Configuração simples do pool
  const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
  
  console.log('Conectando ao banco de dados...');
  pool = new pg.Pool(poolConfig);
  console.log('Conexão com o banco de dados estabelecida');
} catch (error) {
  console.error('Erro ao conectar ao banco de dados:', error);
  throw error;
}

// Função para inicializar as tabelas do banco de dados
async function initDatabase() {
  let client;
  
  try {
    console.log('Iniciando criação das tabelas...');
    client = await pool.connect();
    
    // Criar tabela de funcionários
    await client.query(`
      CREATE TABLE IF NOT EXISTS funcionarios (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        especialidade TEXT NOT NULL,
        telefone TEXT
      )
    `);

    // Criar tabela de serviços
    await client.query(`
      CREATE TABLE IF NOT EXISTS servicos (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco DECIMAL(10, 2) NOT NULL,
        duracao INTEGER NOT NULL
      )
    `);

    // Criar tabela de agendamentos
    await client.query(`
      CREATE TABLE IF NOT EXISTS agendamentos (
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
    
    console.log('Tabelas criadas com sucesso');
    return true;
  } catch (error) {
    console.error('Erro durante a inicialização do banco de dados:', error);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// Função auxiliar para executar consultas
async function executeQuery(queryFn) {
  let client;
  try {
    client = await pool.connect();
    return await queryFn(client);
  } catch (error) {
    console.error('Erro ao executar consulta:', error);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// Operações para funcionários
const funcionariosDb = {
  getAll: async () => {
    return executeQuery(async (client) => {
      const result = await client.query('SELECT * FROM funcionarios ORDER BY nome');
      return result.rows;
    });
  },
  
  getById: async (id) => {
    return executeQuery(async (client) => {
      const result = await client.query('SELECT * FROM funcionarios WHERE id = $1', [id]);
      return result.rows[0] || null;
    });
  },
  
  create: async (funcionario) => {
    return executeQuery(async (client) => {
      const id = uuidv4();
      const result = await client.query(
        'INSERT INTO funcionarios (id, nome, especialidade, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, funcionario.nome, funcionario.especialidade || '', funcionario.telefone || '']
      );
      return result.rows[0];
    });
  },
  
  update: async (id, dados) => {
    return executeQuery(async (client) => {
      const result = await client.query(
        'UPDATE funcionarios SET nome = $1, especialidade = $2, telefone = $3 WHERE id = $4 RETURNING *',
        [dados.nome, dados.especialidade || '', dados.telefone || '', id]
      );
      return result.rows[0];
    });
  },
  
  delete: async (id) => {
    return executeQuery(async (client) => {
      await client.query('DELETE FROM funcionarios WHERE id = $1', [id]);
      return { success: true };
    });
  }
};

// Operações para serviços
const servicosDb = {
  getAll: async () => {
    return executeQuery(async (client) => {
      const result = await client.query('SELECT * FROM servicos ORDER BY nome');
      return result.rows;
    });
  },
  
  getById: async (id) => {
    return executeQuery(async (client) => {
      const result = await client.query('SELECT * FROM servicos WHERE id = $1', [id]);
      return result.rows[0] || null;
    });
  },
  
  create: async (servico) => {
    return executeQuery(async (client) => {
      const id = uuidv4();
      const result = await client.query(
        'INSERT INTO servicos (id, nome, descricao, preco, duracao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, servico.nome, servico.descricao || '', parseFloat(servico.preco), parseInt(servico.duracao)]
      );
      return result.rows[0];
    });
  },
  
  update: async (id, dados) => {
    return executeQuery(async (client) => {
      const result = await client.query(
        'UPDATE servicos SET nome = $1, descricao = $2, preco = $3, duracao = $4 WHERE id = $5 RETURNING *',
        [dados.nome, dados.descricao || '', parseFloat(dados.preco), parseInt(dados.duracao), id]
      );
      return result.rows[0];
    });
  },
  
  delete: async (id) => {
    return executeQuery(async (client) => {
      await client.query('DELETE FROM servicos WHERE id = $1', [id]);
      return { success: true };
    });
  }
};

// Operações para agendamentos
const agendamentosDb = {
  getAll: async () => {
    return executeQuery(async (client) => {
      const result = await client.query(`
        SELECT a.*, f.nome as funcionarioNome, s.nome as servicoNome, s.preco
        FROM agendamentos a
        JOIN funcionarios f ON a.funcionarioId = f.id
        JOIN servicos s ON a.servicoId = s.id
        ORDER BY a.horaInicio DESC
      `);
      return result.rows;
    });
  },
  
  getById: async (id) => {
    return executeQuery(async (client) => {
      const result = await client.query(`
        SELECT a.*, f.nome as funcionarioNome, s.nome as servicoNome, s.preco
        FROM agendamentos a
        JOIN funcionarios f ON a.funcionarioId = f.id
        JOIN servicos s ON a.servicoId = s.id
        WHERE a.id = $1
      `, [id]);
      return result.rows[0] || null;
    });
  },
  
  create: async (agendamento) => {
    return executeQuery(async (client) => {
      const id = uuidv4();
      await client.query(`
        INSERT INTO agendamentos (
          id, clienteNome, clienteTelefone, funcionarioId, 
          servicoId, horaInicio, horaFim, observacoes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        id,
        agendamento.clienteNome,
        agendamento.clienteTelefone,
        agendamento.funcionarioId,
        agendamento.servicoId,
        agendamento.horaInicio,
        agendamento.horaFim,
        agendamento.observacoes || ''
      ]);
      
      const result = await client.query(`
        SELECT a.*, f.nome as funcionarioNome, s.nome as servicoNome, s.preco
        FROM agendamentos a
        JOIN funcionarios f ON a.funcionarioId = f.id
        JOIN servicos s ON a.servicoId = s.id
        WHERE a.id = $1
      `, [id]);
      
      return result.rows[0];
    });
  },
  
  update: async (id, dados) => {
    return executeQuery(async (client) => {
      await client.query(`
        UPDATE agendamentos 
        SET clienteNome = $1, clienteTelefone = $2, funcionarioId = $3, 
            servicoId = $4, horaInicio = $5, horaFim = $6, observacoes = $7
        WHERE id = $8
      `, [
        dados.clienteNome,
        dados.clienteTelefone,
        dados.funcionarioId,
        dados.servicoId,
        dados.horaInicio,
        dados.horaFim,
        dados.observacoes || '',
        id
      ]);
      
      const result = await client.query(`
        SELECT a.*, f.nome as funcionarioNome, s.nome as servicoNome, s.preco
        FROM agendamentos a
        JOIN funcionarios f ON a.funcionarioId = f.id
        JOIN servicos s ON a.servicoId = s.id
        WHERE a.id = $1
      `, [id]);
      
      return result.rows[0];
    });
  },
  
  delete: async (id) => {
    return executeQuery(async (client) => {
      await client.query('DELETE FROM agendamentos WHERE id = $1', [id]);
      return { success: true };
    });
  }
};

module.exports = {
  initDatabase,
  funcionariosDb,
  servicosDb,
  agendamentosDb
};
