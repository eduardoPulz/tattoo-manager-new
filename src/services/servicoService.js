import prisma from '@/lib/prisma';

export const ServicoService = {
  async listarTodos() {
    try {
      return await prisma.servico.findMany({
        orderBy: { descricao: 'asc' }
      });
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      throw new Error('Não foi possível listar os serviços');
    }
  },

  async buscarPorId(id) {
    try {
      const servico = await prisma.servico.findUnique({
        where: { id },
        include: { agendamentos: true }
      });

      if (!servico) {
        throw new Error('Serviço não encontrado');
      }

      return servico;
    } catch (error) {
      console.error('Erro ao buscar serviço:', error);
      throw new Error('Não foi possível buscar o serviço');
    }
  },

  async criar(dados) {
    try {
      return await prisma.servico.create({
        data: {
          descricao: dados.descricao,
          duracao: dados.duracao,
          preco: dados.preco
        }
      });
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw new Error('Não foi possível criar o serviço');
    }
  },

  async atualizar(id, dados) {
    try {
      return await prisma.servico.update({
        where: { id },
        data: {
          descricao: dados.descricao,
          duracao: dados.duracao,
          preco: dados.preco
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw new Error('Não foi possível atualizar o serviço');
    }
  },

  async excluir(id) {
    try {
      await prisma.servico.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      throw new Error('Não foi possível excluir o serviço');
    }
  }
};
