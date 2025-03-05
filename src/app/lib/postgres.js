import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

// Função para criar o pool de conexões
const createPool = () => {
  console.log('Inicializando conexão com o banco de dados...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VERCEL:', process.env.VERCEL);
  
  // Configuração do pool de conexões
  const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    max: 10, // Limitar o número máximo de conexões
    idleTimeoutMillis: 30000, // Tempo limite para conexões ociosas
    connectionTimeoutMillis: 10000, // Tempo limite para tentar conexão
  };

  // Adiciona SSL em produção
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
    console.log('Ambiente de produção detectado, configurando SSL');
    poolConfig.ssl = {
      rejectUnauthorized: false
    };
  }

  console.log('Configuração do pool:', JSON.stringify(poolConfig, null, 2));
  
  try {
    const pool = new Pool(poolConfig);
    
    // Testar a conexão
    pool.on('error', (err) => {
      console.error('Erro inesperado no pool de conexões:', err);
    });
    
    pool.on('connect', (client) => {
      console.log('Nova conexão estabelecida com o banco de dados');
    });
    
    console.log('Pool de conexões PostgreSQL inicializado com sucesso');
    return pool;
  } catch (error) {
    console.error('Erro ao inicializar o pool de conexões PostgreSQL:', error);
    throw new Error('Falha na inicialização do banco de dados: ' + error.message);
  }
};

// Criar pool de conexões
let pool;

try {
  pool = createPool();
} catch (error) {
  console.error('Erro fatal ao criar pool de conexões:', error);
  // Em produção, não queremos que a aplicação falhe completamente
  // Vamos criar um pool vazio que será recriado na próxima tentativa
  pool = {
    connect: async () => {
      console.log('Tentando recriar o pool de conexões...');
      try {
        const newPool = createPool();
        pool = newPool;
        return newPool.connect();
      } catch (error) {
        console.error('Falha ao recriar o pool de conexões:', error);
        throw error;
      }
    },
    query: async (...args) => {
      console.log('Tentando recriar o pool de conexões para query...');
      try {
        const newPool = createPool();
        pool = newPool;
        return newPool.query(...args);
      } catch (error) {
        console.error('Falha ao recriar o pool de conexões para query:', error);
        throw error;
      }
    },
    end: async () => {
      console.log('Pool não inicializado, nada para encerrar');
      return Promise.resolve();
    }
  };
}

// Função para inicializar as tabelas do banco de dados
export async function initDatabase() {
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
    console.log('Tabela funcionarios criada ou já existente');

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
    console.log('Tabela servicos criada ou já existente');

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
    console.log('Tabela agendamentos criada ou já existente');
    
    console.log('Inicialização do banco de dados concluída com sucesso');
  } catch (error) {
    console.error('Erro durante a inicialização do banco de dados:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
      console.log('Cliente liberado após inicialização do banco de dados');
    }
  }
}

// Função auxiliar para executar consultas com tratamento de erros
async function executeQuery(queryFn) {
  let client;
  try {
    client = await pool.connect();
    return await queryFn(client);
  } catch (error) {
    console.error('Erro ao executar consulta:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Operações para funcionários
export const funcionariosDb = {
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
      // Verificar se existem agendamentos relacionados
      const agendamentos = await client.query(
        'SELECT COUNT(*) FROM agendamentos WHERE funcionarioId = $1',
        [id]
      );
      
      if (parseInt(agendamentos.rows[0].count) > 0) {
        return { success: false, message: 'Funcionário possui agendamentos' };
      }
      
      await client.query('DELETE FROM funcionarios WHERE id = $1', [id]);
      return { success: true };
    });
  }
};

// Operações para serviços
export const servicosDb = {
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
      // Verificar se existem agendamentos relacionados
      const agendamentos = await client.query(
        'SELECT COUNT(*) FROM agendamentos WHERE servicoId = $1',
        [id]
      );
      
      if (parseInt(agendamentos.rows[0].count) > 0) {
        return { success: false, message: 'Serviço possui agendamentos' };
      }
      
      await client.query('DELETE FROM servicos WHERE id = $1', [id]);
      return { success: true };
    });
  }
};

// Operações para agendamentos
export const agendamentosDb = {
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
      
      // Buscar o agendamento completo
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
      
      // Buscar o agendamento atualizado
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

export default {
  init: initDatabase,
  funcionarios: funcionariosDb,
  servicos: servicosDb,
  agendamentos: agendamentosDb
};
