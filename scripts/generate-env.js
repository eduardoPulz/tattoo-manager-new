import fs from 'fs';

// Verifica se a variável DATABASE_URL existe, caso contrário cria um arquivo .env com um valor fictício
// apenas para permitir que o build ocorra
try {
  console.log('Verificando variáveis de ambiente...');
  
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
    console.log('DATABASE_URL encontrado no ambiente. Valor:', process.env.DATABASE_URL.substring(0, 10) + '...');
  }
  
  console.log('Configuração de ambiente concluída com sucesso.');
} catch (error) {
  console.error('Erro ao configurar variáveis de ambiente:', error);
  // Não interromper o processo para não falhar o build
  console.log('Continuando apesar do erro...');
}
