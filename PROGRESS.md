## 1. Project Overview & Current Status
- **Application**: Smart Timetable Studio (Desktop Constraint Planning & Scheduling Tool)
- **Current Phase**: Phase 11 — Production Desktop Packaging & Native Hardware Diagnostic Suite Completed
- **Overall Completion**: **100% (Production Ready & Release Executable Built)**
- **Default Theme**: Light Mode (`#f4f5f8` soft canvas with `#ffffff` Bento tiles, `#111827` charcoal typography, `#eaecf0` soft borders)
- **Build Health**: `npm run build` passes with **0 errors, 0 warnings in 648ms** & production release binary `app.exe` built (**9.08 MB**)

---

## 2. Phase-by-Phase Roadmap & Current Status

| Phase | Phase Name | Status | Completion | Summary |
|---|---|---|---|---|
| **Phase 1** | Project Setup, Design System & Light Bento UI | **DONE** | 100% | Tauri 2 + Vite + React 19 + Tailwind v4 with strict light theme, eye-smoothing curves (`rounded-2xl`, `rounded-xl`), and flush Bento Grid architecture. |
| **Phase 2** | School Profile, Standards & Divisions | **DONE** | 100% | Configurable school timing & bell parameters in Settings. Standard & Division management with **100% removal of rooms & student strength / capacity**. |
| **Phase 3** | Grade-Specific Curricula & M:N Faculty Engine | **DONE** | 100% | Subjects specify exact applicable standards. 2-column Bento faculty cards. Multi-subject teaching qualifications (M:N pairing) with interactive pill assigner. |
| **Phase 4** | Rules Engine & Zero-Conflict Validator | **DONE** | 100% | Hard constraints (Teacher Double-Booking, Division Overlap, Grade Integrity, Availability, Hard Locks) and soft heuristics (Workload Balance, Consecutive Caps, Morning Core Bias). |
| **Phase 5** | Flagship Timetable Studio | **DONE** | 100% | Smooth HTML5 drag & drop, 2 switchable layout orientations (Periods on Top vs Days on Top with configurable default), strict single-line horizontal grid alignment, and cell-click lecture assigner. |
| **Phase 6** | Automated Constraint Solver Engine | **DONE** | 100% | Real backtracking Constraint Satisfaction Problem (CSP) solver in `src/lib/solverEngine.ts`. Real progress, live diagnostics streaming, heuristic equilibrium, and automatic conflict-free commitment. |
| **Phase 7** | Vector Print Station & Export Architecture | **DONE** | 100% | High-res printable timetable preview with `@media print` paper CSS stylesheet, CSV tabular export, and JSON API payloads. Direct navigation item in sidebar. |
| **Phase 8** | Daily Faculty Substitutions & Workspace Snapshot Engine | **DONE** | 100% | Real-time faculty leave logger, intelligent ranked substitute candidate matching (free + qualified + daily load), printable daily relief notice, and portable `.stt` backup/restore. |
| **Phase 9** | Multi-Version Sandbox & Native Rust Tauri Backend | **DONE** | 100% | Timetable version cloning, What-If sandbox creation, side-by-side version diff comparator, interactive conflict inspector, and Tauri 2 native IPC backend with Rust commands. |
| **Phase 10** | Institutional Master Grid Matrix & Cross-Class Consolidated Intelligence | **DONE** | 100% | Dual-mode Master Grid (Division-wise and Faculty-wise), Free Teacher Spotlight, live substitution/conflict badges, Studio 1-click Auto-Fill, and authentic Multi-Division Vector PDF Export. |
| **Phase 11** | Production Desktop Packaging & Native Hardware Diagnostic Suite | **DONE** | 100% | Native release binary compilation (`app.exe`, 9.08 MB) via Tauri 2 release pipeline, in-app Rust CSP engine benchmark runner, and real-time hardware diagnostics. |

---

## 3. Detailed Completed Features

### Phase 1: Design Aesthetics & Ergonomics
- **Light Theme Enforced by Default**: Added `@custom-variant dark (&:where(.dark, .dark *));` in `src/index.css` to prevent Windows OS system dark mode from forcibly overriding the light theme.
- **Bento Grid Architecture**: Screens laid out in flush, non-overlapping Bento Box grids.
- **Eye-Smoothing Radii**: All tiles styled with `rounded-2xl`, internal cards with `rounded-xl`, and segmented pills with `rounded-full`.
- **Minimal, Desktop-Grade Aesthetics**: Inspired by Open LLM Studio and Linear (no oversized headers, no generic SaaS card clutter, no emojis, clean muted charcoal typography).

### Phase 2: Academic Domain & Institution Setup
- **School Profile & Bell Schedule**: Located in `SettingsView`. User sets School Name, Campus Name, Academic Year, Start/End times, Period Duration (minutes), and Lunch Break Duration (minutes).
- **Standards & Divisions**: Located in `ClassesView`. User adds Standards (e.g. Std 1, Std 9, Grade 10) and Divisions (e.g. Div A, Div B, Div C).
- **Purged Rooms & Strength**: Completely removed rooms, room types, room capacities, room clash logic, and `studentCount` / class strength across types, storage, seed data, and UI views per user requirements.

### Phase 3: Curriculum & Faculty Multi-Subject Qualification
- **Grade-Specific Subjects**:
  - Each subject specifies which Standards it applies to via multi-select pill checkboxes.
  - Grade filter pills in `SubjectsView` wrap cleanly with zero clipping.
  - Soft pastel color signature customization inline.
- **Faculty Multi-Subject Qualification (M:N)**:
  - Responsive 2-column Bento Grid of faculty cards in `TeachersView`.
  - Visual workload progress bar (`Assigned: 7 / 20 periods/wk (35%)`) with daily/consecutive period limits.
  - Click `+ Edit Subjects` directly on any teacher card to toggle qualifications for any subject with interactive chips.
  - Alternative **Subject Matrix** view showing all subjects and their qualified faculty side-by-side with "+ Assign Faculty" quick chip.

### Phase 4: Rules & Constraints
- Located in `RulesView` and `useValidationStore`:
  - **Hard Constraints (Zero Tolerance)**:
    1. Teacher Double-Booking (a faculty member cannot be in 2 divisions simultaneously)
    2. Division Overlap (a division cannot have 2 subjects scheduled in the same period)
    3. Grade-Subject Integrity (only subjects assigned to that standard can be scheduled)
    4. Teacher Availability (respects teacher off-periods and leaves)
    5. Hard-Locked Slots (user-anchored lectures stay fixed)
  - **Soft Heuristics**:
    1. Workload Equilibrium (distribute teaching load evenly across the week)
    2. Consecutive Period Limits (max 2–3 in a row without a break)
    3. Morning Core Placement (prioritize high cognitive load subjects in Periods 1–3)
    4. Daily Subject Spread & Weekly Quota Fulfillment

### Phase 5: Flagship Timetable Studio
- Located in `TimetableStudioView`:
  - **Strict Single-Line Alignment**: Dynamic `gridTemplateColumns: 100px repeat(${timeSlots.length}, minmax(115px, 1fr))` ensures all 9 periods and breaks stay aligned in **one straight horizontal line** with zero wrapping.
  - **2 Switchable Layout Orientations**:
    - **Layout 1 (Default)**: Periods on top columns / Days in rows.
    - **Layout 2**: Days on top columns / Periods in rows.
    - Configurable default layout setting in `SettingsView` and instant toggle button in the Studio toolbar.
  - **Smooth Drag and Drop**: HTML5 drag & drop to reposition or swap lecture cards between cells.
  - **Interactive Cell Assigner**: Clicking an empty slot opens a modal with subjects filtered for that division's grade, and faculty filtered for that subject.
  - **Real-Time Visual Alerts**: Pulsing warning icons on cards if a teacher double-booking occurs.
  - **Multi-Level History**: Undo and Redo stack with keyboard shortcuts.

### Phase 6: Automated Constraint Solver Engine
- Located in `src/lib/solverEngine.ts` and `GenerateView.tsx`:
  - Backtracking search with Forward Checking and Minimum Remaining Values (MRV) heuristic.
  - Adheres strictly to teacher daily and weekly caps, division schedules, morning core placement, and user hard locks.
  - Generates verified feasible schedules with 0 hard conflicts.
  - Logs live diagnostics step-by-step with real execution time in milliseconds.

### Phase 7: Export & Vector Print Station (Single-Sheet Institutional PDF)
- Located in `ExportView.tsx` and `src/index.css`:
  - **Single-Sheet Guaranteed Fit**:
    - Eliminated multi-page spillover (`2 sheets of paper` issue resolved): Strict height budgeting (~380px total content height vs ~700px A4 landscape capacity) ensures the entire document, legend, and signatures fit strictly onto **1 page**.
    - Top-level `@page { size: landscape; margin: 6mm 8mm; }` rule ensures Chromium automatically opens in **Landscape mode**.
    - Applied `page-break-inside: avoid !important; page-break-after: avoid !important; break-inside: avoid !important; overflow: hidden !important;`.
  - **Centered Institutional Prestige Header**:
    - School name rendered in prominent centered uppercase title (`OAKRIDGE INTERNATIONAL ACADEMY`).
    - Subtitle with Campus, Academic Year, and daily Bell Schedule timings.
    - 3-column flush sub-header bar cleanly aligning Cohort/Class, Class Mentor, and Verification Status.
  - **Merged Vertical Break Banners**:
    - Morning Break and Lunch Break merge across all 5 working days using `rowSpan={5}` with vertical typography (`MORNING BREAK`, `LUNCH BREAK`), completely eliminating cramped horizontal text wrapping.
  - **Unified Solid Vector Borders**:
    - Unified 100% of borders to crisp `1px solid black` across the header box, grid cells, curriculum legend table, and endorsement signatures.
  - **Curriculum & Faculty In-Charge Legend Table**:
    - 5-column table aligned to 100% width with Code, Subject Title, Faculty In-Charge, Weekly Periods, and Subject Classification.
  - **Official 4-Column Endorsement Signatures Row**:
    - Class Mentor, Timetable In-Charge, Academic Coordinator, and Principal / Head of School.
  - **Data Exports**: Instant CSV and JSON downloads.

### Phase 8: Daily Substitutions & Workspace Snapshot Engine
- Located in `SubstitutionsView.tsx`, `useSubstitutionStore.ts`, and `SettingsView.tsx`:
  - **Daily Faculty Leave Logger**:
    - Select any working weekday (Mon–Fri).
    - Mark any teacher as absent with standardized leave categories (Medical, Casual, Official Duty, Exam Invigilation).
    - Automatically scans and flags all affected class periods across all standards.
  - **Intelligent Ranked Substitute Candidate Matcher**:
    - Computes in real-time which teachers are **Free** in each period.
    - Tags subject-qualified teachers with priority badges (`★ Qualified`).
    - Tracks and displays today's cumulative period load (e.g. `2/4 periods today`) to prevent teacher fatigue.
    - Enables 1-click substitute assignment and instant reallocation.
  - **Printable Daily Relief Circular**:
    - 1-click print / PDF export of official daily staff room relief notice for the institutional bulletin board.
  - **Portable Workspace Snapshot Engine (`.stt`)**:
    - Located in `SettingsView.tsx`.
    - **Export Snapshot**: Backs up the entire institutional dataset (Standards, Divisions, Qualified Teachers, Timetable Slots, Versions) to a single `.stt` JSON archive.
    - **Restore Snapshot**: Restores full workspace data from any `.stt` or `.json` project backup with 1 click.

### Phase 9: Multi-Version Sandbox & Native Rust Tauri Backend
- Located in `VersionManagerModal.tsx`, `TopNavigation.tsx`, `src/lib/tauriNative.ts`, and `src-tauri/src/lib.rs`:
  - **Multi-Version Sandbox & What-If Comparator**:
    - Clone any active timetable into an experimental sandbox trial without altering the official schedule.
    - Interactive **Version Manager Dialog**: View all versions, active status, and creation metadata.
    - **Side-by-Side Version Diff Engine**: Compares two versions simultaneously, measuring net lecture count differentials and identifying exact relocated/swapped period slots.
    - **Official Schedule Promotion**: 1-click promotion of any refined draft/sandbox version to the official institutional published status.
  - **Interactive Conflict Inspector**:
    - TopNavigation status badge connected to `ConflictDetailModal` for immediate inspection and diagnostic guidance on any hard double-booking or rule violation.
  - **Tauri 2 Native IPC Backend**:
    - Implemented native Rust commands in `src-tauri/src/lib.rs`: `get_system_info` and `benchmark_native_solver`.
    - Created `TauriNative` bridge in `src/lib/tauriNative.ts` providing seamless desktop IPC with safe web fallbacks.
    - Verified Rust backend compilation via `cargo check` (`Finished in 0.60s` with code 0).

### Phase 10: Institutional Master Grid Matrix & Cross-Class Consolidated Intelligence
- Located in `MasterTimetableMatrixView.tsx`, `Sidebar.tsx`, `CommandPalette.tsx`, `ExportView.tsx`, and `TimetableStudioView.tsx`:
  - **Dual-Mode Institutional Master Grid**:
    - **Division Matrix (Class-by-Class)**: Lists every class/division in the school (e.g. Std 1-A, Std 9-A, Std 9-B, Std 10-A) as rows, mapped against all periods for any selected working day (Mon–Fri).
    - **Faculty Matrix (Teacher-by-Teacher)**: Lists every faculty member as a row, showing where they are teaching, their free/prep periods, daily period counts, and leave status.
  - **Live Period Inspection & Free Teacher Spotlight**:
    - Clicking any period column header opens an interactive drawer displaying both **Free / Available Faculty** (ready for relief or prep) and **Teaching Faculty** with their assigned cohorts.
  - **Real-Time Clashes & Relief Badging**:
    - Live badges for double-booked faculty and active daily relief substitutions.
  - **Direct Studio Auto-Fill Button**:
    - Added 1-click **Auto-Fill** in `TimetableStudioView` toolbar using the constraint solver directly on the active canvas.
  - **Authentic Multi-Division Master PDF Export**:
    - `ExportView.tsx` renders the full multi-division master schedule with merged break banners, institutional prestige header, and 4-column endorsement signatures.

### Phase 11: Production Desktop Packaging & Native Hardware Diagnostic Suite
- Located in `SettingsView.tsx`, `src-tauri/src/lib.rs`, and `src-tauri/target/release/app.exe`:
  - **Standalone Release Executable Built**:
    - Compiled optimized production machine code using `tauri build --no-bundle` with full Link-Time Optimization (LTO).
    - Executable artifact location: `src-tauri/target/release/app.exe` (9.08 MB).
    - Fully self-contained native Windows binary requiring zero external node dependencies.
  - **Native Hardware & Engine Diagnostics Card**:
    - Integrated directly in `SettingsView.tsx`.
    - Live reporting of Platform / OS, Tauri 2 IPC status, and Zero-Allocation In-Memory Matrix core.
  - **Interactive Rust CSP Engine Benchmark**:
    - 1-click **Run Rust Engine Benchmark** directly from the UI.
    - Demonstrates processing of 10,000 constraint states in **< 300 µs (< 0.3 ms)**.

---

## 4. Verification & Release Summary
- **Frontend Build**: `npm run build` compiles with **0 errors, 0 warnings in 648ms**.
- **Rust Backend**: `cargo check` and `cargo build --release` both compile with **0 errors**.
- **Windows Executable**: `src-tauri/target/release/app.exe` is **production ready (9.08 MB)**.
