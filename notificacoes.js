/**
 * Solicita permissão ao usuário para enviar notificações.
 * @returns {Promise<boolean>} - Retorna true se a permissão for concedida.
 */
export async function solicitarPermissao() {
    if (!("Notification" in window)) {
        console.error("Este navegador não suporta notificações.");
        return false;
    }

    const permissao = await Notification.requestPermission();
    return permissao === "granted";
}

/**
 * Agenda uma notificação local para uma tarefa específica.
 * @param {object} tarefa - O objeto da tarefa.
 */
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
        new Notification("TaskFlow: Lembrete de Tarefa", {
            body: tarefa.titulo,
            icon: "/src/img/icons/icon-192.png" // Caminho corrigido
        });
    }, tempo);
}