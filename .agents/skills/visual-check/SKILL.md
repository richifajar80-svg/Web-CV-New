---
name: visual-check
description: >-
  Run a comprehensive UI/UX, A4 document layout, mobile viewport (375px), and interactive popover verification check on the CVBagus web application. Activate this skill after modifying UI components, headers, modals, or A4 document templates.
---

# Visual & Interactive UI Verification Skill

Whenever you modify UI components, A4 templates (`CVCanvas`, `CoverLetterView`), or navigation headers (`Header`, `UserMenu`), follow this checklist before completing the task:

## 1. Popover & Modal Dismissal Verification
- Check if any dropdown/popover resides inside a parent with `backdrop-blur-*`, `transform`, or `filter`.
- Ensure outside-click dismissal is handled via `useRef` + `document.addEventListener('mousedown' | 'touchstart')` and `Escape` key handler rather than a `fixed inset-0` overlay div.
- Verify that selecting an item inside a popover (such as font or color) closes the popover immediately.

## 2. A4 Document Flow Verification (`794px × 1123px`)
- Verify that `.cv-a4-page` containers use natural top-to-bottom flow (`flex flex-col`) and NEVER `justify-between` on top-level sections.
- Check that no duplicate headings or salutations exist between the recipient block and body paragraphs.
- Verify that `calculateFitZoom()` re-runs whenever `mobileView` or `outputChannel` changes so the A4 preview is never measured while `display: none` (`clientWidth === 0`).

## 3. Mobile Viewport Check (`360px–430px`)
- Verify that top navigation bars and toolbars fit within `360px` width without horizontal scrolling or clipping.
- Verify that primary actions are reachable via the mobile segmented switcher and fixed bottom bar.

