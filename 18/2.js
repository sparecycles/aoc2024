import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');
const [sizeline, ...lines] = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean);

const blocks = lines.map((line) => line.split(',').map(Number));

const [, w, h] = /(\d+)x(\d+)@(\d+)/.exec(sizeline).map(Number);

const map = {};

blocks.forEach(([x, y], i) => {
  map[`${x},${y}`] ??= i;
});

function reachable(t) {
  const visited = {};
  function search({ x, y, s = 0 }, t) {
    if (x < 0 || y < 0 || x >= w || y >= h) {
      return false;
    }

    const key = `${x},${y}`;
    if ((map[key] ?? Infinity) <= t) {
      return false;
    }

    const v = visited[key];

    if ((v ?? Infinity) <= s) {
      return false;
    }

    visited[key] = s;

    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++) {
        if (!dx == !dy) continue;

        search({ x: x + dx, y: y + dy, s: s + 1 }, t);
      }
  }
  search({ x: 0, y: 0 }, t - 1);

  return visited[`${w - 1},${h - 1}`];
}

let min = 1,
  max = blocks.length + 1,
  t = (max + min + 1) >> 1;
for (; max > min; t = (max + min + 1) >> 1) {
  if (reachable(t)) {
    console.log('reachable, min = ' + t);
    min = t;
  } else {
    console.log('!reachable, max = ' + (t - 1));
    max = t - 1;
  }
}

console.log(t + 1, blocks[t].join(','));
