/*
  seed_profiles.js
  ----------------
  Simple script to populate the `profiles` table with the mock data
  that lives in frontend/js/api.js. Run this once after you create the
  table (or whenever you want to reset to the example dataset).

  Usage:
      cd backend
      node scripts/seed_profiles.js
*/

const db = require('../src/db');

// subset of the mock profiles in api.js; you can extend it as needed
const mockProfiles = [
  {
    alias:'Ana',
    age:25,
    city:'Bogotá',
    availability: 'Sí',
    english_level: 3,
    experience: 'Moderada',
    profession: 'Estudiante',
    height: '165 cm',
    build: 'Delgada',
    bust_type: 'Pequeño',
    surgery: 'No',
    skin_color: 'Trigueña',
    hair_color: 'Castaño',
    eye_color: 'Marrones',
    butt_size: 'Pequeña',
    tattoos: 'Sí',
    braces: 'No',
    extras: ['Anal','Trios (con dos chicos)','Trios (con dos chicas)','Atención a mujeres','Squirt','Fetiche de pies','Roleplay'],
    hobbies: 'Soy una <span class="highlight">Escort Delgada en Bogotá</span> alta y me encanta cómo se siente: me da seguridad, porte y ese toque elegante que se nota apenas entro 😊. De mi cara, amo mis labios: carnosos, expresivos, con esa forma de decir más de lo que hablo 💋. Mi cintura es chiquita y me encanta cómo marca mis curvas cuando camino; todo se ve y se siente en su lugar 💃. Tengo la piel suave (sí, de las que invitan a acercarse 😌) y una voz dulce que se queda en la cabeza 😏. Me gusta jugar con los detalles: una mirada sostenida, una sonrisa medio traviesa, el perfume justo y un "hola" bajito al oído 😘. Soy una Escort Delgada en Bogotá coqueta sin esfuerzo, cercana, con vibra rica y cero complicaciones 😌',
    special: 'Soy cercana, coqueta y cero complicaciones; me encanta cómo se siente el momento.',
    unique_trait: 'Me encanta explorar sin prisa, provocar con una sonrisa y dejar que el juego se ponga intenso.',
    price70: 470,
    price_unit: 'COP',
    tags:['VIP','Disponible'],
    photos:[
      'https://picsum.photos/id/1011/800/1200',
      'https://picsum.photos/id/1012/800/1200'
    ],
    description: 'Estudiante apasionada del arte. Amante de los cafés y las conversaciones profundas.',
    reviews: [
      {
        title: 'Excelente servicio',
        author: 'Alejo Black',
        email: 'alejo@example.com',
        presentation: 4,
        attention: 3,
        photoAccuracy: 4,
        text: '<strong>Nos recomendarías?</strong> Sí!',
        recommendationLabel: 'Nos recomendarías?',
        recommendation: 'Sí!',
        thumbsUp: 0,
        thumbsDown: 0
      },
      {
        title: 'Volvería sin dudar',
        author: 'Reservado#1',
        presentation: 5,
        attention: 5,
        photoAccuracy: 5,
        text: '<strong>¿Repetirías con ella?</strong> claro que sí!',
        recommendationLabel: 'Repetirías con ella?',
        recommendation: 'claro que sí!',
        thumbsUp: 0,
        thumbsDown: 0
      }
    ]
  },
  {
    alias:'Luna',
    age:28,
    city:'Medellín',
    availability: 'No',
    english_level: 2,
    experience: 'Alta',
    profession: 'Modelaje',
    height: '170 cm',
    build: 'Atlética',
    bust_type: 'Mediano',
    surgery: 'Sí',
    skin_color: 'Clara',
    hair_color: 'Negro',
    eye_color: 'Verdes',
    butt_size: 'Grande',
    tattoos: 'No',
    braces: 'No',
    extras: ['Trios (con dos chicas)','Roleplay'],
    hobbies: 'Bailar, viajar y descubrir nuevos sabores en la ciudad.',
    special: 'Siempre dispuesta a complacer y sorprender.',
    unique_trait: 'Combina elegancia con una pizca de travesura.',
    price70: 550,
    price_unit: 'COP',
    tags:['Premium','Horario nocturno'],
    photos:[
      'https://picsum.photos/id/1015/800/1200',
      'https://picsum.photos/id/1016/800/1200'
    ],
    description: 'Apasionada por la noche y las experiencias exclusivas.',
    reviews: [
      {
        author: 'UsuarioX',
        presentation: 5,
        attention: 4,
        photoAccuracy: 5,
        text: 'Muy profesional y atenta.',
        recommendationLabel: 'Nos recomendarías?',
        recommendation: 'Claro',
        thumbsUp: 1,
        thumbsDown: 0
      }
    ]
  }
];

// helper to convert arrays to JSON strings the same way server.js does
function prepareForSql(data) {
  const copy = { ...data };
  ['photos', 'tags', 'extras'].forEach((field) => {
    if (copy[field] !== undefined) {
      if (Array.isArray(copy[field])) {
        copy[field] = JSON.stringify(copy[field]);
      } else if (copy[field] === '' || copy[field] === null) {
        copy[field] = JSON.stringify([]);
      }
    }
  });
  return copy;
}

(async function seed() {
  try {
    const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM profiles');
    if (count > 0) {
      console.log('profiles table already contains data (count=' + count + '), seed skipped.');
      process.exit(0);
    }
    for (const p of mockProfiles) {
      const reviews = p.reviews || [];
      delete p.reviews;

      const row = prepareForSql(p);
      const [result] = await db.query('INSERT INTO profiles SET ?', row);
      const profileId = result.insertId;

      // insert reviews separately
      for (const r of reviews) {
        await db.query(
          `INSERT INTO profile_reviews (profile_id, author, title, email, presentation, attention, photoAccuracy, text, recommendationLabel, recommendation, thumbsUp, thumbsDown)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            profileId,
            r.author,
            r.title || null,
            r.email || null,
            r.presentation,
            r.attention,
            r.photoAccuracy,
            r.text,
            r.recommendationLabel,
            r.recommendation,
            r.thumbsUp || 0,
            r.thumbsDown || 0
          ]
        );
      }
    }
    console.log(`inserted ${mockProfiles.length} sample profiles plus reviews`);
    process.exit(0);
  } catch (err) {
    console.error('seeding error', err);
    process.exit(1);
  }
})();
