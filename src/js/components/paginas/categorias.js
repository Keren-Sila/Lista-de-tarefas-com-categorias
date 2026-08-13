// src/js/components/paginas/categorias.js
// Capítulo 8 da Apostila: Componente auto montável recebendo o elemento app
import { carregarTarefas, carregarCategorias, salvarCategoria } from '../services/tarefasStorage.js';

async function createCategoriasPage(app) {
    const tarefas = carregarTarefas();
    const categorias = carregarCategorias();

    const statsPorCategoria = {};
    categorias.forEach(c => {
        statsPorCategoria[c.nome] = { total: 0, concluidas: 0, cor: c.cor, icone: c.icone };
    });

    tarefas.forEach(t => {
        const catNome = t.categoria || 'Sem Categoria';
        if (!statsPorCategoria[catNome]) {
            statsPorCategoria[catNome] = { total: 0, concluidas: 0, cor: '#64748B', icone: '🏷️' };
        }
        statsPorCategoria[catNome].total++;
        if (t.concluida) {
            statsPorCategoria[catNome].concluidas++;
        }
    });

    app.innerHTML = `
        <section class="categorias-page-wrapper categorias-container page-enter">
            <div class="categorias-header">
                <div>
                    <h1>🏷️ Categorias & Produtividade</h1>
                    <p class="subtitle">Acompanhe o progresso e organize tarefas por áreas da sua vida.</p>
                </div>
                <button id="btnNovaCategoria" class="btn-primary">➕ Nova Categoria</button>
            </div>

            <div class="category-grid">
                ${Object.keys(statsPorCategoria).map(catNome => {
                    const stats = statsPorCategoria[catNome];
                    const perc = stats.total > 0 ? Math.round((stats.concluidas / stats.total) * 100) : 0;
                    return `
                        <div class="category-card card glass" data-category="${catNome}">
                            <div class="category-header">
                                <div class="category-icon-badge" style="background-color: ${stats.cor}22; color: ${stats.cor}; border: 1px solid ${stats.cor}44;">
                                    ${stats.icone || '🏷️'}
                                </div>
                                <div>
                                    <h2 class="category-title">${catNome}</h2>
                                    <span class="category-subtitle">${stats.total} tarefas cadastradas</span>
                                </div>
                            </div>

                            <div class="category-stats-row">
                                <span>${stats.concluidas} concluídas</span>
                                <strong>${perc}%</strong>
                            </div>

                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: ${perc}%; background-color: ${stats.cor};"></div>
                            </div>

                            <button class="btn-secondary btn-block btn-sm btn-filter-cat">Ver Tarefas →</button>
                        </div>
                    `;
                }).join('')}
            </div>
        </section>
    `;

    app.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            window.location.hash = `#tarefas`;
        });
    });

    const btnNova = app.querySelector('#btnNovaCategoria');
    if (btnNova) {
        btnNova.addEventListener('click', () => {
            const nome = prompt("Nome da nova categoria (ex: Projetos, Finanças):");
            if (nome && nome.trim()) {
                const icone = prompt("Ícone (emoji ou símbolo, ex: 🚀, 💰, 🎨):", "📌") || "📌";
                const cor = prompt("Cor em formato HEX (ex: #4F46E5, #10B981):", "#4F46E5") || "#4F46E5";

                salvarCategoria({ nome: nome.trim(), icone, cor });
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            }
        });
    }
}

export default {
    url: '#categorias',
    label: 'Categorias',
    pagina: createCategoriasPage
};