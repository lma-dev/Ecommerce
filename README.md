# Ecommerce Monorepo Commands

This project runs a Laravel 11 backend (PHP-FPM) and a Next.js frontend side by side via Docker Compose. Below are the commands you will run most often while developing or debugging the Sanctum SPA flow.

## 1. Boot the stack

```bash
docker compose up --build
```

- Backend is exposed on `http://localhost:8000`
- Frontend dev server is on `http://localhost:3000`
- MySQL 8 listens on `localhost:3306`

Stop everything with `CTRL+C` or `docker compose down`.

## 2. Refresh Laravel caches after changing `.env`

Always run this inside the backend container so the cached config picks up new values:

```bash
docker compose exec backend sh -lc 'php artisan config:clear && php artisan cache:clear && php artisan route:clear'
docker compose restart backend
```

Then clear `localhost` cookies in your browser to drop stale `laravel-session` values.

## 3. Sanctum self-test (curl)

```bash
rm -f cookies.txt

# Fetch CSRF cookie
curl -i -H "Origin: http://localhost:3000" \
     -c cookies.txt -b cookies.txt \
     http://localhost:8000/sanctum/csrf-cookie

# Open cookies.txt, URL-decode the XSRF-TOKEN value, and reuse it below
curl -i -H "Origin: http://localhost:3000" \
     -H "Content-Type: application/json" \
     -H "X-XSRF-TOKEN: <decoded token>" \
     -c cookies.txt -b cookies.txt \
     -X POST http://localhost:8000/api/customer/login \
     --data '{"email":"test@example.com","password":"secret"}'
```

Expected responses:
- 200 → login OK
- 401/403 → auth blocked but CSRF intact
- 419 → check cookies, `SANCTUM_STATEFUL_DOMAINS`, and rerun the cache clear commands

## 4. Useful artisan helpers

```bash
# Run backend test suite
docker compose exec backend php artisan test

# Run outstanding migrations
docker compose exec backend php artisan migrate

# Manually seed a specific class
docker compose exec backend php artisan db:seed
```

## 5. Run the queue worker

Laravel queues are processed asynchronously, so keep a dedicated terminal tab for the worker:

```bash
docker compose exec backend php artisan queue:work
```

- Leave the worker running while developing; stop it with `CTRL+C`.
- When you change queueable code, run `docker compose exec backend php artisan queue:restart` so the worker reloads the new code.
- If you expect failed jobs, inspect them with `docker compose exec backend php artisan queue:failed`.

## 6. Seed sample data

Database seeds live in `backend/database/seeders`. The default `DatabaseSeeder` wires every child seeder (users, categories, etc.).

```bash
# Fresh database + seed everything in DatabaseSeeder
docker compose exec backend php artisan migrate:fresh --seed

# Seed the full DatabaseSeeder on an existing schema
docker compose exec backend php artisan db:seed
```

Update `DatabaseSeeder` whenever you add new seed classes so the full environment stays consistent. Seeder runs are idempotent—rerun them whenever you reset or stand up a new database.

## 7. Frontend scripts

```bash
# Lint (from frontend directory)
pnpm lint

```

## 8. Troubleshooting checklist

- `.env` files match the documented values (APP_URL, SESSION_*, SANCTUM_STATEFUL_DOMAINS, FRONTEND_URL)
- Docker containers are healthy (`docker compose ps`)
- Browser cookies for `localhost` are cleared after cache refreshes
- `/sanctum/csrf-cookie` sets both `XSRF-TOKEN` and `laravel-session`
- `/api/customer/login` returns 200/401/403 instead of 419

Use this file as the single source of truth for the commands you need during local development.
