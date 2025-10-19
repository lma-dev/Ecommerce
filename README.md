# Ecommerce Monorepo Commands

This project runs a Laravel 11 backend (PHP-FPM) and a Next.js frontend side by side via Docker Compose. Below are the commands you will run most often while developing or debugging the Sanctum SPA flow.

## 1. Boot the stack

```bash
# Run to start all services (backend and frontend)
docker compose up --build

# Run outstanding migrations
docker compose exec backend php artisan migrate

# Manually seed a specific class
docker compose exec backend php artisan db:seed

# Need to run queue worker for mail sending and realtime order system
docker compose exec backend php artisan queue:work

```

- Backend is exposed on `http://localhost:8000`
- Frontend dev server is on `http://localhost:3000`
- MySQL 8 listens on `localhost:3306`

Stop everything with `CTRL+C` or `docker compose down`.

## 2. For Testing Backend

```bash
# Run backend test suite
docker compose exec backend php artisan test
```

## 3. Seed sample data

Database seeds live in `backend/database/seeders`. The default `DatabaseSeeder` wires every child seeder (users, categories, etc.).

```bash
# To fresh database + seed everything in DatabaseSeeder
docker compose exec backend php artisan migrate:fresh --seed
```

## 4. Frontend scripts

```bash
# Lint (from frontend directory)
pnpm lint

```

## 5. Troubleshooting checklist

- `.env` files match the documented values (APP_URL, SESSION_*, SANCTUM_STATEFUL_DOMAINS, FRONTEND_URL)
- Docker containers are healthy (`docker compose ps`)
- Browser cookies for `localhost` are cleared after cache refreshes
- `/sanctum/csrf-cookie` sets both `XSRF-TOKEN` and `laravel-session`
- `/api/customer/login` returns 200/401/403 instead of 419

Use this file as the single source of truth for the commands you need during local development.
