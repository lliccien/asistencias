const CACHE_NAME = 'asistencia-v1.0.0';
const STATIC_CACHE = 'asistencia-static-v1.0.0';
const DYNAMIC_CACHE = 'asistencia-dynamic-v1.0.0';

// Archivos a cachear inmediatamente
const STATIC_FILES = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './styles.css',
  './app.js',
  './config.js',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Función para cachear archivos estáticos
async function cacheStaticFiles() {
  const cache = await caches.open(STATIC_CACHE);
  await cache.addAll(STATIC_FILES);
  console.log('Archivos estáticos cacheados');
}

// Función para cachear respuesta dinámica
async function cacheDynamicResponse(request, response) {
  const cache = await caches.open(DYNAMIC_CACHE);
  await cache.put(request, response.clone());
}

// Función para obtener respuesta del cache
async function getCachedResponse(request) {
  const staticCache = await caches.open(STATIC_CACHE);
  const dynamicCache = await caches.open(DYNAMIC_CACHE);
  
  // Buscar en cache dinámico primero
  let response = await dynamicCache.match(request);
  if (response) return response;
  
  // Buscar en cache estático
  response = await staticCache.match(request);
  if (response) return response;
  
  return null;
}

// Función para limpiar caches antiguos
async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  const cachesToDelete = cacheNames.filter(name => 
    name !== STATIC_CACHE && name !== DYNAMIC_CACHE
  );
  
  await Promise.all(
    cachesToDelete.map(name => caches.delete(name))
  );
  console.log('Caches antiguos eliminados');
}

// Evento: Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando...');
  event.waitUntil(
    cacheStaticFiles().then(() => {
      console.log('Service Worker instalado');
      return self.skipWaiting();
    })
  );
});

// Evento: Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activando...');
  event.waitUntil(
    cleanOldCaches().then(() => {
      console.log('Service Worker activado');
      return self.clients.claim();
    })
  );
});

// Evento: Interceptar peticiones
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar peticiones HTTP/HTTPS
  if (request.method !== 'GET' && request.method !== 'POST') {
    return;
  }
  
  // Estrategia para archivos estáticos: Cache First
  if (STATIC_FILES.includes(url.pathname) || url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
    return;
  }
  
  // Estrategia para webhook: Network First con fallback
  if (url.hostname === 'n8n.ludwringliccien.dev') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Solo cachear respuestas exitosas
          if (response.ok) {
            cacheDynamicResponse(request, response);
          }
          return response;
        })
        .catch(async () => {
          // Fallback: intentar obtener del cache
          const cachedResponse = await getCachedResponse(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Si no hay cache, devolver respuesta offline
          return new Response(
            JSON.stringify({ 
              error: 'Sin conexión',
              message: 'Los datos se guardarán localmente y se enviarán cuando haya conexión'
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }
  
  // Estrategia por defecto: Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          cacheDynamicResponse(request, response);
        }
        return response;
      })
              .catch(async () => {
          const cachedResponse = await getCachedResponse(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Si no hay cache y es una petición de página, mostrar offline.html
          if (request.headers.get('accept')?.includes('text/html')) {
            const offlineResponse = await caches.match('./offline.html');
            if (offlineResponse) {
              return offlineResponse;
            }
          }
          
          return new Response('Sin conexión', { status: 503 });
        })
  );
});

// Evento: Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Sincronización en segundo plano iniciada');
    event.waitUntil(syncPendingData());
  }
});

// Función para sincronizar datos pendientes
async function syncPendingData() {
  try {
    const pendingData = await getPendingData();
    if (pendingData.length > 0) {
      console.log(`Sincronizando ${pendingData.length} registros pendientes`);
      
      for (const data of pendingData) {
        try {
          const response = await fetch('https://n8n.ludwringliccien.dev/webhook/asistencias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (response.ok) {
            await removePendingData(data.id);
            console.log(`Registro ${data.id} sincronizado exitosamente`);
          }
        } catch (error) {
          console.error(`Error sincronizando registro ${data.id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error en sincronización:', error);
  }
}

// Funciones auxiliares para manejar datos pendientes
async function getPendingData() {
  // Implementar con IndexedDB o localStorage
  return [];
}

async function removePendingData(id) {
  // Implementar con IndexedDB o localStorage
}

// Evento: Mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

