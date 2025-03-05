const fs = require('fs');
const path = require('path');

console.log('Configurando variáveis de ambiente...');
const envPath = path.join(process.cwd(), '.env');

// Adicionar DATABASE_URL com um placeholder para desenvolvimento local
const envVars = [
  'NODE_ENV=production',
  'NEXT_TELEMETRY_DISABLED=1',
  'API_URL=http://localhost:3000/api',
  // Usar um valor padrão para desenvolvimento local
  // Em produção (Vercel), esta variável será substituída pelo valor configurado na plataforma
  'DATABASE_URL=postgresql://user:password@localhost:5432/tattoo_manager'
].join('\n');

try {
  if (!fs.existsSync(envPath)) {
    console.log('Criando arquivo .env...');
    fs.writeFileSync(envPath, envVars);
    console.log('Arquivo .env criado com sucesso!');
    console.log('ATENÇÃO: Para desenvolvimento local, edite o DATABASE_URL no arquivo .env com as credenciais corretas.');
  } else {
    console.log('Arquivo .env já existe.');
  }
  
  console.log('Configuração de variáveis de ambiente concluída.');
} catch (error) {
  console.error('Erro ao configurar variáveis de ambiente:', error.message);
}
