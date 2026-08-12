import { iniciarRoteador } from './rotas.js';
import { createNavbar } from './components/navbar/navbar.js';
import { carregarTarefas } from './tarefasStorage.js';

const THEME_KEY = 'taskflow_theme';

function aplicarTema(theme) {
    const themeName = theme === 'light' ? 'light' : 'dark';
    document.body.dataset.theme = themeName;
    localStorage.setItem(THEME_KEY, themeName);
}

function carregarTemaInicial() {
    const temaSalvo = localStorage.getItem(THEME_KEY);
    const temaPadrao = temaSalvo === 'light' ? 'light' : 'dark';
    aplicarTema(temaPadrao);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('TaskFlow — Smart Workspace Iniciado!');

    carregarTemaInicial();

    // Renderiza a barra lateral e topbar no estilo ClickUp
    createNavbar();

    // Inicia o roteador client-side SPA
    iniciarRoteador();

    // Inicializa a Paleta de Comandos Global (Ctrl + K)
    iniciarCommandPalette();
});

function iniciarCommandPalette() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'commandPaletteOverlay';

    modalOverlay.innerHTML = `
        <div class="modal-content command-palette-modal">
            <div class="command-palette-input-row">
                <span style="color: #6366F1; font-weight: 700; font-size: 1.1rem;">🔍</span>
                <input type="text" id="cmdSearchInput" class="command-palette-input" placeholder="Digite para buscar tarefas, páginas ou ações (Ctrl+K)...">
                <span style="font-size: 0.75rem; background: #E2E8F0; padding: 2px 6px; border-radius: 4px; color: #64748B;">ESC</span>
            </div>
            <div id="cmdResultsList" class="command-results-list"></div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    const input = modalOverlay.querySelector('#cmdSearchInput');
    const results = modalOverlay.querySelector('#cmdResultsList');

    const abrirCmd = () => {
        modalOverlay.classList.add('visible');
        input.value = '';
        renderCmdResults('');
        setTimeout(() => input.focus(), 50);
    };

    const fecharCmd = () => {
        modalOverlay.classList.remove('visible');
    };

    function renderCmdResults(termo) {
        results.innerHTML = '';
        const t = termo.toLowerCase().trim();

        const acoesFixas = [
            { icon: '➕', titulo: 'Nova Tarefa', sub: 'Criar uma nova tarefa no projeto', action: () => { window.location.hash = '#tarefas'; setTimeout(() => { const f = document.getElementById('formNovaTarefaContainer'); if (f) f.style.display = 'block'; }, 100); } },
            { icon: '🏠', titulo: 'Ir para Dashboard', sub: 'Painel principal de estatísticas', action: () => window.location.hash = '#dashboard' },
            { icon: '📅', titulo: 'Ir para Planner Semanal', sub: 'Visão de Segunda a Domingo', action: () => window.location.hash = '#calendario' },
            { icon: '🏷️', titulo: 'Ir para Categorias', sub: 'Progresso por área', action: () => window.location.hash = '#categorias' },
            { icon: '⚙️', titulo: 'Ir para Configurações', sub: 'Notificações e Sincronizações', action: () => window.location.hash = '#configuracoes' }
        ];

        const tarefas = carregarTarefas();
        const tarefasFiltradas = t ? tarefas.filter(item => item.titulo.toLowerCase().includes(t) || item.categoria.toLowerCase().includes(t)) : tarefas.slice(0, 4);

        acoesFixas.filter(a => !t || a.titulo.toLowerCase().includes(t)).forEach(item => {
            const row = document.createElement('div');
            row.className = 'command-result-item';
            row.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.1rem;">${item.icon}</span>
                    <div>
                        <strong style="font-size: 0.9rem; color: #0F172A; display: block;">${item.titulo}</strong>
                        <span style="font-size: 0.78rem; color: #64748B;">${item.sub}</span>
                    </div>
                </div>
                <span style="font-size: 0.75rem; color: #6366F1; font-weight: 600;">Ação</span>
            `;
            row.addEventListener('click', () => {
                fecharCmd();
                item.action();
            });
            results.appendChild(row);
        });

        if (tarefasFiltradas.length > 0) {
            const header = document.createElement('div');
            header.style.padding = '8px 14px 4px 14px';
            header.style.fontSize = '0.75rem';
            header.style.fontWeight = '700';
            header.style.color = '#94A3B8';
            header.style.textTransform = 'uppercase';
            header.textContent = 'Tarefas';
            results.appendChild(header);

            tarefasFiltradas.forEach(tf => {
                const row = document.createElement('div');
                row.className = 'command-result-item';
                row.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>📌</span>
                        <div>
                            <strong style="font-size: 0.9rem; color: #0F172A; display: block;">${tf.titulo}</strong>
                            <span style="font-size: 0.78rem; color: #64748B;">🏷️ ${tf.categoria} • 🗓️ ${tf.data || 'Sem data'}</span>
                        </div>
                    </div>
                    <span style="font-size: 0.75rem; color: #10B981; font-weight: 600;">Tarefa</span>
                `;
                row.addEventListener('click', () => {
                    fecharCmd();
                    window.location.hash = '#tarefas';
                });
                results.appendChild(row);
            });
        }
    }

    input.addEventListener('input', (e) => renderCmdResults(e.target.value));

    // Atalhos de Teclado (Ctrl + K e ESC)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (modalOverlay.classList.contains('visible')) {
                fecharCmd();
            } else {
                abrirCmd();
            }
        }
        if (e.key === 'Escape' && modalOverlay.classList.contains('visible')) {
            fecharCmd();
        }
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) fecharCmd();
    });

    // Delegar cliques da busca global na topbar
    document.addEventListener('click', (e) => {
        if (e.target.closest('.global-search-container') || e.target.closest('.global-search-input')) {
            abrirCmd();
        }
    });
}