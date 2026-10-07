# SETABASE — mobile app

The Flutter app for SETABASE, the mobile counterpart of the website one level up (`../src`).
The website is the source for copy, journeys and API routes; the Figma file
([SETABASE — Mobile App](https://www.figma.com/design/JF3fCnnV91qRldIFO5qNkn/SETABASE-%E2%80%94-Mobile-App?node-id=0-1))
is the source for layout and visuals. Reference screenshots are in `design/figma/`.

## Run it

```sh
flutter pub get
dart run build_runner build          # Riverpod providers (*.g.dart)
flutter run                          # debug: talks to `next dev` on this computer
flutter run --dart-define=API_BASE_URL=https://setabase.com
```

Without `API_BASE_URL`, release builds use `https://setabase.com` and debug builds use
`http://10.0.2.2:3000` on the Android emulator (`http://localhost:3000` elsewhere) — start the
website with `npm run dev` in the repo root first.

```sh
flutter test        # includes the parity tests against the website's own functions
flutter analyze
```

## Content comes from the website

Nothing the website says is retyped here. Two scripts read the website's TypeScript with its
own esbuild and write JSON for the app:

| Script | Writes | Re-run when |
|---|---|---|
| `node tool/export_content.mjs` | `assets/content/content.json` — every page's copy, the explainer, relocation and Special Services copy, the built-in catalog | the website's `src/content` or `src/lib/catalog-fallback.ts` changes |
| `node tool/export_parity_fixtures.mjs` | `test/fixtures/web_parity.json` — the website's `slugify`, catalog derivation and price estimates on a set of cases | `src/lib/catalog.ts` or `src/lib/special-services-pricing.ts` changes |

Interface strings that live in the website's components (button labels, planner labels) are in
`lib/data/static/app_copy.dart`.

The packages for Corporate Relocation and Special Services are fetched live from
`GET /api/corporate-relocation` and `GET /api/special-offers`, so admin changes show up without
an app release. If the site can't be reached, the bundled catalog is shown with a note.

## API routes used

| Route | Screen | Notes |
|---|---|---|
| `GET /api/special-offers` | Special Services | `{ data: SpecialOffer[] }` |
| `GET /api/corporate-relocation` | Corporate Relocation | `{ data: RelocationPackage[] }` |
| `POST /api/contact` | Request a quote | `{ ok: true }`; 422 `{ error, issues[] }`. The website currently only logs these. |
| `POST /api/requests` | both planners | 201 `{ data: { id } }`; 422 `{ error: { message, fields } }`; 429 with `Retry-After`; 503 without a database |

## Structure

```
lib/
  main.dart              loads prefs + content, starts the app
  app/                   router (go_router), tab shell, theme, header menu
  core/                  env config, API client, slugify, money formatting
  design_system/         tokens (ThemeExtension), icons, widgets, iso/ (the 3D building model)
  data/                  models, catalog + pricing ports, repositories, providers, app copy
  features/
    onboarding/          welcome, Private | Business
    home/                Home for either audience
    services/            the department list and one detail screen for every department
    guide/               Property vs Facility Management
    contact/             request a quote, request sent, shared request form
    relocation/          Corporate Relocation planner
    special_services/    packages, live estimate, request
tool/                    the two export scripts
```

The 3D building is the website's CSS box model ported to a `CustomPainter`
(`design_system/iso/`): the same geometry, camera and colours, so the villa and towers light up
for Private and Business and each service lights its own floor.
