# 🧠 Next.js + TypeScript + Laravel API Monorepo (v1)

A scalable frontend for the Yaung Kya Ml ecommerce platform. The app is built with **Next.js (App Router)** and communicates with the Laravel API for authentication, catalogue management, and realtime order updates.

- 🌐 Locale-aware routing without page refreshes.
- 🧹 Feature/version driven folder layout (`/v1`).
- 🔒 Middleware protected routes (customer vs. console).
- ⚙️ Dedicated API client abstraction + TanStack Query caching.
- 🧪 Zod validation for forms and server payloads.
- 🎨 Tailwind CSS + shadcn/ui + Lucide icons.
- 📡 Realtime updates via Pusher + Laravel Echo bridge.
- ✍️ Typesafe alias-based imports.

---

## 🧱 Architecture Definition

- **Framework:** Next.js 14 App Router (React Server Components hybrid).
- **State / Data:** TanStack Query for API data, Zustand for light client state, React Context for auth/session.
- **Data Flow:** REST requests via Axios → Laravel API. Subscriptions handled with Laravel Echo (Pusher transport).
- **Rendering:** Locale segmented layouts under `app/[locale]`, leveraging Next.js nested routing and streaming.
- **Validation:** Zod schemas shared between forms and API response guards.

## 🧩 Design Patterns

- **Feature Modules:** Each `app/[locale]/(pages)/v1/<feature>` directory encapsulates UI, hooks, schemas, and translations for that feature.
- **Hooks as Composition Units:** `useRealtimeOrders`, `useCustomerOrders`, etc. abstract side-effects and caching.
- **UI Composition:** shadcn/ui primitives wrapped into domain-specific components (e.g. `OrderTable`, `ConfirmDialog`).
- **Service Layer:** API methods live under `src/features/*/api.ts` to centralise HTTP calls and response parsing.

## 📁 Folder Structure (v1)

```
public/
src/
├── app/
│   ├── [locale]/
│   │   ├── (pages)/v1/            # Versioned, localized routes (admin + customer)
│   │   └── layout.tsx             # Locale-aware root layout
│   ├── api/                       # Next.js route handlers (proxy/auth helpers)
│   └── layout.tsx                 # Global root layout
├── components/ui/                 # Shadcn based primitives
├── features/                      # Domain slices (orders, customers, products, etc.)
│   ├── api.ts                     # REST calls + zod parsing
│   ├── schemas/                   # Input/output validation
│   └── hooks/                     # Feature specific hooks
├── libs/                          # Cross-cutting utilities (axios, echo, auth, assets)
├── messages/                      # i18n dictionaries (en/jp/mm)
├── constants/                     # Shared enums/constants
├── styles/                        # Tailwind & global styles
└── types/                         # Shared TypeScript types
.env.example
next.config.ts
pnpm-lock.yaml
tsconfig.json
```

| Area            | Stack                                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| Frontend        | [Next.js (App Router)](https://nextjs.org/docs/app) + TypeScript               |
| Styling         | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Icons           | [Lucide Icons](https://lucide.dev/)                                            |
| API Fetching    | [TanStack Query](https://tanstack.com/query/v5) + Axios                        |
| Auth            | [Lucia Auth](https://lucia-auth.com/) + Laravel API                            |
| Validation      | [Zod](https://zod.dev/)                                                        |
| Localization    | [next-intl](https://next-intl-docs.vercel.app/) (no page reloads)              |
| Backend         | [Laravel API](https://laravel.com/)                                            |
| Package Manager | [pnpm](https://pnpm.io/)                                                       |
| Tables          | [TanStack Table](https://tanstack.com/table/v8)                                |
| Versioning      | URL-based (`/v1`) route versioning                                             |
| Alias Imports   | TypeScript path aliases (`@components`, `@lib`, etc.)                          |
| Storybook       | (optional) Component-driven dev                                                |

---

## 🔌 Third-Party Services & Libraries

- **Pusher** – Realtime order updates through Laravel Echo  
  https://pusher.com/
- **Cloudinary** – Image upload & optimisation for catalogue assets  
  https://cloudinary.com/
- **next-intl** – Internationalisation with locale-prefixed routes  
  https://next-intl-docs.vercel.app/
- **sonner** – Toast notifications for UX feedback  
  https://sonner.emilkowal.ski/
- **shadcn/ui** – Accessible UI primitives built on Radix  
  https://ui.shadcn.com/

---

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
````

---

## 🐳 Docker

```bash
# 1. Create your environment file (optional but recommended)
cp .env.example .env.local

# 2. Build the production image
docker build -t yaung-kya-ml .

# 3. Run the container with your env vars and expose port 3000
docker run --env-file .env.local -p 3000:3000 htain-thein-fe
```

The container runs `pnpm start`, so it serves the pre-built app on port `3000`.

---

## 🔐 Auth & Middleware

* **Next Auth**: Manages sessions, tokens, and user states (customer + console modes).
* **`middleware.ts`**: Handles route protection and locale redirection.
* Extendable with role-based guards inside `src/app/_middleware/`.

---

## 🌍 Localization

* Powered by [`next-intl`](https://next-intl-docs.vercel.app/)
* Supports URL-based languages like `/en/v1/dashboard`, `/ja/v1/login`
* No page refresh when switching languages

---

## 🧪 Validation

Each form or feature can include a Zod schema locally:

```
src/
└── app/
    └── [locale]/v1/(pages)/login/
        ├── LoginForm.tsx
        └── schema.ts         ← Zod validation schema
```

---

## 🔁 Import Aliases

Configured in `tsconfig.json`:

```json
{
  "@components/*": ["src/_components/*"],
  "@lib/*": ["src/_libs/*"],
  "@services/*": ["src/_services/*"],
  "@schemas/*": ["src/_schemas/*"],
  "@enums/*": ["src/_enums/*"],
  "@utils/*": ["src/_utils/*"],
  "@types/*": ["src/types/*"]
}
```

---

## 🔀 Versioning Support

Easily maintain multiple frontend versions in parallel:

```
src/app/[locale]/v1/    ← Current version
src/app/[locale]/v2/    ← Future version
```

---

## ✅ To-Do

* [ ] Add CI/CD GitHub Actions.
* [ ] Introduce automated UI testing (Playwright).
* [ ] Implement dark mode toggle with persisted preference.
* [ ] Document realtime event channel contracts.
* [ ] Add story coverage for key shadcn-based components.

---

## 📄 License

MIT — Free to use and modify.

---

**Repo:** `htain-thein-fe-new`

 
