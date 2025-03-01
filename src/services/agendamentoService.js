import prisma from '@/lib/prisma';

// Cache para armazenar resultados e reduzir consultas ao banco
const cache = {
  agendamentos: null,
  timestamp: 0,
  ttl: 30000 // 30 segundos em milissegundos (menor para agendamentos que mudam com frequência)
};

export const AgendamentoService = {
  async listarTodos() {
    try {
      // Verifica se há dados em cache válidos
      const agora = Date.now();
      if (cache.agendamentos && (agora - cache.timestamp < cache.ttl)) {
        return cache.agendamentos;
      }

      // Busca dados do banco e atualiza o cache
      const agendamentos = await prisma.agendamento.findMany({
        include: {
          funcionario: true,
          servico: true
        },
        orderBy: { horaInicio: 'asc' }
      });
      
      // Atualiza o cache
      cache.agendamentos = agendamentos;
      cache.timestamp = agora;
      
      return agendamentos;
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      throw new Error('Não foi possível listar os agendamentos');
    }
  },

  async buscarPorId(id) {
    try {
      // Tenta encontrar no cache primeiro
      if (cache.agendamentos) {
        const agendamentoCache = cache.agendamentos.find(a => a.id === id);
        if (agendamentoCache) {
          return agendamentoCache;
        }
      }

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
      // Verificar se o funcionário está disponível no horário
      const agendamentosConflitantes = await prisma.agendamento.findMany({
        where: {
          funcionarioId: dados.funcionarioId,
          OR: [
            {
              AND: [
                { horaInicio: { lte: new Date(dados.horaInicio) } },
                { horaFim: { gt: new Date(dados.horaInicio) } }
              ]
            },
            {
              AND: [
                { horaInicio: { lt: new Date(dados.horaFim) } },
                { horaFim: { gte: new Date(dados.horaFim) } }
              ]
            }
          ]
        }
      });

      if (agendamentosConflitantes.length > 0) {
        throw new Error('O funcionário já possui um agendamento neste horário');
      }

      const novoAgendamento = await prisma.agendamento.create({
        data: {
          horaInicio: new Date(dados.horaInicio),
          horaFim: new Date(dados.horaFim),
          nomeCliente: dados.nomeCliente,
          funcionarioId: dados.funcionarioId,
          servicoId: dados.servicoId
        },
        include: {
          funcionario: true,
          servico: true
        }
      });
      
      // Invalida o cache
      cache.agendamentos = null;
      
      return novoAgendamento;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw new Error(error.message || 'Não foi possível criar o agendamento');
    }
  },

  async atualizar(id, dados) {
    try {
      // Verificar se o funcionário está disponível no horário (excluindo o próprio agendamento)
      const agendamentosConflitantes = await prisma.agendamento.findMany({
        where: {
          id: { not: id },
          funcionarioId: dados.funcionarioId,
          OR: [
            {
              AND: [
                { horaInicio: { lte: new Date(dados.horaInicio) } },
                { horaFim: { gt: new Date(dados.horaInicio) } }
              ]
            },
            {
              AND: [
                { horaInicio: { lt: new Date(dados.horaFim) } },
                { horaFim: { gte: new Date(dados.horaFim) } }
              ]
            }
          ]
        }
      });

      if (agendamentosConflitantes.length > 0) {
        throw new Error('O funcionário já possui um agendamento neste horário');
      }

      const agendamentoAtualizado = await prisma.agendamento.update({
        where: { id },
        data: {
          horaInicio: new Date(dados.horaInicio),
          horaFim: new Date(dados.horaFim),
          nomeCliente: dados.nomeCliente,
          funcionarioId: dados.funcionarioId,
          servicoId: dados.servicoId
        },
        include: {
          funcionario: true,
          servico: true
        }
      });
      
      // Invalida o cache
      cache.agendamentos = null;
      
      return agendamentoAtualizado;
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw new Error(error.message || 'Não foi possível atualizar o agendamento');
    }
  },

  async excluir(id) {
    try {
      await prisma.agendamento.delete({
        where: { id }
      });
      
      // Invalida o cache
      cache.agendamentos = null;
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      throw new Error('Não foi possível excluir o agendamento');
    }
  }
};
