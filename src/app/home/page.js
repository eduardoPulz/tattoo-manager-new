export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Tattoo Manager</h1>
      <p style={{ fontSize: '18px' }}>
        Bem-vindo ao sistema de gerenciamento de estúdio de tatuagem.
      </p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h2 style={{ color: '#555' }}>Funcionalidades</h2>
        <ul style={{ lineHeight: '1.6' }}>
          <li>Gerenciamento de agendamentos</li>
          <li>Cadastro de clientes</li>
          <li>Controle de serviços</li>
          <li>Relatórios financeiros</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a href="/admin" style={{ 
          display: 'inline-block', 
          padding: '10px 15px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '4px' 
        }}>
          Acessar Painel Administrativo
        </a>
      </div>
    </div>
  );
}
