const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const dbMinimo = '{"funcionarios":[],"servicos":[],"agendamentos":[]}';

// Verifica se estamos rodando na Vercel
if (process.env.VERCEL === '1') {
  console.log('Ambiente Vercel detectado: Ignorando setup do arquivo db.json');
  process.exit(0);
}

try {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, dbMinimo);
    console.log('Arquivo db.json criado com sucesso!');
  } else {
    try {
      JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      console.log('Arquivo db.json validado com sucesso!');
    } catch (parseError) {
      console.warn('Arquivo db.json existente não é um JSON válido. Recriando...');
      fs.writeFileSync(dbPath, dbMinimo);
      console.log('Arquivo db.json recriado com sucesso!');
    }
  }
  
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
