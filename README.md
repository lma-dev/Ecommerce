# Ecommerce Monorepo Commands

This project runs a Laravel 12 backend and a Next.js frontend side by side via Docker Compose. Below are the commands you will run most often while developing or debugging the Sanctum SPA flow.

## 1. Boot the stack

```bash
# Start API, frontend, Reverb, and MySQL containers (detached)
docker compose up -d --build backend frontend reverb mysql

# Run outstanding migrations (once services are healthy)
docker compose exec backend php artisan migrate

# Manually seed a specific class
docker compose exec backend php artisan db:seed

# run realtime websockets (runs inside the backend container)
docker compose exec backend php artisan reverb:start

# Kick off a queue worker (runs inside the backend container)
docker compose exec backend php artisan queue:work
```

- Backend API: `http://localhost:8000`
- Frontend dev server: `http://localhost:3000`
- Reverb websockets: `ws://localhost:6001` (proxied via `ws.<domain>` when using Nginx)
- MySQL 8: `localhost:3306`

- Console Login 
`http://localhost:3000/en/login?type=console`

- Customer Login 
`http://localhost:3000/en`


Stop everything with `docker compose down` (add `-v` to drop volumes).

## 2. For Testing Backend

```bash
docker compose exec backend php artisan test
```

## 3. Seed sample data

Database seeds live in `backend/database/seeders`. The default `DatabaseSeeder` wires every child seeder (users, categories, etc.).

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

## 4. Frontend scripts

```bash
# Lint (from frontend directory)
pnpm lint

# Run Storybook (from frontend directory)
pnpm storybook

# Run Storybook inside Docker (serves on http://localhost:6006)
docker compose run --rm -p 6006:6006 frontend \
  sh -c "corepack enable pnpm && pnpm install --config.allow-build=* && pnpm exec storybook dev -p 6006 --host 0.0.0.0"

# Run build & surface TypeScript errors inside Docker
docker compose run --rm frontend \
  sh -c "corepack enable pnpm && pnpm install --config.allow-build=* && pnpm run build"

```

## 5. Troubleshooting checklist

```bash
docker compose restart backend              # restart API without touching others
docker compose up -d --build backend        # rebuild/restart API after dependency changes
docker compose up -d --build frontend       # rebuild the Next.js app only
docker compose restart reverb               # restart websocket server
docker compose down                         # stop all services
docker compose down -v                      # stop everything and drop volumes
docker system prune -a --volumes            # nuke unused Docker resources (careful!)
```

- `.env` files match the documented values (APP_URL, SESSION_*, SANCTUM_STATEFUL_DOMAINS, FRONTEND_URL)
- Docker containers are healthy (`docker compose ps`)
- Browser cookies for `localhost` are cleared after cache refreshes
- `/sanctum/csrf-cookie` sets both `XSRF-TOKEN` and `laravel-session`
- `/api/customer/login` returns 200/401/403 instead of 419

Use this file as the single source of truth for the commands you need during local development.

## 6. Console Password
```bash
- gmail - superadmin@gmail.com
- password - 12345678

```
