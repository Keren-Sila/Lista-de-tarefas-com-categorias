// js/components/navbar/navbar.js
import { rotas } from '../../rotas.js';

const createNavbar = () => {
    const navbarContainer = document.getElementById('navbar');

    const nav = document.createElement('nav');
    nav.className = 'navbar';

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

    // Função para atualizar o link ativo
    const updateActiveLink = () => {
        const currentHash = window.location.hash || '#dashboard';
        document.querySelectorAll('.navbar-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === currentHash);
        });
    };

    // Adiciona listeners para atualizar o link ativo
    window.addEventListener('hashchange', updateActiveLink);
    window.addEventListener('load', updateActiveLink);
};

export { createNavbar };