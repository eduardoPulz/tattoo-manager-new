import prisma from '@/lib/prisma';

export const FuncionarioService = {
  async listarTodos() {
    try {
      return await prisma.funcionario.findMany({
        orderBy: { nome: 'asc' }
      });
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      throw new Error('Não foi possível listar os funcionários');
    }
  },

  async buscarPorId(id) {
    try {
      const funcionario = await prisma.funcionario.findUnique({
        where: { id },
        include: { agendamentos: true }
      });

      if (!funcionario) {
        throw new Error('Funcionário não encontrado');
      }

      return funcionario;
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error);
      throw new Error('Não foi possível buscar o funcionário');
    }
  },

  async criar(dados) {
    try {
      return await prisma.funcionario.create({
        data: {
          nome: dados.nome,
          especialidade: dados.especialidade,
          telefone: dados.telefone
        }
      });
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw new Error('Não foi possível criar o funcionário');
    }
  },

  async atualizar(id, dados) {
    try {
      return await prisma.funcionario.update({
        where: { id },
        data: {
          nome: dados.nome,
          especialidade: dados.especialidade,
          telefone: dados.telefone
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      throw new Error('Não foi possível atualizar o funcionário');
    }
  },

  async excluir(id) {
    try {
      await prisma.funcionario.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      throw new Error('Não foi possível excluir o funcionário');
    }
  }
};
