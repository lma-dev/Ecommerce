# Backend Documentation

## Overview

This directory hosts the Laravel API that powers the ecommerce experience.  
It exposes REST endpoints for the admin console and the customer storefront, handles authentication, and dispatches real‑time order events through broadcasting channels.

## Architecture

- **Framework:** Laravel 12 (RESTful HTTP API)
- **Pattern Highlights:** Thin controllers → application “UseCase” actions, resource transformers, form request validation, and repository‑free Eloquent models.
- **Runtime Services:** MySQL, Laravel Horizon/queue (optional), Laravel Reverb broadcaster, Cloudinary uploads proxied via the frontend.

## Design Patterns

- **Command/Action classes:** `App\UseCases\*` encapsulate business operations (Create/Update/Delete Order, etc.).
- **Form Request validation:** `App\Http\Requests\*` centralise validation and authorization rules.
- **Resource Transformers:** `App\Http\Resources\*` shape API payloads consumed by the Next.js frontend.
- **Helper Facades:** `App\Helpers\ResponseHelper` standardises API envelopes and metadata.

## Folder Structure

```
app/
├── Helpers/              # Shared helpers (API responses, formatting)
├── Http/
│   ├── Controllers/      # Route controllers for Admin & Customer APIs
│   ├── Middleware/
│   ├── Requests/         # Form requests used for validation/authorisation
│   └── Resources/        # JSON resources returned to the frontend
├── Models/               # Eloquent models and relationships
├── UseCases/             # Application actions / command classes
config/                   # Environment specific configuration
database/
├── factories/            # Model factories for tests/seeders
├── migrations/           # Schema definition
└── seeders/              # Database seeders
routes/
├── api/                  # Versioned API routes (admin/customer)
└── console.php           # Artisan commands
tests/
├── Feature/              # HTTP/API feature tests
└── Unit/                 # (reserved for pure unit tests)
```

## Third-Party Services & Libraries

- **Laravel Reverb** – WebSocket broadcasting for order updates  
  https://pusher.com/
- **Laravel Echo** – JavaScript client consumed by the frontend for realtime events  
  https://laravel.com/docs/broadcasting#client
- **Cloudinary** – Media storage & image transformations (uploads initiated from the frontend)  
  https://cloudinary.com/
- **Laravel Sanctum** – API token & SPA authentication  
  https://laravel.com/docs/sanctum

## Local Development

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Using Docker

```bash
# From /backend
docker compose up -d --build app queue reverb nginx mysql
docker compose exec app php artisan migrate --seed
```

- API base URL: `http://localhost:8000`
- Reverb websockets (proxied by Nginx): `ws://localhost:8000` (upgrade route `/`)

## Testing

```bash
php artisan test
```

Useful targeted runs:

- `php artisan test --filter=CatalogTest`
- `php artisan test --filter=OrdersTest`

## To-Do

- [ ] Harden broadcast events with integration tests.
- [ ] Add API rate limiting policies per client type.
- [ ] Document Horizon/queue deployment recommendations.
- [ ] Expand seeder coverage for catalogue/product imagery.
