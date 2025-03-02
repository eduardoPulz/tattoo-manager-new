/**
 * Script de inicialização do banco de dados
 */

const fs = require('fs');
const path = require('path');

console.log('Iniciando setup do banco de dados...');

try {
  const dbPath = path.join(process.cwd(), 'db.json');
  
  // Verifica se o arquivo de banco já existe
  if (!fs.existsSync(dbPath)) {
    console.log('Arquivo db.json não encontrado. Criando estrutura inicial...');
    
    // Estrutura inicial do banco
    const initialDb = {
      funcionarios: [],
      servicos: [],
      agendamentos: []
    };
    
    // Escreve o arquivo
    fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
    console.log('Banco de dados inicializado com sucesso!');
  } else {
    console.log('Arquivo db.json já existe. Verificando estrutura...');
    
    // Lê o arquivo existente
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    let db;
    
    try {
      db = JSON.parse(dbContent);
      
      // Verifica se todas as coleções existem
      let modificado = false;
      
      if (!db.funcionarios) {
        db.funcionarios = [];
        modificado = true;
        console.log('Adicionada coleção de funcionarios');
      }
      
      if (!db.servicos) {
        db.servicos = [];
        modificado = true;
        console.log('Adicionada coleção de servicos');
      }
      
      if (!db.agendamentos) {
        db.agendamentos = [];
        modificado = true;
        console.log('Adicionada coleção de agendamentos');
      }
      
      // Salva as alterações se necessário
      if (modificado) {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        console.log('Estrutura do banco de dados atualizada com sucesso!');
      } else {
        console.log('Estrutura do banco de dados já está correta.');
      }
    } catch (parseError) {
      console.error('Erro ao analisar o arquivo db.json:', parseError);
      console.log('Criando backup do arquivo corrompido...');
      
      // Cria backup do arquivo corrompido
      const backupPath = `${dbPath}.bak.${Date.now()}`;
      fs.copyFileSync(dbPath, backupPath);
      console.log(`Backup criado em: ${backupPath}`);
      
      // Cria um novo arquivo
      const initialDb = {
        funcionarios: [],
        servicos: [],
        agendamentos: []
      };
      
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
      console.log('Novo arquivo db.json criado com sucesso!');
    }
  }
  
  console.log('Setup do banco de dados concluído!');
} catch (error) {
  console.error('Erro ao configurar o banco de dados:', error);
  process.exit(1);
}
