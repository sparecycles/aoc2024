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
function search({ x, y, d, score }) {
  if (map[y][x] === '#') {
    return false;
  }

  const key = `${x},${y}:${d}`;
  if ((cache[key] ?? Infinity) <= score) {
    return false;
  }

  if (cache[key]) {
    //console.log('optimized', { x, y, d, score, prev: cache[key] });
  }

  cache[key] = score;

  if (x === end.x && y === end.y) {
    return;
  }

  const { dx, dy } = dd(d);

  queue.push({ x: x + dx, y: y + dy, d, score: score + 1 });
  queue.push({ x, y, d: rotateccw(d), score: score + 1000 });
  queue.push({ x, y, d: rotatecw(d), score: score + 1000 });
}

queue.push({ ...reindeer, score: 0 });
while (queue.length) {
  search(queue.shift());
}

console.log(
  Math.min(
    ...[
      cache[`${end.x},${end.y}:>`],
      cache[`${end.x},${end.y}:<`],
      cache[`${end.x},${end.y}:^`],
      cache[`${end.x},${end.y}:v`],
    ].filter(Boolean),
  ),
);
