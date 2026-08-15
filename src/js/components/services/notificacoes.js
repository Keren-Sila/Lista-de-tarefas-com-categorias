// src/js/components/services/notificacoes.js
export async function solicitarPermissao() {
    if (!("Notification" in window)) {
        console.error("Este navegador não suporta notificações.");
        return false;
    }

    const permissao = await Notification.requestPermission();
    return permissao === "granted";
}

export function scheduleNotification(tarefa) {
    if (Notification.permission !== "granted") {
        console.warn("Permissão para notificações não foi concedida.");
        return;
    }

    if (!tarefa.data || !tarefa.horario) {
        console.warn("Tarefa sem data ou horário definidos, notificação não agendada.");
        return;
    }

    const horario = new Date(`${tarefa.data}T${tarefa.horario}`);
    const tempo = horario.getTime() - Date.now();

    if (tempo <= 0) {
        console.log("O horário da tarefa já passou, notificação não agendada.");
        return;
    }

    setTimeout(() => {
        new Notification("Fluxo: Lembrete de Tarefa", {
            body: tarefa.titulo,
            icon: "src/img/icons/icon-192.png"
        });
    }, tempo);
}
