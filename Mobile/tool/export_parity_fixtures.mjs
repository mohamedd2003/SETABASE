// Runs the website's own catalog and pricing functions on a set of cases and writes the
// results to test/fixtures/web_parity.json. The Dart tests check the app's ports against it,
// because `/api/requests` rejects ids that don't match the website's derivation.
//
//   node tool/export_parity_fixtures.mjs

import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const mobileRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = path.resolve(mobileRoot, "..");
const src = path.join(webRoot, "src");
const out = path.join(mobileRoot, "test", "fixtures", "web_parity.json");
const esbuild = createRequire(path.join(webRoot, "package.json"))("esbuild");

const entry = `
  export { slugify, splitFeature, toSpecialServicesCatalog, toRelocationCatalog } from "@/lib/catalog";
  export { estimateSpecialServices, formatEgp } from "@/lib/special-services-pricing";
  export { fallbackSpecialOffers, fallbackRelocationPackages } from "@/lib/catalog-fallback";
`;

const result = await esbuild.build({
  stdin: { contents: entry, resolveDir: src, loader: "ts" },
  bundle: true,
  write: false,
  format: "esm",
  platform: "neutral",
  external: ["next/*"],
  define: { "process.env.NEXT_PUBLIC_SITE_URL": "undefined" },
  plugins: [
    {
      name: "alias-and-images",
      setup(build) {
        build.onResolve({ filter: /^@\// }, (args) =>
          build.resolve("./" + args.path.slice(2), { resolveDir: src, kind: args.kind }),
        );
        build.onResolve({ filter: /\.(jpe?g|png|webp)$/ }, (args) => ({ path: args.path, namespace: "image" }));
        build.onLoad({ filter: /.*/, namespace: "image" }, () => ({ contents: "export default {}", loader: "js" }));
      },
    },
  ],
  logLevel: "warning",
});
const web = await import("data:text/javascript;base64," + Buffer.from(result.outputFiles[0].text).toString("base64"));

const offers = web.fallbackSpecialOffers;
const packages = web.fallbackRelocationPackages;
const catalog = web.toSpecialServicesCatalog(offers);
const flex = catalog.flexItems.map((f) => f.id);
const fixed = catalog.fixedPackages.map((p) => p.id);
const kit = catalog.flexItems.find((f) => f.unit === "kit")?.id;
const workshop = catalog.flexItems.find((f) => f.unit === "workshop")?.id;

const selections = [
  { employees: 20, packages: [fixed[0]], flexItems: [] },
  { employees: 20, packages: [], flexItems: [] },
  { employees: 60, packages: [fixed[0], fixed[2]], flexItems: [] },
  { employees: 20, packages: [], flexItems: flex.slice(0, 3) },
  { employees: 37, packages: [], flexItems: [flex[0], flex[1], flex[3], kit, workshop] },
  { employees: 20, packages: [fixed[0]], flexItems: [catalog.fixedPackages[0].items.find((i) => i.flexId)?.flexId, flex[8]] },
  { employees: 500, packages: fixed.slice(0, 3), flexItems: [flex[10], flex[12]] },
  { employees: 120, packages: [fixed[1]], flexItems: [] },
  { employees: 200, packages: fixed, flexItems: flex },
  { employees: 0, packages: [fixed[3]], flexItems: [] },
  { employees: -3, packages: [fixed[3]], flexItems: [] },
  { employees: 7.9, packages: [], flexItems: flex.slice(5, 11) },
  { employees: 49, packages: [fixed[0], fixed[1]], flexItems: [workshop] },
  { employees: 50, packages: [fixed[0], fixed[1]], flexItems: [workshop] },
].map((s) => ({ ...s, flexItems: s.flexItems.filter(Boolean) }));

const slugs = [
  "Tea and karkadé tasting",
  "Ramadan, Eid, Christmas and New Year",
  "  --Hello__World--  ",
  "Crème brûlée à la carte — Ñandú",
  "Toilet paper, hand towels, soap",
  "Egyptian cooking workshop (koshari, molokheya)",
  "x".repeat(50) + " " + "y".repeat(50),
  "Residence and visa",
  "Property and facility management for the home",
];

const features = ["Where to live — A district chosen around culture", "Plain feature", "A — B — C", "  Spaced  —  detail  "];

const fixtures = {
  slugify: slugs.map((input) => ({ input, output: web.slugify(input) })),
  splitFeature: features.map((input) => ({ input, output: web.splitFeature(input) })),
  offers,
  relocationPackages: packages,
  specialServicesCatalog: catalog,
  relocationCatalog: web.toRelocationCatalog(packages),
  estimates: selections.map((selection) => ({ selection, estimate: web.estimateSpecialServices(selection, catalog) })),
  formatEgp: [0, 615, 22200, 1234567, 999.5, 1000.49].map((input) => ({ input, output: web.formatEgp(input) })),
};

await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(fixtures, null, 2) + "\n");
console.log(`Wrote ${path.relative(mobileRoot, out)}: ${fixtures.estimates.length} estimates, ${fixtures.slugify.length} slugs`);
