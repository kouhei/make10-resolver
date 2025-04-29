#!/usr/bin/env ts-node

/**
 * solveNumbers: 与えられた数値列から指定の目標値を作る式を探索する関数
 * @param nums 数値の配列
 * @param target 目標値
 * @returns 解の文字列（例: "(1+8)*(8-6)"）または null
 */
export function solveNumbers(nums: number[], target: number): string | null {
  const ops = [
    { sym: '+', fn: (a: number, b: number) => a + b },
    { sym: '-', fn: (a: number, b: number) => a - b },
    { sym: '*', fn: (a: number, b: number) => a * b },
    { sym: '/', fn: (a: number, b: number) => (b !== 0 ? a / b : NaN) },
  ];

  type Item = { value: number; expr: string };

  function helper(items: Item[]): string | null {
    if (items.length === 1) {
      return Math.abs(items[0].value - target) < 1e-6 ? items[0].expr : null;
    }
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];
        const rest = items.filter((_, idx) => idx !== i && idx !== j);
        for (const op of ops) {
          // a op b
          const r1 = op.fn(a.value, b.value);
          if (!isNaN(r1)) {
            const expr1 = `(${a.expr}${op.sym}${b.expr})`;
            const sol1 = helper([...rest, { value: r1, expr: expr1 }]);
            if (sol1) return sol1;
          }
          // b op a（非可換演算）
          if (op.sym === '-' || op.sym === '/') {
            const r2 = op.fn(b.value, a.value);
            if (!isNaN(r2)) {
              const expr2 = `(${b.expr}${op.sym}${a.expr})`;
              const sol2 = helper([...rest, { value: r2, expr: expr2 }]);
              if (sol2) return sol2;
            }
          }
        }
      }
    }
    return null;
  }

  const initialItems: Item[] = nums.map(n => ({ value: n, expr: n.toString() }));
  return helper(initialItems);
}

// コマンドライン実行時のラッパー
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: ts-node src/index.ts <target> <num1> <num2> ...");
    process.exit(1);
  }
  const target = parseFloat(args[0]);
  const nums = args.slice(1).map(n => parseFloat(n));
  const sol = solveNumbers(nums, target);
  if (sol) {
    console.log(`Solution: ${sol} = ${target}`);
  } else {
    console.log('No solution found.');
  }
}
