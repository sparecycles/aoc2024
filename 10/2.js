import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const map = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split('').map(Number));

const trailheads = map.flatMap((row, y) =>
  row.flatMap((h, x) => (h !== 0 ? [] : [{ x, y }])),
);

function walk({ x, y }, h) {
  const steps = [];
  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++) {
      if (!dx != !dy) {
        if (map[y + dy]?.[x + dx] === h) {
          steps.push({ y: y + dy, x: x + dx });
        }
      }
    }
  return steps;
}

function* range(min, max) {
  for (let i = min; i <= max; i++) {
    yield i;
  }
}

function uniq() {
  const set = new Set();
  return (p) => {
    const key = `${p.x}:${p.y}`;
    if (set.has(key)) {
      return [];
    }
    set.add(key);
    return [p];
  };
}

function score({ x, y }) {
  let pos = [{ x, y }];
  for (const h of range(1, 9)) {
    pos = pos.flatMap((p) => walk(p, h)); //.flatMap(uniq());
  }

  return pos.length;
}

console.log(trailheads.reduce((s, p) => s + score(p), 0));
