import { carregarTarefas, salvarTarefas } from '../../tarefasStorage.js';

const dias = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function calendario() {
    const tarefas = carregarTarefas();
    const page = document.createElement('div');

    const concluidas = tarefas.filter(t => t.concluida).length;
    const progresso = tarefas.length ? Math.round((concluidas / tarefas.length) * 100) : 0;

    page.innerHTML = `
        <section class="calendar-page page-enter">
            <div class="calendar-header glass">
                <h1>📅 Planner Semanal</h1>
                <p>Organize sua semana com foco e produtividade</p>
            </div>
            <div class="calendar-grid">
                ${dias.map(dia => colunaDia(dia, tarefas)).join("")}
            </div>
            <div class="calendar-footer card">
                <strong>Carga da Semana:</strong> ${tarefas.length} tarefas planejadas
                <div class="week-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${progresso}%"></div>
                    </div>
                    <span>${progresso}% da semana concluída</span>
                </div>
            </div>
        </section>
    `;

    // Adicionar listeners de Drag and Drop
    const colunas = page.querySelectorAll('.day-column');
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

            // Re-renderiza a página para refletir a mudança
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
    });

    const cards = page.querySelectorAll('.calendar-task');
    cards.forEach(card => {
        card.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", card.dataset.id);
            setTimeout(() => card.classList.add('dragging'), 0);
        });
        card.addEventListener("dragend", () => {
            card.classList.remove('dragging');
        });
    });

    return page;
}

function colunaDia(dia, tarefas) {
    const tarefasDoDia = tarefas.filter(t => t.diaSemana === dia);

    return `
        <div class="day-column" data-day="${dia}">
            <div class="day-header">${capitalizar(dia)}</div>
            <div class="day-content">
                ${tarefasDoDia.map(cardCalendario).join("")}
            </div>
        </div>
    `;
}

function cardCalendario(tarefa) {
    return `
        <div class="calendar-task priority-${tarefa.prioridade}" draggable="true" data-id="${tarefa.id}">
            <span class="calendar-time">${tarefa.horario || "09:00"}</span>
            <strong>${tarefa.titulo}</strong>
            <small>${tarefa.categoria}</small>
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