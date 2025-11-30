/**
 * cards.js — creación y renderizado de tarjetas de perfil
 * - `createCard(profile)` construye la estructura HTML de una tarjeta
 *   (front/back) y añade el comportamiento de flip cuando se hace click.
 * - `renderProfiles(profiles, gridElement)` limpia el grid y añade hasta
 *   15 tarjetas.
 *
 * Mantén la lógica de interacción dentro de la tarjeta (flip) y la salida
 * hacia `profile.html` desde el enlace 'Ver más'. No tocar lógica de datos.
 */

export function createCard(profile) {
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
          <!-- Open full profile in a new tab instead of modal -->
          <a class="btn-more" href="profile.html?id=${profile.id}" target="_blank" rel="noopener">Ver más</a>
        </div>
      </div>
    </div>
  `;

  // multi-flip behavior: click en la tarjeta gira; 'Ver más' es un enlace a profile.html
  card.addEventListener('click', (e) => {
    // if the clicked element is the external link, let the browser handle navigation
    if (e.target.closest('.btn-more')) return;

    const inner = card.querySelector('.card-inner');
    if (card.classList.contains('is-flipped')) {
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

export function renderProfiles(profiles, gridElement) {
  gridElement.innerHTML = '';
  profiles.slice(0,15).forEach(p => {
    const c = createCard(p);
    // make cards keyboard focusable for accessibility
    c.setAttribute('tabindex', '0');
    gridElement.appendChild(c);
  });
}
