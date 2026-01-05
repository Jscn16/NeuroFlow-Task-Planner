# CLAUDE.md - NeuroFlow Task Planner

## Project Overview

NeuroFlow Task Planner is a React-based task management and productivity application with weekly planning views, habit tracking, and brain dump features. It supports both desktop and mobile interfaces with offline-first capabilities.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Animation**: Framer Motion
- **Backend**: Supabase (authentication + data sync)
- **Testing**: Vitest + React Testing Library
- **Icons**: Lucide React
- **UI Components**: cmdk (command palette), recharts (analytics)

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run tests with Vitest
npm run test:ui      # Run tests with Vitest UI
npm run test:coverage # Run tests with coverage
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication (AuthOverlay)
│   ├── features/
│   │   ├── board/     # Week views (Matrix, Stacked, Mobile)
│   │   ├── dashboard/ # Analytics, Focus Mode
│   │   └── tools/     # Habit Tracker, Brain Dump
│   ├── layout/        # MainLayout, Header, Sidebar, Settings
│   ├── onboarding/    # First-time user guides
│   ├── tasks/         # Task card variants (Board, Sidebar, DeepWork)
│   └── ui/            # Shared UI (CommandPalette, DatePicker, etc.)
├── context/           # TaskContext (global state)
├── hooks/             # Custom hooks (useTaskManager, usePersistence, etc.)
├── services/          # Business logic (TaskManager, StorageService, Supabase)
├── types.ts           # TypeScript interfaces (Task, Habit, BrainDumpList)
├── themes.ts          # Theme definitions
└── constants.tsx      # App constants
```

## Key Types

```typescript
type TaskType = 'backlog' | 'high' | 'medium' | 'low' | 'leisure' | 'chores';
type GridRow = 'GOAL' | 'FOCUS' | 'WORK' | 'LEISURE' | 'CHORES';
type TaskStatus = 'unscheduled' | 'scheduled' | 'completed' | 'rescheduled';
```

## Coding Conventions

- **Path Aliases**: Use `@/*` for imports from `src/` (e.g., `@/components/ui/Button`)
- **Components**: Functional components with TypeScript interfaces for props
- **State Management**: React Context (TaskContext) for global state
- **Hooks**: Custom hooks prefixed with `use` (e.g., `useTaskManager`, `usePersistence`)
- **Date Format**: ISO strings `YYYY-MM-DD` for dates
- **IDs**: Generated via `src/utils/id.ts`

## Testing

- Tests are colocated with source files (`.test.ts` suffix)
- Use `@testing-library/react` for component tests
- Test setup in `src/test/setup.ts`

## Important Patterns

1. **Offline-first**: Data persists to localStorage via `StorageService`, syncs with Supabase when online
2. **Mobile-responsive**: Separate mobile components (`MobilePlanner`, `MobileNavBar`, etc.)
3. **Drag & Drop**: Task reordering via `src/utils/drag.ts`
4. **PWA Support**: Configured via `vite-plugin-pwa`

## Environment Variables

- `GEMINI_API_KEY` - For AI features (set in `.env.local`)
- Supabase credentials configured in `src/lib/supabase.ts`
