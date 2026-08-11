// js/components/paginas/dashboard.js
import { tarefasStorage } from '../../tarefasStorage.js';

// Calcula as estatísticas do dashboard a partir dos dados reais do storage.
const getDashboardData = () => {
    const tarefas = tarefasStorage.getTarefas();
    const totalTarefas = tarefas.length;
    const tarefasConcluidas = tarefas.filter(t => t.completed).length;
    const tarefasPendentes = tarefas.filter(t => !t.completed);

    // Simples heurística para tarefas de hoje e reuniões
    const tarefasHoje = tarefas.filter(t => t.time && t.time.toLowerCase().includes('hoje')).length;
    const totalReunioes = tarefas.filter(t => t.category.toLowerCase() === 'reunião').length;

    return {
        userName: 'Keren',
        weekTasks: totalTarefas,
        todayMeetings: totalReunioes, // Simplificado por enquanto
        highPriorityTasks: tarefas.filter(t => t.priority === 'Alta' && !t.completed).length,
        stats: {
            today: tarefasHoje.toString().padStart(2, '0'),
            completed: tarefasConcluidas.toString().padStart(2, '0'),
            meetings: totalReunioes.toString().padStart(2, '0'),
            productivity: totalTarefas > 0 ? `${Math.round((tarefasConcluidas / totalTarefas) * 100)}%` : '0%'
        },
        nextTask: tarefasPendentes.length > 0 ? tarefasPendentes[0] : null,
        nextMeetings: [
            { platform: 'Microsoft Teams', time: '10:00', title: 'Projeto Integrador' },
            { platform: 'Google Meet', time: '15:30', title: 'Mentoria' }
        ] // Mantido estático por enquanto
    };
};

const createDashboardPage = () => {
    const data = getDashboardData();

    const pageContent = document.createElement('div');
    pageContent.className = 'dashboard-container';

    // 1. Hero Principal
    const heroSection = `
        <section class="hero">
            <h1>Boa tarde, ${data.userName} 👋</h1>
            <p class="subtitle">Você possui <strong>${data.weekTasks} tarefas</strong> esta semana, <strong>${data.todayMeetings} reuniões hoje</strong> e <strong>${data.highPriorityTasks} tarefas de alta prioridade</strong>.</p>
        </section>
    `;

    // 2. Cards de Estatísticas
    const statsCards = `
        <section class="stats-grid">
            <div class="stat-card glass-card">
                <h2>Tarefas Hoje</h2>
                <p>${data.stats.today}</p>
            </div>
            <div class="stat-card glass-card">
                <h2>Concluídas</h2>
                <p>${data.stats.completed}</p>
            </div>
            <div class="stat-card glass-card">
                <h2>Reuniões</h2>
                <p>${data.stats.meetings}</p>
            </div>
            <div class="stat-card glass-card">
                <h2>Produtividade</h2>
                <p>${data.stats.productivity}</p>
            </div>
        </section>
    `;

    // 3. Próxima Tarefa e Reuniões
    const nextUpSection = `
        <section class="next-up-grid">
            ${data.nextTask ? `
                <div class="next-task-card glass-card">
                    <h3>Próxima tarefa</h3>
                    <div class="task-details">
                        <span class="task-title">${data.nextTask.title}</span>
                        <div class="task-meta">
                            <span>${data.nextTask.category}</span>
                            <span>${data.nextTask.time}</span>
                            <span class="priority high">${data.nextTask.priority}</span>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="next-task-card glass-card"><h3 class="all-done">🎉 Todas as tarefas concluídas!</h3></div>
            `}
            <div class="next-meetings-card glass-card">
                <h3>Próximas reuniões</h3>
                ${data.nextMeetings.map(meeting => `
                    <div class="meeting-item">
                        <div class="meeting-info">
                            <span class="meeting-platform">${meeting.platform}</span>
                            <span class="meeting-title">${meeting.title}</span>
                        </div>
                        <span class="meeting-time">${meeting.time}</span>
                    </div>
                `).join('')}
            </div>
        </section>
    `;

    pageContent.innerHTML = heroSection + statsCards + nextUpSection;
    return pageContent;
};

export default {
    url: '#dashboard',
    label: 'Dashboard',
    pagina: createDashboardPage
};