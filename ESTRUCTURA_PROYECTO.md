# 📁 ESTRUCTURA DEL PROYECTO VELVET CLUB

## Organización General

```
estudio/
├── backend/                    # Servidor Express
│   ├── src/
│   │   └── server.js          # Servidor principal (puerto 3000)
│   ├── package.json           # Dependencias backend
│   └── README.md
│
└── frontend/                   # Aplicación web
    ├── index.html             # Página principal (galería de perfiles)
    ├── profile.html           # Página de detalle individual
    │
    ├── css/                   # Estilos (6 archivos modularizados)
    │   ├── base.css           # Variables, reset, estilos base
    │   ├── layout.css         # Header, hero, animaciones del hero
    │   ├── components.css     # Filtros, tarjetas, grid
    │   ├── animations.css     # Keyframes para flips y caídas
    │   ├── footer.css         # Pie de página
    │   └── responsive.css     # Media queries (CARGAR AL ÚLTIMO)
    │
    └── js/                    # Scripts JavaScript (módulos ES6)
        ├── app.js             # Punto de entrada principal
        ├── api.js             # Capa de datos (mock)
        ├── cards.js           # Creación y renderizado de tarjetas
        ├── filters.js         # Sistema de filtrado
        ├── animations.js      # Efectos visuales decorativos
        └── profile.js         # Página de detalle
```

---

## 🎨 ESTRUCTURA CSS

### **base.css** - Fundación
- Variables globales (colores, temas)
- Reset CSS
- Tipografía base
- **DEBE CARGAR PRIMERO**

### **layout.css** - Estructura Visual
- Header y navegación
- Hero section con efectos
- Animaciones del título (sparkle, shine, starFlash, clubShine)
- **CARGAR SEGUNDO**

### **components.css** - Componentes
- Sección de perfiles y grid
- Panel de filtros (siempre visible en flujo)
- Opciones de filtro y checkboxes
- Tarjetas de perfil (3D flip)
- **CARGAR TERCERO**

### **animations.css** - Keyframes
- Animaciones de flip de tarjetas (multiToBack, multiToFront)
- Animación de caída (fallDown)
- **CARGAR CUARTO**

### **footer.css** - Pie de Página
- Estilos del footer
- Enlaces y navegación del footer
- **CARGAR QUINTO**

### **responsive.css** - Responsive Design
- Media queries: 1100px, 900px, 700px, 600px
- **CARGAR ÚLTIMO (sobrescribe estilos)**

---

## ⚙️ ESTRUCTURA JAVASCRIPT

### **app.js** - Orquestación
```javascript
responsabilidades:
- Cargar perfiles desde API
- Inicializar filtros
- Generar animaciones decorativas (falling cards)
```

### **api.js** - Acceso a Datos
```javascript
getProfiles()
  → Retorna array de 15 perfiles (mock)
  
fetchProfilesFromServer()
  → Consume endpoint /api/profiles del backend
```

### **cards.js** - Tarjetas
```javascript
createCard(profile)
  → Crea estructura HTML de tarjeta (frente/reverso)
  → Agrega evento click para animación flip

renderProfiles(profiles, gridElement)
  → Limpia grid anterior
  → Crea until 15 tarjetas
```

### **filters.js** - Sistema de Filtrado
```javascript
initFilters(profiles, gridElement)
  → Conecta UI con sistema de filtrado
  → Event listeners para cambios

applyFilters(gridElement)
  → Lee valores de checkboxes y slider
  → Filtra array de perfiles
  → Renderiza tarjetas coincidentes

Funciones de matching:
- matchBreast(profile, value)    → Filtra por senos
- matchButt(profile, value)      → Filtra por cola
- matchPreference(profile, value) → Filtra por preferencias
```

### **animations.js** - Efectos Decorativos
```javascript
spawnFallingCard(container, profile)
  → Crea elemento que cae desde arriba
  → Propiedades aleatorias: posición, duración, rotación, escala
  → Auto-limpieza: se remueve después de caer
```

### **profile.js** - Página de Detalle
```javascript
init()
  1. Lee ID de query string (?id=...)
  2. Obtiene perfiles
  3. Encuentra perfil coincidente
  4. Renderiza galería y detalle

getIdFromQuery()
  → Extrae parámetro ID de URL

renderProfile(profile)
  → Muestra fotos, nombre, edad, descripción
```

---

## 🔄 FLUJO DE DATOS

```
app.js (init)
   ↓
   →→ getProfiles() [api.js]
   ↓
   →→ initFilters() [filters.js]
   │  ↓
   │  →→ renderProfiles() [cards.js]
   │  ↑
   │  (listener: cambio en filtros)
   │  →→ applyFilters()
   │  →→ renderProfiles()
   │
   →→ setInterval: spawnFallingCard() [animations.js]
```

---

## 🎯 RESPONSABILIDADES POR MÓDULO

| Módulo | Responsabilidad |
|--------|----------------|
| **app.js** | Orquestación principal |
| **api.js** | Obtener datos de perfiles |
| **cards.js** | Crear e interactuar con tarjetas |
| **filters.js** | Lógica de filtrado |
| **animations.js** | Efectos visuales decorativos |
| **profile.js** | Mostrar detalle de perfil |

---

## 📊 ESTRUCTURA DE DATOS (Perfil)

```javascript
{
  id: number,                    // Identificador único
  alias: string,                 // Nombre/apodo
  age: number,                   // Edad
  city: string,                  // Ciudad
  tags: string[],                // Categorías (VIP, Premium, etc)
  photos: string[],              // URLs de imágenes
  description: string            // Descripción completa
}
```

---

## 🚀 CÓMO EJECUTAR

### Terminal 1: Iniciar Backend
```bash
cd backend
npm install
npm start
```
→ Servidor corre en http://localhost:3000

### Terminal 2: Acceder Frontend
```
Navega a http://localhost:3000 en tu navegador
```

---

## ✨ COMENTARIOS EN CÓDIGO

Cada archivo contiene:

1. **Encabezado de módulo** (líneas 1-25)
   - Descripción general
   - Responsabilidades
   - Características

2. **Encabezados de secciones** (=== SECCIÓN ===)
   - Agrupa código relacionado

3. **Comentarios de funciones**
   - @param = parámetros
   - @returns = valor retornado
   - Descripción breve de qué hace

4. **Comentarios inline**
   - Explicación de lógica compleja
   - Notas sobre decisiones de diseño

---

## 🎨 PALETA DE COLORES

```css
--bg: #3b0505;          /* Fondo principal (rojo oscuro) */
--bg-deep: #220202;     /* Fondo profundo (casi negro) */
--red: #c31a1a;         /* Rojo principal */
--muted: #bdb3b3;       /* Gris neutro */
--card-bg: rgba(255,255,255,0.04);  /* Fondo tarjeta semi-transparente */
```

---

## 📱 BREAKPOINTS RESPONSIVE

- **1100px** → Grid de 2 columnas (tablets)
- **900px** → Ajustes en filtros
- **700px** → Grid de 1 columna (móviles)
- **600px** → Tamaños reducidos (pantallas pequeñas)

---

## ✅ CHECKLIST DE CALIDAD

- [x] CSS modularizado y bien comentado
- [x] JavaScript con comentarios JSDoc
- [x] Responsabilidades separadas por módulo
- [x] Sin código duplicado
- [x] Responsive design funcional
- [x] Accesibilidad básica (tabindex, aria-hidden)
- [x] Manejo de errores en funciones async
- [x] Auto-limpieza de elementos dinámicos

---

## 🔗 PUNTOS DE INTEGRACIÓN FUTURA

1. **Cambiar a datos reales**: Reemplaza `getProfiles()` con `fetchProfilesFromServer()` en app.js
2. **Agregar más opciones de filtro**: Modifica HTML y funciones matchXXX() en filters.js
3. **Agregar más perfiles**: Expande array en api.js o backend
4. **Personalizar estilos**: Edita variables en base.css

---

**Última actualización**: Feb 28, 2026
**Versión del proyecto**: 0.1.0
