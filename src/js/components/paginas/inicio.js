import { carregarUsuario } from '../services/authStorage.js';

async function inicio(app) {
    const user = carregarUsuario();
    app.innerHTML = `
        <section class="landing page-enter">
            <div class="landing-copy">
                <span class="landing-eyebrow">PLANEJAMENTO INTELIGENTE</span>
                <h1>Seu dia, no ritmo<br>que você precisa.</h1>
                <p>TaskFlow organiza tarefas, compromissos e prioridades em uma experiência simples, bonita e focada.</p>
                <div class="landing-actions">
                    <a class="btn-primary" href="#dashboard">Abrir meu painel →</a>
                    <a class="btn-secondary" href="#login">Entrar ou criar conta</a>
                </div>
                <div class="landing-trust"><span>✓ Offline first</span><span>✓ Calendário integrado</span><span>✓ PWA instalável</span></div>
            </div>
            <div class="landing-preview card">
                <div class="preview-top"><span>Hoje, ${user.nome.split(' ')[0]}</span><span class="online-dot">● Em foco</span></div>
                <h2>Uma rotina mais leve.</h2>
                <div class="preview-progress"><span>Progresso da semana</span><strong>78%</strong><div><i style="width:78%"></i></div></div>
                <div class="preview-task"><b>09:00</b><span>Reunião com equipe</span><em>Teams</em></div>
                <div class="preview-task"><b>11:30</b><span>Revisar projeto</span><em>Trabalho</em></div>
                <div class="preview-task"><b>15:00</b><span>Entrega da atividade</span><em>Urgente</em></div>
            </div>
        </section>`;
}
export default { url: '#inicio', label: 'Início', pagina: inicio };