import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => readFileSync(path.join(root, file), 'utf8');
let references = 0;
function checkRef(ref, owner) {
  if (/^(data:|https?:|blob:|#|\$\{)/.test(ref)) return;
  const target = path.resolve(root, path.dirname(owner), ref.split(/[?#]/)[0]);
  assert.ok(target.startsWith(root) && existsSync(target), `${owner}: missing ${ref}`);
  references++;
}
const html = read('index.html');
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)].map(m => m[1]);
assert.deepEqual(scripts, ['src/game/startup.js', 'vendor/three-r128-build55.js', 'vendor/GLTFLoader.js', 'src/game/main.js', 'src/game/workbench.js', 'src/game/collision.js', 'src/game/interactions.js', 'src/game/world-updates.js']);
for (const file of scripts) {
  checkRef(file, 'index.html');
  const code = read(file);
  new vm.Script(code, { filename: file });
  // Classic scripts resolve asset URLs against index.html, not their source directory.
  for (const m of code.matchAll(/["'](assets\/[^"'\s]+\.(?:glb|mp3|mp4|jpg|png|webp)(?:\?[^"']*)?)["']/g)) checkRef(m[1], 'index.html');
}
for (const file of ['index.html', 'previews/crafting-preview-build38.html']) {
  const content = read(file);
  for (const m of content.matchAll(/(?:src|href)="([^"]+)"/g)) checkRef(m[1], file);
  for (const m of content.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) checkRef(m[1], file);
}
for (const name of readdirSync(path.join(root, 'src/styles'))) {
  const file = `src/styles/${name}`;
  for (const m of read(file).matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) checkRef(m[1], file);
}
// Exercise the actual dynamic scenery URL expression for every scenery model ID.
const main = read('src/game/main.js');
const start = main.indexOf(".load('assets/models/'+job.id+(");
assert.ok(start >= 0, 'Dynamic model loader missing');
const end = main.indexOf(',a=>', start);
const modelURL = main.slice(start + '.load('.length, end);
const scenery = readdirSync(path.join(root, 'assets/models')).filter(f => /-build(?:44|46|47|48|49)\.glb$/.test(f));
for (const file of scenery) {
  const id = file.split('-build')[0];
  checkRef(vm.runInNewContext(modelURL, { job: { id } }), 'index.html');
}
for (const name of ['wood_planks', 'rusty_metal_sheet']) checkRef(`assets/images/${name}-build48.jpg`, 'index.html');
assert.ok(main.includes("'assets/images/'+(kind==='wood'?'wood_planks':'rusty_metal_sheet')"));
console.log(`Passed: ${scripts.length} script syntax checks, script order, ${references} local references (including dynamic scenery and textures).`);
