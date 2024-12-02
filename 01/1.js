import { readFileSync } from 'node:fs';

const [l, r] = readFileSync('./input', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split(/\s+/).map(Number))
  .reduce(
    ([l, r], [a, b]) => {
      l.push(a);
      r.push(b);
      return [l, r];
    },
    [[], []],
  );

l.sort((a, b) => b - a);
r.sort((a, b) => b - a);

console.log(l.reduce((t, a, i) => t + Math.abs(r[i] - a), 0));
