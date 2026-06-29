# Учет заявок — локальный прототип

Локальная система учёта заявок на Node.js + Express + PostgreSQL.

Быстрый старт:

1. Установите Node.js (>=18) и npm.
2. Скопируйте `.env.example` в `.env` и при необходимости измените `DATABASE_URL`.
3. Запустите PostgreSQL локально или через Docker:

```bash
docker-compose up -d
```

4. Установите зависимости и запустите сервер:

```bash
npm install
npm run dev
```

5. Инициализируйте БД (выполните SQL из `migrations/init.sql`) или подключитесь к `psql` и выполните:

```sql
\i migrations/init.sql
\i migrations/seed.sql
```

API доступно по `http://localhost:3000/api/requests`.

Альтернатива — скрипт на Node.js, который выполнит миграции и сиды автоматически:

```bash
node scripts/init-db.js
```

Фронтенд: откройте `http://localhost:3000/` в браузере — простая SPA доступна на главной странице.

Схема БД: `migrations/schema.sql` (создаёт таблицы `objects`, `materials`, `requests`, `request_materials`).

Доп. API:
- `GET /api/materials` — список материалов
- `GET /api/objects` — список объектов
- `GET /api/requests/:id/materials` — материалы в заявке
- `POST /api/requests/:id/materials` — добавить материал в заявку (body: `material_id`, `quantity`, `note`)

- `POST /login` — простой вход (body: `login`, `password`) возвращает информацию о пользователе (без JWT). Пароли хранятся в сиде в открытом виде для простоты прототипа.
 - `POST /login` — простой вход (body: `login`, `password`) возвращает информацию о пользователе and sets a server session cookie.
 - `GET /login/me` — получить текущего пользователя по сессии.
 - `POST /login/logout` — выход (удаляет сессию).

Примеры добавления материала в заявку через curl:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"material_id":1,"quantity":2}' http://localhost:3000/api/requests/1/materials
```

