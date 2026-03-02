# Velvet Club — Backend (desarrollo)

> **Cambio reciente**: las fotos ahora se guardan en disco (`/uploads`) y se
> guarda en la columna `photos` una lista de URLs relativas. Ajusta la tabla
> según la siguiente sección “Migración de fotos”.

Este backend es un servidor Express que:

1. Sirve los archivos estáticos del frontend (`../frontend`).
2. Se conecta a una base de datos MySQL local llamada **velvet**.
   - tablas: `profiles` y `profile_reviews` (esquema en `ESTRUCTURA_PROYECTO.md`).
   - la estructura básica está definida en el enunciado de la conversación:
     crea la base de datos velvet y los `CREATE TABLE` correspondientes.
3. Ofrece una API REST para gestionar perfiles y reseñas.

## Endpoints principales

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/profiles` | GET | Lista todos los perfiles (sin reseñas). |
| `/api/profiles` | POST | Crea un nuevo perfil. |
| `/api/profiles/:id` | GET | Obtiene un perfil incluyendo sus reseñas. |
| `/api/profiles/:id` | PUT | Actualiza un perfil existente. |
| `/api/profiles/:id` | DELETE | Elimina un perfil. |
| `/api/profiles/:id/reviews` | GET | Lista reseñas asociadas a un perfil. |
| `/api/profiles/:id/reviews` | POST | Inserta una nueva reseña para un perfil. **Acepta `title` y `email` opcionales.** |

Los datos JSON enviados/recibidos respetan los campos de las tablas.

### Esquema mínimo esperado para `profile_reviews`
A continuación figura un ejemplo de la estructura que utiliza el servidor.
Si estás creando la base de datos desde cero, puedes ejecutar esta definición;
si ya tienes la tabla, basta con añadir las dos columnas nuevas (`title`,
`email`) mediante un `ALTER TABLE`.

```sql
CREATE TABLE profile_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  author VARCHAR(100),
  title VARCHAR(150),      -- opcional (título de la reseña)
  email VARCHAR(120),      -- opcional
  presentation TINYINT,
  attention TINYINT,
  photoAccuracy TINYINT,
  text TEXT,
  recommendationLabel VARCHAR(100),
  recommendation VARCHAR(100),
  thumbsUp INT DEFAULT 0,
  thumbsDown INT DEFAULT 0,
  FOREIGN KEY (profile_id) REFERENCES profiles(id)
);
```

```sql
-- si la tabla ya existe, agrega sólo las columnas nuevas:
ALTER TABLE profile_reviews
  ADD COLUMN title VARCHAR(150),
  ADD COLUMN email VARCHAR(120);
```


## Requisitos

### Migración de fotos (opcional)
Si ya tienes perfiles con imágenes codificadas en Base64 puedes migrarlos con
un pequeño script o manualmente. La idea general es:

```sql
-- modificar el tipo de columna; JSON es conveniente ya que el servidor espera
-- un array de strings
ALTER TABLE profiles
  MODIFY photos JSON NOT NULL COMMENT 'array de rutas de fotos';
```

Luego recorre los registros, escribe cada cadena base‑64 a un archivo en
`backend/uploads` y actualiza el campo con la ruta correspondiente. No es
necesario para nuevas instalaciones.

## Requisitos

- Node.js v14+ (recomendado)
- MySQL corriendo localmente con base de datos `velvet`.
- Opcional: variables de entorno `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  para personalizar la conexión.

> **Nota**: el servidor está configurado para aceptar cuerpos JSON de hasta
> 20 MB. Anteriormente las imágenes se convertían en Base64 y se enviaban como
> parte del JSON. Con la configuración actual se utilizan `multipart/form-data`
> y los archivos se almacenan en `backend/uploads`. Si ves un error 413 al
> subir un archivo significa que excede el límite de 10 MB por imagen (configurado
> en multer); ajusta `limits.fileSize` o sube una versión más pequeña.

## Cómo ejecutar (Windows PowerShell / VS Code terminal):

```powershell
cd path\to\estudio\backend
npm install   # o npm run setup para instalar si falta
npm start      # ejecuta el servidor en http://localhost:3000
```

En desarrollo también se puede usar `npm run dev` (requiere nodemon).

La carpeta de frontend se sirve automáticamente; cualquier recarga de ruta no manejada
se devuelve a `index.html` para permitir routing del lado del cliente.

## Scripts útiles

- `npm run setup` → instala dependencias si no existen.
- `npm run seed` → (agregado) rellena la tabla `profiles` con datos de ejemplo
  y sus reseñas (usa `scripts/seed_profiles.js`).
- `node scripts/migrate_photos.js` → convierte fotos en Base64 existentes a
  archivos en `uploads` y actualiza los registros (ver sección "Migración de
  fotos").

> **Almacenamiento de fotos**: actualmente las imágenes se convierten a Base64
> y se guardan directamente en el campo `photos` (tipo `MEDIUMTEXT`, que
> admite hasta ~16 MB de texto). Este enfoque funciona para un número moderado
> de fotos pequeñas, pero no es ideal para archivos grandes. Si necesitas
> subir muchas imágenes o muy grandes, considera:
> 1. Aumentar el tipo de columna a `LONGTEXT` (hasta ~4 GB).
 2. **Guardar archivos en disco u otro almacenamiento y almacenar en la base de
    datos sólo las rutas o URLs.** Esto es la opción que ahora utiliza el
    servidor, un subdirectorio `backend/uploads` se crea y los nombres de las
    fotos se guardan como `['/uploads/123456-foo.jpg', ...]` en el campo
    `photos` (tipo `JSON` o `TEXT`).
> 3. Ajustar los límites de multer y `express.json` según sea necesario.

