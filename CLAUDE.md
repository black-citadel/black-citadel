# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Black Citadel is a cross-platform Kubernetes GUI desktop application built with Electron, React, and TypeScript. It provides a modern interface for managing Kubernetes clusters with full CRUD operations on resources.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Run development build and launch app
npm start

# Production build only
npm run build

# Build and package the application
npm run package

# Create platform-specific distributables
npm run dist

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run both type checking and linting
npm run check
```

## Build System

The project uses **Electron Builder** for packaging and distribution, with **Webpack** for bundling:

- **Webpack Configurations**: 
  - `webpack.dev.config.ts` - Development build with source maps and hot reload
  - `webpack.prod.config.ts` - Production build with optimizations
- **Build Output**: Built files are output to `dist/` directory
- **Distribution**: Platform-specific packages are created in `out/` directory

### Supported Platforms
- **Linux**: .deb, .rpm, .snap packages
- **Windows**: NSIS installer
- **macOS**: DMG file (configured, icons needed)

## Architecture

The application follows Electron's multi-process architecture:

### Main Process (`src/main/index.ts`)
- Manages application lifecycle and window creation
- Handles all Kubernetes API interactions via @kubernetes/client-node
- Exposes operations through IPC handlers (list, read, create, delete, apply)

### Preload Script (`src/preload/index.ts`)
- Provides secure bridge between main and renderer processes
- Exposes typed `electronAPI` interface with Kubernetes operations
- All Kubernetes operations must go through this API

### Renderer Process (`src/renderer/`)
- React application with TypeScript
- Uses Redux Toolkit for state management
- Organized by resource type (workloads, networking, configuration, etc.)
- Each resource type has:
  - Components folder with reusable UI components (badge, table, resource-link)
  - Views folder with list/details/create pages
  - Consistent pattern: list.tsx, details.tsx, create.tsx (where applicable)

## Key Patterns

### Resource Views
Each Kubernetes resource follows this structure:
```
views/[category]/[resource-type]/
├── index.ts      # Route configuration
├── list.tsx      # Table view of resources
├── details.tsx   # Detailed view with YAML editor
└── create.tsx    # Creation form (if supported)
```

### Component Structure
Resource-specific components:
```
components/[category]/[resource-type]/
├── badge.tsx         # Status/type badges
├── table.tsx         # List table component
├── resource-link.tsx # Navigation links
└── [specific].tsx    # Resource-specific components
```

### API Communication
All Kubernetes operations use the typed electronAPI with resource-specific methods:
```typescript
// List resources (examples)
await window.electronAPI.listPodForAllNamespaces()
await window.electronAPI.listNamespacedPod(namespace)
await window.electronAPI.listDeploymentForAllNamespaces()
await window.electronAPI.listNamespace()

// Get specific resource (examples)
await window.electronAPI.readNamespacedPod(name, namespace)
await window.electronAPI.readNamespacedDeployment(name, namespace)
await window.electronAPI.readNamespace(name)

// Create resources (examples)
await window.electronAPI.createNamespace(payload)
await window.electronAPI.createNamespacedPod(namespace, podSpec)
await window.electronAPI.createNamespacedConfigMap(namespace, payload)

// Delete resources (examples)
await window.electronAPI.deleteNamespacedPod(name, namespace)
await window.electronAPI.deleteNamespace(name)

// Apply YAML (generic for all resources)
await window.electronAPI.apply(yamlContent)
```

### Navigation
- Uses custom ViewProvider context for routing
- Main navigation through sidebar with categories
- Resource links use `viewProvider.navigate()` with standardized paths

## Important Conventions

1. **TypeScript Strict Mode**: All code must be type-safe
2. **Path Aliases**: Use @components, @views, @utils, @store, @providers, @types, @templates, @help, @context, @assets instead of relative imports
3. **Tailwind CSS**: Use utility classes for styling, avoid inline styles
4. **Component Naming**: Use PascalCase for components, kebab-case for files
5. **YAML Templates**: Store in `src/renderer/templates/` as TypeScript template strings
6. **Help Content**: Implement in `src/renderer/help/` following existing pattern
7. **Assets**: SVG files are handled as React components via @svgr/webpack, images as static resources

## Testing & Validation

Currently, there are no automated tests. When implementing:
- Validate YAML before applying to cluster
- Handle API errors gracefully with user-friendly messages
- Test multi-context switching thoroughly