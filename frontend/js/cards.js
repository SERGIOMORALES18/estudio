/**
 * ============================================================================
 * cards.js — Creación y renderizado de tarjetas de perfil
 * ============================================================================
 * 
 * Responsabilidades:
 * 1. Crear estructura HTML de tarjetas (frente/reverso)
 * 2. Implementar animación de flip (voltear tarjeta)
 * 3. Renderizar lista de tarjetas en el grid
 * 
 * Características:
 * - Animación 3D flip con múltiples rotaciones
 * - Hover states (overlay con info, elevación)
 * - Usuario puede hacer click para voltear la tarjeta
 * - Link "Ver más" abre perfil completo en nueva pestaña
 * - Accesible vía teclado (tabindex)
 * 
 * ============================================================================
 */

/**
 * createCard(profile)
 * @param {Object} profile - Objeto perfil con id, alias, age, city, tags, photos, description
 * @returns {HTMLElement} Elemento <article> con estructura de tarjeta
 * 
 * Estructura creada:
 * <article class="profile-card">
 *   <div class="card-inner"> (contenedor 3D)
 *     <div class="card-front"> (frente con foto e info)
 *     <div class="card-back">  (reverso con descripción y botón)
 * 
 * Comportamiento interactivo:
 * - Click en tarjeta: anima el flip
 * - Click en "Ver más": abre profile.html en nueva pestaña
 */
export function createCard(profile) {
  const card = document.createElement('article');
  card.className = 'profile-card';
  card.dataset.id = profile.id;
  card.setAttribute('tabindex', '0');

  // determine badges (heart, diamond, whiteheart) mapping
  const ICON_MAP = {
    heart: '♥',
    diamond: '♦',
    whiteheart: '♡'
  };
  const badgesHTML = (profile.badges || []).map(b => {
    const icon = ICON_MAP[b] || '';
    return icon ? `<span class="badge">${icon}</span>` : '';
  }).join('');

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        ${badgesHTML ? `<div class="card-badges">${badgesHTML}</div>` : ''}
        <img 
          class="profile-photo" 
          src="${profile.photos?.[0] || ''}" 
          alt="${profile.alias}"
        >
        <div class="meta-overlay">
          <h3 class="name-age">${profile.alias}, ${profile.age}</h3>
          <p class="meta-details">
            ${profile.city} • ${profile.tags?.slice(0, 2).join(' • ') || 'Sin tags'}
          </p>
        </div>
      </div>
      <div class="card-back">
        <div class="back-content">
          <p class="description">
            ${profile.description || 'Descripción no disponible.'}
          </p>
          <a 
            class="btn-more" 
            href="profile.html?id=${profile.id}" 
            target="_blank" 
            rel="noopener"
          >
            Ver más
          </a>
        </div>
      </div>
    </div>
  `;

  // ========== LÓGICA DE FLIP ==========
  // Permitir voltear tarjeta con click
  // El link "Ver más" es clickable sin activar el flip
  card.addEventListener('click', (event) => {
    // Si el usuario clickea en "Ver más", dejar que se abra la pestaña
    if (event.target.closest('.btn-more')) {
      return;
    }

    const inner = card.querySelector('.card-inner');

    if (card.classList.contains('is-flipped')) {
      // Voltear hacia atrás (frente): múltiples rotaciones
      inner.classList.add('multiflip-back');
      const handler = function () {
        inner.classList.remove('multiflip-back');
        card.classList.remove('is-flipped');
        inner.removeEventListener('animationend', handler);
      };
      inner.addEventListener('animationend', handler);
    } else {
      // Voltear hacia adelante (reverso): múltiples rotaciones
      inner.classList.add('multiflip');
      const handler = function () {
        inner.classList.remove('multiflip');
        card.classList.add('is-flipped');
        inner.removeEventListener('animationend', handler);
      };
      inner.addEventListener('animationend', handler);
    }
  });

  return card;
}

/**
 * renderProfiles(profiles, gridElement)
 * @param {Array} profiles - Array de objetos perfil a renderizar
 * @param {HTMLElement} gridElement - Elemento contenedor (grid) donde agregar tarjetas
 * 
 * Proceso:
 * 1. Limpia el grid anterior
 * 2. Crea tarjetas para hasta 15 perfiles
 * 3. Agrega cada tarjeta al grid
 * 4. Hace tarjetas navegables por teclado
 */
export function renderProfiles(profiles, gridElement) {
  // Limpiar tarjetas anteriores
  gridElement.innerHTML = '';

  // Limitar a 15 tarjetas para rendimiento
  profiles.slice(0, 15).forEach((profile) => {
    const card = createCard(profile);
    gridElement.appendChild(card);
  });
}
