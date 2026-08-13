// src/js/tarefasStorage.js
var TAREFAS_KEY = "taskflow_tarefas";
var DADOS_INICIAIS = [
  {
    id: "task_169178230",
    titulo: "Finalizar dashboard premium",
    descricao: "Implementar as estat\xEDsticas din\xE2micas e o layout responsivo do painel principal.",
    categoria: "Faculdade",
    prioridade: "alta",
    data: "2024-05-21",
    // Use um formato YYYY-MM-DD para facilitar a ordenação
    horario: "14:00",
    diaSemana: "terca",
    concluida: false,
    sincronizar: true
  },
  {
    id: "task_169178231",
    titulo: "Reuni\xE3o com equipe de design",
    descricao: "Alinhar os pr\xF3ximos passos da interface do calend\xE1rio.",
    categoria: "Trabalho",
    prioridade: "media",
    data: "2024-05-22",
    horario: "10:00",
    diaSemana: "quarta",
    concluida: false,
    sincronizar: true
  }
];
function carregarTarefas() {
  const tarefas2 = localStorage.getItem(TAREFAS_KEY);
  if (!tarefas2) {
    salvarTarefas(DADOS_INICIAIS);
    return DADOS_INICIAIS;
  }
  return JSON.parse(tarefas2);
}
function salvarTarefas(tarefas2) {
  localStorage.setItem(TAREFAS_KEY, JSON.stringify(tarefas2));
}
function addTask(novaTarefa) {
  const tarefas2 = carregarTarefas();
  novaTarefa.id = `task_${(/* @__PURE__ */ new Date()).getTime()}`;
  tarefas2.push(novaTarefa);
  salvarTarefas(tarefas2);
}
function calcularEstatisticas(tarefas2) {
  const totalTarefas = tarefas2.length;
  const concluidas = tarefas2.filter((t) => t.concluida).length;
  const hoje = tarefas2.filter((t) => t.data && t.data.toLowerCase().includes("hoje")).length;
  const progresso = totalTarefas > 0 ? Math.round(concluidas / totalTarefas * 100) : 0;
  return {
    hoje,
    concluidas,
    progresso,
    total: totalTarefas
  };
}

// src/js/components/paginas/dashboard.js
function saudacao() {
  const hora = (/* @__PURE__ */ new Date()).getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}
function obterProximaTarefa(tarefas2) {
  const pendentes = tarefas2.filter((t) => !t.concluida);
  if (pendentes.length === 0) return null;
  return pendentes[0];
}
function cardEstatistica(titulo, valor, classe, tooltipTexto) {
  return `
        <div class="stat-card ${classe} info-hover-box" data-tooltip="${tooltipTexto}">
            <span class="stat-title">${titulo}</span>
            <h2 class="stat-value" data-value="${valor}">0</h2>
        </div>
    `;
}
function dashboard() {
  const tarefas2 = carregarTarefas();
  const stats = calcularEstatisticas(tarefas2);
  const proxima = obterProximaTarefa(tarefas2);
  const page = document.createElement("div");
  page.className = "dashboard-container page-enter";
  page.innerHTML = `
        <section class="dashboard">
            <div class="dashboard-hero fade-up info-hover-box" data-tooltip="Painel de vis\xE3o geral da semana e do trabalho ativo do projeto.">
                <div class="dashboard-hero-row">
                    <div>
                        <p class="eyebrow">TaskFlow Workspace</p>
                        <h1>${saudacao()}, Keren \u{1F44B}</h1>
                        <p>Seu fluxo de trabalho em foco: prioridade, execu\xE7\xE3o e acompanhamento em tempo real.</p>
                    </div>
                    <button class="btn-primary" onclick="window.location.hash = '#tarefas'">+ Criar tarefa</button>
                </div>
            </div>

            <div class="dashboard-grid fade-up">
                ${cardEstatistica("Tarefas Hoje", stats.hoje, "primary", "M\xE9trica de tarefas agendadas para hoje.")}
                ${cardEstatistica("Conclu\xEDdas", stats.concluidas, "success", "Tarefas finalizadas at\xE9 o momento.")}
                ${cardEstatistica("Reuni\xF5es", 3, "accent", "Compromissos sincronizados e agendados.")}
                ${cardEstatistica("Produtividade", `${stats.progresso}%`, "warning", "Percentual de avan\xE7o geral.")}
            </div>

            <div class="dashboard-panels fade-up">
                <div class="card dashboard-panel glass-card info-hover-box" data-tooltip="Tarefa mais urgente e priorit\xE1ria para execu\xE7\xE3o.">
                    <div class="panel-header">
                        <h3>\u{1F4CC} Pr\xF3xima tarefa</h3>
                        <span class="info-badge">Prioridade</span>
                    </div>

                    ${proxima ? `
                            <div class="next-task">
                                <strong>${proxima.titulo}</strong>
                                <p>${proxima.categoria} \u2022 ${proxima.prioridade || "M\xE9dia"}</p>
                                <span>\u{1F5D3}\uFE0F ${proxima.data || "Hoje"} \u2022 \u23F0 ${proxima.horario || "14:00"}</span>
                            </div>
                        ` : `
                            <p class="empty-state">Nenhuma tarefa pendente no momento. \u{1F389}</p>
                        `}
                </div>

                <div class="card dashboard-panel glass-card info-hover-box" data-tooltip="Acompanhamento do projeto e evolu\xE7\xE3o das \xE1reas de foco.">
                    <div class="panel-header">
                        <h3>\u{1F4C8} Fluxo da semana</h3>
                        <span class="info-badge">Status</span>
                    </div>

                    <div class="progress-block">
                        <div class="progress-label">
                            <span>Trabalho</span>
                            <strong>72%</strong>
                        </div>
                        <div class="progress-bar"><span style="width: 72%"></span></div>
                    </div>

                    <div class="progress-block">
                        <div class="progress-label">
                            <span>Faculdade</span>
                            <strong>54%</strong>
                        </div>
                        <div class="progress-bar"><span style="width: 54%"></span></div>
                    </div>

                    <div class="progress-block">
                        <div class="progress-label">
                            <span>Pessoal</span>
                            <strong>88%</strong>
                        </div>
                        <div class="progress-bar"><span style="width: 88%"></span></div>
                    </div>
                </div>
            </div>

            <div class="operation-grid">
                <div class="card quick-actions glass-card info-hover-box" data-tooltip="A\xE7\xF5es r\xE1pidas para navega\xE7\xE3o e produtividade.">
                    <div class="panel-header">
                        <h3>\u26A1 A\xE7\xF5es r\xE1pidas</h3>
                        <span class="info-badge">Atalhos</span>
                    </div>

                    <div class="actions-grid">
                        <a href="#tarefas" class="btn-primary">\u2795 Gerenciar tarefas</a>
                        <a href="#calendario" class="btn-secondary">\u{1F4C5} Agenda semanal</a>
                        <a href="#categorias" class="btn-secondary">\u{1F3F7}\uFE0F Categorias</a>
                        <a href="#configuracoes" class="btn-secondary">\u2699\uFE0F Ajustes</a>
                    </div>
                </div>

                <div class="card activity-panel glass-card info-hover-box" data-tooltip="Atividade recente do workspace e pr\xF3ximos passos.">
                    <div class="panel-header">
                        <h3>\u{1F9ED} Atividade recente</h3>
                        <span class="info-badge">Hoje</span>
                    </div>

                    <ul class="activity-list">
                        <li>
                            <span class="activity-dot purple"></span>
                            <div>
                                <strong>Dashboard atualizado</strong>
                                <small>10 minutos atr\xE1s</small>
                            </div>
                        </li>
                        <li>
                            <span class="activity-dot blue"></span>
                            <div>
                                <strong>Reuni\xE3o marcada com a equipe</strong>
                                <small>1 hora atr\xE1s</small>
                            </div>
                        </li>
                        <li>
                            <span class="activity-dot green"></span>
                            <div>
                                <strong>Rodada de revis\xE3o conclu\xEDda</strong>
                                <small>Hoje</small>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    `;
  iniciarAnimacaoContadores(page);
  return page;
}
function iniciarAnimacaoContadores(container) {
  const elementos = container.querySelectorAll("[data-value]");
  elementos.forEach((elemento) => {
    const valStr = String(elemento.dataset.value);
    const alvo = parseInt(valStr.replace("%", ""), 10);
    if (Number.isNaN(alvo)) return;
    let atual = 0;
    const incremento = Math.max(1, Math.ceil(alvo / 25));
    const timer = setInterval(() => {
      atual += incremento;
      if (atual >= alvo) {
        atual = alvo;
        clearInterval(timer);
      }
      elemento.textContent = valStr.includes("%") ? `${atual}%` : String(atual);
    }, 25);
  });
}
var dashboard_default = {
  url: "#dashboard",
  label: "Dashboard",
  pagina: dashboard
};

// sync.js
function formatarDataCalendario(data, horario) {
  const [ano, mes, dia] = data.split("-");
  const [hora, minuto] = horario.split(":");
  return new Date(ano, mes - 1, dia, hora, minuto);
}
function abrirGoogleCalendar(tarefa) {
  const inicio = formatarDataCalendario(tarefa.data, tarefa.horario);
  const fim = new Date(inicio.getTime() + 60 * 60 * 1e3);
  const formatar = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(tarefa.titulo)}&details=${encodeURIComponent(tarefa.descricao || "")}&dates=${formatar(inicio)}/${formatar(fim)}`;
  window.open(url, "_blank");
}
function abrirOutlook(tarefa) {
  const inicio = formatarDataCalendario(tarefa.data, tarefa.horario);
  const fim = new Date(inicio.getTime() + 60 * 60 * 1e3);
  const url = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(tarefa.titulo)}&body=${encodeURIComponent(tarefa.descricao || "")}&startdt=${inicio.toISOString()}&enddt=${fim.toISOString()}`;
  window.open(url, "_blank");
}
function gerarICS(tarefa) {
  const inicio = formatarDataCalendario(tarefa.data, tarefa.horario);
  const fim = new Date(inicio.getTime() + 60 * 60 * 1e3);
  const formatar = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  return `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${tarefa.titulo}
DESCRIPTION:${tarefa.descricao || ""}
DTSTART:${formatar(inicio)}
DTEND:${formatar(fim)}
END:VEVENT
END:VCALENDAR
`.trim();
}
function baixarICS(tarefa) {
  const conteudo = gerarICS(tarefa);
  const blob = new Blob([conteudo], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${tarefa.titulo}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
function exportarParaCalendario(tarefa, destino) {
  if (!tarefa.data || !tarefa.horario) {
    alert("Por favor, defina uma data e hor\xE1rio para a tarefa antes de exportar.");
    return;
  }
  switch (destino) {
    case "google":
      abrirGoogleCalendar(tarefa);
      break;
    case "outlook":
      abrirOutlook(tarefa);
      break;
    case "ics":
      baixarICS(tarefa);
      break;
  }
}
async function compartilharTarefa(tarefa) {
  if (!navigator.share) {
    alert("A API de compartilhamento n\xE3o \xE9 suportada neste navegador.");
    return;
  }
  await navigator.share({
    title: tarefa.titulo,
    text: `
${tarefa.titulo}

${tarefa.descricao || ""}

${tarefa.data} ${tarefa.horario}
        `.trim()
  });
}

// src/js/components/paginas/tarefas.js
var BOARD_COLUMNS = [
  { key: "todo", label: "\xC0 fazer", icon: "\u{1F4DD}", accent: "purple" },
  { key: "doing", label: "Fazendo", icon: "\u2699\uFE0F", accent: "blue" },
  { key: "review", label: "Revis\xE3o", icon: "\u{1F440}", accent: "amber" },
  { key: "done", label: "Conclu\xEDdo", icon: "\u2705", accent: "green" }
];
function normalizarStatus(tarefa) {
  if (tarefa.status) return tarefa.status;
  if (tarefa.concluida) return "done";
  return "todo";
}
function tarefas() {
  const todasAsTarefas = carregarTarefas();
  const page = document.createElement("div");
  page.className = "tarefas-page-wrapper page-enter";
  let filtroPrioridade = "todas";
  let filtroDiaSemana = "todos";
  let viewMode = "board";
  page.innerHTML = `
        <section class="tarefas-page">
            <div class="workspace-header glass-card">
                <div>
                    <p class="eyebrow">Workspace</p>
                    <h2>Projeto 1 \u2014 Opera\xE7\xE3o semanal</h2>
                </div>
                <button id="btnAbrirModalCriar" class="btn-primary">\u2795 Nova tarefa</button>
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
                    <span class="metric-label">Conclu\xEDdas</span>
                    <strong id="summaryDone">0</strong>
                </div>
                <div class="metric-card metric-orange">
                    <span class="metric-label">Pendentes</span>
                    <strong id="summaryPending">0</strong>
                </div>
            </div>

            <div class="toolbar glass-card">
                <input id="buscarTarefa" type="text" class="search-input" placeholder="Buscar por tarefa, categoria ou status..." />
                <div class="filters">
                    <button class="filter-pill active" data-filter="todas">Todas</button>
                    <button class="filter-pill" data-filter="segunda">Segunda</button>
                    <button class="filter-pill" data-filter="terca">Ter\xE7a</button>
                    <button class="filter-pill" data-filter="quarta">Quarta</button>
                    <button class="filter-pill" data-filter="quinta">Quinta</button>
                    <button class="filter-pill" data-filter="sexta">Sexta</button>
                    <button class="filter-pill" data-filter="alta">\u{1F525} Alta</button>
                </div>
                <div class="view-switch">
                    <button class="view-button active" data-view="board">Quadro</button>
                    <button class="view-button" data-view="list">Lista</button>
                </div>
            </div>

            <div class="kanban-shell glass-card">
                <div class="kanban-board" id="kanbanBoard"></div>
                <div class="task-list-view" id="taskListView"></div>
            </div>
        </section>

        <div id="taskCreateModal" class="task-create-modal hidden">
            <div class="task-create-panel">
                <div class="task-create-header">
                    <div>
                        <p class="eyebrow">Nova tarefa</p>
                        <h3>Criar tarefa do projeto</h3>
                    </div>
                    <button type="button" class="task-create-close" id="taskCreateClose">\u2715</button>
                </div>

                <form id="formCriarTarefa" class="task-create-form">
                    <div class="field-group field-full">
                        <label>Nome da tarefa</label>
                        <input type="text" id="novoTitulo" required placeholder="Ex.: Finalizar briefing de lan\xE7amento" />
                    </div>

                    <div class="field-group">
                        <label>Categoria</label>
                        <select id="novaCategoria">
                            <option value="Trabalho">Trabalho</option>
                            <option value="Faculdade">Faculdade</option>
                            <option value="Pessoal">Pessoal</option>
                            <option value="Reuni\xF5es">Reuni\xF5es</option>
                        </select>
                    </div>

                    <div class="field-group">
                        <label>Status</label>
                        <select id="novoStatus">
                            <option value="todo">\xC0 fazer</option>
                            <option value="doing">Fazendo</option>
                            <option value="review">Revis\xE3o</option>
                            <option value="done">Conclu\xEDdo</option>
                        </select>
                    </div>

                    <div class="field-group">
                        <label>Dia da semana</label>
                        <select id="novoDiaSemana">
                            <option value="segunda">Segunda-feira</option>
                            <option value="terca">Ter\xE7a-feira</option>
                            <option value="quarta">Quarta-feira</option>
                            <option value="quinta">Quinta-feira</option>
                            <option value="sexta">Sexta-feira</option>
                            <option value="sabado">S\xE1bado</option>
                            <option value="domingo">Domingo</option>
                        </select>
                    </div>

                    <div class="field-group">
                        <label>Prioridade</label>
                        <select id="novaPrioridade">
                            <option value="baixa">Baixa</option>
                            <option value="media" selected>M\xE9dia</option>
                            <option value="alta">Alta</option>
                        </select>
                    </div>

                    <div class="field-group">
                        <label>Data</label>
                        <input type="date" id="novaData" />
                    </div>

                    <div class="field-group field-full">
                        <label>Descri\xE7\xE3o</label>
                        <textarea id="novaDescricao" rows="3" placeholder="Descreva o contexto, objetivo ou entrega da tarefa..."></textarea>
                    </div>

                    <div class="task-create-actions">
                        <button type="button" id="btnCancelarCriar" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar tarefa</button>
                    </div>
                </form>
            </div>
        </div>
    `;
  const kanbanBoard = page.querySelector("#kanbanBoard");
  const taskListView = page.querySelector("#taskListView");
  const taskCreateModal = page.querySelector("#taskCreateModal");
  const formCriar = page.querySelector("#formCriarTarefa");
  const btnAbrir = page.querySelector("#btnAbrirModalCriar");
  const btnCancelar = page.querySelector("#btnCancelarCriar");
  const closeModalBtn = page.querySelector("#taskCreateClose");
  const abrirDetalheTarefa = (tarefa) => {
    const overlayExistente = document.querySelector(".task-modal-overlay");
    if (overlayExistente) overlayExistente.remove();
    const overlay = document.createElement("div");
    overlay.className = "task-modal-overlay";
    overlay.innerHTML = `
            <div class="task-modal-panel">
                <div class="task-modal-header">
                    <div>
                        <span class="task-modal-tag">${tarefa.categoria || "Geral"}</span>
                        <h3>${tarefa.titulo}</h3>
                    </div>
                    <button class="task-modal-close" aria-label="Fechar modal">\u2715</button>
                </div>

                <div class="task-detail-grid">
                    <div class="task-property">
                        <span>Prioridade</span>
                        <strong class="task-priority-badge ${tarefa.prioridade || "media"}">${tarefa.prioridade || "M\xE9dia"}</strong>
                    </div>
                    <div class="task-property">
                        <span>Status</span>
                        <strong class="${tarefa.concluida ? "task-status done" : "task-status pending"}">${normalizarStatus(tarefa) === "done" ? "Conclu\xEDda" : "Pendente"}</strong>
                    </div>
                    <div class="task-property">
                        <span>Data</span>
                        <strong>${tarefa.data || "Sem data"}</strong>
                    </div>
                    <div class="task-property">
                        <span>Hor\xE1rio</span>
                        <strong>${tarefa.horario || "14:00"}</strong>
                    </div>
                </div>

                <div class="task-modal-body">
                    <span class="task-section-label">Descri\xE7\xE3o</span>
                    <p>${tarefa.descricao || "Sem descri\xE7\xE3o adicional para esta tarefa."}</p>
                </div>

                <div class="task-modal-actions">
                    <button class="task-action-btn secondary" data-action="toggle-status">${normalizarStatus(tarefa) === "done" ? "Reabrir tarefa" : "Marcar conclu\xEDda"}</button>
                    <button class="task-action-btn primary" data-action="google">\u{1F4C5} Enviar para Google</button>
                    <button class="task-action-btn secondary" data-action="share">\u{1F4E4} Compartilhar</button>
                </div>
            </div>
        `;
    const closeBtn = overlay.querySelector(".task-modal-close");
    closeBtn.addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) overlay.remove();
    });
    overlay.querySelector('[data-action="toggle-status"]').addEventListener("click", () => {
      const atuais = carregarTarefas();
      const idx = atuais.findIndex((item) => item.id === tarefa.id);
      if (idx !== -1) {
        atuais[idx].concluida = !atuais[idx].concluida;
        atuais[idx].status = atuais[idx].concluida ? "done" : "todo";
        salvarTarefas(atuais);
        overlay.remove();
        renderizar(carregarTarefas());
      }
    });
    overlay.querySelector('[data-action="google"]').addEventListener("click", () => {
      exportarParaCalendario(tarefa, "google");
    });
    overlay.querySelector('[data-action="share"]').addEventListener("click", () => {
      compartilharTarefa(tarefa).catch(console.error);
    });
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("visible"));
  };
  function abrirModalCriacao() {
    taskCreateModal.classList.remove("hidden");
    setTimeout(() => page.querySelector("#novoTitulo").focus(), 120);
  }
  function fecharModalCriacao() {
    taskCreateModal.classList.add("hidden");
    formCriar.reset();
  }
  btnAbrir.addEventListener("click", abrirModalCriacao);
  btnCancelar.addEventListener("click", fecharModalCriacao);
  closeModalBtn.addEventListener("click", fecharModalCriacao);
  taskCreateModal.addEventListener("click", (event) => {
    if (event.target === taskCreateModal) fecharModalCriacao();
  });
  formCriar.addEventListener("submit", (event) => {
    event.preventDefault();
    const nova = {
      titulo: page.querySelector("#novoTitulo").value.trim(),
      categoria: page.querySelector("#novaCategoria").value,
      diaSemana: page.querySelector("#novoDiaSemana").value,
      prioridade: page.querySelector("#novaPrioridade").value,
      data: page.querySelector("#novaData").value || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      horario: "14:00",
      concluida: false,
      status: page.querySelector("#novoStatus").value,
      descricao: page.querySelector("#novaDescricao").value || `Tarefa da categoria ${page.querySelector("#novaCategoria").value}`
    };
    if (!nova.titulo) return;
    addTask(nova);
    fecharModalCriacao();
    renderizar(carregarTarefas());
  });
  function criarCardTarefa(tarefa) {
    const status = normalizarStatus(tarefa);
    const badgeClass = tarefa.prioridade === "alta" ? "priority-high" : tarefa.prioridade === "media" ? "priority-medium" : "priority-low";
    return `
            <article class="board-card ${status}" data-id="${tarefa.id}">
                <div class="board-card-header">
                    <span class="board-tag">${tarefa.categoria || "Geral"}</span>
                    <button class="mini-action" data-action="detail" data-id="${tarefa.id}">\u22EF</button>
                </div>
                <h4>${tarefa.titulo}</h4>
                <p>${tarefa.descricao || "Sem descri\xE7\xE3o adicional."}</p>
                <div class="card-meta">
                    <span>\u{1F4C5} ${tarefa.data || "Sem data"}</span>
                    <span>\u23F0 ${tarefa.horario || "14:00"}</span>
                </div>
                <div class="board-card-footer">
                    <span class="priority-badge ${badgeClass}">${tarefa.prioridade || "media"}</span>
                    <div class="mini-actions">
                        <button class="mini-action" data-action="toggle" data-id="${tarefa.id}">${status === "done" ? "\u21A9" : "\u2713"}</button>
                        <button class="mini-action" data-action="sync" data-id="${tarefa.id}">\u{1F4C5}</button>
                    </div>
                </div>
            </article>
        `;
  }
  function renderizar(lista) {
    const buscaVal = page.querySelector("#buscarTarefa").value.trim().toLowerCase();
    const filtradas = lista.filter((item) => {
      const textoBusca = !buscaVal || (item.titulo || "").toLowerCase().includes(buscaVal) || (item.categoria || "").toLowerCase().includes(buscaVal);
      const atendePrioridade = filtroPrioridade === "todas" || item.prioridade === filtroPrioridade;
      const atendeDia = filtroDiaSemana === "todos" || item.diaSemana === filtroDiaSemana;
      return textoBusca && atendePrioridade && atendeDia;
    });
    page.querySelector("#summaryTotal").textContent = filtradas.length;
    page.querySelector("#summaryAlta").textContent = filtradas.filter((t) => t.prioridade === "alta").length;
    page.querySelector("#summaryDone").textContent = filtradas.filter((t) => normalizarStatus(t) === "done").length;
    page.querySelector("#summaryPending").textContent = filtradas.filter((t) => normalizarStatus(t) !== "done").length;
    const boardCols = BOARD_COLUMNS.map((coluna) => {
      const items = filtradas.filter((item) => normalizarStatus(item) === coluna.key);
      return `
                <div class="board-column ${coluna.accent}">
                    <div class="board-column-header">
                        <span>${coluna.icon} ${coluna.label}</span>
                        <strong>${items.length}</strong>
                    </div>
                    <div class="board-column-body">
                        ${items.length ? items.map(criarCardTarefa).join("") : '<div class="empty-column">Sem tarefas</div>'}
                    </div>
                </div>
            `;
    }).join("");
    kanbanBoard.innerHTML = boardCols;
    const listRows = filtradas.map((tarefa) => {
      const status = normalizarStatus(tarefa);
      const priorityColor = tarefa.prioridade === "alta" ? "#ef4444" : tarefa.prioridade === "media" ? "#f59e0b" : "#10b981";
      return `
                <div class="list-row ${status === "done" ? "done" : ""}">
                    <div class="list-row-main">
                        <input type="checkbox" ${status === "done" ? "checked" : ""} data-action="toggle" data-id="${tarefa.id}" />
                        <div class="list-text">
                            <strong>${tarefa.titulo}</strong>
                            <span>${tarefa.categoria} \u2022 ${tarefa.data || "Sem data"}</span>
                        </div>
                    </div>
                    <div class="list-row-meta">
                        <span class="list-pill" style="background: ${priorityColor}22; color: ${priorityColor};">${tarefa.prioridade || "media"}</span>
                        <button class="list-action" data-action="detail" data-id="${tarefa.id}">Detalhes</button>
                        <button class="list-action" data-action="sync" data-id="${tarefa.id}">Sync</button>
                    </div>
                </div>
            `;
    }).join("");
    taskListView.innerHTML = listRows || '<div class="empty-list">Nenhuma tarefa corresponde ao filtro atual.</div>';
    if (viewMode === "board") {
      kanbanBoard.style.display = "grid";
      taskListView.style.display = "none";
    } else {
      kanbanBoard.style.display = "none";
      taskListView.style.display = "flex";
    }
    function bindBoardAction(selector, callback) {
      kanbanBoard.querySelectorAll(selector).forEach((element) => {
        element.addEventListener("click", () => callback(element.dataset.id));
      });
    }
    bindBoardAction('[data-action="detail"]', (id) => {
      const tarefa = carregarTarefas().find((item) => item.id === id);
      if (tarefa) abrirDetalheTarefa(tarefa);
    });
    bindBoardAction('[data-action="toggle"]', (id) => {
      const atual = carregarTarefas();
      const idx = atual.findIndex((item) => item.id === id);
      if (idx !== -1) {
        atual[idx].concluida = !atual[idx].concluida;
        atual[idx].status = atual[idx].concluida ? "done" : "todo";
        salvarTarefas(atual);
        renderizar(atual);
      }
    });
    bindBoardAction('[data-action="sync"]', (id) => {
      const tarefa = carregarTarefas().find((item) => item.id === id);
      if (tarefa) exportarParaCalendario(tarefa, "google");
    });
    taskListView.querySelectorAll('[data-action="detail"]').forEach((button) => {
      button.addEventListener("click", () => {
        const tarefa = carregarTarefas().find((item) => item.id === button.dataset.id);
        if (tarefa) abrirDetalheTarefa(tarefa);
      });
    });
    taskListView.querySelectorAll('[data-action="sync"]').forEach((button) => {
      button.addEventListener("click", () => {
        const tarefa = carregarTarefas().find((item) => item.id === button.dataset.id);
        if (tarefa) exportarParaCalendario(tarefa, "google");
      });
    });
    taskListView.querySelectorAll('input[data-action="toggle"]').forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const atual = carregarTarefas();
        const idx = atual.findIndex((item) => item.id === checkbox.dataset.id);
        if (idx !== -1) {
          atual[idx].concluida = event.target.checked;
          atual[idx].status = atual[idx].concluida ? "done" : "todo";
          salvarTarefas(atual);
          renderizar(atual);
        }
      });
    });
  }
  page.querySelector("#buscarTarefa").addEventListener("input", () => {
    renderizar(carregarTarefas());
  });
  page.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      page.querySelectorAll(".filter-pill").forEach((item) => item.classList.remove("active"));
      pill.classList.add("active");
      const f = pill.dataset.filter;
      if (f === "alta") {
        filtroPrioridade = "alta";
        filtroDiaSemana = "todos";
      } else {
        filtroPrioridade = "todas";
        filtroDiaSemana = f;
      }
      renderizar(carregarTarefas());
    });
  });
  page.querySelectorAll(".view-button").forEach((button) => {
    button.addEventListener("click", () => {
      page.querySelectorAll(".view-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      viewMode = button.dataset.view;
      renderizar(carregarTarefas());
    });
  });
  renderizar(todasAsTarefas);
  return page;
}
var tarefas_default = {
  url: "#tarefas",
  label: "Tarefas",
  pagina: tarefas
};

// src/js/components/paginas/categorias.js
var categoryDetails = {
  "Faculdade": { color: "#6366F1", icon: "\u{1F393}" },
  "Trabalho": { color: "#06B6D4", icon: "\u{1F4BC}" },
  "Estudos": { color: "#F59E0B", icon: "\u{1F4DA}" },
  "Pessoal": { color: "#EF4444", icon: "\u{1F3E0}" },
  "Reuni\xF5es": { color: "#10B981", icon: "\u{1F91D}" },
  "Default": { color: "#64748B", icon: "\u{1F3F7}\uFE0F" }
};
var createCategoriasPage = () => {
  const tarefas2 = carregarTarefas();
  const statsPorCategoria = tarefas2.reduce((acc, tarefa) => {
    const categoria = tarefa.categoria || "Pessoal";
    if (!acc[categoria]) {
      acc[categoria] = { total: 0, concluidas: 0 };
    }
    acc[categoria].total++;
    if (tarefa.concluida) {
      acc[categoria].concluidas++;
    }
    return acc;
  }, {});
  const page = document.createElement("div");
  page.className = "categorias-container page-enter";
  page.innerHTML = `
        <section class="tarefas-page">
            <div class="tarefas-header info-hover-box" data-tooltip="Vis\xE3o do progresso por categoria no ClickUp Workspace. Acompanhe a taxa de conclus\xE3o." style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                    <h1 style="font-size: 1.5rem; font-weight: 800; color: #0F172A;">\u{1F3F7}\uFE0F Categorias & Progresso</h1>
                    <p style="color: #64748B; font-size: 0.95rem; margin-top: 4px;">
                        Medi\xE7\xE3o de entregas e progresso percentual por \xE1rea de atua\xE7\xE3o.
                    </p>
                </div>
                <span class="info-badge">\u2139\uFE0F Progresso em tempo real</span>
            </div>

            <div class="category-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-top: 16px;"></div>
        </section>
    `;
  const grid = page.querySelector(".category-grid");
  for (const nomeCategoria in statsPorCategoria) {
    const stats = statsPorCategoria[nomeCategoria];
    const percentual = stats.total > 0 ? Math.round(stats.concluidas / stats.total * 100) : 0;
    const details = categoryDetails[nomeCategoria] || categoryDetails.Default;
    const card = document.createElement("div");
    card.className = "category-card glass-card info-hover-box";
    card.setAttribute("data-tooltip", `Categoria ${nomeCategoria}: ${stats.concluidas} de ${stats.total} tarefas conclu\xEDdas (${percentual}%).`);
    card.style.padding = "20px";
    card.style.borderRadius = "16px";
    card.style.background = "#FFFFFF";
    card.style.border = "1px solid #E2E8F0";
    card.innerHTML = `
            <div class="category-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
                <div class="category-icon" style="background-color: ${details.color}15; color: ${details.color}; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; border: 1px solid ${details.color}30;">
                    ${details.icon}
                </div>
                <div>
                    <h3 class="category-title" style="margin: 0; color: #0F172A; font-size: 1.1rem; font-weight: 700;">${nomeCategoria}</h3>
                    <span style="font-size: 0.85rem; color: #64748B;">${stats.concluidas} de ${stats.total} conclu\xEDdas</span>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #475569; margin-bottom: 8px;">
                <span>Progresso</span>
                <span style="font-weight: 700; color: ${details.color};">${percentual}%</span>
            </div>

            <div class="progress-bar-container" style="background: #E2E8F0; height: 8px; border-radius: 999px; overflow: hidden;">
                <div class="progress-bar" style="width: ${percentual}%; background-color: ${details.color}; height: 100%; border-radius: 999px; transition: width 0.4s ease;"></div>
            </div>
        `;
    grid.appendChild(card);
  }
  return page;
};
var categorias_default = {
  url: "#categorias",
  label: "Categorias",
  pagina: createCategoriasPage
};

// src/js/components/paginas/calendario.js
var dias = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];
function capitalizar(str) {
  const mapa = {
    segunda: "Segunda",
    terca: "Ter\xE7a",
    quarta: "Quarta",
    quinta: "Quinta",
    sexta: "Sexta",
    sabado: "S\xE1bado",
    domingo: "Domingo"
  };
  return mapa[str] || str;
}
function calendario() {
  const tarefas2 = carregarTarefas();
  const page = document.createElement("div");
  page.className = "calendario-page-wrapper page-enter";
  const concluidas = tarefas2.filter((t) => t.concluida).length;
  const progresso = tarefas2.length ? Math.round(concluidas / tarefas2.length * 100) : 0;
  page.innerHTML = `
        <section class="calendar-page">
            <div class="calendar-header glass info-hover-box" data-tooltip="Planejamento Semanal Inteligente no ClickUp. Arraste e solte tarefas entre os dias da semana." style="padding: 20px 24px; border-radius: 16px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div>
                    <h1 style="font-size: 1.5rem; font-weight: 800; color: #0F172A;">\u{1F4C5} Planner Semanal por Dias da Semana</h1>
                    <p style="color: #64748B; font-size: 0.95rem; margin-top: 4px;">
                        Arraste tarefas entre as colunas dos dias para remanejar sua agenda com facilidade.
                    </p>
                </div>
                <span class="info-badge">\u2139\uFE0F Drag & Drop: Arraste para mover o dia</span>
            </div>

            <div class="calendar-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                ${dias.map((dia) => colunaDia(dia, tarefas2)).join("")}
            </div>

            <div class="calendar-footer glass-card info-hover-box" data-tooltip="Resumo da carga hor\xE1ria e progresso semanal." style="margin-top: 20px; padding: 18px; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div>
                    <strong style="color: #0F172A;">Carga da Semana:</strong> 
                    <span style="color: var(--primary-color); font-weight: 700;">${tarefas2.length} tarefas planejadas</span>
                </div>
                <div class="week-progress" style="display: flex; align-items: center; gap: 12px;">
                    <div class="progress-bar" style="width: 140px; background: #E2E8F0; height: 8px; border-radius: 999px; overflow: hidden;">
                        <div class="progress-fill" style="width:${progresso}%; background: var(--gradient-hero); height: 100%; border-radius: 999px;"></div>
                    </div>
                    <span style="font-size: 0.85rem; color: #475569; font-weight: 600;">${progresso}% conclu\xEDdo</span>
                </div>
            </div>
        </section>
    `;
  const colunas = page.querySelectorAll(".day-column");
  colunas.forEach((coluna) => {
    coluna.addEventListener("dragover", (e) => {
      e.preventDefault();
      coluna.style.background = "#EEF2FF";
      coluna.style.borderColor = "var(--primary-color)";
    });
    coluna.addEventListener("dragleave", () => {
      coluna.style.background = "";
      coluna.style.borderColor = "";
    });
    coluna.addEventListener("drop", (e) => {
      e.preventDefault();
      coluna.style.background = "";
      coluna.style.borderColor = "";
      const id = e.dataTransfer.getData("text/plain");
      const novoDia = coluna.dataset.day;
      moverTarefaParaDia(id, novoDia);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
  });
  const cards = page.querySelectorAll(".calendar-task");
  cards.forEach((card) => {
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", card.dataset.id);
      setTimeout(() => card.style.opacity = "0.4", 0);
    });
    card.addEventListener("dragend", () => {
      card.style.opacity = "1";
    });
  });
  return page;
}
function colunaDia(dia, tarefas2) {
  const tarefasDoDia = tarefas2.filter((t) => t.diaSemana === dia);
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
  const cor = tarefa.prioridade === "alta" ? "#EF4444" : tarefa.prioridade === "media" ? "#D97706" : "#059669";
  return `
        <div class="calendar-task priority-${tarefa.prioridade}" draggable="true" data-id="${tarefa.id}" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 3px solid ${cor}; padding: 10px; border-radius: 10px; cursor: grab;">
            <span class="calendar-time" style="font-size: 0.75rem; color: #64748B; display: block;">\u23F0 ${tarefa.horario || "09:00"}</span>
            <strong style="font-size: 0.85rem; color: #0F172A; display: block; margin: 2px 0;">${tarefa.titulo}</strong>
            <small style="font-size: 0.75rem; color: var(--primary-color); font-weight: 600;">\u{1F3F7}\uFE0F ${tarefa.categoria}</small>
        </div>
    `;
}
function moverTarefaParaDia(id, novoDia) {
  const tarefas2 = carregarTarefas();
  const tarefaIndex = tarefas2.findIndex((t) => t.id === id);
  if (tarefaIndex !== -1) {
    tarefas2[tarefaIndex].diaSemana = novoDia;
    salvarTarefas(tarefas2);
  }
}
var calendario_default = {
  url: "#calendario",
  label: "Calend\xE1rio",
  pagina: calendario
};

// notificacoes.js
async function solicitarPermissaoNotificacoes() {
  if (!("Notification" in window)) {
    console.error("Este navegador n\xE3o suporta a Web Notification API.");
    return "unsupported";
  }
  const permissao = await Notification.requestPermission();
  return permissao;
}
function verificarPermissaoNotificacoes() {
  if (!("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

// src/js/components/paginas/configuracoes.js
var THEME_KEY = "taskflow_theme";
function configurarTemaBotao(botao, temaAtual) {
  if (!botao) return;
  const temaEscuroAtivo = temaAtual === "dark";
  botao.textContent = temaEscuroAtivo ? "\u{1F319} Modo Escuro" : "\u2600\uFE0F Modo Claro";
  botao.classList.toggle("active", temaEscuroAtivo);
}
function configuracoes() {
  const page = document.createElement("div");
  page.className = "configuracoes-page page-enter";
  const statusNotificacao = verificarPermissaoNotificacoes();
  page.innerHTML = `
        <section class="tarefas-page">
            <div class="tarefas-header">
                <div>
                    <h1 style="font-size: 1.5rem; font-weight: 800; color: #0F172A;">\u2699\uFE0F Tabela & Configura\xE7\xF5es de Sync</h1>
                    <p style="color: #64748B; margin-top: 4px; font-size: 0.95rem;">
                        Gerencie suas prefer\xEAncias de tema, notifica\xE7\xF5es do dispositivo e sincroniza\xE7\xF5es com calend\xE1rios externos.
                    </p>
                </div>
            </div>

            <!-- SE\xC7\xC3O 1: SINCRONIZA\xC7\xC3O COM APPS EXTERNOS -->
            <div class="card glass-card info-hover-box" data-tooltip="Exporte todas as suas tarefas pendentes para o Google Calendar, Outlook, Teams ou iCal de forma integrada." style="margin-top: 16px; padding: 20px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.4rem;">\u{1F4C5}</span>
                        <div>
                            <h3 style="margin: 0; color: #0F172A; font-size: 1.1rem; font-weight: 700;">Sincroniza\xE7\xE3o com Calend\xE1rios Externos</h3>
                            <p style="margin: 2px 0 0 0; color: #64748B; font-size: 0.85rem;">Exporte suas tarefas para Google, Outlook, Teams e iCal</p>
                        </div>
                    </div>
                    <span class="info-badge">\u2139\uFE0F Info</span>
                </div>

                <div class="actions-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
                    <button id="syncGoogleAll" class="btn-secondary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px;">
                        <span style="color: #4285F4;">\u{1F310}</span> Google Calendar
                    </button>
                    <button id="syncOutlookAll" class="btn-secondary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px;">
                        <span style="color: #0078D4;">\u{1F4E7}</span> Outlook / Teams
                    </button>
                    <button id="downloadIcsAll" class="btn-primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px;">
                        <span>\u{1F4F2}</span> Baixar iCal (.ics)
                    </button>
                </div>
            </div>

            <!-- SE\xC7\xC3O 2: NOTIFICA\xC7\xD5ES DO NAVEGADOR -->
            <div class="card glass-card info-hover-box" data-tooltip="Ative as notifica\xE7\xF5es push locais para receber lembretes de tarefas e reuni\xF5es diretamente na barra do sistema." style="margin-top: 14px; padding: 20px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.4rem;">\u{1F514}</span>
                        <div>
                            <h3 style="margin: 0; color: #0F172A; font-size: 1.1rem; font-weight: 700;">Notifica\xE7\xF5es Push do Dispositivo</h3>
                            <p style="margin: 2px 0 0 0; color: #64748B; font-size: 0.85rem;">Receba alertas de tarefas no hor\xE1rio programado</p>
                        </div>
                    </div>
                    <span class="info-badge">\u2139\uFE0F Info</span>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
                    <span id="notificacaoStatusLabel" style="font-size: 0.9rem; font-weight: 600; color: ${statusNotificacao === "granted" ? "#10B981" : "#64748B"};">
                        Status atual: ${statusNotificacao === "granted" ? "\u2705 Notifica\xE7\xF5es Ativadas" : statusNotificacao === "denied" ? "\u274C Permiss\xE3o Negada" : "\u26A0\uFE0F Permiss\xE3o Pendente"}
                    </span>
                    <button id="btnAtivarNotificacoes" class="btn-secondary" style="padding: 8px 16px;">
                        \u{1F514} Pedir Permiss\xE3o
                    </button>
                </div>
            </div>

            <!-- SE\xC7\xC3O 3: TEMA E APAR\xCANCIA -->
            <div class="card glass-card info-hover-box" data-tooltip="Configura\xE7\xE3o de Apar\xEAncia. Tema Claro Elegante ativo com bordas suaves e alto contraste." style="margin-top: 14px; padding: 20px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.4rem;">\u{1F3A8}</span>
                        <div>
                            <h3 style="margin: 0; color: #0F172A; font-size: 1.1rem; font-weight: 700;">Tema & Apar\xEAncia Visual</h3>
                            <p style="margin: 2px 0 0 0; color: #64748B; font-size: 0.85rem;">Design Claro Elegante (Porcelain & Indigo)</p>
                        </div>
                    </div>
                    <span class="info-badge">\u2139\uFE0F Info</span>
                </div>

                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button id="themeToggleBtn" class="filter-pill active" style="padding: 8px 16px; font-weight: 600;">
                        \u{1F319} Modo Escuro
                    </button>
                </div>
            </div>

            <!-- SE\xC7\xC3O 4: DADOS E ARMAZENAMENTO -->
            <div class="card glass-card info-hover-box" data-tooltip="Gerenciamento de dados persistentes do navegador via LocalStorage." style="margin-top: 14px; padding: 20px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.4rem;">\u{1F4BE}</span>
                        <div>
                            <h3 style="margin: 0; color: #0F172A; font-size: 1.1rem; font-weight: 700;">Armazenamento & Dados</h3>
                            <p style="margin: 2px 0 0 0; color: #64748B; font-size: 0.85rem;">Gerencie o estado salvo em seu navegador</p>
                        </div>
                    </div>
                    <span class="info-badge">\u2139\uFE0F Info</span>
                </div>

                <button id="btnResetDados" class="btn-secondary" style="color: #EF4444; border-color: #FCA5A5;">
                    \u26A0\uFE0F Redefinir Dados Locais
                </button>
            </div>
        </section>
    `;
  const themeToggleBtn = page.querySelector("#themeToggleBtn");
  const temaAtual = localStorage.getItem(THEME_KEY) || "dark";
  configurarTemaBotao(themeToggleBtn, temaAtual);
  themeToggleBtn.addEventListener("click", () => {
    const proximoTema = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = proximoTema;
    localStorage.setItem(THEME_KEY, proximoTema);
    configurarTemaBotao(themeToggleBtn, proximoTema);
  });
  const btnNotificacoes = page.querySelector("#btnAtivarNotificacoes");
  btnNotificacoes.addEventListener("click", async () => {
    const resultado = await solicitarPermissaoNotificacoes();
    const label = page.querySelector("#notificacaoStatusLabel");
    if (resultado === "granted") {
      label.textContent = "\u2705 Notifica\xE7\xF5es Ativadas";
      label.style.color = "#10B981";
      alert("Notifica\xE7\xF5es ativadas com sucesso!");
    } else {
      label.textContent = "\u274C Permiss\xE3o Negada ou Indispon\xEDvel";
      label.style.color = "#EF4444";
    }
  });
  page.querySelector("#syncGoogleAll").addEventListener("click", () => {
    const tarefas2 = carregarTarefas();
    if (tarefas2.length > 0) {
      exportarParaCalendario(tarefas2[0], "google");
    } else {
      alert("Nenhuma tarefa dispon\xEDvel para sincroniza\xE7\xE3o.");
    }
  });
  page.querySelector("#syncOutlookAll").addEventListener("click", () => {
    const tarefas2 = carregarTarefas();
    if (tarefas2.length > 0) {
      exportarParaCalendario(tarefas2[0], "outlook");
    } else {
      alert("Nenhuma tarefa dispon\xEDvel para sincroniza\xE7\xE3o.");
    }
  });
  page.querySelector("#downloadIcsAll").addEventListener("click", () => {
    const tarefas2 = carregarTarefas();
    if (tarefas2.length > 0) {
      exportarParaCalendario(tarefas2[0], "ics");
    } else {
      alert("Nenhuma tarefa dispon\xEDvel para sincroniza\xE7\xE3o.");
    }
  });
  page.querySelector("#btnResetDados").addEventListener("click", () => {
    if (confirm("Deseja realmente redefinir os dados para a vers\xE3o inicial de demonstra\xE7\xE3o?")) {
      localStorage.removeItem("taskflow_tarefas");
      localStorage.removeItem("taskflow_categorias");
      window.location.reload();
    }
  });
  return page;
}
var configuracoes_default = {
  url: "#configuracoes",
  label: "Ajustes",
  pagina: configuracoes
};

// src/js/rotas.js
var rotas = {
  "#dashboard": dashboard_default,
  "#tarefas": tarefas_default,
  "#categorias": categorias_default,
  "#calendario": calendario_default,
  "#configuracoes": configuracoes_default
};
var rotear = () => {
  const url = window.location.hash || "#dashboard";
  const pagina = rotas[url];
  const appContainer = document.getElementById("app");
  if (pagina && typeof pagina.pagina === "function") {
    appContainer.innerHTML = "";
    const pageElement = pagina.pagina();
    pageElement.classList.add("page-enter");
    appContainer.appendChild(pageElement);
  } else {
    window.location.hash = "#dashboard";
  }
};
var iniciarRoteador = () => {
  window.addEventListener("hashchange", rotear);
  window.addEventListener("load", rotear);
};

// src/js/components/navbar/navbar.js
var createNavbar = () => {
  const sidebarContainer = document.getElementById("navbar");
  const topbarContainer = document.getElementById("clickup-topbar-container");
  const mobileTabsContainer = document.querySelector(".mobile-tabs");
  if (!sidebarContainer) return;
  sidebarContainer.className = "clickup-sidebar";
  sidebarContainer.innerHTML = `
        <!-- Workspace Selector -->
        <div class="workspace-selector info-hover-box" data-tooltip="Seu espa\xE7o de trabalho no TaskFlow. Clique para selecionar ou alternar workspace.">
            <div class="workspace-title">
                <span>KS</span> Keren Silva's Workspace
            </div>
            <span style="font-size: 0.75rem; color: #94A3B8;">\u25BC</span>
        </div>

        <!-- Bot\xE3o Principal Criar -->
        <button class="btn-sidebar-create" id="btnSidebarCriarTarefa">
            <span>\u2795</span> Criar
        </button>

        <!-- Navega\xE7\xE3o Principal -->
        <ul class="sidebar-nav-list">
            <li>
                <a href="#dashboard" class="sidebar-nav-link" data-hash="#dashboard">
                    <span>\u{1F3E0}</span> In\xEDcio
                </a>
            </li>
            <li>
                <a href="#calendario" class="sidebar-nav-link" data-hash="#calendario">
                    <span>\u{1F4C5}</span> Planejador
                </a>
            </li>
            <li>
                <a href="#tarefas" class="sidebar-nav-link" data-hash="#tarefas">
                    <span>\u{1F4CB}</span> Lista de Tarefas
                </a>
            </li>
            <li>
                <a href="#categorias" class="sidebar-nav-link" data-hash="#categorias">
                    <span>\u{1F3F7}\uFE0F</span> Categorias
                </a>
            </li>
            <li>
                <a href="#configuracoes" class="sidebar-nav-link" data-hash="#configuracoes">
                    <span>\u2699\uFE0F</span> Ajustes & Sync
                </a>
            </li>
        </ul>

        <!-- \xC1rvore de Espa\xE7os e Projetos -->
        <div class="sidebar-section-title">
            <span>Espa\xE7o da equipe</span>
            <span style="cursor: pointer;" title="Adicionar Novo Espa\xE7o">+</span>
        </div>
        <div class="sidebar-tree-item active" style="margin-left: 6px;">
            <span>\u{1F4C2}</span> Projetos
        </div>
        <div class="sidebar-tree-item active" style="margin-left: 18px; font-weight: 600; color: #6366F1;">
            <span>\u26A1</span> Projeto 1
        </div>
        <div class="sidebar-tree-item" style="margin-left: 18px;">
            <span>\u26A1</span> Projeto 2
        </div>
        <div class="sidebar-tree-item" style="color: #64748B; margin-left: 6px;">
            <span>\u{1F6A9}</span> Get Started with ClickUp
        </div>
        <div class="sidebar-tree-item" style="color: #6366F1; font-weight: 500;">
            <span>+</span> Novo Espa\xE7o
        </div>

        <!-- Canais de Comunica\xE7\xE3o -->
        <div class="sidebar-section-title" style="margin-top: 14px;">
            <span>Canais</span>
            <span style="cursor: pointer;">+</span>
        </div>
        <div class="sidebar-tree-item">
            <span>#</span> Geral - Keren Silva's Workspace
        </div>
        <div class="sidebar-tree-item">
            <span>#</span> Welcome
        </div>
        <div class="sidebar-tree-item" style="color: #94A3B8;">
            <span>+</span> Adicionar canal
        </div>

        <!-- Mensagens Diretas -->
        <div class="sidebar-section-title" style="margin-top: 14px;">
            <span>Mensagens diretas</span>
            <span style="cursor: pointer;">+</span>
        </div>
        <div class="sidebar-tree-item">
            <span style="width: 8px; height: 8px; background: #10B981; border-radius: 50%; display: inline-block;"></span> Keren Silva \u2014 Voc\xEA
        </div>
        <div class="sidebar-tree-item" style="color: #94A3B8;">
            <span>+</span> Nova mensagem
        </div>

        <!-- Rodap\xE9 da Sidebar -->
        <div style="margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-glass); font-size: 0.78rem; color: #94A3B8; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <span>\u2699\uFE0F</span> Personalizar a barra lateral
        </div>
    `;
  if (topbarContainer) {
    topbarContainer.innerHTML = "";
    const topbar = document.createElement("div");
    topbar.className = "clickup-topbar";
    topbar.innerHTML = `
            <!-- Linha 1: Pesquisa Global, Chats com IA e Perfil -->
            <div class="topbar-header-row">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="global-search-container info-hover-box" data-tooltip="Busca global r\xE1pida em todo o seu workspace (tarefas, projetos e categorias).">
                        <span style="color: #94A3B8;">\u{1F50D}</span>
                        <input type="text" class="global-search-input" placeholder="Pesquisar Ctrl K">
                    </div>
                    <button class="ai-chat-btn info-hover-box" data-tooltip="Assistente de Intelig\xEAncia Artificial para resumos de tarefas e sugest\xF5es de foco.">
                        <span>\u{1F33A}</span> Chats com IA
                    </button>
                </div>

                <div class="topbar-user-profile">
                    <span style="background: rgba(16, 185, 129, 0.15); color: #10B981; font-size: 0.75rem; padding: 3px 8px; border-radius: 12px; font-weight: 600;">Habilitado</span>
                    <span style="background: #F1F5F9; color: #64748B; font-size: 0.75rem; padding: 3px 8px; border-radius: 12px;">Snooze</span>
                    <span style="cursor: pointer; font-size: 1.1rem;">\u{1F4F9}</span>
                    <span style="cursor: pointer; font-size: 1.1rem;">\u{1F4DE}</span>
                    <div class="user-avatar info-hover-box" data-tooltip="Sua conta: Keren Silva (Desenvolvedor Frontend)">KS</div>
                </div>
            </div>

            <!-- Linha 2: Banner de Notifica\xE7\xF5es -->
            <div style="background: #EEF2FF; border: 1px solid #C7D2FE; padding: 6px 14px; border-radius: 8px; font-size: 0.82rem; color: #4338CA; display: flex; align-items: center; justify-content: space-between;">
                <span>\u{1F514} Don't let important updates slip by. Enable real-time notifications.</span>
                <button id="topbarNotifyEnableBtn" style="background: #6366F1; color: white; border: none; padding: 3px 10px; border-radius: 6px; font-weight: 600; font-size: 0.75rem; cursor: pointer;">Habilitar</button>
            </div>

            <!-- Linha 3: Breadcrumb & A\xE7\xF5es R\xE1pidas -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 4px;">
                <div class="topbar-breadcrumb">
                    <span style="background: #EF4444; color: white; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: 700;">E</span> Espa\xE7o da equipe / <span>\u{1F4C1} Projetos</span> / <strong>\u26A1 Projeto 1</strong> \u2B50
                </div>
                <div style="display: flex; gap: 8px; font-size: 0.8rem; color: #64748B;">
                    <span style="cursor: pointer; padding: 4px 8px; background: #F1F5F9; border-radius: 6px;">\u{1F916} Agentes</span>
                    <span style="cursor: pointer; padding: 4px 8px; background: #F1F5F9; border-radius: 6px;">\u26A1 Automatizar</span>
                    <span style="cursor: pointer; padding: 4px 8px; background: #F1F5F9; border-radius: 6px;">\u{1F33A} Brain\xB2</span>
                    <span style="cursor: pointer; padding: 4px 8px; background: #6366F1; color: white; border-radius: 6px; font-weight: 600;">\u{1F465} Compartilhar</span>
                </div>
            </div>

            <!-- Linha 4: Abas de Visualiza\xE7\xE3o & Ferramentas -->
            <div class="topbar-tabs-row" style="margin-top: 6px;">
                <ul class="view-tabs">
                    <li>
                        <a href="#tarefas" class="view-tab-link" data-hash="#tarefas">
                            <span>\u{1F4CB}</span> Lista
                        </a>
                    </li>
                    <li>
                        <a href="#tarefas" class="view-tab-link" data-hash="#tarefas">
                            <span>\u{1F4CA}</span> Quadro
                        </a>
                    </li>
                    <li>
                        <a href="#calendario" class="view-tab-link" data-hash="#calendario">
                            <span>\u{1F4C5}</span> Calend\xE1rio
                        </a>
                    </li>
                    <li>
                        <a href="#categorias" class="view-tab-link" data-hash="#categorias">
                            <span>\u{1F3F7}\uFE0F</span> Categorias
                        </a>
                    </li>
                    <li>
                        <a href="#configuracoes" class="view-tab-link" data-hash="#configuracoes">
                            <span>\u2699\uFE0F</span> Tabela & Ajustes
                        </a>
                    </li>
                </ul>

                <div class="topbar-controls">
                    <button class="control-pill">\u{1F7E3} Grupo: Status</button>
                    <button class="control-pill">\u{1F517} Subtarefas</button>
                    <button class="control-pill">|| Colunas</button>
                    <button class="control-pill">\u{1F50D} Filtro</button>
                    <button class="control-pill" id="topbarAddBtn" style="background: var(--gradient-hero); color: white; border: none; font-weight: 600;">\u2795 Add Tarefa</button>
                </div>
            </div>
        `;
    topbarContainer.appendChild(topbar);
  }
  if (mobileTabsContainer) {
    mobileTabsContainer.innerHTML = `
            <a href="#dashboard" class="mobile-tab">
                <span class="icon">\u{1F3E0}</span>
                <span>In\xEDcio</span>
            </a>
            <a href="#tarefas" class="mobile-tab">
                <span class="icon">\u{1F4CB}</span>
                <span>Lista</span>
            </a>
            <a href="#calendario" class="mobile-tab">
                <span class="icon">\u{1F4C5}</span>
                <span>Agenda</span>
            </a>
            <a href="#categorias" class="mobile-tab">
                <span class="icon">\u{1F3F7}\uFE0F</span>
                <span>Categorias</span>
            </a>
            <a href="#configuracoes" class="mobile-tab">
                <span class="icon">\u2699\uFE0F</span>
                <span>Ajustes</span>
            </a>
        `;
  }
  const triggerNovaTarefa = () => {
    window.location.hash = "#tarefas";
    setTimeout(() => {
      const form = document.getElementById("formNovaTarefaContainer");
      if (form) form.style.display = "block";
    }, 100);
  };
  sidebarContainer.querySelector("#btnSidebarCriarTarefa").addEventListener("click", triggerNovaTarefa);
  if (topbarContainer.querySelector("#topbarAddBtn")) {
    topbarContainer.querySelector("#topbarAddBtn").addEventListener("click", triggerNovaTarefa);
  }
  const updateActiveLink = () => {
    const currentHash = window.location.hash || "#dashboard";
    document.querySelectorAll(".sidebar-nav-link").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-hash") === currentHash);
    });
    document.querySelectorAll(".view-tab-link").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-hash") === currentHash);
    });
    document.querySelectorAll(".mobile-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("href") === currentHash);
    });
  };
  window.addEventListener("hashchange", updateActiveLink);
  window.addEventListener("load", updateActiveLink);
};

// src/js/main.js
var THEME_KEY2 = "taskflow_theme";
function aplicarTema(theme) {
  const themeName = theme === "light" ? "light" : "dark";
  document.body.dataset.theme = themeName;
  localStorage.setItem(THEME_KEY2, themeName);
}
function carregarTemaInicial() {
  const temaSalvo = localStorage.getItem(THEME_KEY2);
  const temaPadrao = temaSalvo === "light" ? "light" : "dark";
  aplicarTema(temaPadrao);
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("TaskFlow \u2014 Smart Workspace Iniciado!");
  carregarTemaInicial();
  createNavbar();
  iniciarRoteador();
  iniciarCommandPalette();
});
function iniciarCommandPalette() {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.id = "commandPaletteOverlay";
  modalOverlay.innerHTML = `
        <div class="modal-content command-palette-modal">
            <div class="command-palette-input-row">
                <span style="color: #6366F1; font-weight: 700; font-size: 1.1rem;">\u{1F50D}</span>
                <input type="text" id="cmdSearchInput" class="command-palette-input" placeholder="Digite para buscar tarefas, p\xE1ginas ou a\xE7\xF5es (Ctrl+K)...">
                <span style="font-size: 0.75rem; background: #E2E8F0; padding: 2px 6px; border-radius: 4px; color: #64748B;">ESC</span>
            </div>
            <div id="cmdResultsList" class="command-results-list"></div>
        </div>
    `;
  document.body.appendChild(modalOverlay);
  const input = modalOverlay.querySelector("#cmdSearchInput");
  const results = modalOverlay.querySelector("#cmdResultsList");
  const abrirCmd = () => {
    modalOverlay.classList.add("visible");
    input.value = "";
    renderCmdResults("");
    setTimeout(() => input.focus(), 50);
  };
  const fecharCmd = () => {
    modalOverlay.classList.remove("visible");
  };
  function renderCmdResults(termo) {
    results.innerHTML = "";
    const t = termo.toLowerCase().trim();
    const acoesFixas = [
      { icon: "\u2795", titulo: "Nova Tarefa", sub: "Criar uma nova tarefa no projeto", action: () => {
        window.location.hash = "#tarefas";
        setTimeout(() => {
          const f = document.getElementById("formNovaTarefaContainer");
          if (f) f.style.display = "block";
        }, 100);
      } },
      { icon: "\u{1F3E0}", titulo: "Ir para Dashboard", sub: "Painel principal de estat\xEDsticas", action: () => window.location.hash = "#dashboard" },
      { icon: "\u{1F4C5}", titulo: "Ir para Planner Semanal", sub: "Vis\xE3o de Segunda a Domingo", action: () => window.location.hash = "#calendario" },
      { icon: "\u{1F3F7}\uFE0F", titulo: "Ir para Categorias", sub: "Progresso por \xE1rea", action: () => window.location.hash = "#categorias" },
      { icon: "\u2699\uFE0F", titulo: "Ir para Configura\xE7\xF5es", sub: "Notifica\xE7\xF5es e Sincroniza\xE7\xF5es", action: () => window.location.hash = "#configuracoes" }
    ];
    const tarefas2 = carregarTarefas();
    const tarefasFiltradas = t ? tarefas2.filter((item) => item.titulo.toLowerCase().includes(t) || item.categoria.toLowerCase().includes(t)) : tarefas2.slice(0, 4);
    acoesFixas.filter((a) => !t || a.titulo.toLowerCase().includes(t)).forEach((item) => {
      const row = document.createElement("div");
      row.className = "command-result-item";
      row.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.1rem;">${item.icon}</span>
                    <div>
                        <strong style="font-size: 0.9rem; color: #0F172A; display: block;">${item.titulo}</strong>
                        <span style="font-size: 0.78rem; color: #64748B;">${item.sub}</span>
                    </div>
                </div>
                <span style="font-size: 0.75rem; color: #6366F1; font-weight: 600;">A\xE7\xE3o</span>
            `;
      row.addEventListener("click", () => {
        fecharCmd();
        item.action();
      });
      results.appendChild(row);
    });
    if (tarefasFiltradas.length > 0) {
      const header = document.createElement("div");
      header.style.padding = "8px 14px 4px 14px";
      header.style.fontSize = "0.75rem";
      header.style.fontWeight = "700";
      header.style.color = "#94A3B8";
      header.style.textTransform = "uppercase";
      header.textContent = "Tarefas";
      results.appendChild(header);
      tarefasFiltradas.forEach((tf) => {
        const row = document.createElement("div");
        row.className = "command-result-item";
        row.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>\u{1F4CC}</span>
                        <div>
                            <strong style="font-size: 0.9rem; color: #0F172A; display: block;">${tf.titulo}</strong>
                            <span style="font-size: 0.78rem; color: #64748B;">\u{1F3F7}\uFE0F ${tf.categoria} \u2022 \u{1F5D3}\uFE0F ${tf.data || "Sem data"}</span>
                        </div>
                    </div>
                    <span style="font-size: 0.75rem; color: #10B981; font-weight: 600;">Tarefa</span>
                `;
        row.addEventListener("click", () => {
          fecharCmd();
          window.location.hash = "#tarefas";
        });
        results.appendChild(row);
      });
    }
  }
  input.addEventListener("input", (e) => renderCmdResults(e.target.value));
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (modalOverlay.classList.contains("visible")) {
        fecharCmd();
      } else {
        abrirCmd();
      }
    }
    if (e.key === "Escape" && modalOverlay.classList.contains("visible")) {
      fecharCmd();
    }
  });
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) fecharCmd();
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest(".global-search-container") || e.target.closest(".global-search-input")) {
      abrirCmd();
    }
  });
}
