export default function Header() {
  return (
    <header>
      <div>
        <div className="header-logo">🍽️ Comandas do Zé</div>
        <div className="header-sub">Sistema de Caixa</div>
      </div>
      <div className="header-spacer"></div>
      <img
        src="/assets/foto.jpg"
        className="user-photo"
        alt="Operador"
        title="Foto do operador"
        onError={e => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://placehold.co/46x46/f5c518/3d2b1f?text=EU';
        }}
      />
    </header>
  );
}
