import fs from 'fs';

// Este script só deve criar o arquivo .env durante o build
// Em produção, as variáveis de ambiente devem vir do Railway
console.log('Verificando ambiente...');

// Se estamos em produção, não criar o arquivo .env
if (process.env.NODE_ENV === 'production') {
  console.log('Ambiente de produção detectado. Não criando arquivo .env temporário.');
  // Verificar se existe um arquivo .env e removê-lo
  if (fs.existsSync('.env')) {
    console.log('Removendo arquivo .env em ambiente de produção...');
    fs.unlinkSync('.env');
    console.log('Arquivo .env removido.');
  }
  process.exit(0);
}

// Apenas para ambiente de desenvolvimento
try {
  console.log('Ambiente de desenvolvimento detectado.');
  
  if (!process.env.DATABASE_URL) {
    console.log('Nenhuma variável DATABASE_URL encontrada. Criando um .env temporário para o build...');
    
    // Verifica se o arquivo .env já existe
    if (!fs.existsSync('.env')) {
      fs.writeFileSync('.env', 'DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"\n');
      console.log('Arquivo .env temporário criado.');
    } else {
      console.log('Arquivo .env já existe. Verificando conteúdo...');
      
      // Lê o arquivo .env existente
      const envContent = fs.readFileSync('.env', 'utf8');
      
      // Verifica se já contém DATABASE_URL
      if (!envContent.includes('DATABASE_URL=') && !envContent.includes('DATABASE_URL =')) {
        console.log('Adicionando DATABASE_URL ao arquivo .env existente');
        fs.appendFileSync('.env', '\nDATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"\n');
      } else {
        console.log('DATABASE_URL já existe no arquivo .env');
      }
    }
  } else {
    console.log('DATABASE_URL encontrado no ambiente.');
  }
  
  console.log('Configuração de ambiente concluída com sucesso.');
} catch (error) {
  console.error('Erro ao configurar variáveis de ambiente:', error);
  // Não interromper o processo para não falhar o build
  console.log('Continuando apesar do erro...');
}
