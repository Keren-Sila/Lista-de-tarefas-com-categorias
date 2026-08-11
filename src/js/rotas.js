// Importa as páginas que serão usadas no roteamento
import dashboard from './components/paginas/dashboard.js';
import tarefas from './components/paginas/tarefas.js';
import categorias from './components/paginas/categorias.js';
import calendario from './components/paginas/calendario.js';
// import configuracoes from '../paginas/configuracoes.js';

// Mapeia as URLs (hash) para os módulos das páginas
export const rotas = {
    '#dashboard': dashboard,
    '#tarefas': tarefas,
    '#categorias': categorias,
    '#calendario': calendario,
    // '#configuracoes': configuracoes,
};

// Função principal do roteador
const rotear = () => {
    // Pega o hash da URL atual ou define '#dashboard' como padrão
    const url = window.location.hash || '#dashboard';
    const pagina = rotas[url];

    // Encontra o elemento onde o conteúdo da página será renderizado
    const appContainer = document.getElementById('app');

    if (pagina && typeof pagina.pagina === 'function') {
        // Limpa o container e renderiza a nova página
        appContainer.innerHTML = '';
        const pageElement = pagina.pagina();
        pageElement.classList.add('page-enter'); // Adiciona a classe de animação
        appContainer.appendChild(pageElement);
    } else {
        // Página de erro 404 simples ou redireciona para o dashboard
        window.location.hash = '#dashboard';
    }
};

// Exporta a função para ser usada no main.js e adiciona listeners
export const iniciarRoteador = () => {
    window.addEventListener('hashchange', rotear); // Ouve mudanças no hash
    window.addEventListener('load', rotear); // Roteia na carga inicial da página
};