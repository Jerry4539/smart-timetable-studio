# UI/UX DESIGN SYSTEM — IMPORTANT

The application must feel like a **premium, modern professional desktop product**, not a traditional school ERP and not a colorful children's application.

The design should be:

* Clean
* Minimal
* Professional
* Spacious
* Responsive
* Highly readable
* Visually calm
* Modern
* Slightly playful through motion, not through excessive colors
* Easy to understand at a glance

## COLOR PHILOSOPHY

Use a **bright, soft, controlled color system**.

Do NOT use a rainbow-heavy interface.

The application itself should primarily use:

* White / off-white
* Very light neutral backgrounds
* Dark charcoal text
* Soft gray borders
* One subtle primary accent

Use color mainly to communicate information.

### Subject Colors

Every subject should automatically receive its own distinct but **soft/pastel color**.

Example:

```text
Mathematics      Soft Blue
English          Soft Purple
Science          Soft Green
History          Soft Amber
Geography        Soft Teal
Computer         Soft Indigo
Art              Soft Pink
Music             Soft Orange
Sports            Soft Red
Hindi             Soft Cyan
```

Important:

Subject colors must be:

* Muted
* Professional
* Easy on the eyes
* Distinguishable
* Accessible
* Consistent throughout the application

Do NOT use extremely bright neon colors.

Do NOT randomly change subject colors.

Once a subject receives a color, keep it consistent everywhere:

* Timetable
* Teacher view
* Class view
* Dashboard
* Filters
* Reports
* Print/PDF
* Search results

## TIMETABLE COLORS

The timetable grid should remain mostly neutral.

Example:

```text
MONDAY

08:10   ┌──────────────┐
        │ Mathematics  │
        │ Rahul Sharma │
        └──────────────┘

08:50   ┌──────────────┐
        │ English      │
        │ Priya Shah   │
        └──────────────┘
```

Use the subject's color as a **visual identifier**, not as a huge background block.

Prefer:

* subtle tinted backgrounds
* colored left borders
* small color indicators
* soft badges
* restrained accents

Avoid large saturated blocks.

## TIMETABLE HIERARCHY

The timetable is the most important part of the application.

Prioritize:

1. Subject name
2. Teacher
3. Room
4. Period/time
5. Status indicators

Example:

```text
┌─────────────────────────┐
│ Mathematics             │
│ Rahul Sharma            │
│ Room 204                │
│                         │
│        Locked           │
└─────────────────────────┘
```

Do not overload timetable cells with unnecessary information.

Information should appear progressively:

* Essential information visible immediately
* Additional information on hover/click
* Full information in the detail panel

## NO EMOJIS

Do NOT use emojis anywhere in the UI.

Use:

* Lucide icons
* Flat icons
* Minimal animated icons
* SVG icons
* Custom line icons where appropriate

Icons should communicate functionality rather than decoration.

Examples:

```text
Settings       → Settings icon
Teachers       → Users icon
Subjects       → Book/OpenBook icon
Classes        → School icon
Rooms          → Door/Building icon
Timetable      → Calendar/Grid icon
Lock           → Lock icon
Conflict       → Alert icon
Search         → Search icon
Generate       → Spark/Refresh-style icon
Export         → Download icon
History        → History icon
```

## ICON STYLE

Use one consistent icon family throughout the application.

Preferred:

**Lucide Icons**

Icons should generally be:

* Outline/flat
* Clean
* Simple
* Consistent stroke width
* Medium visual weight

Avoid mixing multiple icon styles.

## ANIMATION

Animations should make the application feel polished, not distracting.

Use subtle animations for:

* Sidebar transitions
* Modal opening
* Dropdowns
* Dragging timetable cards
* Moving lectures
* Validation results
* Saving
* Generating timetable
* Toast notifications
* Page transitions
* Hover states
* Loading states

Animations should generally be:

* 150–250ms
* Smooth
* Purposeful

Avoid:

* bouncing UI
* excessive scaling
* spinning everything
* large transitions
* distracting particle effects
* flashy animations

## DRAG & DROP EXPERIENCE

Dragging a lecture should feel extremely polished.

When dragging:

```text
Normal
   ↓
Lift slightly
   ↓
Show shadow
   ↓
Highlight valid destinations
   ↓
Show invalid destinations subtly
   ↓
Drop
   ↓
Animate into place
```

Valid destination:

* subtle highlight

Invalid destination:

* muted warning state

Locked destination:

* clearly locked

Do not use huge warning colors everywhere.

## CONFLICT DESIGN

Conflicts should be obvious but not visually aggressive.

Example:

```text
┌──────────────────────────┐
│ Mathematics              │
│ Rahul Sharma             │
│ Room 204                 │
│                          │
│  ! Teacher conflict      │
└──────────────────────────┘
```

Use:

* subtle warning background
* clear icon
* concise explanation

Clicking the conflict should open:

```text
Why can't this lecture be placed?

Teacher conflict
Rahul Sharma is already teaching:

7B
Monday
Period 3

Possible alternatives:
Monday P5
Tuesday P2
Wednesday P4
```

## RESPONSIVE DESIGN

The application must work beautifully at different desktop window sizes.

Support:

* 1280×720
* 1366×768
* 1440×900
* 1920×1080
* 2560×1440

Do not simply shrink the UI.

Use responsive layout strategies.

For smaller windows:

* collapse sidebar
* reduce secondary information
* allow horizontal timetable scrolling
* preserve readable cell sizes
* move secondary details into panels

The timetable must remain usable.

## DENSITY

Avoid excessive whitespace in the timetable itself, but keep the surrounding interface spacious.

Use:

* compact timetable cells
* comfortable dashboard cards
* generous page spacing
* consistent 8px-based spacing system

The application should feel **dense where data requires density and spacious everywhere else**.

## DASHBOARD

Do not create a dashboard full of cards.

Prioritize useful information:

```text
Good Morning

Timetable Status
────────────────────────────

0 Hard Conflicts
2 Soft Constraints
24/30 Teacher Workload

Today's Schedule
────────────────────────────

Recent Changes
────────────────────────────
```

Use charts only when they provide useful information.

## SIDEBAR

Keep navigation simple.

Example:

```text
Smart Timetable

Dashboard

Planning
  Timetable Studio
  Generate
  Conflicts

Academic
  Classes
  Subjects
  Teachers
  Rooms

Configuration
  Time Structure
  Rules
  Preferences

Management
  Versions
  Export

Settings
```

Use icons + labels.

Allow sidebar collapse.

## DARK MODE

Support both:

### Light Mode

Primary/default.

Bright, clean, professional.

### Dark Mode

Deep neutral background rather than pure black.

Avoid making subject colors excessively bright in dark mode.

Subject colors should automatically adapt their contrast.

## TYPOGRAPHY

Use a clean modern sans-serif font.

Recommended:

* Inter
* Geist
* Manrope

Use a clear hierarchy:

```text
Page title
Section title
Card title
Body
Secondary text
Metadata
```

Avoid excessively large headings.

The timetable should prioritize readability over visual marketing.

## COMPONENT DESIGN

Use consistent:

* Border radius
* Shadows
* Spacing
* Typography
* Button heights
* Input heights
* Icon sizes
* Hover states
* Focus states

Avoid excessive rounded "bubble" UI.

Prefer subtle radius:

```text
6px
8px
10px
12px
```

rather than making everything extremely rounded.

## ACCESSIBILITY

The UI must remain usable for users with visual limitations.

Ensure:

* sufficient text contrast
* color is not the only way to communicate status
* keyboard navigation
* visible focus states
* readable font sizes
* tooltips for unfamiliar icons
* accessible drag/drop alternatives where practical

Subject colors must always be accompanied by text/icons when communicating important information.

## DESIGN PRINCIPLE

The application should feel like:

**A professional scheduling workstation.**

Not:

* a children's application
* a flashy SaaS landing page
* an old ERP
* a spreadsheet clone
* a rainbow dashboard

The visual personality should come from:

**Typography + spacing + subtle color + excellent interaction + smooth motion.**

Color should help users understand the timetable, not compete with it.
