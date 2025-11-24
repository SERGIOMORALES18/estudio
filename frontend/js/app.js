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
    <div class="card-inner">
      <div class="card-front">
        <img class="profile-photo" src="${profile.photos?.[0]||''}" alt="${profile.alias}">
        <div class="meta-overlay">
          <h3 class="name-age">${profile.alias}, ${profile.age}</h3>
          <p class="meta-details">${profile.city} • ${profile.tags?.slice(0,2).join(' • ')}</p>
        </div>
      </div>
      <div class="card-back">
        <div class="back-content">
          <p class="description">${profile.description || 'Descripción no disponible.'}</p>
          <button class="btn-more">Ver más</button>
        </div>
      </div>
    </div>
  `;

  // multi-flip behavior: 'Ver más' opens modal; clicking card runs multi-rotation then stays flipped
  card.addEventListener('click', (e)=>{
    if(e.target.closest('.btn-more')){
      openModal(profile);
      return;
    }

    const inner = card.querySelector('.card-inner');
    if(card.classList.contains('is-flipped')){
      // animate back to front with multiple turns
      inner.classList.add('multiflip-back');
      const handler = function(){
        inner.classList.remove('multiflip-back');
        card.classList.remove('is-flipped');
        inner.removeEventListener('animationend', handler);
      };
      inner.addEventListener('animationend', handler);
    } else {
      // animate to back with several turns, then set flipped state
      inner.classList.add('multiflip');
      const handler = function(){
        inner.classList.remove('multiflip');
        card.classList.add('is-flipped');
        inner.removeEventListener('animationend', handler);
      };
      inner.addEventListener('animationend', handler);
    }
  });

  return card;
}

function renderProfiles(profiles){
  grid.innerHTML = '';
  // render up to first 15 profiles
  profiles.slice(0,15).forEach(p=>{
    const c = createCard(p);
    grid.appendChild(c);
  });
}

function openModal(profile){
  modalContent.innerHTML = `
    <h2>${profile.alias} — ${profile.age}</h2>
    <p>${profile.city}</p>
    <div class="modal-photos">
      ${profile.photos.map(url => `<img src="${url}" alt="${profile.alias}">`).join('')}
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
  // spawn less frequently and limit active falling elements to reduce clutter
  setInterval(()=>{
    // don't spawn if too many are already present
    const active = fallingArea.querySelectorAll('.falling').length;
    if(active > 6) return;
    const pick = profiles[Math.floor(Math.random()*profiles.length)];
    spawnFallingCard(fallingArea, pick);
  }, 2200);
}

init().catch(err=>{ console.error('Error inicializando app', err) });
