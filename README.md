# Table Builder

An Enonic XP application for building and rendering data tables in Content Studio.
Editors paste a table straight from Excel and the app converts it into structured content that
can be styled per row and per cell, then placed on any page.

| | |
| --- | --- |
| App name | `no.bouvet.app.tablebuilder` |
| Display name | Table Builder |
| Enonic XP | 7.16.8 |
| Vendor | Bouvet Norge AS |

## Features

- **Paste from Excel.** Editors paste tab-separated data into a text area; the app builds rows
  and cells automatically on save.
- **Automatic number alignment.** Cells detected as numbers or dates are right-aligned.
- **Per-row and per-cell colors.** A cell with no color of its own inherits the row color.
- **Administrator-defined color palette.** Site administrators decide which colors editors may
  choose, in site configuration.
- **Rich text in cells.** Bold, italic, underline, alignment, links and superscript.
- **Reusable tables.** A table is standalone content, so the same table can be displayed in
  several places.
- **Accordion layout.** Tables can be collapsed behind a heading.
- **Bilingual.** Norwegian and English phrases.

## Components

| Type | Name | Purpose |
| --- | --- | --- |
| Content type | `table` | The table itself: title, preface, rows, cells and footnotes |
| Part | `table-show` | Renders a table — the current content, or another table selected in the part config |
| Layout | `table-layout` | Collapsible panel with a heading and subtitle, containing a `main` region |
| Service | `color-options` | Backs the color `CustomSelector` inputs; returns the palette with color swatches |

## How the Excel import works

Pasting into the **Paste area** field and saving triggers an event listener in
[main.es6](code/src/main/resources/main.es6):

1. On `node.updated`, the app checks whether the content is a `table` with content in the
   paste area.
2. **If the table has no rows**, the pasted text is split on newlines and tabs into rows and
   cells, and the paste area is cleared.
3. **If the table already has rows**, nothing is generated and the paste area is only cleared.

Step 3 is deliberate: it stops a stray paste from overwriting a table an editor has already
adjusted by hand. To re-import, delete all rows first.

> Content Studio does not refresh the open form by itself after the import. Reload the content
> to see the generated rows.

## Colors

Colors are resolved in [lib/color-palette.es6](code/src/main/resources/lib/color-palette.es6),
which is the single source of truth for both the editor selector and the rendered markup.

**Always available** — these cannot be overridden or removed:

| Key | Background | Text |
| --- | --- | --- |
| `black` | `#111111` | `#ffffff` |
| `white` | `#ffffff` | `#111111` |
| `transparent` | `transparent` | `inherit` |

**Added per site** under the Table Builder app in site configuration. Each entry needs:

- `key` — stable identifier stored on the content. Changing it orphans existing choices; the
  color then falls back to the stylesheet default.
- `label` — the name editors see. Administrator-entered, so it is **not** translated.
- `background` and `text` — hex values (`#rgb` or `#rrggbb`).

Hex values are validated server-side before they reach a `style` attribute. Anything that is
not a plain hex literal is discarded.

Title and preface render the chosen color as **text** color. Rows, cells and footnotes use it
as a **background** with the matching text color.

## Setup

### Content Security Policy

Because colors are defined by administrators at runtime, the app cannot ship them as static
CSS classes. It writes them as inline `style` attributes on the rendered elements instead.

A site that sends a Content Security Policy without allowing inline styles will block those
attributes, and tables will render with no colors at all — no error, just the stylesheet
defaults. The browser console shows a `Refused to apply inline style` message.

To allow it, include `'unsafe-inline'` in the `style-src` directive:

```
style-src 'self' 'unsafe-inline';
```

Content Security Policy is owned by the site that installs this app, not by the app itself, so
set this wherever your project defines its headers — a response processor, reverse proxy or CDN.

**This weakens your policy.** `'unsafe-inline'` in `style-src` applies to the whole site, not
just this app, and it permits any injected inline style. The practical risks are style-based
data exfiltration and UI redressing, not script execution — `script-src` is unaffected. Decide
whether that trade-off is acceptable for your site before adding it. If it is not, the
alternative is to drop the site-configurable palette and hardcode the colors you need as CSS
classes in `code/src/frontend/styles/components/parts/_table-show.scss`.

