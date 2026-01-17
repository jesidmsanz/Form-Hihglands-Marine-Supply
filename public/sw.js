// Service Worker placeholder
// Este archivo evita el error 404 cuando el navegador busca un service worker
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  return self.clients.claim();
});

