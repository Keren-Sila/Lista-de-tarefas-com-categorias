import { carregarUsuario } from '../services/authStorage.js';

async function inicio(app) {
    const user = carregarUsuario();
    app.innerHTML = `
        <section class="landing page-enter">
            <div class="landing-copy">
                <span class="landing-eyebrow">PLANEJAMENTO INTELIGENTE</span>
                <h1>Seu dia em ordem, com foco e direção.</h1>
                <p>TaskFlow combina tarefas, reuniões e prioridades em uma experiência premium, clara e sofisticada para quem quer executar com menos ruído e mais resultado.</p>
                <div class="landing-actions">
                    <a class="btn-primary" href="#dashboard">Abrir meu painel →</a>
                    <a class="btn-secondary" href="#login">Entrar</a>
                </div>
                <div class="landing-trust">
                    <span>✓ Offline first</span>
                    <span>✓ Calendário integrado</span>
                    <span>✓ PWA instalável</span>
                </div>
                <div class="landing-stats">
                    <div class="stat-mini">
                        <strong>78%</strong>
                        <span>progresso semanal</span>
                    </div>
                    <div class="stat-mini">
                        <strong>24h</strong>
                        <span>mais clareza</span>
                    </div>
                    <div class="stat-mini">
                        <strong>100%</strong>
                        <span>sem distração</span>
                    </div>
                </div>
            </div>
            <div class="landing-preview card">
                <div class="preview-top"><span>Hoje, ${user.nome.split(' ')[0]}</span><span class="online-dot">● Em foco</span></div>
                <h2> rotina mais leve.</h2>
                <div class="preview-progress"><span>Progresso da semana</span><strong>78%</strong><div><i style="width:78%"></i></div></div>
                <div class="preview-task"><b>09:00</b><span>Reunião com equipe</span><em>Teams</em></div>
                <div class="preview-task"><b>11:30</b><span>Revisar projeto</span><em>Trabalho</em></div>
                <div class="preview-task"><b>15:00</b><span>Entrega da atividade</span><em>Urgente</em></div>
            </div>
        </section>

        <section class="product-showcase">
            <div class="showcase-header">
                <span>PRODUTO E RESULTADO</span>
                <h2>Uma experiência pensada para manter você em movimento.</h2>
            </div>

            <div class="feature-grid">
                <article class="feature-card">
                    <div class="feature-icon"><i data-lucide="zap"></i></div>
                    <h3>Fluxo direto</h3>
                    <p>Crie tarefas, acompanhe prioridades e mantenha o foco sem perder tempo navegando por menus confusos.</p>
                </article>

                <article class="feature-card">
                    <div class="feature-icon"><i data-lucide="calendar"></i></div>
                    <h3>Agenda integrada</h3>
                    <p>Organize compromissos, reuniões e prazos em um só painel com visual claro e profissional.</p>
                </article>

                <article class="feature-card">
                    <div class="feature-icon"><i data-lucide="bar-chart-3"></i></div>
                    <h3>Visibilidade real</h3>
                    <p>Indicadores de progresso e categoria dão contexto ao seu dia e ajudam a agir com mais clareza.</p>
                </article>
            </div>
        </section>`;
}
export default { url: '#inicio', label: 'Início', pagina: inicio };