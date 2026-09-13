# Foundation roadmap

13 September 2026 · Proposed implementation plan · No implementation PRs opened

The recommended plan contains **14 focused PRs**. Each PR delivers a usable change, records its checks, and preserves existing content URLs.

The target is an Astro website with consistent design tokens, small components, explicit interaction behavior, and reliable content contracts.

This plan covers the 27 defects and 15 improvements in the UI/UX audit dated 13 September 2026. It also covers the subsequent architecture assessment.

**Target architecture**

| Area             | Target decision                                                                     | Practical boundary                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Rendering        | Astro for static pages and content. React for interactive islands.                  | Static callouts and ordinary navigation need no React hydration. Article experiments remain beside their articles. |
| Content          | Schemas validate content. Typed loaders resolve metadata. Pages compose the result. | Presentation components receive data. Related-content selection operates on data already loaded.                   |
| Identity         | Explicit, stable content slugs and one route module.                                | Titles can change without changing public URLs. Navigation, sharing, RSS, and metadata use the same URL rules.     |
| Styling          | Semantic CSS variables, Tailwind, and shared variant definitions.                   | Astro and React retain small renderer-specific wrappers. They share variants, dimensions, colors, and states.      |
| Components       | Native HTML first. Existing Radix components remain useful inside React islands.    | Native dialogs serve Astro overlays. Both implementations obey the same behavior contract.                         |
| Browser behavior | Small controllers with explicit state and lifecycle cleanup.                        | Search state and result selection stay separate from Pagefind loading and DOM updates.                             |
| Build code       | Content rendering, OG images, and Excalidraw adapters stay outside browser modules. | Build adapters expose small functions. Environment shims remain local and documented.                              |
| Dependencies     | Each retained dependency has an active consumer and a clear purpose.                | Basecoat is removed after its consumers migrate. Existing useful Radix, chart, and carousel tools remain.          |

SOLID applies through these boundaries. Single responsibility separates data, state, and presentation. Small prop contracts support interface segregation.

Typed adapters isolate browser and build dependencies. Composition supports extension. Substitution means consistent component contracts here, since inheritance has little relevance.

DRY applies to rules: URLs, tokens, variants, theme resolution, and interaction behavior. Similar markup alone does not justify another abstraction.

**Design system contract**

| Layer         | Required decisions                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Color         | Define background, surface, text, muted text, border, accent, link, focus, and status tokens for both themes.                         |
| Typography    | Use Fira Sans for reading text. Retain Fira Code for code and selected metadata. Define heading, body, caption, and code styles.      |
| Layout        | Define spacing, radii, control heights, article measure, page gutters, and responsive breakpoints centrally.                          |
| Controls      | Support default, hover, focus-visible, active, disabled, loading, and error states where applicable. Document each supported variant. |
| Accessibility | Target contrast ratios of 4.5:1 for ordinary text and 3:1 for large text and essential control boundaries.                            |
| Touch         | Give standalone controls a preferred 44 × 44 CSS-pixel interaction area. Keep inline prose links readable and distinct.               |
| Motion        | Define short transition durations and reduced-motion behavior. Reading and navigation remain usable without decorative animation.     |
| Media         | Preserve source aspect ratios. Use explicit crop behavior only where the design calls for cropped thumbnails.                         |
| Evidence      | Maintain a development-only showcase with light/dark themes, narrow/wide layouts, long labels, and component states.                  |

The showcase is a small Astro fixture. It shares production components and stays outside public builds, search results, and sitemaps.

**Behavior contract**

| Pattern            | Required behavior                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Links and buttons  | Links navigate. Buttons act. Controls have accessible names, visible focus, and native keyboard activation.                              |
| Dialogs            | Opening transfers focus inside. Tab remains inside. Escape and a visible Close control dismiss. Closing restores trigger focus.          |
| Mobile navigation  | A closed menu has no focusable descendants. Escape returns focus. Header hiding pauses while navigation or header focus is active.       |
| Search             | Explicit idle, loading, results, empty, and error states. Only the latest active query can change results.                               |
| Search keyboard    | Results are real links. Arrow keys move DOM focus through results. Enter activates the focused link. Tab follows native order.           |
| Theme              | Light, Dark, and System are named choices. Theme resolves before first paint and updates comments consistently.                          |
| Reading navigation | Contents works with keyboard and touch. Current-section tracking follows the section already reached. Anchors account for the header.    |
| Galleries          | Named controls support keyboard and touch. Captions and counters follow the active image. Loading and errors reflect actual image state. |
| Playback           | Idle, playing, paused, and ended behavior is explicit. Play at the end restarts. Timers stop on unmount.                                 |
| Sharing            | Copy reports success or failure. Native sharing has a visible fallback. Cancellation does not report success.                            |

**PR sequence**

The numbers give the recommended merge order. Dependencies identify the actual prerequisites. Each PR branches from the latest applicable merged foundation.

| PR  | Proposed title                                            | Main outcome                                        | Depends on |
| --- | --------------------------------------------------------- | --------------------------------------------------- | ---------- |
| 01  | Establish reproducible checks and component fixtures      | A trustworthy baseline and private showcase         | —          |
| 02  | Define design tokens, typography, and theme behavior      | Readable, consistent light and dark modes           | 01         |
| 03  | Unify Astro and React control contracts                   | Buttons and badges behave and look consistent       | 02         |
| 04  | Stabilize content identity and URL generation             | Durable links and collection-safe types             | 01         |
| 05  | Replace the disabled contact flow                         | A working, visible way to make contact              | 03, 04     |
| 06  | Standardize navigation and overlay behavior               | Keyboard-safe menus, dialogs, and lightboxes        | 03         |
| 07  | Rebuild search around explicit state                      | Correct results, reliable recovery, clear discovery | 04, 06     |
| 08  | Standardize article structure and reading navigation      | Readable articles with useful Contents controls     | 02, 06     |
| 09  | Simplify gallery behavior and mobile presentation         | Accessible galleries with predictable lifecycle     | 06         |
| 10  | Repair scientific media and playback contracts            | Correct image proportions and usable experiments    | 03, 08     |
| 11  | Refine discovery, sharing, and profile presentation       | Coherent browsing across posts, notes, and About    | 04, 08     |
| 12  | Separate content loading from build and presentation      | Less repeated work and clearer build boundaries     | 04, 11     |
| 13  | Remove obsolete components and styling dependencies       | One maintained implementation of each shared rule   | 05–12      |
| 14  | Validate the complete experience and document conventions | A release with evidence and maintenance guidance    | 01–13      |

**PR 01 — Establish reproducible checks and component fixtures**

Scope:

- Align local development and CI around the supported Node and package-manager versions already chosen by the project.
- Resolve the observed package-manager bootstrap problem without disabling package integrity checks.
- Resolve the MDX component registry import errors in the Vite dependency scan. Place module exports in a suitable module.
- Preserve type, lint, format, build, and bundle checks. Add a small browser smoke suite using Playwright.
- Move the design helper out of `src/pages`. Convert the showcase into a fixture excluded from production routes and indexing.
- Record the current public route manifest and representative screenshots. Keep known defects visible in the backlog.
- Version this roadmap and future foundation documentation. Account for the current `docs/` ignore rule.

Acceptance: A fresh supported environment installs and builds successfully. Development starts without registry import errors. Production contains neither demo route.

Checks: Run the existing checks, inspect the dependency-scan output, build the search index, and inspect emitted routes. Run a basic home/article smoke test.

This PR establishes the test harness. Each later PR adds checks for the behavior it changes. Existing defective screenshots are reference evidence only.

Coverage: B21. Architecture: reproducibility, missing website tests, development fixtures.

**PR 02 — Define design tokens, typography, and theme behavior**

Scope:

- Define the semantic tokens and scales in the design system contract. Preserve the current warm visual identity.
- Repair light-mode links with sufficient contrast and a persistent underline. Cover hover and visited states.
- Apply Fira Sans to reading text. Scope prose rules so article typography does not resize images inside interactive widgets.
- Resolve theme in the document head. Handle absent preferences, unavailable storage, and System preference changes.
- Synchronize the theme control and Giscus theme through one resolved theme contract.
- Correct category color expressions and missing foreground tokens. Add reduced-motion rules.

Acceptance: Light and dark pages remain readable. Full navigation uses the resolved theme from first paint. Comments follow theme changes.

Checks: Review token contrast and screenshots in both themes. Exercise stored, System, and unavailable-storage cases. Inspect first paint with a fresh production build.

Coverage: B01, B19, B20, B25, U03, U14 theme and motion.

**PR 03 — Unify Astro and React control contracts**

Scope:

- Share button and badge variant definitions through the existing variant tooling.
- Keep small Astro and React wrappers with matching names, sizes, states, and accessible attributes.
- Give icon buttons real dimensions and padded targets. Repair the theme control and affected gallery controls.
- Standardize retained inputs, labels, alerts, and loading indicators around the same tokens.
- Separate link and button prop contracts. Require names for icon-only controls.
- Migrate control consumers. Keep temporary Basecoat support only for components awaiting later PRs.

Acceptance: Equivalent variants match across renderers. Every visible control has a usable box, visible focus, and the correct HTML semantics.

Checks: Review the fixture state matrix at mobile and desktop widths. Add targeted checks for icon-button dimensions and keyboard focus.

Coverage: B02, U11 touch targets. Architecture: duplicated variants and inconsistent component contracts.

**PR 04 — Stabilize content identity and URL generation**

Scope:

- Add explicit slugs to content, initially matching every current valid public pathname.
- Replace independent collection generics with collection-derived types or explicit typed blog/note loaders.
- Centralize post, note, tag, category, and absolute URL generation in the existing route module.
- Migrate navigation, sharing, RSS, canonical metadata, and OG metadata to those rules.
- Repair the incorrect note prefix and broken article cross-link. Remove the empty resource link unless its intended destination is known.
- Add explicit redirects for known obsolete article and note paths. Add a branded 404 with useful recovery links.

Acceptance: Current valid URLs remain unchanged. A title edit does not change a permalink. Every share URL resolves to its intended content.

Checks: Compare the route manifest before and after migration. Check duplicate slugs, collection/type mismatches, internal links, redirects, and actual 404 status.

Redirect and 404 checks must use the production adapter or deployment preview. A development-server result alone does not close this PR.

Coverage: B04, B17, B18, U10. Architecture: stable identity, unsafe generics, duplicated URL rules.

**PR 05 — Replace the disabled contact flow**

Scope:

- Replace the disabled form with an explicit contact action using the configured LinkedIn destination.
- Add an Email action only when a public address is supplied. Keep that destination in site configuration.
- Add a clear Contact action near the home introduction and in navigation.
- Remove the unused form, draft store, and schema after checking their consumers.
- Remove the unused submission endpoint. If callers exist, provide an explicit unavailable response during migration.
- Remove the nested `main` landmark from the contact page.

Acceptance: The page offers a working destination and explains where the action goes. No endpoint claims to send a message without delivery.

Checks: Inspect contact links and keyboard behavior on mobile and desktop. Check that the former endpoint cannot return a false delivery success.

The recommended scope uses direct contact. A future submission form requires a separate delivery, validation, abuse-control, and error-handling PR.

Coverage: B03, B26 contact landmark, U01. Architecture: incomplete form/schema/store/API slice.

**PR 06 — Standardize navigation and overlay behavior**

Scope:

- Define one documented dialog contract for Astro native dialogs and existing React Radix dialogs.
- Migrate the diagram lightbox to a native button trigger and dialog.
- Add shared Astro dialog helpers only for repeated focus, close, and scroll behavior.
- Make closed mobile navigation inert or hidden. Restore trigger focus on Escape.
- Keep the header visible while its controls have focus or its menu is open.
- Add a skip link and consistent main-content target. Define backdrop dismissal and scroll restoration.

Acceptance: Keyboard users can open, operate, and dismiss every migrated overlay. Closed menus contain no invisible keyboard stops.

Checks: Cover Enter, Space, Tab, Shift+Tab, Escape, focus restoration, and scroll restoration. Exercise repeated opening and multiple overlays on one page.

Coverage: B10, B11, U14 skip navigation. Follow-up: header hiding with active focus or navigation.

**PR 07 — Rebuild search around explicit state**

Scope:

- Separate the Pagefind adapter, query lifecycle, and result presentation into small modules.
- Cache the import promise. Permit a new import attempt after an import error.
- Invalidate previous requests on query changes, clear, and close. Ignore stale completions.
- Use labeled search input and ordinary result links. Move DOM focus for arrow navigation and preserve native link activation.
- Provide loading, results, empty, and error messages with live status announcements and Retry.
- Add visible Close and platform-appropriate shortcut hints.
- Index primary content and useful sections. Exclude listing pages, demos, and repeated shell text.
- Show distinct section titles and excerpts. Replace the silent cap with an explicit result count and Show more behavior.

Acceptance: Out-of-order completions cannot replace newer results. Enter opens the focused result. Failed import and query operations both recover visibly.

Checks: Cover delayed responses, clear/close during loading, rejected operations, focus navigation, and empty queries. Rebuild Pagefind before browser checks.

Coverage: B05–B09, U06, U07. Architecture: mixed search responsibilities and implicit state.

**PR 08 — Standardize article structure and reading navigation**

Scope:

- Establish one page H1, consistent article sections, and a single main landmark.
- Reduce hero spacing and secondary metadata prominence. Give Continue Reading a real article target.
- Provide a labeled Contents disclosure on mobile and desktop. Expose active sections accessibly.
- Correct section tracking and header offsets. Preserve existing inbound heading fragments during heading changes.
- Make citations usable through touch and keyboard. Provide return navigation from references.
- Document shared reading styles while preserving distinct blog and note layouts.

Acceptance: A representative desktop article shows its introduction in the first viewport. Contents and citations work without pointer hover.

Checks: Review long and short titles at 390, 768, and 1280 pixels. Exercise deep links, section tracking, keyboard navigation, and heading hierarchy.

Coverage: B13, B14, B26 article headings, B27, U02, U14 citations.

**PR 09 — Simplify gallery behavior and mobile presentation**

Scope:

- Replace generated global functions and inline handler strings with scoped instance methods and typed event listeners.
- Add lifecycle cleanup for listeners and other resources.
- Use the overlay contract and native button triggers for photo stacks.
- Reduce mobile framing so the image occupies the available space while preserving its aspect ratio.
- Update captions, position counters, and navigation from one current-image state.
- Tie loading and error states to image events. Define first/last-image navigation behavior consistently.

Acceptance: Keyboard and touch can open and navigate galleries. Multiple galleries remain independent. Repeated mounting adds no duplicate listeners.

Checks: Cover Enter/Space, previous/next, captions, counters, failed image loading, and focus restoration. Review portrait and landscape photos on narrow screens.

Coverage: B12, U12. Architecture: generated globals, inline scripts, lifecycle cleanup. Follow-up: caption transitions.

**PR 10 — Repair scientific media and playback contracts**

Scope:

- Preserve square glyph and sample proportions. Stack the SDF pipeline on narrow screens.
- Give sliders specific labels and meaningful announced timestep, epoch, or interpolation values.
- Replace ambiguous `StepSlider` props with a discriminated union. Define empty and single-item behavior explicitly.
- Define playback transitions and Replay behavior. Clean up timers on unmount.
- Add named, padded carousel controls and active-slide state. Keep usable navigation visible on mobile.
- Group VAE source, reconstruction, and mismatch cells by position so wrapping preserves their relationship.

Acceptance: Scientific images retain their proportions. Every slider conveys its meaning. Playback restarts at the end and handles minimal datasets safely.

Checks: Cover empty/single/multiple items, playback completion, pause, replay, and unmount. Review mobile/tablet geometry and keyboard slider operation.

Coverage: B15, B22–B24, U13. Architecture: weak prop contracts and implicit playback state.

**PR 11 — Refine discovery, sharing, and profile presentation**

Scope:

- Give posts without covers an intentional text-card layout.
- Separate category and tag labels. Normalize display names while preserving valid URLs. Expose selection and result counts.
- Shorten the notes introduction. Place dates and descriptions where they remain readable on mobile.
- Render one anchor per note. Add All notes navigation and a consistent related-content fallback.
- Add Copy link and native sharing with a visible fallback. Use the centralized content URL.
- Format About dates for readers. Sort roles by the documented start-date rule and explicit ordering overrides.
- Generate appropriately sized portrait assets. Apply deliberate loading priority for the visible portrait.

Acceptance: Browsing has clear selected states and return paths. Note links have no nested anchors. Sharing reports the actual outcome.

Checks: Exercise filters, empty results, tag navigation, sharing success/error/cancellation, and timeline ordering. Review cards and portrait assets in production output.

Coverage: B16, U04, U05, U08, U09, U11 sharing, U15.

**PR 12 — Separate content loading from build and presentation**

Scope:

- Load and resolve content at page or build boundaries. Pass the required data into cards and related-content components.
- Reuse an existing collection for related-content selection. Remove repeated entry loading and repeated reading-time rendering.
- Extract small shared OG rendering and response functions. Keep route-specific content lookup explicit.
- Isolate Excalidraw environment setup inside its build adapter. Replace broad casts with narrow, documented adapter boundaries.
- Remove duplicated styling conversion where direct OG styles or tokens provide the same result.
- Remove React hydration from static callouts. Retain hydration where user interaction needs it.

Acceptance: Presentation components avoid hidden collection reads. Build adapters stay outside browser bundles. Generated content and OG routes remain correct.

Checks: Compare representative HTML and OG images. Measure content render counts and inspect browser bundles. Exercise content edits during development to detect stale caching.

Any caching must have a defined build or request lifetime. A process-global cache is unnecessary unless measured repeated work remains after data reuse.

Coverage: Architecture findings on content loading, related-content queries, OG duplication, build shims, and static hydration.

**PR 13 — Remove obsolete components and styling dependencies**

Scope:

- Recheck imports and runtime registration before removing candidate dead files.
- Remove unused `BaseHead`, `HeaderLink`, `ContentGrid`, `ContactCTA`, and `NoisyImage` implementations where their responsibilities are already covered.
- Remove obsolete variant classes, compatibility wrappers, and abandoned contact exports.
- Remove Basecoat after all surviving consumers use the shared design contract.
- Remove dependencies with no remaining consumers. Keep tools that still provide useful behavior.
- Consolidate helper ownership and names where ambiguity remains. Keep unrelated file moves outside this cleanup.

Acceptance: The fixture and production routes use the same maintained primitives. Removed packages have no remaining imports or required stylesheet consumers.

Checks: Search for removed symbols and classes. Run production build and interaction smoke tests. Compare CSS and JavaScript bundles with the baseline.

Coverage: Architecture findings on dead code, duplicate implementations, and unused dependencies.

**PR 14 — Validate the complete experience and document conventions**

Scope:

- Run the complete route and interaction suite against a fresh production build and search index.
- Review light/dark screenshots at mobile, tablet, and desktop sizes.
- Exercise 200% zoom, keyboard navigation, reduced motion, and a screen reader.
- Exercise real touch interaction and the soft keyboard. Include Chromium, Firefox, and WebKit browser coverage.
- Check first-paint theme, redirects, 404 status, external embeds, and production asset behavior in the deployment preview.
- Publish concise contributor guidance for tokens, primitives, content identity, controllers, and article widgets.
- Update the audit ledger with evidence for each resolved finding and any remaining limitation.

Acceptance: All high-priority defects are resolved. Every finding has evidence or an explicit deferred decision with rationale and follow-up scope.

Checks: Review the accumulated regression suite and manual evidence. Unavailable device or assistive-technology checks remain visible release limitations.

This PR provides integration evidence. Earlier PRs remain responsible for their own regression checks and usable behavior.

**Coverage ledger**

Every audit item has an implementation owner. Cross-cutting improvements list each required PR.

| Audit items             | Owning PR  |
| ----------------------- | ---------- |
| B01, B19, B20, B25      | 02         |
| B02                     | 03         |
| B04, B17, B18           | 04         |
| B03                     | 05         |
| B10, B11                | 06         |
| B05, B06, B07, B08, B09 | 07         |
| B13, B14, B27           | 08         |
| B12                     | 09         |
| B15, B22, B23, B24      | 10         |
| B16                     | 11         |
| B21                     | 01         |
| B26                     | 05, 08     |
| U01                     | 05         |
| U02                     | 08         |
| U03                     | 02         |
| U04, U05, U08, U09, U15 | 11         |
| U06, U07                | 07         |
| U10                     | 04         |
| U11                     | 03, 11     |
| U12                     | 09         |
| U13                     | 10         |
| U14                     | 02, 06, 08 |

The original audit did not establish production performance, complete browser compatibility, or screen-reader behavior. PR 14 closes those evidence gaps where testing is available.

**Merge rules and completion criteria**

- Keep each PR focused on its stated outcome. Separate unrelated dependency upgrades and content edits.
- Include the problem, resulting behavior, affected routes, screenshots where useful, and actual validation results in each PR description.
- Preserve public URLs, content assets, theme preferences, and existing useful interactions throughout migration.
- Add focused regression checks for meaningful behavior. Avoid tests that repeat implementation details or snapshot every markup change.
- Keep content readable when optional search, comments, or decorative scripts fail.
- Document new tokens, variants, and behavior in the same PR that introduces them.
- Remove compatibility code only after its consumers migrate.
- Treat any deliberate deferral as remaining work. Record its reason and next action in the ledger.

After PR 06, the site has shared visual controls, stable URLs, working contact, and consistent overlay behavior.

After PR 11, search, reading, media, and discovery use those foundations. After PR 14, cleanup has supporting regression checks and contributor guidance.

Completion means all 42 audit items are resolved, the structural changes are delivered, and the agreed validation passes. A deferred item keeps the roadmap incomplete.
