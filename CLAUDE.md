# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack (opens at http://localhost:3000)
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Convex Backend
- `npx convex -h` - View all available Convex CLI commands
- `npx convex docs` - Launch Convex documentation
- `npx convex dev` - Start Convex development mode (run this alongside `npm run dev`)
- `npx convex deploy` - Deploy Convex functions to production

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom CSS variables for theming
- **Backend**: Convex for real-time database and serverless functions
- **Email**: @convex-dev/resend integration for email functionality
- **Fonts**: Geist Sans and Geist Mono from Vercel

### Project Structure
- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration and global styling
  - `page.tsx` - Homepage component
  - `globals.css` - Global styles with dark/light mode CSS variables
- `convex/` - Convex backend functions and configuration
  - `_generated/` - Auto-generated Convex API and type definitions
  - `tsconfig.json` - TypeScript config specific to Convex functions
- `public/` - Static assets (SVG icons, images)

### Key Features
- **Dark Mode Support**: CSS variables in globals.css handle light/dark theme switching
- **Type Safety**: Full TypeScript setup with strict mode enabled
- **Path Aliases**: `@/*` alias maps to project root for cleaner imports
- **Font Optimization**: Next.js font optimization with Geist font family

### Convex Integration
- Backend functions live in `convex/` directory
- Use `query` for read operations, `mutation` for write operations
- Import from `"./_generated/server"` for Convex utilities
- Client-side: Import API from `convex/_generated/api` 
- React hooks: `useQuery()` and `useMutation()` from "convex/react"

### Development Workflow
1. Run `npm run dev` for frontend development
2. Run `npx convex dev` in separate terminal for backend functions
3. Convex functions auto-deploy during development
4. Use `npm run lint` before committing changes