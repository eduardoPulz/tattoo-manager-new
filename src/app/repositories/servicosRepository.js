const db = require('../lib/db');
const { v4: uuidv4 } = require('uuid');

const servicosRepository = {
  async getAll() {
    try {
      const result = await db.query(
        'SELECT * FROM servicos ORDER BY nome'
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const result = await db.query(
        'SELECT * FROM servicos WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Erro ao buscar serviço com ID ${id}:`, error);
      throw error;
    }
  },

  async create(servico) {
    try {
      const id = uuidv4();
      const result = await db.query(
        `INSERT INTO servicos 
         (id, nome, preco, duracao, descricao) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [
          id,
          servico.nome,
          servico.preco,
          servico.duracao,
          servico.descricao
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw error;
    }
  },

  async update(id, servico) {
    try {
      const result = await db.query(
        `UPDATE servicos 
         SET nome = $1, 
             preco = $2, 
             duracao = $3, 
             descricao = $4 
         WHERE id = $5 
         RETURNING *`,
        [
          servico.nome,
          servico.preco,
          servico.duracao,
          servico.descricao,
          id
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Erro ao atualizar serviço com ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await db.query('DELETE FROM servicos WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir serviço com ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = servicosRepository;
