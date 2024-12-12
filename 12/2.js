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

  return score(cells, { xn, xm, yn, ym, color });
}

function score(cells, { xn, yn, color }) {
  let map = [];
  for (let { x, y } of cells) {
    (map[y - yn] ??= [])[x - xn] = true;
  }

  let p = 0;

  const step = (xx = false, xy = false, yx = false, yy = false) => {
    if (xx == yy && xx == !xy && xx == !yx) {
      return 2;
    } else if (xx == xy && xx != yy && xx != yx) {
      return 0;
    } else if (xx == yx && xx != yy && xx != xy) {
      return 0;
    } else if (xx == xy && xx == yy && yx == xx) {
      return 0;
    } else return 1;
  };

  for (let y = -1; y <= map.length + 1; y++) {
    const row = map[y] ?? [];
    const nextrow = map[y + 1] ?? [];
    for (let x = -1; x <= Math.max(row.length, nextrow.length) + 1; x++) {
      const s = step(
        map[y]?.[x],
        map[y]?.[x + 1],
        map[y + 1]?.[x],
        map[y + 1]?.[x + 1],
      );
      p += s;
    }
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
