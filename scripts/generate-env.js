const fs = require('fs');
const path = require('path');

console.log('Configurando variáveis de ambiente...');
const envPath = path.join(process.cwd(), '.env');

const envVars = [
  'NODE_ENV=production',
  'NEXT_TELEMETRY_DISABLED=1',
  'API_URL=http://localhost:3000/api'
].join('\n');

try {
  if (!fs.existsSync(envPath)) {
    console.log('Criando arquivo .env...');
    fs.writeFileSync(envPath, envVars);
    console.log('Arquivo .env criado com sucesso!');
  } else {
    console.log('Arquivo .env já existe.');
  }
  
  console.log('Configuração de variáveis de ambiente concluída.');
} catch (error) {
  console.error('Erro ao configurar variáveis de ambiente:', error.message);
}
