// Bitza API layer — swap these for real fetch() calls when backend is ready
// Example later:  return fetch(`${API_BASE}/products`).then(r => r.json());
const API_BASE = '/api';

async function fetchProducts() {
  return PRODUCTS;
}
async function fetchVendorProducts(sellerName) {
  return PRODUCTS.filter(p => p.seller === sellerName);
}
async function fetchWishlist() {
  return JSON.parse(localStorage.getItem('bitza-wishlist') || '[]');
}
async function saveWishlistRemote(ids) {
  localStorage.setItem('bitza-wishlist', JSON.stringify(ids));
}
