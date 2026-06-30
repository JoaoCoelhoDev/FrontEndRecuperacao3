export default function Nav({ view, onChange }) {
  return (
    <nav>
      <button className={view === 'dashboard' ? 'active' : ''} onClick={() => onChange('dashboard')}>
        🏠 Caixa
      </button>
      <button className={view === 'gerenciar' ? 'active' : ''} onClick={() => onChange('gerenciar')}>
        📋 Comandas
      </button>
    </nav>
  );
}
