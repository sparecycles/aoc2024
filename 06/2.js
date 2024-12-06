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

function dir(dx, dy) {
  return dx > 0 ? '>' : dx < 0 ? '<' : dy > 0 ? 'v' : '^';
}

const steps = lines.map((line) => line.map((_) => [_]));

function searchTurn(guard, q) {
  let mylines = lines.map((line) => line.map((c) => c));
  const mysteps = steps.map((line) => line.map((_) => (q ? _.slice() : [])));

  const facing = dir(guard.dx, guard.dy);

  Object.assign(guard, { dx: -guard.dy, dy: guard.dx });

  mysteps[guard.y][guard.x].push(facing);
  mylines[guard.y][guard.x] = '%';

  while (step(guard)) {
    const facing = dir(guard.dx, guard.dy);
    if (mysteps[guard.y][guard.x].includes(facing)) {
      //if (!steps[guard.y][guard.x].includes(facing) && depth > 0)
      //  return searchTurn(guard, depth - 1);

      return mylines;
    }

    mylines[guard.y][guard.x] = '%';
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

    const next = { ...guard };
    if (step(next) && next.dx !== guard.dx) {
      return false;
    }

    return true;
    //    return step(guard);
  }

  Object.assign(guard, { x: nx, y: ny });
  return true;
}

steps[guard.y][guard.x].push(dir(guard.dx, guard.dy));

while (step(guard)) {
  const facing = dir(guard.dx, guard.dy);
  steps[guard.y][guard.x].push(facing);
  lines[guard.y][guard.x] = facing;

  let search;
  if (
    lines[guard.y + guard.dy]?.[guard.x + guard.dx] === '.' &&
    (search = searchTurn({
      ...guard,
    }))
  ) {
    const [ox, oy] = [guard.x + guard.dx, guard.y + guard.dy];
    steps[oy][ox].push('o');

    if (searchTurn({ ...guard }, true)) {
      console.log(
        count +
          '\n' +
          search
            .map((line, y) =>
              line
                .map((c, x) =>
                  x == ox && y == oy
                    ? chalk.green('o')
                    : lines[y][x] === '#'
                      ? chalk.blue(c)
                      : steps[y][x].includes('o')
                        ? chalk.red(c)
                        : c,
                )
                .join(''),
            )
            .join('\n') +
          '\n\n',
      );
      count++;
    }
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
