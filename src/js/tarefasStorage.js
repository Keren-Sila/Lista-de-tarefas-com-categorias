const TAREFAS_KEY = 'taskflow_tarefas';

// Dados iniciais para popular o localStorage na primeira vez que o app for aberto
const DADOS_INICIAIS = [
    {
        id: "task_169178230",
        titulo: "Finalizar dashboard premium",
        descricao: "Implementar as estatísticas dinâmicas e o layout responsivo do painel principal.",
        categoria: "Faculdade",
        prioridade: "alta",
        data: "2024-05-21", // Use um formato YYYY-MM-DD para facilitar a ordenação
        horario: "14:00",
        diaSemana: "terca",
        concluida: false,
        sincronizar: true
    },
    {
        id: "task_169178231",
        titulo: "Reunião com equipe de design",
        descricao: "Alinhar os próximos passos da interface do calendário.",
        categoria: "Trabalho",
        prioridade: "media",
        data: "2024-05-22",
        horario: "10:00",
        diaSemana: "quarta",
        concluida: false,
        sincronizar: true
    }
];

export function carregarTarefas() {
    const tarefas = localStorage.getItem(TAREFAS_KEY);
    if (!tarefas) {
        salvarTarefas(DADOS_INICIAIS);
        return DADOS_INICIAIS;
    }
    return JSON.parse(tarefas);
}

export function salvarTarefas(tarefas) {
    localStorage.setItem(TAREFAS_KEY, JSON.stringify(tarefas));
}

export function updateTaskStatus(taskId, isCompleted) {
    const tarefas = carregarTarefas();
    const taskIndex = tarefas.findIndex(t => t.id == taskId);

    if (taskIndex !== -1) {
        tarefas[taskIndex].concluida = isCompleted;
        salvarTarefas(tarefas);
    }
}

export function addTask(novaTarefa) {
    const tarefas = carregarTarefas();
    novaTarefa.id = `task_${new Date().getTime()}`;
    tarefas.push(novaTarefa);
    salvarTarefas(tarefas);
}

export function removerTarefa(taskId) {
    let tarefas = carregarTarefas();
    tarefas = tarefas.filter(t => t.id !== taskId);
    salvarTarefas(tarefas);
}

export function calcularEstatisticas(tarefas) {
    const totalTarefas = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    const hoje = tarefas.filter(t => t.data && t.data.toLowerCase().includes('hoje')).length; // Simplificado
    const progresso = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0;

    return {
        hoje,
        concluidas,
        progresso,
        total: totalTarefas,
    };
}