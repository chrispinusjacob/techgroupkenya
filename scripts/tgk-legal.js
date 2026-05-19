document.querySelectorAll('.tgk-copyright-year').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

const scrollProgressBar = document.getElementById('scrollProgressBar');
const scrollProgressRoot = document.getElementById('scrollProgress');
function updateScrollProgress() {
  if (!scrollProgressBar) return;
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? ((doc.scrollTop || document.body.scrollTop) / max) * 100 : 0;
  scrollProgressBar.style.width = pct + '%';
  if (scrollProgressRoot) scrollProgressRoot.setAttribute('aria-valuenow', String(Math.round(pct)));
}

const nav = document.getElementById('mainNav');
window.addEventListener(
  'scroll',
  () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
    updateScrollProgress();
  },
  { passive: true }
);
window.addEventListener('resize', updateScrollProgress);
window.addEventListener('load', updateScrollProgress);

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let scrollY = 0;
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.contains('open');
    if (open) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    } else {
      scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      mobileMenu.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
  });
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    });
  });
}
