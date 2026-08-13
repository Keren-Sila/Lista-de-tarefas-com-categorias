const CACHE = "taskflow-v6";

const ASSETS = [
    "/",
    "/index.html",
    "/manifest.json",

    "/src/css/microframework.css",
    "/src/css/dashboard.css",
    "/src/css/tarefas.css",
    "/src/css/navbar.css",
    "/src/css/categorias.css",
    "/src/css/modal.css",
    "/src/css/login.css",
    "/src/css/perfil.css",
    "/src/css/responsive.css",
    "/src/css/calendario.css",
    "/src/css/navbar-mobile.css",
    "/src/css/premium.css",

    "/src/js/main.js",
    "/src/js/rotas.js",
    "/src/js/tarefasStorage.js",
    "/src/js/authStorage.js",
    "/src/js/components/rotas/rotas.js",
    "/src/js/components/navbar/navbar.js",
    "/src/js/components/modal/modalTarefa.js",
    "/src/js/components/services/api.js",
    "/src/js/components/services/apiCache.js",
    "/src/js/components/services/storageStrategy.js",
    "/src/js/components/services/tarefasStorage.js",
    "/src/js/components/services/authStorage.js",
    "/src/js/components/paginas/inicio.js",
    "/src/js/components/paginas/dashboard.js",
    "/src/js/components/paginas/tarefas.js",
    "/src/js/components/paginas/categorias.js",
    "/src/js/components/paginas/calendario.js",
    "/src/js/components/paginas/login.js",
    "/src/js/components/paginas/perfil.js",
    "/src/js/components/paginas/relatorios.js",

    "/sync.js",
    "/notificacoes.js"
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
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    fetch(event.request).then(networkResponse => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE).then(cache => cache.put(event.request, networkResponse));
                        }
                    }).catch(() => {});
                    return cachedResponse;
                }
                return fetch(event.request);
            })
    );
});