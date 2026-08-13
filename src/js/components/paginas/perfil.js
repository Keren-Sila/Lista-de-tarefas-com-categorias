// src/js/components/paginas/perfil.js
// Capítulo 8 da Apostila: Componente auto montável recebendo o elemento app
import { carregarUsuario, atualizarPerfil, fazerLogout } from '../services/authStorage.js';
import { carregarTarefas, calcularEstatisticas } from '../services/tarefasStorage.js';

async function perfil(app) {
    const usuario = carregarUsuario();
    const tarefas = carregarTarefas();
    const stats = calcularEstatisticas(tarefas);

    const avatarPadrao = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome)}&background=4F46E5&color=fff&size=128`;
    const avatarSrc = usuario.avatar || avatarPadrao;

    app.innerHTML = `
        <section class="perfil-page perfil-container page-enter">
            <div class="perfil-header glass">
                <div class="avatar-wrapper">
                    <img id="imgAvatar" src="${avatarSrc}" alt="${usuario.nome}" class="profile-avatar">
                    <label for="inputUploadAvatar" class="avatar-edit-badge" title="Alterar Foto">
                        📷
                    </label>
                    <input type="file" id="inputUploadAvatar" accept="image/*" style="display:none;">
                </div>
                <div class="user-identity">
                    <h1>${usuario.nome}</h1>
                    <p class="user-email">${usuario.email}</p>
                    <span class="user-role-badge">⚡ ${usuario.cargo || 'Membro TaskFlow'}</span>
                </div>
                <button id="btnLogoutPerfil" class="btn-secondary btn-logout" title="Sair da conta">
                    🚪 Sair
                </button>
            </div>

            <div class="perfil-grid">
                <!-- Coluna 1: Dados Pessoais & Configurações da Conta -->
                <div class="card perfil-card">
                    <h3>👤 Dados Pessoais</h3>
                    <form id="formPerfil" class="perfil-form">
                        <div class="form-group">
                            <label for="perfilNome">Nome Completo</label>
                            <input type="text" id="perfilNome" value="${usuario.nome}" class="input-clean" required>
                        </div>

                        <div class="form-group">
                            <label for="perfilEmail">Endereço de E-mail</label>
                            <input type="email" id="perfilEmail" value="${usuario.email}" class="input-clean" required>
                        </div>

                        <div class="form-group">
                            <label for="perfilCargo">Cargo / Função</label>
                            <input type="text" id="perfilCargo" value="${usuario.cargo || 'Desenvolvedora Frontend'}" class="input-clean">
                        </div>

                        <div class="form-group">
                            <label for="perfilNovaSenha">Nova Senha (deixe em branco para manter)</label>
                            <input type="password" id="perfilNovaSenha" placeholder="••••••••" class="input-clean">
                        </div>

                        <div id="perfilAlert" class="auth-alert" style="display:none;"></div>

                        <button type="submit" class="btn-primary">Salvar Alterações</button>
                    </form>
                </div>

                <!-- Coluna 2: Estatísticas de Conta & Preferências PWA -->
                <div class="card perfil-card">
                    <h3>📊 Suas Estatísticas no TaskFlow</h3>
                    
                    <div class="stats-mini-grid">
                        <div class="mini-stat">
                            <span class="stat-number">${stats.total}</span>
                            <span class="stat-label">Total de Tarefas</span>
                        </div>
                        <div class="mini-stat">
                            <span class="stat-number">${stats.concluidas}</span>
                            <span class="stat-label">Concluídas</span>
                        </div>
                        <div class="mini-stat">
                            <span class="stat-number">${stats.progresso}%</span>
                            <span class="stat-label">Taxa de Conclusão</span>
                        </div>
                        <div class="mini-stat">
                            <span class="stat-number">${stats.reunioes}</span>
                            <span class="stat-label">Reuniões Agendadas</span>
                        </div>
                    </div>

                    <div class="pwa-settings">
                        <h4>📱 Preferências & PWA</h4>
                        <div class="setting-item">
                            <div>
                                <strong>Modo Offline First</strong>
                                <p>Salva todas as alterações localmente em tempo real</p>
                            </div>
                            <span class="status-pill active">Ativo</span>
                        </div>
                        <div class="setting-item">
                            <div>
                                <strong>Notificações do Navegador</strong>
                                <p>Lembretes 15 min antes das reuniões</p>
                            </div>
                            <button id="btnNotifToggle" class="btn-secondary btn-sm">Permitir</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    const formPerfil = app.querySelector('#formPerfil');
    const perfilAlert = app.querySelector('#perfilAlert');
    const inputUploadAvatar = app.querySelector('#inputUploadAvatar');
    const imgAvatar = app.querySelector('#imgAvatar');
    const btnLogoutPerfil = app.querySelector('#btnLogoutPerfil');
    const btnNotifToggle = app.querySelector('#btnNotifToggle');

    // Upload de Imagem de Perfil
    inputUploadAvatar.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                const base64Data = evt.target.result;
                imgAvatar.src = base64Data;
                atualizarPerfil({ avatar: base64Data });
                perfilAlert.className = 'auth-alert success';
                perfilAlert.textContent = 'Foto de perfil atualizada!';
                perfilAlert.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Submissão do Formulário
    formPerfil.addEventListener('submit', (e) => {
        e.preventDefault();
        const novoNome = app.querySelector('#perfilNome').value.trim();
        const novoEmail = app.querySelector('#perfilEmail').value.trim();
        const novoCargo = app.querySelector('#perfilCargo').value.trim();

        atualizarPerfil({
            nome: novoNome,
            email: novoEmail,
            cargo: novoCargo
        });

        perfilAlert.className = 'auth-alert success';
        perfilAlert.textContent = 'Dados salvos com sucesso!';
        perfilAlert.style.display = 'block';

        setTimeout(() => {
            window.location.hash = '#dashboard';
        }, 1000);
    });

    // Logout
    btnLogoutPerfil.addEventListener('click', () => {
        fazerLogout();
        window.location.hash = '#login';
    });

    // Notificações
    btnNotifToggle.addEventListener('click', async () => {
        if ("Notification" in window) {
            const p = await Notification.requestPermission();
            if (p === 'granted') {
                btnNotifToggle.textContent = 'Permitido ✓';
                btnNotifToggle.disabled = true;
            } else {
                alert('Permissão não concedida.');
            }
        }
    });
}

export default {
    url: '#perfil',
    label: 'Perfil',
    pagina: perfil
};
