# Flip Frontend Challenge — Task Manager (Vue 3 + Vite + TS + Pinia + MSW)

A minimal, production‑minded starter you can fork and implement the challenge on. Mock API is provided via MSW in the browser and in tests.

## Quick Start

- Node 18+ recommended
- Copy env: `cp .env.example .env` (Windows: copy manually)
- Install deps: `npm install`
- Dev server: `npm run dev`
- Tests: `npm test`

If you see a service worker warning, run: `npx msw init public/ --save` (creates `public/mockServiceWorker.js`).

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview built app
- `npm test` — Vitest run once
- `npm run test:watch` — Vitest watch
- `npm run lint` — ESLint

## Tech Stack

- Vue 3 (Composition API), TypeScript, Vite
- Pinia for state
- Axios for HTTP
- MSW 2 for mock backend (browser + node)
- Vitest + @vue/test-utils for tests

## Folder Structure

- `src/main.ts` — App bootstrap and MSW worker in dev
- `src/mocks/*` — MSW handlers/browser/server
- `src/api/http.ts` — Axios instance
- `src/types/task.ts` — Domain types
- `src/stores/*` — Pinia store(s)
- `src/components/*` — Minimal UI components
- `src/setupTests.ts` — MSW server wiring for Vitest

## MSW Mock API

Endpoints (unchanged):
- GET `/api/tasks`
- POST `/api/tasks`
- PATCH `/api/tasks/:id`
- DELETE `/api/tasks/:id`

Simulate failures for retry/backoff:
- GET `/api/tasks?fail=429` → rate‑limit
- POST `/api/tasks?fail=500` → server error

Handlers live in `src/mocks/handlers.ts`. The app auto‑starts MSW in dev: see `src/main.ts`.

## Testing

Vitest + JSDOM. MSW node server is wired via `src/setupTests.ts` and `vitest.config.ts` → `setupFiles`.

Example test: `src/stores/tasks.spec.ts`.

## Challenge Brief (Summary)

Build a resilient Task Management UI with:
- Browse with sort (priority/created_at) and filter (all/pending/completed)
- Create/Edit/Delete with optimistic UI and rollback
- Inline toggle complete
- Resilient networking: cancellation, retry w/ exponential backoff on 429/5xx, offline queue for mutations
- Typed Pinia store with derived selectors
- UX/A11y polish: keyboard (N/Esc), labels/ARIA, responsive
- Tests: store and one component (at minimum)

Task type:

```ts
export interface Task {
  id: number
  title: string
  description: string
  status: 'pending' | 'completed'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}
```

Non‑functional requirements include small composables (e.g. `useRetryBackoff`, `useOnlineQueue`), strict TS, and clean architecture. See the original brief for full details.

## Notes

- API base URL via `VITE_API_BASE` (default `/`). MSW intercepts `/api/*`.
- Do not change server endpoints or shapes.
- No other global state libs beyond Pinia.
- Keep TypeScript strict and fix all console warnings.

Good luck and have fun!

---

# 🧠 Frontend Developer Take-Home Challenge

**Tech Stack:** Vue 3 (Composition API), Pinia, TypeScript, Vite  
**Backend:** Mocked with MSW (Mock Service Worker) — already configured  
**Estimated Time:** 3–4 hours  
**Repository:**
 
```bash
git clone git@bitbucket.org:flipconnect/flip-frontend-challenge-starter.git
```

## 🎯 Objective
Build a production-grade Task Management Application that demonstrates:
 
- solid front-end architecture
- robust error and retry handling
- strict TypeScript typing
- clean UX and accessibility practices
 
The provided repo includes everything you need — no Laravel or external backend required. The mock API runs in-browser using MSW.

## 🧱 Provided in the Starter Repo
 
- Vue 3 + Vite + TypeScript + Pinia configured
- MSW mock API intercepting `/api/tasks` with seed data
- Axios client (`src/api/http.ts`)
- Vitest unit testing setup
- ESLint + TypeScript strict mode
 
Project structure:
 
```
src/
   api/
   components/
   composables/
   mocks/
   stores/
   views/
```

## 🧩 Functional Requirements
 
1. Task List View
   - Display tasks (title, description, status, priority, created_at, updated_at)
   - Filter by status (all / pending / completed)
   - Sort by priority or creation date
   - Show loading and empty states
   - Persist user filter/sort preferences
 
2. Task Creation & Editing
   - Modal or page form to create/edit tasks
   - Validate fields and show feedback
   - Optimistic updates with rollback on failure
   - Inline validation for errors
 
3. Completion & Deletion
   - Inline toggle for marking tasks complete/incomplete
   - Delete with confirmation dialog
   - Avoid full list re-fetch; update locally and sync with API
 
## ⚙️ Non-Functional Requirements
 
- Resilience: Retry with exponential backoff on 429/5xx errors
- Offline Handling: Detect offline, queue mutations, retry on reconnect
- Cancellation: Cancel stale requests on rapid filter/sort changes
- Architecture: Use composables (e.g., `useTasks`, `useRetryBackoff`)
- TypeScript: Strict types; avoid `any`
- UI/UX: Accessible keyboard shortcuts (N = new task, Esc = close modal), ARIA labels, focus management, responsive layout
 
## 🔌 Mock API (MSW)
 
Endpoints:
 
```bash
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

Failure Simulation
 
| Example                | Description                        |
|------------------------|------------------------------------|
| `/api/tasks?fail=429`  | Simulates rate limit (429)         |
| `/api/tasks?fail=500`  | Simulates server error (500)       |
 
Use these to showcase retry and rollback behavior.

## 🧪 Testing
 
Required
 
- One Pinia store test (success + failure)
- One component test (validation or toggle)
 
Optional
 
- One end-to-end test covering create → toggle → delete
 
Vitest and MSW integration are already wired in.

## ⭐ Senior+ Scenario Add-Ons (Select 2–3)
 
Implement any 2–3 within the timebox:
 
- Offline-First with Conflict Resolution: cache GET, queue mutations, replay on reconnect, resolve conflicts
- URL-Driven State & Deep Linking: reflect filters/sort/pagination in URL
- Large List Performance: windowed/virtualized list for 5,000+ tasks
- Optimistic Concurrency: simulate ETag/If-Match; display merge prompt
- Attachment Upload (Frontend Only): preview, validation, fake URL via MSW
- Feature Flag + Analytics: lightweight flags, analytics queue with retry
- RBAC-Lite: simulate viewer vs editor roles
- i18n & Timezones: two locales; timezone-aware times
 
Document chosen add-ons, trade-offs, and assumptions in your README.

## 📦 Deliverables
 
- Public Git repo (no node_modules or vendor)
- README including:
   - Setup & run instructions
   - Time spent
   - Selected add-ons
   - Assumptions/trade-offs
   - Architecture notes on scaling and offline sync
   - Meaningful commit history (atomic commits)
 
## 📊 Evaluation Criteria
 
| Category | Weight | What We Look For |
|---|---:|---|
| TypeScript & Types | 25% | Strict typing, no `any`, clear interfaces |
| Architecture & State | 25% | Composables, Pinia structure, separation |
| Vue 3 & Pinia Mastery | 20% | Composition API fluency, reactive control |
| Resilience & Error Handling | 15% | Retry/backoff, rollback, offline queue |
| UI/UX & Accessibility | 10% | Responsive layout, keyboard support |
| Testing | 5% | Focused, meaningful unit tests |
 
Bonus: search (debounce + cancel), dark mode, smooth animations.

## 🚫 What Not To Do
 
- Don’t modify the MSW mock logic
- Don’t use Vue 2 or Options API
- Don’t disable TypeScript checks
- Don’t commit dependencies
 
## ▶️ How To Run
 
```bash
git clone git@bitbucket.org:flipconnect/flip-frontend-challenge-starter.git
cd flip-frontend-challenge-starter
npm install
# if you see a worker warning, run one of:
#   npx msw init              # uses package.json msw.workerDirectory
#   npx msw init public/ --save
npm run dev
```

Visit → http://localhost:5173

## 🕓 Timebox
 
Spend no more than 3–4 hours total. Prefer clarity and maintainability over volume.

## 💬 Questions
 
If something is unclear, document your assumptions in the README. We evaluate decision-making and communication as much as code.