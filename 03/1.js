import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const memory = readFileSync(input, 'utf-8');

let total = 0;
memory.replace(
  /mul\((\d+),(\d+)\)/g,
  (match, n, m) => (total += Number(n) * Number(m)),
);

console.log(total);
