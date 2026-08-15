// src/js/components/navbar/navbar.js
import { carregarUsuario } from '../services/authStorage.js';
import { abrirModalTarefa } from '../modal/modalTarefa.js';

export default function navbar(item_menu) {
    const sidebarContainer = document.getElementById('sidebar');
    const mobileTabsContainer = document.querySelector('.mobile-tabs');

    const u = carregarUsuario();
    const avatarPadrao = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nome)}&background=7C5CFF&color=fff&size=64`;

    const menuItensFluxo = [
        { label: 'Início', url: '#dashboard', icon: 'layout-dashboard' },
        { label: 'Tarefas', url: '#tarefas', icon: 'check-square' },
        { label: 'Calendário', url: '#calendario', icon: 'calendar' },
        { label: 'Planejamento', url: '#planejamento', icon: 'kanban' },
        { label: 'Categorias', url: '#categorias', icon: 'layers' },
        { label: 'Estatísticas', url: '#estatisticas', icon: 'bar-chart-3' },
        { label: 'Notas', url: '#notas', icon: 'file-text' },
        { label: 'Sobre', url: '#sobre', icon: 'info' },
        { label: 'Configurações', url: '#perfil', icon: 'settings' }
    ];

    // --- Sidebar Desktop ---
    if (sidebarContainer) {
        sidebarContainer.innerHTML = `
            <div class="sidebar-top">
                <a href="#dashboard" class="sidebar-brand">
                    <div class="sidebar-brand-icon">
                        <i data-lucide="check-circle-2"></i>
                    </div>
                    <div>
                        <span class="sidebar-brand-title">Fluxo</span>
                        <span class="sidebar-brand-tagline">Se organize. Realize.</span>
                    </div>
                </a>

                <button id="btnSidebarNovaTarefa" class="sidebar-btn-new">
                    <i data-lucide="plus" style="width:18px;height:18px;"></i>
                    <span>Nova tarefa</span>
                </button>

                <ul class="sidebar-menu">
                    ${menuItensFluxo.map(item => `
                        <li class="sidebar-item">
                            <a href="${item.url}" class="sidebar-link" data-url="${item.url}">
                                <i data-lucide="${item.icon}"></i>
                                <span>${item.label}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <a href="#perfil" class="sidebar-user-card" id="sidebarUserBadge">
                <img src="${u.avatar || avatarPadrao}" alt="${u.nome}" class="sidebar-user-avatar">
                <div class="sidebar-user-info">
                    <span class="sidebar-user-name">${u.nome.split(' ')[0]}</span>
                    <span class="sidebar-user-role">Meu perfil</span>
                </div>
            </a>
        `;

        const btnSidebarNova = sidebarContainer.querySelector('#btnSidebarNovaTarefa');
        if (btnSidebarNova) {
            btnSidebarNova.addEventListener('click', () => abrirModalTarefa());
        }
    }

    // --- Mobile Bottom Navigation Bar (Dock Fiel à Referência) ---
    if (mobileTabsContainer) {
        mobileTabsContainer.innerHTML = `
            <a href="#dashboard" class="mobile-tab" data-tooltip="Início">
                <i data-lucide="layout-dashboard"></i>
                <span>Início</span>
            </a>
            <a href="#tarefas" class="mobile-tab" data-tooltip="Tarefas">
                <i data-lucide="check-square"></i>
                <span>Tarefas</span>
            </a>
            <button id="btnMobileCenterFAB" class="mobile-center-fab" title="Nova Tarefa">
                <i data-lucide="plus"></i>
            </button>
            <a href="#calendario" class="mobile-tab" data-tooltip="Calendário">
                <i data-lucide="calendar"></i>
                <span>Calendário</span>
            </a>
            <a href="#perfil" class="mobile-tab" data-tooltip="Mais">
                <i data-lucide="user"></i>
                <span>Mais</span>
            </a>
        `;

        const fabCenter = mobileTabsContainer.querySelector('#btnMobileCenterFAB');
        if (fabCenter) {
            fabCenter.addEventListener('click', () => abrirModalTarefa());
        }
    }

    const updateActiveLink = () => {
        const currentHash = window.location.hash || '#dashboard';

        document.querySelectorAll('.sidebar-link').forEach(link => {
            const isMatch = link.getAttribute('href') === currentHash || (currentHash === '#inicio' && link.getAttribute('href') === '#dashboard');
            link.classList.toggle('active', isMatch);
        });

        document.querySelectorAll('.mobile-tab').forEach(tab => {
            const isMatch = tab.getAttribute('href') === currentHash;
            tab.classList.toggle('active', isMatch);
        });
    };

    window.addEventListener('hashchange', updateActiveLink);
    updateActiveLink();

    if (window.renderLucideIcons) window.renderLucideIcons();
}