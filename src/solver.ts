import { Operator, Expression, Solution } from './types';

/**
 * 数字の順列を生成する
 * @param numbers 数字の配列
 * @returns 数字の順列の配列
 */
export function generatePermutations(numbers: number[]): number[][] {
  if (numbers.length <= 1) {
    return [numbers];
  }

  const result: number[][] = [];

  for (let i = 0; i < numbers.length; i++) {
    const current = numbers[i];
    const remaining = [...numbers.slice(0, i), ...numbers.slice(i + 1)];
    const permutations = generatePermutations(remaining);

    for (const perm of permutations) {
      result.push([current, ...perm]);
    }
  }

  return result;
}

/**
 * 演算子の組み合わせを生成する
 * @param length 必要な演算子の数
 * @returns 演算子の組み合わせの配列
 */
export function generateOperatorCombinations(length: number): Operator[][] {
  const operators: Operator[] = ['+', '-', '*', '/'];
  const result: Operator[][] = [];

  function generate(current: Operator[], depth: number): void {
    if (depth === 0) {
      result.push([...current]);
      return;
    }

    for (const op of operators) {
      current.push(op);
      generate(current, depth - 1);
      current.pop();
    }
  }

  generate([], length);
  return result;
}

/**
 * 式を評価する
 * @param numbers 数字の配列
 * @param operators 演算子の配列
 * @param bracketPattern 括弧のパターン（0: 括弧なし, 1: (a op b) op c op d, 2: a op (b op c) op d, 3: a op b op (c op d)）
 * @returns 式と評価結果
 */
export function evaluateExpression(
  numbers: number[],
  operators: Operator[],
  bracketPattern: number
): Expression | null {
  // 数字が4つ、演算子が3つであることを確認
  if (numbers.length !== 4 || operators.length !== 3) {
    return null;
  }

  let formula = '';
  let result = 0;

  try {
    switch (bracketPattern) {
      case 0: // 括弧なし（左から順に計算）
        result = numbers[0];
        formula = `${numbers[0]}`;

        for (let i = 0; i < operators.length; i++) {
          formula += ` ${operators[i]} ${numbers[i + 1]}`;
          result = calculate(result, numbers[i + 1], operators[i]);
        }
        break;

      case 1: // (a op b) op c op d
        {
          const temp = calculate(numbers[0], numbers[1], operators[0]);
          formula = `(${numbers[0]} ${operators[0]} ${numbers[1]})`;

          const temp2 = calculate(temp, numbers[2], operators[1]);
          formula += ` ${operators[1]} ${numbers[2]}`;

          result = calculate(temp2, numbers[3], operators[2]);
          formula += ` ${operators[2]} ${numbers[3]}`;
        }
        break;

      case 2: // a op (b op c) op d
        {
          const temp = calculate(numbers[1], numbers[2], operators[1]);
          const tempFormula = `(${numbers[1]} ${operators[1]} ${numbers[2]})`;

          const temp2 = calculate(numbers[0], temp, operators[0]);
          formula = `${numbers[0]} ${operators[0]} ${tempFormula}`;

          result = calculate(temp2, numbers[3], operators[2]);
          formula += ` ${operators[2]} ${numbers[3]}`;
        }
        break;

      case 3: // a op b op (c op d)
        {
          const temp = calculate(numbers[2], numbers[3], operators[2]);
          const tempFormula = `(${numbers[2]} ${operators[2]} ${numbers[3]})`;

          const temp2 = calculate(numbers[1], temp, operators[1]);
          formula = `${numbers[0]} ${operators[0]} ${numbers[1]} ${operators[1]} ${tempFormula}`;

          result = calculate(numbers[0], temp2, operators[0]);
        }
        break;

      default:
        return null;
    }

    // 結果が整数かどうかを確認（浮動小数点の誤差を考慮）
    if (Math.abs(result - Math.round(result)) < 1e-10) {
      result = Math.round(result);
    }

    return { formula, result };
  } catch (error) {
    // 0で割るなどの例外が発生した場合はnullを返す
    return null;
  }
}

/**
 * 二項演算を実行する
 * @param a 左辺
 * @param b 右辺
 * @param operator 演算子
 * @returns 計算結果
 */
function calculate(a: number, b: number, operator: Operator): number {
  switch (operator) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

/**
 * make10パズルを解く
 * @param numbers 数字の配列
 * @param target 目標の数値（デフォルトは10）
 * @returns 解が見つかった場合はSolutionオブジェクト、見つからない場合はnull
 */
export function solveMake10(numbers: number[], target: number = 10): Solution | null {
  // 数字の順列を生成
  const permutations = generatePermutations(numbers);

  // 演算子の組み合わせを生成
  const operatorCombinations = generateOperatorCombinations(3);

  // 括弧のパターン（0: 括弧なし, 1: (a op b) op c op d, 2: a op (b op c) op d, 3: a op b op (c op d)）
  const bracketPatterns = [0, 1, 2, 3];

  // すべての組み合わせを試す
  for (const perm of permutations) {
    for (const ops of operatorCombinations) {
      for (const pattern of bracketPatterns) {
        const expression = evaluateExpression(perm, ops, pattern);

        if (expression && Math.abs(expression.result - target) < 1e-10) {
          return {
            expression,
            numbers: perm
          };
        }
      }
    }
  }

  // 解が見つからなかった場合
  return null;
}
