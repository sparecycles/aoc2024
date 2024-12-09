import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const encoded = readFileSync(input, 'utf-8').trim();

let free = 0;
let ending = 0;
const rle = [];
[...encoded].map((c, i) => {
  const len = Number(c);
  if (i & 1) {
    rle.push({ len });
    free += len;
    ending += len;
  } else {
    rle.push({ id: i >> 1, len });
    ending = 0;
  }
});

free -= ending;
let cursor = 0;
let compact = [[]];

let end = rle.pop();
while (free > 0) {
  const used = rle[cursor * 2 + 1]
    ? Math.min(end.len, rle[cursor * 2 + 1].len)
    : end.len;
  const remaining = end.len - used;

  if (used > 0) {
    compact[cursor].push({ len: used, id: end.id });
    if (rle[cursor * 2 + 1]) rle[cursor * 2 + 1].len -= used;
    end.len -= used;
    free -= used;
  }

  if (remaining == 0) {
    free -= rle.pop().len;
    if (free > 0) end = rle.pop();
  } else {
    cursor++;
    compact.push([]);
  }
}

if (end.len) {
  compact[cursor].push(end);
}

function display() {
  return (
    rle
      .map((x, i) =>
        i & 1
          ? (compact[i >> 1] ?? [])
              .map(({ id, len }) => `${id}`.repeat(len))
              .join('')
          : `${x.id}`.repeat(x.len),
      )
      .join('') +
    compact
      .slice(rle.length >> 1)
      .map((chunk) => chunk.map(({ id, len }) => `${id}`.repeat(len)).join(''))
      .join('')
  );
}

function checksum() {
  let sum = 0n;
  let idx = 0;
  rle.map(({ id, len }, i) => {
    if (i & 1) {
      (compact[i >> 1] ?? []).map(({ id, len }) => {
        while (len-- > 0) {
          sum += BigInt(idx++ * id);
        }
      });
    } else {
      while (len-- > 0) {
        sum += BigInt(idx++ * id);
      }
    }
  });

  compact.slice(rle.length >> 1).map((chunk) =>
    chunk.map(({ id, len }) => {
      while (len-- > 0) {
        sum += BigInt(idx++ * id);
      }
    }),
  );

  return sum;
}

console.log(String(checksum()));
