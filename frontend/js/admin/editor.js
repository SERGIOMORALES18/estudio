/*
  editor.js — funciones relacionadas con el formulario del perfil y la vista previa.
  Depende de `list.js` para marcar el perfil activo y `session.js` para
  algunas llamadas de utilidad globales.
*/

import { setCurrentProfile } from './list.js';

let selectedPhotoBase64 = '';
let selectedPhotosBase64 = [];

import { getAllProfiles } from './list.js';

export function selectProfile(profileId) {
  const profile = getAllProfiles().find(p => p.id === profileId);
  if (!profile) return;

  setCurrentProfile(profileId);
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
    photos: selectedPhotosBase64.slice()
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
  // renderProfile is a global import in admin.js
  window.renderProfile(p, inner);
}

function attachPreviewListeners() {
  const fields = document.querySelectorAll('#profile-form input, #profile-form textarea');
  fields.forEach((el) => {
    el.addEventListener('input', () => updatePreview());
  });
}

// photo input handling
export function initializePhotoUploader() {
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
          selectedPhotoBase64 = selectedPhotosBase64[0] || '';
          photoPreview.innerHTML += '<img src="' + event.target.result + '" alt="Preview" />';
          updatePreview();
        };
        reader.readAsDataURL(file);
      });
    });
  }
  attachPreviewListeners();
}

export function createNewProfile() {
  console.log('createNewProfile invoked');
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

export function clearEditor() {
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

export async function handleProfileSubmit(e) {
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

  const fileInput = document.getElementById('form-photo');
  if (fileInput && fileInput.files.length) {
    Array.from(fileInput.files).forEach((file) => {
      formData.append('photos', file);
    });
  }

  try {
    const method = document.getElementById('profile-id').value ? 'PUT' : 'POST';
    const url = document.getElementById('profile-id').value ? '/api/profiles/' + document.getElementById('profile-id').value : '/api/profiles';

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
        if (response.status === 413) {
          errorMsg = 'Payload demasiado grande; reduce tamaño de las imágenes';
        }
      }
      throw new Error(errorMsg);
    }

    const result = await response.json();
    alert('Perfil "' + alias + '" ' + (document.getElementById('profile-id').value ? 'actualizado' : 'creado'));

    // recargar lista y reset editor
    const { loadProfiles } = await import('./list.js');
    await loadProfiles();
    clearEditor();
  } catch (err) {
    console.error('Error guardando:', err);
    alert('Error al guardar: ' + err.message);
  }
}
