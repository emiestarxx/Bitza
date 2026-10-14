// ===== User account page =====
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('accountWishlist');
  if (!wrap) return;
  const ids = typeof getWishlist === 'function' ? getWishlist() : [];
  const items = PRODUCTS.filter(p => ids.includes(p.id));
  if (items.length === 0) {
    wrap.innerHTML = '<p class="muted">No saved items yet. Tap the ♡ on any listing to save it here.</p>';
    return;
  }
  wrap.innerHTML = items.map(p =>
    '<div class="wishlist-item">' +
      '<button class="remove" data-id="' + p.id + '">✕</button>' +
      '<div class="emoji">' + p.emoji + '</div>' +
      '<div class="title">' + p.title + '</div>' +
      '<div class="price">' + p.price + '</div>' +
    '</div>'
  ).join('');
  wrap.querySelectorAll('.remove').forEach(btn => {
    btn.onclick = () => {
      toggleWishlist(Number(btn.dataset.id));
      location.reload();
    };
  });
});
