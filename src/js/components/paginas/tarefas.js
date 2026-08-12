import { carregarTarefas, salvarTarefas, addTask, removerTarefa } from '../../tarefasStorage.js';
import { exportarParaCalendario, compartilharTarefa } from '../../../../sync.js';

function tarefas() {
    const todasAsTarefas = carregarTarefas();
    const page = document.createElement('div');
    page.className = 'tarefas-page-wrapper page-enter';

    let filtroPrioridade = 'todas';
    let filtroDiaSemana = 'todos';

    page.innerHTML = `
        <section class="tarefas-page">
            <!-- HEADER CLICKUP COM CONTROLES DE FILTRO -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 4px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <h2 style="font-size: 1.3rem; font-weight: 800; color: #0F172A; margin: 0;">📁 Projeto 1 — Lista de Tarefas</h2>
                    <span class="info-badge">ℹ️ Visualização ClickUp</span>
                </div>
                <button id="btnAbrirModalCriar" class="btn-primary">➕ Add Tarefa</button>
            </div>

            <!-- FORMULÁRIO INLINE EXPANSÍVEL -->
            <div id="formNovaTarefaContainer" class="glass-card" style="display: none; padding: 20px; border-radius: 14px; margin-bottom: 14px; background: #FFFFFF; border: 1px solid var(--primary-color);">
                <h3 style="color: #0F172A; margin-bottom: 12px; font-size: 1rem; font-weight: 700;">✨ Criar Nova Tarefa</h3>
                <form id="formCriarTarefa" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                    <div>
                        <label style="display: block; font-size: 0.8rem; color: #64748B; margin-bottom: 4px; font-weight: 600;">Nome da Tarefa</label>
                        <input type="text" id="novoTitulo" required placeholder="Digite o nome da tarefa..." style="width: 100%; background: #F8FAFC; border: 1px solid #CBD5E1; padding: 8px 12px; border-radius: 8px; color: #0F172A;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.8rem; color: #64748B; margin-bottom: 4px; font-weight: 600;">Categoria</label>
                        <select id="novaCategoria" style="width: 100%; background: #F8FAFC; border: 1px solid #CBD5E1; padding: 8px 12px; border-radius: 8px; color: #0F172A;">
                            <option value="Trabalho">Trabalho</option>
                            <option value="Faculdade">Faculdade</option>
                            <option value="Pessoal">Pessoal</option>
                            <option value="Reuniões">Reuniões</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.8rem; color: #64748B; margin-bottom: 4px; font-weight: 600;">Dia da Semana</label>
                        <select id="novoDiaSemana" style="width: 100%; background: #F8FAFC; border: 1px solid #CBD5E1; padding: 8px 12px; border-radius: 8px; color: #0F172A;">
                            <option value="segunda">Segunda-feira</option>
                            <option value="terca">Terça-feira</option>
                            <option value="quarta">Quarta-feira</option>
                            <option value="quinta">Quinta-feira</option>
                            <option value="sexta">Sexta-feira</option>
                            <option value="sabado">Sábado</option>
                            <option value="domingo">Domingo</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.8rem; color: #64748B; margin-bottom: 4px; font-weight: 600;">Prioridade</label>
                        <select id="novaPrioridade" style="width: 100%; background: #F8FAFC; border: 1px solid #CBD5E1; padding: 8px 12px; border-radius: 8px; color: #0F172A;">
                            <option value="baixa">Baixa</option>
                            <option value="media" selected>Média</option>
                            <option value="alta">Alta</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.8rem; color: #64748B; margin-bottom: 4px; font-weight: 600;">Data de Vencimento</label>
                        <input type="date" id="novaData" style="width: 100%; background: #F8FAFC; border: 1px solid #CBD5E1; padding: 8px 12px; border-radius: 8px; color: #0F172A;">
                    </div>
                    <div style="grid-column: 1 / -1; display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px;">
                        <button type="button" id="btnCancelarCriar" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar Tarefa</button>
                    </div>
                </form>
            </div>

            <div class="workspace-summary">
                <div class="metric-card metric-blue">
                    <span class="metric-label">Total</span>
                    <strong id="summaryTotal">0</strong>
                </div>
                <div class="metric-card metric-purple">
                    <span class="metric-label">Alta Prioridade</span>
                    <strong id="summaryAlta">0</strong>
                </div>
                <div class="metric-card metric-green">
                    <span class="metric-label">Concluídas</span>
                    <strong id="summaryDone">0</strong>
                </div>
                <div class="metric-card metric-orange">
                    <span class="metric-label">Pendente</span>
                    <strong id="summaryPending">0</strong>
                </div>
            </div>

            <!-- CONTROLES DE BARRA DE BUSCA E FILTROS -->
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;" class="info-hover-box" data-tooltip="Busca rápida e filtragem inteligente por dia da semana e urgência.">
                <input id="buscarTarefa" type="text" placeholder="🔍 Pesquisar tarefas por nome ou categoria..." style="flex: 1; min-width: 240px; background: #FFFFFF; border: 1px solid #CBD5E1; padding: 8px 14px; border-radius: 8px; color: #0F172A; font-size: 0.9rem;">
                <div class="filters" style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <button class="filter-pill active" data-filter="todas">Todas</button>
                    <button class="filter-pill" data-filter="segunda">Segunda</button>
                    <button class="filter-pill" data-filter="terca">Terça</button>
                    <button class="filter-pill" data-filter="quarta">Quarta</button>
                    <button class="filter-pill" data-filter="quinta">Quinta</button>
                    <button class="filter-pill" data-filter="sexta">Sexta</button>
                    <button class="filter-pill" data-filter="alta">🔥 Alta</button>
                </div>
            </div>

            <!-- TABELA DE TAREFAS ESTILO CLICKUP WORKSPACE -->
            <div class="clickup-table-view" style="margin-top: 8px;">
                <!-- GRUPO: PENDENTE -->
                <div class="status-group-header">
                    <span>▼</span>
                    <span class="status-badge pendente">PENDENTE</span>
                    <span id="pendenteCount">0</span>
                </div>

                <!-- CABEÇALHO DA TABELA -->
                <div class="table-header-row">
                    <span>Nome</span>
                    <span>Responsável</span>
                    <span>Vencimento</span>
                    <span>Prioridade</span>
                    <span>Status</span>
                    <span>Sincronização</span>
                </div>

                <!-- LISTA DE LINHAS DE TAREFAS -->
                <div id="listaTarefas"></div>

                <!-- LINHA INLINE PARA ADICIONAR RÁPIDO -->
                <div class="inline-add-task-row" id="inlineAddTaskTrigger">
                    <span style="font-size: 1.1rem; color: #6366F1;">⭕</span>
                    <span style="font-size: 0.88rem; font-weight: 500;">Adicionar Tarefa...</span>
                </div>
            </div>
        </section>
    `;

    const listaContainer = page.querySelector('#listaTarefas');
    const pendenteCount = page.querySelector('#pendenteCount');
    const formContainer = page.querySelector('#formNovaTarefaContainer');
    const btnAbrir = page.querySelector('#btnAbrirModalCriar');
    const btnCancelar = page.querySelector('#btnCancelarCriar');
    const formCriar = page.querySelector('#formCriarTarefa');
    const inlineTrigger = page.querySelector('#inlineAddTaskTrigger');

    const toggleForm = () => {
        formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    };

    const abrirDetalheTarefa = (tarefa) => {
        const overlayExistente = document.querySelector('.task-modal-overlay');
        if (overlayExistente) overlayExistente.remove();

        const overlay = document.createElement('div');
        overlay.className = 'task-modal-overlay';
        overlay.innerHTML = `
            <div class="task-modal-panel">
                <div class="task-modal-header">
                    <div>
                        <span class="task-modal-tag">${tarefa.categoria || 'Geral'}</span>
                        <h3>${tarefa.titulo}</h3>
                    </div>
                    <button class="task-modal-close" aria-label="Fechar modal">✕</button>
                </div>

                <div class="task-detail-grid">
                    <div class="task-property">
                        <span>Prioridade</span>
                        <strong class="task-priority-badge ${tarefa.prioridade || 'media'}">${tarefa.prioridade || 'Média'}</strong>
                    </div>
                    <div class="task-property">
                        <span>Status</span>
                        <strong class="${tarefa.concluida ? 'task-status done' : 'task-status pending'}">${tarefa.concluida ? 'Concluída' : 'Pendente'}</strong>
                    </div>
                    <div class="task-property">
                        <span>Data</span>
                        <strong>${tarefa.data || 'Sem data'}</strong>
                    </div>
                    <div class="task-property">
                        <span>Horário</span>
                        <strong>${tarefa.horario || '14:00'}</strong>
                    </div>
                </div>

                <div class="task-modal-body">
                    <span class="task-section-label">Descrição</span>
                    <p>${tarefa.descricao || 'Sem descrição adicional para esta tarefa.'}</p>
                </div>

                <div class="task-modal-actions">
                    <button class="task-action-btn secondary" data-action="toggle-status">${tarefa.concluida ? 'Reabrir tarefa' : 'Marcar concluída'}</button>
                    <button class="task-action-btn primary" data-action="google">📅 Enviar para Google</button>
                    <button class="task-action-btn secondary" data-action="share">📤 Compartilhar</button>
                </div>
            </div>
        `;

        const closeBtn = overlay.querySelector('.task-modal-close');
        closeBtn.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) overlay.remove();
        });

        overlay.querySelector('[data-action="toggle-status"]').addEventListener('click', () => {
            const atuais = carregarTarefas();
            const idx = atuais.findIndex(item => item.id === tarefa.id);
            if (idx !== -1) {
                atuais[idx].concluida = !atuais[idx].concluida;
                salvarTarefas(atuais);
                overlay.remove();
                renderizar(carregarTarefas());
            }
        });

        overlay.querySelector('[data-action="google"]').addEventListener('click', () => {
            exportarParaCalendario(tarefa, 'google');
        });

        overlay.querySelector('[data-action="share"]').addEventListener('click', () => {
            compartilharTarefa(tarefa).catch(console.error);
        });

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('visible'));
    };

    btnAbrir.addEventListener('click', toggleForm);
    inlineTrigger.addEventListener('click', toggleForm);
    btnCancelar.addEventListener('click', () => formContainer.style.display = 'none');

    formCriar.addEventListener('submit', (e) => {
        e.preventDefault();
        const nova = {
            titulo: page.querySelector('#novoTitulo').value,
            categoria: page.querySelector('#novaCategoria').value,
            diaSemana: page.querySelector('#novoDiaSemana').value,
            prioridade: page.querySelector('#novaPrioridade').value,
            data: page.querySelector('#novaData').value || new Date().toISOString().split('T')[0],
            horario: '14:00',
            concluida: false,
            descricao: `Tarefa da categoria ${page.querySelector('#novaCategoria').value}`
        };
        addTask(nova);
        formContainer.style.display = 'none';
        formCriar.reset();
        renderizar(carregarTarefas());
    });

    function renderizar(lista) {
        listaContainer.innerHTML = '';

        let filtradas = lista;
        if (filtroPrioridade === 'alta') {
            filtradas = filtradas.filter(t => t.prioridade === 'alta');
        } else if (['segunda','terca','quarta','quinta','sexta','sabado','domingo'].includes(filtroDiaSemana)) {
            filtradas = filtradas.filter(t => t.diaSemana === filtroDiaSemana);
        }

        const pendentes = filtradas.filter(t => !t.concluida);
        const concluidas = filtradas.filter(t => t.concluida);
        const altaPrioridade = filtradas.filter(t => t.prioridade === 'alta' && !t.concluida);

        page.querySelector('#summaryTotal').textContent = filtradas.length;
        page.querySelector('#summaryAlta').textContent = altaPrioridade.length;
        page.querySelector('#summaryDone').textContent = concluidas.length;
        page.querySelector('#summaryPending').textContent = pendentes.length;
        pendenteCount.textContent = pendentes.length;

        if (filtradas.length === 0) {
            listaContainer.innerHTML = `
                <div style="padding: 24px; text-align: center; color: #64748B; font-size: 0.9rem;">
                    Nenhuma tarefa encontrada neste projeto.
                </div>
            `;
            return;
        }

        filtradas.forEach(t => {
            const row = document.createElement('div');
            row.className = `task-row ${t.concluida ? 'completed' : ''} info-hover-box`;
            row.setAttribute('data-tooltip', `Tarefa: ${t.titulo} • Clique no checkbox para alterar status ou exportar para calendários.`);

            const pCor = t.prioridade === 'alta' ? '#EF4444' : t.prioridade === 'media' ? '#D97706' : '#059669';
            const pBg = t.prioridade === 'alta' ? '#FEE2E2' : t.prioridade === 'media' ? '#FEF3C7' : '#D1FAE5';

            row.innerHTML = `
                <!-- COLUNA 1: NOME DA TAREFA -->
                <div class="task-title-cell">
                    <input type="checkbox" ${t.concluida ? 'checked' : ''} style="cursor: pointer; accent-color: #6366F1; width: 16px; height: 16px;">
                    <div style="display: flex; flex-direction: column;">
                        <span class="task-title-text" style="font-weight: 600; color: #0F172A; font-size: 0.9rem;">${t.titulo}</span>
                        <span style="font-size: 0.75rem; color: #64748B;">🏷️ ${t.categoria} • ${t.diaSemana ? t.diaSemana.toUpperCase() : 'SEMANA'}</span>
                    </div>
                </div>

                <!-- COLUNA 2: RESPONSÁVEL -->
                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #334155;">
                    <span style="width: 22px; height: 22px; border-radius: 50%; background: #6366F1; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700;">KS</span>
                    <span>Keren Silva</span>
                </div>

                <!-- COLUNA 3: VENCIMENTO -->
                <div style="font-size: 0.85rem; color: #64748B;">
                    📅 ${t.data || 'Sem data'}
                </div>

                <!-- COLUNA 4: PRIORIDADE -->
                <div>
                    <span style="font-size: 0.75rem; font-weight: 700; color: ${pCor}; background: ${pBg}; padding: 3px 8px; border-radius: 6px; text-transform: uppercase;">
                        ${t.prioridade || 'Média'}
                    </span>
                </div>

                <!-- COLUNA 5: STATUS -->
                <div>
                    <span style="font-size: 0.75rem; font-weight: 700; color: ${t.concluida ? '#059669' : '#D97706'}; background: ${t.concluida ? '#D1FAE5' : '#FEF3C7'}; padding: 3px 8px; border-radius: 6px;">
                        ${t.concluida ? 'Concluída' : 'Pendente'}
                    </span>
                </div>

                <!-- COLUNA 6: SINCRONIZAÇÃO EXTERNA -->
                <div style="display: flex; gap: 6px; align-items: center; position: relative;">
                    <button class="btn-secondary btn-sync-calendar" style="padding: 4px 8px; font-size: 0.75rem;">📅 Sync</button>
                    <div class="sync-dropdown" style="display: none; flex-direction: column; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 4px; position: absolute; top: 100%; right: 0; z-index: 50; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
                        <button data-provider="google" style="background: none; border: none; color: #0F172A; padding: 6px; text-align: left; font-size: 0.75rem; cursor: pointer;">🌐 Google</button>
                        <button data-provider="outlook" style="background: none; border: none; color: #0F172A; padding: 6px; text-align: left; font-size: 0.75rem; cursor: pointer;">📧 Outlook/Teams</button>
                        <button data-provider="ics" style="background: none; border: none; color: #0F172A; padding: 6px; text-align: left; font-size: 0.75rem; cursor: pointer;">📲 iCal (.ics)</button>
                    </div>
                    <button class="btn-secondary btn-share-row" style="padding: 4px 8px; font-size: 0.75rem;">📤</button>
                </div>
            `;

            row.addEventListener('click', (event) => {
                if (event.target.closest('button') || event.target.closest('input')) return;
                abrirDetalheTarefa(t);
            });

            // Checkbox handler
            const chk = row.querySelector('input[type="checkbox"]');
            chk.addEventListener('change', (event) => {
                event.stopPropagation();
                t.concluida = chk.checked;
                const atuais = carregarTarefas();
                const idx = atuais.findIndex(item => item.id === t.id);
                if (idx !== -1) {
                    atuais[idx].concluida = t.concluida;
                    salvarTarefas(atuais);
                }
                renderizar(carregarTarefas());
            });

            // Sync menu
            const btnSync = row.querySelector('.btn-sync-calendar');
            const drop = row.querySelector('.sync-dropdown');
            btnSync.addEventListener('click', (e) => {
                e.stopPropagation();
                drop.style.display = drop.style.display === 'flex' ? 'none' : 'flex';
            });

            drop.querySelectorAll('button').forEach(b => {
                b.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const provider = e.target.dataset.provider;
                    exportarParaCalendario(t, provider);
                    drop.style.display = 'none';
                });
            });

            const btnShare = row.querySelector('.btn-share-row');
            btnShare.addEventListener('click', () => {
                compartilharTarefa(t).catch(console.error);
            });

            listaContainer.appendChild(row);
        });
    }

    // Input de busca
    const buscaInput = page.querySelector("#buscarTarefa");
    buscaInput.addEventListener("input", () => {
        const txt = buscaInput.value.toLowerCase();
        const atuais = carregarTarefas();
        const res = atuais.filter(t => 
            t.titulo.toLowerCase().includes(txt) || 
            t.categoria.toLowerCase().includes(txt)
        );
        renderizar(res);
    });

    // Pílulas de Filtro
    page.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            page.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const f = pill.dataset.filter;
            if (f === 'alta') {
                filtroPrioridade = 'alta';
                filtroDiaSemana = 'todos';
            } else {
                filtroPrioridade = 'todas';
                filtroDiaSemana = f;
            }
            renderizar(carregarTarefas());
        });
    });

    renderizar(todasAsTarefas);
    return page;
}

export default {
    url: '#tarefas',
    label: 'Tarefas',
    pagina: tarefas
};