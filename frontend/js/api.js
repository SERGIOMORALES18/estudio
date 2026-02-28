/**
 * ============================================================================
 * api.js — Capa de acceso a datos
 * ============================================================================
 * 
 * Proporciona dos funciones para obtener datos de perfiles:
 * 
 * 1. getProfiles()
 *    - Retorna datos mock para desarrollo local del frontend
 *    - Contiene 15 perfiles con fotos, descripción y tags
 *    - Útil para testing sin dependencia del backend
 * 
 * 2. fetchProfilesFromServer()
 *    - Llamada al endpoint /api/profiles del backend
 *    - Remplazar getProfiles() por esta función cuando sea necesario
 *    - Requiere que el backend esté corriendo
 * 
 * Estructura de un perfil:
 * {
 *   id: number,
 *   alias: string,           // Nombre/apodo del perfil
 *   age: number,
 *   city: string,
 *   tags: string[],          // Tags descriptivos (VIP, Premium, etc)
 *   photos: string[],        // URLs de imágenes
 *   description: string      // Descripción completa (opcional)
 * }
 * 
 * ============================================================================
 */

/**
 * getProfiles()
 * @returns {Promise<Array>} Array de perfiles con datos mock para desarrollo
 * 
 * NOTA: Los datos están hardcodeados. En producción, reemplazar con
 * fetchProfilesFromServer() para obtener datos del backend real.
 */
export async function getProfiles() {
  // Mock data para desarrollo frontend
  return [
    {
      id:1,
      alias:'Ana',
      age:25,
      city:'Bogotá',
      availability: 'Sí',
      englishLevel: 3, // 1-5 scale
      experience: 'Moderada',
      profession: 'Estudiante',
      height: '165 cm',
      build: 'Delgada',
      bustType: 'Pequeño',
      surgery: 'No',
      skinColor: 'Trigueña',
      hairColor: 'Castaño',
      eyeColor: 'Marrones',
      buttSize: 'Pequeña',
      tattoos: 'Sí',
      braces: 'No',
      extras: ['Anal','Trios (con dos chicos)','Trios (con dos chicas)','Atención a mujeres','Squirt','Fetiche de pies','Roleplay'],
      hobbies: 'Soy una <span class="highlight">Escort Delgada en Bogotá</span> alta y me encanta cómo se siente: me da seguridad, porte y ese toque elegante que se nota apenas entro 😊. De mi cara, amo mis labios: carnosos, expresivos, con esa forma de decir más de lo que hablo 💋. Mi cintura es chiquita y me encanta cómo marca mis curvas cuando camino; todo se ve y se siente en su lugar 💃. Tengo la piel suave (sí, de las que invitan a acercarse 😌) y una voz dulce que se queda en la cabeza 😏. Me gusta jugar con los detalles: una mirada sostenida, una sonrisa medio traviesa, el perfume justo y un "hola" bajito al oído 😘. Soy una Escort Delgada en Bogotá coqueta sin esfuerzo, cercana, con vibra rica y cero complicaciones 😌',
      special: 'Soy cercana, coqueta y cero complicaciones; me encanta cómo se siente el momento.',
      unique: 'Me encanta explorar sin prisa, provocar con una sonrisa y dejar que el juego se ponga intenso.',
      price70: 470,
      priceUnit: 'COP',
      tags:['VIP','Disponible'],
      photos:[
        'https://picsum.photos/id/1011/800/1200',
        'https://picsum.photos/id/1012/800/1200'
      ],
      description: 'Estudiante apasionada del arte. Amante de los cafés y las conversaciones profundas.',
      reviews: [
        {
          author: 'Alejo Black',
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
      id:2,
      alias:'Luna',
      age:28,
      city:'Medellín',
      availability: 'No',
      englishLevel: 2,
      experience: 'Alta',
      profession: 'Modelaje',
      height: '170 cm',
      build: 'Atlética',
      bustType: 'Mediano',
      surgery: 'Sí',
      skinColor: 'Clara',
      hairColor: 'Negro',
      eyeColor: 'Verdes',
      buttSize: 'Grande',
      tattoos: 'No',
      braces: 'No',
      extras: ['Trios (con dos chicas)','Roleplay'],
      hobbies: 'Bailar, viajar y descubrir nuevos sabores en la ciudad.',
      special: 'Siempre dispuesta a complacer y sorprender.',
      unique: 'Combina elegancia con una pizca de travesura.',
      price70: 550,
      priceUnit: 'COP',
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
    }, 
    {
      id:3,
      alias:'Sofia',
      age:24,
      city:'Cali',
      tags:['Nueva'],
      photos:[
        'https://picsum.photos/id/1018/800/1200'
      ]
    },
    {
      id:4,
      alias:'María',
      age:30,
      city:'Cartagena',
      tags:['VIP','Viajes'],
      photos:[
        'https://picsum.photos/id/1021/800/1200',
        'https://picsum.photos/id/1022/800/1200'
      ],
      description: 'Amante del mar y las puestas de sol, disfruta viajar y conocer nuevos lugares.'
    },
    {
      id:5,
      alias:'Camila',
      age:27,
      city:'Barranquilla',
      tags:['Bailable','Nocturna'],
      photos:['https://picsum.photos/id/1025/800/1200'],
      description: 'Apasionada por la música y la noche, le encanta bailar y conocer gente nueva.'
    },
    {
      id:6,
      alias:'Valentina',
      age:22,
      city:'Bogotá',
      tags:['Estudiante','Arte'],
      photos:['https://picsum.photos/id/1027/800/1200'],
      description: 'Estudiante de arte, creativa y con gusto por la fotografía y los cafés.'
    },
    {
      id:7,
      alias:'Sofía R',
      age:29,
      city:'Cali',
      tags:['Premium','Aventurera'],
      photos:['https://picsum.photos/id/1031/800/1200'],
      description: 'Aventurera, le gustan las montañas y el senderismo los fines de semana.'
    },
    {
      id:8,
      alias:'Isabella',
      age:26,
      city:'Medellín',
      tags:['Cultural'],
      photos:['https://picsum.photos/id/1033/800/1200'],
      description: 'Amante del cine independiente y las exposiciones de arte.'
    },
    {
      id:9,
      alias:'Lucía',
      age:31,
      city:'Pereira',
      tags:['Gourmet'],
      photos:['https://picsum.photos/id/1035/800/1200'],
      description: 'Chef aficionada, disfruta de la cocina local y la buena mesa.'
    },
    {
      id:10,
      alias:'Paula',
      age:23,
      city:'Bucaramanga',
      tags:['Deportiva'],
      photos:['https://picsum.photos/id/1037/800/1200'],
      description: 'Entrenadora y amante del aire libre, practica ciclismo y trail running.'
    },
    {
      id:11,
      alias:'Daniela',
      age:28,
      city:'Manizales',
      tags:['Intelectual'],
      photos:['https://picsum.photos/id/1039/800/1200'],
      description: 'Lectora empedernida y aficionada a la música clásica.'
    },
    {
      id:12,
      alias:'Noemí',
      age:35,
      city:'Pasto',
      tags:['Serena'],
      photos:['https://picsum.photos/id/1041/800/1200'],
      description: 'Prefiere planes tranquilos, paseos por el campo y buen café.'
    },
    {
      id:13,
      alias:'Mariana',
      age:21,
      city:'Sincelejo',
      tags:['Estrella'],
      photos:['https://picsum.photos/id/1043/800/1200'],
      description: 'Joven y entusiasta, le encanta la moda y las tendencias.'
    },
    {
      id:14,
      alias:'Catalina',
      age:33,
      city:'Ibagué',
      tags:['Profesional'],
      photos:['https://picsum.photos/id/1045/800/1200'],
      description: 'Profesional dedicada, disfruta del teatro y la buena conversación.'
    },
    {
      id:15,
      alias:'Alejandra',
      age:29,
      city:'Cúcuta',
      tags:['Creativa'],
      photos:['https://picsum.photos/id/1047/800/1200'],
      description: 'Diseñadora gráfica, amante del color y los viajes cortos.'
    }
  ];
}

/**
 * fetchProfilesFromServer()
 * @returns {Promise<Array>} Array de perfiles desde el endpoint /api/profiles
 * 
 * Consume el endpoint del backend Express que retorna los perfiles
 * en la misma estructura que getProfiles().
 * 
 * Si necesitas cambiar a esta función:
 * 1. Reemplaza la importación en app.js
 * 2. Asegúrate de que el servidor backend esté corriendo (puerto 3000)
 * 3. El endpoint debe estar disponible en /api/profiles
 */
export async function fetchProfilesFromServer() {
  try {
    const response = await fetch('/api/profiles');
    if (!response.ok) {
      throw new Error('Error al obtener perfiles del servidor');
    }
    return await response.json();
  } catch (error) {
    console.error('Error conectando con el servidor:', error);
    throw error;
  }
}

// objeto cliente para facilitar exportaciones
export const apiClient = {
  getProfiles,
  fetchProfilesFromServer
};
