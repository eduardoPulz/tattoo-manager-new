import fs from 'fs';

// Este script verifica o ambiente e limpa arquivos .env em produção
console.log('Verificando ambiente...');

// Se estamos em produção, não criar o arquivo .env
if (process.env.NODE_ENV === 'production') {
  console.log('Ambiente de produção detectado.');
  // Verificar se existe um arquivo .env e removê-lo
  if (fs.existsSync('.env')) {
    console.log('Removendo arquivo .env em ambiente de produção...');
    fs.unlinkSync('.env');
    console.log('Arquivo .env removido.');
  }
  process.exit(0);
}

// Em ambiente de desenvolvimento, não fazemos nada
console.log('Ambiente de desenvolvimento detectado.');
console.log('Configuração de ambiente concluída com sucesso.');
