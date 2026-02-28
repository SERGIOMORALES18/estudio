/**
 * ============================================================================
 * profile.js — Página de detalle individual de perfil
 * ============================================================================
 * 
 * Se ejecuta en profile.html y:
 * 1. Lee el ID del perfil de la query string (?id=...)
 * 2. Obtiene los perfiles desde la API
 * 3. Busca el perfil coincidente
 * 4. Renderiza la galería completa y descripción
 * 
 * Estructura de URL: profile.html?id=1
 * 
 * ============================================================================
 */

import { getProfiles } from './api.js';
import { spawnFallingCard } from './animations.js';


/**
 * getIdFromQuery()
 * @returns {number|null} ID del perfil desde la query string o null
 * 
 * Lee el parámetro ?id=X de la URL actual.
 * Convierte el valor a número o retorna null si no existe.
 */
function getIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return id ? Number(id) : null;
}

/**
 * renderProfile(profile)
 * @param {Object|null} profile - Objeto perfil con todos sus datos
 * 
 * Renderiza la página de detalle del perfil:
 * - Nombre, edad, ciudad
 * - Galería con todas las fotos
 * - Descripción completa
 * - Tags/información adicional
 */
function renderProfile(profile) {
  const container = document.getElementById('profile-detail');

  // ajustar texto del enlace de regreso con la ciudad actual
  const backLink = document.querySelector('.back-link');
  if (backLink && profile.city) {
    backLink.textContent = `← Regresar a ${profile.city}`;
    // opcional: si hay filtrado por ciudad podríamos añadir un query
  }

  if (!profile) {
    container.innerHTML = '<p>Perfil no encontrado.</p>';
    return;
  }

  /* hero con imagen de fondo y enlace de regreso dentro */
  const hero = `
    <div class="profile-hero" style="background-image:url('${profile.photos?.[0] || ''}')">
      <a href="index.html" class="back-link">← Regresar a ${profile.city || 'perfiles'}</a>
      <div class="profile-hero-overlay">
        <h1 class="profile-name">${profile.alias}</h1>
        <div class="profile-meta">
          <span class="meta-item location">${profile.city}</span>
          <span class="meta-item age">${profile.age} años</span>
          ${profile.profession ? `<span class="meta-item profession">${profile.profession}</span>` : ''}
        </div>
      </div>
    </div>
  `;

  /* navegación interna */
  const nav = `
    <nav class="profile-nav">
      <a href="#about">Sobre mí</a>
      <a href="#photos">Fotos</a>
      <a href="#details">Perfil y gustos</a>
      <a href="#price">Precio</a>
      <a href="#reviews">Reviews</a>
    </nav>
  `;

  /* sección "Sobre mí" */
  const aboutSection = `
    <section id="about" class="profile-section">
      <h2>Sobre mí</h2>
      <p>${profile.description || 'Descripción no disponible.'}</p>
    </section>
  `;

  /* fotos */
  const photosSection = `
    <section id="photos" class="profile-section gallery-section">
      <h2>Fotos</h2>
      <div class="photo-grid">
        ${profile.photos?.map(url => `<img src="${url}" alt="${profile.alias}" />`).join('')}
      </div>
    </section>
  `;

  /* detalles y extras */
  function renderDetailsTable(p) {
    const rows = [
      ['Procedencia', p.city],
      ['Disponibilidad', p.availability || '---'],
      ['Edad', p.age],
      ['Nivel de Inglés', p.englishLevel || '---'],
      ['Experiencia', p.experience || '---'],
      ['Profesión', p.profession || '---'],
      ['Estatura', p.height || '---'],
      ['Contextura', p.build || '---'],
      ['Tipo de busto', p.bustType || '---'],
      ['Tipo de cirugía', p.surgery || '---'],
      ['Color de piel', p.skinColor || '---'],
      ['Color de cabello', p.hairColor || '---'],
      ['Color de ojos', p.eyeColor || '---'],
      ['Tamaño de cola', p.buttSize || '---'],
      ['Tiene tatuajes', p.tattoos || '---'],
      ['Tiene brackets', p.braces || '---']
    ];
    return `
      <table class="details-table">
        ${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}
      </table>
    `;
  }

  const extrasList = profile.extras
    ? `<ul class="extras-list">${profile.extras.map(e => `<li>${e}</li>`).join('')}</ul>`
    : '';

  const detailsSection = `
    <section id="details" class="profile-section">
      <h2>Perfil y Gustos</h2>
      <div class="details-container">
        <div class="details-left">
          ${renderDetailsTable(profile)}
        </div>
        <div class="details-right">
          <h3>Servicios adicionales (costo extra)</h3>
          ${extrasList}
        </div>
      </div>
      <div class="profile-hobbies">
        <h3>Gustos y hobbies</h3>
        <p>${profile.hobbies || ''}</p>
      </div>
      <div class="profile-special">
        <h3>Qué me hace especial</h3>
        <p>${profile.special || ''}</p>
      </div>
      <div class="profile-unique">
        <h3>Algo único que encontrarás en mí</h3>
        <p>${profile.unique || ''}</p>
      </div>
    </section>
  `;

  const priceSection = `
    <section id="price" class="profile-section price-section">
      <h2>Precio</h2>
      <div class="price-block">
        <div class="price-name">${profile.alias}</div>
        <div class="price-label">precio por 70 min</div>
        <div class="price-amount-wrapper">
          <span class="price-currency">$</span>
          <span class="price-amount">${profile.price70 ? profile.price70 : '---'}</span>
        </div>
        <div class="price-duration">COP por 70&nbsp;min</div>
      </div>
      <a href="https://wa.me/573203226262?text=Hola%20quiero%20informaci%C3%B3n%20de%20${encodeURIComponent(profile.alias)}" target="_blank" class="whatsapp-btn">📲 Reservar por WhatsApp</a>
    </section>
  `;

  // renderizado de reseñas si existen
  function renderStars(rating, max = 5) {
    let stars = '';
    for (let i = 1; i <= max; i++) {
      stars += `<span class="star${i <= rating ? '' : ' empty'}">★</span>`;
    }
    return stars;
  }

  function renderReviews(reviews) {
    if (!reviews || reviews.length === 0) {
      return `
        <section id="reviews" class="profile-section reviews-section">
          <h2>Reviews</h2>
          <p>No hay reviews todavía.</p>
        </section>
      `;
    }
    let html = `
      <section id="reviews" class="profile-section reviews-section">
        <h2>
          <span class="review-count">${reviews.length} REVIEW${reviews.length > 1 ? 'S' : ''}</span>
          <a href="#write-review" class="write-review">✏️ Escribe una valoración</a>
        </h2>
    `;

    reviews.forEach((r) => {
      html += `
        <div class="review-card">
          <div class="review-header">
            <img src="${r.avatar || 'https://via.placeholder.com/48?text=?'}" alt="${r.author}" class="review-avatar" />
            <div class="review-author">${r.author}</div>
          </div>
          <div class="review-ratings">
            <div class="rating-item">Presentación ${renderStars(r.presentation)}</div>
            <div class="rating-item">Atención ${renderStars(r.attention)}</div>
            <div class="rating-item">Se parece a la fotografía? ${renderStars(r.photoAccuracy)}</div>
          </div>
          <div class="review-text">${r.text || ''}</div>
          <div class="review-footer">
            ${r.recommendation ? `<div class="review-recommend">${r.recommendationLabel || ''} ${r.recommendation}</div>` : ''}
            <div class="review-votes">👍${r.thumbsUp || 0} 👎${r.thumbsDown || 0}</div>
          </div>
        </div>
      `;
    });

    html += `</section>`;
    return html;
  }

  const reviewsSection = renderReviews(profile.reviews);

  // ensamblar todo
  container.innerHTML = `
    ${hero}
    ${nav}
    <div class="profile-content">
      ${aboutSection}
      ${photosSection}
      ${detailsSection}
      ${priceSection}
      ${reviewsSection}
    </div>
  `;

  // agregar animación fade-in a cada sección con pequeño delay
  const sections = container.querySelectorAll('.profile-section');
  sections.forEach((sec, idx) => {
    sec.style.animationDelay = `${idx * 0.12}s`;
    sec.classList.add('fade-in');
  });

  // efectos decorativos: dejar caer tarjetas cada tanto
  const fallingContainer = document.body;
  if (profile) {
    setInterval(() => spawnFallingCard(fallingContainer, profile), 3000);
  }

  // configurar galería para abrir imágenes en modal
  const modal = document.getElementById('photo-modal');
  const modalImg = modal.querySelector('img');
  const closeBtn = modal.querySelector('.close-btn');

  const photoImgs = Array.from(container.querySelectorAll('.photo-grid img'));
  const photoUrls = profile.photos || [];
  let currentIndex = 0;

  function openModalAt(idx) {
    if (idx < 0 || idx >= photoUrls.length) return;
    currentIndex = idx;
    modalImg.src = photoUrls[idx];
    modalImg.alt = photoImgs[idx].alt || '';
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
  }

  photoImgs.forEach((img, idx) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openModalAt(idx));
  });

  // cerrar modal / navegar
  function closeModal() {
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
  }

  function showNext() {
    openModalAt((currentIndex + 1) % photoUrls.length);
  }
  function showPrev() {
    openModalAt((currentIndex - 1 + photoUrls.length) % photoUrls.length);
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      // divide el clic en mitades para navegar
      const x = e.clientX;
      if (x < window.innerWidth / 2) {
        showPrev();
      } else {
        showNext();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('visible')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/**
 * init()
 * Función principal que:
 * 1. Obtiene el ID de la URL
 * 2. Carga todos los perfiles
 * 3. Encuentra el perfil coincidente
 * 4. Renderiza la página
 */
async function init() {
  const profileId = getIdFromQuery();

  try {
    const profiles = await getProfiles();
    const profile = profiles.find((p) => p.id === profileId);
    renderProfile(profile);
  } catch (error) {
    console.error('Error cargando perfil:', error);
    document.getElementById('profile-detail').innerHTML =
      '<p>Error al cargar el perfil.</p>';
  }
}

// ========== PUNTO DE ENTRADA ==========
window.addEventListener('DOMContentLoaded', init);
