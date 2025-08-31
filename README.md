# Sistema de Asistencia - Formulario Web

Un formulario web simple y elegante para registrar entradas y salidas de personal, diseñado con enfoque mobile-first y una interfaz moderna.

## 🚀 Características

- **Diseño Responsivo**: Optimizado para dispositivos móviles con diseño mobile-first
- **Interfaz Moderna**: Tema oscuro con gradientes y efectos visuales atractivos
- **Validación en Tiempo Real**: Validación de formularios con feedback visual
- **Integración con n8n**: Envío automático de datos a webhook de n8n
- **Accesibilidad**: Incluye atributos ARIA y navegación por teclado
- **Feedback Visual**: Notificaciones tipo snackbar para confirmaciones y errores

## 📋 Funcionalidades

### Campos del Formulario
- **Tipo de Movimiento**: Selección entre ENTRADA o SALIDA
- **Fecha**: Selector de calendario nativo (formato ISO: yyyy-mm-dd)
- **Hora**: Selector de hora en formato 24h (HH:MM)

### Procesamiento de Datos
- Conversión automática de fecha ISO a formato dd/mm/aaaa
- Validación de formato de hora HH:MM
- Envío de payload JSON al webhook configurado

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y formularios nativos
- **CSS3**: 
  - Variables CSS personalizadas
  - Flexbox y Grid para layout
  - Gradientes y efectos visuales
  - Diseño responsive
- **JavaScript Vanilla**: 
  - Validación de formularios
  - Fetch API para envío de datos
  - Manipulación del DOM
  - Manejo de errores

## 📦 Estructura del Proyecto

```
asistencia/
├── index.html          # Formulario principal
└── README.md          # Documentación del proyecto
```

## 🔧 Configuración

### Webhook URL
El formulario está configurado para enviar datos al siguiente webhook:
```javascript
const WEBHOOK_URL = "https://n8n.ludwringliccien.dev/webhook/asistencias";
```

### Payload JSON
Los datos se envían en el siguiente formato:
```json
{
  "tipo": "ENTRADA|SALIDA",
  "fecha": "dd/mm/aaaa",
  "fecha_iso": "yyyy-mm-dd",
  "hora": "HH:MM"
}
```

## 🎨 Diseño

### Paleta de Colores
- **Fondo**: Slate-900 (#0f172a)
- **Tarjeta**: Gray-900 (#111827)
- **Texto**: Gray-200 (#e5e7eb)
- **Texto Muted**: Gray-400 (#9ca3af)
- **Acento**: Blue-500 (#3b82f6)
- **Error**: Red-500 (#ef4444)
- **Éxito**: Emerald-500 (#10b981)

### Características de UX
- Centrado vertical y horizontal en pantalla
- Bordes redondeados y sombras suaves
- Estados de hover y focus
- Indicadores de carga durante el envío
- Notificaciones no intrusivas

## 📱 Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móviles (iOS Safari, Chrome Mobile)
- ✅ Tablets y pantallas táctiles
- ✅ Navegación por teclado

## 🚀 Uso

1. Abre `index.html` en tu navegador web
2. Selecciona el tipo de movimiento (ENTRADA o SALIDA)
3. Elige la fecha usando el selector de calendario
4. Selecciona la hora en formato 24h
5. Haz clic en "Enviar"
6. Recibe confirmación visual del envío exitoso

## 🔍 Validaciones

### Tipo de Movimiento
- Debe ser "ENTRADA" o "SALIDA"
- Campo obligatorio

### Fecha
- Formato ISO: yyyy-mm-dd
- Campo obligatorio
- Conversión automática a dd/mm/aaaa para el backend

### Hora
- Formato 24h: HH:MM
- Campo obligatorio
- Validación de formato con regex

## 🐛 Manejo de Errores

- **Errores de Validación**: Feedback visual en campos inválidos
- **Errores de Red**: Mensaje genérico "ERROR INTENTELO DE NUEVO"
- **Errores de CORS**: Capturados y mostrados al usuario
- **Respuestas del Servidor**: Manejo de diferentes tipos de contenido

## 📊 Pruebas

El código incluye pruebas unitarias básicas en consola para:
- Conversión de fechas ISO a dd/mm/aaaa
- Validación de formato de hora HH:MM

## 🔒 Seguridad

- Validación del lado del cliente
- Sanitización de datos antes del envío
- Headers de seguridad en las peticiones HTTP
- Manejo seguro de errores sin exponer información sensible

## 📈 Mejoras Futuras

- [ ] Persistencia local con localStorage
- [ ] Modo offline con Service Workers
- [ ] Autocompletado de fecha/hora actual
- [ ] Exportación de datos a CSV
- [ ] Dashboard de estadísticas
- [ ] Autenticación de usuarios
- [ ] Múltiples ubicaciones/sedes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Ludwring Liccien**
- Webhook: https://n8n.ludwringliccien.dev/webhook/asistencias

---

⭐ Si este proyecto te ha sido útil, ¡dale una estrella!
