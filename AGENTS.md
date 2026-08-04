# AGENTS.md

Conventions and best-practices guide for AI agents (and humans) working in this
repository. A **React + Next.js (App Router)** application in **TypeScript**.

> General rule: Server Components by default, `"use client"` only when needed.
> Validate input at the boundary, type everything, and keep components small and
> focused.

---

## 1. Stack and principles

- **Framework:** Next.js with the **App Router** (`app/` folder). Do not use the
  Pages Router in new code.
- **Language:** TypeScript in `strict` mode. No implicit `any`.
- **UI:** React 19 — use the modern APIs (`useActionState`, `useFormStatus`,
  `use`) instead of legacy patterns.
- **Validation:** Zod for forms, server actions and environment variables.
- **Styling:** [adjust to the project — e.g. Tailwind CSS, CSS Modules].

---

## 2. Server vs Client Components

- **Server Components are the default.** Only mark `"use client"` when the
  component genuinely needs interactivity (state, effects, event handlers,
  browser APIs).
- Push `"use client"` as far down the tree as possible — isolate interactivity in
  small leaf components and keep the rest on the server.
- Never pass functions, classes or non-serializable data from a Server to a
  Client Component via props.
- Fetch data in Server Components whenever possible; do not use `useEffect` for
  initial data fetching.

---

## 3. TypeScript

- `strict: true` is mandatory. Do not relax compiler flags just to "make it pass".
- Avoid `any`; use `unknown` and narrow with Zod or type guards.
- **Derive types from Zod schemas**, do not duplicate them:

  ```typescript
  const ProductSchema = z.object({ id: z.string(), name: z.string() });
  type Product = z.infer<typeof ProductSchema>;
  ```

- Always type component props; avoid `React.FC`, prefer typing the parameter
  directly.
- Never use `as` to force types on external data — validate.

---

## 4. Folder structure

Colocation by route, with shared components outside `app/`:

```
src/
  app/
    (routes)/
      <segment>/
        page.tsx          # Server Component by default
        loading.tsx       # loading UI (Suspense)
        error.tsx         # error boundary ("use client")
        actions.ts        # route server actions ("use server")
    showroom/             # catalog page for reusable components (see §5)
      page.tsx
    layout.tsx
  components/
    ui/                   # reusable primitives — ONE FOLDER PER COMPONENT
      Button/
        Button.tsx
        index.ts
    <feature>/            # feature-specific components
  lib/                    # utilities, clients, helpers (no UI)
  schemas/                # shared Zod schemas
  types/                  # shared types
```

- Route-specific components live next to the route; they only move up to
  `components/` when reused.
- No business logic inside `page.tsx` — extract to `lib/` or actions.

---

## 5. Reusable components

Any component generic enough to be reused in **another application** (design-system
primitives, standalone widgets, layout pieces) is treated as a shared component and
must follow two rules:

1. **Its own folder — never a loose file.** Do not dump reusable components
   directly into `components/`. Each one gets a self-contained folder so the
   library stays organized and portable:

   ```
   components/ui/
     Button/
       Button.tsx        # the component
       Button.module.css # styles, if applicable
       index.ts          # public export (barrel)
   ```

   Everything the component needs (styles, sub-components, tests, types) lives
   inside its folder. Consumers import from the folder, not from deep paths:

   ```typescript
   import { Button } from "@/components/ui/Button";
   ```

2. **Registered on the showcase page.** Every reusable component must be added to
   the dedicated catalog page (`app/showroom/`, or Storybook if the project uses
   it). This page renders each component with its main variants/states so the full
   set of reusable pieces is visible and browsable in one place.

- A reusable component is not "done" until it has its own folder **and** an entry
  on the showcase page.
- Feature-specific components that are **not** reusable stay under
  `components/<feature>/` and do not need their own folder or a showcase entry
  unless they grow into something shared.

---

## 6. Data fetching and Server Actions

- Fetch data directly in Server Components with `async`/`await`.
- Mutations via **Server Actions** (`"use server"`), not via route handlers for
  internal forms.
- Always validate a server action's input with Zod **before** any write:

  ```typescript
  "use server";
  export async function createProduct(prevState, formData: FormData) {
    const parsed = ProductSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { error: "Invalid input" };
    // ... mutation
    revalidatePath("/products");
    return { success: true };
  }
  ```

- Call `revalidatePath` / `revalidateTag` after mutations to keep the cache
  consistent.
- Choose the cache/rendering strategy explicitly and deliberately (static,
  dynamic, `revalidate`), not by accident.

---

## 7. Forms (React 19)

- Use `useActionState` to wire forms to server actions and manage error/success
  state.
- Use `useFormStatus` for `pending` states in dedicated button/submit components
  (it must be a child of the `<form>`).
- Always validate on the server side (Zod in the action); client-side validation
  is UX only, never the source of truth.
- Do not nest `<form>` inside `<form>`. If you need independent submits, use
  buttons with distinct `formAction`s.

---

## 8. Components and hooks

- Small, single-responsibility components. Extract when a component exceeds ~150
  lines or takes on multiple responsibilities.
- Rules of Hooks: always call at the top level, never conditionally.
- Extract reusable logic into custom hooks (`useX`).
- Don't overuse `useEffect` — what seems to need an effect often resolves with
  derivation during render or with Server Components.
- Provide a stable, unique `key` in lists (never the array index).

---

## 9. State

- Prefer server state and the URL (search params) over global client state.
- Local state with `useState`/`useReducer`; only introduce a global state library
  when there's a real, shared need.
- Don't duplicate state on the client that already lives on the server —
  revalidate instead of mirroring.

---

## 10. Styling and naming

- **Code, files and identifiers in English.** Comments may be in Portuguese.
- Components in `PascalCase` (`ProductCard.tsx`); hooks in `useCamelCase`.
- Route segments in `kebab-case`; use route groups `(group)` to organize without
  affecting the URL.
- Consistent styling utilities/approach (e.g. Tailwind — avoid arbitrary inline
  CSS and mixing approaches).

---

## 11. Performance

- `next/image` for images (automatic optimization); never raw `<img>` for project
  content.
- `next/font` for fonts; avoid CSS font imports that cause layout shift.
- Use `<Suspense>` with `loading.tsx` to stream slow parts of the page.
- `dynamic()` for heavy client-only components.
- Don't import whole large libraries when you only need one function.

---

## 12. Security

- **Never expose secrets to the client.** Only variables prefixed with
  `NEXT_PUBLIC_` reach the browser; everything else stays on the server.
- Validate environment variables in a single module, at startup.
- Never trust client input — validate with Zod in every server action and route
  handler.
- Verify authentication/authorization inside the server action or in middleware,
  not just by hiding UI. Check the user's `companyId` against the requested
  resource (multi-tenancy).

---

## 13. Quality

- ESLint (Next config) + Prettier; do not submit code that fails linting.
- Fix all hook and accessibility warnings, don't silence them.
- Accessible components: semantic HTML, labels tied to inputs, visible focus,
  adequate contrast.

---

## 14. What to NEVER do

- Mark components as `"use client"` without need.
- Fetch initial data with `useEffect` instead of Server Components.
- Nest `<form>` inside `<form>`.
- Expose secrets without the correct prefix or send them to the client.
- Use the array index as a `key` in dynamic lists.
- Use `any` or `as` to work around type errors instead of validating.
- Query data without a `companyId` filter in a multi-tenant context.
- Dump reusable components as loose files in `components/` — each one gets its own
  folder and an entry on the showcase page (§5).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
