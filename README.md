# TaskFlow — SPA de Lista de Tarefas com Categorias (Arquitetura da Apostila)

**TaskFlow** é uma aplicação web **Single Page Application (SPA)** desenvolvida em **JavaScript Puro (Vanilla JS - ES Modules)** seguindo com 100% de fidelidade a arquitetura e os padrões ensinados no curso **Front-End 2 (App Livros)**.

A aplicação foi adaptada para um sistema completo de gestão de tarefas com categorias, prioridades Soft UI, organização por turnos (Manhã / Tarde / Noite) e dias da semana, integrando planner semanal/mensal/diário e suporte a **PWA e Offline-First**.

---

## 1. Arquitetura da Aplicação conforme Apostila (Capítulos 8, 9 e 12)

A estrutura segue rigorosamente os contratos da Apostila do curso:

```text
index.html
  └── main.js
       ├── carrega components/rotas/rotas.js (array roteador de objetos de rota)
       ├── carrega components/navbar/navbar.js (recebe o array roteador e monta o menu)
       ├── monta o mapaDeRotas (objeto de consulta rápida indexado pela URL)
       ├── escuta o evento hashchange
       └── executa rotaAtual.pagina(app) para o elemento <main id="app">
```

### 1.1 Diagrama de Dependências e Módulos (`src/js/`)

```text
c:\Users\keren\OneDrive\Documentos\Lista-de-tarefas-com-categorias\
├── index.html                  # Ponto de montagem #navbar e #app
├── manifest.json                # PWA Manifest
├── service-worker.js           # Cache offline (Network First / Cache First)
├── sync.js                     # Exportador para Google, Outlook e .ics
├── notificacoes.js             # Web Notifications API
├── README.md                   # Documentação técnica
└── src/
    ├── css/
    │   ├── microframework.css  # CSS base e tokens de design
    │   ├── navbar.css          # Estilo da navbar desktop
    │   ├── navbar-mobile.css   # Bottom tabs e FAB mobile
    │   ├── dashboard.css       # Layout 3 colunas e turnos
    │   ├── tarefas.css         # Cards e filtros
    │   ├── categorias.css      # Grid de categorias
    │   ├── calendario.css      # Planner e drag and drop
    │   ├── login.css           # Tela split screen
    │   ├── perfil.css          # Perfil e upload de foto
    │   ├── modal.css           # Modal universal de tarefas
    │   └── responsive.css      # Ajustes mobile e tablet
    └── js/
        ├── main.js             # Ponto de entrada (Capítulo 9 da Apostila)
        ├── rotas.js            # Re-exportador de compatibilidade
        ├── tarefasStorage.js   # Re-exportador de serviços
        ├── authStorage.js      # Re-exportador de autenticação
        └── components/
            ├── rotas/
            │   └── rotas.js    # Array central roteador (Capítulo 9)
            ├── navbar/
            │   └── navbar.js   # Componente de navegação (Capítulo 5 e 8)
            ├── modal/
            │   └── modalTarefa.js # Modal universal de criação/edição
            ├── services/
            │   ├── storageStrategy.js # Padrão Strategy (Capítulo 12)
            │   ├── api.js             # Camada de requisições fetch (Capítulo 11)
            │   ├── apiCache.js        # Decorator de cache (Capítulo 12)
            │   ├── tarefasStorage.js  # Regras de negócio de tarefas
            │   └── authStorage.js     # Regras de negócio de sessão/perfil
            └── paginas/
                ├── dashboard.js  # Página Dashboard
                ├── tarefas.js    # Página de Tarefas
                ├── categorias.js # Página de Categorias
                ├── calendario.js # Página de Calendário
                ├── perfil.js     # Página de Perfil
                └── login.js      # Página de Login/Cadastro
```

---

## 2. Padrões de Código da Apostila Implementados

1. **Contrato do Componente de Página (Capítulo 8 e 9)**:
   Cada página exporta um objeto padrão e sua função recebe a referência do elemento `app`:
   ```js
   async function pagina(app) {
       app.innerHTML = `...`;
       // Registro de listeners após o innerHTML
   }

   export default {
       url: '#dashboard',
       label: 'Dashboard',
       pagina: pagina
   };
   ```

2. **Roteador com `mapaDeRotas` e `hashchange` (Capítulo 9)**:
   O `main.js` transforma o array `roteador` em um objeto indexado pela URL `mapaDeRotas[hash]`, garantindo navegação com tempo constante O(1) e fallback para `rota404`.

3. **Navbar Orientada a Dados (Capítulo 5 e 8)**:
   A função `navbar(roteador)` recebe o array de rotas e utiliza `.map()` para desenhar dinamicamente os links da aplicação sem acoplamento manual.

4. **Padrão Strategy e Decorator para Armazenamento e Cache (Capítulo 12)**:
   - `storageStrategy.js`: define a interface dos armazenamentos (`Memoria` e `LocalStorage`).
   - `apiCache.js`: envolve chamadas HTTP adicionando comportamento de cache com `console.time`.

---

## 3. Funcionalidades do Produto

- **Dashboard 3 Colunas**: Agenda por turnos (**Manhã**, **Tarde**, **Noite**), Reuniões (**Teams**, **Meet**, **Zoom**) com acesso direto e progresso por categoria.
- **Lista de Tarefas Interativa**: Checkbox animado, prioridades Soft UI (**Baixa**, **Média**, **Alta**, **Urgente**), filtros dinâmicos e exportação de calendário (**Google**, **Outlook**, `.ics`).
- **Planner Semanal/Mensal/Diário**: Drag and Drop entre dias da semana para reorganizar prioridades.
- **Categorias Personalizadas**: Suporte a inclusão de novas categorias com cor e emoji.
- **Perfil & Autenticação**: Split-screen de login/cadastro, upload de foto de perfil (base64) e estatísticas.
- **PWA & Offline First**: Service Worker registrado (`taskflow-v4`) e banner de aviso quando offline.

---

## 4. Como Executar

Por utilizar **ES Modules** (`type="module"`), sirva a aplicação via HTTP:

```bash
# Com Python:
python -m http.server 8000
```

Acesse: `http://localhost:8000` ou abra com a extensão **Live Server** no VS Code.
