import { fmt } from '../utils.js';

export default function ComprovanteView({ active, comprovante, onNovaOperacao }) {
  if (!comprovante) {
    return <div id="view-comprovante" className={`view ${active ? 'active' : ''}`} />;
  }

  const c = comprovante;
  const emissao = new Date(c.data_emissao).toLocaleString('pt-BR');

  return (
    <div id="view-comprovante" className={`view ${active ? 'active' : ''}`}>
      <div className="container">
        <div className="page-title">Comprovante de Pagamento</div>
        <div id="comprovante-content">
          <div className="comprovante-box">
            <div className="comp-header">
              <div className="comp-logo">🍽️ {c.cabecalho.sistema}</div>
              <div className="comp-sub">{c.cabecalho.documento}</div>
              <div style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>{emissao}</div>
            </div>

            {c.cliente && (
              <>
                <div style={{ marginBottom: 10 }}>
                  <div className="comp-section-title">Cliente</div>
                  <div className="comp-row"><span>👤 {c.cliente.nome}</span></div>
                </div>
                <hr className="comp-div" />
              </>
            )}

            <div style={{ marginBottom: 10 }}>
              <div className="comp-section-title">Atendente</div>
              <div className="comp-row"><span>{c.funcionario.nome}</span></div>
            </div>
            <hr className="comp-div" />

            {c.comandas.map((cmd, idx) => (
              <div key={idx}>
                <div style={{ margin: '8px 0' }}>
                  <div className="comp-section-title">Comanda: {cmd.numero}</div>
                  {cmd.itens.map((i, j) => (
                    <div className="comp-row" key={j}>
                      <span>{i.produto.nome} x{i.quantidade}</span>
                      <span>{fmt(i.subtotal)}</span>
                    </div>
                  ))}
                  <div className="comp-row" style={{ fontWeight: 600, borderTop: '1px solid #eee', marginTop: 4, paddingTop: 4 }}>
                    <span>Subtotal</span><span>{fmt(cmd.total)}</span>
                  </div>
                </div>
                <hr className="comp-div" />
              </div>
            ))}

            <div>
              <div className="comp-section-title">Resumo</div>
              <div className="comp-row"><span>Subtotal</span><span>{fmt(c.resumo_valores.subtotal)}</span></div>
              {c.resumo_valores.desconto > 0 && (
                <div className="comp-row" style={{ color: '#e74c3c' }}><span>Desconto</span><span>- {fmt(c.resumo_valores.desconto)}</span></div>
              )}
              {c.resumo_valores.acrescimo > 0 && (
                <div className="comp-row" style={{ color: '#2980b9' }}><span>Acréscimo</span><span>+ {fmt(c.resumo_valores.acrescimo)}</span></div>
              )}
            </div>

            <div className="comp-total">{fmt(c.resumo_valores.total)}</div>

            <div className="comp-rodape">
              <div>{c.rodape.mensagem}</div>
              <div style={{ fontSize: 11, marginTop: 4, color: '#ccc' }}>
                Recebimento #{c.recebimento.id_recebimento}
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 22, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Imprimir</button>
          <button className="btn btn-primary" onClick={onNovaOperacao}>+ Nova Operação</button>
        </div>
      </div>
    </div>
  );
}
