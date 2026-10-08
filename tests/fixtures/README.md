# Producer panel fixtures

Each producer may add its own `tests/fixtures/<producer>.html` and matching
`.tsx` entry. An HTML entry has a container and a module script importing its
entry. The entry imports `mountPanel` from `./host`, creates the panel with its
own typed props and ports, and calls `mountPanel(container, panel)`. It owns
navigation recording, destination-heading focus, lifecycle fixtures, and later
real domain/controller objects. No host registry or final App edit is needed.
Call the returned `unmount()` on teardown; repeated calls are safe. Mount once
per container, and unmount before mounting another root in that container.
`platform.html`/`platform.tsx` is the neutral executable example, with navigation
and heading focus, a minimal lifecycle recorder, and subscription teardown.

Run `pnpm dev` and visit the entry beneath the configured base, for example
`http://127.0.0.1:5173/playtest/tests/fixtures/<producer>.html` when
`APP_BASE=/playtest/`. Fixture HTML/TSX stays outside `public/`. Only `index.html`
is a release build input, so fixtures cannot enter `dist` or precache unless
someone explicitly imports them into the app (which is prohibited).

Local browser checks use `*.local.spec.ts` and the `local-fixture` project;
`pnpm test:browser` starts a separate `/playtest/` dev server at port 4173.
Published observations use `*.published.spec.ts` and require both
`PLAYTEST_MODE=published` and `PLAYTEST_BASE_URL=https://<host>/<repository>/`.
They use D1–T2 with fresh Playwright contexts; no local server or fallback is
configured. T2 tests rotate with `page.setViewportSize({width:1024,height:768})`.
Keyboard and touch journeys remain each feature/playtest author's acceptance
responsibility; the viewport declaration alone does not verify them.

The confirmed intended Pages base defaults to `/Learning-is-Fun/`.
Production builds require `APP_BUILD_ID`; `APP_BASE` explicitly overrides the
deployment path. Use `/` only for a
confirmed root/custom-domain deployment, or `/<repository>/` for Pages.
Local verification can use an explicitly temporary base and `local-*` build
identity. CI supplies commit plus workflow run/attempt as the build identity.
The later worker build must embed the same `__BUILD_ID__` value. WP01-03A
owns PWA injection and extending `build` with its precache check; no worker or
offline behavior is implemented in this foundation. The worker typecheck
already validates shared platform code under `WebWorker` without DOM globals.

Selected package licences are retained by pnpm in `node_modules` package
directories. The handoff records the installed versions, peer checks and
licence-file inventory. Do not remove upstream notices when distributing
third-party code; the later publication stage owns distribution packaging.
