# Velvet Club - Frontend

Breve guía para el frontend estático de Velvet Club.

Estructura:
- `index.html` - página principal.
- `css/base.css` - variables y estilos globales (reset, fondo).
- `css/layout.css` - header, hero y estructura principal.
- `css/components.css` - tarjetas, filtros y componentes específicos.
- `css/animations.css` - keyframes y animaciones decorativas.
- `css/footer.css` - estilos del pie de página.
- `css/reviews.css` - reglas específicas para la sección de reseñas en `profile.html` (antes estaban en `profile.css`).
- `js/api.js` - funciones para consumir la API. `getProfiles()` retorna la lista general
  (sin reseñas), `fetchProfile(id)` obtiene un perfil completo incluyendo
  `reviews`.
- `js/animations.js` - helpers para la animación de tarjetas "caen desde arriba".
- `js/app.js` - lógica de renderizado y modal.
- `js/reviews.js` - manejo de la sección de reseñas y el formulario interactivo (separado para mantener `profile.js` limpio).

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
- La API ahora soporta reseñas. En la página de detalle (`profile.html`)
  se muestra un formulario para enviar reseñas anónimas al endpoint
  `POST /api/profiles/:id/reviews`. El formulario está inicialmente oculto y se
  despliega cuando el usuario hace clic en “✏️ Escribe una valoración”. Las
  puntuaciones de presentación/atención/foto se eligen haciendo clic en
  estrellas interactivas (no se usan campos numéricos), y sólo se piden el
  comentario, el título de la review y el nombre (opcionales).
- El panel administrativo convierte imágenes a Base64. Para evitar errores
  el servidor limita el cuerpo JSON a 20 MB y el cliente muestra una alerta si
  el conjunto de fotos excede unos 5 MB aproximados. Usa imágenes reducidas o
  URLs si necesitas más espacio.
- Cuando el backend está disponible, los datos reales se obtienen con
  `fetchProfilesFromServer()` (que delega a `getProfiles()`).
