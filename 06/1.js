import chalk from 'chalk';
import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const lines = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split(''))
  .reduce((acc, line) => {
    acc.push(line);
    return acc;
  }, []);

const guard = { dx: 0, dy: -1 };

lines.map((line, y) => {
  const x = line.indexOf('^');
  if (x !== -1) {
    Object.assign(guard, { x, y });
  }
});

const ym = lines.length;
const xm = lines[0].length;
let count = 1;
function step() {
  let nx = guard.x + guard.dx;
  let ny = guard.y + guard.dy;

  if (nx < 0 || nx >= xm) {
    return false;
  }
  if (ny < 0 || ny >= ym) {
    return false;
  }

  if (lines[ny][nx] === '#') {
    Object.assign(guard, {
      dx: -guard.dy,
      dy: guard.dx,
    });

    return step();
  }

  if (lines[guard.y][guard.x] !== 'X') {
    count++;
  }
  lines[guard.y][guard.x] = 'X';
  Object.assign(guard, { x: nx, y: ny });
  return true;
}

while (step()) {}

console.log(lines.map((line) => line.join('')).join('\n'));
console.log(count);
