// js/components/paginas/categorias.js
import { tarefasStorage } from '../../tarefasStorage.js';

// Mapeamento de categorias para cores e ícones (pode ser expandido)
const categoryDetails = {
    'Faculdade': { color: '#7C6FF7', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v11.494m-9-5.747h18"></path></svg>' },
    'Trabalho': { color: '#4ECDC4', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>' },
    'Estudos': { color: '#FBBF24', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v11.494m-9-5.747h18"></path></svg>' },
    'Pessoal': { color: '#FF6B6B', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>' },
    'Default': { color: '#94A3B8', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>' }
};

const createCategoriasPage = () => {
    const tarefas = tarefasStorage.getTarefas();

    // 1. Agrupar tarefas por categoria
    const statsPorCategoria = tarefas.reduce((acc, tarefa) => {
        const categoria = tarefa.category || 'Sem Categoria';
        if (!acc[categoria]) {
            acc[categoria] = { total: 0, concluidas: 0 };
        }
        acc[categoria].total++;
        if (tarefa.completed) {
            acc[categoria].concluidas++;
        }
        return acc;
    }, {});

    // 2. Criar o container da página
    const page = document.createElement('div');
    page.className = 'categorias-container';

    const pageTitle = document.createElement('h1');
    pageTitle.textContent = 'Progresso por Categoria';
    page.appendChild(pageTitle);

    const grid = document.createElement('div');
    grid.className = 'category-grid';

    // 3. Criar um card para cada categoria
    for (const nomeCategoria in statsPorCategoria) {
        const stats = statsPorCategoria[nomeCategoria];
        const percentual = stats.total > 0 ? Math.round((stats.concluidas / stats.total) * 100) : 0;
        const details = categoryDetails[nomeCategoria] || categoryDetails.Default;

        const card = document.createElement('div');
        card.className = 'category-card glass';
        card.innerHTML = `
            <div class="category-header">
                <div class="category-icon" style="background-color: ${details.color};">
                    ${details.icon}
                </div>
                <h2 class="category-title">${nomeCategoria}</h2>
            </div>
            <div class="category-stats">
                <span>${stats.total} tarefas</span> &bull; <span>${percentual}% concluído</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${percentual}%; background-color: ${details.color};"></div>
            </div>
        `;
        grid.appendChild(card);
    }

    page.appendChild(grid);
    return page;
};

export default {
    url: '#categorias',
    label: 'Categorias',
    pagina: createCategoriasPage
};