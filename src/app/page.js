'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [funcionario, setFuncionario] = useState({ nome: '', cargo: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const resposta = await fetch('/api/dados');
        
        if (!resposta.ok) {
          throw new Error(`Erro na resposta: ${resposta.status}`);
        }
        
        const dados = await resposta.json();
        setDados(dados);
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro(`Erro ao carregar dados: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const adicionarFuncionario = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const resposta = await fetch('/api/dados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'funcionario',
          dados: funcionario
        }),
      });
      
      if (!resposta.ok) {
        throw new Error(`Erro ao adicionar: ${resposta.status}`);
      }
      
      const respostaDados = await fetch('/api/dados');
      const novosDados = await respostaDados.json();
      setDados(novosDados);
      
      setFuncionario({ nome: '', cargo: '', email: '' });
      setErro(null);
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
      setErro(`Erro ao adicionar funcionário: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFuncionario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Tattoo Manager - Versão Simplificada</h1>
      
      {/* Galeria de Imagens */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Galeria de Trabalhos</h2>
      </div>
      
      {/* Status da API */}
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Status da API</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : erro ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{erro}</p>
          </div>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>API funcionando corretamente!</p>
            {dados?.info && (
              <div className="mt-2 text-sm">
                <p>Ambiente: {dados.info.env}</p>
                <p>Banco de dados: {dados.info.database}</p>
                <p>Timestamp: {dados.info.timestamp}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Formulário de Funcionário */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Adicionar Funcionário</h2>
        <form onSubmit={adicionarFuncionario} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nome:</label>
            <input
              type="text"
              name="nome"
              value={funcionario.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Cargo:</label>
            <input
              type="text"
              name="cargo"
              value={funcionario.cargo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={funcionario.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Funcionário'}
          </button>
        </form>
      </div>
      
      {/* Exibir Dados */}
      {dados && !erro && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Funcionários */}
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Funcionários ({dados.data.funcionarios.length})</h2>
            {dados.data.funcionarios.length > 0 ? (
              <ul>
                {dados.data.funcionarios.map(f => (
                  <li key={f.id} className="mb-2 pb-2 border-b">
                    <strong>{f.nome}</strong> - {f.cargo} ({f.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum funcionário cadastrado.</p>
            )}
          </div>
          
          {/* Serviços */}
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Serviços ({dados.data.servicos.length})</h2>
            {dados.data.servicos.length > 0 ? (
              <ul>
                {dados.data.servicos.map(s => (
                  <li key={s.id} className="mb-2 pb-2 border-b">
                    <strong>{s.nome}</strong> - R$ {s.preco.toFixed(2)} ({s.duracao} min)
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum serviço cadastrado.</p>
            )}
          </div>
          
          {/* Agendamentos */}
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Agendamentos ({dados.data.agendamentos.length})</h2>
            {dados.data.agendamentos.length > 0 ? (
              <ul>
                {dados.data.agendamentos.map(a => (
                  <li key={a.id} className="mb-2 pb-2 border-b">
                    <strong>{a.nomeCliente}</strong><br />
                    Data: {new Date(a.data).toLocaleString()}<br />
                    ID Funcionário: {a.funcionarioId}<br />
                    ID Serviço: {a.servicoId}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum agendamento cadastrado.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
