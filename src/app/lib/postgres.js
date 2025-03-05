// Este arquivo só deve ser importado em arquivos com runtime: 'nodejs'

// Função para gerar IDs únicos sem depender do módulo crypto
function generateId() {
  // Gera um ID baseado em timestamp + números aleatórios (20 caracteres)
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
}

// Variáveis para armazenar dados em memória durante o desenvolvimento
let funcionarios = [];
let servicos = [];
let agendamentos = [];

// Operações para funcionários
const funcionariosDb = {
  getAll: async () => {
    return funcionarios;
  },
  
  getById: async (id) => {
    return funcionarios.find(f => f.id === id) || null;
  },
  
  create: async (funcionario) => {
    const id = generateId();
    const novoFuncionario = { 
      id, 
      nome: funcionario.nome, 
      especialidade: funcionario.especialidade || '', 
      telefone: funcionario.telefone || '' 
    };
    funcionarios.push(novoFuncionario);
    return novoFuncionario;
  },
  
  update: async (id, dados) => {
    const index = funcionarios.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    funcionarios[index] = { 
      ...funcionarios[index], 
      nome: dados.nome, 
      especialidade: dados.especialidade, 
      telefone: dados.telefone || '' 
    };
    
    return funcionarios[index];
  },
  
  delete: async (id) => {
    const index = funcionarios.findIndex(f => f.id === id);
    if (index !== -1) {
      funcionarios.splice(index, 1);
    }
    return { success: true };
  }
};

// Operações para serviços
const servicosDb = {
  getAll: async () => {
    return servicos;
  },
  
  getById: async (id) => {
    return servicos.find(s => s.id === id) || null;
  },
  
  create: async (servico) => {
    const id = generateId();
    const novoServico = { 
      id, 
      nome: servico.nome, 
      descricao: servico.descricao || '', 
      preco: parseFloat(servico.preco), 
      duracao: parseInt(servico.duracao) 
    };
    servicos.push(novoServico);
    return novoServico;
  },
  
  update: async (id, dados) => {
    const index = servicos.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    servicos[index] = { 
      ...servicos[index], 
      nome: dados.nome, 
      descricao: dados.descricao || '', 
      preco: parseFloat(dados.preco), 
      duracao: parseInt(dados.duracao) 
    };
    
    return servicos[index];
  },
  
  delete: async (id) => {
    const index = servicos.findIndex(s => s.id === id);
    if (index !== -1) {
      servicos.splice(index, 1);
    }
    return { success: true };
  }
};

// Operações para agendamentos
const agendamentosDb = {
  getAll: async () => {
    return agendamentos.map(a => {
      const funcionario = funcionariosDb.getById(a.funcionarioId);
      const servico = servicosDb.getById(a.servicoId);
      return {
        ...a,
        funcionarioNome: funcionario ? funcionario.nome : 'Desconhecido',
        servicoNome: servico ? servico.nome : 'Desconhecido',
        preco: servico ? servico.preco : 0
      };
    });
  },
  
  getById: async (id) => {
    const agendamento = agendamentos.find(a => a.id === id);
    if (!agendamento) return null;
    
    const funcionario = funcionariosDb.getById(agendamento.funcionarioId);
    const servico = servicosDb.getById(agendamento.servicoId);
    
    return {
      ...agendamento,
      funcionarioNome: funcionario ? funcionario.nome : 'Desconhecido',
      servicoNome: servico ? servico.nome : 'Desconhecido',
      preco: servico ? servico.preco : 0
    };
  },
  
  create: async (agendamento) => {
    const id = generateId();
    const novoAgendamento = {
      id,
      clienteNome: agendamento.clienteNome,
      clienteTelefone: agendamento.clienteTelefone || '',
      funcionarioId: agendamento.funcionarioId,
      servicoId: agendamento.servicoId,
      horaInicio: agendamento.horaInicio,
      horaFim: agendamento.horaFim,
      observacoes: agendamento.observacoes || ''
    };
    
    agendamentos.push(novoAgendamento);
    return novoAgendamento;
  },
  
  update: async (id, dados) => {
    const index = agendamentos.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    agendamentos[index] = {
      ...agendamentos[index],
      clienteNome: dados.clienteNome,
      clienteTelefone: dados.clienteTelefone || '',
      funcionarioId: dados.funcionarioId,
      servicoId: dados.servicoId,
      horaInicio: dados.horaInicio,
      horaFim: dados.horaFim,
      observacoes: dados.observacoes || ''
    };
    
    return agendamentos[index];
  },
  
  delete: async (id) => {
    const index = agendamentos.findIndex(a => a.id === id);
    if (index !== -1) {
      agendamentos.splice(index, 1);
    }
    return { success: true };
  }
};

// Função para inicializar o banco de dados com dados de exemplo
async function initDatabase() {
  // Adicionar alguns funcionários de exemplo se não existirem
  if (funcionarios.length === 0) {
    await funcionariosDb.create({ nome: 'João Silva', especialidade: 'Tatuador', telefone: '(11) 98765-4321' });
    await funcionariosDb.create({ nome: 'Maria Oliveira', especialidade: 'Piercer', telefone: '(11) 91234-5678' });
  }
  
  // Adicionar alguns serviços de exemplo se não existirem
  if (servicos.length === 0) {
    await servicosDb.create({ nome: 'Tatuagem Pequena', descricao: 'Até 10cm', preco: 150, duracao: 60 });
    await servicosDb.create({ nome: 'Tatuagem Média', descricao: '10-20cm', preco: 300, duracao: 120 });
    await servicosDb.create({ nome: 'Piercing Básico', descricao: 'Orelha, nariz, etc', preco: 80, duracao: 30 });
  }
  
  console.log('Banco de dados inicializado com dados de exemplo');
  return true;
}

// Inicializar o banco de dados automaticamente
initDatabase().catch(console.error);

export {
  initDatabase,
  funcionariosDb,
  servicosDb,
  agendamentosDb
};
