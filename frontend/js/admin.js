import { renderProfile } from './profile.js';
import { checkSession, logout } from './admin/session.js';
import { loadProfiles, deleteProfile } from './admin/list.js';
import { selectProfile, createNewProfile, clearEditor, initializePhotoUploader } from './admin/editor.js';
import { handleProfileSubmit } from './admin/form.js';

/*
  admin.js � M�dulo principal del panel de administraci�n.  
  Importa subm�dulos para mantener cada responsabilidad aislada.
*/

// expose functions globals needed by other modules/HTML handlers
window.logout = logout;
window.selectProfile = selectProfile;
window.deleteProfile = deleteProfile;
window.clearEditor = clearEditor;
window.createNewProfile = createNewProfile;
// profile preview helper used inside editor.js
window.renderProfile = renderProfile;

function bindGlobalButtons() {
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
  const btnAdd = document.getElementById('btn-add-profile');
  if (btnAdd) {
    btnAdd.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('bot�n +Nuevo clickeado');
      createNewProfile();
    });
  }
}

// navigation guard (same as before)
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.href && !link.href.includes('#') && !link.href.includes('logout')) {
    const href = link.getAttribute('href');
    if (href && (href === 'index.html' || (href.endsWith('.html') && !href.includes('admin') && !href.includes('login')))) {
      e.preventDefault();
      alert('Debes cerrar sesion para salir del panel');
      return false;
    }
  }
}, true);

// inicializaci�n general

document.addEventListener('DOMContentLoaded', () => {
  console.log('Iniciando panel...');

  bindGlobalButtons();

  if (!checkSession()) {
    return;
  }

  loadProfiles();

  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileSubmit);
  }

  initializePhotoUploader();

  console.log('Panel listo');
});
