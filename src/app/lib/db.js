import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'db.json');

const initialDb = {
  funcionarios: [],
  servicos: [],
  agendamentos: []
};

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler banco de dados:', error);
    return initialDb;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar banco de dados:', error);
    return false;
  }
}

function initDb() {
  const db = readDb();
  
  if (db.funcionarios.length === 0) {
    db.funcionarios.push({
      id: '1',
      nome: 'Tatuador Teste',
      cargo: 'Tatuador',
      email: 'teste@exemplo.com'
    });
  }
  
  if (db.servicos.length === 0) {
    db.servicos.push({
      id: '1', 
      nome: 'Tatuagem Simples',
      preco: 150,
      duracao: 60
    });
  }
  
  writeDb(db);
  return db;
}

export const funcionariosDb = {
  getAll: () => {
    const db = readDb();
    return db.funcionarios;
  },
  
  getById: (id) => {
    const db = readDb();
    return db.funcionarios.find(f => f.id === id);
  },
  
  create: (funcionario) => {
    const db = readDb();
    const novoFuncionario = {
      id: uuidv4(),
      ...funcionario
    };
    db.funcionarios.push(novoFuncionario);
    writeDb(db);
    return novoFuncionario;
  },
  
  update: (id, dados) => {
    const db = readDb();
    const index = db.funcionarios.findIndex(f => f.id === id);
    if (index >= 0) {
      db.funcionarios[index] = { ...db.funcionarios[index], ...dados };
      writeDb(db);
      return db.funcionarios[index];
    }
    return null;
  },
  
  delete: (id) => {
    const db = readDb();
    const agendamentosRelacionados = db.agendamentos.some(a => a.funcionarioId === id);
    if (agendamentosRelacionados) {
      return { success: false, message: 'Funcionário possui agendamentos' };
    }
    
    db.funcionarios = db.funcionarios.filter(f => f.id !== id);
    writeDb(db);
    return { success: true };
  }
};

export const servicosDb = {
  getAll: () => {
    const db = readDb();
    return db.servicos;
  },
  
  getById: (id) => {
    const db = readDb();
    return db.servicos.find(s => s.id === id);
  },
  
  create: (servico) => {
    const db = readDb();
    const novoServico = {
      id: uuidv4(),
      ...servico
    };
    db.servicos.push(novoServico);
    writeDb(db);
    return novoServico;
  },
  
  update: (id, dados) => {
    const db = readDb();
    const index = db.servicos.findIndex(s => s.id === id);
    if (index >= 0) {
      db.servicos[index] = { ...db.servicos[index], ...dados };
      writeDb(db);
      return db.servicos[index];
    }
    return null;
  },
  
  delete: (id) => {
    const db = readDb();
    
    const agendamentosRelacionados = db.agendamentos.some(a => a.servicoId === id);
    if (agendamentosRelacionados) {
      return { success: false, message: 'Serviço possui agendamentos' };
    }
    
    db.servicos = db.servicos.filter(s => s.id !== id);
    writeDb(db);
    return { success: true };
  }
};

export const agendamentosDb = {
  getAll: () => {
    const db = readDb();
    return db.agendamentos;
  },
  
  getById: (id) => {
    const db = readDb();
    return db.agendamentos.find(a => a.id === id);
  },
  
  create: (agendamento) => {
    const db = readDb();
    const novoAgendamento = {
      id: uuidv4(),
      ...agendamento
    };
    db.agendamentos.push(novoAgendamento);
    writeDb(db);
    return novoAgendamento;
  },
  
  update: (id, dados) => {
    const db = readDb();
    const index = db.agendamentos.findIndex(a => a.id === id);
    if (index >= 0) {
      db.agendamentos[index] = { ...db.agendamentos[index], ...dados };
      writeDb(db);
      return db.agendamentos[index];
    }
    return null;
  },
  
  delete: (id) => {
    const db = readDb();
    db.agendamentos = db.agendamentos.filter(a => a.id !== id);
    writeDb(db);
    return { success: true };
  }
};
initDb();

export default {
  funcionarios: funcionariosDb,
  servicos: servicosDb,
  agendamentos: agendamentosDb
};
