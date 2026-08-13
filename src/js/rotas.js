// Re-exporta a definição de rotas do componente central para compatibilidade
import roteador from './components/rotas/rotas.js';

export const rotas = roteador.reduce((acc, r) => {
    acc[r.url] = r;
    return acc;
}, {});

export default roteador;