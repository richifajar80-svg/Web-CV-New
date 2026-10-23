<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# UI/UX, Layout & Interactive Guardrails (CVBagus.id)

Always enforce these rules whenever creating or modifying UI components in this repository:

1. **Popovers & Dropdowns Inside `backdrop-blur` Containers:**
   - NEVER rely on `<div className="fixed inset-0" />` overlays inside `<header>` or any parent that uses `backdrop-blur-*` (`backdrop-filter`), because CSS `backdrop-filter` creates a new containing block that traps `position: fixed` descendants inside the parent's height.
   - ALWAYS use `useRef` + `document.addEventListener('mousedown', ...)` and `document.addEventListener('touchstart', ...)` + `Escape` key listeners to close popovers/dropdowns when clicking anywhere outside, and auto-close the popover after selecting an option.

2. **A4 Paper Canvas & Document Layouts (`794px × 1123px`):**
   - NEVER use `justify-between` on the root `.cv-a4-page` flex container when there are only 2 or 3 top-level children (e.g., Letterhead + Body), as `min-height: 1123px` will push the children apart and leave a huge empty gap in the middle of the A4 page.
   - Keep A4 content flowing naturally from top to bottom (`flex flex-col` without `justify-between`).
   - Whenever an A4 preview container starts hidden on mobile (`hidden lg:block`), recalculate `calculateFitZoom()` inside a `useEffect` that depends on the active mobile tab/view state (`[mobileView]`) so switching to preview mode scales the A4 paper accurately.

3. **Mobile Responsiveness (`360px–430px`):**
   - Ensure top headers and toolbars never overflow horizontally (`min-w-0`, `shrink-0` where appropriate, and hide duplicate desktop-only buttons on `<640px` when already present in the mobile bottom bar).
   - Keep form inputs at `16px` minimum on mobile viewports to prevent iOS/Android browser auto-zooming on focus.

