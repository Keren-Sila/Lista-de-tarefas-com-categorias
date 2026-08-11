// js/components/taskComponent.js
import { tarefasStorage } from '../tarefasStorage.js';

/**
 * Cria o elemento HTML para uma única tarefa.
 * @param {object} taskData - Objeto contendo os dados da tarefa.
 * @returns {HTMLElement} O elemento do card da tarefa.
 */
export const createTaskComponent = (taskData) => {
    const taskCard = document.createElement('div');
    const priorityClass = `priority-${taskData.priority.toLowerCase()}`;
    taskCard.className = `task-card ${taskData.completed ? 'completed' : ''} ${priorityClass}`;
    taskCard.dataset.taskId = taskData.id;

    // A estrutura interna usa CSS Grid para flexibilidade
    taskCard.innerHTML = `
        <!-- Checkbox customizado para concluir a tarefa -->
        <div class="task-checkbox-wrapper">
            <input type="checkbox" id="task-${taskData.id}" class="task-checkbox" ${taskData.completed ? 'checked' : ''}>
            <label for="task-${taskData.id}" class="task-checkbox-label">
                <!-- Ícone de check para a animação -->
                <svg class="check-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path></svg>
            </label>
        </div>

        <!-- Conteúdo principal da tarefa -->
        <div class="task-content">
            <p class="task-title">${taskData.title}</p>
            <div class="task-meta">
                <span class="task-category">${taskData.category}</span>
                <span class="task-time">${taskData.time}</span>
            </div>
        </div>

        <!-- Prioridade e ações -->
        <div class="task-actions">
            <span class="task-priority">${taskData.priority}</span>
            <div class="task-buttons">
                <button class="icon-button" title="Adicionar ao Calendário">
                    <!-- Placeholder para ícone de Calendário -->
                    <svg class="icon" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"></path></svg>
                </button>
                <button class="icon-button" title="Compartilhar Tarefa">
                    <!-- Placeholder para ícone de Compartilhar -->
                    <svg class="icon" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>
                </button>
            </div>
        </div>
    `;

    // Adiciona a interatividade ao checkbox
    const checkbox = taskCard.querySelector('.task-checkbox');
    checkbox.addEventListener('change', (event) => {
        const isCompleted = event.target.checked;
        const taskId = taskCard.dataset.taskId;

        // Atualiza o status no localStorage
        tarefasStorage.updateTaskStatus(taskId, isCompleted);

        // Atualiza o visual do card imediatamente
        taskCard.classList.toggle('completed', isCompleted);
    });

    return taskCard;
};