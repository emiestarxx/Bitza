// ===== Modal helpers =====
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}
document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', e => {
    if (e.target === m) m.classList.remove('open');
  });
});

// ===== Render products =====
function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => showProduct(p);
    const saved = isWishlisted(p.id);
    card.innerHTML =
      '<div class="card-img">' + p.emoji +
        (p.badge ? '<span class="badge">' + p.badge + '</span>' : '') +
        '<button class="card-heart ' + (saved ? 'active' : '') + '" data-id="' + p.id + '">' + (saved ? '♥' : '♡') + '</button>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-title">' + p.title + '</div>' +
        '<div class="card-price">' + p.price + '</div>' +
        '<div class="card-meta">👤 ' + p.seller + '</div>' +
        '<div class="card-loc">📍 ' + p.location + '</div>' +
      '</div>';
    card.querySelector('.card-heart').addEventListener('click', (e) => {
      toggleWishlist(p.id, e);
      const heart = e.currentTarget;
      const nowSaved = isWishlisted(p.id);
      heart.classList.toggle('active', nowSaved);
      heart.textContent = nowSaved ? '♥' : '♡';
    });
    grid.appendChild(card);
  });
}

// ===== Show product detail (with blurred contact) =====
function showProduct(p) {
  const el = document.getElementById('productDetail');
  if (!el) return;
  const waLink = 'https://wa.me/' + p.phone.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent('Hi, I am interested in: ' + p.title);
  el.innerHTML =
    '<div class="hero-img">' + p.emoji + '</div>' +
    '<h2>' + p.title + '</h2>' +
    '<div class="price">' + p.price + '</div>' +
    '<div class="card-loc">📍 ' + p.location + '</div>' +
    '<p class="desc">' + p.description + '</p>' +
    '<div class="detail-warn">⚠️ <strong>Do NOT send money before you see the product.</strong> Meet the seller in a public place, inspect the item, then pay in person.</div>' +
    '<div class="contact-locked" id="contactLock">' +
      '<div class="seller-box blurred">' +
        '<h4>Seller Contact</h4>' +
        '<div class="seller-row"><span class="ico">👤</span><span>' + p.seller + '</span></div>' +
        '<div class="seller-row"><span class="ico">📞</span><a href="tel:' + p.phone + '">' + p.phone + '</a></div>' +
        '<div class="seller-row"><span class="ico">✉️</span><a href="mailto:' + p.email + '">' + p.email + '</a></div>' +
      '</div>' +
      '<div class="lock-overlay"><div style="font-size:28px;">🔒</div><div class="lock-text">CONTACT HIDDEN FOR SAFETY</div></div>' +
    '</div>' +
    '<div class="detail-actions">' +
      '<button class="btn primary" id="revealContact">🔓 Reveal to buy</button>' +
      '<a class="btn ghost" href="pages/vendor/store.html">🏪 Visit store</a>' +
    '</div>';
  document.getElementById('revealContact').onclick = () => {
    document.getElementById('contactLock').classList.add('revealed');
    const actions = document.querySelector('.detail-actions');
    actions.innerHTML =
      '<a class="btn primary" href="' + waLink + '" target="_blank" style="text-align:center;text-decoration:none;">💬 WhatsApp Seller</a>' +
      '<a class="btn ghost" href="tel:' + p.phone + '" style="text-align:center;text-decoration:none;">📞 Call</a>';
    if (typeof openChat === 'function') openChat(p.seller);
  };
  openModal('productModal');
}

// ===== Home page boot =====
document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('searchInput');
  if (search) {
    search.addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = PRODUCTS.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q)
      );
      renderProducts(filtered);
      if (typeof updateWishlistUI === 'function') updateWishlistUI();
    });
  }

  document.querySelectorAll('.chip').forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.textContent.trim();
      const filtered = cat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
      renderProducts(filtered);
      if (typeof updateWishlistUI === 'function') updateWishlistUI();
    };
  });

  const openSell = document.getElementById('openSell');
  if (openSell) openSell.onclick = () => openModal('sellModal');

  // Sidebar (mobile)
  const sidebar  = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const burger   = document.getElementById('hamburger');
  const closeBtn = document.getElementById('sidebarClose');
  function openSidebar()  { sidebar?.classList.add('open'); backdrop?.classList.add('show'); document.body.classList.add('no-scroll'); }
  function closeSidebar() { sidebar?.classList.remove('open'); backdrop?.classList.remove('show'); document.body.classList.remove('no-scroll'); }
  burger?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  backdrop?.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

  document.querySelectorAll('.side-link[data-cat]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const cat = link.dataset.cat;
      document.querySelectorAll('.side-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.textContent.trim() === cat));
      const filtered = cat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
      renderProducts(filtered);
      if (typeof updateWishlistUI === 'function') updateWishlistUI();
      if (window.innerWidth <= 900) closeSidebar();
    });
  });

  renderProducts(PRODUCTS);
  if (typeof updateWishlistUI === 'function') updateWishlistUI();
});
/* ===== HEADER + SEARCH OVERRIDES ===== */
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.onclick = () => {
      const s = document.getElementById('sidebar');
      const b = document.getElementById('sidebarBackdrop');
      if (s) s.classList.add('open');
      if (b) b.classList.add('show');
      document.body.classList.add('no-scroll');
    };
  }

  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.onclick = () => {
      openModal('searchModal');
      setTimeout(() => document.getElementById('modalSearchInput')?.focus(), 80);
    };
  }

  const modalInput = document.getElementById('modalSearchInput');
  const modalGo = document.getElementById('modalSearchGo');
  const runModalSearch = () => {
    if (!modalInput) return;
    const q = modalInput.value.toLowerCase().trim();
    const filtered = PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.seller.toLowerCase().includes(q)
    );
    renderProducts(filtered);
    if (typeof updateWishlistUI === 'function') updateWishlistUI();
    if (typeof lucide !== 'undefined') lucide.createIcons();
    closeModal('searchModal');
  };
  modalGo?.addEventListener('click', runModalSearch);
  modalInput?.addEventListener('keydown', e => { if (e.key === 'Enter') runModalSearch(); });
});

/* Replace card heart emoji with Lucide heart */
document.addEventListener('DOMContentLoaded', () => {
  const _orig = renderProducts;
  renderProducts = function(list) {
    _orig(list);
    document.querySelectorAll('.card-heart').forEach(btn => {
      const saved = btn.classList.contains('active');
      btn.innerHTML = '<i data-lucide="heart"></i>';
      if (saved) btn.querySelector('svg')?.setAttribute('fill', 'currentColor');
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  };
});

/* ============================================================
   PRODUCT IMAGE PATCH — use p.image if present, else emoji
   ============================================================ */
(function () {
  const original = renderProducts;
  renderProducts = function (list) {
    original(list);
    document.querySelectorAll('#productGrid .card').forEach((card, i) => {
      const p = list[i];
      if (!p || !p.image) return;
      const img = card.querySelector('.card-img');
      if (!img) return;
      // Keep the badge and heart, replace only the emoji text with an <img>
      const badge = img.querySelector('.badge');
      const heart = img.querySelector('.card-heart');
      img.innerHTML = '';
      const el = document.createElement('img');
      el.src = p.image;
      el.alt = p.title;
      el.loading = 'lazy';
      el.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      el.onerror = () => { img.textContent = p.emoji; };
      img.appendChild(el);
      if (badge) img.appendChild(badge);
      if (heart) img.appendChild(heart);
    });
  };
})();

/* ===== Desktop sidebar collapse ===== */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('sidebarCollapse');
  if (!btn) return;
  btn.onclick = () => {
    document.body.classList.toggle('sidebar-collapsed');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  };
});



/* ===== Sidebar tooltips ===== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.side-link').forEach(link => {
    const icon = link.querySelector('.side-ico');
    if (!icon) return;
    const text = link.textContent.trim();
    if (text && !link.title) link.title = text;
  });
});

/* ============================================================
   HERO CAROUSEL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  const dots  = document.getElementById('carouselDots');
  if (!track) return;

  // Fallback if PRODUCTS isn't loaded
  if (typeof PRODUCTS === 'undefined' || !Array.isArray(PRODUCTS)) {
    track.innerHTML = '<div class="carousel-slide" style="display:grid;place-items:center;color:var(--text-dim)">Loading…</div>';
    return;
  }

  const featured = PRODUCTS.slice(0, 6);

  track.innerHTML = featured.map(p =>
    '<div class="carousel-slide" data-id="' + p.id + '">' +
      '<img src="' + (p.image || 'https://picsum.photos/seed/fallback/500/400') + '" alt="' + p.title + '" loading="lazy" onerror="this.style.display=\'none\'" />' +
      '<div class="slide-overlay">' +
        '<div class="slide-title">' + p.title + '</div>' +
        '<div class="slide-price">' + p.price + ' · ' + p.location + '</div>' +
      '</div>' +
    '</div>'
  ).join('');

  if (dots) {
    dots.innerHTML = featured.map((_, i) => '<span data-i="' + i + '"></span>').join('');
    const dotEls = dots.querySelectorAll('span');

    function updateDots() {
      const slideW = track.querySelector('.carousel-slide')?.offsetWidth || 1;
      const idx = Math.round(track.scrollLeft / (slideW + 16));
      dotEls.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    track.addEventListener('scroll', updateDots);
    updateDots();
  }

  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (prevBtn) prevBtn.onclick = () => {
    const w = (track.querySelector('.carousel-slide')?.offsetWidth || 300) + 16;
    track.scrollBy({ left: -w, behavior: 'smooth' });
  };
  if (nextBtn) nextBtn.onclick = () => {
    const w = (track.querySelector('.carousel-slide')?.offsetWidth || 300) + 16;
    track.scrollBy({ left: w, behavior: 'smooth' });
  };

  track.querySelectorAll('.carousel-slide').forEach(el => {
    el.onclick = () => {
      const p = PRODUCTS.find(x => x.id === Number(el.dataset.id));
      if (p && typeof showProduct === 'function') showProduct(p);
    };
  });

  // Auto-advance every 5s
  setInterval(() => {
    const w = (track.querySelector('.carousel-slide')?.offsetWidth || 300) + 16;
    const max = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= max - 4) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: w, behavior: 'smooth' });
    }
  }, 5000);
});

/* ===== Menu button toggles sidebar ===== */
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  if (!menuBtn) return;

  // Replace whatever onclick was there with our own
  menuBtn.onclick = () => {
    const s = document.getElementById('sidebar');
    const b = document.getElementById('sidebarBackdrop');
    if (window.innerWidth > 900) {
      // Desktop: collapse to icon rail
      document.body.classList.toggle('sidebar-collapsed');
    } else {
      // Mobile: open the drawer
      if (s) s.classList.add('open');
      if (b) b.classList.add('show');
      document.body.classList.add('no-scroll');
    }
  };
});

/* ===== Carousel: advance one slide at a time ===== */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  function slideWidth() {
    const s = track.querySelector('.carousel-slide');
    return s ? s.offsetWidth : 300;
  }
  function goNext() {
    const w = slideWidth();
    const max = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= max - 5) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: w, behavior: 'smooth' });
    }
  }
  function goPrev() {
    const w = slideWidth();
    track.scrollBy({ left: -w, behavior: 'smooth' });
  }

  // Override the buttons (last listener wins)
  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');
  if (prev) prev.onclick = goPrev;
  if (next) next.onclick = goNext;

  // Stop any existing auto-advance and start a clean one
  window._bitzaCarouselInterval && clearInterval(window._bitzaCarouselInterval);
  window._bitzaCarouselInterval = setInterval(goNext, 6000);
});

/* ===== Carousel: advance exactly one slide per click/interval ===== */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const slideWidth = () => {
    const s = track.querySelector('.carousel-slide');
    return s ? s.offsetWidth : 300;
  };

  const goNext = () => {
    const w = slideWidth();
    const max = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= max - 5) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: w, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    track.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
  };

  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');
  if (prev) prev.onclick = goPrev;
  if (next) next.onclick = goNext;

  // Reset auto-advance
  if (window._bitzaCarouselInterval) clearInterval(window._bitzaCarouselInterval);
  window._bitzaCarouselInterval = setInterval(goNext, 6000);
});
