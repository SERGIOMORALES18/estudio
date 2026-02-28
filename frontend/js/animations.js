/**
 * ============================================================================
 * animations.js — Efectos visuales decorativos (falling cards)
 * ============================================================================
 * 
 * Proporciona la función spawnFallingCard() que crea elementos visuales
 * que "caen" desde arriba de la pantalla, creando un efecto decorativo
 * tipo casino.
 * 
 * Características:
 * - Elementos con posición, duración, rotación y opacidad aleatorios
 * - Animación lineal de caída (fallDown en animations.css)
 * - Auto-limpieza: elementos se remueven del DOM después de caer
 * - Bajo rendimiento: máximo 6 elementos simultáneos
 * 
 * ============================================================================
 */

/**
 * randomBetween(min, max)
 * @param {number} min - Valor mínimo (incluido)
 * @param {number} max - Valor máximo (incluido)
 * @returns {number} Número aleatorio entre min y max
 */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * spawnFallingCard(container, profile)
 * @param {HTMLElement} container - Elemento contenedor donde agregar la tarjeta
 * @param {Object} profile - Objeto perfil con photos[0] y alias
 * 
 * Crea un elemento que cae desde el top:
 * - Posición horizontal aleatoria (4-92% del ancho)
 * - Duración de caída: 6-14 segundos
 * - Rotación: -6 a +6 grados
 * - Escala: 0.86-0.98 (variación sutil)
 * - Opacidad: 0.55-0.85 (semi-transparente)
 * 
 * El elemento se auto-elimina del DOM después de completar la caída.
 */
export function spawnFallingCard(container, profile) {
  // Crear elemento decorativo
  const element = document.createElement('div');
  element.className = 'falling animate';
  element.innerHTML = `
    <div class="falling-card">
      <img 
        src="${profile.photos?.[0] || ''}" 
        alt="${profile.alias}" 
      />
      <div class="falling-caption">
        <strong>${profile.alias}</strong>
      </div>
    </div>
  `;

  // ========== PROPIEDADES ALEATORIAS ==========
  // Posición horizontal aleatoria (4-92% del viewport width)
  const horizontalPosition = randomBetween(4, 92);
  element.style.left = horizontalPosition + 'vw';

  // Duración de caída: 6-14 segundos
  const duration = Math.floor(randomBetween(6, 14));
  element.style.animationDuration = duration + 's';

  // Transformaciones iniciales: rotación y escala
  element.style.transform = `
    translateY(-120%) 
    rotate(${randomBetween(-6, 6)}deg) 
    scale(${randomBetween(0.86, 0.98)})
  `;

  // Opacidad: 0.55-0.85 (semi-transparente)
  element.style.opacity = String(randomBetween(0.55, 0.85));
  element.style.zIndex = '1';

  // ========== AGREGAR AL DOM ==========
  container.appendChild(element);

  // ========== AUTO-LIMPIEZA ==========
  // Remover elemento después de que termine la animación
  setTimeout(() => {
    try {
      container.removeChild(element);
    } catch (error) {
      // Ignorar si el elemento ya fue removido
    }
  }, (duration + 0.5) * 1000);
}
