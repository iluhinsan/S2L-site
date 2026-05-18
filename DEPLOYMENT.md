# Развертывание на Ubuntu в Proxmox

## 1. Подготовка Ubuntu (на Proxmox)

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Nginx
sudo apt install nginx -y

# Устанавливаем curl (для тестирования)
sudo apt install curl -y
```

## 2. Загрузка сайта на сервер

### Вариант А: Через SCP (если у вас есть SSH доступ с локальной машины)
```bash
# На локальной машине (Windows с WSL или Git Bash):
scp -r ./concert-rental-site ubuntu@<IP_ВАШЕГО_СЕРВЕРА>:/home/ubuntu/
```

### Вариант Б: Копирование через Proxmox Console (если нет доступа)
1. В веб-интерфейсе Proxmox откройте консоль виртуальной машины
2. Создайте директорию:
```bash
mkdir -p ~/concert-rental-site
```
3. Вручную скопируйте содержимое файлов через консоль или используйте монтирование

## 3. Настройка Nginx

```bash
# Копируем сайт в директорию Nginx
sudo cp -r ~/concert-rental-site /var/www/

# Меняем права доступа
sudo chown -R www-data:www-data /var/www/concert-rental-site
sudo chmod -R 755 /var/www/concert-rental-site
```

### Создаем конфиг для Nginx:
```bash
sudo nano /etc/nginx/sites-available/prosound
```

Вставляем конфиг:
```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name _;
    
    root /var/www/concert-rental-site;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Активируем конфиг:
```bash
sudo ln -s /etc/nginx/sites-available/prosound /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

## 4. Запуск Nginx

```bash
# Проверяем синтаксис конфига
sudo nginx -t

# Перезагружаем Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 5. Проверка

```bash
# Внутри Ubuntu
curl http://localhost

# С вашего ПК (если есть доступ к сети)
# Откройте браузер и перейдите на: http://<IP_СЕРВЕРА>:80
```

## 6. Доступ из интернета (опционально)

Если хотите доступ с интернета:

### На маршрутизаторе:
1. Включить Port Forwarding: 80 на порт Nginx вашего сервера
2. Узнать внешний IP: https://whatismyip.com

### На Ubuntu (закрыть портами):
```bash
# Открыть порт 80
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Поставить SSL (Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --standalone -d your-domain.com
```

## 7. Структура проекта

```
/var/www/concert-rental-site/
├── index.html          # Главная страница
├── styles.css          # Стили
├── script.js           # JavaScript
└── assets/             # Папка для будущих фото/видео
    ├── images/         # Фотографии
    └── videos/         # Видео
```

## 8. Добавление фото и видео

1. Создайте папку `assets` в корне сайта:
```bash
mkdir -p /var/www/concert-rental-site/assets/{images,videos}
```

2. Загрузите фото через SCP:
```bash
scp -r ./фото/* ubuntu@<IP>:/var/www/concert-rental-site/assets/images/
```

3. Обновите HTML, добавив изображения в галерею

## Команды для быстрого доступа

```bash
# Просмотр логов Nginx
sudo journalctl -u nginx -f

# Перезагрузка Nginx
sudo systemctl restart nginx

# Статус Nginx
sudo systemctl status nginx

# Редактирование конфига
sudo nano /etc/nginx/sites-available/prosound
```

## Расширение в будущем

- **Добавить контактную форму с email**: установить PHP-FPM + PHP-Mail
- **Админ-панель**: добавить Node.js/Express или Python/Flask
- **Галерея**: использовать Lightbox или Swiper.js
- **Прайс-калькулятор**: расширить JavaScript функциональность
