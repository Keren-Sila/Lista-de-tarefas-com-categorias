import { solicitarPermissaoNotificacoes, verificarPermissaoNotificacoes } from '../../../../notificacoes.js';
import { carregarTarefas } from '../../tarefasStorage.js';
import { exportarParaCalendario } from '../../../../sync.js';

const THEME_KEY = 'taskflow_theme';

function configurarTemaBotao(botao, temaAtual) {
    if (!botao) return;
    const temaEscuroAtivo = temaAtual === 'dark';
    botao.textContent = temaEscuroAtivo ? '🌙 Modo Escuro' : '☀️ Modo Claro';
    botao.classList.toggle('active', temaEscuroAtivo);
}

function configuracoes() {
    const page = document.createElement('div');
    page.className = 'configuracoes-page page-enter';

    const statusNotificacao = verificarPermissaoNotificacoes();

    page.innerHTML = `
        <section class="tarefas-page">
            <div class="tarefas-header">
                <div>
                    <h1 style="font-size: 1.5rem; font-weight: 800; color: #0F172A;">⚙️ Tabela & Configurações de Sync</h1>
                    <p style="color: #64748B; margin-top: 4px; font-size: 0.95rem;">
                        Gerencie suas preferências de tema, notificações do dispositivo e sincronizações com calendários externos.
                    </p>
                </div>
            </div>

            <!-- SEÇÃO 1: SINCRONIZAÇÃO COM APPS EXTERNOS -->
            <div class="card glass-card info-hover-box" data-tooltip="Exporte todas as suas tarefas pendentes para o Google Calendar, Outlook, Teams ou iCal de forma integrada." style="margin-top: 16px; padding: 20px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.4rem;">📅</span>
                        <div>
                            <h3 style="margin: 0; color: #0F172A; font-size: 1.1rem; font-weight: 700;">Sincronização com Calendários Externos</h3>
                            <p style="margin: 2px 0 0 0; color: #64748B; font-size: 0.85rem;">Exporte suas tarefas para Google, Outlook, Teams e iCal</p>
                        </div>
                    </div>
                    <span class="info-badge">ℹ️ Info</span>
                </div>

                <div class="actions-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
                    <button id="syncGoogleAll" class="btn-secondary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px;">
                        <span style="color: #4285F4;">🌐</span> Google Calendar
                    </button>
                    <button id="syncOutlookAll" class="btn-secondary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px;">
                        <span style="color: #0078D4;">📧</span> Outlook / Teams
                    </button>
                    <button id="downloadIcsAll" class="btn-primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px;">
                        <span>📲</span> Baixar iCal (.ics)
                    </button>
                </div>
            </div>

            <!-- SEÇÃO 2: NOTIFICAÇÕES DO NAVEGADOR -->
            <div class="card glass-card info-hover-box" data-tooltip="Ative as notificações push locais para receber lembretes de tarefas e reuniões diretamente na barra do sistema." style="margin-top: 14px; padding: 20px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.4rem;">🔔</span>
                        <div>
                            <h3 style="margin: 0; color: #0F172A; font-size: 1.1rem; font-weight: 700;">Notificações Push do Dispositivo</h3>
                            <p style="margin: 2px 0 0 0; color: #64748B; font-size: 0.85rem;">Receba alertas de tarefas no horário programado</p>
                        </div>
                    </div>
                    <span class="info-badge">ℹ️ Info</span>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
                    <span id="notificacaoStatusLabel" style="font-size: 0.9rem; font-weight: 600; color: ${statusNotificacao === 'granted' ? '#10B981' : '#64748B'};">
                        Status atual: ${statusNotificacao === 'granted' ? '✅ Notificações Ativadas' : statusNotificacao === 'denied' ? '❌ Permissão Negada' : '⚠️ Permissão Pendente'}
                    </span>
                    <button id="btnAtivarNotificacoes" class="btn-secondary" style="padding: 8px 16px;">
                        🔔 Pedir Permissão
                    </button>
                </div>
            </div>

            <!-- SEÇÃO 3: TEMA E APARÊNCIA -->
            <div class="card glass-card info-hover-box" data-tooltip="Configuração de Aparência. Tema Claro Elegante ativo com bordas suaves e alto contraste." style="margin-top: 14px; padding: 20px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.4rem;">🎨</span>
                        <div>
                            <h3 style="margin: 0; color: #0F172A; font-size: 1.1rem; font-weight: 700;">Tema & Aparência Visual</h3>
                            <p style="margin: 2px 0 0 0; color: #64748B; font-size: 0.85rem;">Design Claro Elegante (Porcelain & Indigo)</p>
                        </div>
                    </div>
                    <span class="info-badge">ℹ️ Info</span>
                </div>

                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button id="themeToggleBtn" class="filter-pill active" style="padding: 8px 16px; font-weight: 600;">
                        🌙 Modo Escuro
                    </button>
                </div>
            </div>

            <!-- SEÇÃO 4: DADOS E ARMAZENAMENTO -->
            <div class="card glass-card info-hover-box" data-tooltip="Gerenciamento de dados persistentes do navegador via LocalStorage." style="margin-top: 14px; padding: 20px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.4rem;">💾</span>
                        <div>
                            <h3 style="margin: 0; color: #0F172A; font-size: 1.1rem; font-weight: 700;">Armazenamento & Dados</h3>
                            <p style="margin: 2px 0 0 0; color: #64748B; font-size: 0.85rem;">Gerencie o estado salvo em seu navegador</p>
                        </div>
                    </div>
                    <span class="info-badge">ℹ️ Info</span>
                </div>

                <button id="btnResetDados" class="btn-secondary" style="color: #EF4444; border-color: #FCA5A5;">
                    ⚠️ Redefinir Dados Locais
                </button>
            </div>
        </section>
    `;

    const themeToggleBtn = page.querySelector('#themeToggleBtn');
    const temaAtual = localStorage.getItem(THEME_KEY) || 'dark';
    configurarTemaBotao(themeToggleBtn, temaAtual);

    themeToggleBtn.addEventListener('click', () => {
        const proximoTema = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        document.body.dataset.theme = proximoTema;
        localStorage.setItem(THEME_KEY, proximoTema);
        configurarTemaBotao(themeToggleBtn, proximoTema);
    });

    // Listeners de Notificação
    const btnNotificacoes = page.querySelector('#btnAtivarNotificacoes');
    btnNotificacoes.addEventListener('click', async () => {
        const resultado = await solicitarPermissaoNotificacoes();
        const label = page.querySelector('#notificacaoStatusLabel');
        if (resultado === 'granted') {
            label.textContent = '✅ Notificações Ativadas';
            label.style.color = '#10B981';
            alert('Notificações ativadas com sucesso!');
        } else {
            label.textContent = '❌ Permissão Negada ou Indisponível';
            label.style.color = '#EF4444';
        }
    });

    // Listeners de Sync
    page.querySelector('#syncGoogleAll').addEventListener('click', () => {
        const tarefas = carregarTarefas();
        if (tarefas.length > 0) {
            exportarParaCalendario(tarefas[0], 'google');
        } else {
            alert('Nenhuma tarefa disponível para sincronização.');
        }
    });

    page.querySelector('#syncOutlookAll').addEventListener('click', () => {
        const tarefas = carregarTarefas();
        if (tarefas.length > 0) {
            exportarParaCalendario(tarefas[0], 'outlook');
        } else {
            alert('Nenhuma tarefa disponível para sincronização.');
        }
    });

    page.querySelector('#downloadIcsAll').addEventListener('click', () => {
        const tarefas = carregarTarefas();
        if (tarefas.length > 0) {
            exportarParaCalendario(tarefas[0], 'ics');
        } else {
            alert('Nenhuma tarefa disponível para sincronização.');
        }
    });

    page.querySelector('#btnResetDados').addEventListener('click', () => {
        if (confirm('Deseja realmente redefinir os dados para a versão inicial de demonstração?')) {
            localStorage.removeItem('taskflow_tarefas');
            localStorage.removeItem('taskflow_categorias');
            window.location.reload();
        }
    });

    return page;
}

export default {
    url: '#configuracoes',
    label: 'Ajustes',
    pagina: configuracoes
};
