import { Chalk } from 'chalk';
import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const chalk = new Chalk({ level: 2 });

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

function dir(dx, dy) {
  return dx > 0 ? '>' : dx < 0 ? '<' : dy > 0 ? 'v' : '^';
}

const steps = lines.map((line) => line.map((_) => [_]));

function searchBlocker(guard) {
  const mysteps = steps.map((line) => line.map((_) => []));

  const facing = dir(guard.dx, guard.dy);

  mysteps[guard.y][guard.x].push(facing);

  while (step(guard)) {
    const facing = dir(guard.dx, guard.dy);
    if (mysteps[guard.y][guard.x].includes(facing)) {
      return true;
    }

    mysteps[guard.y][guard.x].push(facing);
  }
}

let count = 0;
function step(guard) {
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

    return true;
  }

  Object.assign(guard, { x: nx, y: ny });
  return true;
}

while (step(guard)) {
  const facing = dir(guard.dx, guard.dy);
  steps[guard.y][guard.x].push(facing);
  lines[guard.y][guard.x] = facing;

  const [ox, oy] = [guard.x + guard.dx, guard.y + guard.dy];
  if (lines[oy]?.[ox] === '.') {
    lines[oy][ox] = '#';

    if (
      searchBlocker({
        ...guard,
      })
    ) {
      steps[oy][ox].push('o');
      count++;
    }

    lines[oy][ox] = '.';
  }
}

console.log(
  lines
    .map((line, y) =>
      line
        .map((c, x) =>
          lines[y][x] === '#'
            ? chalk.blue(c)
            : steps[y][x].includes('o')
              ? chalk.red(c)
              : c,
        )
        .join(''),
    )
    .join('\n'),
);
console.log(count);
