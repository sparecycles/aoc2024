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

function find(x, y) {
  const xs = x - 1;
  const ys = y - 1;
  const xe = x + 1;
  const ye = y + 1;
  if (xs < 0 || xe < 0 || xs >= xm || xe >= xm) return false;
  if (ys < 0 || ye < 0 || ys >= ym || ye >= ym) return false;

  if (lines[y][x] != 'A') return false;

  for (let p of ['S', 'M']) {
    const q = { S: 'M', M: 'S' }[p];
    if (lines[y + 1][x + 1] === p) {
      if (lines[y - 1][x + 1] === p) {
        return lines[y - 1][x - 1] === q && lines[y + 1][x - 1] === q;
      }
    }

    if (lines[y + 1][x - 1] === p) {
      if (lines[y + 1][x + 1] === p) {
        return lines[y - 1][x + 1] === q && lines[y - 1][x - 1] === q;
      }
    }
  }
}

function* range(start, dx, end) {
  for (let x = start; x != end; x += dx) {
    yield x;
  }
}

function all() {
  let count = 0;
  for (let y of range(0, 1, ym)) {
    for (let x of range(0, 1, xm)) {
      if (find(x, y)) count++;
    }
  }
  return count;
}

console.log(all());
