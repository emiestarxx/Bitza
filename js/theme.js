// Bitza theme — respects light/dark toggle, remembers user choice
(function initTheme() {
  const saved = localStorage.getItem('bitza-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const theme = saved || (prefersLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const current = document.documentElement.getAttribute('data-theme');
  btn.textContent = current === 'light' ? '☀️' : '🌙';
  btn.onclick = () => {
    const now = document.documentElement.getAttribute('data-theme');
    const next = now === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('bitza-theme', next);
    btn.textContent = next === 'light' ? '☀️' : '🌙';
  };
});
