import { useEffect, useState } from 'react';
import { req } from '../api.js';
import { fmt } from '../utils.js';

export default function DetalheView({ active, detalheData, onBack, onConfirmar }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [funcionarioId, setFuncionarioId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [desconto, setDesconto] = useState('');
  const [acrescimo, setAcrescimo] = useState('');

  useEffect(() => {
    if (!active) return;
    setFuncionarioId('');
    setClienteId('');
    setDesconto('');
    setAcrescimo('');
    (async () => {
      try {
        setFuncionarios(await req('GET', '/funcionario/'));
      } catch {
        setFuncionarios([]);
      }
      try {
        setClientes(await req('GET', '/cliente/'));
      } catch {
        setClientes([]);
      }
    })();
  }, [active, detalheData]);

  if (!detalheData) {
    return <div id="view-detalhe" className={`view ${active ? 'active' : ''}`} />;
  }

  const sub = detalheData.subtotal_geral;
  const desc = parseFloat(desconto) || 0;
  const acre = parseFloat(acrescimo) || 0;
  const total = Math.max(0, sub - desc + acre);

  const confirmar = () => {
    const funcId = parseInt(funcionarioId);
    onConfirmar({
      funcId,
      cliente_id: parseInt(clienteId) || null,
      desconto_valor: parseFloat(desconto) || null,
      acrescimo_valor: parseFloat(acrescimo) || null,
    });
  };

  return (
    <div id="view-detalhe" className={`view ${active ? 'active' : ''}`}>
      <div className="container">
        <div className="page-title">
          <button className="btn btn-outline btn-sm" style={{ marginRight: 4 }} onClick={onBack}>← Voltar</button>
          Detalhe do Recebimento
        </div>

        <div id="detalhe-content">
          {detalheData.comandas.map(c => (
            <div key={c.numero}>
              <div className="card" style={{ padding: '18px 22px', marginBottom: 14 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#3d2b1f', marginBottom: 4 }}>
                  Comanda: {c.numero}
                </div>
                {c.cliente && (
                  <div style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>👤 {c.cliente.nome}</div>
                )}
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Foto</th><th>Produto</th><th>Qtde</th><th>Unit.</th><th>Subtotal</th></tr>
                  </thead>
                  <tbody>
                    {c.itens.map((i, idx) => (
                      <tr key={idx}>
                        <td style={{ width: 56 }}>
                          {i.produto.foto
                            ? <img src={i.produto.foto} alt={i.produto.nome} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                            : <div style={{ width: 44, height: 44, background: '#f0ebe5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🍽️</div>
                          }
                        </td>
                        <td>{i.produto.nome}</td>
                        <td>{i.quantidade}</td>
                        <td>{fmt(i.valor_unitario)}</td>
                        <td>{fmt(i.subtotal)}</td>
                      </tr>
                    ))}
                    <tr className="tr-total">
                      <td colSpan="3" style={{ textAlign: 'right' }}>Total da Comanda</td>
                      <td>{fmt(c.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Informações do Pagamento</h3>
          <div className="form-grid" style={{ marginBottom: 18 }}>
            <div className="form-group">
              <label>Funcionário Responsável *</label>
              <select value={funcionarioId} onChange={e => setFuncionarioId(e.target.value)}>
                <option value="">Selecione...</option>
                {funcionarios.map(f => (
                  <option key={f.id_funcionario} value={f.id_funcionario}>{f.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Cliente (opcional)</label>
              <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
                <option value="">Nenhum</option>
                {clientes.map(c => (
                  <option key={c.id_cliente} value={c.id_cliente}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Desconto (R$)</label>
              <input
                type="number" min="0" step="0.01" placeholder="0,00"
                value={desconto} onChange={e => setDesconto(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Acréscimo (R$)</label>
              <input
                type="number" min="0" step="0.01" placeholder="0,00"
                value={acrescimo} onChange={e => setAcrescimo(e.target.value)}
              />
            </div>
          </div>

          <div className="resumo-box">
            <div className="resumo-linha"><span>Subtotal</span><span>{fmt(sub)}</span></div>
            <div className="resumo-linha" style={{ color: '#e74c3c' }}><span>Desconto</span><span>- {fmt(desc)}</span></div>
            <div className="resumo-linha" style={{ color: '#2980b9' }}><span>Acréscimo</span><span>+ {fmt(acre)}</span></div>
            <div className="resumo-total"><span>TOTAL</span><span>{fmt(total)}</span></div>
          </div>

          <div style={{ textAlign: 'right', marginTop: 18 }}>
            <button className="btn btn-success" style={{ fontSize: 16, padding: '14px 36px' }} onClick={confirmar}>
              ✓ Confirmar Pagamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
