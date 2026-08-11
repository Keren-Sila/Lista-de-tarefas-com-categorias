import { carregarTarefas, salvarTarefas, removerTarefa } from '../../tarefasStorage.js';
import { exportarParaCalendario, compartilharTarefa } from '../../../../sync.js';

function tarefas() {
    const todasAsTarefas = carregarTarefas();
    const page = document.createElement('div');

    page.innerHTML = `
        <section class="tarefas-page page-enter">
            <div class="tarefas-header">
                <h1>Tarefas</h1>
                <button id="novaTarefa" class="btn-primary">➕ Nova Tarefa</button>
            </div>
            <div class="search-box glass">
                <input id="buscarTarefa" type="text" placeholder="Buscar tarefas...">
            </div>
            <div class="filters">
                <button class="filter-pill active" data-filter="todas">Todas</button>
                <button class="filter-pill" data-filter="hoje">Hoje</button>
                <button class="filter-pill" data-filter="semana">Semana</button>
                <button class="filter-pill" data-filter="alta">Alta</button>
                <button class="filter-pill" data-filter="faculdade">Faculdade</button>
            </div>
            <div id="listaTarefas" class="tarefas-container"></div>
        </section>
    `;

    const listaTarefasContainer = page.querySelector('#listaTarefas');

    function renderizarLista(tarefasParaRenderizar) {
        listaTarefasContainer.innerHTML = '';
        if (tarefasParaRenderizar.length === 0) {
            listaTarefasContainer.innerHTML = '<p class="empty-state">Nenhuma tarefa encontrada.</p>';
            return;
        }
        tarefasParaRenderizar.forEach(tarefa => {
            const card = document.createElement('div');
            card.innerHTML = cardTarefa(tarefa);
            const cardElement = card.firstElementChild;
            listaTarefasContainer.appendChild(cardElement);
            adicionarListenersAoCard(cardElement, tarefa);
        });
    }

    function adicionarListenersAoCard(card, tarefa) {
        // Checkbox
        const checkbox = card.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            tarefa.concluida = checkbox.checked;
            const tarefasAtuais = carregarTarefas();
            const index = tarefasAtuais.findIndex(t => t.id === tarefa.id);
            if (index !== -1) {
                tarefasAtuais[index].concluida = tarefa.concluida;
                salvarTarefas(tarefasAtuais);
            }
            card.classList.toggle('completed', tarefa.concluida);
        });

        // Swipe para excluir
        let startX = 0;
        card.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
        card.addEventListener("touchend", e => {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 80) { // Swipe para a esquerda
                card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                card.style.transform = 'translateX(-100%)';
                card.style.opacity = '0';
                setTimeout(() => {
                    removerTarefa(tarefa.id);
                    renderizarLista(carregarTarefas()); // Re-renderiza a lista
                }, 300);
            }
        });

        // Botão Calendário
        card.querySelector('.btn-calendar').addEventListener('click', () => {
            const menu = card.querySelector('.calendar-menu');
            menu.classList.toggle('visible');
        });

        // Ações do menu de calendário
        card.querySelectorAll('.calendar-menu button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede que o clique feche o menu imediatamente
                const provider = e.target.dataset.provider;
                exportarParaCalendario(tarefa, provider);
                card.querySelector('.calendar-menu').classList.remove('visible');
            });
        });

        // Botão Compartilhar
        card.querySelector('.btn-share').addEventListener('click', () => {
            if (navigator.share) {
                compartilharTarefa(tarefa).catch(console.error);
            } else {
                alert('A API de compartilhamento não é suportada neste navegador.');
            }
        });
    }

    // Lógica de busca
    const buscaInput = page.querySelector("#buscarTarefa");
    buscaInput.addEventListener("input", () => {
        const texto = buscaInput.value.toLowerCase();
        const filtradas = todasAsTarefas.filter(t =>
            t.titulo.toLowerCase().includes(texto) ||
            (t.descricao && t.descricao.toLowerCase().includes(texto))
        );
        renderizarLista(filtradas);
    });

    // Lógica de filtros
    const filterPills = page.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const filterType = pill.dataset.filter;
            let tarefasFiltradas = todasAsTarefas;

            if (filterType === 'alta') {
                tarefasFiltradas = todasAsTarefas.filter(t => t.prioridade === 'alta');
            } else if (filterType === 'faculdade') {
                tarefasFiltradas = todasAsTarefas.filter(t => t.categoria === 'Faculdade');
            } else if (filterType === 'hoje') {
                const hoje = new Date().toISOString().split("T")[0];
                tarefasFiltradas = todasAsTarefas.filter(t => t.data === hoje);
            }
            // Adicionar lógica para 'semana' se necessário

            renderizarLista(tarefasFiltradas);
        });
    });

    // Botão Nova Tarefa (ainda abre o modal antigo, pode ser refatorado)
    page.querySelector('#novaTarefa').addEventListener('click', () => {
        // A lógica do modal pode ser movida para um arquivo separado
        // e chamada aqui para manter este arquivo limpo.
        alert('Abertura do modal de "Nova Tarefa" a ser implementada.');
    });

    renderizarLista(todasAsTarefas);
    return page;
}

function cardTarefa(tarefa) {
    return `
        <article class="task-card priority-${tarefa.prioridade} fade-up" data-id="${tarefa.id}">
            <div class="task-header">
                <h3>${tarefa.titulo}</h3>
                <label class="check-container">
                    <input type="checkbox" ${tarefa.concluida ? "checked" : ""}>
                    <span class="checkmark"></span>
                </label>
            </div>
            <p class="task-description">${tarefa.descricao || ''}</p>
            <div class="task-meta">
                <span class="task-category">${tarefa.categoria}</span>
                <span class="task-date">${tarefa.data || 'Sem data'} • ${tarefa.horario || ''}</span>
            </div>
            <div class="task-actions">
                <button class="btn-secondary btn-calendar">📅 Calendário</button>
                <div class="calendar-menu">
                    <button data-provider="google">Google Calendar</button>
                    <button data-provider="outlook">Outlook</button>
                    <button data-provider="ics">Apple / Teams (.ics)</button>
                </div>
                <button class="btn-secondary btn-share">📤 Compartilhar</button>                
            </div>
        </article>
    `;
}

export default {
    url: '#tarefas',
    label: 'Tarefas',
    pagina: tarefas
};