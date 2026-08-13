# TaskFlow — SPA de Lista de Tarefas & Produtividade (Padrão de Produto)

**TaskFlow** é uma aplicação web **Single Page Application (SPA)** desenvolvida em **JavaScript Puro (Vanilla JS - ES Modules)** com visual **Dark Glassmorphic** inspirado na estética do portfólio da Keren: paleta em tons profundos (#0B0F19, #1E293B), efeitos de iluminação em roxo/índigo (#7C3AED, #6366F1, #06B6D4), fundo animado com formas flutuantes (`floating-shape`), grid-overlay técnico, badges com status dot pulsante, tooltips elegantes de grafite e 100% de suporte a **PWA e Offline-First**.

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
---

## 5. Fluxos da aplicação

### Autenticação e perfil

O protótipo persiste a sessão e os dados de perfil no `localStorage`. Login e cadastro validam os campos obrigatórios, e a tela de perfil permite atualizar nome, cargo, e-mail e avatar. Por ser uma aplicação somente de frontend, senhas, recuperação de acesso e troca segura de credenciais devem ser conectadas a um provedor de identidade antes de produção; elas não devem ser simuladas como seguras no navegador.

### Tarefas e categorias

As tarefas são criadas e editadas pelo modal universal. Ao salvar, `tarefasStorage.js` calcula automaticamente o dia da semana e o turno a partir de data e horário. A lista oferece busca, filtros por categoria e prioridade, além dos filtros **Hoje** e **Esta Semana**, calculados no fuso local do dispositivo.

Categorias também são persistidas localmente e aceitam nome, cor e ícone. Todo salvamento emite um evento para que as demais telas possam se atualizar sem acoplamento direto.

### Calendário e integrações

O planner mostra visões semanal, diária e mensal. Na semanal, o usuário pode arrastar uma tarefa entre os dias. A exportação abre o fluxo do Google Calendar ou Outlook, ou gera um arquivo `.ics`, compatível com Apple Calendar e outros clientes. Links de Teams, Meet e Zoom são campos da tarefa, e não implicam autenticação com esses provedores.

## 6. Offline e PWA

O `service-worker.js` faz o precache dos arquivos essenciais. Os dados de tarefas, categorias e perfil ficam no `localStorage`, por isso continuam disponíveis offline no mesmo navegador. O banner de conectividade informa quando a aplicação está sem rede. O `manifest.json` fornece os ícones, a cor do tema e atalhos para instalação como PWA.

As notificações dependem da permissão do navegador e funcionam enquanto a página estiver aberta. Notificações confiáveis em segundo plano exigem um backend com push service e service worker configurado para push.

## 7. Plano de evolução para produção

1. Substituir o armazenamento local de autenticação por OAuth/OIDC e uma API com sessão segura.
2. Criar uma API de tarefas e sincronização de conflitos; manter o adaptador `storageStrategy.js` para preservar o contrato atual.
3. Integrar os calendários via OAuth e habilitar importação/atualização bidirecional.
4. Adicionar push notifications e fila de sincronização offline no service worker.
5. Cobrir os serviços e os fluxos críticos com testes unitários e testes end-to-end.

## 8. Build e deploy

O projeto não possui etapa de build: os módulos ES e CSS são servidos diretamente. Para publicar, envie os arquivos estáticos a uma hospedagem HTTPS (GitHub Pages, Netlify, Vercel ou equivalente) e ajuste os caminhos absolutos (`/manifest.json`, `/service-worker.js` e `/src/...`) caso a aplicação seja hospedada em um subdiretório. Teste a instalação e o modo offline na URL final, pois service workers requerem HTTPS - exceto em `localhost`.
