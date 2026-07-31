# Design reference

The UI is designed in **Claude Design**, not in this repo. The design is the spec: when
implementing a view, read the design file rather than inventing layout, spacing, or copy.

There is no handoff prompt to paste. The design is vendored here, and can be re-pulled
with the `DesignSync` tool.

## Canonical file

`design/LabTrack Dashboard.dc.html` — a committed snapshot of the mockup every view is
derived from. `docs/structure.md` was derived from this file.

## Upstream

|                |                                                                           |
| -------------- | ------------------------------------------------------------------------- |
| Project        | `9ee7c3ab-1c78-4af2-9af1-8b47dbe27429` — "Laboratory Inventory Dashboard" |
| Type           | `PROJECT_TYPE_PROJECT` (a design project, **not** a design system)        |
| Canonical path | `LabTrack Dashboard.dc.html`                                              |

The project also holds ~110 `uploads/*.png` and two design-system bundles under `_ds/`
(`Modernist`, `Industry`).

**Ignore `Lab Inventory Dashboard.dc.html`.** It is a superseded earlier cut that still sits
in the project. It is not vendored here, and nothing in this repo should be derived from it —
`LabTrack Dashboard.dc.html` supersedes it in full.

## Reading it

It is a reference, **not** a runnable page. Line 6 loads `./support.js`, the Claude Design
runtime, which is deliberately not vendored — opening the file in a browser renders nothing.
Read it as source.

Layout at the time of the snapshot (grep the markers, don't trust the numbers after a refresh):

| Region        | Marker                                       | Contains                                                                              |
| ------------- | -------------------------------------------- | ------------------------------------------------------------------------------------- |
| Design tokens | `<style>` inside `<helmet>`                  | CSS custom properties on `body`, with a full dark set under `body[data-theme="dark"]` |
| Markup        | between `<x-dc>` and `</x-dc>`               | every view's structure                                                                |
| Behavior      | `<script type="text/x-dc" data-dc-script …>` | state and interactions                                                                |

Three authored props sit on the `data-props` attribute of that script tag: `labName`,
`userName`, `showSpend`.

Navigation goes through `goList(nav, patch)`, which is why sidebar entries like Chemicals,
Equipment, Low stock, and Expiring / due are **filters on `/inventory`** rather than routes.
See `docs/structure.md` for the route mapping that follows from this.

## Refreshing the snapshot

When the design changes upstream, re-pull rather than hand-editing the vendored file:

1. `DesignSync` `list_files` on the project id above — confirm the canonical path still exists.
2. `DesignSync` `get_file` on that path.
3. Overwrite `design/LabTrack Dashboard.dc.html` with the returned `content`, and commit.

The read methods need design access on the claude.ai login; `/design-login` grants it for
sessions without one. Never hand-edit the snapshot to match code — the design is upstream of
the code, so a drift means either re-pull or change the design.

## When code and design disagree

The design wins on visual and interaction questions. If the design is wrong on a **domain**
question, that is an ADR conversation (`docs/agents/domain.md`), not a silent deviation.
