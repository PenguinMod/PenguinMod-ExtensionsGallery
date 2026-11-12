const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

const FILE = 'src/lib/extensions.js';
const CODE_DIR = 'static/extensions';
const BANNER_DIR = 'static/images';

let errors = 0;

const esc = (s) => String(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
function fail(msg, file = FILE, line) {
  errors++;
  console.log(`::error file=${file}${line ? `,line=${line}` : ''}::${esc(msg)}`);
}
const warn = (msg, file = FILE) => console.log(`::warning file=${file}::${esc(msg)}`);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

function safeResolve(baseDir, rel) {
  const base = path.resolve(baseDir);
  const full = path.resolve(base, rel);
  return full.startsWith(base + path.sep) ? full : null;
}

async function loadExtensions() {
  const tmp = path.join(os.tmpdir(), `extensions-validate-${Date.now()}.mjs`);
  fs.writeFileSync(tmp, fs.readFileSync(FILE, 'utf8'));
  const mod = await import(pathToFileURL(tmp).href);
  return mod.default;
}

(async () => {
  let list;
  try {
    list = await loadExtensions();
  } catch (err) {
    fail(`Could not load the file: ${err.message}`);
    process.exit(1);
  }

  const seen = new Set();
  const referenced = new Set();

  list.forEach((ext, i) => {
    const label = ext && ext.code ? ext.code : `#${i}`;

    if (!ext || typeof ext !== 'object') return fail(`Entry ${label} is not an object.`);

    if (typeof ext.code !== 'string' || !ext.code.trim()) {
      return fail(`Entry ${label} has no valid "code".`);
    }
    if (seen.has(ext.code)) fail(`Duplicate "code": ${ext.code}`);
    seen.add(ext.code);

    if (ext.tags !== undefined && !Array.isArray(ext.tags)) {
      fail(`${label}: "tags" must be an array.`);
    }

    const codePath = safeResolve(CODE_DIR, ext.code);
    if (!codePath) return fail(`${label}: invalid path.`);
    if (!fs.existsSync(codePath)) {
      return fail(`${label}: file not found at ${CODE_DIR}/${ext.code}`);
    }
    referenced.add(codePath);

    const rel = path.relative(process.cwd(), codePath);
    const src = fs.readFileSync(codePath, 'utf8');
    if (!src.trim()) {
      fail(`${label}: file is empty.`, rel);
    } else {
      try {
        new vm.Script(src, { filename: rel });
      } catch (err) {
        const m = /:(\d+)$/.exec(String(err.stack).split('\n')[0]);
        fail(`${label}: syntax error: ${err.message}`, rel, m ? m[1] : undefined);
      }
    }

    if (typeof ext.banner === 'string') {
      const bannerPath = safeResolve(BANNER_DIR, ext.banner);
      if (!bannerPath || !fs.existsSync(bannerPath)) {
        fail(`${label}: banner not found at ${BANNER_DIR}/${ext.banner}`);
      }
    }
  });

  for (const f of walk(CODE_DIR)) {
    if (f.endsWith('.js') && !referenced.has(path.resolve(f))) {
      warn(`Extension not registered in ${FILE}`, f);
    }
  }

  console.log(`${list.length} extensions checked, ${errors} error(s).`);
  if (errors) process.exit(1);
})();