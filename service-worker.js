const CACHE = "taskflow-v2";

const ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./src/css/microframework.css",
    "./src/css/dashboard.css",
    "./src/css/tarefas.css",
    "./src/css/responsive.css",
    "./src/css/navbar.css",
    "./src/css/navbar-mobile.css",
    "./src/css/categorias.css",
    "./src/css/calendario.css",
    "./src/js/main.js",
    "./src/img/icons/icon-192.png",
    "./src/img/icons/icon-512.png"
];

self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE).then(async cache => {
            // Tenta adicionar cada recurso individualmente para evitar travamento em caso de 404 pontual
            await Promise.allSettled(
                ASSETS.map(url => cache.add(url).catch(err => console.warn(`Aviso SW: Falha ao cachear ${url}`, err)))
            );
        })
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
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then(networkResponse => {
                // Atualiza o cache dinamicamente para requisições GET bem-sucedidas
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE).then(cache => cache.put(event.request, responseToCache));
                }
                return networkResponse;
            }).catch(() => {
                // Fallback offline se a rede falhar
                return caches.match("./index.html");
            });
        })
    );
});