import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const lines = readFileSync(input, 'utf-8').split('\n').filter(Boolean);

const templates = lines
  .shift()
  .split(/,\s+/)
  .map((s) => s.trim())
  .filter(Boolean)
  .sort((a, b) => b.length - a.length);

const patterns = lines;

const cache = {};
function count(pattern) {
  const v = cache[pattern];

  if (v !== undefined) {
    return v;
  }

  if (pattern.length == 0) {
    return 1;
  }

  const counts = templates
    .filter((t) => pattern.startsWith(t))
    .reduce(
      (m, t) => Object.assign(m, { [t.length]: (m[t.length] ?? 0) + 1 }),
      {},
    );

  return (cache[pattern] = Object.entries(counts).reduce((sum, [k, v]) => {
    return sum + v * count(pattern.slice(Number(k)));
  }, 0));
}

console.log(patterns.map((p) => count(p)).reduce((s, c) => s + c, 0));
