const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { execFileSync } = require('child_process');

const FILE = 'src/lib/extensions.js';
const MAX_DAYS = 7;

const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

let counter = 0;
async function load(source) {
  const tmp = path.join(os.tmpdir(), `extensions-${counter++}.mjs`);
  fs.writeFileSync(tmp, source);
  const mod = await import(pathToFileURL(tmp).href);
  return new Map(mod.default.map((e) => [e.code, e.tags || []]));
}

const blankComments = (text) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/^[ \t]*\/\/.*$/gm, (m) => ' '.repeat(m.length));

function findTagsLine(lines, code) {
  const idx = lines.findIndex((l) => l.includes(`code: "${code}"`));
  if (idx < 0) return -1;
  let start = idx;
  while (start >= 0 && !/^\s*\{\s*$/.test(lines[start])) start--;
  let end = idx;
  while (end < lines.length && !/^\s*\},?\s*$/.test(lines[end])) end++;
  for (let i = start; i <= end; i++) {
    if (/^\s*tags:\s*\[/.test(lines[i])) return i;
  }
  return -1;
}

(async () => {
  const original = fs.readFileSync(FILE, 'utf8');
  const current = await load(original);
  const newCodes = [...current].filter(([, tags]) => tags.includes('new')).map(([code]) => code);

  const commits = git('log', '--format=%H %ct', '--', FILE)
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      const [hash, ct] = l.split(' ');
      return { hash, ct: Number(ct) };
    });

  const cache = new Map();
  const tagsAt = async (hash) => {
    if (!cache.has(hash)) {
      try {
        cache.set(hash, await load(git('show', `${hash}:${FILE}`)));
      } catch {
        cache.set(hash, new Map());
      }
    }
    return cache.get(hash);
  };

  const now = Date.now() / 1000;
  const expired = [];

  for (const code of newCodes) {
    let since = null;
    for (const c of commits) {
      const tags = (await tagsAt(c.hash)).get(code);
      if (tags && tags.includes('new')) since = c.ct;
      else break;
    }
    if (since === null) continue;

    const days = (now - since) / 86400;
    console.log(`${code}: "new" tag added ${days.toFixed(1)} day(s) ago`);
    if (days > MAX_DAYS) expired.push(code);
  }

  if (!expired.length) {
    console.log('Nothing to remove.');
    return;
  }

  const lines = original.split('\n');
  const scan = blankComments(original).split('\n');
  const toDelete = new Set();

  for (const code of expired) {
    const i = findTagsLine(scan, code);
    if (i < 0) continue;
    const rest = [...lines[i].matchAll(/"([^"]*)"/g)].map((x) => x[1]).filter((t) => t !== 'new');
    if (!rest.length) toDelete.add(i);
    else lines[i] = lines[i].replace(/\[.*\]/, `[${rest.map((t) => `"${t}"`).join(', ')}]`);
    console.log(`Removing "new" from ${code}`);
  }

  fs.writeFileSync(FILE, lines.filter((_, i) => !toDelete.has(i)).join('\n'));
})();
