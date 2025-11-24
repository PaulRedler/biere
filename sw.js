const ressourcesToCache = [ 
    '/',
    '/index.html',
    '/styles.css',
    'images/logo.png',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('biere-cache-v1')
            .then(cache => {    
                return cache.addAll(ressourcesToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Ressource trouvée dans le cache
                }
                return fetch(event.request) // Ressource non trouvée, on la récupère sur le réseau
                .then(response => {
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }   
                    const responseToCache = response.clone();
                    caches.open('biere-cache-v1')
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
            })
    );
});

