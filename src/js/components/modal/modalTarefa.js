// src/js/components/modal/modalTarefa.js
import { addTask, atualizarTarefa, carregarCategorias, calcularTurno, obterDiaSemana } from '../services/tarefasStorage.js';
import { scheduleNotification } from '/notificacoes.js';

export function abrirModalTarefa(tarefaParaEditar = null, onSaveCallback = null) {
    let modalExistente = document.getElementById('modal-tarefa-backdrop');
    if (modalExistente) {
        modalExistente.remove();
    }

    const categorias = carregarCategorias();
    const eEdicao = !!tarefaParaEditar;
    const hojeStr = new Date().toISOString().split('T')[0];

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-tarefa-backdrop';
    backdrop.className = 'modal-backdrop fade-up';

    backdrop.innerHTML = `
        <div class="modal-card glass">
            <div class="modal-header">
                <h2>${eEdicao ? '<i data-lucide="pencil" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;"></i> Editar Tarefa' : '<i data-lucide="plus" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;"></i> Nova Tarefa'}</h2>
                <button class="modal-close" id="btnFecharModal">&times;</button>
            </div>
            <form id="formTarefaModal" class="modal-body">
                <div class="form-group">
                    <label for="modalTitulo">Título da Tarefa *</label>
                    <input type="text" id="modalTitulo" placeholder="Ex: Reunião de Sprint, Estudar SPA..." value="${eEdicao ? tarefaParaEditar.titulo : ''}" required>
                </div>

                <div class="form-group">
                    <label for="modalDescricao">Descrição / Observações</label>
                    <textarea id="modalDescricao" rows="3" placeholder="Detalhes, tópicos ou notas da tarefa...">${eEdicao ? (tarefaParaEditar.descricao || '') : ''}</textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="modalCategoria">Categoria *</label>
                        <select id="modalCategoria" required>
                            ${categorias.map(c => `
                                <option value="${c.nome}" ${eEdicao && tarefaParaEditar.categoria === c.nome ? 'selected' : ''}>
                                    ${c.icone || '🏷️'} ${c.nome}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="modalPrioridade">Prioridade *</label>
                        <select id="modalPrioridade" required>
                            <option value="baixa" ${eEdicao && tarefaParaEditar.prioridade === 'baixa' ? 'selected' : ''}>🟢 Baixa</option>
                            <option value="media" ${!eEdicao || (tarefaParaEditar && tarefaParaEditar.prioridade === 'media') ? 'selected' : ''}>🟡 Média</option>
                            <option value="alta" ${eEdicao && tarefaParaEditar.prioridade === 'alta' ? 'selected' : ''}>🟠 Alta</option>
                            <option value="urgente" ${eEdicao && tarefaParaEditar.prioridade === 'urgente' ? 'selected' : ''}>🔴 Urgente</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="modalData">Data *</label>
                        <input type="date" id="modalData" value="${eEdicao ? tarefaParaEditar.data : hojeStr}" required>
                    </div>

                    <div class="form-group">
                        <label for="modalHorario">Horário *</label>
                        <input type="time" id="modalHorario" value="${eEdicao ? tarefaParaEditar.horario : '09:00'}" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="modalProvedor">Integração de Reunião</label>
                        <select id="modalProvedor">
                            <option value="" ${!eEdicao || !tarefaParaEditar.provedorReuniao ? 'selected' : ''}>Sem integração</option>
                            <option value="Teams" ${eEdicao && tarefaParaEditar.provedorReuniao === 'Teams' ? 'selected' : ''}>Microsoft Teams</option>
                            <option value="Meet" ${eEdicao && tarefaParaEditar.provedorReuniao === 'Meet' ? 'selected' : ''}>Google Meet</option>
                            <option value="Zoom" ${eEdicao && tarefaParaEditar.provedorReuniao === 'Zoom' ? 'selected' : ''}>Zoom</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="modalLinkReuniao">Link da Chamada (opcional)</label>
                        <input type="url" id="modalLinkReuniao" placeholder="https://..." value="${eEdicao ? (tarefaParaEditar.linkReuniao || '') : ''}">
                    </div>
                </div>

                <div class="form-checkbox">
                    <label>
                        <input type="checkbox" id="modalNotificacao" ${eEdicao && tarefaParaEditar.sincronizar ? 'checked' : 'checked'}>
                        <span><i data-lucide="bell" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Agendar lembrete no navegador</span>
                    </label>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-secondary" id="btnCancelarModal">Cancelar</button>
                    <button type="submit" class="btn-primary">${eEdicao ? 'Salvar Alterações' : 'Criar Tarefa'}</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(backdrop);
    if (window.renderLucideIcons) window.renderLucideIcons();

    const fechar = () => backdrop.remove();
    backdrop.querySelector('#btnFecharModal').addEventListener('click', fechar);
    backdrop.querySelector('#btnCancelarModal').addEventListener('click', fechar);
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) fechar();
    });

    const form = backdrop.querySelector('#formTarefaModal');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titulo = document.getElementById('modalTitulo').value.trim();
        const descricao = document.getElementById('modalDescricao').value.trim();
        const categoria = document.getElementById('modalCategoria').value;
        const prioridade = document.getElementById('modalPrioridade').value;
        const data = document.getElementById('modalData').value;
        const horario = document.getElementById('modalHorario').value;
        const provedorReuniao = document.getElementById('modalProvedor').value;
        const linkReuniao = document.getElementById('modalLinkReuniao').value.trim();
        const sincronizar = document.getElementById('modalNotificacao').checked;

        const turno = calcularTurno(horario);
        const diaSemana = obterDiaSemana(data);

        const dadosTarefa = {
            titulo,
            descricao,
            categoria,
            prioridade,
            data,
            horario,
            turno,
            diaSemana,
            provedorReuniao,
            linkReuniao,
            sincronizar,
            concluida: eEdicao ? tarefaParaEditar.concluida : false
        };

        if (eEdicao) {
            dadosTarefa.id = tarefaParaEditar.id;
            atualizarTarefa(dadosTarefa);
        } else {
            addTask(dadosTarefa);
        }

        if (sincronizar) {
            scheduleNotification(dadosTarefa);
        }

        fechar();

        if (typeof onSaveCallback === 'function') {
            onSaveCallback();
        } else {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
    });
}
