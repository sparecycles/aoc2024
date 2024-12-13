import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const games = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line)
  .reduce((acc, line) => {
    line
      .replace(/Button A: X[+](\d+), Y[+](\d+)/, (match, x, y) => {
        acc.push({ a: { x: Number(x), y: Number(y) } });
      })
      .replace(/Button B: X[+](\d+), Y[+](\d+)/, (match, x, y) => {
        acc.slice(-1)[0].b = { x: Number(x), y: Number(y) };
      })
      .replace(/Prize: X=(\d+), Y=(\d+)/, (match, x, y) => {
        acc.slice(-1)[0].prize = { x: Number(x), y: Number(y) };
      });

    return acc;
  }, []);

function cost({ A, B }) {
  return A * 3 + B;
}

function play({ a, b, prize }) {
  let best = null;
  for (let A = 0; A < 100; A++) {
    if ((prize.x - a.x * A) % b.x == 0) {
      let B = (prize.x - a.x * A) / b.x;
      if (B > 100) {
        continue;
      }
      if (a.y * A + b.y * B == prize.y) {
        if (!best || cost(best) > cost({ A, B })) best = { A, B };
      }
    }
  }
  return best;
}

console.log(
  games
    .map(play)
    .filter(Boolean)
    .map(cost)
    .reduce((a, b) => a + b, 0),
);
