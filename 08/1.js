import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const map = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split(''));

const antinodes = map.map((line) => line.map((e) => e));

const frequencies = {};

map.map((row, y) =>
  row.map((f, x) => {
    if (/[a-zA-Z0-9]/.test(f)) {
      (frequencies[f] ??= []).push({ x, y });
    }
  }),
);

function resonate({ x, y }, { x: x2, y: y2 }) {
  const dx = x2 - x;
  const dy = y2 - y;
  return [
    { x: x - dx, y: y - dy },
    { x: x2 + dx, y: y2 + dy },
  ];
}

function place({ x, y }) {
  if (antinodes[y]?.[x]) {
    antinodes[y][x] = '#';
  }
}

for (const v of Object.values(frequencies)) {
  v.forEach((p, i) => {
    v.slice(i + 1).forEach((p2) => {
      const [a, a2] = resonate(p, p2);
      place(a);
      place(a2);
    });
  });
}

console.log(
  antinodes.reduce((a, row) => a + row.filter((x) => x == '#').length, 0),
);
