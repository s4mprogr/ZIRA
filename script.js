const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Video mock — placeholder de interacción, reemplazar por embed real
const video = document.getElementById('video');
if (video) {
  video.addEventListener('click', () => {
    // TODO: reemplazar por reproducción real (Loom / YouTube / mp4 propio)
    console.log('Reproducir video real aquí');
  });
  video.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') video.click();
  });
}

// Línea del mecanismo (Generar → Atender → Seguir → Convertir): se llena una sola vez al entrar en vista
const mechanism = document.getElementById('mechanism');
if (mechanism) {
  if (prefersReducedMotion) {
    mechanism.classList.add('is-active');
  } else {
    const mechanismObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          mechanism.classList.add('is-active');
          observer.unobserve(mechanism);
        }
      });
    }, { threshold: 0.4 });
    mechanismObserver.observe(mechanism);
  }
}

// Barras de la proyección de agenda: crecen una sola vez al entrar en vista
const projection = document.getElementById('projection');
if (projection) {
  if (prefersReducedMotion) {
    projection.classList.add('is-active');
  } else {
    const projectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          projection.classList.add('is-active');
          observer.unobserve(projection);
        }
      });
    }, { threshold: 0.4 });
    projectionObserver.observe(projection);
  }
}

// Contador de las cifras de impacto: cuenta una sola vez al entrar en vista
function animateCount(el) {
  const target = parseFloat(el.dataset.countTo);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (prefersReducedMotion || Number.isNaN(target)) {
    el.textContent = `${prefix}${target}${suffix}`;
    return;
  }
  const duration = 1100;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const countEls = document.querySelectorAll('[data-count-to]');
if (countEls.length) {
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  countEls.forEach((el) => countObserver.observe(el));
}
