const TAREFAS_KEY = 'taskflow_tarefas';

// Dados iniciais para popular o localStorage na primeira vez que o app for aberto
const DADOS_INICIAIS = [
    { id: 1, title: 'Implementar autenticação no TaskFlow', category: 'Faculdade', time: 'Hoje • 18:00', priority: 'Alta', completed: false },
    { id: 2, title: 'Reunião de alinhamento do projeto', category: 'Trabalho', time: 'Amanhã • 10:00', priority: 'Média', completed: false },
    { id: 3, title: 'Estudar Service Workers para PWA', category: 'Estudos', time: 'Quarta • 14:00', priority: 'Média', completed: true },
    { id: 4, title: 'Fazer compras da semana', category: 'Pessoal', time: 'Sábado • 09:00', priority: 'Baixa', completed: false },
];

export const tarefasStorage = {
    getTarefas: () => {
        const tarefas = localStorage.getItem(TAREFAS_KEY);
        if (!tarefas) {
            // Se não houver nada no localStorage, salva os dados iniciais e os retorna
            tarefasStorage.salvarTarefas(DADOS_INICIAIS);
            return DADOS_INICIAIS;
        }
        return JSON.parse(tarefas);
    },

    salvarTarefas: (tarefas) => {
        localStorage.setItem(TAREFAS_KEY, JSON.stringify(tarefas));
    },

    updateTaskStatus: (taskId, isCompleted) => {
        const tarefas = tarefasStorage.getTarefas();
        const taskIndex = tarefas.findIndex(t => t.id == taskId);

        if (taskIndex !== -1) {
            tarefas[taskIndex].completed = isCompleted;
            tarefasStorage.salvarTarefas(tarefas);
        }
    },

    addTask: (novaTarefa) => {
        const tarefas = tarefasStorage.getTarefas();
        // Gera um ID único baseado no timestamp
        novaTarefa.id = `task_${new Date().getTime()}`;
        tarefas.push(novaTarefa);
        tarefasStorage.salvarTarefas(tarefas);
    },
};