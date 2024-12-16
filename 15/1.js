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
        map.push(line.split(''));
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
  //  console.log('move', { x, y }, { dx, dy });

  if (push({ x, y }, { dx, dy })) {
    map[y][x] = '.';
    //    console.log('moved!', { dx, dy });
    return { x: x + dx, y: y + dy };
  }

  // console.log('stuck!', { dx, dy });

  return { x, y };
}

function push({ x, y }, { dx, dy }) {
  if (map[y + dy][x + dx] === '.') {
    map[y + dy][x + dx] = map[y][x];
    return true;
  }

  if (map[y + dy][x + dx] == 'O') {
    if (push({ x: x + dx, y: y + dy }, { dx, dy })) {
      map[y + dy][x + dx] = map[y][x];
      return true;
    }
  }

  return false;
}

function score() {
  let score = 0;
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] == 'O') score += y * 100 + x;
    }
  }
  return score;
}

let { x, y } = robotOf(map);
for (let dxy of [...moves].map(dd)) {
  ({ x, y } = move({ x, y }, dxy));
}

console.log(score());
