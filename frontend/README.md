# Velvet Club - Frontend

Breve guía para el frontend estático de Velvet Club.

Estructura:
- `index.html` - página principal.
- `css/base.css` - variables y estilos globales (reset, fondo).
- `css/layout.css` - header, hero y estructura principal.
- `css/components.css` - tarjetas, filtros y componentes específicos.
- `css/animations.css` - keyframes y animaciones decorativas.
- `css/footer.css` - estilos del pie de página.
- `js/api.js` - funciones para consumir la API (actualmente mocks).
- `js/animations.js` - helpers para la animación de tarjetas "caen desde arriba".
- `js/app.js` - lógica de renderizado y modal.

Cómo probar localmente (opciones):

1) Usar una extensión Live Server en tu editor (VSCode Live Server).
2) Usar un servidor HTTP simple (Python) desde la carpeta `frontend`:

```powershell
# en Windows PowerShell (desde la carpeta 'frontend')
python -m http.server 8080
# luego abre http://localhost:8080
```

Notas:
- Actualmente `api.js` devuelve datos mock para poder desarrollar sin backend.
- Cuando tengas la API backend, reemplaza `getProfiles` por una llamada fetch a `/api/profiles`.
