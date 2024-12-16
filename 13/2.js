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
        acc.slice(-1)[0].prize = {
          x: 10000000000000 + Number(x),
          y: 10000000000000 + Number(y),
        };
      });

    return acc;
  }, []);

function cost({ A, B }) {
  return A * 3 + B;
}

function play({ a, b, prize }) {
  const B = (prize.x * a.y - prize.y * a.x) / (b.x * a.y - b.y * a.x);
  const A = (prize.x - B * b.x) / a.x;
  if (B == Math.floor(B) && A == Math.floor(A)) {
    return cost({ A, B });
  }
}

console.log(
  games
    .map(play)
    .filter(Boolean)
    .reduce((a, b) => a + b, 0),
);
