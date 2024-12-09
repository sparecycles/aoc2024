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

function resonate({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const nodes = [];
  let x = x1;
  let y = y1;
  while (x >= 0 && y >= 0 && x < map[0].length && y < map.length) {
    nodes.push({ x, y });
    x += dx;
    y += dy;
  }

  x = x2;
  y = y2;
  while (x >= 0 && y >= 0 && x < map[0].length && y < map.length) {
    nodes.push({ x, y });
    x -= dx;
    y -= dy;
  }

  return nodes;
}

function place({ x, y }) {
  if (antinodes[y]?.[x]) {
    antinodes[y][x] = '#';
  }
}

for (const v of Object.values(frequencies)) {
  v.forEach((p, i) => {
    v.slice(i + 1).forEach((p2) => {
      resonate(p, p2).map(place);
    });
  });
}

console.log(antinodes.map((nodes) => nodes.join('')).join('\n'));

console.log(
  antinodes.reduce((a, row) => a + row.filter((x) => x == '#').length, 0),
);
