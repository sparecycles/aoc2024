import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const lines = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line)
  .reduce((acc, line) => {
    acc.push(line);
    return acc;
  }, []);

const xm = lines[0].length;
const ym = lines.length;

function find(x, y, dx, dy) {
  const xe = x + dx * 3;
  const ye = y + dy * 3;
  if (x < 0 || xe < 0 || x >= xm || xe >= xm) return false;
  if (y < 0 || ye < 0 || y >= ym || ye >= ym) return false;

  return (
    lines[y][x] === 'X' &&
    lines[y + dy][x + dx] === 'M' &&
    lines[y + dy * 2][x + dx * 2] === 'A' &&
    lines[y + dy * 3][x + dx * 3] === 'S'
  );
}

function* range(start, dx, end) {
  for (let x = start; x != end; x += dx) {
    yield x;
  }
}

function all() {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++) {
      for (let y of range(0, 1, ym)) {
        for (let x of range(0, 1, xm)) {
          if (find(x, y, dx, dy)) count++;
        }
      }
    }
  return count;
}

console.log(all());
