# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Community Docs Navigation is a Next.js 15 application built with React 19, TypeScript, and Tailwind CSS. It serves as a community hub platform with features for events, courses, and mentorship, featuring a visual editing system for live component manipulation.

## Development Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack (http://localhost:3000)

# Production
npm run build        # Build production bundle
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture

### Visual Editing System

The application includes a custom visual editing system that allows live manipulation of UI components:

- **Component Tagger Loader** (`src/visual-edits/component-tagger-loader.js`): Babel-based webpack loader that injects `data-orchids-id` and `data-orchids-name` attributes into JSX elements during build. Tracks file paths, line numbers, and map contexts for precise source mapping.

- **Visual Edits Messenger** (`src/visual-edits/VisualEditsMessenger.tsx`): Client-side component that enables:
  - Real-time element selection and hover detection
  - Inline text editing with contentEditable
  - Live style manipulation with CSS injection
  - Element resizing with visual handles
  - Image source swapping
  - Bi-directional messaging with parent frame via postMessage API

- **Integration**: Configured in `next.config.ts` via Turbopack rules to apply the component tagger loader to all `.jsx`/`.tsx` files.

This system filters out Three.js Fiber and Drei elements to avoid tagging 3D scene primitives.

### UI Component System

- **Radix UI Primitives**: Extensive use of @radix-ui components (accordion, dialog, dropdown, etc.) for accessible, unstyled building blocks
- **Shadcn/ui Pattern**: Components in `src/components/ui/` follow the shadcn/ui convention with Tailwind CSS styling
- **Utility Function**: `cn()` in `src/lib/utils.ts` combines clsx and tailwind-merge for conditional className management

### Layout Architecture

- **DocLayout** (`src/components/doc-layout.tsx`): Main layout wrapper with:
  - Fixed sidebar (64 units width)
  - Sticky header with search
  - Content area with prose styling for typography
  - Main content shifted by `ml-64` to accommodate sidebar

- **Route Structure**: App Router (Next.js 15) with routes in `src/app/`:
  - `/` - Home page
  - `/events` - Events listing
  - `/courses` - Course catalog
  - `/mentor` - Mentor connections

### TypeScript Configuration

- Path alias: `@/*` maps to `src/*`
- Strict mode enabled
- Target: ES2017
- Module resolution: bundler (Next.js 15 requirement)

### Styling System

- **Tailwind CSS 4.x**: Latest version with PostCSS integration
- **Typography Plugin**: `@tailwindcss/typography` for prose content styling
- **Animation**: `tailwindcss-animate` for motion utilities
- **Theme**: Uses CSS variables for colors (defined in `globals.css`)

## Key Dependencies

### Core Framework
- Next.js 15.3.5 with App Router
- React 19 with React DOM 19
- TypeScript 5

### UI & Animation
- Framer Motion 12.x for animations
- Three.js with @react-three/fiber for 3D graphics
- Lucide React for icons
- Various visualization libraries (recharts, three-globe, cobe)

### Forms & Validation
- React Hook Form with @hookform/resolvers
- Zod 4.x for schema validation

### Code Processing
- @babel/parser for AST manipulation in visual editor
- estree-walker for AST traversal
- magic-string for source code transformations

## Development Notes

### Build Configuration

- **TypeScript/ESLint Errors**: Intentionally ignored during builds (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true`) for rapid development
- **Turbopack**: Enabled in dev mode for faster builds
- **Image Optimization**: Remote patterns allow all HTTPS/HTTP images

### ESLint Configuration

Custom rules enforce import correctness while relaxing TypeScript strictness:
- Import errors are enforced (no-cycle, no-self-import, etc.)
- TypeScript any and unused vars warnings are disabled
- React hooks exhaustive-deps is disabled

### Visual Editing Workflow

When making changes to components that will be visually edited:

1. The component tagger adds `data-orchids-id` with format: `filepath:line:column[@contextInfo]`
2. Line/column numbers must remain accurate for source updates to work
3. The messenger uses these coordinates to apply changes back to source files
4. Style changes are batched and sent on blur to avoid excessive updates

### Error Handling

- **ErrorReporter** component (`src/components/ErrorReporter.tsx`) is mounted in root layout
- **Global Error Boundary** (`src/app/global-error.tsx`) handles unrecoverable errors

### External Scripts

A route messenger script is loaded from Supabase storage for iframe communication tracking in visual edit mode.
