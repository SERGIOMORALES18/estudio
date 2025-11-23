/*
  animations.js (module)
  - Funciones para animar las tarjetas que "caen" desde arriba.
  - Exporta `spawnFallingCard` que crea una copia visual de la tarjeta y la anima.
*/

function randomBetween(min, max){ return Math.random() * (max - min) + min }

export function spawnFallingCard(container, profile){
  // container: elemento donde se insertan las tarjetas flotantes (falling-area)
  const el = document.createElement('div');
  el.className = 'falling animate';
  // crear contenido sencillo (imagen + alias)
  el.innerHTML = `
    <div style="width:180px;border-radius:10px;overflow:hidden;background:#111;border:1px solid rgba(255,255,255,0.04)">
      <img src="${profile.photos?.[0] || ''}" alt="${profile.alias}" style="width:100%;height:120px;object-fit:cover;display:block">
      <div style="padding:.4rem;color:#fff;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.6))">
        <strong>${profile.alias}</strong>
      </div>
    </div>
  `;
  // set random horizontal position
  const left = randomBetween(4, 92);
  el.style.left = left + 'vw';
  // random duration: between 6s and 14s
  const duration = Math.floor(randomBetween(6,14));
  el.style.animationDuration = duration + 's';
  // slight rotation
  el.style.transform = `translateY(-120%) rotate(${randomBetween(-8,8)}deg)`;
  container.appendChild(el);

  // remove element after animation ends (duration + small buffer)
  setTimeout(()=>{ try{ container.removeChild(el) }catch(e){} }, (duration+0.5)*1000);
}
