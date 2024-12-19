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

function possible(pattern, cache = {}) {
  if (cache[pattern.length]) return false;
  cache[pattern.length] = true;
  if (pattern.length == 0) return true;

  for (const t of templates) {
    if (pattern.startsWith(t)) {
      if (possible(pattern.slice(t.length), cache)) {
        return true;
      }
    }
  }

  return false;
}

console.log(patterns.filter((p) => possible(p)).length);
