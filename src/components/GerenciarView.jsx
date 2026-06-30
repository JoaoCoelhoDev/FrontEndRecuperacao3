import { useEffect, useState, useCallback } from 'react';
import { req } from '../api.js';
import { fmt } from '../utils.js';

export default function GerenciarView({ active, showToast }) {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [comandas, setComandas] = useState(null);
  const [comandasError, setComandasError] = useState(null);

  const [numero, setNumero] = useState('');
  const [ncClienteId, setNcClienteId] = useState('');

  const [aiComandaId, setAiComandaId] = useState('');
  const [aiProdutoId, setAiProdutoId] = useState('');
  const [aiQtde, setAiQtde] = useState(1);

  const refreshListaComandas = useCallback(async () => {
    try {
      const data = await req('GET', '/comanda/');
      setComandas(data);
      setComandasError(null);
    } catch (e) {
      setComandasError(e.message);
    }
  }, []);

  const loadGerenciar = useCallback(async () => {
    try {
      setClientes(await req('GET', '/cliente/'));
    } catch {
      setClientes([]);
    }
    try {
      setProdutos(await req('GET', '/produto/'));
    } catch {
      setProdutos([]);
    }
    await refreshListaComandas();
  }, [refreshListaComandas]);

  useEffect(() => {
    if (active) loadGerenciar();
  }, [active, loadGerenciar]);

  const criarComanda = async () => {
    const nome = numero.trim();
    if (!nome) { showToast('Informe o número/nome da comanda', 'error'); return; }
    try {
      await req('POST', '/comanda/', { numero: nome, id_cliente: parseInt(ncClienteId) || null });
      showToast(`Comanda "${nome}" criada com sucesso!`);
      setNumero('');
      await refreshListaComandas();
    } catch (e) {
      showToast('Erro: ' + e.message, 'error');
    }
  };

  const adicionarItem = async () => {
    const cmdId = parseInt(aiComandaId);
    const prodId = parseInt(aiProdutoId);
    const qtde = parseInt(aiQtde) || 1;
    if (!cmdId || !prodId) { showToast('Selecione a comanda e o produto', 'error'); return; }
    try {
      await req('POST', `/comanda/${cmdId}/item`, { id_produto: prodId, quantidade: qtde });
      showToast('Item adicionado com sucesso!');
    } catch (e) {
      showToast('Erro: ' + e.message, 'error');
    }
  };

  const abertas = (comandas || []).filter(c => c.status === 0);

  return (
    <div id="view-gerenciar" className={`view ${active ? 'active' : ''}`}>
      <div className="container">
        <div className="page-title">Gestão de Comandas</div>

        <div className="card">
          <h3>Nova Comanda</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Número / Nome *</label>
              <input
                type="text" placeholder="Ex: Mesa 01, Gabriel..."
                value={numero} onChange={e => setNumero(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Cliente (opcional)</label>
              <select value={ncClienteId} onChange={e => setNcClienteId(e.target.value)}>
                <option value="">Nenhum</option>
                {clientes.map(c => (
                  <option key={c.id_cliente} value={c.id_cliente}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="btn btn-primary" onClick={criarComanda}>+ Criar Comanda</button>
          </div>
        </div>

        <div className="card">
          <h3>Adicionar Item à Comanda</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Comanda *</label>
              <select value={aiComandaId} onChange={e => setAiComandaId(e.target.value)}>
                <option value="">Selecione...</option>
                {abertas.map(c => (
                  <option key={c.id_comanda} value={c.id_comanda}>{c.numero}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Produto *</label>
              <select value={aiProdutoId} onChange={e => setAiProdutoId(e.target.value)}>
                <option value="">Selecione...</option>
                {produtos.map(p => (
                  <option key={p.id_produto} value={p.id_produto}>{p.nome} — {fmt(p.valor_unitario)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Quantidade</label>
              <input type="number" min="1" value={aiQtde} onChange={e => setAiQtde(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="btn btn-primary" onClick={adicionarItem}>+ Adicionar Item</button>
          </div>
        </div>

        <div className="card">
          <h3>Todas as Comandas</h3>
          <div id="lista-comandas">
            {comandasError && <div className="error-state">⚠️ {comandasError}</div>}
            {!comandasError && comandas === null && <div className="loading-state">Carregando...</div>}
            {!comandasError && comandas && comandas.length === 0 && (
              <div className="empty-state"><div className="ico">📋</div><div>Nenhuma comanda cadastrada</div></div>
            )}
            {!comandasError && comandas && comandas.length > 0 && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>#</th><th>Número</th><th>Status</th><th>Data/Hora</th></tr>
                  </thead>
                  <tbody>
                    {comandas.map(c => (
                      <tr key={c.id_comanda}>
                        <td>{c.id_comanda}</td>
                        <td><strong>{c.numero}</strong></td>
                        <td>{c.status === 0
                          ? <span style={{ color: '#27ae60' }}>● Aberta</span>
                          : <span style={{ color: '#e74c3c' }}>● Fechada</span>}</td>
                        <td>{new Date(c.data_hora).toLocaleString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
