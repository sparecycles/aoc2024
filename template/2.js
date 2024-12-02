import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : arg ?? './sample';

const lines = readFileSync(input, "utf-8")
  .split('\n')
  .filter(Boolean)
  .map(line => line)
  .reduce((acc, line) => {
    acc.push(line);
    return acc;
  }, []);

console.log(lines);
