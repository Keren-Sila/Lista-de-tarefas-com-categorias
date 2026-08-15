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

function getDatasDaSemana() {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay(); // 0 é Domingo, 1 é Segunda
    const distParaSegunda = (diaDaSemana === 0 ? -6 : 1 - diaDaSemana);

    const segunda = new Date(hoje);
    segunda.setDate(hoje.getDate() + distParaSegunda);

    const datas = {};
    diasSemana.forEach((key, idx) => {
        const d = new Date(segunda);
        d.setDate(segunda.getDate() + idx);
        const diaNum = String(d.getDate()).padStart(2, '0');
        const mesNome = d.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
        datas[key] = {
            formatado: `${diaNum} ${mesNome}`,
            iso: d.toISOString().split('T')[0],
            eHoje: d.toDateString() === hoje.toDateString()
        };
    });
    return datas;
}

async function calendario(app) {
    let tarefas = carregarTarefas();

    const concluidas = tarefas.filter(t => t.concluida).length;
    const progresso = tarefas.length ? Math.round((concluidas / tarefas.length) * 100) : 0;
    const datasSemana = getDatasDaSemana();

    app.innerHTML = `
        <section class="calendar-page calendar-page-wrapper page-enter">
            <!-- Header do Planner -->
            <div class="calendar-header glass">
                <div class="header-titles">
                    <div class="badge-status mb-2">
                        <span class="badge-dot"></span> Visão Semanal Inteligente
                    </div>
                    <h1><i data-lucide="calendar" style="width:26px;height:26px;vertical-align:middle;margin-right:6px;"></i> Planner & Calendário</h1>
                    <p>Gerencie seus compromissos da semana em linhas horizontais com arrastar e soltar e criação rápida por dia.</p>
                </div>

                <div class="view-switchers">
                    <div class="view-mode-toggle">
                        <button class="view-btn active" data-view="semanal" data-tooltip="Visão Semanal Horizontal">Semanal</button>
                        <button class="view-btn" data-view="diario" data-tooltip="Visão Diária por Turnos">Diário</button>
                        <button class="view-btn" data-view="mensal" data-tooltip="Visão Mensal">Mensal</button>
                    </div>
                </div>
            </div>

            <!-- Palco da Visão Ativa -->
            <div id="calendarViewContainer">
                ${renderVisaoSemanal(tarefas, datasSemana)}
            </div>

            <!-- Rodapé de Estatísticas -->
            <div class="calendar-footer card glass">
                <div class="footer-stat">
                    <strong>Carga da Semana:</strong> ${tarefas.length} tarefas (${concluidas} concluídas)
                </div>
                <div class="week-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width:${progresso}%"></div>
                    </div>
                    <span><strong>${progresso}%</strong> concluído</span>
                </div>
            </div>
        </section>
    `;

    const viewContainer = app.querySelector('#calendarViewContainer');
    const viewBtns = app.querySelectorAll('.view-btn');

    // Troca de Visões
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const modo = btn.dataset.view;

            tarefas = carregarTarefas();
            if (modo === 'semanal') {
                viewContainer.innerHTML = renderVisaoSemanal(tarefas, datasSemana);
            } else if (modo === 'diario') {
                viewContainer.innerHTML = renderVisaoDiaria(tarefas);
            } else if (modo === 'mensal') {
                viewContainer.innerHTML = renderVisaoMensal(tarefas);
            }

            configurarEventosCalendario(app, viewContainer);
            if (window.renderLucideIcons) window.renderLucideIcons();
        });
    });

    configurarEventosCalendario(app, viewContainer);
    if (window.renderLucideIcons) window.renderLucideIcons();
}

/* Renderização da Visão Semanal Horizontal */
function renderVisaoSemanal(tarefas, datasSemana) {
    return `
        <div class="calendar-horizontal-rows">
            ${diasSemana.map(dia => linhaDiaHorizontal(dia, tarefas, datasSemana[dia])).join("")}
        </div>
    `;
}

function linhaDiaHorizontal(dia, tarefas, infoData) {
    const tarefasDoDia = tarefas.filter(t => t.diaSemana === dia);

    return `
        <div class="day-row card glass ${infoData.eHoje ? 'is-today' : ''}" data-day="${dia}">
            <div class="day-row-header">
                <div class="day-row-title-box">
                    <div class="day-title-top">
                        <span class="day-row-title">${diasNomes[dia]}</span>
                        ${infoData.eHoje ? '<span class="badge-today"><span class="badge-dot"></span> HOJE</span>' : ''}
                    </div>
                    <div class="day-date-row">
                        <span class="day-date-tag">${infoData.formatado}</span>
                        <span class="day-row-count">${tarefasDoDia.length} ${tarefasDoDia.length === 1 ? 'atividade' : 'atividades'}</span>
                    </div>
                </div>
            </div>

            <div class="day-row-content">
                ${tarefasDoDia.length > 0 ? tarefasDoDia.map(cardCalendarioHorizontal).join("") : `
                    <div class="empty-day-drop-horizontal" data-day="${dia}">
                        <div class="empty-drop-content">
                            <span class="drop-icon"><i data-lucide="inbox" style="width:24px;height:24px;"></i></span>
                            <span>Nenhuma atividade agendada. Arraste ou solte uma tarefa aqui para este dia.</span>
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
}

function cardCalendarioHorizontal(tarefa) {
    return `
        <div class="calendar-task-horizontal priority-border-${tarefa.prioridade} ${tarefa.concluida ? 'completed' : ''}" draggable="true" data-id="${tarefa.id}">
            <label class="custom-checkbox" data-tooltip="Marcar/Desmarcar conclusão">
                <input type="checkbox" class="cal-task-checkbox" data-id="${tarefa.id}" ${tarefa.concluida ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>

            <div class="cal-task-main">
                <div class="cal-task-header-row">
                    <span class="calendar-time"><i data-lucide="clock" style="width:12px;height:12px;vertical-align:middle;margin-right:2px;"></i> ${tarefa.horario || "09:00"}</span>
                    <span class="priority-pill priority-pill-${tarefa.prioridade} mini">${tarefa.prioridade}</span>
                </div>
                <strong class="cal-task-title ${tarefa.concluida ? 'line-through' : ''}">${tarefa.titulo}</strong>
            </div>

            <div class="cal-task-tags">
                <span class="tag-category">#${tarefa.categoria}</span>
                ${tarefa.provedorReuniao ? `<span class="badge-provider mini provider-${tarefa.provedorReuniao.toLowerCase()}"><i data-lucide="video" style="width:12px;height:12px;vertical-align:middle;margin-right:2px;"></i> ${tarefa.provedorReuniao}</span>` : ''}
            </div>

            <div class="cal-task-actions">
                <button class="btn-icon btn-edit-cal-task" data-id="${tarefa.id}" data-tooltip="Editar detalhes"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                <button class="btn-icon btn-delete-cal-task" data-id="${tarefa.id}" data-tooltip="Excluir tarefa"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
            </div>
        </div>
    `;
}

function renderVisaoDiaria(tarefas) {
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split("T")[0];
    const dataLabel = hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    const tarefasHoje = tarefas.filter(t => (t.data === hojeStr || !t.data) && !t.concluida);

    const ordenarPorHorario = (lista) => [...lista].sort((a, b) => {
        const horaA = a.horario ? parseInt(a.horario.split(':')[0], 10) : 0;
        const horaB = b.horario ? parseInt(b.horario.split(':')[0], 10) : 0;
        return horaA - horaB;
    });

    const manha = ordenarPorHorario(tarefasHoje.filter(t => t.turno === 'manha' || (t.horario && parseInt(t.horario.split(':')[0], 10) < 12)));
    const tarde = ordenarPorHorario(tarefasHoje.filter(t => t.turno === 'tarde' || (t.horario && parseInt(t.horario.split(':')[0], 10) >= 12 && parseInt(t.horario.split(':')[0], 10) < 18)));
    const noite = ordenarPorHorario(tarefasHoje.filter(t => t.turno === 'noite' || (t.horario && parseInt(t.horario.split(':')[0], 10) >= 18)));

    return `
        <div class="calendar-daily-view card glass">
            <div class="daily-view-header">
                <h2><i data-lucide="sun" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;"></i> Visão Diária (${dataLabel})</h2>
                <span class="badge-count">${tarefasHoje.length} pendentes</span>
            </div>

            <div class="daily-shifts-grid">
                <div class="daily-shift-col">
                    <div class="shift-col-header">
                        <h3><i data-lucide="sun" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Manhã</h3>
                        <small>05:00 - 12:00</small>
                    </div>
                    <div class="shift-col-list">
                        ${manha.length > 0 ? manha.map(cardVisaoDiaria).join('') : '<p class="empty-shift-text">Sem tarefas na manhã</p>'}
                    </div>
                </div>

                <div class="daily-shift-col">
                    <div class="shift-col-header">
                        <h3><i data-lucide="sun-medium" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Tarde</h3>
                        <small>12:00 - 18:00</small>
                    </div>
                    <div class="shift-col-list">
                        ${tarde.length > 0 ? tarde.map(cardVisaoDiaria).join('') : '<p class="empty-shift-text">Sem tarefas na tarde</p>'}
                    </div>
                </div>

                <div class="daily-shift-col">
                    <div class="shift-col-header">
                        <h3><i data-lucide="moon" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Noite</h3>
                        <small>18:00 - 23:59</small>
                    </div>
                    <div class="shift-col-list">
                        ${noite.length > 0 ? noite.map(cardVisaoDiaria).join('') : '<p class="empty-shift-text">Sem tarefas na noite</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function cardVisaoDiaria(tarefa) {
    return `
        <div class="daily-task-card priority-border-${tarefa.prioridade}">
            <div class="daily-task-top">
                <span class="calendar-time"><i data-lucide="clock" style="width:12px;height:12px;vertical-align:middle;margin-right:2px;"></i> ${tarefa.horario || "09:00"}</span>
                <span class="priority-pill priority-pill-${tarefa.prioridade} mini">${tarefa.prioridade}</span>
            </div>
            <strong class="daily-task-title">${tarefa.titulo}</strong>
            <div class="daily-task-footer">
                <span class="tag-category">#${tarefa.categoria}</span>
                ${tarefa.provedorReuniao ? `<span class="badge-provider mini provider-${tarefa.provedorReuniao.toLowerCase()}"><i data-lucide="video" style="width:12px;height:12px;vertical-align:middle;margin-right:2px;"></i> ${tarefa.provedorReuniao}</span>` : ''}
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

function configurarEventosCalendario(app, viewContainer) {
    iniciarDragAndDrop(viewContainer);

    // Listener para checkboxes dentro dos cards
    viewContainer.querySelectorAll('.cal-task-checkbox').forEach(chk => {
        chk.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            const tarefas = carregarTarefas();
            const idx = tarefas.findIndex(t => t.id === id);
            if (idx !== -1) {
                tarefas[idx].concluida = e.target.checked;
                salvarTarefas(tarefas);
                const datasSemana = getDatasDaSemana();
                viewContainer.innerHTML = renderVisaoSemanal(tarefas, datasSemana);
                configurarEventosCalendario(app, viewContainer);
            }
        });
    });

    // Listener para edição de tarefas no calendário
    viewContainer.querySelectorAll('.btn-edit-cal-task').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            const tarefas = carregarTarefas();
            const tarefa = tarefas.find(t => t.id === id);
            if (tarefa) {
                abrirModalTarefa(tarefa, () => {
                    const tarefasAtualizadas = carregarTarefas();
                    const datasSemana = getDatasDaSemana();
                    viewContainer.innerHTML = renderVisaoSemanal(tarefasAtualizadas, datasSemana);
                    configurarEventosCalendario(app, viewContainer);
                });
            }
        });
    });

    // Listener para exclusão de tarefas no calendário
    viewContainer.querySelectorAll('.btn-delete-cal-task').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            if (confirm('Deseja realmente excluir esta tarefa?')) {
                let tarefas = carregarTarefas();
                tarefas = tarefas.filter(t => t.id !== id);
                salvarTarefas(tarefas);
                const datasSemana = getDatasDaSemana();
                viewContainer.innerHTML = renderVisaoSemanal(tarefas, datasSemana);
                configurarEventosCalendario(app, viewContainer);
            }
        });
    });
}

function iniciarDragAndDrop(container) {
    const elementosDia = container.querySelectorAll('.day-row, .empty-day-drop-horizontal');
    elementosDia.forEach(elem => {
        elem.addEventListener("dragover", e => {
            e.preventDefault();
            elem.classList.add('drag-over');
        });

        elem.addEventListener("dragleave", () => {
            elem.classList.remove('drag-over');
        });

        elem.addEventListener("drop", e => {
            e.preventDefault();
            elem.classList.remove('drag-over');
            const id = e.dataTransfer.getData("text/plain");
            const novoDia = elem.dataset.day;

            if (id && novoDia) {
                moverTarefaParaDia(id, novoDia);
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            }
        });
    });

    const cards = container.querySelectorAll('.calendar-task-horizontal');
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