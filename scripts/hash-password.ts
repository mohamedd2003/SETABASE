/**
 * Makes the values the admin login needs.
 *
 *   npm run admin:hash -- "your password here"
 *
 * Prints ready-to-paste lines for .env.local: a bcrypt ADMIN_PASSWORD_HASH and a fresh
 * random AUTH_SECRET. Nothing is written anywhere.
 *
 * Next.js expands `$VAR` references inside .env files, and a bcrypt hash is full of `$`
 * signs, so in .env.local each one is escaped as `\$`. Vercel's environment settings
 * take the plain hash — that line is printed too.
 */
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

const password = process.argv.slice(2).join(" ");
if (password.length < 8) {
  console.error('Usage: npm run admin:hash -- "a password of at least 8 characters"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
const secret = randomBytes(32).toString("base64url");

console.log("# Paste these two lines into .env.local (the \\$ escapes are required there):");
console.log(`ADMIN_PASSWORD_HASH='${hash.replace(/\$/g, "\\$")}'`);
console.log(`AUTH_SECRET='${secret}'`);
console.log("");
console.log("# On Vercel (Settings → Environment Variables) use the plain values instead:");
console.log(`ADMIN_PASSWORD_HASH  ${hash}`);
console.log(`AUTH_SECRET          ${secret}`);
