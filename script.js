// Плавная прокрутка к разделу заказа
function scrollToOrder() {
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

// Обработка формы заказа
function submitOrder(event) {
    event.preventDefault();

    const form = document.getElementById('orderForm');
    const successMessage = document.getElementById('successMessage');

    // Получаем данные формы
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        eventDate: document.getElementById('eventDate').value,
        equipment: document.getElementById('equipment').value,
        description: document.getElementById('description').value
    };

    // Сохраняем в localStorage (для простого хранения без БД)
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push({
        ...formData,
        timestamp: new Date().toLocaleString('ru-RU')
    });
    localStorage.setItem('orders', JSON.stringify(orders));

    // Отправляем на сервер (когда будет бэкэнд)
    sendOrderToServer(formData);

    // Показываем успешное сообщение
    successMessage.style.display = 'block';
    form.reset();

    // Скрываем сообщение через 5 секунд
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Функция для отправки на сервер (в будущем)
function sendOrderToServer(formData) {
    // TODO: Добавить реальную отправку на сервер
    console.log('Заказ отправлен:', formData);

    // Пример для будущего использования с бэкэндом:
    /*
    fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => console.log('Ответ сервера:', data))
    .catch(error => console.error('Ошибка:', error));
    */
}

// Активная ссылка в навигации
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Обновление активной ссылки при прокрутке
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});
