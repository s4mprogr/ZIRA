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

// Línea del mecanismo (Generar → Atender → Calificar → Convertir): se llena una sola vez al entrar en vista
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

// Detalle de cada paso del Sistema GAC™: se abre al tocar el paso
const stepDetails = {
  generar: `
    <p>Dejamos de perseguir volumen y enfocamos tus campañas en atraer personas que realmente están buscando comprar, para que tu equipo deje de perder tiempo con contactos que no van a ningún lado.</p>
    <p>Creamos y gestionamos campañas publicitarias dirigidas a compradores con intención real de adquirir propiedades.</p>
    <p>No optimizamos para conseguir la mayor cantidad de leads. Optimizamos para conseguir compradores que puedan convertirse en visitas.</p>
  `,
  atender: `
    <p>Mientras tu equipo está ocupado vendiendo, atendemos y hacemos seguimiento inmediato a cada oportunidad para que ningún comprador interesado se enfríe por falta de respuesta.</p>
    <p>El sistema activa de inmediato:</p>
    <ul>
      <li>WhatsApp / SMS</li>
      <li>Respuestas automáticas</li>
      <li>Seguimiento</li>
      <li>Preguntas de pre-calificación</li>
      <li>Recordatorios</li>
      <li>Recuperación de conversaciones</li>
      <li>Notificaciones al equipo comercial</li>
    </ul>
    <p>El objetivo: reducir la pérdida de leads por velocidad de respuesta y falta de seguimiento.</p>
  `,
  calificar: `
    <p>Filtramos presupuesto, necesidad, ubicación e intención para que tu equipo hable con compradores que tienen una razón real para avanzar.</p>
  `,
  convertir: `
    <p>En lugar de entregarte una lista de leads para perseguir, ponemos oportunidades calificadas directamente en el calendario de tus asesores, listas para ser trabajadas.</p>
  `
};

const mechanismSteps = document.querySelectorAll('.mechanism__step');
const mechanismDetail = document.getElementById('mechanismDetail');
const mechanismDetailText = document.getElementById('mechanismDetailText');
let activeStepKey = null;

function closeMechanismDetail() {
  activeStepKey = null;
  mechanismSteps.forEach((s) => {
    s.classList.remove('is-selected');
    s.setAttribute('aria-expanded', 'false');
    s.querySelector('.mechanism__hint').textContent = 'Ver más';
  });
  mechanismDetail.style.maxHeight = '0px';
}

function openMechanismDetail(step) {
  const key = step.dataset.step;
  activeStepKey = key;
  mechanismSteps.forEach((s) => {
    const isThis = s === step;
    s.classList.toggle('is-selected', isThis);
    s.setAttribute('aria-expanded', String(isThis));
    s.querySelector('.mechanism__hint').textContent = isThis ? 'Ver menos' : 'Ver más';
  });
  mechanismDetailText.innerHTML = stepDetails[key] || '';
  mechanismDetail.style.maxHeight = mechanismDetail.scrollHeight + 'px';
}

if (mechanismSteps.length && mechanismDetail) {
  mechanismSteps.forEach((step) => {
    step.addEventListener('click', () => {
      if (activeStepKey === step.dataset.step) {
        closeMechanismDetail();
      } else {
        openMechanismDetail(step);
      }
    });
  });
  // Recalcula la altura abierta si cambia el tamaño de ventana (texto que salta de línea)
  window.addEventListener('resize', () => {
    if (activeStepKey) {
      mechanismDetail.style.maxHeight = mechanismDetail.scrollHeight + 'px';
    }
  });
}

// Calendario ilustrativo: aparece una sola vez al entrar en vista
const agendaCalendar = document.getElementById('agendaCalendar');
if (agendaCalendar) {
  if (prefersReducedMotion) {
    agendaCalendar.classList.add('is-active');
  } else {
    const calendarObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          agendaCalendar.classList.add('is-active');
          observer.unobserve(agendaCalendar);
        }
      });
    }, { threshold: 0.4 });
    calendarObserver.observe(agendaCalendar);
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
