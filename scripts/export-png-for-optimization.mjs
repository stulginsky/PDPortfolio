import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const registry = JSON.parse(await fs.readFile(path.join(root, 'content/assets/optimized-png.json'), 'utf8'));
const known = new Map(registry.files.map(file => [file.path, file.sha256]));
async function walk(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(full));
    else if (entry.isFile() && /\.png$/i.test(entry.name)) result.push(full);
  }
  return result;
}
const pending = [];
for (const full of (await walk(path.join(root, 'public'))).sort()) {
  const relative = path.relative(root, full).split(path.sep).join('/');
  const data = await fs.readFile(full);
  const sha256 = createHash('sha256').update(data).digest('hex');
  if (known.get(relative) !== sha256) pending.push({ path: relative, bytes: data.length, sha256, reason: known.has(relative) ? 'changed' : 'new' });
}
// Optional export keeps project-relative paths and never overwrites an existing directory.
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--export')) throw new Error('Usage: node scripts/export-png-for-optimization.mjs [--export tmp/<folder>]');
if (args.length) {
  const destination = path.resolve(root, args[1]);
  const relative = path.relative(path.join(root, 'tmp'), destination);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Export destination must be a new directory inside project tmp/');
  await fs.mkdir(destination);
  for (const file of pending) {
    const target = path.join(destination, file.path);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(root, file.path), target);
  }
  await fs.writeFile(path.join(destination, 'manifest.json'), JSON.stringify({ version: 1, scope: 'All standalone PNG files in public; usage is not inferred.', files: pending }, null, 2) + '\n');
}
console.log(JSON.stringify({ count: pending.length, bytes: pending.reduce((sum, file) => sum + file.bytes, 0), files: pending }, null, 2));
