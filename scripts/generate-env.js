/**
 * Script para gerar variáveis de ambiente
 * Este script é executado durante o build para garantir que as variáveis de ambiente estejam configuradas
 */
const fs = require('fs');
const path = require('path');

console.log('Configurando variáveis de ambiente...');

// Caminho para o arquivo .env
const envPath = path.join(process.cwd(), '.env');

// Variáveis de ambiente padrão
const envVars = [
  'NODE_ENV=production',
  'NEXT_TELEMETRY_DISABLED=1',
  'API_URL=http://localhost:3000/api'
].join('\n');

try {
  // Verifica se o arquivo .env já existe
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
  // Não interrompe o processo em caso de erro
}
