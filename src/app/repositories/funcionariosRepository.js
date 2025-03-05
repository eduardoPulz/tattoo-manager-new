const db = require('../lib/db');
const { v4: uuidv4 } = require('uuid');

const funcionariosRepository = {
  async getAll() {
    try {
      const result = await db.query(
        'SELECT * FROM funcionarios ORDER BY nome'
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const result = await db.query(
        'SELECT * FROM funcionarios WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Erro ao buscar funcionário com ID ${id}:`, error);
      throw error;
    }
  },

  async create(funcionario) {
    try {
      const id = uuidv4();
      const result = await db.query(
        `INSERT INTO funcionarios 
         (id, nome, especialidade,  telefone) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [
          id,
          funcionario.nome,
          funcionario.especialidade || '',
          funcionario.telefone || ''
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw error;
    }
  },

  async update(id, funcionario) {
    try {
      const result = await db.query(
        `UPDATE funcionarios 
         SET nome = $1, 
             especialidade = $2, 
             telefone = $4 
         WHERE id = $5 
         RETURNING *`,
        [
          funcionario.nome,
          funcionario.especialidade || '',
          funcionario.telefone || '',
          id
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Erro ao atualizar funcionário com ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await db.query('DELETE FROM funcionarios WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir funcionário com ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = funcionariosRepository;
