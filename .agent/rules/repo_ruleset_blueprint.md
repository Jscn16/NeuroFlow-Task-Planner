# Project Development Guidelines for AI Assistants

## Project Structure & Organization

Follow this lean and feature-oriented project structure to maintain consistency and clarity.

-   **Root Directory:** All source code must reside within a `/src` directory.
-   **Core Directories:**
    -   `/src/components`: Contains all reusable React components.
        -   For simple components, use a single file: `src/components/TaskCard.tsx`.
        -   For complex components with multiple related files (styles, tests, sub-components), create a dedicated folder: `src/components/TaskForm/index.tsx`.
    -   `/src/hooks`: Contains custom React hooks (e.g., `useApi.ts`, `useLocalStorage.ts`).
    -   `/src/assets`: Store static assets like images, fonts, and SVGs here.
    -   `/src/services`: For modules that handle external interactions, like API calls (e.g., `apiClient.ts`).
-   **Core Files:**
    -   `src/main.tsx`: The application entry point. Renders the root `App` component.
    -   `src/App.tsx`: The main application component, responsible for layout and routing.
    -   `src/constants.ts`: Stores application-wide, non-sensitive constants (e.g., `API_BASE_URL`, `APP_TITLE`).
    -   `src/types.ts`: Contains all shared TypeScript type definitions and interfaces.
-   **Path Aliasing:** Always use the `@/*` path alias for absolute imports from the `src` directory to avoid long relative paths.
    -   **Correct:** `import TaskCard from '@/components/TaskCard';`
    -   **Incorrect:** `import TaskCard from '../../components/TaskCard';`

## Architecture & Design Patterns

Adhere to the established architectural principles of this project.

-   **Architectural Pattern:** Implement a **Single-Page Application (SPA)** using a **Component-Based Architecture**.
-   **Separation of Concerns:**
    -   **UI Logic:** Keep UI and rendering logic within React components.
    -   **Business Logic:** Extract complex business logic into custom hooks (`/src/hooks`).
    -   **API Calls:** Isolate all API interactions within the `/src/services` directory.
    -   **State:** Manage state within components or through shared contexts.
-   **State Management:**
    -   **Default:** Use React's built-in hooks (`useState`, `useReducer`, `useContext`) for state management.
    -   **Avoid Premature Abstraction:** Do not introduce external state management libraries (like Zustand or Redux) unless the application's state complexity grows significantly and prop-drilling becomes a major issue.
-   **Data Flow:** Enforce a unidirectional data flow. Data should flow down from parent to child components via props, and state changes should be communicated upwards via callback functions.

## Technology-Specific Conventions

Follow these best practices for the core technologies in the stack.

-   **React:**
    -   Always use **Functional Components** with Hooks. Class components are forbidden.
    -   Use the modern JSX transform; do not import `React` just for JSX.
    -   Destructure props in the component's function signature.
-   **TypeScript:**
    -   Provide explicit types for all component props, state, function arguments, and return values.
    -   Define all shared types and interfaces in the central `src/types.ts` file.
    -   Strictly avoid the use of `any`. Use `unknown` for type-safe handling of dynamic data.
-   **Vite:**
    -   Manage all build and development server configurations in `vite.config.ts`.
    -   Access environment variables using `import.meta.env.VITE_VARIABLE_NAME`. All client-exposed variables must be prefixed with `VITE_`.
-   **Styling:**
    -   Use **CSS Modules** for component-level styling to ensure scoped styles.
    -   Create a `Component.module.css` file for each component that requires styling.
    -   Import styles like this: `import styles from './TaskCard.module.css';` and use them as `className={styles.card}`.

## Code Style & Standards

Maintain a consistent and high-quality codebase by adhering to these standards.

-   **Formatting & Linting:**
    -   **Mandatory:** The project must be configured with **Prettier** for automated code formatting and **ESLint** for static code analysis.
    -   **Configuration:** Use `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` to enforce hook rules and best practices.
    -   **Workflow:** Configure your editor to format on save and run the linter before committing code.
-   **Naming Conventions:**
    -   **Components & Types/Interfaces:** `PascalCase` (e.g., `TaskCard`, `interface Task`).
    -   **Files (Components):** `PascalCase.tsx` (e.g., `TaskCard.tsx`).
    -   **Files (Non-Components):** `camelCase.ts` (e.g., `apiClient.ts`, `useTaskData.ts`).
    -   **Variables, Functions, Hooks:** `camelCase` (e.g., `taskCount`, `fetchTasks`, `useTaskData`).
    -   **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`).
-   **Imports:**
    -   Use ES Modules (`import`/`export`) exclusively.
    -   Organize imports in the following order:
        1.  React imports (`import React from 'react';`)
        2.  External library imports (`import { LineChart } from 'recharts';`)
        3.  Absolute internal imports (`import TaskCard from '@/components/TaskCard';`)
        4.  Relative imports (`import styles from './styles.module.css';`)

## Component/Module Creation Guidelines

Follow this pattern when creating new components and modules.

-   **Component Creation Pattern:**
    1.  Create a new file `src/components/NewComponent.tsx`.
    2.  Define the component's props as a TypeScript interface named `NewComponentProps`.
    3.  Implement the component as a functional component, typed with `React.FC<NewComponentProps>`.
    4.  Use JSDoc to document the component and its props.
    5.  Export the component as the default export.

    ```typescript
    // src/components/NewComponent.tsx

    import React from 'react';

    /**
     * Props for the NewComponent.
     */
    interface NewComponentProps {
      /** A brief description of the title prop. */
      title: string;
      /** A brief description of the onAction prop. */
      onAction: () => void;
    }

    /**
     * A component that does something amazing.
     */
    const NewComponent: React.FC<NewComponentProps> = ({ title, onAction }) => {
      return (
        <div>
          <h1>{title}</h1>
          <button onClick={onAction}>Click Me</button>
        </div>
      );
    };

    export default NewComponent;
    ```

-   **Module Creation Pattern:**
    -   For utility functions or services, use named exports.
    -   Group related functions within a single file (e.g., `src/utils/dateUtils.ts`).

## Testing Requirements

Testing is a mandatory part of the development process to ensure code quality and stability.

-   **Frameworks:**
    -   Use **Vitest** as the test runner.
    -   Use **React Testing Library** for rendering components and simulating user interactions.
-   **File Convention:**
    -   Test files must be co-located with the source file they are testing.
    -   The test file for `MyComponent.tsx` must be named `MyComponent.test.tsx`.
-   **Testing Philosophy:**
    -   Write tests from a user's perspective. Test component behavior, not implementation details.
    -   **Assert** on what the user sees (e.g., text content, element roles) and can do (e.g., clicking a button).
    -   All new components with logic or user interaction must be accompanied by unit/integration tests.
    -   All business logic in hooks and services must be unit-tested.

## Documentation Standards

Clear documentation is essential for maintainability.

-   **Code Comments:** Use **JSDoc** syntax for all functions, hooks, and component prop interfaces. Comments should explain the *why* behind the code, not just restate what the code does.
-   **Component Documentation:** Every component must have a JSDoc block explaining its purpose, and every prop in its props interface must have a comment explaining its usage.
-   **README.md:** The root `README.md` must be kept up-to-date with:
    -   A clear project description.
    -   Instructions for local setup (`npm install`).
    -   A list of all required environment variables.
    -   Available npm scripts (`npm run dev`, `npm run build`, `npm run test`).

## Security & Performance Guidelines

Build secure and performant applications by default.

-   **Security:**
    -   **Environment Variables:** Never commit `.env` files. Add `.env*` to `.gitignore`. All secrets must be managed through the deployment platform's environment variable settings.
    -   **Cross-Site Scripting (XSS):** Avoid `dangerouslySetInnerHTML`. If it is absolutely necessary, ensure the HTML is sanitized first.
    -   **External Links:** Always add `rel="noopener noreferrer"` to `<a>` tags with `target="_blank"`.
-   **Performance:**
    -   **Memoization:** Use `React.memo` to wrap components that are expensive to render and receive the same props frequently. Use `useMemo` and `useCallback` to prevent unnecessary re-calculations and re-renders in complex components.
    -   **Code Splitting:** For large components or pages, use `React.lazy()` and `<Suspense>` to lazy-load them and reduce the initial bundle size.
    -   **Asset Optimization:** Ensure images are appropriately sized and compressed.

## Integration & Dependencies

Manage external dependencies and integrations carefully.

-   **Adding Dependencies:**
    -   Before adding a new library, evaluate its bundle size, maintenance status, and necessity.
    -   Prefer libraries with minimal dependencies and a strong community.
    -   Use `npm install <package-name>` for runtime dependencies and `npm install -D <package-name>` for development dependencies.
-   **API Integration:**
    -   Centralize all API fetching logic in `src/services/`.
    -   Use environment variables for API base URLs and keys.
    -   Always define TypeScript types for API request payloads and responses to ensure type safety.

## Development Workflow

Follow a structured workflow to ensure smooth collaboration and high-quality releases.

-   **Branching Strategy:** Use a feature-branching model. Create new branches from `main` for each new feature or bugfix (e.g., `feature/user-profile`, `fix/login-validation`).
-   **Commit Messages:** Adhere to the **Conventional Commits** specification. This is crucial for automated versioning and changelog generation.
    -   **Examples:** `feat: implement task creation form`, `fix: resolve chart data alignment issue`, `docs: update API documentation`, `refactor: simplify state logic in TaskList`.
-   **Pull Requests (PRs):**
    -   All code must be reviewed via a PR before being merged into `main`.
    -   A PR description should clearly explain the changes and the problem it solves.
-   **Continuous Integration (CI):**
    -   A CI pipeline (e.g., using GitHub Actions) must be configured.
    -   The pipeline must automatically run the linter (`npm run lint`) and tests (`npm run test`) on every PR.
    -   PRs cannot be merged if the CI pipeline fails.