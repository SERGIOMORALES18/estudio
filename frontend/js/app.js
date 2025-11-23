/*
  app.js (module)
  - Lógica principal de la UI: carga perfiles (mock), renderizado de la cuadrícula y control del modal.
  - Usa api.js para obtener datos y animations.js para los efectos de caída.
*/
import { getProfiles } from './api.js';
import { spawnFallingCard } from './animations.js';

const grid = document.getElementById('profiles-grid');
const fallingArea = document.getElementById('falling-area');
const modal = document.getElementById('profile-modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

function createCard(profile){
  const card = document.createElement('article');
  card.className = 'profile-card';
  card.dataset.id = profile.id;
  card.innerHTML = `
    <img class="profile-photo" src="${profile.photos?.[0]||''}" alt="${profile.alias}">
    <div class="profile-meta">
      <h3>${profile.alias}, ${profile.age}</h3>
      <p>${profile.city} • ${profile.tags?.slice(0,2).join(' • ')}</p>
    </div>
  `;
  // abrir modal al hacer click
  card.addEventListener('click', ()=> openModal(profile));
  return card;
}

function renderProfiles(profiles){
  grid.innerHTML = '';
  profiles.forEach(p=>{
    const c = createCard(p);
    grid.appendChild(c);
  });
}

function openModal(profile){
  modalContent.innerHTML = `
    <h2>${profile.alias} — ${profile.age}</h2>
    <p>${profile.city}</p>
    <div style="display:flex;gap:.5rem;margin-top:.6rem;flex-wrap:wrap">
      ${profile.photos.map(url=>`<img src="${url}" style="height:160px;object-fit:cover;border-radius:8px">`).join('')}
    </div>
    <p style="margin-top:.6rem;color:#cfcfcf">Tags: ${profile.tags?.join(', ')}</p>
  `;
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal() });

// bootstrap
async function init(){
  const profiles = await getProfiles();
  renderProfiles(profiles);

  // spawn some falling items periodically to create the casino effect
  setInterval(()=>{
    const pick = profiles[Math.floor(Math.random()*profiles.length)];
    spawnFallingCard(fallingArea, pick);
  }, 900);
}

init().catch(err=>{ console.error('Error inicializando app', err) });
