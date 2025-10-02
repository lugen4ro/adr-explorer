# ADR Explorer Next

ADR Explorer Next is a Next.js-based web application for visualizing and navigating Architectural Decision Records (ADRs) with static site generation and Mantine UI components.

## Architecture & Technology Stack

- **Next.js 15** with App Router and static export
- **React 19** with TypeScript
- **Mantine v8** for UI components and design system
- **Biome** for linting and formatting (per ADR-003)
- **pnpm** for package management (per ADR-002)
- **Static Site Generation** for all ADR pages
- **Three-Layer Component Architecture** (per ADR-004)

## Common Commands

**Development:**

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build static site for production
- `pnpm start` - Serve production build
- `pnpm check` - Run Biome linting and formatting with automated fixing (per ADR-003)
- `pnpm typecheck` - Run typescript compiler for type checking

## Three-Layer Component Architecture (ADR-004)

This project follows a strict three-layer component architecture to maintain clear separation of concerns:

### 1. **Atoms** (`src/components/atoms/`)

- **Purpose**: Basic, single-purpose UI elements
- **Examples**: Button, TextInput, Select, Badge, Card, ActionButton
- **Rules**:
  - MUST be general-purpose and reusable
  - NO business logic or context-specific behavior
  - Wrap Mantine components with consistent defaults

### 2. **Molecules** (`src/components/molecules/`)

- **Purpose**: Reusable combinations of atoms that remain context-agnostic
- **Examples**: SearchBox, LanguageSelector, StatusBadge, StatCard
- **Rules**:
  - Can ONLY compose atoms (no molecule-to-molecule dependencies)
  - MUST remain general-purpose
  - NO business logic or domain-specific behavior

### 3. **Composites** (`src/components/composites/`)

- **Purpose**: Context-aware components built for specific business use cases
- **Structure**: Organized by business domain (`adr/`, `shared/`)
- **Examples**: ADRCard, ADRHomePage, AppHeader, AppLayout, AppSidebar
- **Rules**:
  - Encode business logic and understand domain context
  - Can use atoms, molecules, and other composites
  - Contains all context-specific behavior

### Component Guidelines

**✅ DO:**

- Keep atoms and molecules general-purpose
- Put all business logic in composites
- Follow the dependency rules (molecules → atoms only)
- Use descriptive names that indicate purpose
- Maintain consistent prop interfaces

**❌ DON'T:**

- Create context-specific atoms or molecules
- Add business logic to atoms or molecules
- Create molecule-to-molecule dependencies
- Mix concerns across layers

## File Structure

```
src/
├── components/
│   ├── atoms/              # General-purpose basic elements
│   │   ├── Button.tsx
│   │   ├── TextInput.tsx
│   │   ├── ActionButton.tsx
│   │   └── index.ts
│   ├── molecules/          # General-purpose combinations
│   │   ├── SearchBox.tsx
│   │   ├── StatusBadge.tsx
│   │   └── index.ts
│   ├── composites/         # Business-specific components
│   │   ├── adr/           # ADR-specific composites
│   │   │   ├── ADRCard.tsx
│   │   │   └── ADRHomePage.tsx
│   │   └── shared/        # Cross-domain composites
│   │       ├── AppHeader.tsx
│   │       └── AppLayout.tsx
│   └── index.ts           # Main component exports
├── app/                   # Next.js App Router
├── hooks/                 # React hooks - UI state management, React-specific patterns
├── lib/                   # Utilities
├── services/             # Data services - external data, APIs, business logic
└── types/                # TypeScript definitions
```

## ADR File Structure

ADR files are located in `doc/adr/` directory:

```
doc/adr/
├── 0001-record-architecture-decisions.md
├── 0002-use-pnpm-instead-of-npm.md
├── 0003-use-biome-for-linting-and-formatting.md
└── 0004-three-layer-component-architecture.md
```

## Development Notes

- Use **pnpm** for package management (per ADR-002)
- Follow **Biome** formatting and linting rules (per ADR-003)
- Adhere to **three-layer component architecture** (per ADR-004)
- All client interactivity uses proper component layer separation
- Dark/light mode support via Mantine's color scheme system

## Services vs Hooks

**Services** (`src/services/`):

- **Data layer** - handles external data sources, APIs, file systems
- **Pure functions** - independent of React lifecycle
- **Business logic** - ADR parsing, file reading, data transformation
- **Reusable across contexts** - can be used in components, SSG, or Node.js

**Hooks** (`src/hooks/`):

- **React-specific** - tied to component lifecycle and state
- **UI state management** - local component state, effects, subscriptions
- **React patterns** - useState, useEffect, custom hooks
- **Component-bound** - only work within React components

## Development Workflow

- **Testing changes**: User runs dev server locally, so no need to build after changes
- **Code validation**: Run `pnpm check` and `pnpm typecheck` to validate changes
- **Build only when**: Explicitly requested or for production deployment
