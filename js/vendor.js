// ===== Public vendor store =====
const VENDOR_NAME = "Adaeze O.";

function renderVendorStore() {
  const grid = document.getElementById('vendorGrid');
  if (!grid) return;
  const items = PRODUCTS.filter(p => p.seller === VENDOR_NAME);
  if (items.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-dim)">This vendor has no listings yet.</p>';
    return;
  }
  grid.innerHTML = items.map(p => {
    const saved = typeof isWishlisted === 'function' && isWishlisted(p.id);
    return '<div class="card" data-id="' + p.id + '">' +
      '<div class="card-img">' + p.emoji +
        (p.badge ? '<span class="badge">' + p.badge + '</span>' : '') +
        '<button class="card-heart ' + (saved ? 'active' : '') + '" data-id="' + p.id + '">' + (saved ? '♥' : '♡') + '</button>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-title">' + p.title + '</div>' +
        '<div class="card-price">' + p.price + '</div>' +
        '<div class="card-loc">📍 ' + p.location + '</div>' +
      '</div></div>';
  }).join('');
  grid.querySelectorAll('.card').forEach(card => {
    const id = Number(card.dataset.id);
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('card-heart')) return;
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return;
      const el = document.getElementById('productDetail');
      if (!el) return;
      const waLink = 'https://wa.me/' + p.phone.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent('Hi, I am interested in: ' + p.title);
      el.innerHTML =
        '<div class="hero-img">' + p.emoji + '</div>' +
        '<h2>' + p.title + '</h2>' +
        '<div class="price">' + p.price + '</div>' +
        '<div class="card-loc">📍 ' + p.location + '</div>' +
        '<p class="desc">' + p.description + '</p>' +
        '<div class="detail-warn">⚠️ <strong>Do NOT send money before you see the product.</strong> Meet the seller in public.</div>' +
        '<div class="detail-actions">' +
          '<a class="btn primary" href="' + waLink + '" target="_blank" style="text-align:center;text-decoration:none;">💬 WhatsApp</a>' +
          '<a class="btn ghost" href="tel:' + p.phone + '" style="text-align:center;text-decoration:none;">📞 Call</a>' +
        '</div>';
      if (typeof openModal === 'function') openModal('productModal');
    });
  });
  grid.querySelectorAll('.card-heart').forEach(h => {
    h.addEventListener('click', (e) => {
      toggleWishlist(Number(h.dataset.id), e);
      const nowSaved = isWishlisted(Number(h.dataset.id));
      h.classList.toggle('active', nowSaved);
      h.textContent = nowSaved ? '♥' : '♡';
    });
  });
}

// ===== Vendor dashboard =====
function renderMyListings() {
  const wrap = document.getElementById('myListings');
  if (!wrap) return;
  const items = PRODUCTS.filter(p => p.seller === VENDOR_NAME);
  wrap.innerHTML = items.map(p =>
    '<div class="dash-row">' +
      '<div class="dash-thumb">' + p.emoji + '</div>' +
      '<div class="dash-meta"><div class="dash-name">' + p.title + '</div><div class="dash-price">' + p.price + '</div></div>' +
      '<div class="dash-actions">' +
        '<button class="btn ghost" onclick="alert(\'Edit ' + p.title + '\')">Edit</button>' +
        '<button class="btn ghost" onclick="alert(\'Delete ' + p.title + '?\')">Delete</button>' +
      '</div>' +
    '</div>'
  ).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderVendorStore();
  renderMyListings();
  const form = document.getElementById('postForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      alert('Listing posted! (Demo only — wire up real data later.)');
      e.target.reset();
    });
  }
});
