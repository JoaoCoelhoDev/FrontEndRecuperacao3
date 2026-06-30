import { fmt } from '../utils.js';

export default function SelectionBar({ selectedIds, selectedTotals, onClear, onVerDetalhes }) {
  const count = selectedIds.size;
  const total = Object.values(selectedTotals).reduce((a, b) => a + b, 0);

  return (
    <div className={`selection-bar ${count > 0 ? 'visible' : ''}`}>
      <div>
        <div className="sel-count">{count} comanda(s) selecionada(s)</div>
        <div className="sel-total">{fmt(total)}</div>
      </div>
      <div className="sel-spacer"></div>
      <button className="btn btn-secondary" onClick={onClear}>✕ Cancelar</button>
      <button className="btn btn-primary" onClick={onVerDetalhes}>Ver Detalhes →</button>
    </div>
  );
}
