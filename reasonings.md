# 🧭 Reasonings — Why This Project Differs From the Course (and Still Gets the Same Result)

This project is a faithful implementation of the Forkify app from Jonas Schmedtmann's *Complete JavaScript Course*. The **application logic** — the MVC structure, the model, the views, the controller, the async data flow — matches the course.

However, a few pieces of the **build tooling and dependencies** had aged since the course was recorded and no longer work reliably on modern Node.js. Where the original code broke, it was changed for a modern, stable equivalent. In every case, the **behavior and the end result are unchanged** — the app looks and works exactly as intended.

This document explains each deviation and the reasoning behind it, so the changes are deliberate and transparent rather than mysterious.

---

## 1. Parcel: `2.0.0-beta.1` → `2.16.4` (stable)

**What changed:** The bundler was upgraded from the beta version pinned in the course to the current stable release of Parcel 2.

**Why:** The course-era Parcel beta is several years old and fails on modern Node.js (the project was developed on Node v24). It suffers from cache corruption, OpenSSL incompatibilities, and other build failures that have nothing to do with the application code.

**Why the result is the same:** Parcel's job — bundling the JS modules, compiling the SCSS, and serving with live-reload — is identical between the beta and the stable release. The application code did not change; only the tool that builds it did.

---

## 2. Fraction library: `fractional` → `fracty`

**What changed:** The decimal-to-fraction library was swapped from `fractional` to `fracty`.

**Why:** The `fractional` package was written in 2009 and contains a line that assigns to a variable without declaring it (`Fraction = function(...)` with no `var`/`let`/`const`). In the old days this silently created a global. But ES modules run in **strict mode**, where assigning to an undeclared variable throws `ReferenceError: Fraction is not defined`. The library crashes before it can even export itself when bundled as a modern ES module.

**Why the result is the same:** `fracty` is a maintained, drop-in replacement built specifically for this use case. It converts decimals to fractions for display — `0.5` → `"1/2"`, `1.5` → `"1 1/2"` — producing the same readable ingredient quantities the course intended.

---

## 3. Removed `import { async } from 'regenerator-runtime'`

**What changed:** This import line, present in the course's `model.js`, was removed.

**Why:** It imports a named `async` export that is never actually used in the code. Its only purpose was to nudge the old bundler into including the async/await polyfill. On modern Parcel, async/await is handled natively, so the line is a no-op at best and a source of confusion at worst.

**Why the result is the same:** async/await works identically without it. The polyfills (`core-js`, `regenerator-runtime`) remain as dependencies for compatibility; only the unnecessary explicit import was dropped.

---

## 4. Added `type="module"` to the script tag in `index.html`

**What changed:** The entry script tag became `<script type="module" defer src="src/js/controller.js"></script>`.

**Why:** A plain (classic) `<script>` tag cannot use `import`/`export` — by the HTML spec, that requires `type="module"`. The course's old Parcel beta *implicitly* treated the entry script as a module and let imports slide, but modern Parcel correctly follows the spec and refuses to bundle ES-module syntax in a classic script.

**Why the result is the same:** This makes the existing module-based code run as it always should have. It's the technically correct version of the tag; nothing about the code's behavior changes.

---

## 5. Rounding ingredient quantities before fraction conversion

**What changed:** In `recipeView.js`, ingredient quantities are rounded to two decimal places before being passed to `fracty`:
```js
fracty(Math.round(ing.quantity * 100) / 100)
```

**Why:** When servings are scaled by an awkward ratio (for example, dividing by a prime number of base servings), floating-point math produces long repeating decimals like `0.521739130...`. A fraction converter faithfully renders these as enormous, unreadable fractions (e.g. `260869565217391/500000000000000`). Rounding first caps the denominator size and keeps the display readable (e.g. `13/25`).

**Why the result is the same (and arguably better):** For typical recipes the rounding is imperceptible, and the displayed fractions are clean and readable rather than occasionally exploding into 15-digit denominators. The loss of precision is negligible for recipe quantities.

---

## 6. Added a "Delete recipe" feature (enhancement beyond the course)

**What changed:** A delete feature was added for recipes the user has uploaded — a `deleteRecipe` function in the model, a `DELETE` branch in the AJAX helper, a conditionally-rendered delete button in `recipeView`, and a controller handler.

**Why:** The Forkify API supports a `DELETE` method, but the original course only implements `GET` and `POST`. Adding delete completes the full set of CRUD operations (Create, Read, Update, Delete) and demonstrates the complete REST verb set.

**Why it's safe and self-contained:** The delete button only appears on recipes the user uploaded (those carrying the user's API key), and the API only permits deleting recipes tied to that key — so a user can only ever delete their own recipes. It is committed as a separate, clearly-labeled enhancement so it's easy to distinguish from the course-matching work.

---

## Summary

| # | Original | Changed to | Reason | Result |
|---|----------|-----------|--------|--------|
| 1 | Parcel `2.0.0-beta.1` | Parcel `2.16.4` | Beta broken on modern Node | Identical build behavior |
| 2 | `fractional` | `fracty` | `fractional` crashes under strict mode | Same fraction display |
| 3 | `import { async }` line | (removed) | Unused, unnecessary on modern Parcel | async/await unchanged |
| 4 | classic `<script>` | `<script type="module">` | ES module spec requires it | Existing code runs correctly |
| 5 | raw quantity → fraction | rounded quantity → fraction | Avoids floating-point fraction blowups | Cleaner, readable fractions |
| 6 | (no delete) | delete feature added | Completes CRUD; API supports it | New capability, scoped safely |

The guiding principle throughout: **modernize what had rotted with age, change nothing about how the app behaves.** The result is the same Forkify application the course teaches — just one that builds and runs reliably today.
