import prisma from '@/lib/prisma';

// Cache para armazenar resultados e reduzir consultas ao banco
const cache = {
  servicos: null,
  timestamp: 0,
  ttl: 60000 // 1 minuto em milissegundos
};

export const ServicoService = {
  async listarTodos() {
    try {
      // Verifica se há dados em cache válidos
      const agora = Date.now();
      if (cache.servicos && (agora - cache.timestamp < cache.ttl)) {
        return cache.servicos;
      }

      // Busca dados do banco e atualiza o cache
      const servicos = await prisma.servico.findMany({
        orderBy: { descricao: 'asc' }
      });
      
      // Atualiza o cache
      cache.servicos = servicos;
      cache.timestamp = agora;
      
      return servicos;
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      throw new Error('Não foi possível listar os serviços');
    }
  },

  async buscarPorId(id) {
    try {
      // Tenta encontrar no cache primeiro
      if (cache.servicos) {
        const servicoCache = cache.servicos.find(s => s.id === id);
        if (servicoCache) {
          // Busca os agendamentos relacionados
          const agendamentos = await prisma.agendamento.findMany({
            where: { servicoId: id }
          });
          return { ...servicoCache, agendamentos };
        }
      }

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
      const novoServico = await prisma.servico.create({
        data: {
          descricao: dados.descricao,
          duracao: dados.duracao,
          preco: dados.preco
        }
      });
      
      // Invalida o cache
      cache.servicos = null;
      
      return novoServico;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw new Error('Não foi possível criar o serviço');
    }
  },

  async atualizar(id, dados) {
    try {
      const servicoAtualizado = await prisma.servico.update({
        where: { id },
        data: {
          descricao: dados.descricao,
          duracao: dados.duracao,
          preco: dados.preco
        }
      });
      
      // Invalida o cache
      cache.servicos = null;
      
      return servicoAtualizado;
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
      
      // Invalida o cache
      cache.servicos = null;
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      throw new Error('Não foi possível excluir o serviço');
    }
  }
};
