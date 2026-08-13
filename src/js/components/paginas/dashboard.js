// src/js/components/paginas/dashboard.js
// Capítulo 8 da Apostila: Componente auto montável recebendo o elemento app
import { carregarTarefas, calcularEstatisticas, carregarCategorias } from "../services/tarefasStorage.js";
import { carregarUsuario } from "../services/authStorage.js";
import { abrirModalTarefa } from "../modal/modalTarefa.js";
import { exportarParaCalendario } from "../../../../sync.js";

function saudacao() {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
}

function obterHojeISO() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

async function dashboard(app) {
    const usuario = carregarUsuario();
    const tarefas = carregarTarefas();
    const stats = calcularEstatisticas(tarefas);
    const categorias = carregarCategorias();

    const hojeISO = obterHojeISO();
    const tarefasHoje = tarefas.filter(t => t.data === hojeISO || !t.data);

    // Agrupamento por Turnos (Manhã / Tarde / Noite)
    const manhaTasks = tarefasHoje.filter(t => t.turno === 'manha' || (t.horario && parseInt(t.horario.split(':')[0]) < 12));
    const tardeTasks = tarefasHoje.filter(t => t.turno === 'tarde' || (t.horario && parseInt(t.horario.split(':')[0]) >= 12 && parseInt(t.horario.split(':')[0]) < 18));
    const noiteTasks = tarefasHoje.filter(t => t.turno === 'noite' || (t.horario && parseInt(t.horario.split(':')[0]) >= 18));

    // Reuniões (Teams / Meet / Zoom)
    const reunioes = tarefas.filter(t => t.provedorReuniao || t.linkReuniao || t.categoria === 'Trabalho').slice(0, 3);

    app.innerHTML = `
        <section class="dashboard dashboard-wrapper page-enter">

            <!-- Banner Hero de Saudação e Produtividade -->
            <div class="dashboard-hero glass">
                <div class="hero-text">
                    <h1>${saudacao()}, ${usuario.nome.split(' ')[0]} 👋</h1>
                    <p>Aqui está o resumo da sua produtividade e compromissos de hoje.</p>
                </div>

                <div class="productivity-widget card">
                    <div class="widget-info">
                        <span class="widget-title">Widget de Produtividade</span>
                        <h3 class="widget-stat">${stats.concluidas} de ${stats.total} tarefas concluídas (${stats.progresso}%)</h3>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${stats.progresso}%;"></div>
                    </div>
                </div>

                <div class="quick-actions-bar">
                    <button id="btnDashboardNovaTarefa" class="btn-primary">
                        ➕ Nova Tarefa
                    </button>
                    <button id="btnSincronizarCalendarios" class="btn-secondary">
                        🔄 Sincronizar Calendários
                    </button>
                </div>
            </div>

            <!-- Dashboard Layout de 3 Colunas Desktop -->
            <div class="dashboard-3columns">

                <!-- Coluna 1: Agenda do Dia (Manhã / Tarde / Noite) -->
                <div class="dashboard-column agenda-column card">
                    <div class="column-header">
                        <h2>📅 Agenda do Dia</h2>
                        <span class="badge-count">${tarefasHoje.length} atividades</span>
                    </div>

                    <div class="shifts-container">
                        <div class="shift-group">
                            <div class="shift-title">
                                <span>🌅 Manhã</span>
                                <small>(05:00 - 12:00)</small>
                            </div>
                            <div class="shift-tasks">
                                ${manhaTasks.length > 0 ? manhaTasks.map(t => renderMiniTask(t)).join('') : '<p class="empty-shift">Nenhuma tarefa na manhã</p>'}
                            </div>
                        </div>

                        <div class="shift-group">
                            <div class="shift-title">
                                <span>☀️ Tarde</span>
                                <small>(12:00 - 18:00)</small>
                            </div>
                            <div class="shift-tasks">
                                ${tardeTasks.length > 0 ? tardeTasks.map(t => renderMiniTask(t)).join('') : '<p class="empty-shift">Nenhuma tarefa na tarde</p>'}
                            </div>
                        </div>

                        <div class="shift-group">
                            <div class="shift-title">
                                <span>🌙 Noite</span>
                                <small>(18:00 - 23:59)</small>
                            </div>
                            <div class="shift-tasks">
                                ${noiteTasks.length > 0 ? noiteTasks.map(t => renderMiniTask(t)).join('') : '<p class="empty-shift">Nenhuma tarefa na noite</p>'}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Coluna 2: Reuniões & Integrações (Teams / Meet / Zoom) -->
                <div class="dashboard-column meetings-column card">
                    <div class="column-header">
                        <h2>💬 Reuniões & Integrações</h2>
                        <span class="badge-count">${reunioes.length} agendadas</span>
                    </div>

                    <div class="meetings-list">
                        ${reunioes.length > 0 ? reunioes.map(r => `
                            <div class="meeting-card glass">
                                <div class="meeting-top">
                                    <span class="badge-provider provider-${(r.provedorReuniao || 'Teams').toLowerCase()}">
                                        ${r.provedorReuniao || 'Teams'}
                                    </span>
                                    <span class="meeting-time">⏰ ${r.horario || '14:00'}</span>
                                </div>
                                <h4 class="meeting-title">${r.titulo}</h4>
                                <p class="meeting-desc">${r.descricao || 'Sem descrição'}</p>

                                <div class="meeting-footer">
                                    <span class="countdown-timer">⏳ Em breve</span>
                                    <a href="${r.linkReuniao || 'https://teams.microsoft.com'}" target="_blank" rel="noopener" class="btn-join-call">
                                        📞 Entrar na chamada
                                    </a>
                                </div>
                            </div>
                        `).join('') : '<p class="empty-state">Nenhuma reunião pendente para hoje.</p>'}
                    </div>
                </div>

                <!-- Coluna 3: Categorias & Estatísticas -->
                <div class="dashboard-column categories-column card">
                    <div class="column-header">
                        <h2>📊 Categorias & Progresso</h2>
                        <a href="#categorias" class="link-see-all">Ver todas →</a>
                    </div>

                    <div class="categories-progress-list">
                        ${categorias.map(cat => {
                            const catTasks = tarefas.filter(t => t.categoria === cat.nome);
                            const catConcluidas = catTasks.filter(t => t.concluida).length;
                            const perc = catTasks.length ? Math.round((catConcluidas / catTasks.length) * 100) : 0;
                            return `
                                <div class="category-progress-item">
                                    <div class="cat-item-header">
                                        <span class="cat-name">${cat.icone || '🏷️'} ${cat.nome}</span>
                                        <span class="cat-perc">${perc}% (${catConcluidas}/${catTasks.length})</span>
                                    </div>
                                    <div class="progress-bar-container">
                                        <div class="progress-bar-fill" style="width: ${perc}%; background-color: ${cat.cor || '#4F46E5'};"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="stat-highlights">
                        <div class="stat-box primary">
                            <span class="stat-label">Tarefas Hoje</span>
                            <h3 class="stat-number">${stats.hoje}</h3>
                        </div>
                        <div class="stat-box success">
                            <span class="stat-label">Concluídas</span>
                            <h3 class="stat-number">${stats.concluidas}</h3>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    `;

    // Event listeners anexados pós-render
    const btnNova = app.querySelector('#btnDashboardNovaTarefa');
    if (btnNova) {
        btnNova.addEventListener('click', () => abrirModalTarefa());
    }

    const btnSync = app.querySelector('#btnSincronizarCalendarios');
    if (btnSync) {
        btnSync.addEventListener('click', () => {
            if (tarefasHoje.length > 0) {
                exportarParaCalendario(tarefasHoje[0], 'google');
            } else {
                alert('Nenhuma tarefa hoje para sincronizar.');
            }
        });
    }
}

function renderMiniTask(t) {
    return `
        <div class="mini-task-card priority-${t.prioridade} ${t.concluida ? 'completed' : ''}">
            <div class="mini-task-main">
                <span class="mini-task-time">${t.horario || '09:00'}</span>
                <strong class="mini-task-title">${t.titulo}</strong>
            </div>
            <span class="badge-priority priority-pill-${t.prioridade}">${t.prioridade}</span>
        </div>
    `;
}

export default {
    url: "#dashboard",
    label: "Dashboard",
    pagina: dashboard
};