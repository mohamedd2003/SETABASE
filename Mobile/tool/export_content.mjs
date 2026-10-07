// Exports the website's content into the app, so copy and catalog data live in one place.
//
//   node tool/export_content.mjs
//
// Bundles ../src/content/*.ts and the built-in catalog with the website's own esbuild,
// evaluates them and writes assets/content/content.json. Re-run it whenever the website's
// copy changes. Image imports become their file name; the app maps those to bundled assets.

import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const mobileRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = path.resolve(mobileRoot, "..");
const src = path.join(webRoot, "src");
const out = path.join(mobileRoot, "assets", "content", "content.json");

const require = createRequire(path.join(webRoot, "package.json"));
const esbuild = require("esbuild");

const entry = `
  export { site } from "@/content/site";
  export { landing } from "@/content/landing";
  export { privatePage } from "@/content/private";
  export { businessPage } from "@/content/business";
  export { explainer } from "@/content/explainer";
  export * as relocation from "@/content/relocation";
  export * as specialServices from "@/content/special-services";
  export { fallbackSpecialOffers, fallbackRelocationPackages } from "@/lib/catalog-fallback";
`;

const aliasAndImages = {
  name: "alias-and-images",
  setup(build) {
    build.onResolve({ filter: /^@\// }, async (args) =>
      build.resolve("./" + args.path.slice(2), { resolveDir: src, kind: args.kind }),
    );
    build.onResolve({ filter: /\.(jpe?g|png|webp)$/ }, (args) => ({
      path: path.resolve(args.resolveDir, args.path),
      namespace: "image",
    }));
    build.onLoad({ filter: /.*/, namespace: "image" }, (args) => ({
      contents: `export default { src: ${JSON.stringify(path.basename(args.path))} };`,
      loader: "js",
    }));
  },
};

const result = await esbuild.build({
  stdin: { contents: entry, resolveDir: src, loader: "ts" },
  bundle: true,
  write: false,
  format: "esm",
  platform: "neutral",
  external: ["next/*"],
  define: { "process.env.NEXT_PUBLIC_SITE_URL": "undefined" },
  plugins: [aliasAndImages],
  logLevel: "warning",
});

const code = result.outputFiles[0].text;
const mod = await import("data:text/javascript;base64," + Buffer.from(code).toString("base64"));

const { relocation: r, specialServices: s } = mod;
// next/image hands pages `{ src }` objects; the app only needs the file name.
for (const page of [mod.privatePage, mod.businessPage]) {
  page.hero.photos = page.hero.photos?.map((p) => ({ ...p, src: p.src.src }));
}
const content = {
  generatedFrom: "../src/content (run tool/export_content.mjs to refresh)",
  site: mod.site,
  landing: mod.landing,
  audiences: { private: mod.privatePage, business: mod.businessPage },
  explainer: mod.explainer,
  relocation: {
    opening: r.relocationOpening,
    conversation: r.relocationConversation,
    next: r.relocationNext,
    destinations: r.relocationDestinations,
    exclusions: r.relocationExclusions,
  },
  specialServices: {
    steps: s.specialServicesSteps,
    terms: s.specialServicesTerms,
    contractLengths: s.contractLengths,
  },
  fallbackCatalog: {
    specialOffers: mod.fallbackSpecialOffers,
    relocationPackages: mod.fallbackRelocationPackages,
  },
};

await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(content, null, 2) + "\n");
console.log(`Wrote ${path.relative(mobileRoot, out)} (${(JSON.stringify(content).length / 1024).toFixed(1)} KB)`);
