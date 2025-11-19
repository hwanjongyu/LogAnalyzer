# Log Analysis Application Implementation Plan

## Goal Description
Build a modern desktop log analysis application using Electron, React, TypeScript, and Tailwind CSS. The app will feature high-performance log viewing for large files, advanced filtering with regex and color highlighting, and a tabbed interface for managing filter groups.

## User Review Required
- **Tech Stack**: Electron, React, TypeScript, Tailwind CSS, Zustand, React Virtuoso (or React Window).
- **File Handling**: Node.js `fs` for reading large files.
- **Persistence**: JSON for saving/loading filter configurations.

## Proposed Changes

### Project Setup
- Initialize project with `create-electron-vite`.
- Configure Tailwind CSS.
- Install dependencies: `lucide-react`, `zustand`, `react-virtuoso`, `clsx`, `tailwind-merge`.

### Core Components

#### [NEW] `src/renderer/src/store/useLogStore.ts`
- Zustand store to manage:
    - `rawLogLines`: Array of strings (original file content).
    - `filteredLineIndices`: Array of numbers (indices of lines to show).
    - `filters`: Array of Filter objects.
    - `tabs`: Array of Tab objects (grouping filters).
    - `activeTabId`: ID of the currently selected tab.
- Actions: `loadFile`, `addFilter`, `removeFilter`, `toggleFilter`, `updateFilter`, `saveTab`, `loadTab`.

#### [NEW] `src/renderer/src/components/LogViewer.tsx`
- Virtualized list component using `react-virtuoso`.
- Renders `LogLine` components.
- Handles scrolling and performance.

#### [NEW] `src/renderer/src/components/LogLine.tsx`
- Renders a single line of text.
- Applies syntax highlighting based on active filters.

#### [NEW] `src/renderer/src/components/FilterManager.tsx`
- Bottom panel UI.
- Tab management (create, delete, rename tabs).
- List of filters within the active tab.
- Controls for each filter (enable/disable, edit, delete).

#### [NEW] `src/renderer/src/components/FilterModal.tsx`
- Dialog for creating/editing filters.
- Inputs: Text/Regex, Colors, Type (Include/Exclude/Highlight), Options.

#### [NEW] `src/renderer/src/components/AppLayout.tsx`
- Main layout structure: Top Bar, Log Viewer, Filter Manager.

### Electron Main Process
- `src/main/index.ts`: Handle file open dialogs and reading files (IPC handlers).

## Verification Plan

### Automated Tests
- Unit tests for filter logic (regex matching, include/exclude precedence).

### Manual Verification
- **Load Large File**: Open a dummy 100k line log file and verify scrolling is smooth.
- **Filter Logic**:
    - Create "Include" filter -> Verify only matching lines show.
    - Create "Exclude" filter -> Verify matching lines are hidden.
    - Create "Highlight" filter -> Verify lines are colored.
- **Tabs**: Create multiple tabs with different filters and switch between them.
- **Save/Load**: Save a tab to JSON, clear it, then load it back.
