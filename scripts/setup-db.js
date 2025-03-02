/**
 * Script para configurar o banco de dados
 * Este script cria o arquivo db.json se ele não existir
 */
const fs = require('fs');
const path = require('path');

console.log('Configurando banco de dados...');

const dbPath = path.join(process.cwd(), 'db.json');

// Verifica se o arquivo db.json já existe
if (!fs.existsSync(dbPath)) {
  // Cria um arquivo db.json vazio com a estrutura básica
  const initialData = {
    funcionarios: [],
    servicos: [],
    agendamentos: []
  };
  
  // Escreve o arquivo
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  console.log('Arquivo db.json criado com sucesso!');
} else {
  console.log('Arquivo db.json já existe.');
}

// Garante que o arquivo tenha permissões de escrita
try {
  fs.chmodSync(dbPath, 0o777);
  console.log('Permissões do arquivo db.json configuradas.');
} catch (error) {
  console.error('Erro ao configurar permissões:', error.message);
}
