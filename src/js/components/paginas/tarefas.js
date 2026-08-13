// src/js/components/paginas/tarefas.js
// Capítulo 8 da Apostila: Componente auto montável recebendo o elemento app
import { carregarTarefas, salvarTarefas, removerTarefa, carregarCategorias, obterHojeISO } from '../services/tarefasStorage.js';
import { exportarParaCalendario, compartilharTarefa } from '../../../../sync.js';
import { abrirModalTarefa } from '../modal/modalTarefa.js';

async function tarefas(app) {
    let todasAsTarefas = carregarTarefas();
    const categorias = carregarCategorias();

    app.innerHTML = `
        <section class="tarefas-page tarefas-page-wrapper page-enter">
            <div class="tarefas-header">
                <div>
                    <h1>📋 Lista de Tarefas</h1>
                    <p class="subtitle">Organize, filtre e gerencie suas atividades em tempo real.</p>
                </div>
            </div>

            <!-- Busca e Filtros Clean -->
            <div class="search-and-filters card glass">
                <div class="search-box">
                    <span class="search-icon">🔍</span>
                    <input id="buscarTarefa" type="text" placeholder="Buscar tarefas por título ou descrição..." class="input-clean" data-tooltip="Digite para filtrar instantaneamente">
                </div>

                <div class="filter-pills-container">
                    <button class="filter-pill active" data-filter="todas" data-tooltip="Exibir todas as tarefas">Todas (${todasAsTarefas.length})</button>
                    <button class="filter-pill" data-filter="hoje" data-tooltip="Tarefas agendadas para hoje">Hoje</button>
                    <button class="filter-pill" data-filter="semana" data-tooltip="Tarefas desta semana">Esta Semana</button>
                    <button class="filter-pill" data-filter="urgente" data-tooltip="Filtrar por prioridade urgente">🔴 Urgentes</button>
                    <button class="filter-pill" data-filter="alta" data-tooltip="Filtrar por prioridade alta">🟠 Altas</button>
                    ${categorias.map(c => `<button class="filter-pill" data-filter="cat_${c.nome}" data-tooltip="Filtrar por ${c.nome}">${c.icone || '🏷️'} ${c.nome}</button>`).join('')}
                </div>
            </div>

            <!-- Container da Lista de Cards -->
            <div id="listaTarefas" class="tarefas-cards-grid"></div>
        </section>
    `;

    const listaTarefasContainer = app.querySelector('#listaTarefas');

    function renderizarLista(tarefasParaRenderizar) {
        listaTarefasContainer.innerHTML = '';
        if (tarefasParaRenderizar.length === 0) {
            listaTarefasContainer.innerHTML = `
                <div class="empty-state-card card">
                    <span class="empty-icon">📂</span>
                    <h3>Nenhuma tarefa encontrada</h3>
                    <p>Crie uma nova tarefa ou altere os filtros de busca.</p>
                    <button class="btn-primary btn-sm" id="btnEmptyNova">➕ Criar Tarefa</button>
                </div>
            `;
            const emptyBtn = listaTarefasContainer.querySelector('#btnEmptyNova');
            if (emptyBtn) {
                emptyBtn.addEventListener('click', () => abrirModalTarefa(null, () => renderizarLista(carregarTarefas())));
            }
            return;
        }

        tarefasParaRenderizar.forEach(tarefa => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = cardTarefaHTML(tarefa);
            const cardElement = wrapper.firstElementChild;
            listaTarefasContainer.appendChild(cardElement);
            adicionarListenersAoCard(cardElement, tarefa);
        });
    }

    function adicionarListenersAoCard(card, tarefa) {
        // Checkbox animado
        const checkbox = card.querySelector('.task-checkbox');
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

        // Botão Editar
        const btnEditar = card.querySelector('.btn-edit-task');
        if (btnEditar) {
            btnEditar.addEventListener('click', () => {
                abrirModalTarefa(tarefa, () => {
                    todasAsTarefas = carregarTarefas();
                    renderizarLista(todasAsTarefas);
                });
            });
        }

        // Botão Excluir
        const btnExcluir = card.querySelector('.btn-delete-task');
        if (btnExcluir) {
            btnExcluir.addEventListener('click', () => {
                if (confirm(`Deseja realmente excluir a tarefa "${tarefa.titulo}"?`)) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        removerTarefa(tarefa.id);
                        todasAsTarefas = carregarTarefas();
                        renderizarLista(todasAsTarefas);
                    }, 250);
                }
            });
        }

        // Swipe para excluir em mobile
        let startX = 0;
        card.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
        card.addEventListener("touchend", e => {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 90) {
                card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                card.style.transform = 'translateX(-100%)';
                card.style.opacity = '0';
                setTimeout(() => {
                    removerTarefa(tarefa.id);
                    todasAsTarefas = carregarTarefas();
                    renderizarLista(todasAsTarefas);
                }, 300);
            }
        });

        // Toggle do Menu de Calendário
        const btnCal = card.querySelector('.btn-calendar');
        if (btnCal) {
            btnCal.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = card.querySelector('.calendar-menu');
                document.querySelectorAll('.calendar-menu.visible').forEach(m => {
                    if (m !== menu) m.classList.remove('visible');
                });
                menu.classList.toggle('visible');
            });
        }

        // Itens do menu de calendário
        card.querySelectorAll('.calendar-menu button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const provider = e.target.dataset.provider;
                exportarParaCalendario(tarefa, provider);
                card.querySelector('.calendar-menu').classList.remove('visible');
            });
        });

        // Botão Compartilhar
        const btnShare = card.querySelector('.btn-share');
        if (btnShare) {
            btnShare.addEventListener('click', () => {
                compartilharTarefa(tarefa).catch(console.error);
            });
        }
    }

    // Busca e Filtros Instantâneos
    const buscaInput = app.querySelector("#buscarTarefa");
    if (buscaInput) {
        buscaInput.addEventListener("input", () => {
            todasAsTarefas = carregarTarefas();
            const texto = buscaInput.value.toLowerCase().trim();
            const filtradas = todasAsTarefas.filter(t =>
                t.titulo.toLowerCase().includes(texto) ||
                (t.descricao && t.descricao.toLowerCase().includes(texto)) ||
                (t.categoria && t.categoria.toLowerCase().includes(texto))
            );
            renderizarLista(filtradas);
        });
    }

    const filterPills = app.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const filterType = pill.dataset.filter;
            const hojeStr = obterHojeISO();
            todasAsTarefas = carregarTarefas();

            let tarefasFiltradas = todasAsTarefas;

            if (filterType === 'hoje') {
                tarefasFiltradas = todasAsTarefas.filter(t => t.data === hojeStr);
            } else if (filterType === 'semana') {
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                const inicioDaSemana = new Date(hoje);
                inicioDaSemana.setDate(hoje.getDate() - ((hoje.getDay() + 6) % 7));
                const fimDaSemana = new Date(inicioDaSemana);
                fimDaSemana.setDate(inicioDaSemana.getDate() + 6);

                tarefasFiltradas = todasAsTarefas.filter(t => {
                    if (!t.data) return false;
                    const dataDaTarefa = new Date(`${t.data}T00:00:00`);
                    return dataDaTarefa >= inicioDaSemana && dataDaTarefa <= fimDaSemana;
                });
            } else if (filterType === 'urgente') {
                tarefasFiltradas = todasAsTarefas.filter(t => t.prioridade === 'urgente');
            } else if (filterType === 'alta') {
                tarefasFiltradas = todasAsTarefas.filter(t => t.prioridade === 'alta');
            } else if (filterType.startsWith('cat_')) {
                const catNome = filterType.replace('cat_', '');
                tarefasFiltradas = todasAsTarefas.filter(t => t.categoria === catNome);
            }

            renderizarLista(tarefasFiltradas);
        });
    });

    const btnNova = app.querySelector('#btnNovaTarefaMain');
    if (btnNova) {
        btnNova.addEventListener('click', () => {
            abrirModalTarefa(null, () => {
                todasAsTarefas = carregarTarefas();
                renderizarLista(todasAsTarefas);
            });
        });
    }

    renderizarLista(todasAsTarefas);
}

function cardTarefaHTML(t) {
    const prioridadeLabels = {
        baixa: 'Baixa',
        media: 'Média',
        alta: 'Alta',
        urgente: 'Urgente'
    };

    return `
        <article class="task-card card glass priority-border-${t.prioridade} ${t.concluida ? 'completed' : ''}" data-id="${t.id}">
            <div class="task-card-header">
                <label class="custom-checkbox" data-tooltip="Marcar ou desmarcar conclusão">
                    <input type="checkbox" class="task-checkbox" ${t.concluida ? "checked" : ""}>
                    <span class="checkmark"></span>
                </label>

                <h3 class="task-title">${t.titulo}</h3>

                <div class="task-card-menu-actions">
                    <button class="btn-icon btn-edit-task" data-tooltip="Editar detalhes da tarefa">✏️</button>
                    <button class="btn-icon btn-delete-task" data-tooltip="Excluir esta tarefa">🗑️</button>
                </div>
            </div>

            ${t.descricao ? `<p class="task-desc">${t.descricao}</p>` : ''}

            <div class="task-tags-row">
                <span class="tag-category">#${t.categoria}</span>
                <span class="priority-pill priority-pill-${t.prioridade}">${prioridadeLabels[t.prioridade] || t.prioridade}</span>
                ${t.provedorReuniao ? `<span class="badge-provider provider-${t.provedorReuniao.toLowerCase()}">📹 ${t.provedorReuniao}</span>` : ''}
            </div>

            <div class="task-meta-footer">
                <span class="task-time-badge">
                    ⏰ ${t.data || 'Sem data'} ${t.horario ? `• ${t.horario}` : ''}
                </span>

                <div class="task-action-dropdowns">
                    <div class="calendar-export-wrapper">
                        <button class="btn-secondary btn-sm btn-calendar" data-tooltip="Exportar para seu aplicativo de agenda">📅 Calendário ▾</button>
                        <div class="calendar-menu">
                            <button data-provider="google">Google Calendar</button>
                            <button data-provider="outlook">Outlook</button>
                            <button data-provider="ics">Apple / Teams (.ics)</button>
                        </div>
                    </div>
                    <button class="btn-secondary btn-sm btn-share" data-tooltip="Compartilhar tarefa">📤 Share</button>
                </div>
            </div>
        </article>
    `;
}

export default {
    url: '#tarefas',
    label: 'Tarefas',
    pagina: tarefas
};