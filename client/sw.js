const cacheName = 'static_v1'
const appShell = [
    '/',
    '/index.html',
    '/sw.js',
    '/manifest.json',
    // Ajoutez ici tous les fichiers du dossier 'dist' que vous voulez mettre en cache
]

self.addEventListener('install', function(event) {
    console.log('Installing...');
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => cache.addAll(appShell))
        .then(console.log("adding new cache"))
        .then(() => self.skipWaiting())
        .catch(err => console.log("erreur on adding cache : ", err))
    );
});

self.addEventListener('activate', function(event) {
    console.log('Activated');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }else{
                return fetch(event.request);
            }
        })
    )
});

