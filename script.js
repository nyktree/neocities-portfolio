document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];

const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.removeAttribute('aria-current'));
  document.querySelector(`.nav a[href="#${visible.target.id}"]`)?.setAttribute('aria-current', 'page');
}, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .25, .5, .75, 1] });

sections.forEach((section) => observer.observe(section));

const root = document.documentElement;
const cursor = document.querySelector('.cursor-orbit');
const heroPieces = document.querySelectorAll('.hero > div:first-child, .hero-art');
let targetX = innerWidth / 2;
let targetY = innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

window.addEventListener('pointermove', (event) => {
  targetX = event.clientX;
  targetY = event.clientY;
  root.style.setProperty('--cursor-x', `${targetX}px`);
  root.style.setProperty('--cursor-y', `${targetY}px`);
  root.style.setProperty('--mouse-x', `${(targetX / innerWidth) * 100}%`);
  root.style.setProperty('--mouse-y', `${(targetY / innerHeight) * 100}%`);
}, { passive: true });

document.querySelectorAll('a, button, .project, .info-block').forEach((element) => {
  element.addEventListener('pointerenter', () => cursor?.classList.add('is-hovering'));
  element.addEventListener('pointerleave', () => cursor?.classList.remove('is-hovering'));
});

function animatePointer() {
  currentX += (targetX - currentX) * .12;
  currentY += (targetY - currentY) * .12;
  const offsetX = (currentX / innerWidth - .5) * 12;
  const offsetY = (currentY / innerHeight - .5) * 12;
  heroPieces.forEach((piece, index) => {
    piece.style.setProperty('--parallax-x', `${offsetX * (index ? -.6 : .35)}px`);
    piece.style.setProperty('--parallax-y', `${offsetY * (index ? -.6 : .35)}px`);
  });
  requestAnimationFrame(animatePointer);
}
animatePointer();

const canvas = document.querySelector('#atmosphere');
const context = canvas?.getContext('2d');
const drops = Array.from({ length: 90 }, (_, index) => ({
  x: (index * 97) % innerWidth,
  y: (index * 53) % innerHeight,
  length: 5 + (index % 9),
  speed: 1.2 + (index % 6) * .35,
  opacity: .12 + (index % 5) * .035
}));

function resizeCanvas() {
  if (!canvas || !context) return;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
function drawRain() {
  if (!canvas || !context) return;
  context.clearRect(0, 0, innerWidth, innerHeight);
  drops.forEach((drop) => {
    context.strokeStyle = `rgba(212, 71, 47, ${drop.opacity})`;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(drop.x, drop.y);
    context.lineTo(drop.x - 1, drop.y + drop.length);
    context.stroke();
    drop.y += drop.speed;
    if (drop.y > innerHeight + 20) { drop.y = -20; drop.x = Math.random() * innerWidth; }
  });
  requestAnimationFrame(drawRain);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) drawRain();
