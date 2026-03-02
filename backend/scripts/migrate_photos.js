/*
  migrate_photos.js
  -----------------
  Convierte fotos codificadas en base64 almacenadas en la columna `photos` de
  la tabla `profiles` en archivos físicos dentro de `../uploads` y actualiza
  el registro para que contenga las rutas en lugar de los datos inline.

  Uso:
      cd backend
      node scripts/migrate_photos.js

  Nota: el script asume que la columna `photos` ya es de tipo JSON o TEXT y que
  las cadenas existentes están en formato JSON-serializado de un array.
*/

const db = require('../src/db');
const fs = require('fs');
const path = require('path');

async function run() {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const [rows] = await db.query('SELECT id, photos FROM profiles');
  for (const row of rows) {
    let photos;
    try {
      photos = JSON.parse(row.photos);
    } catch (e) {
      console.warn(`profile ${row.id} has unparsable photos, skipping`);
      continue;
    }
    if (!Array.isArray(photos)) continue;

    let changed = false;

    const newPhotos = await Promise.all(
      photos.map(async (p) => {
        if (typeof p === 'string' && p.startsWith('data:')) {
          // base64 data URL -- decode and write to file
          const match = p.match(/^data:(.+);base64,(.+)$/);
          if (!match) return p; // unexpected format
          const ext = match[1].split('/')[1] || 'bin';
          const data = Buffer.from(match[2], 'base64');
          const filename = `${Date.now()}-${row.id}.${ext}`;
          const filePath = path.join(uploadDir, filename);
          fs.writeFileSync(filePath, data);
          changed = true;
          return `/uploads/${filename}`;
        }
        return p;
      })
    );

    if (changed) {
      await db.query('UPDATE profiles SET photos = ? WHERE id = ?', [
        JSON.stringify(newPhotos),
        row.id,
      ]);
      console.log(`migrated photos for profile ${row.id}`);
    }
  }
  console.log('migration complete');
  process.exit(0);
}

run().catch((err) => {
  console.error('migration error', err);
  process.exit(1);
});
