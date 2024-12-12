import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

let nums = readFileSync(input, 'utf-8')
  .trim()
  .split(/\s+/)
  .reduce((map, n) => Object.assign(map, { [n]: (map[n] ?? 0n) + 1n }), {});

function blink(nums) {
  return Object.entries(nums)
    .map(([n, c]) => {
      if (n == '0') return { 1: c };
      if ((n.length & 1) === 0) {
        const l = n.slice(0, n.length >> 1);
        const r = String(BigInt(n.slice(n.length >> 1)));
        if (l === r) {
          return { [l]: 2n * c };
        }

        return {
          [l]: c,
          [r]: c,
        };
      }
      return { [BigInt(n) * 2024n]: c };
    }, {})
    .reduce(
      (map, entries) =>
        Object.entries(entries).reduce(
          (map, [k, v]) => Object.assign(map, { [k]: (map[k] ?? 0n) + v }),
          map,
        ),
      {},
    );
}

for (let i = 0; i < 75; i++) {
  nums = blink(nums);
}

console.log(String(Object.values(nums).reduce((a, b) => a + b, 0n)));
