const db = require('../lib/db');
const { v4: uuidv4 } = require('uuid');

const agendamentosRepository = {
  async getAll() {
    try {
      const result = await db.query(
        'SELECT * FROM agendamentos ORDER BY horaInicio DESC'
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const result = await db.query(
        'SELECT * FROM agendamentos WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Erro ao buscar agendamento com ID ${id}:`, error);
      throw error;
    }
  },

  async create(agendamento) {
    try {
      const id = uuidv4();
      const result = await db.query(
        `INSERT INTO agendamentos 
         (id, nomeCliente, clienteTelefone, funcionarioId, servicoId, horaInicio, horaFim) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [
          id,
          agendamento.nomeCliente,
          agendamento.clienteTelefone,
          agendamento.funcionarioId,
          agendamento.servicoId,
          agendamento.horaInicio,
          agendamento.horaFim
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  async update(id, agendamento) {
    try {
      const result = await db.query(
        `UPDATE agendamentos 
         SET nomeCliente = $1, 
             clienteTelefone = $2, 
             funcionarioId = $3, 
             servicoId = $4, 
             horaInicio = $5, 
             horaFim = $6 
         WHERE id = $7 
         RETURNING *`,
        [
          agendamento.nomeCliente,
          agendamento.clienteTelefone,
          agendamento.funcionarioId,
          agendamento.servicoId,
          agendamento.horaInicio,
          agendamento.horaFim,
          id
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Erro ao atualizar agendamento com ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await db.query('DELETE FROM agendamentos WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir agendamento com ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = agendamentosRepository;
