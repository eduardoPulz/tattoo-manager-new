import prisma from '@/lib/prisma';

export const FuncionarioService = {
  async listarTodos() {
    try {
      const funcionarios = await prisma.funcionario.findMany({
        orderBy: { nome: 'asc' }
      });
      return funcionarios;
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      throw new Error('Erro ao listar funcionários');
    }
  },

  async buscarPorId(id) {
    try {
      const funcionario = await prisma.funcionario.findUnique({
        where: { id: parseInt(id) }
      });
      return funcionario;
    } catch (error) {
      console.error(`Erro ao buscar funcionário ${id}:`, error);
      throw new Error('Erro ao buscar funcionário');
    }
  },

  async criar(dados) {
    try {
      const funcionario = await prisma.funcionario.create({
        data: dados
      });
      return funcionario;
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw new Error('Erro ao criar funcionário');
    }
  },

  async atualizar(id, dados) {
    try {
      const funcionario = await prisma.funcionario.update({
        where: { id: parseInt(id) },
        data: dados
      });
      return funcionario;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário ${id}:`, error);
      throw new Error('Erro ao atualizar funcionário');
    }
  },

  async excluir(id) {
    try {
      await prisma.funcionario.delete({
        where: { id: parseInt(id) }
      });
      return true;
    } catch (error) {
      console.error(`Erro ao excluir funcionário ${id}:`, error);
      throw new Error('Erro ao excluir funcionário');
    }
  }
};
