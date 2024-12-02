import { readFileSync } from 'node:fs';

const [l, r] = readFileSync('./input', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split(/\s+/).map(Number))
  .reduce(
    ([l, r], [a, b]) => {
      l.push(a);
      r[b] ??= 0;
      r[b]++;
      return [l, r];
    },
    [[], {}],
  );

console.log(l.reduce((t, a) => t + a * (r[a] ?? 0), 0));
