// src/js/components/paginas/dashboard.js
import { carregarTarefas, calcularEstatisticas } from "../services/tarefasStorage.js";
import { carregarUsuario } from "../services/authStorage.js";
import { abrirModalTarefa } from "../modal/modalTarefa.js";

function obterDataExtensa() {
    const agora = new Date();
    const dataStr = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    return dataStr.charAt(0).toUpperCase() + dataStr.slice(1);
}

async function dashboard(app) {
    const usuario = carregarUsuario();
    const tarefas = carregarTarefas();
    const stats = calcularEstatisticas(tarefas);

    const dataExtensa = obterDataExtensa();
    const proximasTarefas = tarefas.slice(0, 4);

    const corCategorias = {
        'Trabalho': '#7C5CFF',
        'Estudos': '#FFD166',
        'Saúde': '#63D9B1',
        'Pessoal': '#FF8FA3',
        'Faculdade': '#5BA8FF'
    };

    app.innerHTML = `
        <section class="dashboard-fluxo-wrapper page-enter">

            <!-- Botão de Nova Tarefa Visível no Mobile (Idêntico ao Mockup) -->
            <button id="btnMobileTopNova" class="mobile-top-btn-new">
                <i data-lucide="plus" style="width:20px;height:20px;"></i>
                <span>+ Nova tarefa</span>
            </button>

            <!-- Header Neutro com Saudação & Busca -->
            <div class="fluxo-header-row">
                <div class="fluxo-greeting">
                    <h1>Olá! Que bom ter você aqui.</h1>
                    <p>${dataExtensa}</p>
                </div>

                <div class="fluxo-header-actions">
                    <div class="fluxo-search-box">
                        <i data-lucide="search"></i>
                        <input type="text" id="inputSearchHeader" placeholder="Buscar tarefas...">
                    </div>
                    <button class="fluxo-btn-icon" data-tooltip="Notificações" title="Notificações">
                        <i data-lucide="bell"></i>
                    </button>
                </div>
            </div>

            <!-- Grid de Resumo do Dia (KPIs Mobile Scrollable) -->
            <div class="fluxo-summary-grid">
                <div class="kpi-card">
                    <div class="kpi-icon-badge lavanda">
                        <i data-lucide="check-circle-2"></i>
                    </div>
                    <div class="kpi-info">
                        <strong>12</strong>
                        <span class="kpi-label">Tarefas hoje</span>
                        <span class="kpi-subtext">4 concluídas</span>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-icon-badge blue">
                        <i data-lucide="calendar"></i>
                    </div>
                    <div class="kpi-info">
                        <strong>5</strong>
                        <span class="kpi-label">Eventos</span>
                        <span class="kpi-subtext">esta semana</span>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-icon-badge mint">
                        <i data-lucide="trending-up"></i>
                    </div>
                    <div class="kpi-info">
                        <strong>68%</strong>
                        <span class="kpi-label">Produtividade</span>
                        <span class="kpi-subtext">esta semana</span>
                    </div>
                </div>

                <div class="kpi-card">
                    <div class="kpi-icon-badge yellow">
                        <i data-lucide="star"></i>
                    </div>
                    <div class="kpi-info">
                        <strong>7</strong>
                        <span class="kpi-label">Sequência</span>
                        <span class="kpi-subtext">dias em foco</span>
                    </div>
                </div>
            </div>

            <!-- Grid Principal de 3 Colunas (Empilhado no Mobile) -->
            <div class="fluxo-main-grid">

                <!-- Coluna 1: Próximas Tarefas -->
                <div class="fluxo-column-card">
                    <div class="column-card-header">
                        <h2>Próximas tarefas</h2>
                        <a href="#tarefas">Ver todas</a>
                    </div>

                    <div class="upcoming-tasks-list">
                        ${proximasTarefas.length > 0 ? proximasTarefas.map(t => `
                            <div class="upcoming-task-item">
                                <div class="task-item-left">
                                    <span class="category-indicator-bar" style="background-color: ${corCategorias[t.categoria] || '#7C5CFF'};"></span>
                                    <div class="task-item-info">
                                        <strong>${t.titulo}</strong>
                                        <small>${t.categoria || 'Geral'}</small>
                                    </div>
                                </div>
                                <span class="task-item-time">${t.horario || '09:00'}</span>
                            </div>
                        `).join('') : `
                            <div class="upcoming-task-item">
                                <div class="task-item-left">
                                    <span class="category-indicator-bar" style="background-color: #7C5CFF;"></span>
                                    <div class="task-item-info">
                                        <strong>Reunião com a equipe de design</strong>
                                        <small>Trabalho</small>
                                    </div>
                                </div>
                                <span class="task-item-time">09:00</span>
                            </div>
                            <div class="upcoming-task-item">
                                <div class="task-item-left">
                                    <span class="category-indicator-bar" style="background-color: #FFD166;"></span>
                                    <div class="task-item-info">
                                        <strong>Estudar JavaScript avançado</strong>
                                        <small>Estudos</small>
                                    </div>
                                </div>
                                <span class="task-item-time">14:00</span>
                            </div>
                            <div class="upcoming-task-item">
                                <div class="task-item-left">
                                    <span class="category-indicator-bar" style="background-color: #63D9B1;"></span>
                                    <div class="task-item-info">
                                        <strong>Academia</strong>
                                        <small>Saúde</small>
                                    </div>
                                </div>
                                <span class="task-item-time">18:00</span>
                            </div>
                        `}
                    </div>
                </div>

                <!-- Coluna 2: Planejamento Semanal em Blocos -->
                <div class="fluxo-column-card">
                    <div class="column-card-header">
                        <h2>Planejamento semanal</h2>
                        <a href="#planejamento">Ver semana completa</a>
                    </div>

                    <div class="weekly-days-row">
                        <div class="day-pill">SEG<span>11</span></div>
                        <div class="day-pill">TER<span>12</span></div>
                        <div class="day-pill active">QUA<strong>13</strong></div>
                        <div class="day-pill">QUI<span>14</span></div>
                        <div class="day-pill">SEX<span>15</span></div>
                        <div class="day-pill">SÁB<span>16</span></div>
                        <div class="day-pill">DOM<span>17</span></div>
                    </div>

                    <div class="weekly-blocks-grid">
                        <div class="weekly-block-item lavanda">
                            <span class="weekly-block-title">Reunião de projeto</span>
                            <span class="weekly-block-time">09:00 - 10:30</span>
                        </div>
                        <div class="weekly-block-item coral">
                            <span class="weekly-block-title">Entrega do relatório</span>
                            <span class="weekly-block-time">até 15:00</span>
                        </div>
                        <div class="weekly-block-item yellow">
                            <span class="weekly-block-title">Workshop</span>
                            <span class="weekly-block-time">14:00 - 17:00</span>
                        </div>
                        <div class="weekly-block-item mint">
                            <span class="weekly-block-title">Corrida no parque</span>
                            <span class="weekly-block-time">07:00 - 08:00</span>
                        </div>
                    </div>
                </div>

                <!-- Coluna 3: Calendário Mensal Compacto -->
                <div class="fluxo-column-card">
                    <div class="mini-calendar-header">
                        <span>Calendário</span>
                        <div>
                            <span style="color: #6B7280; font-size: 0.8rem; margin-right: 8px;">Agosto 2026</span>
                            <button class="btn-icon btn-sm" style="border:none;background:transparent;cursor:pointer;">‹</button>
                            <button class="btn-icon btn-sm" style="border:none;background:transparent;cursor:pointer;">›</button>
                        </div>
                    </div>

                    <div class="mini-calendar-grid">
                        <span class="cal-day-head">D</span><span class="cal-day-head">S</span><span class="cal-day-head">T</span><span class="cal-day-head">Q</span><span class="cal-day-head">Q</span><span class="cal-day-head">S</span><span class="cal-day-head">S</span>
                        <span class="cal-day-cell other-month">27</span><span class="cal-day-cell other-month">28</span><span class="cal-day-cell other-month">29</span><span class="cal-day-cell other-month">30</span><span class="cal-day-cell other-month">31</span><span class="cal-day-cell">1</span><span class="cal-day-cell">2</span>
                        <span class="cal-day-cell">3</span><span class="cal-day-cell">4</span><span class="cal-day-cell">5</span><span class="cal-day-cell">6</span><span class="cal-day-cell">7</span><span class="cal-day-cell">8</span><span class="cal-day-cell">9</span>
                        <span class="cal-day-cell">10</span><span class="cal-day-cell">11</span><span class="cal-day-cell">12</span><span class="cal-day-cell active">13</span><span class="cal-day-cell">14</span><span class="cal-day-cell">15</span><span class="cal-day-cell">16</span>
                    </div>

                    <div class="mini-agenda-section">
                        <div class="mini-agenda-title">Hoje - 13 de agosto</div>
                        <div class="mini-agenda-item">
                            <span class="mini-agenda-time">09:00</span>
                            <span class="mini-agenda-desc">Reunião com a equipe</span>
                        </div>
                        <div class="mini-agenda-item">
                            <span class="mini-agenda-time">14:00</span>
                            <span class="mini-agenda-desc">Estudar JavaScript</span>
                        </div>
                        <a href="#calendario" style="display:inline-block; font-size:0.75rem; color:#7C5CFF; font-weight:600; margin-top:8px; text-decoration:none;">Ver dia completo →</a>
                    </div>
                </div>

            </div>

            <!-- Área Inspiracional com Frase Motivacional -->
            <div class="inspirational-banner">
                <div class="quote-left">
                    <span class="quote-mark">“</span>
                    <span class="quote-text">Pequenas ações diárias, grandes transformações.</span>
                </div>
                <div class="quote-illustration">
                    <i data-lucide="sparkles"></i>
                </div>
            </div>

        </section>
    `;

    const btnTopNova = app.querySelector('#btnMobileTopNova');
    if (btnTopNova) {
        btnTopNova.addEventListener('click', () => abrirModalTarefa());
    }

    if (window.renderLucideIcons) window.renderLucideIcons();
}

export default {
    url: "#dashboard",
    label: "Dashboard",
    pagina: dashboard
};