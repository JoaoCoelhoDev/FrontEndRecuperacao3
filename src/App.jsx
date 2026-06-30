import { useCallback, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Nav from './components/Nav.jsx';
import Toast from './components/Toast.jsx';
import SelectionBar from './components/SelectionBar.jsx';
import DashboardView from './components/DashboardView.jsx';
import DetalheView from './components/DetalheView.jsx';
import ComprovanteView from './components/ComprovanteView.jsx';
import GerenciarView from './components/GerenciarView.jsx';
import { req } from './api.js';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedTotals, setSelectedTotals] = useState({});
  const [detalheData, setDetalheData] = useState(null);
  const [comprovante, setComprovante] = useState(null);
  const [toast, setToast] = useState({ msg: '', type: 'success', show: false });
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3200);
  }, []);

  const toggleCard = (id, total) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setSelectedTotals(prev => {
      const next = { ...prev };
      if (id in next) delete next[id]; else next[id] = total;
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectedTotals({});
  };

  const irParaDetalhe = async () => {
    if (!selectedIds.size) return;
    try {
      const data = await req('GET', `/recebimento/comandas/detalhe/${[...selectedIds].join(',')}`);
      setDetalheData(data);
      setView('detalhe');
    } catch (e) {
      showToast('Erro ao carregar detalhe: ' + e.message, 'error');
    }
  };

  const confirmarPagamento = async ({ funcId, cliente_id, desconto_valor, acrescimo_valor }) => {
    if (!funcId) { showToast('Selecione o funcionário responsável', 'error'); return; }
    try {
      const resp = await req('POST', '/recebimento/completo', {
        comandas_ids: [...selectedIds],
        funcionario_id: funcId,
        cliente_id,
        desconto_valor,
        acrescimo_valor,
      });
      showToast('Pagamento confirmado com sucesso!');
      const comp = await req('GET', `/recebimento/comprovante/${resp.recebimento_id}`);
      setComprovante(comp);
      clearSelection();
      setView('comprovante');
    } catch (e) {
      showToast('Erro: ' + e.message, 'error');
    }
  };

  const novaOperacao = () => {
    setDetalheData(null);
    setView('dashboard');
  };

  return (
    <>
      <Header />
      <Nav view={view} onChange={setView} />
      <Toast toast={toast} />
      <SelectionBar
        selectedIds={selectedIds}
        selectedTotals={selectedTotals}
        onClear={clearSelection}
        onVerDetalhes={irParaDetalhe}
      />

      <DashboardView active={view === 'dashboard'} selectedIds={selectedIds} onToggleCard={toggleCard} />
      <DetalheView
        active={view === 'detalhe'}
        detalheData={detalheData}
        onBack={() => setView('dashboard')}
        onConfirmar={confirmarPagamento}
      />
      <ComprovanteView active={view === 'comprovante'} comprovante={comprovante} onNovaOperacao={novaOperacao} />
      <GerenciarView active={view === 'gerenciar'} showToast={showToast} />
    </>
  );
}
