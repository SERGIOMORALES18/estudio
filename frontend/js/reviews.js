// reviews.js
// Módulo separado para manejar la visualización y el formulario de reseñas.
//
// Exporta:
//   renderReviews(reviews) -> HTML string para insertar en la página
//   initReviewControls(profileId) -> añade los listeners para toggling, envío, estrellas, etc.

// construye las estrellas estáticas utilizadas al mostrar reseñas existentes
function renderStars(rating, max = 5) {
  let stars = '';
  for (let i = 1; i <= max; i++) {
    stars += `<span class="star${i <= rating ? '' : ' empty'}">★</span>`;
  }
  return stars;
}

// helper que activa los controles de estrella en el formulario dinámico
function initializeStars() {
  document.querySelectorAll('.rating-group').forEach((group) => {
    const hidden = group.querySelector('input[type="hidden"]');
    const valueDisplay = group.querySelector('.rating-value');
    let current = Number(hidden.value) || 0;
    const stars = Array.from(group.querySelectorAll('.star'));
    function updateVisual(val) {
      stars.forEach((s) => {
        s.classList.toggle('filled', Number(s.dataset.value) <= val);
      });
      if (valueDisplay) {
        valueDisplay.textContent = `${val}/5`;
      }
    }
    updateVisual(current);
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        current = Number(star.dataset.value);
        hidden.value = current;
        updateVisual(current);
      });
      star.addEventListener('mouseenter', () => {
        updateVisual(Number(star.dataset.value));
      });
      star.addEventListener('mouseleave', () => {
        updateVisual(current);
      });
    });
  });
}

// renderiza el conjunto de reseñas (incluye título, contador y formulario oculto)
export function renderReviews(reviews) {
  function formatDate(str) {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  const count = (reviews || []).length;
  let html = `
      <section id="reviews" class="profile-section reviews-section">
        <h2>
          <span class="review-count">${count} REVIEW${count !== 1 ? 'S' : ''}</span>
          <a href="#" class="write-review">Escribe una valoración</a>
        </h2>
        <div id="write-review" class="write-review-form card">
          <h3>Escribe una valoración</h3>
          <form id="review-form" class="review-form">
            <textarea name="text" rows="5" placeholder="Escribe tu review aquí"></textarea>
            <input type="text" name="title" placeholder="Título de tu review (opcional)" maxlength="150" />
            <input type="text" name="author" placeholder="Tu Nombre (opcional)" maxlength="100" />
            <input type="email" name="email" placeholder="Tu Mail" maxlength="100" />

            <div class="rating-group" data-field="presentation">
              <span class="rating-label">Presentación</span>
              <span class="star" data-value="1">★</span>
              <span class="star" data-value="2">★</span>
              <span class="star" data-value="3">★</span>
              <span class="star" data-value="4">★</span>
              <span class="star" data-value="5">★</span>
              <span class="rating-value">0/5</span>
              <input type="hidden" name="presentation" value="0">
            </div>
            <div class="rating-group" data-field="attention">
              <span class="rating-label">Atención</span>
              <span class="star" data-value="1">★</span>
              <span class="star" data-value="2">★</span>
              <span class="star" data-value="3">★</span>
              <span class="star" data-value="4">★</span>
              <span class="star" data-value="5">★</span>
              <span class="rating-value">0/5</span>
              <input type="hidden" name="attention" value="0">
            </div>
            <div class="rating-group" data-field="photoAccuracy">
              <span class="rating-label">Foto</span>
              <span class="star" data-value="1">★</span>
              <span class="star" data-value="2">★</span>
              <span class="star" data-value="3">★</span>
              <span class="star" data-value="4">★</span>
              <span class="star" data-value="5">★</span>
              <span class="rating-value">0/5</span>
              <input type="hidden" name="photoAccuracy" value="0">
            </div>

            <div class="form-actions">
              <button type="button" id="cancel-review">CANCEL</button>
              <button type="submit" class="submit-btn">Enviar valoración</button>
            </div>
          </form>
        </div>
    `;

  if (count === 0) {
    html += `<p>No hay reviews todavía.</p>`;
  } else {
    reviews.forEach((r) => {
      html += `
          <div class="review-card">
            <div class="review-header">
              <div class="review-meta">
                <div class="review-author">${r.author || 'Anónimo'}</div>
                ${r.created_at ? `<div class="review-date">${formatDate(r.created_at)}</div>` : ''}
              </div>
            </div>
            <div class="review-ratings">
              <div class="rating-item">Presentación ${renderStars(r.presentation)}<span class="rating-value">${r.presentation}/5</span></div>
              <div class="rating-item">Atención ${renderStars(r.attention)}<span class="rating-value">${r.attention}/5</span></div>
              <div class="rating-item">Se parece a la fotografía? ${renderStars(r.photoAccuracy)}<span class="rating-value">${r.photoAccuracy}/5</span></div>
            </div>
            ${r.title ? `<div class="review-title">${r.title}</div>` : ''}
            <div class="review-text">${r.text || ''}</div>
            <div class="review-footer">
              ${r.recommendation ? `<div class="review-recommend">${r.recommendationLabel || ''} ${r.recommendation}</div>` : ''}
              <div class="review-votes">👍${r.thumbsUp || 0} 👎${r.thumbsDown || 0}</div>
            </div>
          </div>
        `;
    });
  }

  html += `</section>`;
  return html;
}

// inicializa los escuchadores para el enlace, el formulario y las estrellas
export function initReviewControls(profileId) {
  // initial setup: stars will be initialized when form is shown
  const reviewContainer = document.getElementById('write-review');
  const toggleLink = document.querySelector('.write-review');
  if (toggleLink && reviewContainer) {
    toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      const showing = reviewContainer.style.display === 'block';
      reviewContainer.style.display = showing ? 'none' : 'block';
      if (!showing) {
        initializeStars();
        reviewContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(reviewForm);
      const payload = {};
      for (const [key, value] of formData.entries()) {
        if (value !== '') payload[key] = value;
      }
      try {
        const resp = await fetch(`/api/profiles/${profileId}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!resp.ok) throw new Error('No se pudo enviar la reseña');
        window.location.reload();
      } catch (err) {
        console.error('Error enviando reseña:', err);
        alert('Ocurrió un error al enviar la reseña');
      }
    });

    const cancelBtn = document.getElementById('cancel-review');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        reviewContainer.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
}
