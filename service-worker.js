const CACHE = "fluxo-v1";

const ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",

    "./src/css/microframework.css",
    "./src/css/sidebar.css",
    "./src/css/dashboard.css",
    "./src/css/tarefas.css",
    "./src/css/navbar.css",
    "./src/css/categorias.css",
    "./src/css/modal.css",
    "./src/css/login.css",
    "./src/css/perfil.css",
    "./src/css/responsive.css",
    "./src/css/calendario.css",
    "./src/css/navbar-mobile.css",
    "./src/css/premium.css",
    "./src/css/chatbot.css",

    "./src/js/main.js",
    "./src/js/rotas.js",
    "./src/js/components/rotas/rotas.js",
    "./src/js/components/navbar/navbar.js",
    "./src/js/components/modal/modalTarefa.js",
    "./src/js/components/chatbot/chatbotWidget.js",
    "./src/js/components/services/chatbotService.js",
    "./src/js/components/services/storageStrategy.js",
    "./src/js/components/services/tarefasStorage.js",
    "./src/js/components/services/authStorage.js",
    "./src/js/components/paginas/inicio.js",
    "./src/js/components/paginas/dashboard.js",
    "./src/js/components/paginas/tarefas.js",
    "./src/js/components/paginas/categorias.js",
    "./src/js/components/paginas/calendario.js",
    "./src/js/components/paginas/planejamento.js",
    "./src/js/components/paginas/estatisticas.js",
    "./src/js/components/paginas/notas.js",
    "./src/js/components/paginas/sobre.js",
    "./src/js/components/paginas/login.js",
    "./src/js/components/paginas/perfil.js",
    "./src/js/components/paginas/relatorios.js",

    "./notificacoes.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request)
                .then(response => {
                    if (!response || response.status !== 200 || response.type !== "basic") {
                        return response;
                    }
                    const cloned = response.clone();
                    caches.open(CACHE).then(cache => cache.put(event.request, cloned));
                    return response;
                })
                .catch(() => caches.match("./index.html"));
        })
    );
});