/**
 * Formata a data e o horário da tarefa para o formato de data do JavaScript.
 * @param {string} data - Data no formato "YYYY-MM-DD".
 * @param {string} horario - Horário no formato "HH:MM".
 * @returns {Date}
 */
function formatarDataCalendario(data, horario) {
    const [ano, mes, dia] = data.split("-");
    const [hora, minuto] = horario.split(":");
    return new Date(ano, mes - 1, dia, hora, minuto);
}

/**
 * Abre um evento no Google Calendar.
 * @param {object} tarefa 
 */
function abrirGoogleCalendar(tarefa) {
    const inicio = formatarDataCalendario(tarefa.data, tarefa.horario);
    const fim = new Date(inicio.getTime() + 60 * 60 * 1000); // Adiciona 1 hora
    const formatar = d => d.toISOString().replace(/[-:]|\.\d{3}/g, "");

    const url =
        "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        `&text=${encodeURIComponent(tarefa.titulo)}` +
        `&details=${encodeURIComponent(tarefa.descricao || "")}` +
        `&dates=${formatar(inicio)}/${formatar(fim)}`;

    window.open(url, "_blank");
}

/**
 * Abre um evento no Outlook Calendar.
 * @param {object} tarefa 
 */
function abrirOutlook(tarefa) {
    const inicio = formatarDataCalendario(tarefa.data, tarefa.horario);
    const fim = new Date(inicio.getTime() + 60 * 60 * 1000);

    const url =
        "https://outlook.office.com/calendar/0/deeplink/compose?" +
        `subject=${encodeURIComponent(tarefa.titulo)}` +
        `&body=${encodeURIComponent(tarefa.descricao || "")}` +
        `&startdt=${inicio.toISOString()}` +
        `&enddt=${fim.toISOString()}`;

    window.open(url, "_blank");
}

/**
 * Gera o conteúdo de um arquivo .ics para a tarefa.
 * @param {object} tarefa 
 * @returns {string}
 */
function gerarICS(tarefa) {
    const inicio = formatarDataCalendario(tarefa.data, tarefa.horario);
    const fim = new Date(inicio.getTime() + 60 * 60 * 1000);
    const formatar = d => d.toISOString().replace(/[-:]|\.\d{3}/g, "");

    return `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${tarefa.titulo}
DESCRIPTION:${tarefa.descricao || ""}
DTSTART:${formatar(inicio)}
DTEND:${formatar(fim)}
END:VEVENT
END:VCALENDAR
`.trim();
}

/**
 * Inicia o download de um arquivo .ics.
 * @param {object} tarefa 
 */
function baixarICS(tarefa) {
    const conteudo = gerarICS(tarefa);
    const blob = new Blob([conteudo], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tarefa.titulo}.ics`;
    link.click();
    URL.revokeObjectURL(url);
}

export function exportarParaCalendario(tarefa, destino) {
    if (!tarefa.data || !tarefa.horario) {
        alert("Por favor, defina uma data e horário para a tarefa antes de exportar.");
        return;
    }

    switch (destino) {
        case "google":
            abrirGoogleCalendar(tarefa);
            break;
        case "outlook":
            abrirOutlook(tarefa);
            break;
        case "ics":
            baixarICS(tarefa);
            break;
    }
}

export async function compartilharTarefa(tarefa) {
    if (!navigator.share) {
        alert("A API de compartilhamento não é suportada neste navegador.");
        return;
    }

    await navigator.share({
        title: tarefa.titulo,
        text: `
${tarefa.titulo}

${tarefa.descricao || ''}

${tarefa.data} ${tarefa.horario}
        `.trim()
    });
}