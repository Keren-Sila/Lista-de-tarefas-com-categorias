// src/js/components/paginas/calendario.js
// Capítulo 8 da Apostila: Componente auto montável recebendo o elemento app
import { carregarTarefas, salvarTarefas } from '../services/tarefasStorage.js';
import { abrirModalTarefa } from '../modal/modalTarefa.js';

const diasSemana = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

const diasNomes = {
    segunda: "Segunda-feira",
    terca: "Terça-feira",
    quarta: "Quarta-feira",
    quinta: "Quinta-feira",
    sexta: "Sexta-feira",
    sabado: "Sábado",
    domingo: "Domingo"
};

async function calendario(app) {
    let tarefas = carregarTarefas();

    const concluidas = tarefas.filter(t => t.concluida).length;
    const progresso = tarefas.length ? Math.round((concluidas / tarefas.length) * 100) : 0;

    app.innerHTML = `
        <section class="calendar-page calendar-page-wrapper page-enter">
            <div class="calendar-header glass">
                <div class="header-titles">
                    <h1>📅 Planner & Calendário</h1>
                    <p>Organize sua semana por dias e turnos com arrastar e soltar (Drag and Drop).</p>
                </div>

                <div class="view-switchers">
                    <div class="view-mode-toggle">
                        <button class="view-btn active" data-view="semanal">Semanal</button>
                        <button class="view-btn" data-view="diario">Diário</button>
                        <button class="view-btn" data-view="mensal">Mensal</button>
                    </div>

                    <button id="btnCalendarioNovaTarefa" class="btn-primary">➕ Nova Tarefa</button>
                </div>
            </div>

            <div id="calendarViewContainer">
                ${renderVisaoSemanal(tarefas)}
            </div>

            <div class="calendar-footer card glass">
                <div class="footer-stat">
                    <strong>Carga da Semana:</strong> ${tarefas.length} tarefas planejadas
                </div>
                <div class="week-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width:${progresso}%"></div>
                    </div>
                    <span>${progresso}% da semana concluída</span>
                </div>
            </div>
        </section>
    `;

    const viewContainer = app.querySelector('#calendarViewContainer');
    const viewBtns = app.querySelectorAll('.view-btn');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const modo = btn.dataset.view;

            tarefas = carregarTarefas();
            if (modo === 'semanal') {
                viewContainer.innerHTML = renderVisaoSemanal(tarefas);
                iniciarDragAndDrop(app);
            } else if (modo === 'diario') {
                viewContainer.innerHTML = renderVisaoDiaria(tarefas);
            } else if (modo === 'mensal') {
                viewContainer.innerHTML = renderVisaoMensal(tarefas);
            }
        });
    });

    const btnNova = app.querySelector('#btnCalendarioNovaTarefa');
    if (btnNova) {
        btnNova.addEventListener('click', () => abrirModalTarefa(null, () => {
            tarefas = carregarTarefas();
            viewContainer.innerHTML = renderVisaoSemanal(tarefas);
            iniciarDragAndDrop(app);
        }));
    }

    iniciarDragAndDrop(app);
}

function renderVisaoSemanal(tarefas) {
    return `
        <div class="calendar-grid">
            ${diasSemana.map(dia => colunaDia(dia, tarefas)).join("")}
        </div>
    `;
}

function colunaDia(dia, tarefas) {
    const tarefasDoDia = tarefas.filter(t => t.diaSemana === dia);

    return `
        <div class="day-column card glass" data-day="${dia}">
            <div class="day-header">
                <span class="day-title">${diasNomes[dia]}</span>
                <span class="day-badge">${tarefasDoDia.length}</span>
            </div>
            <div class="day-content">
                ${tarefasDoDia.length > 0 ? tarefasDoDia.map(cardCalendario).join("") : '<div class="empty-day-drop">Solte tarefas aqui</div>'}
            </div>
        </div>
    `;
}

function cardCalendario(tarefa) {
    return `
        <div class="calendar-task priority-border-${tarefa.prioridade} ${tarefa.concluida ? 'completed' : ''}" draggable="true" data-id="${tarefa.id}">
            <div class="cal-task-top">
                <span class="calendar-time">⏰ ${tarefa.horario || "09:00"}</span>
                <span class="priority-dot priority-${tarefa.prioridade}"></span>
            </div>
            <strong class="cal-task-title">${tarefa.titulo}</strong>
            <div class="cal-task-bottom">
                <span class="cal-task-cat">#${tarefa.categoria}</span>
                ${tarefa.provedorReuniao ? `<span class="badge-provider mini provider-${tarefa.provedorReuniao.toLowerCase()}">📹 ${tarefa.provedorReuniao}</span>` : ''}
            </div>
        </div>
    `;
}

function renderVisaoDiaria(tarefas) {
    const hojeStr = new Date().toISOString().split("T")[0];
    const tarefasHoje = tarefas.filter(t => t.data === hojeStr || !t.data);

    const manha = tarefasHoje.filter(t => t.turno === 'manha' || (t.horario && parseInt(t.horario.split(':')[0]) < 12));
    const tarde = tarefasHoje.filter(t => t.turno === 'tarde' || (t.horario && parseInt(t.horario.split(':')[0]) >= 12 && parseInt(t.horario.split(':')[0]) < 18));
    const noite = tarefasHoje.filter(t => t.turno === 'noite' || (t.horario && parseInt(t.horario.split(':')[0]) >= 18));

    return `
        <div class="daily-view-container card glass">
            <h2>☀️ Visão Detalhada do Dia (${hojeStr})</h2>
            <div class="daily-shifts-grid">
                <div class="daily-shift-box">
                    <h3>🌅 Manhã (05h - 12h)</h3>
                    <div class="daily-tasks-list">
                        ${manha.length > 0 ? manha.map(t => cardCalendario(t)).join('') : '<p class="empty-shift">Sem tarefas para a manhã.</p>'}
                    </div>
                </div>

                <div class="daily-shift-box">
                    <h3>☀️ Tarde (12h - 18h)</h3>
                    <div class="daily-tasks-list">
                        ${tarde.length > 0 ? tarde.map(t => cardCalendario(t)).join('') : '<p class="empty-shift">Sem tarefas para a tarde.</p>'}
                    </div>
                </div>

                <div class="daily-shift-box">
                    <h3>🌙 Noite (18h - 23h59)</h3>
                    <div class="daily-tasks-list">
                        ${noite.length > 0 ? noite.map(t => cardCalendario(t)).join('') : '<p class="empty-shift">Sem tarefas para a noite.</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderVisaoMensal(tarefas) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const primeiroDiaMes = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    const diasGrid = [];
    for (let i = 0; i < primeiroDiaMes; i++) {
        diasGrid.push(null);
    }
    for (let d = 1; d <= totalDias; d++) {
        diasGrid.push(d);
    }

    const nomeMes = hoje.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    return `
        <div class="monthly-view-container card glass">
            <h2>🗓️ Calendário Mensal — ${nomeMes.toUpperCase()}</h2>
            <div class="month-grid-header">
                <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
            </div>
            <div class="month-grid">
                ${diasGrid.map(dia => {
                    if (!dia) return `<div class="month-cell empty"></div>`;
                    const diaFormatado = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
                    const count = tarefas.filter(t => t.data === diaFormatado).length;
                    const eHoje = dia === hoje.getDate();
                    return `
                        <div class="month-cell ${eHoje ? 'today' : ''}">
                            <span class="cell-day-num">${dia}</span>
                            ${count > 0 ? `<span class="cell-task-badge">${count} tarefas</span>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function iniciarDragAndDrop(container) {
    const colunas = container.querySelectorAll('.day-column');
    colunas.forEach(coluna => {
        coluna.addEventListener("dragover", e => {
            e.preventDefault();
            coluna.classList.add('drag-over');
        });

        coluna.addEventListener("dragleave", () => {
            coluna.classList.remove('drag-over');
        });

        coluna.addEventListener("drop", e => {
            e.preventDefault();
            coluna.classList.remove('drag-over');
            const id = e.dataTransfer.getData("text/plain");
            const novoDia = coluna.dataset.day;

            moverTarefaParaDia(id, novoDia);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
    });

    const cards = container.querySelectorAll('.calendar-task');
    cards.forEach(card => {
        card.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", card.dataset.id);
            setTimeout(() => card.classList.add('dragging'), 0);
        });
        card.addEventListener("dragend", () => {
            card.classList.remove('dragging');
        });
    });
}

function moverTarefaParaDia(id, novoDia) {
    const tarefas = carregarTarefas();
    const tarefaIndex = tarefas.findIndex(t => t.id === id);

    if (tarefaIndex !== -1) {
        tarefas[tarefaIndex].diaSemana = novoDia;
        salvarTarefas(tarefas);
    }
}

export default {
    url: "#calendario",
    label: "Calendário",
    pagina: calendario
};