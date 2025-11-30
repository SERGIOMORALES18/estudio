/**
 * animations.js — utilidades para animaciones decorativas
 * - Provee efectos visuales ligeros (ej. tarjetas que "caen").
 */

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function spawnFallingCard(container, profile) {
  const el = document.createElement('div');
  el.className = 'falling animate';
  el.innerHTML = `
    <div class="falling-card">
      <img src="${profile.photos?.[0] || ''}" alt="${profile.alias}" />
      <div class="falling-caption"><strong>${profile.alias}</strong></div>
    </div>
  `;

  const left = randomBetween(4, 92);
  el.style.left = left + 'vw';

  const duration = Math.floor(randomBetween(6, 14));
  el.style.animationDuration = duration + 's';
  el.style.transform = `translateY(-120%) rotate(${randomBetween(-6, 6)}deg) scale(${randomBetween(0.86, 0.98)})`;
  el.style.opacity = String(randomBetween(0.55, 0.85));
  el.style.zIndex = '1';

  container.appendChild(el);

  setTimeout(() => {
    try { container.removeChild(el); } catch (e) { /* ignore */ }
  }, (duration + 0.5) * 1000);
}
