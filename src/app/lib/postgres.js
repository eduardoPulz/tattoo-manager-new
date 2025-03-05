import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

// Configuração do pool de conexões
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 20, // Limitar o número máximo de conexões
  idleTimeoutMillis: 30000, // Tempo limite para conexões ociosas
  connectionTimeoutMillis: 10000, // Tempo limite para tentar conexão
};

// Adiciona SSL apenas em produção (Vercel)
if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
  console.log('Ambiente de produção detectado, configurando SSL');
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

// Criar pool de conexões
let pool;
try {
  pool = new Pool(poolConfig);
  
  // Testar a conexão
  pool.on('error', (err) => {
    console.error('Erro inesperado no pool de conexões:', err);
  });
  
  console.log('Pool de conexões PostgreSQL inicializado com sucesso');
} catch (error) {
  console.error('Erro ao inicializar o pool de conexões PostgreSQL:', error);
  throw new Error('Falha na inicialização do banco de dados');
}

// Função para inicializar as tabelas do banco de dados
export async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando criação das tabelas...');
    
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

    // Verificar se existem funcionários, caso contrário, criar um padrão
    const funcionarios = await client.query('SELECT * FROM funcionarios');
    if (funcionarios.rowCount === 0) {
      console.log('Inserindo funcionário padrão...');
      await client.query(`
        INSERT INTO funcionarios (id, nome, especialidade, telefone)
        VALUES ($1, $2, $3, $4)
      `, [uuidv4(), 'Tatuador Teste', 'Tatuador', '(11) 99999-9999']);
    }

    // Verificar se existem serviços, caso contrário, criar um padrão
    const servicos = await client.query('SELECT * FROM servicos');
    if (servicos.rowCount === 0) {
      console.log('Inserindo serviço padrão...');
      await client.query(`
        INSERT INTO servicos (id, nome, descricao, preco, duracao)
        VALUES ($1, $2, $3, $4, $5)
      `, [uuidv4(), 'Tatuagem Simples', 'Tatuagem de tamanho pequeno', 150, 60]);
    }

    console.log('Banco de dados inicializado com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    return { success: false, error };
  } finally {
    client.release();
  }
}

// Operações para funcionários
export const funcionariosDb = {
  getAll: async () => {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query('SELECT * FROM funcionarios ORDER BY nome');
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      return [];
    } finally {
      if (client) client.release();
    }
  },
  
  getById: async (id) => {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query('SELECT * FROM funcionarios WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Erro ao buscar funcionário ${id}:`, error);
      return null;
    } finally {
      if (client) client.release();
    }
  },
  
  create: async (funcionario) => {
    let client;
    try {
      client = await pool.connect();
      const id = uuidv4();
      const result = await client.query(
        'INSERT INTO funcionarios (id, nome, especialidade, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, funcionario.nome, funcionario.especialidade || '', funcionario.telefone || '']
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      return null;
    } finally {
      if (client) client.release();
    }
  },
  
  update: async (id, dados) => {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(
        'UPDATE funcionarios SET nome = $1, especialidade = $2, telefone = $3 WHERE id = $4 RETURNING *',
        [dados.nome, dados.especialidade || '', dados.telefone || '', id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário ${id}:`, error);
      return null;
    } finally {
      if (client) client.release();
    }
  },
  
  delete: async (id) => {
    let client;
    try {
      client = await pool.connect();
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
    } catch (error) {
      console.error(`Erro ao excluir funcionário ${id}:`, error);
      return { success: false, message: error.message };
    } finally {
      if (client) client.release();
    }
  }
};

// Operações para serviços
export const servicosDb = {
  getAll: async () => {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query('SELECT * FROM servicos ORDER BY nome');
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return [];
    } finally {
      if (client) client.release();
    }
  },
  
  getById: async (id) => {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query('SELECT * FROM servicos WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Erro ao buscar serviço ${id}:`, error);
      return null;
    } finally {
      if (client) client.release();
    }
  },
  
  create: async (servico) => {
    let client;
    try {
      client = await pool.connect();
      const id = uuidv4();
      const result = await client.query(
        'INSERT INTO servicos (id, nome, descricao, preco, duracao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, servico.nome, servico.descricao || '', parseFloat(servico.preco), parseInt(servico.duracao)]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      return null;
    } finally {
      if (client) client.release();
    }
  },
  
  update: async (id, dados) => {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(
        'UPDATE servicos SET nome = $1, descricao = $2, preco = $3, duracao = $4 WHERE id = $5 RETURNING *',
        [dados.nome, dados.descricao || '', parseFloat(dados.preco), parseInt(dados.duracao), id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Erro ao atualizar serviço ${id}:`, error);
      return null;
    } finally {
      if (client) client.release();
    }
  },
  
  delete: async (id) => {
    let client;
    try {
      client = await pool.connect();
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
    } catch (error) {
      console.error(`Erro ao excluir serviço ${id}:`, error);
      return { success: false, message: error.message };
    } finally {
      if (client) client.release();
    }
  }
};

// Operações para agendamentos
export const agendamentosDb = {
  getAll: async () => {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(`
        SELECT a.*, f.nome as funcionarioNome, s.nome as servicoNome, s.preco
        FROM agendamentos a
        JOIN funcionarios f ON a.funcionarioId = f.id
        JOIN servicos s ON a.servicoId = s.id
        ORDER BY a.horaInicio DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return [];
    } finally {
      if (client) client.release();
    }
  },
  
  getById: async (id) => {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(`
        SELECT a.*, f.nome as funcionarioNome, s.nome as servicoNome, s.preco
        FROM agendamentos a
        JOIN funcionarios f ON a.funcionarioId = f.id
        JOIN servicos s ON a.servicoId = s.id
        WHERE a.id = $1
      `, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Erro ao buscar agendamento ${id}:`, error);
      return null;
    } finally {
      if (client) client.release();
    }
  },
  
  create: async (agendamento) => {
    let client;
    try {
      client = await pool.connect();
      const id = uuidv4();
      await client.query(`
        INSERT INTO agendamentos (
          id, clienteNome, clienteTelefone, funcionarioId, 
          servicoId, horaInicio, horaFim, observacoes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return null;
    } finally {
      if (client) client.release();
    }
  },
  
  update: async (id, dados) => {
    let client;
    try {
      client = await pool.connect();
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
      
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Erro ao atualizar agendamento ${id}:`, error);
      return null;
    } finally {
      if (client) client.release();
    }
  },
  
  delete: async (id) => {
    let client;
    try {
      client = await pool.connect();
      await client.query('DELETE FROM agendamentos WHERE id = $1', [id]);
      return { success: true };
    } catch (error) {
      console.error(`Erro ao excluir agendamento ${id}:`, error);
      return { success: false, message: error.message };
    } finally {
      if (client) client.release();
    }
  }
};

export default {
  init: initDatabase,
  funcionarios: funcionariosDb,
  servicos: servicosDb,
  agendamentos: agendamentosDb
};
