# QA Tools Hub & Ecosystem

A unified, modular QA engineering portal and testing ecosystem. It aggregates specialized QA tools, study hubs, test management systems, and practice testing sandboxes into a cohesive, single-page monorepo architecture.

---

## 1. Architecture Overview

The QA Tools Hub runs as a modular single-page React application where a **central dashboard** acts as the parent shell, and each sub-tool operates within its own **isolated path prefix and folder boundary**.

```text
                               +-----------------------------+
                               |     Top Navigation Shell    |
                               |    (Header / Theme / ⌘K)    |
                               +--------------+--------------+
                                              |
               +------------------------------+------------------------------+
               |                                                             |
+--------------v---------------+                             +---------------v--------------+
|     Central QA Dashboard     |                             |   Modular Tool Applications   |
|         Path: `/`            |                             |   (Self-contained sub-apps)  |
| - Tool Discovery & Filtering |                             +---------------+--------------+
| - Quick Launch / Recent      |                                             |
| - Command Palette (⌘K)       |              +------------------------------+------------------------------+
+------------------------------+              |                              |                              |
                               +--------------v---------------+ +------------v----------------+ +------------v---------------+
                               | Test Management System (TMS) | |        QA Study Hub         | |    QA Demo Testing Store   |
                               | Path: `/tms/*`               | | Path: `/qa-studyhub/*`      | | Path: `/demo-testing/*`    |
                               +------------------------------+ +-----------------------------+ +----------------------------+
                               | API Testing Studio           | | Automation Code Generator   | | Performance Benchmarker    |
                               | Path: `/api-testing/*`       | | Path: `/automation/*`       | | Path: `/performance-testing/*` |
                               +------------------------------+ +-----------------------------+ +----------------------------+
```

---

## 2. Directory Structure

```text
├── apps/
│   ├── dashboard/            # Central Tools Hub UI, search, and command palette
│   ├── tms/                  # Test Management System (Test Cases, Runs, Defects)
│   ├── qa-studyhub/          # QA Certification & Interview Knowledge Base
│   ├── demo-testing/         # Interactive E-commerce Sandbox for Practice Testing
│   ├── api-testing/          # REST API Request & Assertion Testing Studio
│   ├── automation/           # Page Object Model & Multi-framework Locator Generator
│   ├── performance-testing/  # Little's Law & Concurrency Capacity Calculator
│   └── test-data/            # Synthetic Test Data & Boundary Case Generator
├── packages/
│   ├── registry/             # Canonical tool definitions, categories, and routes
│   └── shared-ui/            # Shared header, theme provider, and global components
├── src/
│   ├── App.tsx               # Root router mounting all tool paths
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global Tailwind stylesheet
├── index.html                # HTML entry point with metadata
├── metadata.json             # Applet capabilities and runtime permissions
├── package.json              # Project dependencies and build scripts
└── tsconfig.json             # TypeScript configuration
```

---

## 3. Applications & URL Route Registry

All tools are mounted under strict, dedicated URL path prefixes:

| Application | Path Prefix | Folder Location | Description |
| :--- | :--- | :--- | :--- |
| **QA Tools Hub Dashboard** | `/` | `apps/dashboard/` | Central catalog, global search, and command palette |
| **Test Management System** | `/tms/*` | `apps/tms/` | Test suites, executions, bug tracker, requirements matrix |
| **QA Study Hub** | `/qa-studyhub/*` | `apps/qa-studyhub/` | Tracks for Manual, API, Selenium, CI/CD, and Interview Prep |
| **Demo Testing Sandbox** | `/demo-testing/*` | `apps/demo-testing/` | E-commerce test site with intentional bugs and inspector |
| **API Testing Studio** | `/api-testing/*` | `apps/api-testing/` | REST client with preset payloads, status codes, and timers |
| **Automation Playground** | `/automation/*` | `apps/automation/` | Code generators for Playwright, Selenium, and Cypress |
| **Performance Benchmarker** | `/performance-testing/*` | `apps/performance-testing/` | Little's Law TPS-to-VU calculator and k6 scripts |
| **Test Data Generator** | `/test-data/*` | `apps/test-data/` | Generates random mock datasets and edge-case boundary values |

---

## 4. Core Architecture & Isolation Rules

To maintain long-term stability and clean code boundaries:

### Rule 1: One Tool = One Separate Folder
* Every tool must reside inside its own dedicated directory under `apps/<tool-name>/`.
* A tool must contain its own sub-components, pages, and local state management within its directory.
* Never place tool-specific code directly inside `src/` or inside other tools' directories.

### Rule 2: Strict Route Isolation & Deep Linking
* Every tool must namespace **all** its internal pages and sub-routes under its designated base path (e.g., `/tms/test-cases`, `/qa-studyhub/manual`, `/demo-testing/cart`).
* Sub-applications must handle wildcard route matching using React Router: `<Route path="/tool-name/*" element={<ToolApp />} />`.
* All internal links inside a tool must include the full path prefix (e.g., `<Link to="/demo-testing/cart">`).

### Rule 3: Single Source of Truth for Tools
* The list of tools displayed in the dashboard and command palette is governed exclusively by `packages/registry/index.ts`.
* Adding or modifying a tool requires updating this registry.

---

## 5. How to Add a New Tool

Follow these 3 steps to add a new tool to the hub:

### Step 1: Create the Tool Directory & Component
Create a new folder in `apps/<your-tool-name>/src/` with its main entry component:

```tsx
// apps/my-tool/src/MyToolApp.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

export const MyToolApp: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">My New QA Tool</h1>
      <Routes>
        <Route path="/" element={<div>Tool Home</div>} />
        <Route path="/details" element={<div>Tool Details</div>} />
      </Routes>
    </div>
  );
};
```

### Step 2: Register in `packages/registry/index.ts`
Add the tool's metadata to `TOOLS_REGISTRY`:

```ts
{
  id: 'my-tool',
  name: 'My New QA Tool',
  description: 'Description of what the tool accomplishes.',
  category: 'Automation & Code',
  path: '/my-tool',
  icon: 'Code2',
  color: 'emerald',
  tags: ['Utility', 'Testing'],
  status: 'active',
  version: '1.0.0',
  features: ['Feature 1', 'Feature 2']
}
```

### Step 3: Mount the Route in `src/App.tsx`
Import your component and add the wildcard route:

```tsx
import { MyToolApp } from '../apps/my-tool/src/MyToolApp';

// Inside <Routes>:
<Route path="/my-tool/*" element={<MyToolApp />} />
```

---

## 6. Development & Build Commands

### Prerequisites
* Node.js 18+
* npm

### Local Development
```bash
# Start the development server on port 3000
npm run dev
```

### Type Checking & Linting
```bash
# Run TypeScript compilation checks
npm run lint
```

### Production Build
```bash
# Generate optimized static bundle in dist/
npm run build
```

---

## 7. Guidelines for AI Coding Agents

When working on this codebase, adhere strictly to the following rules:

### What an Agent MUST DO:
* **Scope Edits to Target Tool:** When updating or debugging a feature in `apps/<tool-name>`, modify only the files within that tool's folder and relevant registry entries if needed.
* **Preserve Path Isolation:** Always prefix any new route or navigation link with the tool's base URL path (e.g., `/tms/...`).
* **Keep Shared Interfaces Pure:** Use `packages/shared-ui` and `packages/registry` for shared contracts. Do not import private sub-components across different tools.
* **Validate Compilation:** Always run `lint_applet` / `compile_applet` after making structural changes to verify zero TypeScript errors.

### What an Agent MUST NOT DO:
* **DO NOT** delete or overwrite existing tool folders when asked to build or edit a different tool.
* **DO NOT** hardcode localhost URLs or arbitrary ports. The application uses standard relative routing.
* **DO NOT** place tool-specific logic in `src/App.tsx`; `App.tsx` should only serve as the top-level route coordinator.
* **DO NOT** change the root path `/` away from the central Dashboard.
