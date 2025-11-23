# Velvet Club - Frontend

Breve guía para el frontend estático de Velvet Club.

Estructura:
- `index.html` - página principal.
- `css/styles.css` - estilos y animaciones.
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
