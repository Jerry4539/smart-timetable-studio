# Smart Timetable Studio

> Modern, minimal, and professional desktop application for institutional constraint-based timetable planning, built with **Tauri 2**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## Key Features

- **Desktop-First Bento Aesthetics**: Inspired by Open LLM Studio and Linear. Minimal, compact, clean, with eye-smoothing curves (`rounded-2xl`, `rounded-xl`) and zero visual clutter.
- **Default Light Mode**: Soft canvas background (`#f4f5f8`) with pure white Bento tiles (`#ffffff`) and charcoal typography (`#111827`).
- **Timetable Studio Grid (Flagship)**:
  - **Tactile Drag-and-Drop**: Drag lecture cards to reposition or swap slots smoothly.
  - **Strict Single-Line Alignment**: All periods and institutional breaks align horizontally in one clean row with zero wrapping.
  - **Two Switchable Layout Orientations**:
    - **Layout 1 (Default)**: Periods on columns / Days in rows.
    - **Layout 2**: Days on columns / Periods in rows.
  - **Configurable Default Layout**: Set default view in Settings with offline persistence.
  - **Interactive Cell Assigner**: Click any empty cell to place a lecture with auto-filtered grade subjects and qualified faculty.
- **Academic Domain & Curriculum Engine**:
  - **School Setup**: Set school name, campus, academic year, daily school start/end times, period duration, and lunch break.
  - **Standards & Divisions**: Clean grade management without unwanted room or student count clutter.
  - **Grade-Specific Curricula**: Subjects specify which standards they belong to with multi-select pills.
  - **Multi-Subject Faculty Qualifications (M:N)**: Teachers can teach multiple subjects across different standards, and subjects can be taught by one or more faculty members.
- **Automated Zero-Tolerance Verification**: Real-time checking of teacher collisions, division overlaps, teacher time-off, and workload caps.
- **Daily Faculty Substitutions & Relief Planner**:
  - Log teacher leaves with standardized categories (Medical, Casual, Official Duty).
  - Intelligent candidate matching prioritizes free, subject-qualified teachers while preventing teacher fatigue.
  - 1-click printable daily relief notice for the staff room bulletin board.
- **Vector Print & Single-Sheet PDF Station**:
  - Publication-ready timetables formatted with centered institutional headers, merged vertical breaks, curriculum legend tables, and 4 endorsement signatures.
  - 100% single-sheet guaranteed fit on A4 Landscape.
- **Multi-Version Sandbox & What-If Comparator**:
  - Clone active schedules into experimental sandbox trials.
  - Side-by-side diff metrics: counts relocated slots and faculty workload shifts.
- **High-Performance Rust Native Solver (`src-tauri`)**:
  - Backtracking CSP solver compiled in native Rust for sub-millisecond timetable generation on large institutions.
- **Portable Workspace Snapshot Engine (`.stt`)**:
  - 1-click full backup and restore of the entire institutional database to a `.stt` archive file.

---

## Technical Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Desktop Shell** | [Tauri 2](https://tauri.app/) | Secure, lightweight Windows desktop application runtime |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Type-safe UI components and user interactions |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Bento Grid layouts and custom design tokens |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | Decoupled client stores with undo/redo history |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent icons |
| **Data Persistence** | `StorageEngine` (Local / SQLite ready) | 100% offline-first local state storage |

---

## Project Structure

```
TimeTable/
├── src/
│   ├── components/
│   │   ├── academic/       # Classes, Teachers, Subjects views
│   │   ├── dashboard/      # Bento Box analytics & schedule stream
│   │   ├── generate/       # Constraint satisfaction generator UI
│   │   ├── layout/         # Shell, Sidebar, TopNavigation, CommandPalette
│   │   ├── modals/         # QuickAdd, ConflictDetail, EditLimits modals
│   │   ├── rules/          # Hard & Soft constraint specification
│   │   ├── settings/       # School Profile, Layout defaults, Theme
│   │   ├── studio/         # Timetable Studio (Drag & drop grid)
│   │   └── versions/       # Schedule versioning & sandboxes
│   ├── lib/
│   │   ├── constants.ts    # Time slots, days, subject color palettes
│   │   ├── seedData.ts     # Initial demo academic structure
│   │   ├── storage.ts      # Offline persistence engine
│   │   └── types.ts        # Domain TypeScript interfaces
│   ├── store/              # Zustand state stores
│   └── index.css           # Tailwind v4 theme & custom utilities
├── src-tauri/              # Tauri 2 native desktop configuration
├── PROGRESS.md             # Phase tracking and roadmap document
└── idea.md                 # Product specifications and instructions
```

---

## Getting Started

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser or run inside Tauri desktop window:
```bash
npm run tauri dev
```

### Production Build
```bash
npm run build
```
Typechecks via `tsc -b` and bundles via Vite in <1s.
