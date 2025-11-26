import { getProfiles } from './api.js';
import { spawnFallingCard } from './animations.js';
import { renderProfiles } from './cards.js';

const grid = document.getElementById('profiles-grid');
const fallingArea = document.getElementById('falling-area');

// Filtros: elementos en DOM (serán poblados dinámicamente)
const filterBreast = document.getElementById('filter-breast');
const filterButt = document.getElementById('filter-butt');
const filterPreference = document.getElementById('filter-preference');
const filterMinAge = document.getElementById('filter-min-age');
const filterMaxAge = document.getElementById('filter-max-age');
const filterReset = document.getElementById('filter-reset');

let allProfiles = [];

// Card rendering and flip logic moved to `cards.js`; app.js only bootstraps and handles modal + falling decorations

// Modal removed: 'Ver más' opens a new tab to `profile.html?id=`. No modal logic here anymore.

// bootstrap
async function init(){
  const profiles = await getProfiles();
  allProfiles = profiles;

  // poblar filtros (preferencias) basados en datos reales
  populateFilters(profiles);

  // render inicial
  renderProfiles(profiles, grid);

  // spawn some falling items periodically to create the casino effect
  // spawn less frequently and limit active falling elements to reduce clutter
  setInterval(()=>{
    // don't spawn if too many are already present
    const active = fallingArea.querySelectorAll('.falling').length;
    if(active > 6) return;
    const pick = profiles[Math.floor(Math.random()*profiles.length)];
    spawnFallingCard(fallingArea, pick);
  }, 2200);

  // listeners para filtros: filtrar en tiempo real
  if (filterBreast) filterBreast.addEventListener('change', applyFilters);
  if (filterButt) filterButt.addEventListener('change', applyFilters);
  if (filterPreference) filterPreference.addEventListener('change', applyFilters);
  if (filterMinAge) filterMinAge.addEventListener('input', applyFilters);
  if (filterMaxAge) filterMaxAge.addEventListener('input', applyFilters);
  if (filterReset) filterReset.addEventListener('click', (e) => { e.preventDefault(); resetFilters(); applyFilters(); });
}

function populateFilters(profiles){
  if (!filterPreference) return;

  const tags = new Set();
  profiles.forEach(p => (p.tags||[]).forEach(t => tags.add(t)));

  // añadir etiquetas encontradas
  tags.forEach(t => {
    const opt = document.createElement('option'); opt.value = t.toLowerCase(); opt.textContent = t; filterPreference.appendChild(opt);
  });

  // añadir preferencias explícitas pedidas por el usuario
  ['anal','trios'].forEach(pref => {
    if (![...tags].map(x=>x.toLowerCase()).includes(pref)){
      const opt = document.createElement('option'); opt.value = pref; opt.textContent = pref.charAt(0).toUpperCase()+pref.slice(1);
      filterPreference.appendChild(opt);
    }
  });
}

function applyFilters(){
  let filtered = allProfiles.slice();
  const breast = filterBreast ? filterBreast.value : '';
  const butt = filterButt ? filterButt.value : '';
  const pref = filterPreference ? filterPreference.value : '';
  const min = filterMinAge && filterMinAge.value ? Number(filterMinAge.value) : null;
  const max = filterMaxAge && filterMaxAge.value ? Number(filterMaxAge.value) : null;

  if (breast) filtered = filtered.filter(p => matchBreast(p, breast));
  if (butt) filtered = filtered.filter(p => matchButt(p, butt));
  if (pref) filtered = filtered.filter(p => matchPreference(p, pref));
  if (min !== null) filtered = filtered.filter(p => Number(p.age) >= min);
  if (max !== null) filtered = filtered.filter(p => Number(p.age) <= max);

  renderProfiles(filtered, grid);
}

function matchBreast(profile, value){
  // Buscar en tags o descripción palabras claves relacionadas
  const text = ((profile.description||'') + ' ' + (profile.tags||[]).join(' ')).toLowerCase();
  if (value === 'grandes') return text.includes('senos grandes') || text.includes('senos') && text.includes('grande');
  if (value === 'pequeños') return text.includes('senos pequeños') || text.includes('senos') && text.includes('peque');
  return true;
}

function matchButt(profile, value){
  const text = ((profile.description||'') + ' ' + (profile.tags||[]).join(' ')).toLowerCase();
  if (value === 'grande') return text.includes('cola grande') || text.includes('cola') && text.includes('grande') || text.includes('trasero grande') || text.includes('gluteo grande');
  if (value === 'pequeña') return text.includes('cola pequeña') || text.includes('cola') && text.includes('peque') || text.includes('trasero pequeño') || text.includes('gluteo pequeño');
  return true;
}

function matchPreference(profile, value){
  const text = ((profile.description||'') + ' ' + (profile.tags||[]).join(' ')).toLowerCase();
  if (!value) return true;
  // value puede venir en minúsculas desde populate
  if ((profile.tags||[]).map(t=>t.toLowerCase()).includes(value)) return true;
  return text.includes(value.toLowerCase());
}

function resetFilters(){
  if (filterCity) filterCity.value = '';
  if (filterTag) filterTag.value = '';
  if (filterMinAge) filterMinAge.value = '';
  if (filterMaxAge) filterMaxAge.value = '';
}

init().catch(err=>{ console.error('Error inicializando app', err) });
