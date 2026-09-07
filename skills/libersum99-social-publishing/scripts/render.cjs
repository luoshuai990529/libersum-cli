#!/usr/bin/env node
// Render local, static publishing HTML. The result directory appears only on success.
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL, fileURLToPath } = require('node:url');

async function main() {
  const [mode, inputArg, outputArg] = process.argv.slice(2);
  if (!['cards', 'wechat'].includes(mode) || !inputArg || !outputArg) {
    throw new Error('Usage: node render.cjs cards|wechat INPUT.html NEW_OUTPUT_DIR');
  }
  const input = await fs.realpath(inputArg);
  const output = path.resolve(outputArg);
  try { await fs.access(output); throw new Error('Output already exists; choose a new directory.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  let chromium;
  try { ({ chromium } = require('playwright')); }
  catch { throw new Error('Playwright is required. Use an available runtime or install it in a separate tools directory and set NODE_PATH. See references/delivery.md.'); }
  const browser = await chromium.launch(process.env.BROWSER_EXECUTABLE
    ? { executablePath: process.env.BROWSER_EXECUTABLE, headless: true }
    : { channel: 'chrome', headless: true });
  let staging;
  try {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: mode === 'cards' ? 1200 : 390, height: 900 }, deviceScaleFactor: 1 });
    const remote = new Set();
    await context.route(/^https?:/, route => { remote.add(route.request().url()); return route.abort(); });
    const page = await context.newPage();
    await page.goto(pathToFileURL(input).href, { waitUntil: 'load' });
    await page.waitForFunction(() => document.fonts.status === 'loaded' && Array.from(document.images).every(img => img.complete), null, { timeout: 15000 });
    if (remote.size) throw new Error(`External resources must be local before export: ${[...remote].join(', ')}`);
    const broken = await page.evaluate(() => Array.from(document.images).filter(img => !img.complete || !img.naturalWidth).map(img => img.getAttribute('src')));
    if (broken.length) throw new Error(`Missing image: ${broken.join(', ')}`);
    const report = { mode, localChecks: 'passed', platformVerified: false, pages: 0 };
    await fs.mkdir(path.dirname(output), { recursive: true });
    staging = await fs.mkdtemp(path.join(path.dirname(output), '.social-render-'));
    if (mode === 'cards') {
      await page.evaluate(() => {
        const style = document.createElement('style');
        style.textContent = '.card {transform:none!important; margin:0!important; box-shadow:none!important; flex-shrink:0!important;} *,*::before,*::after {animation:none!important; transition:none!important;}';
        document.head.appendChild(style);
      });
      const cards = page.locator('.card');
      const count = await cards.count();
      if (!count) throw new Error('No .card elements found.');
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const issue = await card.evaluate(el => {
          const rect = el.getBoundingClientRect();
          if (Math.abs(rect.width - 1080) > 0.5 || Math.abs(rect.height - 1440) > 0.5) return 'Card must be 1080x1440.';
          if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) return 'Clipped content';
          for (const child of el.querySelectorAll('*')) {
            if (child.closest('[data-decoration]')) continue;
            const r = child.getBoundingClientRect();
            if (!r.width || !r.height) continue;
            if (r.left < rect.left - 1 || r.right > rect.right + 1 || r.top < rect.top - 1 || r.bottom > rect.bottom + 1) return 'Clipped content';
            if (child.scrollHeight > child.clientHeight + 1 && getComputedStyle(child).overflowY === 'hidden') return 'Clipped content';
          }
          return null;
        });
        if (issue) throw new Error(`Card ${i + 1}: ${issue}`);
        const buffer = await card.screenshot({ path: path.join(staging, `${String(i + 1).padStart(2, '0')}.png`) });
        if (buffer.readUInt32BE(16) !== 1080 || buffer.readUInt32BE(20) !== 1440) throw new Error(`Card ${i + 1}: invalid PNG size`);
      }
      report.pages = count;
    } else {
      const incompatible = await page.locator('script, style, link[rel="stylesheet"], iframe').count();
      if (incompatible) throw new Error('Wechat source must use static content and inline styles.');
      const images = await page.locator('img').evaluateAll(nodes => nodes.map(img => img.src));
      const embedded = [];
      for (const src of images) {
        if (src.startsWith('data:image/')) { embedded.push(src); continue; }
        if (!src.startsWith('file:')) throw new Error('Wechat images must be local.');
        const filename = await fs.realpath(fileURLToPath(src));
        const relative = path.relative(path.dirname(input), filename);
        if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Copy images into the article folder first.');
        const types = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };
        const mime = types[path.extname(filename).toLowerCase()];
        if (!mime) throw new Error('Use PNG/JPEG/WebP/GIF for article images.');
        embedded.push(`data:${mime};base64,${(await fs.readFile(filename)).toString('base64')}`);
      }
      await page.locator('img').evaluateAll((nodes, values) => nodes.forEach((img, i) => { img.src = values[i]; img.removeAttribute('srcset'); }), embedded);
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      if (hasOverflow) throw new Error('Wechat article has horizontal overflow at 390px.');
      await fs.writeFile(path.join(staging, 'article.html'), await page.content());
      await fs.writeFile(path.join(staging, 'article-fragment.html'), await page.locator('body').innerHTML());
      await page.screenshot({ path: path.join(staging, 'preview.png'), fullPage: true });
      report.images = images.length;
    }
    await fs.writeFile(path.join(staging, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    await fs.rename(staging, output);
    staging = undefined;
    console.log(JSON.stringify({ output, ...report }));
  } finally {
    if (staging) await fs.rm(staging, { recursive: true, force: true });
    await browser.close();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
