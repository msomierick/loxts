import { Visitor, Literal, Binary, Unary, Grouping, Expr } from "./Expr";
import TokenType from "./TokenType";

export class Interpreter implements Visitor<unknown> {
  visitLiteralExpr(expr: Literal): unknown {
    return expr.value;
  }

  visitGroupingExpr(expr: Grouping): unknown {
    return this.evaluate(expr.expression);
  }

  visitUnaryExpr(expr: Unary): unknown {
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        return -parseFloat(right as string);
      case TokenType.BANG:
        return !this.isTruthy(right);
    }
    return null;
  }

  visitBinaryExpr(expr: Binary): unknown {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.GREATER:
        return parseFloat(left as string) > parseFloat(right as string);
      case TokenType.GREATER_EQUAL:
        return parseFloat(left as string) >= parseFloat(right as string);
      case TokenType.LESS:
        return parseFloat(left as string) < parseFloat(right as string);
      case TokenType.LESS_EQUAL:
        return parseFloat(left as string) <= parseFloat(right as string);
      case TokenType.MINUS:
        return parseFloat(left as string) - parseFloat(right as string);
      case TokenType.PLUS:
        if (typeof left == "number" && typeof right == "number") {
          return left + right;
        }

        if (typeof left == "string" && typeof right == "string") {
          return left + right;
        }
        break;
      case TokenType.SLASH:
        return parseFloat(left as string) / parseFloat(right as string);
      case TokenType.STAR:
        return parseFloat(left as string) * parseFloat(right as string);
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
    }
    return null;
  }

  private evaluate(expr: Expr) {
    return expr.accept(this);
  }

  private isTruthy(value: unknown): boolean {
    if (value == null) {
      return false;
    }
    if (value instanceof Boolean) {
      return Boolean(value);
    }
    return true;
  }

  private isEqual(left: unknown, right: unknown): boolean {
    if (left == null && right == null) {
      return true;
    }
    if (left == null) {
      return false;
    }
    return left === right;
  }
}
