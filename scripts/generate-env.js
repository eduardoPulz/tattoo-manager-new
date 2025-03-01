import fs from 'fs';

// Verifica se a variável DATABASE_URL existe, caso contrário cria um arquivo .env com um valor fictício
// apenas para permitir que o build ocorra
if (!process.env.DATABASE_URL) {
  console.log('Nenhuma variável DATABASE_URL encontrada. Criando um .env temporário para o build...');
  fs.writeFileSync('.env', 'DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"\n');
  console.log('Arquivo .env temporário criado.');
} else {
  console.log('DATABASE_URL encontrado no ambiente. Continuando...');
}
