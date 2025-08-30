# 🧠 Next.js + TypeScript + Laravel API Monorepo (v1)

A scalable, maintainable, and versioned frontend application using **Next.js (App Router)**, integrated with a **Laravel API backend**, supporting:

* 🌐 Localization (no page refresh)
* 🧹 Modular folder structure with versioning (`v1`)
* 🔒 Secure route middleware
* ⚙️ API service abstraction (Laravel)
* 🧪 Zod validation
* 🎨 Tailwind CSS + shadcn/ui + Lucide icons
* ⚛️ TanStack Query + Table
* ✍️ Alias-based imports
* 🔐 Next Auth

---

## 📁 Folder Structure (v1)

````
public/
src/
├── app/
│   ├── [locale]/(pages)/v1/       # Localized versioned route pages
│   │   ├── dashboard/              # Example feature folder
│   │   └── login/                  # Login feature folder
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Redirect entry point
│   └── favicon.ico                 # App icon
├── _components/                   # Shared UI components
├── _enums/                        # Centralized enums
├── _hooks/                        # Custom React hooks
├── _libs/                         # Utilities (axios, helpers, etc.)
├── _locales/                      # i18n JSON files (en.json, ja.json, etc.)
├── _middleware/                   # Middleware logic (auth, i18n, roles)
├── _schemas/                      # Zod schemas (validation)
├── _services/                     # API service layer (Laravel endpoints)
├── _storybook/                    # Storybook setup
├── _styles/                       # Tailwind config and global styles
├── _utils/                        # Utility functions/helpers
├── stories/                       # Storybook stories
├── types/                         # Global TypeScript types
├── example.ts                     # Example utility or config
.env.example
.gitignore
README.md
next-env.d.ts
next.config.ts
package-lock.json
package.json
pnpm-lock.yaml
postcss.config.mjs
tsconfig.json```


---

## ⚙️ Tech Stack

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

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
````

---

## 🔐 Auth & Middleware

* **Next Auth**: Manages sessions, tokens, and user states.
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

* [ ] Add CI/CD GitHub Actions
* [ ] Add testing setup (Vitest or Playwright)
* [ ] Add dark mode toggle
* [ ] Optimize bundle with custom webpack rules (optional)

---

## 📄 License

MIT — Free to use and modify.

---

**Repo:** `htain-thein-fe-new`

 
