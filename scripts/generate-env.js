/**
 * Script de geração de arquivo .env para ambientes de produção
 */

const fs = require('fs');
const path = require('path');

console.log('Gerando arquivo .env para o ambiente atual...');

try {
  // Criar arquivo .env se não existir
  const envPath = path.join(process.cwd(), '.env');
  
  // Verificar se o arquivo já existe
  if (!fs.existsSync(envPath)) {
    // Configurações básicas
    const envContent = `# Arquivo .env gerado automaticamente
NODE_ENV=production
# Configurações da aplicação
APP_URL=${process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:3000'}
# Variáveis de inicialização
INIT_APP=true
# Data de geração
GENERATED_AT=${new Date().toISOString()}
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('Arquivo .env criado com sucesso!');
  } else {
    console.log('Arquivo .env já existe, pulando geração.');
  }
} catch (error) {
  console.error('Erro ao gerar arquivo .env:', error);
  // Não falha a execução em caso de erro
}
