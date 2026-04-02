// =============================================
//  SmartFlow — Shared Utilities
//  BCSE203E | VIT | Winter 2025-26
// =============================================

// --- Live Clock ---
function updateClock() {
  const now = new Date();
  const el = document.getElementById('clock');
  if (el) {
    el.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
  }
}

setInterval(updateClock, 1000);
updateClock();

// --- Nav: highlight active item based on current page ---
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function () {
    // only handle items with an href
    const href = this.getAttribute('data-href');
    if (href) {
      window.location.href = href;
    }
  });
});
