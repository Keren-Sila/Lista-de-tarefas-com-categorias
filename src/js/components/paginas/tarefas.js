// js/components/paginas/tarefas.js
import { createTaskComponent } from '../taskComponent.js';
import { tarefasStorage } from '../../tarefasStorage.js';

const createTarefasPage = () => {
    // Busca as tarefas do localStorage através do nosso serviço
    const tarefas = tarefasStorage.getTarefas();

    const page = document.createElement('div');
    page.className = 'tarefas-page-container'; // Renomeado para evitar conflito

    // Cabeçalho da página com botão de adicionar
    const header = document.createElement('div');
    header.className = 'page-header';
    header.innerHTML = `
        <h1>Minhas Tarefas</h1>
        <button id="add-task-btn" class="btn btn-primary">Adicionar Tarefa</button>
    `;
    page.appendChild(header);

    const tarefasContainer = document.createElement('div');
    tarefasContainer.className = 'tarefas-container';
    tarefas.forEach(taskData => {
        const taskElement = createTaskComponent(taskData);
        tarefasContainer.appendChild(taskElement);
    });
    page.appendChild(tarefasContainer);

    // Lógica para abrir o modal
    header.querySelector('#add-task-btn').addEventListener('click', () => {
        showAddTaskModal(page);
    });

    return page;
};

const showAddTaskModal = (page) => {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal-content glass">
            <div class="modal-header">
                <h2>Nova Tarefa</h2>
                <button class="modal-close-btn">&times;</button>
            </div>
            <form id="add-task-form">
                <div class="form-group">
                    <label for="task-title">Título</label>
                    <input type="text" id="task-title" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="task-category">Categoria</label>
                    <select id="task-category" class="form-select">
                        <option>Faculdade</option>
                        <option>Trabalho</option>
                        <option>Estudos</option>
                        <option>Pessoal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="task-priority">Prioridade</label>
                    <select id="task-priority" class="form-select">
                        <option>Baixa</option>
                        <option>Média</option>
                        <option>Alta</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Salvar Tarefa</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Adiciona a classe para a animação de entrada
    setTimeout(() => modalOverlay.classList.add('visible'), 10);

    const closeModal = () => {
        modalOverlay.classList.remove('visible');
        setTimeout(() => modalOverlay.remove(), 300);
    };

    modalOverlay.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    modalOverlay.querySelector('#add-task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const novaTarefa = {
            title: document.getElementById('task-title').value,
            category: document.getElementById('task-category').value,
            priority: document.getElementById('task-priority').value,
            time: 'Hoje', // Simplificado
            completed: false,
        };

        tarefasStorage.addTask(novaTarefa);
        closeModal();
        // Força a recarga da página de tarefas para mostrar a nova tarefa
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    return page;
};

export default {
    url: '#tarefas',
    label: 'Tarefas',
    pagina: createTarefasPage
};