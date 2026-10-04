/**
 * Tidies a setting read from the environment. Values copied from .env.local into a hosting
 * dashboard often keep the quotes .env files use (the dashboard stores them literally) or
 * pick up stray spaces; both are removed here.
 *
 * Pass `process.env.NAME` itself rather than a name, so every reference stays static for
 * the bundler.
 */
export function cleanEnv(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  let value = raw.trim();
  const quote = value[0];
  if (value.length >= 2 && (quote === "'" || quote === '"') && value.endsWith(quote)) {
    value = value.slice(1, -1).trim();
  }
  return value || undefined;
}
