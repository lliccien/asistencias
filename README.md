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
