// Reveal animation on scroll
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => obs.observe(el));

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Form submission
function submitOrder(event) {
  event.preventDefault();

  const form = document.getElementById('orderForm');
  const successMessage = document.getElementById('successMessage');

  const formData = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    eventType: document.getElementById('eventType').value,
    location: document.getElementById('location').value,
    message: document.getElementById('message').value,
    timestamp: new Date().toLocaleString('ru-RU')
  };

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(formData);
  localStorage.setItem('orders', JSON.stringify(orders));

  successMessage.style.display = 'block';
  form.reset();

  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 5000);

  console.log('Заявка отправлена:', formData);
}
