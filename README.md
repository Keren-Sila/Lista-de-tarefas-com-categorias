# 🚀 TaskFlow — Plataforma Profissional de Gestão de Tarefas & Produtividade

O **TaskFlow** é uma aplicação web de classe de produção (**Single Page Application - SPA**) desenvolvida em **JavaScript Puro (ES6+)**, sem frameworks pesados, aplicando os mais rigorosos padrões de arquitetura de software web.

Projetado sob o conceito visual **"Midnight Flow"** (inspirado em ferramentas de alto nível como ClickUp e Linear), o TaskFlow combina um design moderno em *Dark Mode*, **efeitos de vidro (Glassmorphism)**, responsividade completa para **dispositivos móveis (iOS/Android PWA), Tablets e Notebooks**, e **sincronização nativa de eventos** com **Microsoft Teams, Google Calendar, Outlook e Apple Calendar (.ics)**.

---

## 📑 Roadmap de Implementação Concluído

| Fase | Objetivo | Resultado |
| :--- | :--- | :--- |
| **Fase 1** | **Arquitetura & Limpeza** | Remoção do módulo de filmes e foco 100% em produtividade pessoal e profissional. |
| **Fase 2** | **Design System Midnight Flow** | Paleta premium (#0F0F17, #7C6FF7, #4ECDC4), glassmorphism, micro-interações e font-feature cv02. |
| **Fase 3** | **Dashboard Profissional** | Hero interativo, contadores estatísticos animados, próximas reuniões externas e tooltips explicativos. |
| **Fase 4** | **Tarefas Avançadas** | Gestão por prioridade, categorias, gestos touch (swipe to delete) e filtro por dias da semana. |
| **Fase 5** | **Calendário & Planner Semanal** | Grade interativa de Segunda a Domingo com suporte a reagendamento Drag & Drop. |
| **Fase 6** | **Sincronização Externa** | Deep links para Google/Outlook/Teams, download de `.ics` universal e Web Share API. |
| **Fase 7** | **PWA & Responsividade Mobile** | Manifest PWA, suporte a safe-area iOS, bottom tab bar nativa e Service Worker cache-first. |
| **Fase 8** | **Polimento & Documentação** | Documentação completa de repositório e otimização de performance no navegador. |

---

## ⭐ Recursos Principais

### 1. ℹ️ Tooltips & Explicação Interativa das Seções
Passando o mouse ou tocando nas seções e componentes, balões informativos elegantes (`data-tooltip`) explicam em tempo real para que serve cada recurso e qual sua função técnica na aplicação.

### 2. 📅 Planner Semanal por Dias da Semana
Organização dedicada para **Segunda, Terça, Quarta, Quinta, Sexta, Sábado e Domingo**, permitindo mover tarefas facilmente via **Drag & Drop** no desktop ou toque no mobile.

### 3. 🏷️ Categorias & Indicadores de Prioridade
Classificação por áreas (**Trabalho, Faculdade, Pessoal, Reuniões, Estudos**) com barras de progresso visual em tempo real e níveis de prioridade com códigos de cor vibrantes.

### 4. 🔔 Automação & Sincronização Externa (Item 6)
- **Google Calendar**: Criação instantânea de eventos pré-preenchidos.
- **Microsoft Teams & Outlook**: Deep links diretos de agendamento de reuniões.
- **Apple iCal / Calendários do Sistema**: Download de arquivo `.ics` para sincronização nativa em dispositivos iOS, macOS e Android.
- **Web Notification API**: Alerta de vencimento próximo direto no sistema operacional.

### 5. 📱 PWA & Navegação Nativa Touch
- **Modo Standalone**: Pode ser adicionado à tela inicial no Android e iPhone.
- **Bottom Navigation Bar**: Barra de abas inferior (`.mobile-tabs`) para navegação facilitada com uma mão.
- **Swipe to Delete**: Deslizar o card da tarefa para a esquerda aciona a animação de exclusão.

---

## 🏛️ Arquitetura de Código & Padrões ES Modules

```
Lista-de-tarefas-com-categorias/
├── index.html                           # Palco SPA único (#navbar, #app, .mobile-tabs)
├── manifest.json                        # Configuração PWA (display standalone, ícones, cores)
├── service-worker.js                    # Service Worker com estratégia Cache-First
├── sync.js                              # Automações de exportação (Google, Outlook, Teams, ICS)
├── notificacoes.js                      # Web Notification API e agendamento de alertas
├── README.md                            # Documentação técnica do projeto
└── src/
    ├── css/
    │   ├── microframework.css           # Variáveis Midnight Flow, Glassmorphism e Tooltips
    │   ├── dashboard.css                # Estilos do Hero e estatísticas
    │   ├── tarefas.css                  # Cards de tarefas, pílulas e checkbox customizado
    │   ├── categorias.css               # Grids de progresso por categoria
    │   ├── calendario.css               # Estilos da grade semanal e Drag & Drop
    │   ├── navbar.css / navbar-mobile.css # Estilos de navegabilidade desktop e mobile
    │   └── responsive.css               # Regras de breakpoints (320px a 1280px+)
    └── js/
        ├── main.js                      # Ponto de entrada: dispara navbar e roteador
        ├── rotas.js                     # Tabela de rotas Hash Client-Side
        ├── tarefasStorage.js            # Serviços de persistência LocalStorage
        └── components/
            ├── navbar/
            │   └── navbar.js            # Montador dinâmico do menu desktop e mobile tabs
            └── paginas/
                ├── dashboard.js         # Componente do painel principal
                ├── tarefas.js           # Gerenciador de tarefas por dia e prioridade
                ├── categorias.js        # Progresso por categoria
                ├── calendario.js        # Grade interativa por dia da semana
                └── configuracoes.js     # Painel de sincronização e notificações
```

---

## 💻 Como Executar

Por utilizar **ES Modules** (`type="module"`), o projeto deve ser executado através de um servidor web local.

### Opção 1 — VS Code Live Server (Recomendado)
Clique com o botão direito sobre `index.html` → **Open with Live Server**.

### Opção 2 — Via Terminal (Node.js ou Python)
```bash
# Com Node.js
npx serve .

# Ou com Python
python -m http.server 8000
```
Em seguida, acesse `http://localhost:8000` no navegador.

---

## 🏆 Conclusão

O **TaskFlow** entrega uma solução completa de produtividade que transcende um projeto de sala de aula, apresentando uma **Single Page Application** modular, robusta, altamente performática e pronta para exibição em portfólios profissionais.
