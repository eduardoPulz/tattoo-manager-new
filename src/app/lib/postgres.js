import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

// Criar pool de conexões
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Função para inicializar as tabelas do banco de dados
export async function initDatabase() {
  const client = await pool.connect();
  
  try {
    // Criar tabela de funcionários
    await client.query(`
      CREATE TABLE IF NOT EXISTS funcionarios (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        cargo TEXT NOT NULL,
        email TEXT
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

    // Verificar se existem funcionários, caso contrário, criar um padrão
    const funcionarios = await client.query('SELECT * FROM funcionarios');
    if (funcionarios.rowCount === 0) {
      await client.query(`
        INSERT INTO funcionarios (id, nome, cargo, email)
        VALUES ($1, $2, $3, $4)
      `, [uuidv4(), 'Tatuador Teste', 'Tatuador', 'teste@exemplo.com']);
    }

    // Verificar se existem serviços, caso contrário, criar um padrão
    const servicos = await client.query('SELECT * FROM servicos');
    if (servicos.rowCount === 0) {
      await client.query(`
        INSERT INTO servicos (id, nome, descricao, preco, duracao)
        VALUES ($1, $2, $3, $4, $5)
      `, [uuidv4(), 'Tatuagem Simples', 'Tatuagem de tamanho pequeno', 150, 60]);
    }

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
    try {
      const result = await pool.query('SELECT * FROM funcionarios ORDER BY nome');
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      return [];
    }
  },
  
  getById: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM funcionarios WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Erro ao buscar funcionário ${id}:`, error);
      return null;
    }
  },
  
  create: async (funcionario) => {
    try {
      const id = uuidv4();
      const result = await pool.query(
        'INSERT INTO funcionarios (id, nome, cargo, email) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, funcionario.nome, funcionario.cargo || '', funcionario.email || '']
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      return null;
    }
  },
  
  update: async (id, dados) => {
    try {
      const result = await pool.query(
        'UPDATE funcionarios SET nome = $1, cargo = $2, email = $3 WHERE id = $4 RETURNING *',
        [dados.nome, dados.cargo || '', dados.email || '', id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário ${id}:`, error);
      return null;
    }
  },
  
  delete: async (id) => {
    try {
      // Verificar se existem agendamentos relacionados
      const agendamentos = await pool.query(
        'SELECT COUNT(*) FROM agendamentos WHERE funcionarioId = $1',
        [id]
      );
      
      if (parseInt(agendamentos.rows[0].count) > 0) {
        return { success: false, message: 'Funcionário possui agendamentos' };
      }
      
      await pool.query('DELETE FROM funcionarios WHERE id = $1', [id]);
      return { success: true };
    } catch (error) {
      console.error(`Erro ao excluir funcionário ${id}:`, error);
      return { success: false, message: error.message };
    }
  }
};

// Operações para serviços
export const servicosDb = {
  getAll: async () => {
    try {
      const result = await pool.query('SELECT * FROM servicos ORDER BY nome');
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return [];
    }
  },
  
  getById: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM servicos WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Erro ao buscar serviço ${id}:`, error);
      return null;
    }
  },
  
  create: async (servico) => {
    try {
      const id = uuidv4();
      const result = await pool.query(
        'INSERT INTO servicos (id, nome, descricao, preco, duracao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, servico.nome, servico.descricao || '', parseFloat(servico.preco), parseInt(servico.duracao)]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      return null;
    }
  },
  
  update: async (id, dados) => {
    try {
      const result = await pool.query(
        'UPDATE servicos SET nome = $1, descricao = $2, preco = $3, duracao = $4 WHERE id = $5 RETURNING *',
        [dados.nome, dados.descricao || '', parseFloat(dados.preco), parseInt(dados.duracao), id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Erro ao atualizar serviço ${id}:`, error);
      return null;
    }
  },
  
  delete: async (id) => {
    try {
      // Verificar se existem agendamentos relacionados
      const agendamentos = await pool.query(
        'SELECT COUNT(*) FROM agendamentos WHERE servicoId = $1',
        [id]
      );
      
      if (parseInt(agendamentos.rows[0].count) > 0) {
        return { success: false, message: 'Serviço possui agendamentos' };
      }
      
      await pool.query('DELETE FROM servicos WHERE id = $1', [id]);
      return { success: true };
    } catch (error) {
      console.error(`Erro ao excluir serviço ${id}:`, error);
      return { success: false, message: error.message };
    }
  }
};

// Operações para agendamentos
export const agendamentosDb = {
  getAll: async () => {
    try {
      const result = await pool.query(`
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
    }
  },
  
  getById: async (id) => {
    try {
      const result = await pool.query(`
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
    }
  },
  
  create: async (agendamento) => {
    try {
      const id = uuidv4();
      await pool.query(`
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
      const result = await pool.query(`
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
    }
  },
  
  update: async (id, dados) => {
    try {
      await pool.query(`
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
      const result = await pool.query(`
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
    }
  },
  
  delete: async (id) => {
    try {
      await pool.query('DELETE FROM agendamentos WHERE id = $1', [id]);
      return { success: true };
    } catch (error) {
      console.error(`Erro ao excluir agendamento ${id}:`, error);
      return { success: false, message: error.message };
    }
  }
};

export default {
  init: initDatabase,
  funcionarios: funcionariosDb,
  servicos: servicosDb,
  agendamentos: agendamentosDb
};
