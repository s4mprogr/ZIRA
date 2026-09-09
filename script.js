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
    <p>Creamos y gestionamos campañas publicitarias dirigidas a compradores con intención real de adquirir propiedades.</p>
    <p class="flow">Meta Ads / Google Ads → Landing o formulario → GHL</p>
    <p>No optimizamos para conseguir la mayor cantidad de leads. Optimizamos para conseguir compradores que puedan convertirse en visitas.</p>
  `,
  atender: `
    <p>Cuando entra el lead, no queda esperando a que un vendedor lo llame cuando tenga tiempo. El sistema activa de inmediato:</p>
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
    <p>No todo lead cuenta. Filtramos según los criterios definidos con la inmobiliaria: presupuesto, zona, tipo de propiedad, intención, horizonte de compra y capacidad o condiciones necesarias.</p>
    <p class="flow">Lead → Prospecto → Comprador calificado</p>
  `,
  convertir: `
    <p>Una vez que el prospecto cumple los criterios, el sistema lo lleva al agendamiento y el comprador selecciona una disponibilidad.</p>
    <p class="flow">Agendada → Confirmada → Asignada al asesor → Registrada en el CRM</p>
    <p>Tu equipo comercial recibe una oportunidad lista para trabajar.</p>
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
