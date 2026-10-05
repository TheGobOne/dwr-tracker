self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
// A fetch handler keeps the app installable on older Chrome versions; requests pass straight through.
self.addEventListener('fetch', () => {})
