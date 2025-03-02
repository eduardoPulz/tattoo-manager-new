/**
 * Script para configurar o banco de dados
 * Este script cria o arquivo db.json se ele não existir
 */
const fs = require('fs');
const path = require('path');

console.log('Configurando banco de dados...');

// Caminho para o arquivo db.json
const dbPath = path.join(process.cwd(), 'db.json');

// Estrutura mínima do banco de dados
const dbMinimo = '{"funcionarios":[],"servicos":[],"agendamentos":[]}';

try {
  // Verifica se o arquivo db.json já existe
  if (!fs.existsSync(dbPath)) {
    // Cria um arquivo db.json vazio com a estrutura básica
    fs.writeFileSync(dbPath, dbMinimo);
    console.log('Arquivo db.json criado com sucesso!');
  } else {
    console.log('Arquivo db.json já existe.');
    
    // Verifica se o arquivo pode ser lido como JSON válido
    try {
      JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (parseError) {
      // Se não for um JSON válido, recria o arquivo
      console.warn('Arquivo db.json existente não é um JSON válido. Recriando...');
      fs.writeFileSync(dbPath, dbMinimo);
      console.log('Arquivo db.json recriado com sucesso!');
    }
  }
  
  // Garante que o arquivo tenha permissões de escrita
  try {
    fs.chmodSync(dbPath, 0o666);
    console.log('Permissões do arquivo db.json configuradas.');
  } catch (permError) {
    console.log('Aviso: Não foi possível configurar permissões do arquivo.');
  }
  
  console.log('Configuração do banco de dados concluída.');
} catch (error) {
  console.error('Erro ao configurar banco de dados:', error.message);
  process.exit(1);
}
