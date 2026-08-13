// src/js/components/services/authStorage.js
import { LocalStorage } from './storageStrategy.js';

const AUTH_KEY = 'taskflow_usuario';

const USUARIO_PADRAO = {
    nome: "Keren Silva",
    email: "keren.silva@exemplo.com",
    avatar: "",
    cargo: "Desenvolvedora Frontend",
    logado: true,
    dataCriacao: "2024-01-15"
};

export function carregarUsuario() {
    if (!LocalStorage.has(AUTH_KEY)) {
        LocalStorage.set(AUTH_KEY, USUARIO_PADRAO);
        return USUARIO_PADRAO;
    }
    return LocalStorage.get(AUTH_KEY) || USUARIO_PADRAO;
}

export function salvarUsuario(usuario) {
    LocalStorage.set(AUTH_KEY, usuario);
    window.dispatchEvent(new CustomEvent('user-updated', { detail: usuario }));
}

export function fazerLogin(email, senha) {
    let usuario = carregarUsuario();
    if (!email || !senha) {
        return { sucesso: false, mensagem: "Por favor, preencha todos os campos." };
    }
    usuario.email = email;
    usuario.logado = true;
    salvarUsuario(usuario);
    return { sucesso: true, mensagem: "Login realizado com sucesso!" };
}

export function fazerCadastro(nome, email, senha) {
    if (!nome || !email || !senha) {
        return { sucesso: false, mensagem: "Por favor, preencha todos os campos." };
    }
    const novoUsuario = {
        nome,
        email,
        avatar: "",
        cargo: "Membro TaskFlow",
        logado: true,
        dataCriacao: new Date().toISOString().split("T")[0]
    };
    salvarUsuario(novoUsuario);
    return { sucesso: true, mensagem: "Cadastro realizado com sucesso!" };
}

export function fazerLogout() {
    let usuario = carregarUsuario();
    usuario.logado = false;
    salvarUsuario(usuario);
}

export function atualizarPerfil(novosDados) {
    let usuario = carregarUsuario();
    usuario = { ...usuario, ...novosDados };
    salvarUsuario(usuario);
    return usuario;
}
