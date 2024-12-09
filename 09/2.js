import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const encoded = readFileSync(input, 'utf-8').trim();

const chunks = [];
const freechunks = [];
[...encoded].map((c, i) => {
  const len = Number(c);
  if (i & 1) {
    const freechunk = { len, chunks: [] };
    chunks.push(freechunk);
    freechunks.push(freechunk);
  } else {
    chunks.push({ id: i >> 1, len });
  }
});

for (let target = chunks.length - 1; target >= 0; target--) {
  const current = chunks[target];
  if (current.chunks) continue;

  for (let friend = 0; friend < target >> 1; friend++) {
    const freechunk = freechunks[friend];

    if (freechunk.len >= current.len) {
      freechunk.chunks.push({ ...current });
      freechunk.len -= current.len;
      delete current.id;
      break;
    }
  }
}

function display() {
  return chunks
    .map(({ id, chunks, len }) => {
      if (chunks) {
        const text = chunks.map(({ id, len }) => `${id}`.repeat(len)).join('');
        const dots = '.'.repeat(len);

        return text + dots;
      }
      return String(id ?? '.').repeat(len);
    })
    .join('');
}

function checksum() {
  let sum = 0n;
  let index = 0;

  chunks.map(({ id, chunks, len }) => {
    if (chunks) {
      chunks.map(({ id, len }) => {
        while (len--) {
          sum += BigInt(index++ * id);
        }
      });
      index += len;
      return;
    }

    if (typeof id === 'number') {
      while (len--) {
        sum += BigInt(index++ * id);
      }
    } else {
      index += len;
    }
  });

  return sum;
}

console.log(String(checksum()));
