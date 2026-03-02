import { renderProfile } from './profile.js';

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

// when we upload images we keep an array; initially empty
let selectedPhotoBase64 = '';
let selectedPhotosBase64 = []; // array of base64 strings for all chosen files
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
  console.log('→ redirigiendo a inicio después de logout');
  window.location.href = 'index.html';
}

// Proteger navegacion a otras paginas

// fijar accesos globales básicos incluso antes de la comprobación de sesión
window.logout = logout;
window.selectProfile = selectProfile;
window.deleteProfile = deleteProfile;
window.clearEditor = clearEditor;

// también vamos a exponer createNewProfile para que pueda invocarse desde otras
// partes si es necesario (e.g. tests manuales)
window.createNewProfile = createNewProfile;

// registro de eventos simples que no dependen de la sesión
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
      console.log('botón +Nuevo clickeado');
      createNewProfile();
    });
  }
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

  console.log('Seleccionado: ' + profile.alias);
}

function loadProfileForm(profile) {
  document.getElementById('profile-id').value = profile.id || '';
  document.getElementById('form-alias').value = profile.alias || '';
  document.getElementById('form-age').value = profile.age || '';
  document.getElementById('form-city').value = profile.city || '';
  document.getElementById('form-description').value = profile.description || '';
  document.getElementById('form-price').value = profile.price70 || '';
  document.getElementById('form-price-unit').value = profile.price_unit || '';
  document.getElementById('form-availability').value = profile.availability || '';
  document.getElementById('form-english').value = profile.english_level || '';
  document.getElementById('form-experience').value = profile.experience || '';
  document.getElementById('form-profession').value = profile.profession || '';
  document.getElementById('form-height').value = profile.height || '';
  document.getElementById('form-build').value = profile.build || '';
  document.getElementById('form-bust-type').value = profile.bust_type || '';
  document.getElementById('form-surgery').value = profile.surgery || '';
  document.getElementById('form-skin-color').value = profile.skin_color || '';
  document.getElementById('form-hair-color').value = profile.hair_color || '';
  document.getElementById('form-eye-color').value = profile.eye_color || '';
  document.getElementById('form-butt-size').value = profile.butt_size || '';
  document.getElementById('form-tattoos').value = profile.tattoos || '';
  document.getElementById('form-braces').value = profile.braces || '';
  document.getElementById('form-hobbies').value = profile.hobbies || '';
  document.getElementById('form-special').value = profile.special || '';
  document.getElementById('form-unique').value = profile.unique_trait || '';
  document.getElementById('form-tags').value = (profile.tags || []).join(', ');
  document.getElementById('form-extras').value = (profile.extras || []).join(', ');

  // refresh preview panel with loaded data
  updatePreview(profile);

  // populate preview using every photo we have stored
  if (profile.photos && profile.photos.length) {
    selectedPhotosBase64 = profile.photos.slice();
    selectedPhotoBase64 = profile.photos[0] || '';
    const container = document.getElementById('photo-upload-preview');
    container.innerHTML = profile.photos.map(p => '<img src="' + p + '" alt="' + (profile.alias||'') + '" />').join('');
  } else {
    selectedPhotosBase64 = [];
    selectedPhotoBase64 = '';
    document.getElementById('photo-upload-preview').innerHTML = '';
  }
}

function showEditorContent() {
  document.getElementById('editor-content').style.display = 'grid';
  document.getElementById('editor-title').textContent = 'Editar Perfil';
  document.getElementById('editor-subtitle').textContent = '';
}

// ============================================================================
// PREVIEW HELPERS
// ============================================================================

// construye un objeto profile simplificado a partir de los valores del formulario
function buildProfileFromForm() {
  return {
    alias: document.getElementById('form-alias').value.trim(),
    city: document.getElementById('form-city').value.trim(),
    age: parseInt(document.getElementById('form-age').value) || null,
    description: document.getElementById('form-description').value.trim(),
    price70: parseFloat(document.getElementById('form-price').value) || 0,
    price_unit: document.getElementById('form-price-unit').value.trim(),
    availability: document.getElementById('form-availability').value.trim(),
    englishLevel: parseInt(document.getElementById('form-english').value) || null,
    experience: document.getElementById('form-experience').value.trim(),
    profession: document.getElementById('form-profession').value.trim(),
    height: document.getElementById('form-height').value.trim(),
    build: document.getElementById('form-build').value.trim(),
    bustType: document.getElementById('form-bust-type').value.trim(),
    surgery: document.getElementById('form-surgery').value.trim(),
    skinColor: document.getElementById('form-skin-color').value.trim(),
    hairColor: document.getElementById('form-hair-color').value.trim(),
    eyeColor: document.getElementById('form-eye-color').value.trim(),
    buttSize: document.getElementById('form-butt-size').value.trim(),
    tattoos: document.getElementById('form-tattoos').value.trim(),
    braces: document.getElementById('form-braces').value.trim(),
    hobbies: document.getElementById('form-hobbies').value.trim(),
    special: document.getElementById('form-special').value.trim(),
    unique: document.getElementById('form-unique').value.trim(),
    tags: document.getElementById('form-tags').value.split(',').map(s=>s.trim()).filter(Boolean),
    extras: document.getElementById('form-extras').value.split(',').map(s=>s.trim()).filter(Boolean),
    photos: selectedPhotosBase64.slice() // copy current upload array
  };
}

function updatePreview(profile) {
  const panel = document.getElementById('editor-preview-panel');
  if (!panel) return;
  panel.innerHTML = '<h3>Vista previa</h3>';
  const inner = document.createElement('div');
  inner.id = 'admin-preview-inner';
  panel.appendChild(inner);

  let p = profile;
  if (!p) {
    p = buildProfileFromForm();
  }
  if (!p.alias) {
    inner.innerHTML = '<p>Rellena el formulario para ver cómo quedará.</p>';
    return;
  }
  renderProfile(p, inner);
}

// invoke preview update on input changes
function attachPreviewListeners() {
  const fields = document.querySelectorAll('#profile-form input, #profile-form textarea');
  fields.forEach((el) => {
    el.addEventListener('input', () => updatePreview());
  });
}

// ============================================================================
// MANEJO DE FOTO
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const formPhotoInput = document.getElementById('form-photo');
  const photoPreview = document.getElementById('photo-upload-preview');

  if (formPhotoInput) {
    formPhotoInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      selectedPhotosBase64 = [];
      photoPreview.innerHTML = '';

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          selectedPhotosBase64.push(event.target.result);
          // always keep first element also available for legacy logic
          selectedPhotoBase64 = selectedPhotosBase64[0] || '';
          photoPreview.innerHTML += '<img src="' + event.target.result + '" alt="Preview" />';
          updatePreview();
        };
        reader.readAsDataURL(file);
      });
    });
  }
  attachPreviewListeners();
});

// ============================================================================
// CREAR NUEVO PERFIL
// ============================================================================

function createNewProfile() {
  console.log('createNewProfile invoked');
  currentProfileId = null;
  selectedPhotoBase64 = '';

  document.getElementById('profile-form').reset();
  document.getElementById('photo-upload-preview').innerHTML = '';
  updatePreview();

  showEditorContent();
  document.getElementById('editor-title').textContent = 'Crear Nuevo Perfil';
  document.getElementById('editor-subtitle').textContent = 'Completa los datos y sube una foto';

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
  updatePreview();
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
  const priceUnit = document.getElementById('form-price-unit').value.trim();
  const availability = document.getElementById('form-availability').value.trim();
  const english_level = parseInt(document.getElementById('form-english').value) || null;
  const experience = document.getElementById('form-experience').value.trim();
  const profession = document.getElementById('form-profession').value.trim();
  const height = document.getElementById('form-height').value.trim();
  const build = document.getElementById('form-build').value.trim();
  const bust_type = document.getElementById('form-bust-type').value.trim();
  const surgery = document.getElementById('form-surgery').value.trim();
  const skin_color = document.getElementById('form-skin-color').value.trim();
  const hair_color = document.getElementById('form-hair-color').value.trim();
  const eye_color = document.getElementById('form-eye-color').value.trim();
  const butt_size = document.getElementById('form-butt-size').value.trim();
  const tattoos = document.getElementById('form-tattoos').value.trim();
  const braces = document.getElementById('form-braces').value.trim();
  const hobbies = document.getElementById('form-hobbies').value.trim();
  const special = document.getElementById('form-special').value.trim();
  const unique_trait = document.getElementById('form-unique').value.trim();

  if (!alias || !age || !city) {
    alert('Completa los campos: Alias, Edad, Ciudad');
    return;
  }

  const tags = document.getElementById('form-tags').value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const extras = document.getElementById('form-extras').value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // ahora usamos FormData para enviar archivos en lugar de JSON grande
  const formData = new FormData();
  formData.append('alias', alias);
  formData.append('age', age);
  formData.append('city', city);
  formData.append('description', description);
  formData.append('price70', price70);
  formData.append('price_unit', priceUnit);
  formData.append('availability', availability);
  formData.append('english_level', english_level);
  formData.append('experience', experience);
  formData.append('profession', profession);
  formData.append('height', height);
  formData.append('build', build);
  formData.append('bust_type', bust_type);
  formData.append('surgery', surgery);
  formData.append('skin_color', skin_color);
  formData.append('hair_color', hair_color);
  formData.append('eye_color', eye_color);
  formData.append('butt_size', butt_size);
  formData.append('tattoos', tattoos);
  formData.append('braces', braces);
  formData.append('hobbies', hobbies);
  formData.append('special', special);
  formData.append('unique_trait', unique_trait);
  formData.append('tags', JSON.stringify(tags));
  formData.append('extras', JSON.stringify(extras));

  // adjuntar archivos reales del input <input type="file" id="form-photo" multiple>
  const fileInput = document.getElementById('form-photo');
  if (fileInput && fileInput.files.length) {
    Array.from(fileInput.files).forEach((file) => {
      formData.append('photos', file);
    });
  }

  try {
    const method = currentProfileId ? 'PUT' : 'POST';
    const url = currentProfileId ? '/api/profiles/' + currentProfileId : '/api/profiles';

    const response = await fetch(url, {
      method: method,
      body: formData
    });

    if (!response.ok) {
      let errorMsg = 'Error ' + response.status;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) errorMsg = errorData.error;
      } catch (e) {
        // si no viene JSON, manejar casos conocidos
        if (response.status === 413) {
          errorMsg = 'Payload demasiado grande; reduce tamaño de las imágenes';
        }
      }
      throw new Error(errorMsg);
    }

    const result = await response.json();
    alert('Perfil "' + alias + '" ' + (currentProfileId ? 'actualizado' : 'creado'));

    await loadProfiles();
    clearEditor();
  } catch (err) {
    console.error('Error guardando:', err);
    alert('Error al guardar: ' + err.message);
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

  // ligamos botones globales que no dependen de la sesión
  bindGlobalButtons();

  if (!checkSession()) {
    return;
  }

  loadProfiles();

  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileSubmit);
  }

  // los accesos ya se fijaron arriba, pero los reafirmamos aquí para seguridad
  window.logout = logout;
  window.selectProfile = selectProfile;
  window.deleteProfile = deleteProfile;
  window.clearEditor = clearEditor;

  console.log('Panel listo');
});
