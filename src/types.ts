/**
 * 演算子の型定義
 */
export type Operator = '+' | '-' | '*' | '/';

/**
 * 式の型定義
 */
export interface Expression {
  /**
   * 式の文字列表現
   */
  formula: string;

  /**
   * 式の評価結果
   */
  result: number;
}

/**
 * 解の型定義
 */
export interface Solution {
  /**
   * 解の式
   */
  expression: Expression;

  /**
   * 使用した数字
   */
  numbers: number[];
}
