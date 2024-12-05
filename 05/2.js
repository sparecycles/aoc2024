import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const { rules, updates } = readFileSync(input, 'utf-8')
  .split('\n')
  .map((line) => line)
  .reduce(
    ({ rules, updates, updating }, line) => {
      if (line.length == 0) {
        updating = true;
      } else if (!updating) {
        rules.push(line.split('|'));
      } else {
        updates.push(line.split(','));
      }
      return { rules, updates, updating };
    },
    { rules: [], updates: [], updating: false },
  );

console.log({ rules, updates });

const { before } = rules.reduce(
  ({ before }, [a, b]) => {
    (before[b] ??= []).push(a);
    return { before };
  },
  { before: {} },
);

function isSorted(update) {
  return update.every((p, i) => {
    return update.slice(i + 1).every((q) => !before[p]?.includes(q));
  });
}

const unsorted = updates.filter((update) => !isSorted(update));

function sortUpdates(unsorted) {
  //let sorted = [];
  return unsorted.sort((a, b) => {
    if (before[a]?.includes(b)) {
      return -1;
    } else if (before[b]?.includes(a)) {
      return 1;
    }
    return 0;
  });

  //return sorted;
}

let sorted = unsorted.map(sortUpdates);
const sum = sorted
  .map((update) => update[(update.length - 1) / 2])
  .reduce((a, b) => a + Number(b), 0);

console.log(sorted.join('\n') + '\n---\n' + sum);
