/**
 * Flatten a vinext build into a plain static site.
 *
 * `vinext build --prerender-all` splits its output in two: client assets land in
 * dist/client, but the prerendered HTML lands in dist/server/prerendered-routes
 * because the normal target is a Cloudflare Worker that serves them. A static
 * host has no Worker, so it needs both halves merged under one root.
 *
 * Every route in this app is client-only ('use client', no server APIs), so the
 * prerendered HTML is the whole page — nothing has to run at request time.
 *
 * Run via `npm run build:static`; output goes to out/.
 */
import { existsSync, mkdirSync, readdirSync, rmSync, cpSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const CLIENT = 'dist/client';
const PRERENDERED = 'dist/server/prerendered-routes';
const OUT = 'out';

for (const dir of [CLIENT, PRERENDERED]) {
  if (!existsSync(dir)) {
    console.error(`✗ missing ${dir} — run \`vinext build --prerender-all\` first`);
    process.exit(1);
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 1. client assets (_next, images, favicon) form the root
cpSync(CLIENT, OUT, { recursive: true });

// 2. prerendered HTML on top. "shop.html" has to become "shop/index.html" so the
//    /shop URL resolves on a host that only does directory-index lookups.
let pages = 0;
for (const file of readdirSync(PRERENDERED)) {
  const src = join(PRERENDERED, file);
  if (file.endsWith('.rsc')) {
    copyFileSync(src, join(OUT, file)); // client-side nav payloads
    continue;
  }
  if (!file.endsWith('.html')) continue;

  const name = file.replace(/\.html$/, '');
  if (name === 'index' || name === '404') {
    copyFileSync(src, join(OUT, file));
  } else {
    mkdirSync(join(OUT, name), { recursive: true });
    copyFileSync(src, join(OUT, name, 'index.html'));
  }
  pages++;
}

if (!existsSync(join(OUT, 'index.html'))) {
  console.error('✗ no index.html produced — prerender likely failed');
  process.exit(1);
}

console.log(`✓ ${OUT}/ ready — ${pages} page(s)`);
