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

// ---- Modal de agendamiento ----
const modal = document.getElementById('bookingModal');
function openModal() {
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
document.querySelectorAll('[data-open-modal]').forEach((btn) => {
  btn.addEventListener('click', openModal);
});
document.querySelectorAll('[data-close-modal]').forEach((el) => {
  el.addEventListener('click', closeModal);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
});

// ---- Acordeón de FAQ ----
document.querySelectorAll('.faq__item').forEach((item) => {
  const question = item.querySelector('.faq__q');
  const answer = item.querySelector('.faq__a');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq__item').forEach((i) => {
      i.classList.remove('is-open');
      i.querySelector('.faq__a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('is-open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ---- Animación de entrada por scroll para grupos de tarjetas ----
function revealOnScroll(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (prefersReducedMotion) {
    el.classList.add('is-active');
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        el.classList.add('is-active');
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(el);
}
['offerGrid', 'specGrid', 'phases'].forEach(revealOnScroll);

// ---- Contador del stat del problema ----
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
