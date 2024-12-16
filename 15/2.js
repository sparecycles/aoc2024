import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

let { map, moves } = readFileSync(input, 'utf-8')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .reduce(
    ({ map, moves }, line) => {
      if (line.startsWith('#')) {
        map.push(
          line
            .replace(
              /[#.O@]/g,
              (match) =>
                ({
                  '#': '##',
                  '.': '..',
                  O: '[]',
                  '@': '@.',
                })[match],
            )
            .split(''),
        );
      } else {
        moves.push(line);
      }
      return { map, moves };
    },
    { map: [], moves: [] },
  );

moves = moves.join('');

function robotOf(map) {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    const x = row.findIndex((c) => c == '@');
    if (x !== -1) {
      return { x, y };
    }
  }
}

function dd(dir) {
  switch (dir) {
    case '^':
      return { dx: 0, dy: -1 };
    case '<':
      return { dx: -1, dy: 0 };
    case '>':
      return { dx: +1, dy: 0 };
    case 'v':
      return { dx: 0, dy: +1 };
  }
}

function move({ x, y }, { dx, dy }) {
  const pushes = [];
  if (push({ x, y }, { dx, dy }, pushes)) {
    pushes.push({ x, y, c: '@' });
    for (const { x, y, c } of pushes) {
      map[y + dy][x + dx] = c;
      map[y][x] = '.';
    }

    map[y + dy][x + dx] = '@';

    return { x: x + dx, y: y + dy };
  }

  return { x, y };
}

function push({ x, y }, { dx, dy }, pushes, hint) {
  const c = map[y][x];
  let next = map[y + dy][x + dx];

  if (pushes.find((p) => p.x === x && p.y === y)) {
    return true;
  }

  if (next === '.') {
    pushes.push({ x, y, c });

    if (c === '[') {
      if (!push({ x: x + 1, y }, { dx, dy }, pushes)) {
        return false;
      }
    } else if (c === ']') {
      if (!push({ x: x - 1, y }, { dx, dy }, pushes)) {
        return false;
      }
    }
    return true;
  }

  if (next === '#') {
    return false;
  }

  if (push({ x: x + dx, y: y + dy }, { dx, dy }, pushes)) {
    pushes.push({ x, y, c });
    if (dy == 0) return true;

    if (c === '[') {
      if (!push({ x: x + 1, y }, { dx, dy }, pushes)) {
        return false;
      }
    } else if (c === ']') {
      if (!push({ x: x - 1, y }, { dx, dy }, pushes)) {
        return false;
      }
    }
    return true;
  }

  return false;
}

let { x, y } = robotOf(map);
for (let dxy of [...moves].map(dd)) {
  ({ x, y } = move({ x, y }, dxy));
}
console.log(map.map((row) => row.join('')).join('\n'));

function score() {
  let score = 0;
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] == '[') score += y * 100 + x;
    }
  }
  return score;
}

console.log(score());
