import { useEffect, useState, useCallback } from 'react';
import { req } from '../api.js';
import { fmt, fmtHora } from '../utils.js';

export default function DashboardView({ active, selectedIds, onToggleCard }) {
  const [comandas, setComandas] = useState(null);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setError(null);
    setComandas(null);
    try {
      const data = await req('GET', '/recebimento/dashboard');
      setComandas(data);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    if (active) loadDashboard();
  }, [active, loadDashboard]);

  return (
    <div id="view-dashboard" className={`view ${active ? 'active' : ''}`}>
      <div className="container">
        <div className="page-title">
          Caixa – Comandas Abertas
          <span className="badge">{comandas ? comandas.length : 0}</span>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-outline btn-sm" onClick={loadDashboard}>↻ Atualizar</button>
        </div>
        <div className="comandas-grid">
          {error && (
            <div className="error-state" style={{ gridColumn: '1/-1' }}>⚠️ {error}</div>
          )}
          {!error && comandas === null && (
            <div className="loading-state" style={{ gridColumn: '1/-1' }}>Carregando comandas...</div>
          )}
          {!error && comandas && comandas.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <div className="ico">🍽️</div>
              <div>Nenhuma comanda aberta no momento</div>
            </div>
          )}
          {!error && comandas && comandas.map(c => (
            <div
              key={c.id}
              className={`comanda-card ${selectedIds.has(c.id) ? 'selected' : ''}`}
              onClick={() => onToggleCard(c.id, c.total)}
            >
              <span className="card-check">✓</span>
              <div className="card-numero">{c.comanda}</div>
              {c.cliente && <div className="card-info" style={{ marginBottom: 4 }}>👤 {c.cliente.nome}</div>}
              <div className="card-total">{fmt(c.total)}</div>
              <div className="card-info">🛒 {c.quantidade_produtos} item(ns)</div>
              <div className="card-info" style={{ marginTop: 3 }}>🕐 {fmtHora(c.data_hora)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
