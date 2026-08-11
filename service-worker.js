const CACHE = "taskflow-v2";

const ASSETS = [

    "/",
    "/index.html",
    "/manifest.json",

    "/src/css/microframework.css",
    "/src/css/dashboard.css",
    "/src/css/tarefas.css",
    "/src/css/responsive.css",

    "/src/js/main.js",

    "/src/img/icons/icon-192.png",
    "/src/img/icons/icon-512.png"

];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE)

            .then(cache => cache.addAll(ASSETS))

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
        )

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

            .then(response => {

                return response || fetch(event.request);

            })

    );

});