# gren-95.github.io

Personal portfolio for Efe Marko Güldere (`Gren95`), Rakvere, Estonia.
Live at **https://gren-95.github.io/**.

A SvelteKit site prerendered to static files and served by GitHub Pages. There
is no server: the project languages, star counts, and last-push dates are
fetched from the GitHub API while the site builds, so the page is as fresh as
the last deploy.

Facts — role, employer, schooling, toolkit, project selection — are taken from
the GitHub profile README at [github.com/Gren-95](https://github.com/Gren-95),
which is the single source of truth. Change them there first, then mirror them
into `src/lib/data/`.

## Getting started

### Prerequisites

- Node.js >= 22
- pnpm >= 10

### Installation

```bash
pnpm install
```

### Running locally

```bash
pnpm run dev
```

The build calls `https://api.github.com/users/Gren-95/repos` once. Unauthenticated
requests are capped at 60 an hour, which is ample locally; CI passes a token.

## Available scripts

```bash
pnpm run dev      # start the dev server
pnpm run build    # prerender the site into build/
pnpm run preview  # serve the production build
pnpm run test     # run unit tests once
pnpm run lint     # check formatting
pnpm run format   # rewrite formatting
pnpm run check    # svelte-check against tsconfig
```

## Project structure

```
src/
├── app.css                    design tokens and base styles
├── app.html                   document shell, fonts, pre-paint theme
├── lib/
│   ├── actions/reveal.ts      scroll-in reveal, skipped under reduced motion
│   ├── components/            ProjectEntry, ThemeToggle
│   ├── data/                  curated content: projects, contributions,
│   │                          qualifications, profile
│   ├── mergeProjects.ts       joins curated entries to live GitHub facts
│   └── types/                 shared interfaces
├── routes/
│   ├── +layout.ts             prerender the whole site
│   ├── +page.server.ts        build-time GitHub fetch
│   └── +page.svelte           the page
static/                        favicon, robots.txt, .nojekyll
```

## Editing the content

Everything worth changing lives in `src/lib/data/`:

| File                | Holds                                                       |
| ------------------- | ----------------------------------------------------------- |
| `profile.ts`        | name, location, the opening sentence, contact details       |
| `projects.ts`       | the curated catalogue — repo name, period, summary, exposes |
| `contributions.ts`  | work sent to projects other people maintain                 |
| `qualifications.ts` | skill groups, schooling, spoken languages                   |

Adding a project means adding an entry to `projects.ts` whose `repo` matches a
public repository name. If it doesn't match, the build fails on purpose rather
than quietly dropping the entry.

## Design

Tailwind Stone for the ground — the palette used in `hyprland-dots` — with the
`#33ccff` cyan from the GitHub profile banner as the accent, darkened to
cyan-700 on the light theme so it clears WCAG AA. Measured against their
grounds: body text 16.7:1, muted text 7.3:1, accent 5.1:1.

Type is Bricolage Grotesque (display), Archivo (body), and Spline Sans Mono
(dates and tags). Nothing on the page is set below 14px. Light and dark both
ship; the choice is stored per browser and settled before first paint.

### Motion

Every effect is a progressive enhancement, and all of them are dropped under
`prefers-reduced-motion: reduce`.

| Effect                                                  | Built with                           | Without support  |
| ------------------------------------------------------- | ------------------------------------ | ---------------- |
| Theme change wipes in as a circle grown from the toggle | View Transitions API                 | instant swap     |
| Sun retracts its rays into a crescent                   | CSS transitions on SVG `cx`/`cy`/`r` | —                |
| Reading progress bar under the header                   | `animation-timeline: scroll()`       | bar stays hidden |
| Highlight tracking the cursor across project cards      | `pointermove` writing `--px`/`--py`  | no highlight     |
| Name assembles letter by letter                         | staggered `animation-delay`          | —                |
| Ambient wash drifting behind the hero                   | animated radial gradients            | static gradient  |

Two effects were deliberately removed rather than kept: an animated aurora
gradient behind the hero, and a cursor-tracking glow on the project cards.
Both are heavily commoditised — the card glow in particular is the "Linear
look", catalogued offender-by-offender at
[HenrikZabel/linearlike](https://github.com/HenrikZabel/linearlike). Stacking
recognisable effects reads as a shopping list; what is left is motion that
either responds to input or points at something.

`animation-timeline: scroll()` is avoided on purpose: Firefox 154 still
reports it unsupported, so the progress bar is driven from a scroll listener
instead.

## The section backdrop

A fixed layer behind the page swaps pattern as each section reaches the middle
of the viewport. The patterns are not arbitrary — each encodes something about
its section: ruled lines for work (a career is a list of dates), a lattice of
nodes for projects, rings radiating outward for open source, evenly spaced
verticals for education (the patch panel behind the Rakvere coursework), and a
dense field of points for the toolkit.

It is masked: full strength out in the page margins, damped to `--damp` across
the content column. Both numbers come from measurement rather than taste.

At full strength behind text, muted type falls to **3.34:1**, under the 4.5:1
floor — a low opacity is not self-evidently safe, because what matters is the
composited pixel. The damp factor is solved backwards from that: at the current
line strength the column has to stay at **0.182 effective alpha** to hold muted
text above the floor on the dark theme, which is the binding case. That puts
the worst case within the text extent at **5.69:1** light and **4.85:1** dark,
while the margins run 1.87x bolder than the column because nothing is written
there.

The fade finishes 3.5rem inside the column — the page gutter — so it has
reached the damped level before any text begins. On a narrow viewport
`50% - 34rem` goes negative, the whole strip falls inside the damped band, and
mobile is safe with no media query.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: install, format
check, tests, build, then publish `build/` to GitHub Pages. Pull requests run
everything except the deploy.

## Licence

The code is MIT — see [LICENSE](LICENSE). The written content and personal
details (biography, work history, schooling) are not offered for reuse; if you
want the site as a starting point, take the code and bring your own facts.

Brand marks in the toolkit section belong to their respective owners and are
included via [Simple Icons](https://simpleicons.org/) for identification only.

School marks in the Education section likewise belong to their institutions and
identify schools actually attended:

| Mark                        | Source                                                                             | Note                                                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Tallinna Tehnikaülikool     | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Logo_veeb_esitlus.png) | tagged CC BY-SA 3.0, credited to Tallinn University of Technology, original at [taltech.ee/en/logos-slides](https://taltech.ee/en/logos-slides) |
| Viljandi Kutsehariduskeskus | vikk.ee                                                                            | anniversary emblem cropped off, leaving the standing mark                                                                                       |
| Rakvere Ametikool           | rak.ee                                                                             | supplied as JPEG on white; background cut to transparency                                                                                       |

All three are served from `static/logos` at 96 px tall with transparent
backgrounds, and are rendered on a light tile rather than the page ground:
TalTech's magenta disappears on the dark theme and Rakvere's pale blue on the
light one, so neither is legible on both without it.

## Repository conventions

- `main` is protected: changes land through a pull request, squash-merged,
  with the `build` check passing. Merged branches delete themselves.
- Branches are named `{issue-number}-{short-description}`.
