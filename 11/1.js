import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

let nums = readFileSync(input, 'utf-8').trim().split(/\s+/);

function blink(nums) {
  return nums.flatMap((n) => {
    if (n == '0') return [`1`];
    if ((n.length & 1) === 0) {
      return [
        n.slice(0, n.length >> 1),
        String(BigInt(n.slice(n.length >> 1))),
      ];
    }
    return [String(BigInt(n) * 2024n)];
  });
}

for (let i = 0; i < 25; i++) {
  nums = blink(nums);
}
console.log(nums.length);
