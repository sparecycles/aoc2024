import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const lines = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split(''));

function flood(x, y) {
  const color = lines[y][x];
  if (!color) return 0;

  const cells = [{ x, y }];
  const boundary = [{ x, y }];
  lines[y][x] = null;

  let xm = x;
  let xn = x;
  let ym = y;
  let yn = y;

  while (boundary.length) {
    const { x: bx, y: by } = boundary.shift();
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++) {
        if (!dx == !dy) continue;

        const x = bx + dx;
        const y = by + dy;
        if (lines[y]?.[x] === color) {
          lines[y][x] = null;
          cells.push({ x, y });
          boundary.push({ x, y });
          xm = Math.max(xm, x);
          xn = Math.min(xn, x);
          ym = Math.max(ym, y);
          yn = Math.min(yn, y);
        }
      }
  }

  return score(cells, { xn, xm, yn, ym });
}

function score(cells, { xn, yn, xm }) {
  let map = [];
  for (let { x, y } of cells) {
    (map[y - yn] ??= [])[x - xn] = true;
  }

  let p = 0;
  let inside = false;
  const step = (tile = false) => {
    if (inside !== tile) {
      inside = tile;
      p++;
    }
  };

  for (let y = 0; y <= map.length; y++) {
    const row = map[y] ?? [];
    for (let x = 0; x < row.length; x++) {
      step(map[y][x]);
    }
    step(false);
  }

  for (let x = 0; x <= xm - xn; x++) {
    for (let y = 0; y < map.length; y++) {
      step(map[y][x]);
    }
    step(false);
  }

  return p * cells.length;
}

function* range(n, m) {
  for (let i = n; i < m; i++) {
    yield i;
  }
}

const total = [...range(0, lines.length)]
  .flatMap((y) => [...range(0, lines[0].length)].map((x) => ({ x, y })))
  .reduce((sum, { x, y }) => sum + flood(x, y), 0);

console.log(total);
