(() => {
  const grid      = document.getElementById('card-grid');
  const searchEl  = document.getElementById('search');
  const noResults = document.getElementById('no-results');
  const overlay   = document.getElementById('modal-overlay');
  const sheet     = document.getElementById('modal-sheet');
  const modalBody = document.getElementById('modal-body');
  const modalHero = document.getElementById('modal-hero');
  const btnClose  = document.getElementById('btn-close');

  let currentWeed = null;
  let touchStartY = 0;
  let isDragging  = false;

  const PLACEHOLDER_ICONS = {
    whole:        '🌿',
    flower:       '🌸',
    leaf:         '🍃',
    habitat:      '🏞️',
    illustration: '📋',
  };

  // ── Build Cards ───────────────────────────────────────────────
  function buildGrid(weeds) {
    grid.innerHTML = '';
    if (weeds.length === 0) {
      noResults.style.display = 'block';
      return;
    }
    noResults.style.display = 'none';

    weeds.forEach(w => {
      const card = document.createElement('div');
      card.className = 'weed-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', w.name);

      const thumbUrl = w.photos[0].url;
      card.innerHTML = `
        <img src="${thumbUrl}" alt="${w.name}" loading="lazy">
        <div class="card-label">
          <div class="card-name">${w.name}</div>
        </div>
        ${w.invasive ? '<div class="badge-invasive">Invasive</div>' : ''}
      `;

      card.addEventListener('click', () => openModal(w));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(w); }
      });

      grid.appendChild(card);
    });
  }

  buildGrid(WEEDS);

  // ── Search ────────────────────────────────────────────────────
  searchEl.addEventListener('input', () => {
    const q = searchEl.value.trim().toLowerCase();
    const filtered = q ? WEEDS.filter(w => w.name.toLowerCase().includes(q)) : WEEDS;
    buildGrid(filtered);
  });

  // ── Build Carousel ────────────────────────────────────────────
  function buildCarousel(weed) {
    const photos = weed.photos;

    const phHtml = p => `
      <div class="carousel-placeholder">
        <span class="ph-icon">${PLACEHOLDER_ICONS[p.type] || '📷'}</span>
        <span class="ph-label">${p.label}</span>
      </div>`;

    const slidesHtml = photos.map((p, i) => {
      const inner = p.url
        ? `<img src="${p.url}" alt="${p.label}" data-ph-type="${p.type}" data-ph-label="${p.label}" loading="${i === 0 ? 'eager' : 'lazy'}">`
        : phHtml(p);
      return `<div class="carousel-slide">${inner}</div>`;
    }).join('');

    const dotsHtml = photos.map((_, i) =>
      `<div class="carousel-dot${i === 0 ? ' active' : ''}"></div>`
    ).join('');

    modalHero.innerHTML = `
      <div class="modal-drag-bar"></div>
      <div class="carousel-track" id="carousel-track">${slidesHtml}</div>
      <div class="carousel-dots" id="carousel-dots">${dotsHtml}</div>
      <div class="modal-hero-gradient"></div>
      <div class="modal-close-bar">
        <button id="btn-close" class="btn-close" aria-label="Close">✕</button>
      </div>
    `;

    // Re-bind close button (innerHTML replaced it)
    document.getElementById('btn-close').addEventListener('click', closeModal);

    // Fallback placeholders for images that fail to load
    modalHero.querySelectorAll('img[data-ph-type]').forEach(img => {
      img.addEventListener('error', () => {
        const ph = document.createElement('div');
        ph.className = 'carousel-placeholder';
        ph.innerHTML = `
          <span class="ph-icon">${PLACEHOLDER_ICONS[img.dataset.phType] || '📷'}</span>
          <span class="ph-label">${img.dataset.phLabel}</span>`;
        img.parentNode.replaceChild(ph, img);
      });
    });

    // Dot sync on scroll
    const track = document.getElementById('carousel-track');
    const dots  = document.getElementById('carousel-dots').children;

    track.addEventListener('scroll', () => {
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      Array.from(dots).forEach((d, i) => d.classList.toggle('active', i === idx));
    }, { passive: true });
  }

  // ── Open Modal ────────────────────────────────────────────────
  function openModal(weed) {
    currentWeed = weed;

    buildCarousel(weed);
    modalBody.innerHTML = buildModalContent(weed);

    overlay.classList.add('open');
    sheet.classList.add('open');
    document.body.style.overflow = 'hidden';

    history.pushState({ modal: weed.id }, '');
  }

  function closeModal() {
    sheet.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    currentWeed = null;
    sheet.style.transform = '';
  }

  // ── Modal Content Builder ─────────────────────────────────────
  function buildModalContent(w) {
    const invasiveHtml = w.invasive ? `
      <div class="invasive-warning">
        <span class="warn-icon">⚠️</span>
        <span><strong>CT Invasive Species</strong> — Active management is encouraged. Please remove and properly dispose of this plant.</span>
      </div>` : '';

    const tipsList = w.identificationTips.map(t => `<li>${t}</li>`).join('');

    return `
      <div class="modal-name">${w.name}</div>
      <div class="modal-scientific">${w.scientific}</div>
      <div class="chips-row">
        <span class="chip"><span class="chip-icon">🌸</span>${w.bloomTime}</span>
        <span class="chip"><span class="chip-icon">📍</span>${w.habitat.split(',')[0]}</span>
        ${w.invasive ? '<span class="chip" style="background:#fde8e8;color:#8b1a1a"><span class="chip-icon">⚠️</span>Invasive</span>' : ''}
      </div>

      ${invasiveHtml}

      <div class="info-section">
        <div class="info-section-header">
          <span class="info-section-icon">🔍</span>
          <span class="info-section-title">Identification</span>
        </div>
        <div class="info-section-body">
          <p style="margin-bottom:10px">${w.description}</p>
          <ul>${tipsList}</ul>
        </div>
      </div>

      <div class="info-section">
        <div class="info-section-header">
          <span class="info-section-icon">🌱</span>
          <span class="info-section-title">Soil Indicator</span>
        </div>
        <div class="info-section-body">
          <p>${w.soilIndicator}</p>
        </div>
      </div>

      <div class="info-section">
        <div class="info-section-header">
          <span class="info-section-icon">🍃</span>
          <span class="info-section-title">Uses</span>
        </div>
        <div class="info-section-body">
          <p>${w.uses}</p>
        </div>
      </div>

      <div class="info-section">
        <div class="info-section-header">
          <span class="info-section-icon">✂️</span>
          <span class="info-section-title">Control</span>
        </div>
        <div class="info-section-body">
          <p>${w.control}</p>
        </div>
      </div>
    `;
  }

  // ── Close Triggers ────────────────────────────────────────────
  overlay.addEventListener('click', closeModal);

  window.addEventListener('popstate', () => {
    if (currentWeed) closeModal();
  });

  // ── Swipe Down to Dismiss ─────────────────────────────────────
  sheet.addEventListener('touchstart', e => {
    if (modalBody.scrollTop > 0) return;
    touchStartY = e.touches[0].clientY;
    isDragging = false;
  }, { passive: true });

  sheet.addEventListener('touchmove', e => {
    if (modalBody.scrollTop > 4) return;
    // Don't drag-dismiss if user is swiping horizontally in carousel
    const track = document.getElementById('carousel-track');
    if (track && track.scrollLeft > 0) return;
    const delta = e.touches[0].clientY - touchStartY;
    if (delta > 10) {
      isDragging = true;
      sheet.style.transform = `translateY(${Math.max(0, delta * 0.8)}px)`;
      sheet.style.transition = 'none';
    }
  }, { passive: true });

  sheet.addEventListener('touchend', e => {
    if (!isDragging) return;
    const delta = e.changedTouches[0].clientY - touchStartY;
    sheet.style.transition = '';
    if (delta > 90) {
      closeModal();
      if (history.state?.modal) history.back();
    } else {
      sheet.style.transform = '';
    }
    isDragging = false;
  });
})();
