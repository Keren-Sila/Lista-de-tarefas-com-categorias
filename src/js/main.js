import { iniciarRoteador } from './rotas.js';
import { createNavbar } from './components/navbar/navbar.js';

// Ponto de entrada da aplicação
document.addEventListener('DOMContentLoaded', () => {
    console.log('TaskFlow iniciado!');

    // Renderiza a barra de navegação
    createNavbar();

    // Inicia o roteador que controla a exibição das páginas
    iniciarRoteador();
    // Outras inicializações (ex: carregar navbar, verificar sessão) podem vir aqui
});