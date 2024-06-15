var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/Diagram.js',
  '/js/diagramList.js',
  '/js/diagramOptionsSelector.js',
  '/js/DiagramSelector.js',
  '/js/helper.js',
  '/js/logicDiagramEditor.js',
  '/js/logicDiagramList.js',
  '/js/MusicDefinitions.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});