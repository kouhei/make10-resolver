import { strict as assert } from 'assert';
import { solveNumbers } from './index';

/**
 * テストケースを定義
 */
const cases: { nums: number[]; target: number; expectFound: boolean }[] = [
  { nums: [1, 6, 8, 8], target: 18, expectFound: true },
  { nums: [13, 1, 6, 8, 8], target: 13, expectFound: true },
  { nums: [16, 1, 2, 2, 6, 7, 9], target: 16, expectFound: true },
  { nums: [1, 2, 3, 4], target: 100, expectFound: false },
];

for (const { nums, target, expectFound } of cases) {
  const sol = solveNumbers(nums, target);
  if (expectFound) {
    assert(sol !== null, `Expected solution for target ${target} with nums ${nums}, but got null`);
    // 解の文字列を eval して値を検証
    // eslint-disable-next-line no-eval
    const val = eval(sol!);
    assert(Math.abs(val - target) < 1e-6,
      `Solution expression "${sol}" evaluated to ${val}, expected ${target}`);
  } else {
    assert(sol === null,
      `Expected no solution for target ${target} with nums ${nums}, but got "${sol}"`);
  }
}

console.log('All tests passed.');
