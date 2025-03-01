import prisma from '@/lib/prisma';

// Cache para armazenar resultados e reduzir consultas ao banco
const cache = {
  funcionarios: null,
  timestamp: 0,
  ttl: 60000 // 1 minuto em milissegundos
};

export const FuncionarioService = {
  async listarTodos() {
    try {
      // Verifica se há dados em cache válidos
      const agora = Date.now();
      if (cache.funcionarios && (agora - cache.timestamp < cache.ttl)) {
        return cache.funcionarios;
      }

      // Busca dados do banco e atualiza o cache
      const funcionarios = await prisma.funcionario.findMany({
        orderBy: { nome: 'asc' }
      });
      
      // Atualiza o cache
      cache.funcionarios = funcionarios;
      cache.timestamp = agora;
      
      return funcionarios;
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      throw new Error('Não foi possível listar os funcionários');
    }
  },

  async buscarPorId(id) {
    try {
      // Tenta encontrar no cache primeiro
      if (cache.funcionarios) {
        const funcionarioCache = cache.funcionarios.find(f => f.id === id);
        if (funcionarioCache) {
          // Busca os agendamentos relacionados
          const agendamentos = await prisma.agendamento.findMany({
            where: { funcionarioId: id }
          });
          return { ...funcionarioCache, agendamentos };
        }
      }

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
      const novoFuncionario = await prisma.funcionario.create({
        data: {
          nome: dados.nome,
          especialidade: dados.especialidade,
          telefone: dados.telefone
        }
      });
      
      // Invalida o cache
      cache.funcionarios = null;
      
      return novoFuncionario;
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw new Error('Não foi possível criar o funcionário');
    }
  },

  async atualizar(id, dados) {
    try {
      const funcionarioAtualizado = await prisma.funcionario.update({
        where: { id },
        data: {
          nome: dados.nome,
          especialidade: dados.especialidade,
          telefone: dados.telefone
        }
      });
      
      // Invalida o cache
      cache.funcionarios = null;
      
      return funcionarioAtualizado;
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
      
      // Invalida o cache
      cache.funcionarios = null;
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      throw new Error('Não foi possível excluir o funcionário');
    }
  }
};
