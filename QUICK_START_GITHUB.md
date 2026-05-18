# БЫСТРЫЙ СТАРТ - GitHub + Удаленное редактирование

## 1️⃣ Создать репо на GitHub (5 мин)

1. Откройте https://github.com/new
2. Назовите: `concert-rental-site`
3. Нажмите "Create repository"
4. **Скопируйте команды из раздела "…or push an existing repository from the command line"**

## 2️⃣ Загрузить на GitHub (с вашего ПК)

```bash
# Замените YOUR_USERNAME на ваш ник GitHub
git remote add origin https://github.com/YOUR_USERNAME/concert-rental-site.git
git branch -M main
git push -u origin main
```

Готово! Проект на GitHub 🎉

## 3️⃣ На Ubuntu сервере - установить Git

```bash
sudo apt install git -y
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/concert-rental-site.git
sudo chown -R www-data:www-data concert-rental-site
```

## 4️⃣ Автоматические обновления (выберите 1 вариант)

### Способ А: Каждый час (Cron) ⭐ ПРОСТОЙ

```bash
# Создайте скрипт
sudo nano /usr/local/bin/update-site.sh
```

Вставьте:
```bash
#!/bin/bash
cd /var/www/concert-rental-site
git pull origin main
systemctl restart nginx
```

```bash
# Дайте права
sudo chmod +x /usr/local/bin/update-site.sh

# Добавьте в расписание
sudo crontab -e
```

Добавьте строку:
```
0 * * * *  /usr/local/bin/update-site.sh
```

### Способ Б: Вручную (когда нужно обновить)

```bash
cd /var/www/concert-rental-site
sudo git pull origin main
sudo systemctl restart nginx
```

## 5️⃣ Удаленное редактирование (на вашем ПК)

```bash
# Клонируйте проект
git clone https://github.com/YOUR_USERNAME/concert-rental-site.git

# Откройте в VS Code
code concert-rental-site

# После редактирования:
git add .
git commit -m "Обновил контакты"
git push

# На сервере обновится автоматически (через Cron) ✓
```

## ✅ Проверить, что все работает

```bash
# На сервере
ssh ubuntu@192.168.1.100
cd /var/www/concert-rental-site
git log --oneline        # Должны видеть коммиты
git remote -v            # Должен быть origin → GitHub

# Проверить в браузере
# http://192.168.1.100
```

## 📝 Типичный workflow

```bash
# На ПК локально:
git clone https://github.com/YOUR_USERNAME/concert-rental-site.git
cd concert-rental-site

# Редактируете файлы в VS Code...

# Сохраняете на GitHub
git add .
git commit -m "Изменил прайс"
git push

# На сервере автоматически обновится!
# Обновление происходит по расписанию Cron (каждый час)
# Или используйте: sudo /usr/local/bin/update-site.sh
```

---

**Вопросы?** Смотрите полный гайд: `GITHUB_WORKFLOW.md`
