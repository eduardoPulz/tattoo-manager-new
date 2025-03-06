const db = require('../lib/db');
const { v4: uuidv4 } = require('uuid');

const agendamentosRepository = {
  async getAll() {
    try {
      const result = await db.query(`
        SELECT 
          a.*,
          f.nome AS "funcionarioNome",
          s.nome AS "servicoNome",
          s.descricao AS "descricaoServico"
        FROM 
          agendamentos a
          LEFT JOIN funcionarios f ON a.funcionarioid = f.id
          LEFT JOIN servicos s ON a.servicoid = s.id
        ORDER BY 
          a."horaInicio" DESC
      `);
      
      // Padronizar os IDs para que o frontend os encontre corretamente
      const agendamentosPadronizados = result.rows.map(agendamento => ({
        ...agendamento,
        funcionarioId: agendamento.funcionarioid,
        servicoId: agendamento.servicoid
      }));
      
      return agendamentosPadronizados;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const result = await db.query(`
        SELECT 
          a.*,
          f.nome AS "funcionarioNome",
          s.nome AS "servicoNome",
          s.descricao AS "descricaoServico"
        FROM 
          agendamentos a
          LEFT JOIN funcionarios f ON a.funcionarioid = f.id
          LEFT JOIN servicos s ON a.servicoid = s.id
        WHERE 
          a.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error(`Erro ao buscar agendamento com ID ${id}:`, error);
      throw error;
    }
  },

  async create(agendamento) {
    try {
      // Validação de campos obrigatórios
      if (!agendamento.nomeCliente) {
        throw new Error('Nome do cliente é obrigatório');
      }
      
      if (!agendamento.funcionarioId) {
        throw new Error('Funcionário é obrigatório');
      }
      
      if (!agendamento.servicoId) {
        throw new Error('Serviço é obrigatório');
      }
      
      if (!agendamento.horaInicio || !agendamento.horaFim) {
        throw new Error('Horário de início e fim são obrigatórios');
      }
      
      const id = uuidv4();
      const result = await db.query(
        `INSERT INTO agendamentos 
         (id, "nomeCliente", "clienteTelefone", funcionarioid, servicoid, "horaInicio", "horaFim") 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [
          id,
          agendamento.nomeCliente,
          agendamento.clienteTelefone || '',
          agendamento.funcionarioId,
          agendamento.servicoId,
          agendamento.horaInicio,
          agendamento.horaFim
        ]
      );
      
      // Buscar o agendamento com os dados do funcionário e serviço
      const agendamentoCompleto = await this.getById(id);
      
      // Padronizar os IDs para que o frontend os encontre corretamente
      const resposta = {
        ...agendamentoCompleto,
        funcionarioId: agendamentoCompleto.funcionarioid,
        servicoId: agendamentoCompleto.servicoid
      };
      
      return resposta;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  async update(id, agendamento) {
    try {
      // Validação de campos obrigatórios
      if (!agendamento.nomeCliente) {
        throw new Error('Nome do cliente é obrigatório');
      }
      
      if (!agendamento.funcionarioId) {
        throw new Error('Funcionário é obrigatório');
      }
      
      if (!agendamento.servicoId) {
        throw new Error('Serviço é obrigatório');
      }
      
      if (!agendamento.horaInicio || !agendamento.horaFim) {
        throw new Error('Horário de início e fim são obrigatórios');
      }
      
      const result = await db.query(
        `UPDATE agendamentos 
         SET "nomeCliente" = $1, 
             "clienteTelefone" = $2, 
             funcionarioid = $3, 
             servicoid = $4, 
             "horaInicio" = $5, 
             "horaFim" = $6 
         WHERE id = $7 
         RETURNING *`,
        [
          agendamento.nomeCliente,
          agendamento.clienteTelefone || '',
          agendamento.funcionarioId,
          agendamento.servicoId,
          agendamento.horaInicio,
          agendamento.horaFim,
          id
        ]
      );
      
      // Buscar o agendamento com os dados do funcionário e serviço
      const agendamentoCompleto = await this.getById(id);
      
      // Padronizar os IDs para que o frontend os encontre corretamente
      const resposta = {
        ...agendamentoCompleto,
        funcionarioId: agendamentoCompleto.funcionarioid,
        servicoId: agendamentoCompleto.servicoid
      };
      
      return resposta;
    } catch (error) {
      console.error(`Erro ao atualizar agendamento com ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const result = await db.query(
        'DELETE FROM agendamentos WHERE "id" = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Erro ao excluir agendamento com ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = agendamentosRepository;
