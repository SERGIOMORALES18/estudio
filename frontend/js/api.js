export async function getProfiles() {
  // Mock data for frontend development (id, alias, age, city, tags, photos, description)
  return [
    {
      id:1,
      alias:'Ana',
      age:25,
      city:'Bogotá',
      tags:['VIP','Disponible'],
      photos:[
        'https://picsum.photos/id/1011/800/1200',
        'https://picsum.photos/id/1012/800/1200'
      ]
    },
    {
      id:2,
      alias:'Luna',
      age:28,
      city:'Medellín',
      tags:['Premium','Horario nocturno'],
      photos:[
        'https://picsum.photos/id/1015/800/1200',
        'https://picsum.photos/id/1016/800/1200'
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

export async function fetchProfilesFromServer() {
  const res = await fetch('/api/profiles');
  if (!res.ok) throw new Error('Error al obtener perfiles');
  return res.json();
}
