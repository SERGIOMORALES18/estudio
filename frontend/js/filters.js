/**
 * filters.js — Lógica separada para el panel de filtros y el filtrado
 * - Mueve las funciones de filtrado y la gestión del panel fuera de `app.js`.
 * - Exporta `initFilters(profiles, gridElement)` que conecta la UI con los datos.
 */
import { renderProfiles } from './cards.js';

let allProfiles = [];
let filtersPanel = null;
let filterToggle = null;
let filterMaxAge = null;
let _closeHandler = null;

export function initFilters(profiles, gridElement) {
  allProfiles = Array.isArray(profiles) ? profiles.slice() : [];
  filtersPanel = document.querySelector('.filters-panel');
  filterToggle = document.getElementById('filter-toggle');
  filterMaxAge = document.getElementById('filter-max-age');

  // Inicial: render con todos los perfiles
  renderProfiles(allProfiles, gridElement);

  // Toggle panel
  if (filterToggle && filtersPanel) {
    filterToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const willOpen = !filtersPanel.classList.contains('open');
      if (willOpen) openFilters(); else closeFilters();
    });
  }

  // Delegación: aplicar filtros cuando cambian inputs
  if (filtersPanel) filtersPanel.addEventListener('change', () => applyFilters(gridElement));
  if (filterMaxAge) filterMaxAge.addEventListener('input', () => applyFilters(gridElement));
}

function populateFilters(/*profiles*/) {
  // Actualmente las preferencias están en el HTML estático.
  // Aquí podemos poblar dinámicamente si es necesario en el futuro.
}

function applyFilters(gridElement) {
  let filtered = allProfiles.slice();

  const selectedBreast = Array.from(document.querySelectorAll('input[name="breast"]:checked')).map(i=>i.value);
  const selectedButt = Array.from(document.querySelectorAll('input[name="butt"]:checked')).map(i=>i.value);
  const selectedPref = Array.from(document.querySelectorAll('input[name="preference"]:checked')).map(i=>i.value);
  const max = filterMaxAge && filterMaxAge.value ? Number(filterMaxAge.value) : null;

  if (selectedBreast.length) filtered = filtered.filter(p => selectedBreast.some(val => matchBreast(p, val)));
  if (selectedButt.length) filtered = filtered.filter(p => selectedButt.some(val => matchButt(p, val)));
  if (selectedPref.length) filtered = filtered.filter(p => selectedPref.some(val => matchPreference(p, val)));
  if (max !== null) filtered = filtered.filter(p => Number(p.age) <= max);

  renderProfiles(filtered, gridElement);
}

function matchBreast(profile, value){
  const text = ((profile.description||'') + ' ' + (profile.tags||[]).join(' ')).toLowerCase();
  if (value === 'grandes') return text.includes('senos grandes') || (text.includes('senos') && text.includes('grande'));
  if (value === 'pequeños') return text.includes('senos pequeños') || (text.includes('senos') && text.includes('peque'));
  return true;
}

function matchButt(profile, value){
  const text = ((profile.description||'') + ' ' + (profile.tags||[]).join(' ')).toLowerCase();
  if (value === 'grande') return text.includes('cola grande') || (text.includes('cola') && text.includes('grande')) || text.includes('trasero grande') || text.includes('gluteo grande');
  if (value === 'pequeña') return text.includes('cola pequeña') || (text.includes('cola') && text.includes('peque')) || text.includes('trasero pequeño') || text.includes('gluteo pequeño');
  return true;
}

function matchPreference(profile, value){
  const text = ((profile.description||'') + ' ' + (profile.tags||[]).join(' ')).toLowerCase();
  if (!value) return true;
  if ((profile.tags||[]).map(t=>t.toLowerCase()).includes(value)) return true;
  return text.includes(value.toLowerCase());
}

function addCloseListeners(){
  _closeHandler = function(ev){
    if (!filtersPanel) return;
    const target = ev.target;
    const inside = filtersPanel.contains(target) || filterToggle.contains(target);
    if (!inside){
      closeFilters();
    }
  };
  document.addEventListener('click', _closeHandler, { capture: true });
  window.addEventListener('keydown', onEscClose);
}

function removeCloseListeners(){
  if (!_closeHandler) return;
  document.removeEventListener('click', _closeHandler, { capture: true });
  window.removeEventListener('keydown', onEscClose);
  _closeHandler = null;
}

function onEscClose(ev){ if (ev.key === 'Escape') closeFilters(); }

function openFilters(){
  if (!filtersPanel) return;
  filtersPanel.classList.add('modal');
  setTimeout(()=>{
    filtersPanel.classList.add('open');
    filtersPanel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sidebar-open','filters-open');
    addCloseListeners();
    if (filterToggle) filterToggle.textContent = 'Menú de apuestas ▴';
    setTimeout(()=>{ filtersPanel.querySelector('input,button,select')?.focus(); }, 80);
  }, 8);
}

function closeFilters(){
  if (!filtersPanel) return;
  filtersPanel.classList.remove('open');
  filtersPanel.setAttribute('aria-hidden', 'true');
  if (filterToggle) filterToggle.textContent = 'Menú de apuestas ▾';
  document.body.classList.remove('sidebar-open','filters-open');

  const onEnd = (ev) => {
    if (ev && ev.target !== filtersPanel) return;
    filtersPanel.classList.remove('modal');
    removeCloseListeners();
    filtersPanel.removeEventListener('transitionend', onEnd);
  };

  filtersPanel.addEventListener('transitionend', onEnd);
  setTimeout(()=>{
    if (filtersPanel.classList.contains('modal')){
      filtersPanel.classList.remove('modal');
      removeCloseListeners();
      filtersPanel.removeEventListener('transitionend', onEnd);
    }
  }, 480);
}

export function resetFilters(){
  document.querySelectorAll('#filters input[type="checkbox"]').forEach(i => i.checked = false);
  if (filterMaxAge) filterMaxAge.value = '';
  // re-render con todos
  renderProfiles(allProfiles, document.getElementById('profiles-grid'));
}
