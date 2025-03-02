const fs = require('fs');
const path = require('path');

console.log('Configurando banco de dados...');

const dbPath = path.join(process.cwd(), 'db.json');
const exampleDbPath = path.join(process.cwd(), 'db.example.json');

// Verifica se o arquivo db.json já existe
if (!fs.existsSync(dbPath)) {
  try {
    // Tenta usar o db.example.json como modelo
    if (fs.existsSync(exampleDbPath)) {
      console.log('Usando db.example.json como modelo...');
      fs.copyFileSync(exampleDbPath, dbPath);
      console.log('Arquivo db.json criado com sucesso a partir do modelo!');
    } else {
      console.log('Criando db.json com estrutura básica...');
      const initialData = {
        funcionarios: [],
        servicos: [],
        agendamentos: []
      };
      
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
      console.log('Arquivo db.json criado com sucesso!');
    }
    
    fs.chmodSync(dbPath, 0o777);
    console.log('Permissões do arquivo db.json configuradas.');
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error.message);
    
    // Tenta criar um arquivo mínimo em caso de erro
    try {
      fs.writeFileSync(dbPath, '{"funcionarios":[],"servicos":[],"agendamentos":[]}');
      console.log('Arquivo db.json mínimo criado após erro.');
    } catch (fallbackError) {
      console.error('Erro crítico ao criar db.json:', fallbackError.message);
    }
  }
} else {
  console.log('Arquivo db.json já existe.');
  
  // Verifica se o arquivo tem a estrutura correta
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (!data.funcionarios || !data.servicos || !data.agendamentos) {
      console.warn('Arquivo db.json existente não tem a estrutura correta. Corrigindo...');
      
      // Garante que todas as propriedades existam
      data.funcionarios = data.funcionarios || [];
      data.servicos = data.servicos || [];
      data.agendamentos = data.agendamentos || [];
      
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      console.log('Estrutura do arquivo db.json corrigida.');
    }
  } catch (error) {
    console.error('Erro ao verificar estrutura do db.json:', error.message);
  }
}
