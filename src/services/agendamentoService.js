import prisma from '@/lib/prisma';

export const AgendamentoService = {
  async listarTodos() {
    try {
      const agendamentos = await prisma.agendamento.findMany({
        include: {
          funcionario: true,
          servico: true
        },
        orderBy: { data: 'asc' }
      });
      return agendamentos;
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      throw new Error('Erro ao listar agendamentos');
    }
  },

  async buscarPorId(id) {
    try {
      const agendamento = await prisma.agendamento.findUnique({
        where: { id: parseInt(id) },
        include: {
          funcionario: true,
          servico: true
        }
      });
      return agendamento;
    } catch (error) {
      console.error(`Erro ao buscar agendamento ${id}:`, error);
      throw new Error('Erro ao buscar agendamento');
    }
  },

  async criar(dados) {
    try {
      const agendamento = await prisma.agendamento.create({
        data: {
          data: new Date(dados.data),
          nomeCliente: dados.nomeCliente,
          funcionarioId: parseInt(dados.funcionarioId),
          servicoId: parseInt(dados.servicoId)
        },
        include: {
          funcionario: true,
          servico: true
        }
      });
      return agendamento;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw new Error('Erro ao criar agendamento');
    }
  },

  async atualizar(id, dados) {
    try {
      const agendamento = await prisma.agendamento.update({
        where: { id: parseInt(id) },
        data: {
          data: new Date(dados.data),
          nomeCliente: dados.nomeCliente,
          funcionarioId: parseInt(dados.funcionarioId),
          servicoId: parseInt(dados.servicoId)
        },
        include: {
          funcionario: true,
          servico: true
        }
      });
      return agendamento;
    } catch (error) {
      console.error(`Erro ao atualizar agendamento ${id}:`, error);
      throw new Error('Erro ao atualizar agendamento');
    }
  },

  async excluir(id) {
    try {
      await prisma.agendamento.delete({
        where: { id: parseInt(id) }
      });
      return true;
    } catch (error) {
      console.error(`Erro ao excluir agendamento ${id}:`, error);
      throw new Error('Erro ao excluir agendamento');
    }
  }
};
