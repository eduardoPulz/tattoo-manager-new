import prisma from '@/lib/prisma';

export const AgendamentoService = {
  async listarTodos() {
    try {
      return await prisma.agendamento.findMany({
        include: {
          funcionario: true,
          servico: true
        },
        orderBy: { horaInicio: 'asc' }
      });
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      throw new Error('Não foi possível listar os agendamentos');
    }
  },

  async buscarPorId(id) {
    try {
      const agendamento = await prisma.agendamento.findUnique({
        where: { id },
        include: {
          funcionario: true,
          servico: true
        }
      });

      if (!agendamento) {
        throw new Error('Agendamento não encontrado');
      }

      return agendamento;
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      throw new Error('Não foi possível buscar o agendamento');
    }
  },

  async criar(dados) {
    try {
      // Verifica disponibilidade do funcionário
      const conflito = await prisma.agendamento.findFirst({
        where: {
          funcionarioId: dados.funcionarioId,
          OR: [
            {
              AND: [
                { horaInicio: { lte: dados.horaInicio } },
                { horaFim: { gt: dados.horaInicio } }
              ]
            },
            {
              AND: [
                { horaInicio: { lt: dados.horaFim } },
                { horaFim: { gte: dados.horaFim } }
              ]
            }
          ]
        }
      });

      if (conflito) {
        throw new Error('Horário não disponível para este funcionário');
      }

      return await prisma.agendamento.create({
        data: {
          horaInicio: dados.horaInicio,
          horaFim: dados.horaFim,
          nomeCliente: dados.nomeCliente,
          funcionarioId: dados.funcionarioId,
          servicoId: dados.servicoId
        },
        include: {
          funcionario: true,
          servico: true
        }
      });
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw new Error(error.message || 'Não foi possível criar o agendamento');
    }
  },

  async atualizar(id, dados) {
    try {
      return await prisma.agendamento.update({
        where: { id },
        data: {
          horaInicio: dados.horaInicio,
          horaFim: dados.horaFim,
          nomeCliente: dados.nomeCliente,
          funcionarioId: dados.funcionarioId,
          servicoId: dados.servicoId
        },
        include: {
          funcionario: true,
          servico: true
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw new Error('Não foi possível atualizar o agendamento');
    }
  },

  async excluir(id) {
    try {
      await prisma.agendamento.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      throw new Error('Não foi possível excluir o agendamento');
    }
  }
};
