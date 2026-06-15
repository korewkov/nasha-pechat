# Подключение Google Таблицы

## 1. Создайте таблицу

Создайте Google Таблицу и добавьте строку заголовков:

```txt
Дата и время | Имя | Телефон | Telegram / MAX / ВК | Тип услуги | Формат | Количество | Бумага | Дополнительные услуги | Есть ли макет | Срочность | Предварительная стоимость | Промокод | Комментарий | Источник заявки | Статус
```

## 2. Откройте Apps Script

В таблице выберите `Расширения -> Apps Script` и вставьте код:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.createdAt,
    data.name,
    data.phone,
    data.messenger,
    data.service,
    data.format,
    data.quantity,
    data.paper,
    data.extras,
    data.hasDesign,
    data.urgency,
    data.estimatedPrice,
    data.promoCode,
    data.comment,
    data.source,
    data.status || "Новая заявка"
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Опубликуйте Web App

1. Нажмите `Deploy -> New deployment`.
2. Тип выберите `Web app`.
3. `Execute as`: `Me`.
4. `Who has access`: `Anyone`.
5. Нажмите `Deploy` и скопируйте Web App URL.

## 4. Добавьте URL в проект

Создайте `.env.local`:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Перезапустите `npm run dev`.

## 5. Проверьте отправку

Откройте сайт, заполните форму и отправьте заявку. В таблице должна появиться новая строка со статусом `Новая заявка`.

Если таблица недоступна, сайт покажет ошибку отправки. Если URL не задан, проект работает в mock-режиме.
