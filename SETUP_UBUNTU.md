# БЫСТРОЕ РАЗВЕРТЫВАНИЕ НА UBUNTU 24.04 + PROXMOX

## Шаг 1: На Ubuntu (в Proxmox консоли или SSH)

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Nginx
sudo apt install nginx -y

# Проверяем, что Nginx работает
sudo systemctl status nginx
```

## Шаг 2: Загрузка файлов на сервер

**Способ 1 (если есть SSH доступ с локальной машины):**
```bash
# На ВАШЕЙ локальной машине (Windows):
# Откройте PowerShell или Git Bash в папке concert-rental-site и выполните:

scp -r * ubuntu@192.168.1.100:/tmp/
# Замените 192.168.1.100 на IP вашего сервера
```

**Способ 2 (через консоль Proxmox):**
1. Откройте консоль ВМ в Proxmox
2. Выполните команды ниже для создания файлов

## Шаг 3: Установка сайта

```bash
# На Ubuntu выполните:

# Создаем папку для сайта
sudo mkdir -p /var/www/concert-rental-site

# Копируем файлы (если загружали через SCP)
sudo cp /tmp/index.html /var/www/concert-rental-site/
sudo cp /tmp/styles.css /var/www/concert-rental-site/
sudo cp /tmp/script.js /var/www/concert-rental-site/
sudo cp -r /tmp/assets /var/www/concert-rental-site/

# Или создаем файлы вручную через nano:
# sudo nano /var/www/concert-rental-site/index.html
# sudo nano /var/www/concert-rental-site/styles.css
# sudo nano /var/www/concert-rental-site/script.js

# Устанавливаем правильные права доступа
sudo chown -R www-data:www-data /var/www/concert-rental-site
sudo chmod -R 755 /var/www/concert-rental-site
```

## Шаг 4: Конфигурация Nginx

```bash
# Удаляем дефолтный конфиг
sudo rm /etc/nginx/sites-enabled/default

# Создаем новый конфиг
sudo nano /etc/nginx/sites-available/prosound
```

Вставляем этот текст:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    root /var/www/concert-rental-site;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 7d;
    }
}
```

Сохраняем: `Ctrl+X` → `Y` → `Enter`

## Шаг 5: Запуск

```bash
# Активируем конфиг
sudo ln -s /etc/nginx/sites-available/prosound /etc/nginx/sites-enabled/

# Проверяем конфиг на ошибки
sudo nginx -t

# Перезагружаем Nginx
sudo systemctl restart nginx

# Проверяем статус
sudo systemctl status nginx
```

## Шаг 6: Доступ к сайту

1. **На сервере Ubuntu:**
   ```bash
   curl http://localhost
   ```

2. **С вашего компьютера в локальной сети:**
   - Откройте браузер
   - Перейдите на: `http://192.168.1.100` (замените IP)

3. **Узнайте IP сервера:**
   ```bash
   hostname -I
   ```

## Шаг 7: Просмотр логов

```bash
# Если что-то не работает:
sudo tail -f /var/log/nginx/error.log
sudo systemctl restart nginx
```

## ДОПОЛНИТЕЛЬНО: Проброс портов (интернет доступ)

Если хотите доступ с интернета:

1. **В Proxmox VE**: поставьте статический IP для ВМ
2. **В маршрутизаторе**: включите Port Forwarding (WAN 80 → LAN IP:80)
3. **На Ubuntu**: откройте порт
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw enable
   ```

## Тестирование

Проверьте, что все работает:
- [ ] Главная страница загружается
- [ ] Работает навигация
- [ ] Форма отправляет данные (проверьте DevTools)
- [ ] Стили загружаются (нет оранжевого "!)

## Команды на скорую руку

```bash
# Перезагрузить Nginx
sudo systemctl restart nginx

# Проверить статус
sudo systemctl status nginx

# Включить Nginx при загрузке
sudo systemctl enable nginx

# Просмотреть конфиг
cat /etc/nginx/sites-available/prosound

# Редактировать конфиг
sudo nano /etc/nginx/sites-available/prosound
```

## СЛЕДУЮЩЕЕ: Добавление фото/видео

Когда предоставите папку с фото:
```bash
# На локальной машине:
scp -r ./фото/* ubuntu@192.168.1.100:/var/www/concert-rental-site/assets/images/
scp -r ./видео/* ubuntu@192.168.1.100:/var/www/concert-rental-site/assets/videos/
```

Затем обновите `index.html` для отображения реальных фото вместо иконок.

---

**Вопросы?** Проверьте DEPLOYMENT.md или README.md в проекте.
