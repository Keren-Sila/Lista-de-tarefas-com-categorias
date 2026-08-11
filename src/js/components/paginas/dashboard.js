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

    if (pendentes.length === 0) {
        return null;
    }

    return pendentes[0];
}

function cardEstatistica(titulo, valor, classe) {
    return `
    <div class="stat-card ${classe}">
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

    page.innerHTML = `
    <section class="dashboard">

      <div class="dashboard-hero glass fade-up">
        <h1>${saudacao()}, Keren 👋</h1>
        <p>Organize sua semana e mantenha tudo sob controle.</p>
      </div>

      <div class="dashboard-grid fade-up">

        ${cardEstatistica("Tarefas Hoje", stats.hoje, "primary")}

        ${cardEstatistica("Concluídas", stats.concluidas, "success")}

        ${cardEstatistica("Reuniões", 3, "accent")}

        ${cardEstatistica("Produtividade", `${stats.progresso}%`, "warning")}

      </div>

      <div class="dashboard-panels fade-up">

        <div class="card dashboard-panel">
          <h3>📌 Próxima tarefa</h3>

          ${proxima
            ? `
                <div class="next-task">
                  <strong>${proxima.titulo}</strong>
                  <p>${proxima.categoria}</p>
                  <span>${proxima.data || "Hoje"} • ${proxima.horario || "14:00"}</span>
                </div>
              `
            : `
                <p>Nenhuma tarefa pendente.</p>
              `
        }

        </div>

        <div class="card dashboard-panel">
          <h3>📅 Próximas reuniões</h3>

          <ul class="meeting-list">
            <li>
              <span class="badge teams">Teams</span>
              Projeto Integrador — 10:00
            </li>

            <li>
              <span class="badge google">Google</span>
              Mentoria — 15:30
            </li>

            <li>
              <span class="badge outlook">Outlook</span>
              Planejamento — 17:00
            </li>
          </ul>

        </div>

      </div>

      <div class="card quick-actions fade-up">
        <h3>⚡ Ações rápidas</h3>

        <div class="actions-grid">

          <a href="#tarefas" class="btn-primary">
            ➕ Nova tarefa
          </a>

          <a href="#calendario" class="btn-secondary">
            📅 Calendário
          </a>

          <a href="#configuracoes" class="btn-secondary">
            ⚙ Configurações
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

        const alvo = parseInt(
            elemento.dataset.value.toString().replace("%", "")
        );

        let atual = 0;

        const incremento = Math.max(1, Math.ceil(alvo / 30));

        const timer = setInterval(() => {

            atual += incremento;

            if (atual >= alvo) {
                atual = alvo;
                clearInterval(timer);
            }

            elemento.textContent = elemento.dataset.value.includes("%") ?
                `${atual}%` :
                atual;

        }, 20);

    });
}

export default {
    url: "#dashboard",
    label: "Dashboard",
    pagina: dashboard
};