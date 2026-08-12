/**
 * Módulo de Notificações Push do Navegador / Dispositivo (Web Notification API)
 */

export async function solicitarPermissaoNotificacoes() {
    if (!("Notification" in window)) {
        console.error("Este navegador não suporta a Web Notification API.");
        return "unsupported";
    }

    const permissao = await Notification.requestPermission();
    return permissao;
}

export function verificarPermissaoNotificacoes() {
    if (!("Notification" in window)) {
        return "unsupported";
    }
    return Notification.permission;
}

export function scheduleNotification(tarefa) {
    if (!("Notification" in window) || Notification.permission !== "granted") {
        console.warn("Permissão para notificações não concedida.");
        return;
    }

    if (!tarefa.data || !tarefa.horario) {
        return;
    }

    try {
        const horario = new Date(`${tarefa.data}T${tarefa.horario}`);
        const tempo = horario.getTime() - Date.now();

        if (tempo <= 0) return;

        setTimeout(() => {
            new Notification(`TaskFlow: ${tarefa.titulo}`, {
                body: `Horário da tarefa em ${tarefa.categoria || 'Geral'}: ${tarefa.horario}`,
                icon: "/src/img/icons/icon-192.png",
                badge: "/src/img/icons/icon-192.png",
                vibrate: [200, 100, 200]
            });
        }, tempo);
    } catch (e) {
        console.error("Erro ao agendar notificação:", e);
    }
}