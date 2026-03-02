/*
  list.js — carga y renderizado de la lista lateral de perfiles en el panel admin.
  Provee también la función `deleteProfile` porque trabaja directamente con la lista.
*/

let allProfiles = [];
let currentProfileId = null;

export async function loadProfiles() {
  try {
    const response = await fetch('/api/profiles');
    if (!response.ok) throw new Error('Error cargando perfiles');
    allProfiles = await response.json();
    renderProfilesList();
    console.log('Cargados ' + allProfiles.length + ' perfiles');
  } catch (error) {
    console.error('Error:', error);
  }
}

export function getAllProfiles() {
  return allProfiles;
}

export function renderProfilesList() {
  const container = document.getElementById('profiles-list');
  
  if (!allProfiles || allProfiles.length === 0) {
    container.innerHTML = '<p style="color: #888; text-align: center; padding: 2rem;">No hay perfiles. Crea uno.</p>';
    return;
  }

  let html = '';
  allProfiles.forEach((profile) => {
    const thumbImg = profile.photos && profile.photos[0] ? '<img src="' + profile.photos[0] + '" alt="' + profile.alias + '" />' : 'Foto';
    const active = profile.id === currentProfileId ? 'active' : '';
    
    html += '<div class="profile-list-item ' + active + '" onclick="selectProfile(' + profile.id + ')" data-profile-id="' + profile.id + '">' +
           '<div class="profile-list-item-thumb">' + thumbImg + '</div>' +
           '<div class="profile-list-item-name">' + (profile.alias || 'Sin nombre') + '</div>' +
           '<div class="profile-list-item-meta">' + profile.age + ' anios, ' + profile.city + '</div>' +
           '<button onclick="deleteProfile(' + profile.id + '); event.stopPropagation();" style="width: 100%; margin-top: 0.5rem; padding: 0.4rem; background: rgba(195,26,26,0.2); border: 1px solid #c31a1a; color: #c31a1a; border-radius: 3px; font-size: 0.7rem; cursor: pointer;">Borrar</button>' +
           '</div>';
  });
  
  container.innerHTML = html;
}

export async function deleteProfile(profileId) {
  if (!confirm('Eliminar este perfil? Esta accion no se puede deshacer.')) {
    return;
  }

  try {
    const response = await fetch('/api/profiles/' + profileId, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error');

    const profile = allProfiles.find(p => p.id === profileId);
    alert('Perfil "' + profile.alias + '" eliminado');

    await loadProfiles();
    // limpiar editor en quien esté abierto (función exportada de editor.js)
    if (typeof window.clearEditor === 'function') {
      window.clearEditor();
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error al eliminar');
  }
}

// expone también utilidad para marcar qué perfil está activo
export function setCurrentProfile(id) {
  currentProfileId = id;
}
