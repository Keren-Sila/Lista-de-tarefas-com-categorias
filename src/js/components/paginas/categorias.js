import { carregarTarefas } from '../../tarefasStorage.js';

const categoryDetails = {
    'Faculdade': { color: '#6366F1', icon: '🎓' },
    'Trabalho': { color: '#06B6D4', icon: '💼' },
    'Estudos': { color: '#F59E0B', icon: '📚' },
    'Pessoal': { color: '#EF4444', icon: '🏠' },
    'Reuniões': { color: '#10B981', icon: '🤝' },
    'Default': { color: '#64748B', icon: '🏷️' }
};

const createCategoriasPage = () => {
    const tarefas = carregarTarefas();

    const statsPorCategoria = tarefas.reduce((acc, tarefa) => {
        const categoria = tarefa.categoria || 'Pessoal';
        if (!acc[categoria]) {
            acc[categoria] = { total: 0, concluidas: 0 };
        }
        acc[categoria].total++;
        if (tarefa.concluida) {
            acc[categoria].concluidas++;
        }
        return acc;
    }, {});

    const page = document.createElement('div');
    page.className = 'categorias-container page-enter';

    page.innerHTML = `
        <section class="tarefas-page">
            <div class="tarefas-header info-hover-box" data-tooltip="Visão do progresso por categoria no ClickUp Workspace. Acompanhe a taxa de conclusão." style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                    <h1 style="font-size: 1.5rem; font-weight: 800; color: #0F172A;">🏷️ Categorias & Progresso</h1>
                    <p style="color: #64748B; font-size: 0.95rem; margin-top: 4px;">
                        Medição de entregas e progresso percentual por área de atuação.
                    </p>
                </div>
                <span class="info-badge">ℹ️ Progresso em tempo real</span>
            </div>

            <div class="category-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-top: 16px;"></div>
        </section>
    `;

    const grid = page.querySelector('.category-grid');

    for (const nomeCategoria in statsPorCategoria) {
        const stats = statsPorCategoria[nomeCategoria];
        const percentual = stats.total > 0 ? Math.round((stats.concluidas / stats.total) * 100) : 0;
        const details = categoryDetails[nomeCategoria] || categoryDetails.Default;

        const card = document.createElement('div');
        card.className = 'category-card glass-card info-hover-box';
        card.setAttribute('data-tooltip', `Categoria ${nomeCategoria}: ${stats.concluidas} de ${stats.total} tarefas concluídas (${percentual}%).`);
        card.style.padding = '20px';
        card.style.borderRadius = '16px';
        card.style.background = '#FFFFFF';
        card.style.border = '1px solid #E2E8F0';

        card.innerHTML = `
            <div class="category-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
                <div class="category-icon" style="background-color: ${details.color}15; color: ${details.color}; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; border: 1px solid ${details.color}30;">
                    ${details.icon}
                </div>
                <div>
                    <h3 class="category-title" style="margin: 0; color: #0F172A; font-size: 1.1rem; font-weight: 700;">${nomeCategoria}</h3>
                    <span style="font-size: 0.85rem; color: #64748B;">${stats.concluidas} de ${stats.total} concluídas</span>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #475569; margin-bottom: 8px;">
                <span>Progresso</span>
                <span style="font-weight: 700; color: ${details.color};">${percentual}%</span>
            </div>

            <div class="progress-bar-container" style="background: #E2E8F0; height: 8px; border-radius: 999px; overflow: hidden;">
                <div class="progress-bar" style="width: ${percentual}%; background-color: ${details.color}; height: 100%; border-radius: 999px; transition: width 0.4s ease;"></div>
            </div>
        `;
        grid.appendChild(card);
    }

    return page;
};

export default {
    url: '#categorias',
    label: 'Categorias',
    pagina: createCategoriasPage
};