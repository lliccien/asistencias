// ===== CONFIGURACIÓN GLOBAL =====
const WEBHOOK_URL = window.APP_CONFIG ? window.APP_CONFIG.WEBHOOK_URL : "https://n8n.ludwringliccien.dev/webhook/asistencias";
const BASE_PATH = window.APP_CONFIG ? window.APP_CONFIG.BASE_PATH : '';

// ===== ELEMENTOS DEL DOM =====
const form = document.getElementById('movForm');
const btn = document.getElementById('btnSubmit');
const snackbar = document.getElementById('snackbar');
const fieldWrap = (id) => document.getElementById(id);

// ===== HELPERS UI Y VALIDACIÓN =====
function setValidity(fieldId, valid) {
  const wrap = fieldWrap(fieldId);
  if (!wrap) return;
  wrap.classList.toggle('invalid', !valid);
}

function showSnack(type, msg, ms = 3500) {
  snackbar.textContent = msg;
  snackbar.className = `snackbar ${type}`;
  requestAnimationFrame(() => snackbar.classList.add('show'));
  clearTimeout(showSnack._t);
  showSnack._t = setTimeout(() => snackbar.classList.remove('show'), ms);
}

// Conversión: de ISO (yyyy-mm-dd) a dd/mm/aaaa
function isoToDDMMYYYY(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// Validación básica de hora HH:MM
function isValidHHMM(hhmm) {
  return /^\d{2}:\d{2}$/.test(hhmm);
}

// ===== FUNCIONES DE AUTOCOMPLETADO =====

// Obtener fecha actual en formato ISO (yyyy-mm-dd)
function getFechaActual() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Obtener hora actual en formato HH:MM
function getHoraActual() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Autocompletar fecha actual
function autocompletarFecha() {
  const fechaInput = document.getElementById('fecha');
  const fechaActual = getFechaActual();
  fechaInput.value = fechaActual;
  
  // Limpiar validación
  setValidity('f-fecha', true);
  
  // Mostrar feedback
  showSnack('ok', `Fecha actual: ${isoToDDMMYYYY(fechaActual)}`);
}

// Autocompletar hora actual
function autocompletarHora() {
  const horaInput = document.getElementById('hora');
  const horaActual = getHoraActual();
  horaInput.value = horaActual;
  
  // Limpiar validación
  setValidity('f-hora', true);
  
  // Mostrar feedback
  showSnack('ok', `Hora actual: ${horaActual}`);
}

// Autocompletar fecha y hora actual
function autocompletarTodo() {
  const btnAutocompletar = document.getElementById('btnAutocompletar');
  
  // Estado de carga
  btnAutocompletar.classList.add('loading');
  btnAutocompletar.innerHTML = '<span>⏳</span> Autocompletando...';
  
  // Simular pequeña pausa para feedback visual
  setTimeout(() => {
    autocompletarFecha();
    autocompletarHora();
    
    // Restaurar botón
    btnAutocompletar.classList.remove('loading');
    btnAutocompletar.innerHTML = '<span>⚡</span> Autocompletar fecha y hora actual';
    
    // Mostrar mensaje final
    showSnack('ok', 'Fecha y hora actuales autocompletadas');
  }, 300);
}

// ===== MANEJO DEL FORMULARIO =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const tipoOk = form.tipo.value === 'ENTRADA' || form.tipo.value === 'SALIDA';
  setValidity('f-tipo', tipoOk);

  const fechaISO = form.fecha.value; // yyyy-mm-dd
  const fechaOk = /^\d{4}-\d{2}-\d{2}$/.test(fechaISO);
  setValidity('f-fecha', fechaOk);

  const horaVal = form.hora.value; // HH:MM
  const horaOk = isValidHHMM(horaVal);
  setValidity('f-hora', horaOk);

  if (!tipoOk || !fechaOk || !horaOk) {
    // Validación local: no llamar al webhook
    return;
  }

  // Payload JSON: envía la fecha en dd/mm/aaaa + ISO opcional
  const payload = {
    tipo: form.tipo.value,
    fecha: isoToDDMMYYYY(fechaISO), // requerido en dd/mm/aaaa
    fecha_iso: fechaISO,             // opcional para tu backend
    hora: horaVal                    // HH:MM (24h)
  };

  // UI: loading
  form.classList.add('loading');
  btn.disabled = true;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      },
      body: JSON.stringify(payload)
    });

    let responseText = '';
    const contentType = res.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        const data = await res.json();
        responseText = JSON.stringify(data);
      } else {
        responseText = await res.text();
      }
    } catch (parseError) {
      // Si falla el parsing JSON, intentar como texto
      console.warn('Error parsing response as JSON, trying as text:', parseError);
      try {
        responseText = await res.text();
      } catch (textError) {
        console.warn('Error reading response as text:', textError);
        responseText = '';
      }
    }

    if (!res.ok) {
      showSnack('err', 'ERROR INTENTELO DE NUEVO');
    } else {
      showSnack('ok', `${form.tipo.value} guardada`);
      form.reset();
    }
  } catch (err) {
    console.error('Error de red o CORS:', err);
    showSnack('err', 'ERROR INTENTELO DE NUEVO');
  } finally {
    form.classList.remove('loading');
    btn.disabled = false;
  }
});

// ===== EVENT LISTENERS PARA AUTOCOMPLETADO =====

// Botón de fecha actual
document.getElementById('btnFechaActual').addEventListener('click', autocompletarFecha);

// Botón de hora actual
document.getElementById('btnHoraActual').addEventListener('click', autocompletarHora);

// Botón de autocompletar todo
document.getElementById('btnAutocompletar').addEventListener('click', autocompletarTodo);

// ===== AUTOCOMPLETADO AUTOMÁTICO AL CARGAR =====

// Autocompletar automáticamente al cargar la página
window.addEventListener('load', () => {
  setTimeout(autocompletarTodo, 500);
});

// ===== PWA FUNCTIONALITY =====

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const swPath = BASE_PATH + '/sw.js';
      const registration = await navigator.serviceWorker.register(swPath);
      console.log('Service Worker registrado:', registration);
      
      // Manejar actualizaciones del Service Worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showSnack('ok', 'Nueva versión disponible. Recarga para actualizar.');
          }
        });
      });
    } catch (error) {
      console.error('Error registrando Service Worker:', error);
    }
  });
}

// Detectar estado de conexión
function updateOnlineStatus() {
  if (navigator.onLine) {
    document.body.classList.remove('offline');
    showSnack('ok', 'Conexión restaurada');
  } else {
    document.body.classList.add('offline');
    showSnack('err', 'Sin conexión - Modo offline activado');
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Verificar estado inicial
updateOnlineStatus();

// Background Sync (si está disponible)
if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
  navigator.serviceWorker.ready.then(registration => {
    // Registrar para sincronización en segundo plano
    registration.sync.register('background-sync');
  });
}

// ===== FUNCIONALIDAD DE DESCARGA =====

const downloadBtn = document.getElementById('downloadBtn');
const GOOGLE_SHEETS_URL = "https://docs.google.com/spreadsheets/d/1ZI_abWmCGMjLH3G_PSE-AvKl98eQcr1Q-DqvCKV1Ff0/export?format=xlsx";

downloadBtn.addEventListener('click', async () => {
  // Estado de carga
  downloadBtn.classList.add('loading');
  downloadBtn.innerHTML = '<span class="download-icon">⏳</span>Descargando...';
  
  try {
    // Crear un enlace temporal para la descarga
    const link = document.createElement('a');
    link.href = GOOGLE_SHEETS_URL;
    link.download = `asistencia_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.target = '_blank';
    
    // Agregar el enlace al DOM temporalmente
    document.body.appendChild(link);
    
    // Simular clic para iniciar la descarga
    link.click();
    
    // Remover el enlace temporal
    document.body.removeChild(link);
    
    // Mostrar mensaje de éxito
    showSnack('ok', 'Descarga iniciada');
    
    // Log para debugging
    console.log('Descarga iniciada:', GOOGLE_SHEETS_URL);
    
  } catch (error) {
    console.error('Error al descargar:', error);
    showSnack('err', 'Error al descargar el archivo');
  } finally {
    // Restaurar estado del botón
    downloadBtn.classList.remove('loading');
    downloadBtn.innerHTML = '<span class="download-icon">📥</span>Descargar Excel';
  }
});

// Función alternativa para descarga directa (si la anterior no funciona)
async function downloadFile() {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'GET',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asistencia_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showSnack('ok', 'Archivo descargado exitosamente');
  } catch (error) {
    console.error('Error en descarga alternativa:', error);
    showSnack('err', 'Error al descargar. Verifica la URL del documento.');
  }
}

// ===== PRUEBAS RÁPIDAS EN CONSOLA =====
try {
  console.assert(isoToDDMMYYYY('2025-08-31') === '31/08/2025', 'isoToDDMMYYYY debe convertir correctamente');
  console.assert(isValidHHMM('09:05') === true, 'isValidHHMM debe aceptar 09:05');
  console.assert(isValidHHMM('23:59') === true, 'isValidHHMM debe aceptar 23:59');
  console.assert(isValidHHMM('9:5') === false, 'isValidHHMM debe rechazar 9:5');
} catch (_) { /* ignorar en producción */ }
