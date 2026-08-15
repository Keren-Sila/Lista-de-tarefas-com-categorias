// src/js/components/navbar/navbar.js
// Capítulo 5 e 8 da Apostila - Navbar orientada a dados a partir do array de rotas
import { carregarUsuario } from '../services/authStorage.js';
import { abrirModalTarefa } from '../modal/modalTarefa.js';

export default function navbar(item_menu) {
    const navbarContainer = document.getElementById('navbar');
    const mobileTabsContainer = document.querySelector('.mobile-tabs');

    if (!navbarContainer) return;

    // --- Desktop Navbar ---
    const navLinksHTML = item_menu
        .filter(item => item.url !== '#login' && item.url !== '#perfil')
        .map(item => `
            <li class="navbar-item">
                <a href="${item.url}" class="navbar-link">${item.label}</a>
            </li>
        `).join('');

    const u = carregarUsuario();
    const avatarPadrao = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nome)}&background=4F46E5&color=fff&size=64`;

    navbarContainer.innerHTML = `
        <nav class="navbar glass">
            <a href="#dashboard" class="navbar-brand" data-tooltip="Painel Principal TaskFlow">
                <i data-lucide="zap" style="width:20px;height:20px;vertical-align:middle;margin-right:4px;"></i> Task<span>Flow</span>
            </a>

            <ul class="navbar-menu">
                ${navLinksHTML}
            </ul>

            <div class="navbar-right-actions">
                <button id="btnNavNovaTarefa" class="btn-primary btn-sm btn-nav-new" data-tooltip="Criar nova tarefa rapidamente">
                    <i data-lucide="plus" style="width:16px;height:16px;vertical-align:middle;"></i> Nova Tarefa
                </button>

                <a href="#perfil" class="navbar-user-badge" id="navbarUserBadge" data-tooltip="Ver e editar meu perfil">
                    <img src="${u.avatar || avatarPadrao}" alt="${u.nome}" class="navbar-avatar">
                    <span class="navbar-username">${u.nome.split(' ')[0]}</span>
                </a>
            </div>
        </nav>
    `;

    // Listener para o botão Nova Tarefa na Navbar
    const btnNavNova = navbarContainer.querySelector('#btnNavNovaTarefa');
    if (btnNavNova) {
        btnNavNova.addEventListener('click', () => abrirModalTarefa());
    }

    // --- Mobile Bottom Navigation Bar ---
    if (mobileTabsContainer) {
        mobileTabsContainer.innerHTML = `
            <a href="#dashboard" class="mobile-tab" data-tooltip="Home">
                <span class="icon"><i data-lucide="home"></i></span>
                <span>Home</span>
            </a>
            <a href="#calendario" class="mobile-tab" data-tooltip="Calendário">
                <span class="icon"><i data-lucide="calendar"></i></span>
                <span>Calendário</span>
            </a>
            <a href="#categorias" class="mobile-tab" data-tooltip="Categorias">
                <span class="icon"><i data-lucide="tag"></i></span>
                <span>Categorias</span>
            </a>
            <a href="#perfil" class="mobile-tab" data-tooltip="Meu Perfil">
                <span class="icon"><i data-lucide="user"></i></span>
                <span>Perfil</span>
            </a>
        `;
    }

    // --- Floating Action Button (FAB "+") Mobile ---
    let fab = document.getElementById('btnMobileFAB');
    if (!fab) {
        fab = document.createElement('button');
        fab.id = 'btnMobileFAB';
        fab.className = 'mobile-fab-btn';
        fab.innerHTML = '<i data-lucide="plus"></i>';
        fab.setAttribute('data-tooltip', 'Nova Tarefa');
        fab.title = 'Criar Nova Tarefa';
        fab.addEventListener('click', () => abrirModalTarefa());
        document.body.appendChild(fab);
    }

    if (window.renderLucideIcons) window.renderLucideIcons();

    // Função para atualizar o link ativo
    const updateActiveLink = () => {
        const currentHash = window.location.hash || '#dashboard';

        document.querySelectorAll('.navbar-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === currentHash);
        });

        document.querySelectorAll('.mobile-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('href') === currentHash);
        });

        const userBadge = document.getElementById('navbarUserBadge');
        if (userBadge) {
            userBadge.classList.toggle('active', currentHash === '#perfil');
        }
    };

    window.addEventListener('hashchange', updateActiveLink);
    window.addEventListener('load', updateActiveLink);
    updateActiveLink();
}

export function createNavbar(item_menu) {
    if (!item_menu) {
        import('../rotas/rotas.js').then(m => navbar(m.default));
    } else {
        navbar(item_menu);
    }
}