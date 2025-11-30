/**
 * app.js — Inicialización principal y lógica de filtrado
 * - Carga perfiles (desde `api.js`) y renderiza tarjetas (usando `cards.js`).
 * - Gestiona las animaciones decorativas (`animations.js`).
 * - Implementa la UI del "Menú de apuestas": panel modal con checkboxes,
 *   lógica de filtrado y backdrop. Mantén responsabilidades separadas: las
 *   tarjetas y animaciones viven en sus módulos correspondientes.
 *
 * Notas:
 * - Los filtros están diseñados para ser no destructivos y rápidos (filtrado en
 *   cliente). Se usan checkboxes estilizadas y un campo de edad máxima.
 */
import { getProfiles } from './api.js';
import { spawnFallingCard } from './animations.js';
import { renderProfiles } from './cards.js';
import { initFilters } from './filters.js';

const grid = document.getElementById('profiles-grid');
const fallingArea = document.getElementById('falling-area');

// El módulo `filters.js` se encarga de la interacción y el filtrado del panel.

let allProfiles = [];

// Card rendering and flip logic moved to `cards.js`; app.js only bootstraps and handles modal + falling decorations

// Modal removed: 'Ver más' opens a new tab to `profile.html?id=`. No modal logic here anymore.

// bootstrap
async function init(){
  const profiles = await getProfiles();
  allProfiles = profiles;

  // Inicializa la lógica de filtros (render inicial incluido)
  initFilters(profiles, grid);

  // spawn some falling items periodically to create the casino effect
  // spawn less frequently and limit active falling elements to reduce clutter
  setInterval(()=>{
    const active = fallingArea.querySelectorAll('.falling').length;
    if(active > 6) return;
    const pick = profiles[Math.floor(Math.random()*profiles.length)];
    spawnFallingCard(fallingArea, pick);
  }, 2200);
}

/**
 * populateFilters(profiles)
 * Para este diseño actual las preferencias son opciones fijas (estáticas)
 * definidas en el HTML: 'Horario nocturno', 'Anal', 'Trios'. Si en el futuro
 * se desea poblar dinámicamente desde `profiles`, mover la lógica aquí.
 */
// Nota: las funciones de filtrado y la UI del panel están implementadas en `filters.js`.

init().catch(err=>{ console.error('Error inicializando app', err) });
