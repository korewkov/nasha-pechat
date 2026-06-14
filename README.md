# Наша печать — лендинг домашней полиграфии

Next.js + TypeScript лендинг с интерактивной галереей, калькулятором стоимости, формой заявки и API route для отправки в Google Таблицу.

## Запуск локально

```bash
npm install
npm run dev
```

Сайт откроется на `http://localhost:3000`.

Для production-проверки:

```bash
npm run build
npm start
```

## Фотографии и мокапы

Текущие изображения лежат в:

- `public/brand` — брендборды и крупные визуальные композиции;
- `public/works` — фотографии карточек галереи.

Чтобы заменить фото, положите новые файлы в `public/works` и обновите массив `works` в `src/config/works.config.ts`.

## Как поменять цены

Все цены и коэффициенты лежат в `src/config/pricing.config.ts`:

- `services` — базовая цена услуги;
- `formats` — коэффициенты форматов;
- `papers` — коэффициенты бумаги;
- `extras` — фиксированная стоимость доп. услуг;
- `quantityDiscounts` — скидки от количества.

Калькулятор пересчитывает цену автоматически.

## Форма и Google Таблица

1. Скопируйте `.env.example` в `.env.local`.
2. Настройте Google Apps Script по инструкции в `GOOGLE_SHEETS_SETUP.md`.
3. Вставьте URL Web App в `GOOGLE_SHEETS_WEBHOOK_URL`.
4. Перезапустите dev server.

Если `GOOGLE_SHEETS_WEBHOOK_URL` пустой, API работает в mock-режиме: форма покажет успешную отправку, но строка в таблицу не попадёт.

## Где заменить mock data

- Реальные работы: `src/config/works.config.ts`;
- Реальные отзывы: `reviews` в `src/config/works.config.ts`;
- Контакты и мессенджеры: кнопка финального CTA и текст формы в `src/components/FinalCTA.tsx`, `src/components/OrderForm.tsx`;
- Цены: `src/config/pricing.config.ts`.
