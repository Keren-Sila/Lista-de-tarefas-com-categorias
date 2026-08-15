// src/js/components/services/tarefasStorage.js
import { LocalStorage } from './storageStrategy.js';

const TAREFAS_KEY = 'taskflow_tarefas';
const CATEGORIAS_KEY = 'taskflow_categorias';

export const CATEGORIAS_PADRAO = [
    { nome: 'Trabalho', cor: '#4F46E5', icone: '<i data-lucide="briefcase"></i>' },
    { nome: 'Faculdade', cor: '#0284C7', icone: '<i data-lucide="graduation-cap"></i>' },
    { nome: 'Estudos', cor: '#F59E0B', icone: '<i data-lucide="book-open"></i>' },
    { nome: 'Pessoal', cor: '#EC4899', icone: '<i data-lucide="user"></i>' },
    { nome: 'Saúde', cor: '#10B981', icone: '<i data-lucide="heart-pulse"></i>' }
];

export function calcularTurno(horario) {
    if (!horario) return 'tarde';
    const hora = parseInt(horario.split(':')[0], 10);
    if (hora >= 5 && hora < 12) return 'manha';
    if (hora >= 12 && hora < 18) return 'tarde';
    return 'noite';
}

export function obterDiaSemana(dataStr) {
    if (!dataStr) return 'segunda';
    if (dataStr === 'Hoje') {
        const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        return dias[new Date().getDay()];
    }
    const partes = dataStr.split('-');
    if (partes.length === 3) {
        const d = new Date(partes[0], partes[1] - 1, partes[2]);
        const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        return dias[d.getDay()];
    }
    return 'segunda';
}

export function obterHojeISO() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

const DADOS_INICIAIS = [
    {
        id: "task_101",
        titulo: "Review de Código & Sprint Planning",
        descricao: "Alinhamento com o time de frontend para definir a arquitetura SPA e os componentes reutilizáveis.",
        categoria: "Trabalho",
        prioridade: "urgente",
        data: obterHojeISO(),
        horario: "09:30",
        diaSemana: obterDiaSemana(obterHojeISO()),
        turno: "manha",
        concluida: false,
        sincronizar: true,
        provedorReuniao: "Teams",
        linkReuniao: "https://teams.microsoft.com/l/meetup-join/123"
    },
    {
        id: "task_102",
        titulo: "Apresentação do Projeto Integrador",
        descricao: "Apresentar a aplicação SPA Lista de Tarefas com Categorias e arquitetura limpa.",
        categoria: "Faculdade",
        prioridade: "alta",
        data: obterHojeISO(),
        horario: "14:00",
        diaSemana: obterDiaSemana(obterHojeISO()),
        turno: "tarde",
        concluida: false,
        sincronizar: true,
        provedorReuniao: "Meet",
        linkReuniao: "https://meet.google.com/abc-defg-hij"
    },
    {
        id: "task_103",
        titulo: "Estudar PWA e Service Workers",
        descricao: "Revisar estratégias de Cache First e Network First conforme a apostila do curso.",
        categoria: "Estudos",
        prioridade: "media",
        data: obterHojeISO(),
        horario: "19:00",
        diaSemana: obterDiaSemana(obterHojeISO()),
        turno: "noite",
        concluida: true,
        sincronizar: false
    },
    {
        id: "task_104",
        titulo: "Reunião de Alinhamento de Produto",
        descricao: "Definição do escopo das novas categorias personalizadas e integrações com calendários.",
        categoria: "Trabalho",
        prioridade: "media",
        data: obterHojeISO(),
        horario: "16:30",
        diaSemana: obterDiaSemana(obterHojeISO()),
        turno: "tarde",
        concluida: false,
        sincronizar: true,
        provedorReuniao: "Zoom",
        linkReuniao: "https://zoom.us/j/987654321"
    },
    {
        id: "task_105",
        titulo: "Treino e Atividade Física",
        descricao: "Caminhada de 45 minutos no parque.",
        categoria: "Saúde",
        prioridade: "baixa",
        data: obterHojeISO(),
        horario: "07:00",
        diaSemana: obterDiaSemana(obterHojeISO()),
        turno: "manha",
        concluida: true,
        sincronizar: false
    }
];

export function carregarTarefas() {
    if (!LocalStorage.has(TAREFAS_KEY)) {
        salvarTarefas(DADOS_INICIAIS);
        return DADOS_INICIAIS;
    }
    return LocalStorage.get(TAREFAS_KEY) || DADOS_INICIAIS;
}

export function salvarTarefas(tarefas) {
    LocalStorage.set(TAREFAS_KEY, tarefas);
    window.dispatchEvent(new CustomEvent('tasks-updated'));
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
    if (!novaTarefa.id) {
        novaTarefa.id = `task_${Date.now()}`;
    }
    if (!novaTarefa.diaSemana && novaTarefa.data) {
        novaTarefa.diaSemana = obterDiaSemana(novaTarefa.data);
    }
    if (!novaTarefa.turno && novaTarefa.horario) {
        novaTarefa.turno = calcularTurno(novaTarefa.horario);
    }
    tarefas.unshift(novaTarefa);
    salvarTarefas(tarefas);
    return novaTarefa;
}

export function atualizarTarefa(tarefaAtualizada) {
    const tarefas = carregarTarefas();
    const index = tarefas.findIndex(t => t.id === tarefaAtualizada.id);
    if (index !== -1) {
        if (tarefaAtualizada.data) {
            tarefaAtualizada.diaSemana = obterDiaSemana(tarefaAtualizada.data);
        }
        if (tarefaAtualizada.horario) {
            tarefaAtualizada.turno = calcularTurno(tarefaAtualizada.horario);
        }
        tarefas[index] = { ...tarefas[index], ...tarefaAtualizada };
        salvarTarefas(tarefas);
    }
}

export function removerTarefa(taskId) {
    let tarefas = carregarTarefas();
    tarefas = tarefas.filter(t => t.id !== taskId);
    salvarTarefas(tarefas);
}

export function calcularEstatisticas(tarefas) {
    const totalTarefas = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    const hojeISO = obterHojeISO();
    const hoje = tarefas.filter(t => t.data === hojeISO).length;
    const reunioesCount = tarefas.filter(t => t.provedorReuniao || t.linkReuniao).length;
    const progresso = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0;

    return {
        hoje,
        concluidas,
        progresso,
        total: totalTarefas,
        reunioes: reunioesCount
    };
}

export function normalizarIconeLucide(icone) {
    if (!icone) return '<i data-lucide="tag"></i>';
    if (icone.includes('data-lucide')) return icone;
    const mapa = {
        '💼': '<i data-lucide="briefcase"></i>',
        '🎓': '<i data-lucide="graduation-cap"></i>',
        '📚': '<i data-lucide="book-open"></i>',
        '👤': '<i data-lucide="user"></i>',
        '🌿': '<i data-lucide="heart-pulse"></i>',
        '🏷️': '<i data-lucide="tag"></i>',
        '🚀': '<i data-lucide="rocket"></i>',
        '💰': '<i data-lucide="dollar-sign"></i>',
        '🎨': '<i data-lucide="palette"></i>',
        '📌': '<i data-lucide="pin"></i>'
    };
    return mapa[icone.trim()] || `<i data-lucide="tag"></i>`;
}

export function carregarCategorias() {
    let cats;
    if (!LocalStorage.has(CATEGORIAS_KEY)) {
        LocalStorage.set(CATEGORIAS_KEY, CATEGORIAS_PADRAO);
        cats = CATEGORIAS_PADRAO;
    } else {
        cats = LocalStorage.get(CATEGORIAS_KEY) || CATEGORIAS_PADRAO;
    }
    return cats.map(c => ({
        ...c,
        icone: normalizarIconeLucide(c.icone)
    }));
}

export function salvarCategoria(novaCat) {
    const cats = LocalStorage.get(CATEGORIAS_KEY) || CATEGORIAS_PADRAO;
    if (!cats.some(c => c.nome.toLowerCase() === novaCat.nome.toLowerCase())) {
        novaCat.icone = normalizarIconeLucide(novaCat.icone);
        cats.push(novaCat);
        LocalStorage.set(CATEGORIAS_KEY, cats);
        window.dispatchEvent(new CustomEvent('categories-updated'));
    }
}
