# Smart Timetable Studio — Build Instructions

Build a modern Windows desktop application called **Smart Timetable Studio** for schools, colleges, coaching institutes, and training centers.

## Tech Stack — DO NOT CHANGE WITHOUT A STRONG REASON

* **Tauri 2** — desktop application
* **React + TypeScript** — frontend
* **Tailwind CSS** — styling
* **shadcn/ui** — UI components
* **Lucide Icons** — icons
* **Zustand** — client state
* **React Hook Form + Zod** — forms/validation
* **dnd-kit** — drag & drop
* **SQLite** — local/offline database
* **Rust** — native layer + timetable engine/constraint solver
* Keep architecture ready for a future **Laravel API + MySQL/PostgreSQL cloud sync**, but do NOT build cloud functionality until required.

## Product Vision

This is NOT just a timetable generator.

Build a **constraint-based timetable planning and management application** where an institution defines its teachers, classes, subjects, rooms, working hours, breaks, lecture requirements, limits, availability, preferences, locked periods, activities, etc.

The system generates a feasible timetable, identifies conflicts, allows manual drag-and-drop editing, and continuously validates the timetable.

The user must always remain in control.

## Core Features

### Institution

* School/institution registration
* Academic year
* Campus
* Working days
* Institution type
* Basic settings

### Academic Structure

* Grades/classes
* Sections/divisions
* Subjects
* Teachers
* Teacher-subject-class mapping
* Class teachers
* Student count

### Time Structure

* School start/end time
* Periods
* Short breaks
* Long breaks
* Lunch
* Activities
* Custom time blocks
* Different schedules for different days if required

### Teacher Rules

* Maximum periods/day
* Maximum periods/week
* Minimum periods/day
* Maximum consecutive periods
* Available/unavailable days and periods
* Subject qualifications
* Preferences

### Subject Rules

* Periods required/week
* Maximum periods/day
* Preferred periods/day
* Double-period requirement
* Consecutive-period requirement
* Teacher requirements
* Room/lab requirements

### Rooms & Resources

* Classrooms
* Labs
* Sports areas
* Activity rooms
* Capacity
* Resource type
* Availability

### Special Lectures / Activities

Support:

* PT
* Sports
* Assembly
* Library
* Computer Lab
* Science Lab
* Art
* Music
* Club
* Counselling
* Exams
* Custom activities

### Locking

Implement:

* Hard Lock — cannot be changed
* Soft Lock — generator should avoid changing
* Preference — desirable but can be violated

### Timetable Engine

Use a proper constraint-based architecture.

Hard constraints must never be violated:

* Teacher cannot teach two classes simultaneously
* Class cannot have two lectures simultaneously
* Room cannot be double-booked
* Locked slots cannot change
* Teacher availability
* Required lecture counts
* Daily/weekly limits
* Required room/resource
* Working-day/time restrictions

Soft constraints should be optimized:

* Teacher preferences
* Balanced teacher workload
* Avoid excessive consecutive periods
* Balanced subject distribution
* Preferred morning/afternoon slots
* Avoid undesirable periods
* Other configurable preferences

The engine must explain WHY a lecture cannot be placed.

Example:
"Cannot place Mathematics on Tuesday P3 because the teacher is teaching 7B, the room is occupied, and the class slot is locked."

### Timetable Studio

Create a polished visual timetable editor with:

* Week view
* Day view
* Class view
* Teacher view
* Room view
* Subject view
* Drag & drop
* Copy/paste
* Move
* Duplicate
* Delete
* Lock/unlock
* Undo/redo
* Search/filter
* Visual conflict indicators
* Side panel with lecture details
* Real-time validation

### Dashboard / Health

Show:

* Hard conflicts
* Missing lectures
* Teacher overload
* Class overload
* Room conflicts
* Locked-slot violations
* Soft constraints satisfied
* Teacher workload
* Class workload
* "Ready to Publish" status

### Versioning

Never destroy previous timetables.

Support:

* Draft
* Generated version
* Manual-adjustment version
* Final version
* Published version
* Duplicate timetable
* Restore previous version
* Version history

### Sandbox

Allow administrators to duplicate a timetable and experiment without affecting the published timetable.

### Export / Publish

Eventually support:

* Printable timetable
* PDF
* Teacher timetable
* Class timetable
* Room timetable
* School-wide timetable

## UI/UX Direction

Make the application feel like a combination of:

* Figma
* Notion
* Modern calendar software
* Professional school administration software

NOT like an old-school ERP.

Requirements:

* Clean
* Professional
* Modern
* Responsive desktop layout
* Excellent spacing
* Strong typography
* Light + dark mode
* Keyboard shortcuts where useful
* Smooth drag/drop
* Subtle animations
* Clear empty states
* Clear error states
* No unnecessary gradients
* No excessive rounded cards
* No visual clutter
* No emoji-based UI
* Use Lucide icons
* Prioritize usability over decoration

The timetable grid should be the main visual focus.

## Architecture

Separate the application into:

Frontend:
React + TypeScript

Desktop:
Tauri

Native/engine:
Rust

Database:
SQLite

Conceptually:

React UI
↓
Tauri Commands
↓
Rust Services
↓
Scheduler / Validator
↓
SQLite

Keep business logic out of React components.

Create reusable services, types, schemas, repositories and domain models.

## Development Phases

### Phase 0 — Foundation

* Create Tauri + React + TypeScript project
* Configure Tailwind
* Configure shadcn/ui
* Configure routing
* Configure Zustand
* Configure SQLite
* Establish folder architecture
* Create `PROGRESS.md`
* Create basic app shell

### Phase 1 — UI/UX Foundation

Build:

* Sidebar
* Top navigation
* Dashboard
* Institution setup
* Theme system
* Empty states
* Loading states
* Notification system
* Command/search interface if useful

Do NOT build the scheduling algorithm yet.

### Phase 2 — Academic Data

Build CRUD for:

* Institution
* Academic years
* Grades
* Sections
* Teachers
* Subjects
* Teacher-subject mappings
* Rooms/resources

Add proper validation and database persistence.

### Phase 3 — Time Structure

Build:

* Working days
* School timing
* Period configuration
* Short breaks
* Long breaks
* Lunch
* Custom blocks
* Day-specific schedules

Create a visual time-structure editor.

### Phase 4 — Rules & Constraints

Build:

* Teacher limits
* Subject requirements
* Availability
* Room requirements
* Double periods
* Consecutive periods
* Hard locks
* Soft locks
* Preferences

Create a clear rules-management UI.

### Phase 5 — Timetable Studio

Build the main timetable editor:

* Grid
* Class/teacher/room views
* Drag/drop
* Move
* Copy
* Delete
* Lock
* Filters
* Search
* Lecture detail panel
* Undo/redo

### Phase 6 — Validation Engine

Build real-time validation for:

* Teacher conflicts
* Class conflicts
* Room conflicts
* Workload limits
* Missing lectures
* Locked slots
* Availability
* Resource requirements

Always explain conflicts clearly.

### Phase 7 — Timetable Generator

Implement the Rust constraint-based scheduler.

Process:

1. Read configuration
2. Build scheduling variables
3. Apply hard constraints
4. Apply soft constraints
5. Generate feasible timetable
6. Optimize preferences
7. Return timetable + diagnostics
8. Show results in Timetable Studio

Never hide unsatisfied constraints.

### Phase 8 — Workload & Health

Build:

* Teacher workload dashboard
* Class workload
* Subject distribution
* Conflict dashboard
* Timetable health
* Generator diagnostics

### Phase 9 — Versioning & Sandbox

Build:

* Versions
* Duplicate timetable
* Compare versions
* Restore
* Sandbox mode
* Draft/final/published states

### Phase 10 — Export & Publishing

Build:

* PDF
* Print layouts
* Teacher timetable
* Class timetable
* Room timetable
* School-wide timetable

### Phase 11 — Advanced Features

Only after the core system is stable:

* Special events
* Exam schedules
* Emergency timetable changes
* Teacher absence impact analysis
* Temporary substitutions
* Multiple campuses
* Multiple academic years
* Cloud sync/API
* User roles/permissions
* Backup/restore

## PROGRESS.md — Mandatory

Maintain a root-level `PROGRESS.md`.

After EVERY meaningful development task, update it.

It must contain:

1. Current phase
2. Overall completion percentage
3. Completed features
4. Features currently being developed
5. Next tasks
6. Known bugs
7. Architecture decisions
8. Database changes
9. Important TODOs
10. Last completed task
11. Exact recommended next task

Example:

```md
# Smart Timetable Studio Progress

## Current Phase
Phase 3 — Time Structure

## Overall Progress
32%

## Completed
- Tauri project
- React + TypeScript
- Tailwind
- SQLite
- Teacher CRUD
- Subject CRUD

## In Progress
- Visual period editor

## Next
1. Finish period editor
2. Add break blocks
3. Add day-specific schedules
4. Update database schema
5. Add validation

## Known Bugs
- ...

## Architecture Decisions
- SQLite is the local source of truth
- Scheduling engine belongs in Rust
- React contains presentation/state only

## Last Completed Task
...

## Next Recommended Task
...
```

## CRITICAL CONTINUATION RULE

Whenever a new AI coding session starts:

1. Read `PROGRESS.md` FIRST.
2. Inspect the existing project before changing anything.
3. Understand the current phase.
4. Continue from the `Next Recommended Task`.
5. Do NOT rebuild completed features.
6. Do NOT randomly redesign existing architecture.
7. Do NOT introduce a new framework without a strong reason.
8. Update `PROGRESS.md` after completing work.
9. If something is incomplete, record it clearly.
10. Keep the application runnable after each meaningful phase.

Before implementing a feature, check whether the required database model, domain type, service, UI component, or validation already exists.

Prefer small, maintainable changes over huge rewrites.

## Important Development Principle

Build the product in this order:

**Data Model → Rules → Validation → Timetable Engine → Visual Editor → Generator → Advanced Features**

Do not start by building a complicated generator before the underlying data and constraints are well defined.

The final application should feel like a professional desktop product, not a web page packaged as an EXE.
