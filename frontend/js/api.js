/*
  api.js (module)
  - Aquí van las funciones que consumen la API real.
  - Por ahora exportamos datos mock para poder desarrollar el frontend sin backend.
  - Cuando tengas el backend, reemplaza las funciones por fetch('/api/...') según el contrato.
*/

export async function getProfiles(){
  // Mock: devuelve una lista de perfiles simples para poblar la UI.
  // Cada perfil contiene: id, alias, age, city, tags, photos[] (url)
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
    }
  ];
}

// placeholder: cuando tengas API, cambia por fetch
export async function fetchProfilesFromServer(){
  const res = await fetch('/api/profiles');
  if(!res.ok) throw new Error('Error al obtener perfiles');
  return res.json();
}
