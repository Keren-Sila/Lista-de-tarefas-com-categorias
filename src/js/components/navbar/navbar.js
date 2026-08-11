// js/components/navbar/navbar.js
import { rotas } from '../../rotas.js';

const createNavbar = () => {
    const navbarContainer = document.getElementById('navbar');
    const mobileTabsContainer = document.querySelector('.mobile-tabs');

    // --- Desktop Navbar ---
    const nav = document.createElement('nav');
    nav.className = 'navbar';

    // Hide desktop navbar on smaller screens
    if (window.innerWidth <= 768) {
        nav.style.display = 'none';
    }

    // Cria a logo
    const brand = document.createElement('a');
    brand.href = '#dashboard';
    brand.className = 'navbar-brand';
    brand.innerHTML = 'Task<span>Flow</span>';
    nav.appendChild(brand);

    // Cria o menu de navegação
    const menu = document.createElement('ul');
    menu.className = 'navbar-menu';

    Object.values(rotas).forEach(rota => {
        const menuItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = rota.url;
        link.textContent = rota.label;
        link.className = 'navbar-link';
        menuItem.appendChild(link);
        menu.appendChild(menuItem);
    });

    nav.appendChild(menu);
    navbarContainer.appendChild(nav);

    // --- Mobile Tabs ---
    const mobileNavContent = `
        <a href="#dashboard" class="mobile-tab">
            <span class="icon">🏠</span>
            <span>Dashboard</span>
        </a>
        <a href="#tarefas" class="mobile-tab">
            <span class="icon">✅</span>
            <span>Tarefas</span>
        </a>
        <a href="#calendario" class="mobile-tab">
            <span class="icon">📅</span>
            <span>Agenda</span>
        </a>
        <a href="#categorias" class="mobile-tab">
            <span class="icon">🏷️</span>
            <span>Categorias</span>
        </a>
        <a href="#configuracoes" class="mobile-tab">
            <span class="icon">⚙️</span>
            <span>Ajustes</span>
        </a>
    `;
    mobileTabsContainer.innerHTML = mobileNavContent;

    // Função para atualizar o link ativo
    const updateActiveLink = () => {
        const currentHash = window.location.hash || '#dashboard';
        document.querySelectorAll('.navbar-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === currentHash);
        });
        document.querySelectorAll('.mobile-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('href') === currentHash);
        });
    };

    // Adiciona listeners para atualizar o link ativo
    window.addEventListener('hashchange', updateActiveLink);
    window.addEventListener('load', updateActiveLink);
};

export { createNavbar };