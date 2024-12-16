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
    console.log({ px, py, vx, vy });
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

bots = bots.map((b) => move(b, 100));

function score(bots) {
  const counts = [0, 0, 0, 0];
  for (const {
    p: { x, y },
  } of bots) {
    //console.log({ x, y, width, height });
    if (x == (width - 1) / 2 || y == (height - 1) / 2) {
      console.log({ x, y });
      continue;
    }

    const quad = (x > width / 2 ? 1 : 0) + (y > height / 2 ? 2 : 0);
    console.log({ x, y }, quad);
    counts[quad]++;
  }

  console.log(counts);
  return counts.reduce((p, c) => p * c, 1);
}

console.log(score(bots));
