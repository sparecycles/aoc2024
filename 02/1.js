import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

function safe(list, n, m) {
  for (let i = 1; i < list.length; i++) {
    if (!safed(list[i] - list[i - 1], n, m)) return false;
  }
  return true;
}

function safed(delta, n, m) {
  return delta >= n && delta <= m;
}

const lines = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split(/\s+/).map(Number))
  .filter((list) => safe(list, 1, 3) || safe(list, -3, -1));

console.log(lines.length);
