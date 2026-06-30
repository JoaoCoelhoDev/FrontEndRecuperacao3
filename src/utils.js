export const fmt = v => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',');

export const fmtHora = dt =>
  new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
