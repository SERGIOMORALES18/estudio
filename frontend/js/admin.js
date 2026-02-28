/*
  ============================================================================
  admin.js — Panel de administración con editor en tiempo real
  ============================================================================
  Features:
  - Protección de rutas (no salir sin cerrar sesión)
  - Editor en tiempo real con preview
  - 15 tarjetas de perfiles en sidebar
  - CRUD completo (Create, Edit, Delete)
  ============================================================================
*/

const SESSION_CONFIG = {
  storageKey: 'velvet_admin_session',
  userKey: 'velvet_admin_user',
  timeKey: 'velvet_admin_time',
  durationHours: 24
};

let selectedPhotoBase64 = '';
let currentProfileId = null;
let allProfiles = [];

// ============================================================================
// PROTECCIÓN DE RUTAS
// ============================================================================

function checkSession() {
  const session = localStorage.getItem(SESSION_CONFIG.storageKey);
  const sessionTime = localStorage.getItem(SESSION_CONFIG.timeKey);
  const user = localStorage.getItem(SESSION_CONFIG.userKey);

  if (!session || !sessionTime || !user) {
    console.warn('Sesion no encontrada');
    window.location.href = 'login.html';
    return false;
  }

  const timeDiff = new Date().getTime() - parseInt(sessionTime);
  const hoursElapsed = timeDiff / (1000 * 60 * 60);

  if (hoursElapsed < SESSION_CONFIG.durationHours) {
    console.log('Sesion valida para: ' + user);
    return true;
  }

  console.warn('Sesion expirada');
  clearSession();
  window.location.href = 'login.html';
  return false;
}

function clearSession() {
  localStorage.removeItem(SESSION_CONFIG.storageKey);
  localStorage.removeItem(SESSION_CONFIG.userKey);
  localStorage.removeItem(SESSION_CONFIG.timeKey);
  console.log('Sesion limpiada');
}

function logout() {
  clearSession();
  window.location.href = 'index.html';
}

// Proteger navegacion a otras paginas
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

// ============================================================================
// CARGAR Y RENDERIZAR PERFILES
// ============================================================================

async function loadProfiles() {
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

function renderProfilesList() {
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

// ============================================================================
// SELECCIONAR PERFIL PARA EDITAR
// ============================================================================

function selectProfile(profileId) {
  const profile = allProfiles.find(p => p.id === profileId);
  if (!profile) return;

  currentProfileId = profileId;
  selectedPhotoBase64 = '';

  document.querySelectorAll('.profile-list-item').forEach(el => {
    el.classList.remove('active');
  });
  document.querySelector('[data-profile-id="' + profileId + '"]').classList.add('active');

  showEditorContent();
  loadProfileForm(profile);
  updatePreview(profile);

  console.log('Seleccionado: ' + profile.alias);
}

function loadProfileForm(profile) {
  document.getElementById('profile-id').value = profile.id || '';
  document.getElementById('form-alias').value = profile.alias || '';
  document.getElementById('form-age').value = profile.age || '';
  document.getElementById('form-city').value = profile.city || '';
  document.getElementById('form-description').value = profile.description || '';
  document.getElementById('form-price').value = profile.price70 || '';

  if (profile.photos && profile.photos[0]) {
    selectedPhotoBase64 = profile.photos[0];
    document.getElementById('photo-upload-preview').innerHTML = '<img src="' + profile.photos[0] + '" alt="' + profile.alias + '" />';
  } else {
    document.getElementById('photo-upload-preview').innerHTML = '';
  }
}

function showEditorContent() {
  document.getElementById('editor-content').style.display = 'grid';
  document.getElementById('editor-title').textContent = 'Editar Perfil';
  document.getElementById('editor-subtitle').textContent = '';
}

function updatePreview(profile) {
  document.getElementById('preview-alias').textContent = profile.alias || 'Alias';
  document.getElementById('preview-details').textContent = (profile.age || '--') + ' anios en ' + (profile.city || 'N/A');
  document.getElementById('preview-price').textContent = profile.price70 ? '$' + profile.price70 + '/70 min' : 'S/D';
  document.getElementById('preview-description').textContent = profile.description || 'Sin descripcion';

  const photoDiv = document.getElementById('preview-photo');
  if (profile.photos && profile.photos[0]) {
    photoDiv.innerHTML = '<img src="' + profile.photos[0] + '" alt="' + profile.alias + '" />';
  } else {
    photoDiv.innerHTML = 'Foto';
  }
}

// ============================================================================
// MANEJO DE FOTO
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const formPhotoInput = document.getElementById('form-photo');
  const photoPreview = document.getElementById('photo-upload-preview');

  if (formPhotoInput) {
    formPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          selectedPhotoBase64 = event.target.result;
          photoPreview.innerHTML = '<img src="' + selectedPhotoBase64 + '" alt="Preview" />';
          
          if (currentProfileId) {
            document.getElementById('preview-photo').innerHTML = '<img src="' + selectedPhotoBase64 + '" alt="Preview" />';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Actualizar preview en tiempo real
  const form = document.getElementById('profile-form');
  if (form) {
    form.addEventListener('input', () => {
      if (currentProfileId) {
        const previewData = {
          alias: document.getElementById('form-alias').value || 'Alias',
          age: document.getElementById('form-age').value,
          city: document.getElementById('form-city').value,
          price70: document.getElementById('form-price').value,
          description: document.getElementById('form-description').value,
          photos: selectedPhotoBase64 ? [selectedPhotoBase64] : []
        };
        updatePreview(previewData);
      }
    });
  }
});

// ============================================================================
// CREAR NUEVO PERFIL
// ============================================================================

function createNewProfile() {
  currentProfileId = null;
  selectedPhotoBase64 = '';
  
  document.getElementById('profile-form').reset();
  document.getElementById('photo-upload-preview').innerHTML = '';

  showEditorContent();
  document.getElementById('editor-title').textContent = 'Crear Nuevo Perfil';
  document.getElementById('editor-subtitle').textContent = 'Completa los datos y sube una foto';

  updatePreview({
    alias: 'Nuevo perfil',
    age: '',
    city: '',
    price70: '',
    description: '',
    photos: []
  });

  document.querySelectorAll('.profile-list-item').forEach(el => {
    el.classList.remove('active');
  });
}

function clearEditor() {
  currentProfileId = null;
  document.getElementById('editor-content').style.display = 'none';
  document.getElementById('editor-title').textContent = 'Selecciona un perfil para editar';
  document.getElementById('editor-subtitle').textContent = '';
  document.getElementById('profile-form').reset();
  document.getElementById('photo-upload-preview').innerHTML = '';
  document.querySelectorAll('.profile-list-item').forEach(el => {
    el.classList.remove('active');
  });
}

// ============================================================================
// GUARDAR PERFIL (CREATE o UPDATE)
// ============================================================================

async function handleProfileSubmit(e) {
  e.preventDefault();

  const alias = document.getElementById('form-alias').value.trim();
  const age = parseInt(document.getElementById('form-age').value) || 0;
  const city = document.getElementById('form-city').value.trim();
  const description = document.getElementById('form-description').value.trim();
  const price70 = parseFloat(document.getElementById('form-price').value) || 0;

  if (!alias || !age || !city) {
    alert('Completa los campos: Alias, Edad, Ciudad');
    return;
  }

  const photos = selectedPhotoBase64 ? [selectedPhotoBase64] : [];

  const profileData = {
    alias: alias,
    age: age,
    city: city,
    description: description,
    price70: price70,
    photos: photos,
    tags: [],
    extras: [],
    hobbies: '',
    special: '',
    unique: ''
  };

  try {
    const method = currentProfileId ? 'PUT' : 'POST';
    const url = currentProfileId ? '/api/profiles/' + currentProfileId : '/api/profiles';

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) throw new Error('Error guardando');

    const result = await response.json();
    alert('Perfil "' + alias + '" ' + (currentProfileId ? 'actualizado' : 'creado'));

    await loadProfiles();
    clearEditor();
  } catch (err) {
    console.error('Error:', err);
    alert('Error al guardar');
  }
}

// ============================================================================
// ELIMINAR PERFIL
// ============================================================================

async function deleteProfile(profileId) {
  if (!confirm('Eliminar este perfil? Esta accion no se puede deshacer.')) {
    return;
  }

  try {
    const response = await fetch('/api/profiles/' + profileId, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error');

    const profile = allProfiles.find(p => p.id === profileId);
    alert('Perfil "' + profile.alias + '" eliminado');

    await loadProfiles();
    clearEditor();
  } catch (err) {
    console.error('Error:', err);
    alert('Error al eliminar');
  }
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Iniciando panel...');

  if (!checkSession()) {
    return;
  }

  loadProfiles();

  const btnAddProfile = document.getElementById('btn-add-profile');
  if (btnAddProfile) {
    btnAddProfile.addEventListener('click', (e) => {
      e.preventDefault();
      createNewProfile();
    });
  }

  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileSubmit);
  }

  window.logout = logout;
  window.selectProfile = selectProfile;
  window.deleteProfile = deleteProfile;
  window.clearEditor = clearEditor;

  console.log('Panel listo');
});
