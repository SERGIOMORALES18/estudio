/**
 * ============================================================================
 * app.js — Punto de entrada e inicialización principal
 * ============================================================================
 * 
 * Responsabilidades:
 * - Carga perfiles desde la API (módulo api.js)
 * - Renderiza tarjetas de perfil (módulo cards.js)
 * - Inicializa sistema de filtros (módulo filters.js)
 * - Genera animaciones decorativas de caída (módulo animations.js)
 * 
 * Arquitectura modular:
 * - Cada módulo mantiene su propia responsabilidad
 * - app.js solo orquesta las piezas
 * - No hay lógica duplicada entre módulos
 * 
 * ============================================================================
 */

import { getProfiles } from './api.js';
import { spawnFallingCard } from './animations.js';
import { renderProfiles } from './cards.js';
import { initFilters } from './filters.js';

// ========== ELEMENTOS DEL DOM ==========
const grid = document.getElementById('profiles-grid');
const fallingArea = document.getElementById('falling-area');

/**
 * init()
 * Función principal de bootstrap que:
 * 1. Obtiene perfiles desde la API
 * 2. Inicializa el panel de filtros con todos los perfiles
 * 3. Inicia proceso de animaciones decorativas
 */
async function init() {
  try {
    // Obtener perfiles
    const profiles = await getProfiles();

    // Inicializar filtros (renderiza perfiles iniciales)
    initFilters(profiles, grid);

    // Generar animaciones decorativas: tarjetas cayendo desde arriba
    // Limitar a máximo 6 elementos en pantalla simultáneamente
    setInterval(() => {
      const active = fallingArea.querySelectorAll('.falling').length;
      if (active > 6) return;

      const randomProfile = profiles[
        Math.floor(Math.random() * profiles.length)
      ];
      spawnFallingCard(fallingArea, randomProfile);
    }, 2200); // Generar nueva tarjeta cada 2.2 segundos
  } catch (error) {
    console.error('Error inicializando aplicación:', error);
  }
}

// ========== PUNTO DE ENTRADA ==========
window.addEventListener('DOMContentLoaded', init);
