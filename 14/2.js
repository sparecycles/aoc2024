import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const lines = readFileSync(input, 'utf-8').split('\n').filter(Boolean);

let width;
let height;
lines.shift().replace(/(\d+)x(\d+)/, (_, w, h) => {
  width = Number(w);
  height = Number(h);
});

let bots = lines
  .map((line) => line)
  .reduce((acc, line) => {
    const [, px, py, vx, vy] = /p=(\d+),(\d+)\s+v=([+-]?\d+),([+-]?\d+)/.exec(
      line,
    );
    acc.push({
      p: { x: Number(px), y: Number(py) },
      v: { x: Number(vx), y: Number(vy) },
    });
    return acc;
  }, []);

function move({ p, v }, steps = 1) {
  return {
    p: {
      x: (width + ((p.x + v.x * steps) % width)) % width,
      y: (height + ((p.y + v.y * steps) % height)) % height,
    },
    v,
  };
}

let maxscore = 0;
function score(bots, steps) {
  bots = bots.map((bot) => move(bot, steps));
  let score = 0;

  const map = ('.'.repeat(width) + '\n')
    .repeat(height)
    .trim()
    .split('\n')
    .map((s) => s.split(''));
  for (const {
    p: { x, y },
  } of bots) {
    map[y][x] = '#';

    score += (Math.abs(x - (width - 1) / 2) + 5) / (y + 5);
  }

  score = 1 / score;

  if (score > maxscore) {
    maxscore = score;

    console.log('n=' + steps + ` (${score})`);
    console.log(map.map((line) => line.join('')).join('\n'));
    return true;
  }
}

for (let i = 0; i < width * height * width * height; i++) {
  score(bots, i);
}

console.log(score(bots));
