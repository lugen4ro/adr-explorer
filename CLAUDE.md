# ADR Explorer Next

ADR Explorer Next is a Next.js-based web application for visualizing and navigating Architectural Decision Records (ADRs) with static site generation.

## Project Overview

This project is a Next.js port of the original ADR Explorer (Vite/React) that leverages static site generation for better performance and SEO. The app reads ADR markdown files from a `docs/adr/` directory structure and generates static pages for each ADR at build time.

## Architecture

- **Next.js 15** with App Router and static export
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling with dark mode support
- **Biome** for linting and formatting (instead of ESLint)
- **Static Site Generation** for all ADR pages

## Key Features

- **Static Generation**: All ADR pages are pre-generated at build time
- **Hierarchical Navigation**: Support for nested ADR categories
- **Markdown Rendering**: Full GitHub-flavored markdown with Mermaid diagrams
- **Internationalization**: Multi-language support (EN/JA)
- **Dark Mode**: Complete dark/light theme support
- **Responsive Design**: Mobile-first responsive layout

## Common Commands

**Development:**

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build static site for production
- `pnpm start` - Serve production build
- `pnpm check` - Run Biome linting and formatting with automated fixing
- `pnpm typecheck` - Run typescript compiler for type checking

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (server component)
│   ├── HomePageContent.tsx # Home page client component
│   └── adr/[id]/
│       ├── page.tsx        # ADR detail page (server component)
│       └── ADRPageContent.tsx # ADR detail client component
├── components/
│   ├── ADRRenderer.tsx     # Markdown renderer with Mermaid support
│   ├── HomePage.tsx        # Home page content
│   └── Navigation.tsx      # Navigation and sidebar components
├── hooks/
│   └── useI18n.ts          # Internationalization hook
├── lib/
│   └── staticGeneration.ts # Static generation utilities
├── services/
│   └── adrService.ts       # ADR loading service
└── types/
    └── adr.ts              # TypeScript interfaces
```

## Static Site Generation

The app uses Next.js static generation features:

1. **generateStaticParams()** in `/adr/[id]/page.tsx` pre-generates all ADR pages
2. **generateMetadata()** creates SEO-friendly metadata for each ADR
3. **getAllADRs()** utility scans the file system at build time
4. **Static Export** configuration in `next.config.ts` generates a fully static site

## ADR File Structure

ADR files should be placed in `content/adr/` directory. The system automatically scans for all `.md` files:

```
content/adr/
├── 001-database-choice.md
├── 002-authentication-strategy.md
├── testadr.md
└── backend/                # Optional subdirectories
    └── 003-api-framework.md
```

No `index.json` files are needed - the system automatically discovers all `.md` files in the directory tree.

## Development Notes

- Use **pnpm** for package management
- Follow **Biome** formatting and linting rules
- All client interactivity is separated into `*Content.tsx` components
- Server components handle static data loading
- Dark mode classes are included throughout for theme support
