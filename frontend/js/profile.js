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

  if (!profile) {
    container.innerHTML = '<p>Perfil no encontrado.</p>';
    return;
  }

  // ========== GALERÍA DE FOTOS ==========
  const photoGallery = (profile.photos || [])
    .map(
      (url) =>
        `<img 
          src="${url}" 
          alt="${profile.alias}" 
          style="width:280px;height:360px;object-fit:cover;border-radius:8px;"
        />`
    )
    .join('');

  // ========== TAGS/INFORMACIÓN ==========
  const tagsDisplay = profile.tags?.join(' • ') || 'Sin categorías';

  // ========== HTML RENDERIZADO ==========
  container.innerHTML = `
    <article class="profile-full" style="background:var(--card-bg);padding:1.2rem;border-radius:12px;">
      <!-- Encabezado: nombre y edad -->
      <h1 style="margin:0 0 .6rem;">
        ${profile.alias} — 
        <small style="font-weight:400">${profile.age}</small>
      </h1>

      <!-- Ciudad y categorías -->
      <p style="color:var(--muted);margin:0 0.6rem 1rem;">
        ${profile.city} • ${tagsDisplay}
      </p>

      <!-- Galería de fotos -->
      <div class="gallery" style="display:flex;gap:.6rem;flex-wrap:wrap;">
        ${photoGallery}
      </div>

      <!-- Descripción completa -->
      <div style="margin-top:1rem;color:#f3f1f0;">
        <h3>Descripción</h3>
        <p>${profile.description || 'Descripción no disponible.'}</p>
      </div>
    </article>
  `;
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
