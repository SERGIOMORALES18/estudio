/**
 * ============================================================================
 * filters.js — Sistema de filtrado y control del panel de filtros
 * ============================================================================
 * 
 * Responsabilidades:
 * 1. Inicializar panel de filtros y renderizar perfiles iniciales
 * 2. Gestionar eventos de cambio en checkboxes y slider de edad
 * 3. Aplicar lógica de filtrado en cliente (sin backend)
 * 4. Actualizar grid de perfiles según los filtros seleccionados
 * 
 * Filtros disponibles:
 * - Senos: grandes, pequeños
 * - Cola: grande, pequeña  
 * - Preferencias: horario nocturno, anal, trios (estáticas en HTML)
 * - Edad: máximo (slider 18-45)
 * 
 * El filtrado es NO DESTRUCTIVO: no modifica los datos originales,
 * solo filtra qué tarjetas se muestran.
 * 
 * ============================================================================
 */

import { renderProfiles } from './cards.js';

// ========== ESTADO DEL MÓDULO ==========
let allProfiles = [];
let filtersPanel = null;
let filterToggle = null;
let filterMaxAge = null;
let _closeHandler = null;

/**
 * initFilters(profiles, gridElement)
 * @param {Array} profiles - Array de perfiles a filtrar
 * @param {HTMLElement} gridElement - Elemento grid donde renderizar perfiles
 * 
 * Inicializa el sistema de filtros:
 * 1. Guarda referencia a los perfiles y elementos del DOM
 * 2. Renderiza todos los perfiles inicialmente
 * 3. Conecta event listeners para cambios en filtros
 * 4. Actualiza el valor mostrado del slider de edad
 */
export function initFilters(profiles, gridElement) {
  // Copiar array de perfiles para no modificar el original
  allProfiles = Array.isArray(profiles) ? profiles.slice() : [];
  
  // Obtener referencias a elementos del DOM
  filtersPanel = document.querySelector('.filters-panel');
  filterToggle = document.getElementById('filter-toggle');
  // nuevos elementos select
  filterMaxAge = document.getElementById('filter-age');
  const filterBreast = document.getElementById('filter-breast');
  const filterButt = document.getElementById('filter-butt');
  const filterPref = document.getElementById('filter-pref');
  // El valor del rango ya no se muestra, ahora usamos selects
  const filterAgeValue = null;

  // ========== RENDER INICIAL ==========
  // Mostrar todos los perfiles al cargar
  renderProfiles(allProfiles, gridElement);
  // si el panel ya viene abierto, marcar toggle
  if (filterToggle && filtersPanel && filtersPanel.classList.contains('open')) {
    filterToggle.classList.add('open');
  }

  // ========== EVENT LISTENERS ==========
  // Toggle para abrir/cerrar panel de filtros (cuando exista)
  if (filterToggle && filtersPanel) {
    filterToggle.addEventListener('click', (event) => {
      event.preventDefault();
      const willOpen = !filtersPanel.classList.contains('open');
      if (willOpen) {
        openFilters();
      } else {
        closeFilters();
      }
    });
  }

  // Delegación: aplicar filtros cuando cambia cualquier checkbox
  if (filtersPanel) {
    filtersPanel.addEventListener('change', () => applyFilters(gridElement));
  }

  // el select de edad y demás triggers están manejados por el listener general de `change` arriba
  // así que no necesitamos un manejador separado aquí.
}

/**
 * applyFilters(gridElement)
 * @param {HTMLElement} gridElement - Elemento grid a actualizar
 * 
 * Proceso de filtrado:
 * 1. Lee valores de checkboxes y slider seleccionados
 * 2. Filtra array de perfiles según criterios
 * 3. Renderiza solo los perfiles que coinciden
 */
function applyFilters(gridElement) {
  let filtered = allProfiles.slice();

  // ========== LEER FILTROS SELECCIONADOS ==========
  const selectedBreast = document.getElementById('filter-breast')?.value || '';
  const selectedButt = document.getElementById('filter-butt')?.value || '';
  const selectedPref = document.getElementById('filter-pref')?.value || '';
  const maxAge = filterMaxAge && filterMaxAge.value ? Number(filterMaxAge.value) : null;

  // ========== APLICAR FILTROS ==========
  if (selectedBreast) {
    filtered = filtered.filter((profile) => matchBreast(profile, selectedBreast));
  }

  if (selectedButt) {
    filtered = filtered.filter((profile) => matchButt(profile, selectedButt));
  }

  if (selectedPref) {
    filtered = filtered.filter((profile) => matchPreference(profile, selectedPref));
  }

  if (maxAge !== null) {
    filtered = filtered.filter((profile) => Number(profile.age) <= maxAge);
  }

  // ========== ACTUALIZAR GRID ==========
  renderProfiles(filtered, gridElement);
}

/**
 * matchBreast(profile, value)
 * @param {Object} profile - Perfil a verificar
 * @param {string} value - Valor del filtro ('grandes' o 'pequeños')
 * @returns {boolean} True si el perfil coincide con el filtro
 * 
 * Busca keywords en descripción y tags del perfil
 */
function matchBreast(profile, value) {
  const text = (
    (profile.description || '') + 
    ' ' + 
    (profile.tags || []).join(' ')
  ).toLowerCase();

  if (value === 'grandes') {
    return (
      text.includes('senos grandes') ||
      (text.includes('senos') && text.includes('grande'))
    );
  }

  if (value === 'pequeños') {
    return (
      text.includes('senos pequeños') ||
      (text.includes('senos') && text.includes('peque'))
    );
  }

  return true;
}

/**
 * matchButt(profile, value)
 * @param {Object} profile - Perfil a verificar
 * @param {string} value - Valor del filtro ('grande' o 'pequeña')
 * @returns {boolean} True si el perfil coincide con el filtro
 */
function matchButt(profile, value) {
  const text = (
    (profile.description || '') + 
    ' ' + 
    (profile.tags || []).join(' ')
  ).toLowerCase();

  if (value === 'grande') {
    return (
      text.includes('cola grande') ||
      (text.includes('cola') && text.includes('grande')) ||
      text.includes('trasero grande') ||
      text.includes('glúteo grande')
    );
  }

  if (value === 'pequeña') {
    return (
      text.includes('cola pequeña') ||
      (text.includes('cola') && text.includes('peque')) ||
      text.includes('trasero pequeño') ||
      text.includes('glúteo pequeño')
    );
  }

  return true;
}

/**
 * matchPreference(profile, value)
 * @param {Object} profile - Perfil a verificar  
 * @param {string} value - Valor del filtro (ej: 'horario nocturno', 'anal', 'trios')
 * @returns {boolean} True si el perfil coincide con el filtro
 */
function matchPreference(profile, value) {
  if (!value) return true;

  const text = (
    (profile.description || '') + 
    ' ' + 
    (profile.tags || []).join(' ')
  ).toLowerCase();

  // Buscar en tags primero (match exacto)
  if ((profile.tags || []).map((tag) => tag.toLowerCase()).includes(value)) {
    return true;
  }

  // Luego en descripción general
  return text.includes(value.toLowerCase());
}

/**
 * openFilters()
 * Abre el panel de filtros (agregar clase 'open')
 */
function openFilters() {
  if (!filtersPanel) return;

  filtersPanel.classList.add('open');
  filtersPanel.setAttribute('aria-hidden', 'false');
  
  if (filterToggle) {
    filterToggle.textContent = 'Menú de apuestas ▴';
    filterToggle.classList.add('open');
  }

  addCloseListeners();
}

/**
 * closeFilters()
 * Cierra el panel de filtros (remover clase 'open')
 */
function closeFilters() {
  if (!filtersPanel) return;

  filtersPanel.classList.remove('open');
  filtersPanel.setAttribute('aria-hidden', 'true');
  
  if (filterToggle) {
    filterToggle.textContent = 'Menú de apuestas ▾';
    filterToggle.classList.remove('open');
  }

  removeCloseListeners();
}

/**
 * addCloseListeners()
 * Agregar listeners para cerrar panel cuando se clickea fuera
 */
function addCloseListeners() {
  _closeHandler = function (event) {
    if (!filtersPanel) return;

    const target = event.target;
    const inside = 
      filtersPanel.contains(target) || 
      (filterToggle && filterToggle.contains(target));
    
    if (!inside) {
      closeFilters();
    }
  };

  document.addEventListener('click', _closeHandler, { capture: true });
  window.addEventListener('keydown', onEscClose);
}

/**
 * removeCloseListeners()
 * Remover listeners de cierre del panel
 */
function removeCloseListeners() {
  if (!_closeHandler) return;

  document.removeEventListener('click', _closeHandler, { capture: true });
  window.removeEventListener('keydown', onEscClose);
  _closeHandler = null;
}

/**
 * onEscClose(event)
 * Cerrar panel cuando usuario presiona Escape
 */
function onEscClose(event) {
  if (event.key === 'Escape') {
    closeFilters();
  }
}

/**
 * resetFilters()
 * Reiniciar todos los filtros y mostrar todos los perfiles
 * 
 * Exportada por si se necesita un botón "Limpiar filtros"
 */
export function resetFilters() {
  // Desmarcar todos los checkboxes
  document.querySelectorAll('#filters input[type="checkbox"]').forEach(
    (input) => {
      input.checked = false;
    }
  );

  // Reset slider de edad al máximo
  if (filterMaxAge) {
    filterMaxAge.value = filterMaxAge.max || 45;
    const filterAgeValue = document.getElementById('filter-age-value');
    if (filterAgeValue) {
      filterAgeValue.textContent = filterMaxAge.value;
    }
  }

  // Mostrar todos los perfiles
  renderProfiles(
    allProfiles, 
    document.getElementById('profiles-grid')
  );
}
