// Acordeón de objeciones
document.querySelectorAll('.faq__item').forEach((item) => {
  const question = item.querySelector('.faq__q');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq__item').forEach((i) => i.classList.remove('is-open'));
    if (!isOpen) item.classList.add('is-open');
  });
});

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
