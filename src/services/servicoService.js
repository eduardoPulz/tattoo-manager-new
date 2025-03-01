import prisma from '@/lib/prisma';

export const ServicoService = {
  async listarTodos() {
    try {
      const servicos = await prisma.servico.findMany({
        orderBy: { descricao: 'asc' }
      });
      return servicos;
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      throw new Error('Erro ao listar serviços');
    }
  },

  async buscarPorId(id) {
    try {
      const servico = await prisma.servico.findUnique({
        where: { id: parseInt(id) }
      });
      return servico;
    } catch (error) {
      console.error(`Erro ao buscar serviço ${id}:`, error);
      throw new Error('Erro ao buscar serviço');
    }
  },

  async criar(dados) {
    try {
      const servico = await prisma.servico.create({
        data: dados
      });
      return servico;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw new Error('Erro ao criar serviço');
    }
  },

  async atualizar(id, dados) {
    try {
      const servico = await prisma.servico.update({
        where: { id: parseInt(id) },
        data: dados
      });
      return servico;
    } catch (error) {
      console.error(`Erro ao atualizar serviço ${id}:`, error);
      throw new Error('Erro ao atualizar serviço');
    }
  },

  async excluir(id) {
    try {
      await prisma.servico.delete({
        where: { id: parseInt(id) }
      });
      return true;
    } catch (error) {
      console.error(`Erro ao excluir serviço ${id}:`, error);
      throw new Error('Erro ao excluir serviço');
    }
  }
};
