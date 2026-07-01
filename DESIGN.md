# AuraChat Visual Identity & Design System

## 1. Core Aesthetic: The "Signal-Like" Philosophy
AuraChat values extreme clarity, low cognitive load, and high security representation. The interface must feel like an open-source, bulletproof utility: utilitarian typography, vast whitespace, subtle borders, and precise visual signifiers for end-to-end encryption.

## 2. Layout, Structure, and Information Density
* **The Three-Pane Architecture:** Desktop layouts are confined to three fixed columns:
  1. Navigation / Context Sidebar (Compact icon tray for settings, profile, active state).
  2. Session Directory (Search, filter, scrollable list of 1:1, 1:N, or M:N threads).
  3. Interactive Workspace (Chat frame with anchored messaging box, pinned header, context panel).
* **Responsive Breakpoints:** Mobile-first fluid adaptation. At screens less than 768px, the sidebar collapses into a drawer, and the layout toggles between the thread list view and the active conversation workspace.
* **Component Proportions:** Rely on a systematic 4px spacing grid (`p-1` through `p-8` in Tailwind). Never mix absolute pixel counts or arbitrary style overrides inside components.

## 3. UI States, Feedback, and Cryptographic Visuals
* **Identity Indicators:** Every chat pane header must feature a clear visual signature indicating security health. Use a subtle lock indicator next to session titles accompanied by clear textual callouts (e.g., "Verified Session").
* **Transient & Real-Time Feedback:**
  * **Typing Indication:** Render compact, non-intrusive animated indicators within thread summaries and the active message viewport.
  * **Delivery Verification:** Implement clear visual symbols tracking message propagation stages: Single check (Sent), Double check (Delivered), Color-shifted double check (Read).
* **Empty States:** When message pools or contact directories return empty, present a minimal, centered graphic with a single actionable directive instead of leaving blank canvasses.

## 4. Typography & Interaction Language
* **Font Selection:** Use modern, unembellished system font stacks (`font-sans`) prioritizing readability across standard displays.
* **Action Language:** Form inputs, confirmation buttons, and clickable headers must change state predictably. Use explicit hover transitions, focused rings for accessibility, and disabled visual filters during processing actions to prevent form resubmissions.

## 5. Iconography: Tabler Icons System
* **Icon Set:** AuraChat exclusively uses **Tabler Icons** (`@tabler/icons-react`). The Material UI icon library (`@mui/icons-material`) is explicitly banned to maintain a consistent, neutral, line-art visual language.
* **Icon Naming Convention:** All Tabler icons are PascalCased with an `Icon` prefix (e.g., `IconSend`, `IconMessage`, `IconPhone`, `IconLock`, `IconSettings`). Use named imports only — never barrel-import the entire library.
* **Sizing Matrix:**
  * `size={24}` — Default IconButton size, sidebar navigation icons.
  * `size={20}` — IconButton with `size="small"`, input adornments, header action icons.
  * `size={16}` — Inline metadata markers, Chip icons, status indicators.
  * `size={48}` — Large empty-state / hero icons (e.g., encrypted lock on blank canvas).
* **Color Inheritance:** Tabler icons render with `stroke="currentColor"`. Wrap them in MUI `IconButton` with `sx={{ color: ... }}` to control color. Never apply color styling directly to the icon element itself.
* **Stroke Weight:** Tabler's default 2px stroke weight is the project standard. Do not override icon stroke widths across the application to preserve visual consistency.