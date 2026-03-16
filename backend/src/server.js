/*
  Simple Express server para Velvet Club (backend)
  - Sirve los archivos estáticos del frontend desde ../frontend
  - Conecta con una base de datos MySQL local `velvet` y proporciona
    rutas CRUD para la tabla `profiles` y `profile_reviews`.
  - Incluye una ruta de reserva que devuelve index.html para el routing
    del lado cliente.
*/

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');

// pool de conexión a MySQL
const db = require('./db');

// multer configurado para almacenar archivos en disco bajo /uploads
// (asegúrate de que la carpeta exista: backend/uploads)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename(req, file, cb) {
    // genera un nombre único: timestamp + nombre original sin espacios
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB por archivo
});

const app = express();
const PORT = process.env.PORT || 3000;

// asegurarnos de que la carpeta de uploads exista
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(morgan('dev'));
// permitir cuerpos grandes (imágenes en base64) durante creación/edición
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// middleware helper que convierte archivos cargados en rutas públicas.
// antes el servidor transformaba a Base64; con el enfoque de disco guardamos
// el path relativo, que es mucho más ligero y evita límites de tamaño.
function convertUploads(req, res, next) {
  if (req.files && req.files.length) {
    // construir rutas accesibles desde el navegador
    const photos = req.files.map((file) => `/uploads/${file.filename}`);
    req.body.photos = photos;
  }
  next();
}

// Point to the frontend folder (project root: estudio)
const frontendDir = path.resolve(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendDir));
// servir también los archivos subidos dinámicamente
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ---- helpers -------------------------------------------------------------
// Normaliza un registro de perfil recuperado de la base de datos.
// - convierte columnas JSON almacenadas como texto en objetos/arrays
// - adjunta la lista de reseñas si se pasan como segundo argumento
function normalizeProfile(profile, reviews = []) {
  if (!profile) return profile;
  // campos que en la tabla `profiles` se guardan como JSON string
  ['photos', 'tags', 'extras'].forEach((field) => {
    if (profile[field] && typeof profile[field] === 'string') {
      try {
        profile[field] = JSON.parse(profile[field]);
      } catch (e) {
        // si falla el parseo, dejamos el valor tal cual
      }
    }
  });
  // adjuntamos reseñas (se cargan por separado)
  profile.reviews = reviews;
  return profile;
}

// devuelve todos los perfiles sin reseñas (no hacemos JOIN para no traer grandes
// cantidades de datos cada vez que se lista el catálogo)
async function queryProfiles() {
  const [rows] = await db.query('SELECT * FROM profiles');
  return rows.map((p) => normalizeProfile(p));
}

async function queryProfileById(id) {
  const [rows] = await db.query('SELECT * FROM profiles WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  // obtener reseñas asociadas
  const [reviews] = await db.query('SELECT * FROM profile_reviews WHERE profile_id = ?', [id]);
  return normalizeProfile(rows[0], reviews);
}

// API endpoint that returns profiles (for the frontend)
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await queryProfiles();
    res.json(profiles);
  } catch (err) {
    console.error('DB error fetching profiles', err);
    res.status(500).json({ error: 'database error' });
  }
});

// get single profile by id
app.get('/api/profiles/:id', async (req, res) => {
  try {
    const profile = await queryProfileById(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error('DB error fetching profile', err);
    res.status(500).json({ error: 'database error' });
  }
});

// filtra los datos recibidos desde el cliente para que SOLO se incluyan
// columnas que existen en la tabla `profiles`. Esto evita que un usuario malicioso
// inserte campos inesperados.
function filterProfileData(body) {
  const allowed = [
    'alias',
    'age',
    'city',
    'availability',
    'english_level',
    'experience',
    'profession',
    'height',
    'build',
    'bust_type',
    'surgery',
    'skin_color',
    'hair_color',
    'eye_color',
    'butt_size',
    'tattoos',
    'braces',
    'hobbies',
    'special',
    'unique_trait',
    'price70',
    'price_unit',
    'description',
    'photos',
    'tags',
    'extras',
    // las reseñas se almacenan en una tabla separada, así que no las aceptamos aquí
  ];
  const out = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      out[key] = body[key];
    }
  }
  return out;
}

// ensure arrays/text fields are converted to JSON strings before hitting the DB
function prepareForSql(data) {
  const copy = { ...data };
  ['photos', 'tags', 'extras'].forEach((field) => {
    if (copy[field] !== undefined) {
      if (Array.isArray(copy[field])) {
        try {
          copy[field] = JSON.stringify(copy[field]);
        } catch (e) {
          // leave as-is if stringify fails
        }
      } else if (copy[field] === '' || copy[field] === null) {
        // convert empty value to empty array string
        copy[field] = JSON.stringify([]);
      }
    }
  });
  return copy;
}

// Create new profile
app.post('/api/profiles', upload.array('photos'), convertUploads, async (req, res) => {
  try {
    let data = filterProfileData(req.body);
    data = prepareForSql(data);
    const [result] = await db.query('INSERT INTO profiles SET ?', data);
    const inserted = await queryProfileById(result.insertId);
    res.status(201).json(inserted);
  } catch (err) {
    console.error('DB error inserting profile', err);
    res.status(500).json({ error: 'database error' });
  }
});

// Update existing profile
app.put('/api/profiles/:id', upload.array('photos'), convertUploads, async (req, res) => {
  try {
    const id = req.params.id;
    let data = filterProfileData(req.body);
    data = prepareForSql(data);
    const [result] = await db.query('UPDATE profiles SET ? WHERE id = ?', [data, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    const updated = await queryProfileById(id);
    res.json(updated);
  } catch (err) {
    console.error('DB error updating profile', err);
    res.status(500).json({ error: 'database error' });
  }
});

// Delete profile
app.delete('/api/profiles/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('DELETE FROM profiles WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('DB error deleting profile', err);
    res.status(500).json({ error: 'database error' });
  }
});

// helpers y endpoints para reseñas de perfiles --------------------------------
// filtra campos válidos que vienen del cliente para insertar una reseña
function filterReviewData(body) {
  const allowed = [
    'author',
    'title',
    'email',
    'presentation',
    'attention',
    'photoAccuracy',
    'text',
    'recommendationLabel',
    'recommendation',
  ];
  const out = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      out[key] = body[key];
    }
  }
  return out;
}

// obtener todas las reseñas de un perfil específico
app.get('/api/profiles/:id/reviews', async (req, res) => {
  try {
    const profileId = req.params.id;
    const [rows] = await db.query('SELECT * FROM profile_reviews WHERE profile_id = ?', [
      profileId,
    ]);
    res.json(rows);
  } catch (err) {
    console.error('DB error fetching reviews', err);
    res.status(500).json({ error: 'database error' });
  }
});

// crear una reseña nueva para un perfil
app.post('/api/profiles/:id/reviews', async (req, res) => {
  try {
    const profileId = req.params.id;
    const data = filterReviewData(req.body);
    const fields = [
      profileId,
      data.author || null,
      data.title || null,
      data.email || null,
      data.presentation || null,
      data.attention || null,
      data.photoAccuracy || null,
      data.text || null,
      data.recommendationLabel || null,
      data.recommendation || null,
      0, // thumbsUp
      0, // thumbsDown
    ];
    const [result] = await db.query(
      `INSERT INTO profile_reviews 
        (profile_id, author, title, email, presentation, attention, photoAccuracy, text, recommendationLabel, recommendation, thumbsUp, thumbsDown)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      fields
    );
    const [inserted] = await db.query('SELECT * FROM profile_reviews WHERE id = ?', [
      result.insertId,
    ]);
    res.status(201).json(inserted[0]);
  } catch (err) {
    console.error('DB error inserting review', err);
    res.status(500).json({ error: 'database error' });
  }
});

// middleware para convertir errores de tamaño en JSON legible
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer limita tamaño de archivo individual
    console.warn('Multer error:', err.code, err.message);
    return res.status(413).json({ error: err.message });
  }
  if (err && err.type === 'entity.too.large') {
    console.warn('Payload demasiado grande:', err.message);
    return res.status(413).json({ error: 'payload too large' });
  }
  next(err);
});

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// export the app for testing; start the server only when invoked directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Velvet backend running at http://localhost:${PORT}`);
  });
}

module.exports = app;
