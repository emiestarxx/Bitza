const WISHLIST_KEY = 'bitza-wishlist';
function getWishlist() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
  catch { return []; }
}
function saveWishlist(ids) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  updateWishlistUI();
}
function isWishlisted(id) { return getWishlist().includes(id); }
function toggleWishlist(id, event) {
  if (event) event.stopPropagation();
  const list = getWishlist();
  const idx = list.indexOf(id);
  if (idx > -1) list.splice(idx, 1);
  else list.push(id);
  saveWishlist(list);
}
function updateWishlistUI() {
  const count = getWishlist().length;
  const badge = document.getElementById('wishlistCount');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'grid' : 'none';
    badge.classList.add('pop');
    setTimeout(() => badge.classList.remove('pop'), 200);
  }
  document.querySelectorAll('.card-heart').forEach(h => {
    const id = Number(h.dataset.id);
    h.classList.toggle('active', isWishlisted(id));
    h.textContent = isWishlisted(id) ? '♥' : '♡';
  });
}
function openWishlist() {
  const content = document.getElementById('wishlistContent');
  if (!content) return;
  const ids = getWishlist();
  const items = PRODUCTS.filter(p => ids.includes(p.id));
  if (items.length === 0) {
    content.innerHTML = '<div class="wishlist-empty"><div style="font-size:48px;margin-bottom:12px;">💔</div><p>No saved items yet.</p><p class="muted small" style="margin-top:6px;">Tap the ♡ on any listing to save it here.</p></div>';
    openModal('wishlistModal');
    return;
  }
  content.innerHTML = '<div class="wishlist-grid">' + items.map(p =>
    '<div class="wishlist-item"><button class="remove" data-id="' + p.id + '">✕</button>' +
    '<div class="emoji">' + p.emoji + '</div>' +
    '<div class="title">' + p.title + '</div>' +
    '<div class="price">' + p.price + '</div></div>'
  ).join('') + '</div>' +
  '<div class="wishlist-actions"><button class="btn ghost" id="clearWishlist">Clear all</button><button class="btn primary" id="closeWishlistBtn">Done</button></div>';
  content.querySelectorAll('.remove').forEach(btn => {
    btn.onclick = () => { toggleWishlist(Number(btn.dataset.id)); openWishlist(); };
  });
  const clr = document.getElementById('clearWishlist');
  if (clr) clr.onclick = () => { if (confirm('Remove all saved items?')) { saveWishlist([]); openWishlist(); } };
  const done = document.getElementById('closeWishlistBtn');
  if (done) done.onclick = () => closeModal('wishlistModal');
  openModal('wishlistModal');
}
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('wishlistBtn');
  if (btn) btn.addEventListener('click', openWishlist);
  updateWishlistUI();
});
