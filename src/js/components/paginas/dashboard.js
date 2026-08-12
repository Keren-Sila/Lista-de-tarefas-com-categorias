import {
    carregarTarefas,
    calcularEstatisticas
} from "../../tarefasStorage.js";

function saudacao() {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
}

function obterProximaTarefa(tarefas) {
    const pendentes = tarefas.filter(t => !t.concluida);
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
    const tarefas = carregarTarefas();
    const stats = calcularEstatisticas(tarefas);
    const proxima = obterProximaTarefa(tarefas);

    const page = document.createElement('div');
    page.className = 'dashboard-container page-enter';

    page.innerHTML = `
    <section class="dashboard">

      <!-- HERO DASHBOARD -->
      <div class="dashboard-hero fade-up info-hover-box" data-tooltip="Painel de visão geral da sua semana no ClickUp Workspace. Apresenta métricas em tempo real.">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap;">
            <div>
                <h1>${saudacao()}, Keren 👋</h1>
                <p>Organize sua semana com clareza, alta performance e elegância.</p>
            </div>
            <span class="info-badge" title="Passe o mouse ou toque para ver a função da seção">ℹ️ Função do Hero</span>
        </div>
      </div>

      <!-- GRID DE ESTATÍSTICAS DA SEMANA -->
      <div class="dashboard-grid fade-up" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px;">
        ${cardEstatistica("Tarefas Hoje", stats.hoje, "primary", "Métrica de tarefas agendadas para a data atual.")}
        ${cardEstatistica("Concluídas", stats.concluidas, "success", "Total de tarefas finalizadas na semana.")}
        ${cardEstatistica("Reuniões", 3, "accent", "Compromissos agendados via Teams, Google ou Outlook.")}
        ${cardEstatistica("Produtividade", `${stats.progresso}%`, "warning", "Taxa percentual de conclusão das tarefas.")}
      </div>

      <!-- PAINÉIS LADO A LADO -->
      <div class="dashboard-panels fade-up">

        <!-- PRÓXIMA TAREFA PENDENTE -->
        <div class="card dashboard-panel glass-card info-hover-box" data-tooltip="Exibe a tarefa prioritária agendada para ser executada a seguir.">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="color: #0F172A; font-size: 1.1rem; margin: 0; font-weight: 700;">📌 Próxima Tarefa</h3>
            <span class="info-badge">ℹ️ Destaque</span>
          </div>

          ${proxima
            ? `
                <div class="next-task" style="background: #F8FAFC; padding: 16px; border-radius: 12px; border-left: 4px solid var(--primary-color);">
                  <strong style="font-size: 1.05rem; color: #0F172A; display: block;">${proxima.titulo}</strong>
                  <p style="color: #64748B; font-size: 0.9rem; margin: 4px 0 8px 0;">${proxima.categoria} • Prioridade ${proxima.prioridade || 'Média'}</p>
                  <span style="font-size: 0.85rem; color: var(--primary-color); font-weight: 600;">🗓️ ${proxima.data || "Hoje"} • ⏰ ${proxima.horario || "14:00"}</span>
                </div>
              `
            : `
                <p style="color: #64748B; font-size: 0.95rem;">Nenhuma tarefa pendente no momento. 🎉</p>
              `
        }
        </div>

        <!-- PRÓXIMAS REUNIÕES EXTERNAS -->
        <div class="card dashboard-panel glass-card info-hover-box" data-tooltip="Reuniões sincronizadas com Teams, Google e Outlook.">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="color: #0F172A; font-size: 1.1rem; margin: 0; font-weight: 700;">📅 Próximas Reuniões</h3>
            <span class="info-badge">ℹ️ Sync</span>
          </div>

          <ul class="meeting-list" style="display: flex; flex-direction: column; gap: 10px;">
            <li style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #F8FAFC; border-radius: 10px; border: 1px solid #E2E8F0;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="badge teams" style="background: #5B5FC7; color: white; padding: 4px 10px; border-radius: 8px; font-weight: 600; font-size: 0.75rem;">Teams</span>
                <span style="color: #0F172A; font-weight: 600; font-size: 0.9rem;">Projeto Integrador</span>
              </div>
              <span style="color: #64748B; font-size: 0.85rem;">10:00</span>
            </li>

            <li style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #F8FAFC; border-radius: 10px; border: 1px solid #E2E8F0;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="badge google" style="background: #EA4335; color: white; padding: 4px 10px; border-radius: 8px; font-weight: 600; font-size: 0.75rem;">Google</span>
                <span style="color: #0F172A; font-weight: 600; font-size: 0.9rem;">Mentoria Frontend</span>
              </div>
              <span style="color: #64748B; font-size: 0.85rem;">15:30</span>
            </li>

            <li style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #F8FAFC; border-radius: 10px; border: 1px solid #E2E8F0;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="badge outlook" style="background: #0078D4; color: white; padding: 4px 10px; border-radius: 8px; font-weight: 600; font-size: 0.75rem;">Outlook</span>
                <span style="color: #0F172A; font-weight: 600; font-size: 0.9rem;">Sincronização de Sprints</span>
              </div>
              <span style="color: #64748B; font-size: 0.85rem;">17:00</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- AÇÕES RÁPIDAS -->
      <div class="card quick-actions glass-card fade-up info-hover-box" data-tooltip="Atalhos rápidos de navegação para tarefas, calendário, categorias e configurações.">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="color: #0F172A; font-size: 1.1rem; margin: 0; font-weight: 700;">⚡ Ações Rápidas</h3>
            <span class="info-badge">ℹ️ Atalhos</span>
        </div>

        <div class="actions-grid" style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="#tarefas" class="btn-primary">
            ➕ Gerenciar Tarefas
          </a>
          <a href="#calendario" class="btn-secondary">
            📅 Agenda Semanal
          </a>
          <a href="#categorias" class="btn-secondary">
            🏷️ Categorias
          </a>
          <a href="#configuracoes" class="btn-secondary">
            ⚙️ Sincronização & Ajustes
          </a>
        </div>
      </div>

    </section>
  `;

    iniciarAnimacaoContadores(page);
    return page;
}

function iniciarAnimacaoContadores(container) {
    const elementos = container.querySelectorAll("[data-value]");
    elementos.forEach(elemento => {
        const valStr = elemento.dataset.value.toString();
        const alvo = parseInt(valStr.replace("%", ""));
        if (isNaN(alvo)) return;

        let atual = 0;
        const incremento = Math.max(1, Math.ceil(alvo / 25));

        const timer = setInterval(() => {
            atual += incremento;
            if (atual >= alvo) {
                atual = alvo;
                clearInterval(timer);
            }
            elemento.textContent = valStr.includes("%") ? `${atual}%` : atual;
        }, 30);
    });
}

export default {
    url: "#dashboard",
    label: "Dashboard",
    pagina: dashboard
};