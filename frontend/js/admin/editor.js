/*
  editor.js — funciones relacionadas con el formulario del perfil y la vista previa.
  Depende de `list.js` para marcar el perfil activo y `session.js` para
  algunas llamadas de utilidad globales.
*/

import { setCurrentProfile, getAllProfiles } from './list.js';
import { buildProfileFromForm } from './form.js';

// legacy variable: some code still assigns to it for backward compatibility
/* eslint-disable no-unused-vars */
let selectedPhotoBase64 = '';
/* eslint-enable no-unused-vars */
let selectedPhotosBase64 = [];

export function selectProfile(profileId) {
  const profile = getAllProfiles().find((p) => p.id === profileId);
  if (!profile) return;

  setCurrentProfile(profileId);
  selectedPhotoBase64 = '';

  document.querySelectorAll('.profile-list-item').forEach((el) => {
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
    container.innerHTML = profile.photos
      .map((p) => '<img src="' + p + '" alt="' + (profile.alias || '') + '" />')
      .join('');
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

function updatePreview(profile) {
  const panel = document.getElementById('editor-preview-panel');
  if (!panel) return;
  panel.innerHTML = '<h3>Vista previa</h3>';
  const inner = document.createElement('div');
  inner.id = 'admin-preview-inner';
  panel.appendChild(inner);

  let p = profile;
  if (!p) {
    p = buildProfileFromForm(selectedPhotosBase64);
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

  document.querySelectorAll('.profile-list-item').forEach((el) => {
    el.classList.remove('active');
  });
}

export function clearEditor() {
  document.getElementById('editor-content').style.display = 'none';
  document.getElementById('editor-title').textContent = 'Selecciona un perfil para editar';
  document.getElementById('editor-subtitle').textContent = '';
  document.getElementById('profile-form').reset();
  document.getElementById('photo-upload-preview').innerHTML = '';
  document.querySelectorAll('.profile-list-item').forEach((el) => {
    el.classList.remove('active');
  });
  updatePreview();
}

/* form submit logic has been moved to ./form.js */
