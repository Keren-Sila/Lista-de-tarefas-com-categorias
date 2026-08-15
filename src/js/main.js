// src/js/main.js
// Capítulo 9 da Apostila: SPA e Roteamento por Hash
import navbar from "./components/navbar/navbar.js";
import roteador from "./components/rotas/rotas.js";
import { solicitarPermissao } from "/notificacoes.js";

// Passo 1: montar o menu entregando o array de rotas para a navbar
navbar(roteador);

// Passo 2: capturar o palco <main id="app">
const app = document.getElementById('app');

// Passo 3: indexar as rotas em um objeto de consulta rápida (mapaDeRotas)
const mapaDeRotas = {};
for (const rota of roteador) {
    mapaDeRotas[rota.url] = rota;
}

// Passo 4: descobrir onde estamos e renderizar pela primeira vez
let hash = window.location.hash || '#inicio';
render();

// Passo 5: escutar a navegação via evento hashchange
window.addEventListener("hashchange", () => {
    hash = window.location.hash || '#inicio';
    render();
});

// Passo 6: renderizar com plano B (rota404)
const rota404 = {
    pagina: async (container) => {
        container.innerHTML = `
            <div class="card glass text-center" style="max-width: 480px; margin: 4rem auto; padding: 2.5rem; text-align: center;">
                <span style="font-size: 3rem; display: block; margin-bottom: 0.5rem;"><i data-lucide="search-x" style="width:56px;height:56px;"></i></span>
                <h2 style="font-size: 1.5rem; font-weight: 700; margin-top: 0.5rem;">Página não encontrada 404</h2>
                <p style="color: var(--text-secondary); margin: 1rem 0;">A rota solicitada não existe ou foi movida.</p>
                <a href="#dashboard" class="btn-primary">Voltar ao Dashboard</a>
            </div>
        `;
    }
};

export function renderLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}
window.renderLucideIcons = renderLucideIcons;

async function render() {
    const rotaAtual = mapaDeRotas[hash] || rota404;
    app.innerHTML = '';
    await rotaAtual.pagina(app);
    renderLucideIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Configurações adicionais: Banner de modo offline e Notificações
document.addEventListener('DOMContentLoaded', () => {
    configurarBannerOffline();
    solicitarPermissao().then(granted => {
        if (granted) console.log('🔔 Permissão para Notificações ativada.');
    });
});

function configurarBannerOffline() {
    let banner = document.getElementById('offline-banner');

    const atualizarStatusConexao = () => {
        if (!navigator.onLine) {
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'offline-banner';
                banner.className = 'offline-banner-notice fade-up';
                banner.innerHTML = `
                    <span>📶 Modo Offline — suas alterações serão salvas localmente e sincronizadas.</span>
                `;
                document.body.insertBefore(banner, document.body.firstChild);
            }
            banner.style.display = 'flex';
        } else {
            if (banner) {
                banner.style.display = 'none';
            }
        }
    };

    window.addEventListener('online', atualizarStatusConexao);
    window.addEventListener('offline', atualizarStatusConexao);
    atualizarStatusConexao();
}
let installEvent;

function mostrarBotaoInstalacao() {
    const navActions = document.querySelector('.navbar-right-actions');
    if (!navActions) return;

    let btnInstall = document.getElementById('btnInstalarApp');
    if (!btnInstall) {
        btnInstall = document.createElement('button');
        btnInstall.id = 'btnInstalarApp';
        btnInstall.className = 'btn-secondary btn-sm btn-nav-install';
        btnInstall.type = 'button';
        btnInstall.innerHTML = '📲 Instalar';
        btnInstall.addEventListener('click', async () => {
            if (!installEvent) return;
            await installEvent.prompt();
            installEvent = null;
            btnInstall.remove();
        });
        navActions.appendChild(btnInstall);
    }
}

window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installEvent = event;
    mostrarBotaoInstalacao();
});