import { carregarTarefas, salvarTarefas } from '../../tarefasStorage.js';

const dias = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

function capitalizar(str) {
    const mapa = {
        segunda: "Segunda",
        terca: "Terça",
        quarta: "Quarta",
        quinta: "Quinta",
        sexta: "Sexta",
        sabado: "Sábado",
        domingo: "Domingo"
    };
    return mapa[str] || str;
}

function calendario() {
    const tarefas = carregarTarefas();
    const page = document.createElement('div');
    page.className = 'calendario-page-wrapper page-enter';

    const concluidas = tarefas.filter(t => t.concluida).length;
    const progresso = tarefas.length ? Math.round((concluidas / tarefas.length) * 100) : 0;

    page.innerHTML = `
        <section class="calendar-page">
            <div class="calendar-header glass info-hover-box" data-tooltip="Planejamento Semanal Inteligente no ClickUp. Arraste e solte tarefas entre os dias da semana." style="padding: 20px 24px; border-radius: 16px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div>
                    <h1 style="font-size: 1.5rem; font-weight: 800; color: #0F172A;">📅 Planner Semanal por Dias da Semana</h1>
                    <p style="color: #64748B; font-size: 0.95rem; margin-top: 4px;">
                        Arraste tarefas entre as colunas dos dias para remanejar sua agenda com facilidade.
                    </p>
                </div>
                <span class="info-badge">ℹ️ Drag & Drop: Arraste para mover o dia</span>
            </div>

            <div class="calendar-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                ${dias.map(dia => colunaDia(dia, tarefas)).join("")}
            </div>

            <div class="calendar-footer glass-card info-hover-box" data-tooltip="Resumo da carga horária e progresso semanal." style="margin-top: 20px; padding: 18px; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div>
                    <strong style="color: #0F172A;">Carga da Semana:</strong> 
                    <span style="color: var(--primary-color); font-weight: 700;">${tarefas.length} tarefas planejadas</span>
                </div>
                <div class="week-progress" style="display: flex; align-items: center; gap: 12px;">
                    <div class="progress-bar" style="width: 140px; background: #E2E8F0; height: 8px; border-radius: 999px; overflow: hidden;">
                        <div class="progress-fill" style="width:${progresso}%; background: var(--gradient-hero); height: 100%; border-radius: 999px;"></div>
                    </div>
                    <span style="font-size: 0.85rem; color: #475569; font-weight: 600;">${progresso}% concluído</span>
                </div>
            </div>
        </section>
    `;

    // Listeners Drag and Drop
    const colunas = page.querySelectorAll('.day-column');
    colunas.forEach(coluna => {
        coluna.addEventListener("dragover", e => {
            e.preventDefault();
            coluna.style.background = "#EEF2FF";
            coluna.style.borderColor = "var(--primary-color)";
        });

        coluna.addEventListener("dragleave", () => {
            coluna.style.background = "";
            coluna.style.borderColor = "";
        });

        coluna.addEventListener("drop", e => {
            e.preventDefault();
            coluna.style.background = "";
            coluna.style.borderColor = "";
            const id = e.dataTransfer.getData("text/plain");
            const novoDia = coluna.dataset.day;

            moverTarefaParaDia(id, novoDia);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
    });

    const cards = page.querySelectorAll('.calendar-task');
    cards.forEach(card => {
        card.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", card.dataset.id);
            setTimeout(() => card.style.opacity = "0.4", 0);
        });
        card.addEventListener("dragend", () => {
            card.style.opacity = "1";
        });
    });

    return page;
}

function colunaDia(dia, tarefas) {
    const tarefasDoDia = tarefas.filter(t => t.diaSemana === dia);

    return `
        <div class="day-column glass-card info-hover-box" data-tooltip="Coluna de ${capitalizar(dia)}. Solte tarefas aqui para reagendar." data-day="${dia}" style="padding: 14px; border-radius: 14px; min-height: 280px; display: flex; flex-direction: column; gap: 10px; background: #FFFFFF; border: 1px solid #E2E8F0;">
            <div class="day-header" style="font-weight: 700; font-size: 0.9rem; color: var(--primary-color); padding-bottom: 8px; border-bottom: 1px solid #F1F5F9; text-transform: uppercase;">
                ${capitalizar(dia)} (${tarefasDoDia.length})
            </div>
            <div class="day-content" style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                ${tarefasDoDia.map(cardCalendario).join("")}
            </div>
        </div>
    `;
}

function cardCalendario(tarefa) {
    const cor = tarefa.prioridade === 'alta' ? '#EF4444' : tarefa.prioridade === 'media' ? '#D97706' : '#059669';

    return `
        <div class="calendar-task priority-${tarefa.prioridade}" draggable="true" data-id="${tarefa.id}" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 3px solid ${cor}; padding: 10px; border-radius: 10px; cursor: grab;">
            <span class="calendar-time" style="font-size: 0.75rem; color: #64748B; display: block;">⏰ ${tarefa.horario || "09:00"}</span>
            <strong style="font-size: 0.85rem; color: #0F172A; display: block; margin: 2px 0;">${tarefa.titulo}</strong>
            <small style="font-size: 0.75rem; color: var(--primary-color); font-weight: 600;">🏷️ ${tarefa.categoria}</small>
        </div>
    `;
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