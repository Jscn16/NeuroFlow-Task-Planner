# NeuroFlow Task Planner – Engineering & Architecture Guide

This document is the core onboarding for engineers and AI agents working on **NeuroFlow Task Planner** (aka NeuroFlow OS).

The goal:  
You must keep the codebase **fast, lightweight, predictable, and maintainable**, while staying aligned with the product vision: an ADHD-friendly productivity OS focused on **clarity, calm, and flow**.

---

## 1. Product Overview

NeuroFlow is a **local-first productivity OS** with:

- **Weekly & daily planner**
  - Week view: columns = days (Mon–Sun), rows = categories:
    - `GOAL` (one “One Thing” per day)
    - `FOCUS`
    - `WORK`
    - `LEISURE`
    - `CHORES`
  - Drag & drop tasks between days and categories.
  - Capacity & progress indicators per day.

- **Deep Focus mode**
  - Pick a task from the planner/backlog.
  - Focus timer (Pomodoro-like, but not necessarily classic 25/5).
  - Zen view for single-task deep work.

- **Habits**
  - Habit list with daily check-ins and streak tracking.

- **Brain Dump / Notes**
  - Low-friction lists for dumping ideas/tasks.
  - Later converted into proper tasks.

- **Analytics & Stats**
  - Progress over time, streaks, focus sessions, task completion patterns.
  - Motivational, but not over-engineered.

- **Eisenhower Matrix**
  - Quadrants (Do / Decide / Delegate / Delete) for prioritization.
  - Integrated with main task model.

The app must feel like a **calm, powerful control panel** for life and work – not like a noisy toy.

---

## 2. Tech Stack (Non-Negotiable)

When writing or modifying code, assume:

- **React** – latest stable (React 18+), functional components + hooks only.
- **TypeScript** – strict, no casual `any`.
- **Vite** – bundler/dev server.
- **TailwindCSS** – for styling (no extra UI frameworks by default).
- **Framer Motion** – for subtle, GPU-friendly animations.
- **lucide-react** – icon library (named imports only).
- **Vitest** – primary test runner.

**Rules:**

- No heavy state libraries or UI kits unless explicitly justified.
- Prefer **small utilities and custom hooks** over big frameworks.
- Prioritize **performance, bundle size, and clarity**.

---

## 3. Project Structure & Architecture

We follow a **feature-first structure**:

```txt
src/
  app/          # App shell, routing, providers, global layout
  features/
    planner/    # Week planner (board, drag & drop, day logic)
    deep-focus/ # Focus mode UI + logic
    habits/     # Habit tracker
    brain-dump/ # Notes / brain dump
    analytics/  # Stats & charts
    eisenhower/ # Eisenhower matrix
  components/   # Reusable, dumb/presentational UI components
  hooks/        # Shared hooks, cross-feature
  lib/          # Domain logic, pure functions, shared services
  styles/       # Tailwind config, global styles
  types/        # Shared TS types/interfaces
  config/       # Feature flags, theme config
  tests/        # Shared test helpers / mocks (optional)
```

### 3.1 Responsibilities

- **`features/*`**
  - Feature-specific pages, containers, and view logic.
  - Can contain feature-local hooks and small logic files.

- **`components/*`**
  - Reusable UI building blocks:
    - Buttons, Cards, Modals, Panels, Layout primitives, Badges, Toggles.
  - No business logic here.

- **`lib/*`**
  - Domain-level logic (pure or mostly pure):
    - Task creation / editing / recurrence logic.
    - Scheduling & capacity calculations.
    - Habit streak calculations.
    - Stats/analytics aggregations.
    - Persistence helpers (read/write from local storage, migrations).

- **`hooks/*`**
  - Cross-feature hooks:
    - `useLocalStorageState`, `useMediaQuery`, `useTheme`, etc.

- **`types/*`**
  - Core domain models and shared types.

**Rule:**  
UI & domain logic must remain separate.  
If you find heavy logic inside JSX, consider extracting to `lib/` or a custom hook.

---

## 4. Domain Model

Core entities are:

### 4.1 Task

```ts
export type Priority = 'high' | 'medium' | 'low' | 'leisure' | 'chores';

export type TaskColumn = 'goal' | 'focus' | 'work' | 'leisure' | 'chores';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  plannedDurationMinutes: number;

  // Scheduling
  day: string;           // ISO date string (YYYY-MM-DD, no time)
  column: TaskColumn;    // row/category in the planner

  // Status
  done: boolean;
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
}
```

Derived concepts:

- **Overdue task**: a task in a past day (`day < today`) with `done === false`.
- **Goal row**: special row; **max 1 task per day** (enforced in UI logic).

### 4.2 Habit

```ts
export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  archived?: boolean;
}

export interface HabitCheckin {
  id: string;
  habitId: string;
  date: string;    // YYYY-MM-DD
  completed: boolean;
}
```

### 4.3 Focus Session

```ts
export interface FocusSession {
  id: string;
  taskId?: string;       // optional link to a Task
  startedAt: string;     // ISO timestamp
  endedAt?: string;      // null/undefined if running
  plannedMinutes: number;
  actualMinutes?: number;
  interrupted?: boolean;
}
```

### 4.4 Brain Dump

Simple, low-friction structure; think lists with items.  
Do **not** over-engineer – the goal is quick capture, not a full note app.

### 4.5 Analytics

Where possible, **derive** analytics from tasks, habits, and focus sessions:

- Don’t store redundant aggregates if you can compute them quickly enough.
- If you cache aggregates, clearly mark them as derived and keep invalidation simple.

---

## 5. State Management

Default rule:  
**Start with local state + feature-level context, and only go global when necessary.**

- Component state (`useState`, `useReducer`) for local/UI stuff.
- Feature-level `Context` for:
  - Planner state if multiple subcomponents need the same data.
  - Focus Mode session state.
  - Habit tracker state (if shared across multiple views).
- Global context only for:
  - Theme & design variant.
  - User settings (e.g., `fadeDoneTasks`, time format).
  - (Later) Auth / sync status.

We do **not** introduce Redux/MobX/Zustand, etc. unless there is a clear, serious need.

---

## 6. Persistence – Local-First Strategy

NeuroFlow is **local-first**:  
The app must work offline. Local persistence is the base; cloud sync is an optional layer.

### 6.1 Local Storage Layout

We generally store a **single root object** (or a small set of well-defined keys) in `localStorage`:

```ts
interface PersistedStateV1 {
  version: 1;
  tasks: Task[];
  habits: Habit[];
  habitCheckins: HabitCheckin[];
  focusSessions: FocusSession[];
  brainLists: BrainList[];
  settings: UserSettings;
}
```

- Main key example: `neuroflow_state_v1`.
- All reads/writes go through **central helper functions/hooks**, never sprinkled `localStorage.setItem()` everywhere.

### 6.2 Migrations

If the schema changes:

- Increment `version`.
- Add a migration step in a dedicated place (e.g. `lib/persistence/migrate.ts`).
- On load:
  - Parse from localStorage.
  - Detect version.
  - Run migrations until you reach the current version.
- Always handle invalid/malformed data gracefully (fallback to defaults).

### 6.3 Cloud Sync – Future Layer

Cloud sync is a future/optional layer:

- Local data remains the primary source of truth on the client.
- A sync service may:
  - Push local changes to the server.
  - Pull remote changes and merge into local state.
- Conflict strategy:
  - Likely simple `updatedAt`-based last-write-wins for now.
  - Domain-specific conflict resolution can be added later if needed.

**Important:**  
Do **not** couple UI directly to remote calls.  
UI should talk to a local store + sync service, not to fetch calls scattered across components.

---

## 7. UI & UX Principles

### 7.1 Visual Style

- Dark, minimal, professional. No loud, “gamer RGB” UI.
- Ambient background:
  - Optional, soft Northern Lights / aurora feel.
  - Very low opacity, heavy blur.
  - The **content** (tasks, text) must always be more prominent than the background.
- Tasks:
  - Full-width cards in their grid cells.
  - Clear title, optional notes/details (collapsible).
  - Priority indicated by color stripe and/or badge.
- Done tasks:
  - Default: slightly dimmed (opacity lowered, but still readable).
  - Optionally “Fade more” / “Hide done” via settings.
- Overdue tasks:
  - Never faded.
  - Thin red/orange border + small `OVERDUE` pill near duration.
  - They should stand out even in dimmed past days.

### 7.2 Planner & Sidebar

- Sidebar:
  - Priority buckets:
    - `ASAP: HIGH PRIO`
    - `SOON: MEDIUM PRIO`
    - `LATER: LOW PRIO`
    - `LEISURE`
    - `BASICS: CHORES`
  - Clear section titles; optional subtle divider between sections.
  - May be visually dimmed in idle state, brightened on hover/focus.
- Week Planner:
  - Columns = days, rows = categories.
  - Today:
    - Subtle highlight for the full column (soft overlay + header accent).
  - Past days:
    - Content slightly dimmed (except overdue tasks).
  - Goal row:
    - At most 1 task per day; empty days show a single ghost slot.

---

## 8. Animations (Framer Motion)

Animations must be:

- Subtle
- Smooth
- Cheap (transform + opacity only)

Use cases:

- Task create / delete → small fade/scale.
- DnD ghost image / drop feedback.
- Screen transitions (planner ↔ focus ↔ stats).
- Ambient background (slow drift of aurora shapes).

Avoid:

- Constant pulsing or distracting motion.
- Heavy box-shadow/blur animations on large elements.
- Long, laggy transitions.

Respect `prefers-reduced-motion` and reduce/disable animations for those users.

---

## 9. Performance & Bundle Size

Target: **60 FPS feel** on mid-range hardware.

Rules:

- Keep dependencies lean. Think twice before adding any new lib.
- Planner grid:
  - Avoid re-rendering the whole board when a single task changes.
  - Use memoization (`React.memo`, `useMemo`, `useCallback`) where it actually reduces renders.
- Lists:
  - Only consider virtualization when lists are truly large.
- Code splitting:
  - Lazy-load heavy/rare screens like deep analytics or complex charts.
- Frequent computations (e.g. stats):
  - Debounce or compute on-demand.
  - Cache results where safe.

If a design choice makes the app feel sluggish, simplify it or remove it.

---

## 10. Testing Strategy (Vitest)

Priorities:

- **Domain logic** (in `lib/`):
  - Task scheduling, overdue detection, capacity, habit streaks, simple analytics.
- **Critical hooks**:
  - Timer logic.
  - Derived task views (filters, groupings).
- **Core flows**:
  - Create/edit/complete tasks.
  - Move tasks between days and categories.
  - Start/end focus sessions.
  - Toggle habits.

Use `*.test.ts` / `*.test.tsx` next to the code under test.

We don’t chase 100% coverage.  
We care about “bugs that actually hurt users and trust”.

---

## 11. Feature Flags & Experimental Design

We use feature flags for design variants and experiments, e.g.:

- `ENABLE_EXPERIMENTAL_DESIGN` for new layout/theme variants.

Pattern:

- Flag + helpers defined in `config/themeConfig.ts`.
- Optional helper:
  - `toggleExperimentalDesign()` that flips a flag in `localStorage` and reloads the app.
- Settings UI:
  - Expose Dev/Experimental toggles in a “Danger Zone” / Developer section.

When adding a new flag:

- Document the intent.
- Keep the `if (FLAG)` usage localized and clean.

---

## 12. Things You MUST NOT Do

- Do **not**:
  - Scatter `localStorage.setItem()` across random components.
  - Add heavy libraries just for convenience.
  - Stuff complex domain logic inside JSX without extracting it.
  - Use `any` to silence TypeScript without good reason.
  - Break the local-first model with UI that hard-depends on network.

When in doubt, follow this order:

1. **Correctness & stability**
2. **Performance & responsiveness**
3. **Clarity & maintainability**
4. **Aesthetics & motion**

NeuroFlow must remain a tool you can stare at for hours without friction or fatigue.
