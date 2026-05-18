# README - 

## Что включено

✓ Адаптивный дизайн (мобильные + десктоп)  
✓ Галерея оборудования с иконками  
✓ Прайс-лист с тремя комплектами  
✓ Форма заказа с валидацией  
✓ Контактная информация  
✓ Быстрая навигация  
✓ Хранение заказов в LocalStorage (пока нет бэкэнда)  

## Быстрый старт локально

1. **Откройте `index.html` в браузере** - сайт готов к просмотру

2. **Редактируйте контактные данные** в `index.html`:
   - Найдите раздел "Контакты"
   - Замените +7 (999) 123-45-67 на свой номер
   - Замените email и адрес

3. **Измените название и брендинг**:
   - Замените "ProSound" на название вашей компании
   - Обновите цвета в `styles.css` (переменные `:root`)

## Файловая структура

```
concert-rental-site/
├── index.html          # Основной HTML (галерея, прайс, форма, контакты)
├── styles.css          # Адаптивные стили + анимации
├── script.js           # Интерактивность (форма, навигация)
├── DEPLOYMENT.md       # Инструкция по развертыванию
└── README.md           # Этот файл
```

## Расширение функциональности

### 1. Добавить фото/видео галерею

```html
<!-- В начало index.html перед </head> добавьте -->
<link href="https://cdn.jsdelivr.net/npm/lightbox2@2.11.3/dist/css/lightbox.min.css" rel="stylesheet">

<!-- Перед </body> добавьте -->
<script src="https://cdn.jsdelivr.net/npm/lightbox2@2.11.3/dist/js/lightbox.min.js"></script>
```

Затем добавьте галерею:
```html
<section id="gallery" class="py-5 bg-light">
    <div class="container">
        <h2 class="text-center mb-5">Наши работы</h2>
        <div class="row g-3">
            <div class="col-md-4">
                <a href="assets/images/photo1.jpg" data-lightbox="gallery">
                    <img src="assets/images/photo1.jpg" class="img-fluid rounded" alt="Фото работы">
                </a>
            </div>
            <!-- Добавьте больше фото -->
        </div>
    </div>
</section>
```

### 2. Обработка формы на сервере

Создайте файл `process-order.php`:
```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $to = 'your-email@example.com';
    $subject = 'Новый заказ от ' . $data['name'];
    $body = "Имя: " . $data['name'] . "\n";
    $body .= "Телефон: " . $data['phone'] . "\n";
    $body .= "Email: " . $data['email'] . "\n";
    $body .= "Дата: " . $data['eventDate'] . "\n";
    $body .= "Оборудование: " . $data['equipment'] . "\n";
    $body .= "Описание: " . $data['description'];
    
    mail($to, $subject, $body);
    
    echo json_encode(['success' => true]);
}
?>
```

Обновите `script.js`:
```javascript
function sendOrderToServer(formData) {
    fetch('/process-order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => console.log('Заказ отправлен!'))
    .catch(error => console.error('Ошибка:', error));
}
```

### 3. Подключить карту

```html
<!-- Добавьте в раздел контактов -->
<div class="col-md-6">
    <iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
</div>
```

### 4. Добавить новый раздел

```html
<!-- Добавьте в навигацию -->
<li class="nav-item"><a class="nav-link" href="#reviews">Отзывы</a></li>

<!-- И сам раздел перед футером -->
<section id="reviews" class="py-5 bg-light">
    <div class="container">
        <h2 class="text-center mb-5">Отзывы клиентов</h2>
        <!-- Добавьте карточки отзывов -->
    </div>
</section>
```

## Кастомизация

### Изменить цвета

В `styles.css` найдите:
```css
:root {
    --primary-color: #0d6efd;     /* Основной цвет кнопок */
}
```

Замените цвета:
- `#667eea` → Основной фиолетовый
- `#764ba2` → Вторичный фиолетовый
- Замените на ваши цвета компании

### Изменить название компании

1. В `index.html` найдите `ProSound` и замените на ваше имя
2. В `<title>` обновите название сайта

## Информация о хранении данных

- **LocalStorage**: Заказы временно сохраняются в браузере (для демо)
- **Серверная обработка**: Используйте `process-order.php` или подключите API

## Поддержка

При добавлении фото/видео убедитесь, что файлы оптимизированы для веба:
- Фото: сжать до 500KB-2MB для быстрой загрузки
- Видео: использовать MP4 или YouTube embeds

## Лицензия

Этот проект создан для компании по прокату оборудования. Свободен для использования и расширения.
