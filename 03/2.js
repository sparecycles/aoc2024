import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const memory = readFileSync(input, 'utf-8');

let total = 0;
let enabled = true;
memory.replace(/mul\((\d+),(\d+)\)|(do|don't)\(\)/g, (match, n, m, dd) => {
  console.log(n, m, dd);
  if (enabled && n && m) {
    total += Number(n) * Number(m);
  }
  if (dd == 'do') enabled = true;
  if (dd == "don't") enabled = false;
});

console.log(total);