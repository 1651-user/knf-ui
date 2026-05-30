# KNF Studio UI/UX & Functionality Analysis

This document provides a comprehensive analysis of the KNF Studio Descriptor Engine frontend, identifying what it lacks and outlining suggestions for UI/UX modifications and functional improvements.

## 1. Current State Assessment
The application is a React/TypeScript frontend (built with Vite and TailwindCSS) that visually manages the computation and analysis of KNF molecular descriptors. It currently uses mock data (`src/data/mockData.ts`) to simulate runs, jobs, and analysis results (SNCI/SCDI). The UI employs the `shadcn-ui` component library for a clean, modern look.

## 2. What the Project Lacks

### A. Real Backend Integration & Data Persistence
-   **No Actual Computations:** The engine only simulates operations. There is no real backend API integration to handle actual file uploads, manage Python/Torch/Multiwfn computations, or receive live progress updates.
-   **No Data Persistence:** Refreshing the page resets all runs, jobs, and settings to the mock default state. Local storage is only used minimally for settings.

### B. UI/UX Shortcomings
-   **Form Validation:** The Run Manager configuration lacks strict validation (e.g., preventing negative workers, ensuring valid charge/spin states before submission).
-   **Error Handling:** Generic error states are used. The app could provide more specific feedback when file parsing fails or when simulated network/backend errors occur.
-   **Responsive Design Polish:** While somewhat responsive, dense data tables (like in the Results page) can become difficult to read on smaller screens.
-   **Accessibility (a11y):** Missing comprehensive aria labels, focus management for modals, and keyboard navigation support in custom complex components (like the Quadrant Chart).

### C. Feature Gaps
-   **User Authentication & Projects:** No concept of users, workspaces, or saving different projects/datasets.
-   **Advanced Visualizations:** The application lacks 3D molecular viewers (e.g., NGL Viewer or 3Dmol.js) to visualize the generated descriptor fields directly in the browser.
-   **Data Comparison:** No ability to select multiple runs and compare their aggregate SNCI/SCDI data side-by-side.
-   **Real-time Updates:** Lacks WebSocket or Server-Sent Events (SSE) integration for streaming live terminal logs or run progress.

---

## 3. Recommended Modifications and Actions

### A. Backend & Data Management
1.  **Develop/Integrate Backend API:** Connect to a Python backend (FastAPI/Flask) that handles the actual Torch/Multiwfn computations.
2.  **Implement WebSockets:** Use WebSockets for live status updates on Run progress, worker statistics, and streaming log lines.
3.  **State Management:** Replace the static mock data with a robust state management solution (e.g., React Query or Redux Toolkit) to handle API data fetching, caching, and synchronization.

### B. UI & UX Enhancements
1.  **3D Molecular Visualization:** Integrate libraries like `3dmol.js` or `@react-three/fiber` in the `RunDetails` or `Results` pages to view the 3D structures and NCI surfaces.
2.  **Enhance Data Tables:** Add pagination, multi-column sorting, and advanced filtering to the Results table to handle thousands of molecular files smoothly.
3.  **Form Improvements:** Implement `react-hook-form` and `zod` schema validation in the `RunManager` configuration to prevent invalid settings from being submitted.
4.  **Dark Mode Toggle:** Implement a user-facing dark/light mode toggle (the architecture supports it via Tailwind, but a UI switch is missing).

### C. Codebase Health & Refactoring
1.  **Fix Linting Errors:** Clean up existing TypeScript strictness issues (e.g., `any` types, empty interfaces, and `react-hooks/exhaustive-deps` warnings).
2.  **Component Refactoring:** Break down large files (like `Results.tsx` and `RunManager.tsx`) into smaller, more manageable sub-components.
3.  **Testing:** Expand the test suite (currently only one basic test) to include integration tests for complex UI flows and unit tests for data transformation logic (like the quadrant assignment).
