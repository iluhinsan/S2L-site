# 🚀 START HERE - Полная инструкция

## Что вы получите

✅ Сайт-визитка с галереей, прайс-листом, формой заказа  
✅ Хостинг на собственном сервере (Ubuntu + Nginx)  
✅ GitHub репозиторий для управления кодом  
✅ Автоматические обновления при push  
✅ Возможность редактирования с любого компьютера  

---

## 📋 ЭТАП 1: Подготовка (5 минут)

### На GitHub
1. Перейдите https://github.com/new
2. Назовите репозиторий: `concert-rental-site`
3. Нажмите "Create repository"
4. **Скопируйте команды из раздела "…or push an existing repository"**

### На вашем ПК (Git Bash / PowerShell)

```bash
# Перейдите в папку проекта
cd "c:\Users\suppe\OneDrive\Документы\PlatformIO\Projects\123\concert-rental-site"

# Замените YOUR_USERNAME на свой ник GitHub
git remote add origin https://github.com/YOUR_USERNAME/concert-rental-site.git
git branch -M main
git push -u origin main

# Если просит пароль - используйте Personal Access Token (см. GITHUB_WORKFLOW.md)
```

✅ **Готово!** Ваш код теперь на GitHub

---

## 🖥️ ЭТАП 2: Развертывание на Ubuntu (10 минут)

### На Ubuntu сервере (в Proxmox)

**Первичная установка:**
```bash
# 1. Обновляем систему
sudo apt update && sudo apt upgrade -y

# 2. Устанавливаем Nginx и Git
sudo apt install nginx git -y

# 3. Клонируем репо (замените YOUR_USERNAME)
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/concert-rental-site.git

# 4. Даем права доступа
sudo chown -R www-data:www-data concert-rental-site
sudo chmod -R 755 concert-rental-site
```

**Конфигурируем Nginx:**
```bash
# Удаляем дефолтный конфиг
sudo rm /etc/nginx/sites-enabled/default

# Создаем новый
sudo nano /etc/nginx/sites-available/prosound
```

Вставляем этот текст:
```nginx
server {
    listen 80 default_server;
    root /var/www/concert-rental-site;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

Сохраняем: `Ctrl+X` → `Y` → `Enter`

```bash
# Активируем конфиг
sudo ln -s /etc/nginx/sites-available/prosound /etc/nginx/sites-enabled/

# Проверяем конфиг
sudo nginx -t

# Перезагружаем
sudo systemctl restart nginx
sudo systemctl enable nginx

# Проверяем
curl http://localhost
```

✅ **Готово!** Сайт доступен на `http://IP_ВАШЕГО_СЕРВЕРА`

---

## ⚙️ ЭТАП 3: Автоматические обновления (5 минут)

### Настройка Cron (автоматический pull каждый час)

```bash
# Создаем скрипт обновления
sudo nano /usr/local/bin/update-prosound.sh
```

Вставляем:
```bash
#!/bin/bash
cd /var/www/concert-rental-site
git pull origin main
systemctl restart nginx
echo "[$(date)] ProSound обновлен" >> /var/log/prosound-updates.log
```

```bash
# Даем права на выполнение
sudo chmod +x /usr/local/bin/update-prosound.sh

# Добавляем в расписание
sudo crontab -e

# Добавляем эту строку:
# 0 * * * * /usr/local/bin/update-prosound.sh
# (Это означает: каждый час в 00 минут)
```

✅ **Готово!** Теперь при каждом `git push` сайт обновится автоматически

---

## 🎨 ЭТАП 4: Первые изменения (тестирование)

### На вашем ПК

```bash
# Клонируйте проект (если еще не клонировали)
git clone https://github.com/YOUR_USERNAME/concert-rental-site.git
cd concert-rental-site

# Откройте в VS Code
code .

# Отредактируйте данные контактов (ctrl+f найти "Телефон"):
# Замените: +7 (999) 123-45-67 → ваш номер
# Замените: info@prosound.ru → ваш email
# Замените: Москва, ул. Примера, 123 → ваш адрес
# Замените: ProSound → название вашей компании

# Сохраняем изменения на GitHub
git add .
git commit -m "Обновил контактные данные компании"
git push origin main
```

### На сервере - обновляем

```bash
# Вариант 1: Ждем следующего часа (автоматически)

# Вариант 2: Обновляем вручную прямо сейчас
ssh ubuntu@192.168.1.100  # (замените IP вашего сервера)
sudo /usr/local/bin/update-prosound.sh
```

### Проверяем в браузере

```
http://192.168.1.100  # (или ваш IP)
```

✅ **Готово!** Контакты обновлены на сайте!

---

## 📸 ЭТАП 5: Добавление фото и видео

1. **Создайте папку** `assets` в корне проекта (уже создана)
2. **Загрузите фото** в `assets/images/`
3. **Обновите `index.html`** в галерее (замените иконки на реальные фото)
4. **Push на GitHub** и обновите сервер

Пример добавления фото:
```html
<div class="col-md-4">
    <img src="assets/images/equipment1.jpg" class="img-fluid rounded" alt="Оборудование">
</div>
```

---

## 📖 Дополнительные гайды

| Файл | Описание |
|------|---------|
| `QUICK_START_GITHUB.md` | Быстрый старт GitHub |
| `GITHUB_WORKFLOW.md` | Полный гайд по GitHub + Webhook |
| `SETUP_UBUNTU.md` | Детальная настройка Ubuntu |
| `DEPLOYMENT.md` | Развертывание и расширение |
| `README.md` | Описание проекта и структура |

---

## 🔄 Типичный день разработчика

```bash
# Утром: редактируете на ПК
code concert-rental-site
# (редактируете файлы в VS Code)

# Сохраняете на GitHub
git add .
git commit -m "Обновил цены"
git push

# ✓ Сайт обновится на сервере через час (или вручную запустите скрипт)

# Вечером: проверяете в браузере
# http://192.168.1.100
```

---

## ❓ Быстрые ответы

**Как узнать IP сервера?**
```bash
# На Ubuntu
hostname -I
```

**Как проверить логи Nginx?**
```bash
sudo tail -f /var/log/nginx/error.log
```

**Как перезагрузить вручную?**
```bash
cd /var/www/concert-rental-site
sudo git pull origin main
sudo systemctl restart nginx
```

**Что если есть конфликт при pull?**
```bash
git stash
git pull origin main
git stash pop
```

---

## 🎯 Checklist по завершении

- [ ] Репо создано на GitHub
- [ ] Код загружен на GitHub (`git push`)
- [ ] Ubuntu 24.04 установлена на Proxmox
- [ ] Nginx установлен и запущен
- [ ] Сайт доступен по IP на порту 80
- [ ] Скрипт обновления создан
- [ ] Cron настроен
- [ ] Контактные данные обновлены
- [ ] Первый push сделан и работает обновление

---

**Все готово! 🎉**

Теперь вы можете:
- 📝 Редактировать сайт с любого компьютера
- 🚀 Загружать изменения на GitHub
- 🔄 Видеть автоматические обновления на сервере
- 📸 Добавлять фото и видео
- 🌐 Расширять функциональность по мере роста компании

**Начните с контактных данных (ЭТАП 4) - это займет 5 минут!**
