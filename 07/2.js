import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const lines = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split(':'))
  .map(([target, nums]) => ({
    target: Number(target),
    nums: nums.trim().split(/\s+/).filter(Boolean).map(Number),
  }));

function check(target, current, ...nums) {
  if (current > target) {
    return false;
  }

  if (nums.length === 0) {
    return current === target;
  }

  return (
    checkProd(target, current, ...nums) ||
    checkCat(target, current, ...nums) ||
    checkSum(target, current, ...nums)
  );
}

function checkSum(target, current, next, ...nums) {
  return check(target, current + next, ...nums);
}
function checkProd(target, current, next, ...nums) {
  return check(target, current * next, ...nums);
}

function checkCat(target, current, next, ...nums) {
  return check(target, Number(`${current}${next}`), ...nums);
}

const result = lines
  .filter(({ target, nums }) => check(target, ...nums))
  .reduce((sum, { target }) => sum + target, 0);

console.log(result);
