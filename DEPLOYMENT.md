# 🚀 Деплой игры "Накорми Семёна"

## Быстрый старт

```bash
# Запуск локально
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр production сборки
npm run preview
```

## Деплой на GitHub Pages

### Вариант 1: Автоматический деплой через GitHub Actions

1. Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

2. В настройках репозитория:
   - Settings → Pages
   - Source: "GitHub Actions"
   - Сохраните

3. Push в main ветку запустит автоматический деплой!

### Вариант 2: Ручной деплой

```bash
# Соберите проект
npm run build

# Установите gh-pages
npm install -D gh-pages

# Добавьте в package.json:
# "deploy": "gh-pages -d dist"

# Деплой
npm run deploy
```

### Вариант 3: Через Vercel (рекомендуется для простоты)

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. Vercel автоматически определит Vite проект
4. Деплой произойдёт автоматически!

## Настройка base URL

Если ваша игра будет в поддиректории (например, `username.github.io/game/`):

1. Обновите `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/game/', // Замените на имя вашего репозитория
})
```

2. Пересоберите: `npm run build`

## Проверка перед деплоем

✅ **Чек-лист:**

- [ ] Все ассеты находятся в `public/assets/`
- [ ] `npm run build` проходит без ошибок
- [ ] `npm run preview` показывает рабочую игру
- [ ] Видео `intro_video.mp4` загружено
- [ ] Все изображения и звуки на месте
- [ ] `vite.config.ts` имеет правильный `base`

## Оптимизация для продакшена

### Сжатие ассетов

```bash
# Оптимизация изображений
npm install -D imagemin imagemin-mozjpeg imagemin-pngquant
```

### Preload критичных ресурсов

Добавьте в `index.html`:
```html
<link rel="preload" href="/assets/images/background.png" as="image">
<link rel="preload" href="/assets/sounds/background_music.mp3" as="audio">
```

### Включение Service Worker (PWA)

```bash
npm install -D vite-plugin-pwa
```

Обновите `vite.config.ts`:
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Накорми Семёна',
        short_name: 'Семён',
        description: 'Образовательная игра для детей',
        theme_color: '#F59E0B',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## Мониторинг и аналитика

### Google Analytics

Добавьте в `index.html`:
```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Troubleshooting

### Проблема: Ассеты не загружаются после деплоя

**Решение:** Проверьте `base` в `vite.config.ts` и пути к ассетам

### Проблема: Видео не воспроизводится

**Решение:** 
- Проверьте формат видео (MP4 H.264)
- Уменьшите размер видео (<10MB)
- Добавьте fallback изображение

### Проблема: Белый экран после деплоя

**Решение:**
- Проверьте консоль браузера (F12)
- Убедитесь что `base` в vite.config правильный
- Проверьте что все ассеты скопировались в `dist/`

## Домен

### Кастомный домен для GitHub Pages

1. Купите домен
2. Создайте файл `public/CNAME`:
```
yourdomain.com
```

3. Настройте DNS:
```
A запись: 185.199.108.153
A запись: 185.199.109.153
A запись: 185.199.110.153
A запись: 185.199.111.153
```

---

**Готово! Ваша игра онлайн! 🎮🎉**

