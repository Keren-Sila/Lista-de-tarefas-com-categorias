// src/js/components/paginas/login.js
// Capítulo 8 da Apostila: Componente auto montável recebendo o elemento app
import { fazerLogin, fazerCadastro, carregarUsuario } from '../services/authStorage.js';

async function login(app) {
    const usuarioAtual = carregarUsuario();
    if (usuarioAtual && usuarioAtual.logado && window.location.hash === '#login') {
        setTimeout(() => { window.location.hash = '#dashboard'; }, 100);
    }

    app.innerHTML = `
        <div class="login-page login-page-wrapper page-enter">
            <div class="login-split-container">
                <!-- Lado Esquerdo: Mensagem de valor + Ilustração -->
                <div class="login-hero-side">
                    <div class="brand-badge">
                        <span class="logo-icon">⚡</span>
                        <span class="brand-name">TaskFlow</span>
                    </div>

                    <div class="hero-content">
                        <h1>Sua semana organizada com máxima produtividade</h1>
                        <p>Gerencie tarefas por dia da semana, turnos e categorias personalizadas com sincronização offline e integração com calendários.</p>

                        <div class="feature-pills">
                            <div class="feature-pill">
                                <span>📅</span> Organização por Dias & Turnos
                            </div>
                            <div class="feature-pill">
                                <span>🏷️</span> Categorias & Prioridades
                            </div>
                            <div class="feature-pill">
                                <span>⚡</span> Integrado com Teams, Meet e Zoom
                            </div>
                        </div>
                    </div>

                    <div class="hero-footer">
                        <p>&copy; 2026 TaskFlow — SPA Professional Edition</p>
                    </div>
                </div>

                <!-- Lado Direito: Formulário Clean -->
                <div class="login-form-side">
                    <div class="form-card glass">
                        <div class="form-tabs">
                            <button id="tabLogin" class="tab-btn active">Entrar</button>
                            <button id="tabCadastro" class="tab-btn">Criar Conta</button>
                        </div>

                        <div class="form-header">
                            <h2 id="formTitle">Bem-vindo de volta! 👋</h2>
                            <p id="formSubtitle">Insira suas credenciais para acessar seu painel.</p>
                        </div>

                        <!-- Mensagem de Feedback -->
                        <div id="authAlert" class="auth-alert" style="display: none;"></div>

                        <form id="authForm" class="auth-form">
                            <div class="form-group" id="groupNome" style="display: none;">
                                <label for="inputNome">Nome Completo</label>
                                <input type="text" id="inputNome" placeholder="Seu nome" class="input-clean">
                            </div>

                            <div class="form-group">
                                <label for="inputEmail">Endereço de E-mail</label>
                                <input type="email" id="inputEmail" placeholder="seu.email@exemplo.com" class="input-clean" required value="${usuarioAtual.email || ''}">
                            </div>

                            <div class="form-group">
                                <label for="inputSenha">Senha</label>
                                <input type="password" id="inputSenha" placeholder="••••••••" class="input-clean" required value="123456">
                            </div>

                            <div class="form-actions-row" id="rowEsqueci">
                                <label class="remember-me">
                                    <input type="checkbox" checked>
                                    <span>Lembrar de mim</span>
                                </label>
                                <a href="javascript:void(0)" id="btnEsqueciSenha" class="forgot-link">Esqueceu a senha?</a>
                            </div>

                            <button type="submit" id="btnAuthSubmit" class="btn-primary btn-block">
                                Entrar na plataforma
                            </button>
                        </form>

                        <div class="divider">
                            <span>ou continue com</span>
                        </div>

                        <div class="social-login-grid">
                            <button type="button" class="btn-social" id="btnGoogle" data-tooltip="Entrar usando sua conta do Google">
                                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/></svg>
                                Google
                            </button>
                            <button type="button" class="btn-social" id="btnMicrosoft" data-tooltip="Entrar usando sua conta da Microsoft">
                                <svg width="18" height="18" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
                                Microsoft
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const tabLogin = app.querySelector('#tabLogin');
    const tabCadastro = app.querySelector('#tabCadastro');
    const formTitle = app.querySelector('#formTitle');
    const formSubtitle = app.querySelector('#formSubtitle');
    const groupNome = app.querySelector('#groupNome');
    const inputNome = app.querySelector('#inputNome');
    const rowEsqueci = app.querySelector('#rowEsqueci');
    const btnAuthSubmit = app.querySelector('#btnAuthSubmit');
    const authForm = app.querySelector('#authForm');
    const authAlert = app.querySelector('#authAlert');
    const btnEsqueciSenha = app.querySelector('#btnEsqueciSenha');

    let modoCadastro = false;

    tabLogin.addEventListener('click', () => {
        modoCadastro = false;
        tabLogin.classList.add('active');
        tabCadastro.classList.remove('active');
        formTitle.textContent = 'Bem-vindo de volta! 👋';
        formSubtitle.textContent = 'Insira suas credenciais para acessar seu painel.';
        groupNome.style.display = 'none';
        inputNome.required = false;
        rowEsqueci.style.display = 'flex';
        btnAuthSubmit.textContent = 'Entrar na plataforma';
        authAlert.style.display = 'none';
    });

    tabCadastro.addEventListener('click', () => {
        modoCadastro = true;
        tabCadastro.classList.add('active');
        tabLogin.classList.remove('active');
        formTitle.textContent = 'Crie sua conta no TaskFlow 🚀';
        formSubtitle.textContent = 'Comece a organizar suas tarefas e rotina hoje mesmo.';
        groupNome.style.display = 'block';
        inputNome.required = true;
        rowEsqueci.style.display = 'none';
        btnAuthSubmit.textContent = 'Criar minha conta';
        authAlert.style.display = 'none';
    });

    btnEsqueciSenha.addEventListener('click', () => {
        const email = app.querySelector('#inputEmail').value.trim();
        if (!email) {
            authAlert.className = 'auth-alert warning';
            authAlert.textContent = 'Digite seu e-mail para receber as instruções de recuperação.';
            authAlert.style.display = 'block';
        } else {
            authAlert.className = 'auth-alert success';
            authAlert.textContent = `Enviamos um link de redefinição para ${email}. Verifique sua caixa de entrada!`;
            authAlert.style.display = 'block';
        }
    });

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = app.querySelector('#inputEmail').value.trim();
        const senha = app.querySelector('#inputSenha').value.trim();

        let resultado;
        if (modoCadastro) {
            const nome = inputNome.value.trim();
            resultado = fazerCadastro(nome, email, senha);
        } else {
            resultado = fazerLogin(email, senha);
        }

        if (resultado.sucesso) {
            authAlert.className = 'auth-alert success';
            authAlert.textContent = `${resultado.mensagem} Redirecionando...`;
            authAlert.style.display = 'block';
            setTimeout(() => {
                window.location.hash = '#dashboard';
            }, 800);
        } else {
            authAlert.className = 'auth-alert error';
            authAlert.textContent = resultado.mensagem;
            authAlert.style.display = 'block';
        }
    });

    const simularSocial = (provedor) => {
        fazerLogin(`usuario.${provedor.toLowerCase()}@exemplo.com`, "social123");
        authAlert.className = 'auth-alert success';
        authAlert.textContent = `Autenticado com sucesso via ${provedor}! Redirecionando...`;
        authAlert.style.display = 'block';
        setTimeout(() => {
            window.location.hash = '#dashboard';
        }, 800);
    };

    app.querySelector('#btnGoogle').addEventListener('click', () => simularSocial('Google'));
    app.querySelector('#btnMicrosoft').addEventListener('click', () => simularSocial('Microsoft'));
}

export default {
    url: '#login',
    label: 'Login',
    pagina: login
};
