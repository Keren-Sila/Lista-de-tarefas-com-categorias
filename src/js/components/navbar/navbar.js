import { rotas } from '../../rotas.js';

const createNavbar = () => {
    const sidebarContainer = document.getElementById('navbar');
    const topbarContainer = document.getElementById('clickup-topbar-container');
    const mobileTabsContainer = document.querySelector('.mobile-tabs');

    if (!sidebarContainer) return;

    // Renderiza a Sidebar Esquerda Completa
    sidebarContainer.className = 'clickup-sidebar';
    sidebarContainer.innerHTML = `
        <!-- Workspace Selector -->
        <div class="workspace-selector info-hover-box" data-tooltip="Seu espaço de trabalho no TaskFlow. Clique para selecionar ou alternar workspace.">
            <div class="workspace-title">
                <span>KS</span> Keren Silva's Workspace
            </div>
            <span style="font-size: 0.75rem; color: #94A3B8;">▼</span>
        </div>

        <!-- Botão Principal Criar -->
        <button class="btn-sidebar-create" id="btnSidebarCriarTarefa">
            <span>➕</span> Criar
        </button>

        <!-- Navegação Principal -->
        <ul class="sidebar-nav-list">
            <li>
                <a href="#dashboard" class="sidebar-nav-link" data-hash="#dashboard">
                    <span>🏠</span> Início
                </a>
            </li>
            <li>
                <a href="#calendario" class="sidebar-nav-link" data-hash="#calendario">
                    <span>📅</span> Planejador
                </a>
            </li>
            <li>
                <a href="#tarefas" class="sidebar-nav-link" data-hash="#tarefas">
                    <span>📋</span> Lista de Tarefas
                </a>
            </li>
            <li>
                <a href="#categorias" class="sidebar-nav-link" data-hash="#categorias">
                    <span>🏷️</span> Categorias
                </a>
            </li>
            <li>
                <a href="#configuracoes" class="sidebar-nav-link" data-hash="#configuracoes">
                    <span>⚙️</span> Ajustes & Sync
                </a>
            </li>
        </ul>

        <!-- Árvore de Espaços e Projetos -->
        <div class="sidebar-section-title">
            <span>Espaço da equipe</span>
            <span style="cursor: pointer;" title="Adicionar Novo Espaço">+</span>
        </div>
        <div class="sidebar-tree-item active" style="margin-left: 6px;">
            <span>📂</span> Projetos
        </div>
        <div class="sidebar-tree-item active" style="margin-left: 18px; font-weight: 600; color: #6366F1;">
            <span>⚡</span> Projeto 1
        </div>
        <div class="sidebar-tree-item" style="margin-left: 18px;">
            <span>⚡</span> Projeto 2
        </div>
        <div class="sidebar-tree-item" style="color: #64748B; margin-left: 6px;">
            <span>🚩</span> Get Started with ClickUp
        </div>
        <div class="sidebar-tree-item" style="color: #6366F1; font-weight: 500;">
            <span>+</span> Novo Espaço
        </div>

        <!-- Canais de Comunicação -->
        <div class="sidebar-section-title" style="margin-top: 14px;">
            <span>Canais</span>
            <span style="cursor: pointer;">+</span>
        </div>
        <div class="sidebar-tree-item">
            <span>#</span> Geral - Keren Silva's Workspace
        </div>
        <div class="sidebar-tree-item">
            <span>#</span> Welcome
        </div>
        <div class="sidebar-tree-item" style="color: #94A3B8;">
            <span>+</span> Adicionar canal
        </div>

        <!-- Mensagens Diretas -->
        <div class="sidebar-section-title" style="margin-top: 14px;">
            <span>Mensagens diretas</span>
            <span style="cursor: pointer;">+</span>
        </div>
        <div class="sidebar-tree-item">
            <span style="width: 8px; height: 8px; background: #10B981; border-radius: 50%; display: inline-block;"></span> Keren Silva — Você
        </div>
        <div class="sidebar-tree-item" style="color: #94A3B8;">
            <span>+</span> Nova mensagem
        </div>

        <!-- Rodapé da Sidebar -->
        <div style="margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-glass); font-size: 0.78rem; color: #94A3B8; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <span>⚙️</span> Personalizar a barra lateral
        </div>
    `;

    // Renderiza a Topbar Superior Completa (Banners, Buscador Global, Breadcrumb e Abas)
    if (topbarContainer) {
        topbarContainer.innerHTML = '';
        const topbar = document.createElement('div');
        topbar.className = 'clickup-topbar';

        topbar.innerHTML = `
            <!-- Linha 1: Pesquisa Global, Chats com IA e Perfil -->
            <div class="topbar-header-row">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="global-search-container info-hover-box" data-tooltip="Busca global rápida em todo o seu workspace (tarefas, projetos e categorias).">
                        <span style="color: #94A3B8;">🔍</span>
                        <input type="text" class="global-search-input" placeholder="Pesquisar Ctrl K">
                    </div>
                    <button class="ai-chat-btn info-hover-box" data-tooltip="Assistente de Inteligência Artificial para resumos de tarefas e sugestões de foco.">
                        <span>🌺</span> Chats com IA
                    </button>
                </div>

                <div class="topbar-user-profile">
                    <span style="background: rgba(16, 185, 129, 0.15); color: #10B981; font-size: 0.75rem; padding: 3px 8px; border-radius: 12px; font-weight: 600;">Habilitado</span>
                    <span style="background: #F1F5F9; color: #64748B; font-size: 0.75rem; padding: 3px 8px; border-radius: 12px;">Snooze</span>
                    <span style="cursor: pointer; font-size: 1.1rem;">📹</span>
                    <span style="cursor: pointer; font-size: 1.1rem;">📞</span>
                    <div class="user-avatar info-hover-box" data-tooltip="Sua conta: Keren Silva (Desenvolvedor Frontend)">KS</div>
                </div>
            </div>

            <!-- Linha 2: Banner de Notificações -->
            <div style="background: #EEF2FF; border: 1px solid #C7D2FE; padding: 6px 14px; border-radius: 8px; font-size: 0.82rem; color: #4338CA; display: flex; align-items: center; justify-content: space-between;">
                <span>🔔 Don't let important updates slip by. Enable real-time notifications.</span>
                <button id="topbarNotifyEnableBtn" style="background: #6366F1; color: white; border: none; padding: 3px 10px; border-radius: 6px; font-weight: 600; font-size: 0.75rem; cursor: pointer;">Habilitar</button>
            </div>

            <!-- Linha 3: Breadcrumb & Ações Rápidas -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 4px;">
                <div class="topbar-breadcrumb">
                    <span style="background: #EF4444; color: white; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: 700;">E</span> Espaço da equipe / <span>📁 Projetos</span> / <strong>⚡ Projeto 1</strong> ⭐
                </div>
                <div style="display: flex; gap: 8px; font-size: 0.8rem; color: #64748B;">
                    <span style="cursor: pointer; padding: 4px 8px; background: #F1F5F9; border-radius: 6px;">🤖 Agentes</span>
                    <span style="cursor: pointer; padding: 4px 8px; background: #F1F5F9; border-radius: 6px;">⚡ Automatizar</span>
                    <span style="cursor: pointer; padding: 4px 8px; background: #F1F5F9; border-radius: 6px;">🌺 Brain²</span>
                    <span style="cursor: pointer; padding: 4px 8px; background: #6366F1; color: white; border-radius: 6px; font-weight: 600;">👥 Compartilhar</span>
                </div>
            </div>

            <!-- Linha 4: Abas de Visualização & Ferramentas -->
            <div class="topbar-tabs-row" style="margin-top: 6px;">
                <ul class="view-tabs">
                    <li>
                        <a href="#tarefas" class="view-tab-link" data-hash="#tarefas">
                            <span>📋</span> Lista
                        </a>
                    </li>
                    <li>
                        <a href="#tarefas" class="view-tab-link" data-hash="#tarefas">
                            <span>📊</span> Quadro
                        </a>
                    </li>
                    <li>
                        <a href="#calendario" class="view-tab-link" data-hash="#calendario">
                            <span>📅</span> Calendário
                        </a>
                    </li>
                    <li>
                        <a href="#categorias" class="view-tab-link" data-hash="#categorias">
                            <span>🏷️</span> Categorias
                        </a>
                    </li>
                    <li>
                        <a href="#configuracoes" class="view-tab-link" data-hash="#configuracoes">
                            <span>⚙️</span> Tabela & Ajustes
                        </a>
                    </li>
                </ul>

                <div class="topbar-controls">
                    <button class="control-pill">🟣 Grupo: Status</button>
                    <button class="control-pill">🔗 Subtarefas</button>
                    <button class="control-pill">|| Colunas</button>
                    <button class="control-pill">🔍 Filtro</button>
                    <button class="control-pill" id="topbarAddBtn" style="background: var(--gradient-hero); color: white; border: none; font-weight: 600;">➕ Add Tarefa</button>
                </div>
            </div>
        `;

        topbarContainer.appendChild(topbar);
    }

    // Mobile Tabs
    if (mobileTabsContainer) {
        mobileTabsContainer.innerHTML = `
            <a href="#dashboard" class="mobile-tab">
                <span class="icon">🏠</span>
                <span>Início</span>
            </a>
            <a href="#tarefas" class="mobile-tab">
                <span class="icon">📋</span>
                <span>Lista</span>
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
    }

    // Eventos dos botões de adicionar tarefa
    const triggerNovaTarefa = () => {
        window.location.hash = '#tarefas';
        setTimeout(() => {
            const form = document.getElementById('formNovaTarefaContainer');
            if (form) form.style.display = 'block';
        }, 100);
    };

    sidebarContainer.querySelector('#btnSidebarCriarTarefa').addEventListener('click', triggerNovaTarefa);
    if (topbarContainer.querySelector('#topbarAddBtn')) {
        topbarContainer.querySelector('#topbarAddBtn').addEventListener('click', triggerNovaTarefa);
    }

    // Atualiza links ativos
    const updateActiveLink = () => {
        const currentHash = window.location.hash || '#dashboard';
        
        document.querySelectorAll('.sidebar-nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-hash') === currentHash);
        });

        document.querySelectorAll('.view-tab-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-hash') === currentHash);
        });

        document.querySelectorAll('.mobile-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('href') === currentHash);
        });
    };

    window.addEventListener('hashchange', updateActiveLink);
    window.addEventListener('load', updateActiveLink);
};

export { createNavbar };