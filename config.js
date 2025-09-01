// Configuración automática de rutas según el entorno
(function() {
  'use strict';
  
  // Detectar entorno
  const isLocalDevelopment = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' || 
                            window.location.hostname === '';
  
  // Configurar rutas base
  window.APP_CONFIG = {
    BASE_PATH: isLocalDevelopment ? '' : '/asistencias',
    IS_LOCAL: isLocalDevelopment,
    WEBHOOK_URL: "https://n8n.ludwringliccien.dev/webhook/asistencias"
  };
  
  // Actualizar rutas de PWA dinámicamente
  function updatePWARoutes() {
    const basePath = window.APP_CONFIG.BASE_PATH;
    
    // Actualizar manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.href = basePath + '/manifest.json';
    }
    
    // Actualizar iconos
    const iconLinks = document.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"]');
    iconLinks.forEach(link => {
      if (link.href.includes('icons/')) {
        link.href = basePath + '/' + link.href.split('/').slice(-2).join('/');
      }
    });
  }
  
  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updatePWARoutes);
  } else {
    updatePWARoutes();
  }
})();
