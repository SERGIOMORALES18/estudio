/**
 * profile.js — render de la página `profile.html`
 * - Lee `id` de la query string, carga perfiles y muestra el detalle.
 */

import { getProfiles } from './api.js';

function getIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return id ? Number(id) : null;
}

function renderProfile(profile) {
  const container = document.getElementById('profile-detail');
  if (!profile) {
    container.innerHTML = '<p>Perfil no encontrado.</p>';
    return;
  }

  container.innerHTML = `
    <article class="profile-full" style="background:var(--card-bg);padding:1.2rem;border-radius:12px;">
      <h1 style="margin:0 0 .6rem;">${profile.alias} — <small style="font-weight:400">${profile.age}</small></h1>
      <p style="color:var(--muted);margin:0 0.6rem 1rem;">${profile.city} • ${profile.tags?.join(' • ') || ''}</p>
      <div class="gallery" style="display:flex;gap:.6rem;flex-wrap:wrap;">
        ${profile.photos?.map(url => `<img src="${url}" alt="${profile.alias}" style="width:280px;height:360px;object-fit:cover;border-radius:8px;">`).join('')}
      </div>
      <div style="margin-top:1rem;color:#f3f1f0;">
        <h3>Descripción</h3>
        <p>${profile.description || 'Descripción no disponible.'}</p>
      </div>
    </article>
  `;
}

async function init() {
  const id = getIdFromQuery();
  try {
    const profiles = await getProfiles();
    const profile = profiles.find(p => p.id === id);
    renderProfile(profile);
  } catch (err) {
    document.getElementById('profile-detail').innerHTML = '<p>Error cargando perfil.</p>';
    console.error(err);
  }
}

window.addEventListener('DOMContentLoaded', init);
