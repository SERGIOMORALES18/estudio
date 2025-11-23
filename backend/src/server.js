/*
  Simple Express server for Velvet Club (backend)
  - Serves the frontend static files from ../frontend
  - Exposes a simple API endpoint /api/profiles that returns mock profiles
  - Includes a fallback to index.html so the frontend can use history routing
*/

const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Point to the frontend folder (project root: estudio)
const frontendDir = path.resolve(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendDir));

// Mock data (same shape used by frontend/js/api.js)
const profiles = [
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

// API endpoint that returns profiles (for the frontend)
app.get('/api/profiles', (req, res) => {
  res.json(profiles);
});

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Velvet backend running at http://localhost:${PORT}`);
});
