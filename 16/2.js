import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const map = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split(''));

function coordOf(map, target) {
  for (let y = 0; y < map.length; y++) {
    const x = map[y].findIndex((c) => c === target);
    if (x !== -1) {
      return { x, y };
    }
  }
}

let reindeer = { ...coordOf(map, 'S'), d: '>' };
const end = coordOf(map, 'E');

function dd(d) {
  switch (d) {
    case '>':
      return { dx: 1, dy: 0 };
    case '<':
      return { dx: -1, dy: 0 };
    case '^':
      return { dx: 0, dy: -1 };
    case 'v':
      return { dx: 0, dy: 1 };
  }
}

function rotateccw(d) {
  return {
    '>': '^',
    '^': '<',
    '<': 'v',
    v: '>',
  }[d];
}

function rotatecw(d) {
  return {
    '>': 'v',
    v: '<',
    '<': '^',
    '^': '>',
  }[d];
}

const cache = {};
const queue = [];
function search({ x, y, d, score, from }) {
  if (map[y][x] === '#') {
    return false;
  }

  const key = `${x},${y}:${d}`;

  if ((cache[key]?.score ?? Infinity) <= score) {
    if (cache[key].score === score) {
      cache[key].from.push(from);
    }
    return;
  }

  cache[key] = { score, from: [from] };

  if (x === end.x && y === end.y) {
    return;
  }

  const { dx, dy } = dd(d);

  queue.push({
    x: x + dx,
    y: y + dy,
    d,
    score: score + 1,
    from: key,
  });
  queue.push({ x, y, d: rotateccw(d), score: score + 1000, from: key });
  queue.push({ x, y, d: rotatecw(d), score: score + 1000, from: key });
}

queue.push({ ...reindeer, score: 0, paths: [[]], from: 'start' });

while (queue.length) {
  search(queue.shift());
}

const best = Math.min(
  ...[
    cache[`${end.x},${end.y}:>`],
    cache[`${end.x},${end.y}:<`],
    cache[`${end.x},${end.y}:^`],
    cache[`${end.x},${end.y}:v`],
  ]
    .filter(Boolean)
    .map(({ score }) => score),
);

function searchFrom(key) {
  let visited = new Set();
  let todo = [key];
  while (todo.length) {
    const from = todo.pop();
    if (visited.has(from)) {
      continue;
    }
    visited.add(from);

    todo.push(...(cache[from]?.from ?? []));
  }
  return [...visited].map((key) => key.replace(/:./, ''));
}

const seats = new Set(
  [
    cache[`${end.x},${end.y}:>`],
    cache[`${end.x},${end.y}:<`],
    cache[`${end.x},${end.y}:^`],
    cache[`${end.x},${end.y}:v`],
  ]
    .filter(Boolean)
    .filter(({ score }) => score === best)
    .flatMap(({ from }) => from.flatMap(searchFrom)),
);

if (false)
  console.log(
    map
      .map((row, y) =>
        row.map((c, x) => (seats.has(`${x},${y}`) ? 'O' : c)).join(''),
      )
      .join('\n'),
  );

console.log(seats.size);
