# GitHub + Удаленное редактирование

## Шаг 1: Создание репозитория на GitHub

1. **Перейти на** https://github.com/new
2. **Заполнить:**
   - Repository name: `concert-rental-site` (или ваше имя)
   - Description: `ProSound - Concert equipment rental website`
   - Visibility: `Public` (или `Private` если нужно)
   - **НЕ инициализируйте с README, .gitignore, лицензией** (уже есть)
3. **Нажать "Create repository"**

## Шаг 2: Привязать локальный репо к GitHub

На вашем компьютере (в папке проекта):

```bash
# Добавляем удаленный репозиторий
git remote add origin https://github.com/ВАШ_ЮЗЕР/concert-rental-site.git

# Переименовываем ветку (GitHub использует main по умолчанию)
git branch -M main

# Загружаем на GitHub
git push -u origin main
```

**Если просит аутентификацию:**
- GitHub больше не поддерживает пароли в git
- Используйте **Personal Access Token (PAT)**:
  1. https://github.com/settings/tokens
  2. "Generate new token"
  3. Выбрать `repo` scope
  4. Скопировать и вставить как пароль при `git push`

Или используйте **SSH** (более удобно):
```bash
# Генерируем SSH ключ (если нет)
ssh-keygen -t ed25519 -C "your.email@example.com"

# Копируем публичный ключ
cat ~/.ssh/id_ed25519.pub

# Добавляем на GitHub: https://github.com/settings/keys → "New SSH key"
# Потом меняем URL:
git remote set-url origin git@github.com:ВАШ_ЮЗЕР/concert-rental-site.git
```

## Шаг 3: Настройка автоматических обновлений на Ubuntu

### Вариант 1: Ручной pull (простой)

На сервере Ubuntu:
```bash
# Клонируем репозиторий
cd /var/www
sudo git clone https://github.com/ВАШ_ЮЗЕР/concert-rental-site.git

# Даем права
sudo chown -R www-data:www-data concert-rental-site

# Для обновления выполняем:
cd /var/www/concert-rental-site
sudo git pull origin main
sudo systemctl restart nginx
```

### Вариант 2: Автоматический pull через Cron (рекомендуется)

На Ubuntu сервере:
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

Сохраняем: `Ctrl+X` → `Y` → `Enter`

```bash
# Даем права на выполнение
sudo chmod +x /usr/local/bin/update-prosound.sh

# Добавляем в cron (каждый час)
sudo crontab -e
```

Добавляем строку:
```
0 * * * * /usr/local/bin/update-prosound.sh
```

(Это будет запускаться каждый час в 00 минут)

Другие варианты cron:
```
*/15 * * * *  # Каждые 15 минут
0 */6 * * *   # Каждые 6 часов
0 9 * * *     # Каждый день в 9:00
```

### Вариант 3: GitHub Webhook (продвинутый)

Создать автоматический pull при push на GitHub:

1. **На сервере настройте SSH доступ:**
```bash
# Генерируем ключ для сервера
sudo -u www-data ssh-keygen -t ed25519 -f /var/www/.ssh/id_ed25519 -N ""

# Выводим публичный ключ
sudo cat /var/www/.ssh/id_ed25519.pub

# Добавляем на GitHub: https://github.com/settings/keys → "New SSH key"
# (выбираем "Allow write access to repositories")
```

2. **На GitHub добавите Webhook:**
   - Repo → Settings → Webhooks → "Add webhook"
   - Payload URL: `http://ВАШ_IP:9000/` (нужен PHP скрипт)
   - Content type: `application/json`

3. **PHP скрипт для обработки webhook:**
```php
<?php
// /var/www/concert-rental-site/webhook.php
$secret = 'ВАШ_SECRET_ИЗ_GITHUB';
$payload = file_get_contents('php://input');
$sig = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (hash_equals($sig, $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '')) {
    chdir('/var/www/concert-rental-site');
    shell_exec('git pull origin main 2>&1');
    shell_exec('systemctl restart nginx 2>&1');
    echo "OK";
} else {
    http_response_code(403);
    echo "Forbidden";
}
?>
```

## Шаг 4: Удаленное редактирование (VS Code + Git)

Можно редактировать на любом компьютере:

```bash
# Клонируйте репо на ноутбук
git clone https://github.com/ВАШ_ЮЗЕР/concert-rental-site.git

# Откройте в VS Code
code concert-rental-site

# После изменений:
git add .
git commit -m "Обновил описание услуг"
git push origin main

# На сервере автоматически обновится (если настроен Cron или Webhook)
```

## Команды для частого использования

```bash
# Посмотреть статус изменений
git status

# Добавить все файлы
git add .

# Создать коммит
git commit -m "Описание изменений"

# Загрузить на GitHub
git push origin main

# Скачать обновления с GitHub
git pull origin main

# Посмотреть историю
git log --oneline
```

## Структура в GitHub

```
concert-rental-site/
├── .git/                  # Git история
├── .gitignore             # Исключенные файлы
├── index.html             # Основная страница
├── styles.css             # Стили
├── script.js              # JavaScript
├── assets/                # Папка для фото/видео
├── SETUP_UBUNTU.md        # Гайд по развертыванию
├── DEPLOYMENT.md          # Детальная инструкция
├── README.md              # Описание проекта
└── GitHub_WORKFLOW.md     # ЭТА ИНСТРУКЦИЯ
```

## Решение проблем

**Ошибка: "Repository not found"**
- Проверьте URL репозитория: `git remote -v`
- Убедитесь, что репо на GitHub создано
- Проверьте права доступа (SSH ключ или PAT)

**Конфликт при pull**
```bash
# Если есть локальные изменения на сервере
git stash              # Сохранить локальные изменения
git pull origin main   # Загрузить с GitHub
git stash pop          # Вернуть локальные изменения
```

**Нужно откатить изменения**
```bash
# Откатить последний коммит
git revert HEAD

# Откатить на конкретный коммит
git checkout abc1234 .

# Просмотреть коммиты
git log --oneline
```

---

**Рекомендуемый workflow:**
1. Редактируете файлы локально в VS Code
2. `git add .` → `git commit -m "..."` → `git push`
3. На сервере автоматически обновляется через Cron/Webhook
4. Проверяете в браузере

Готово! 🚀
