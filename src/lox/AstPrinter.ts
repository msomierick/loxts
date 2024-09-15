import { Visitor, Expr, Grouping, Binary, Unary, Literal } from "./Expr.js";
import TokenType from "./TokenType.js";
import Token from "./Token.js";

export class AstPrinter implements Visitor<string> {
  print(expr: Expr): string {
    return expr.accept(this);
  }

  visitBinaryExpr(expr: Binary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr: Grouping): string {
    return this.parenthesize("group", expr.expression);
  }

  visitLiteralExpr(expr: Literal): string {
    if (expr.value === null || expr.value === undefined) return "nil";
    return expr.value.toString();
  }

  visitUnaryExpr(expr: Unary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    let builder = `(${name}`;
    for (const expr of exprs) {
      builder += " ";
      builder += expr.accept(this);
    }
    builder += ")";
    return builder;
  }

  public static main(): void {
    const expression: Expr = new Binary(
      new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(123)),
      new Token(TokenType.STAR, "*", null, 1),
      new Grouping(new Literal(45.67))
    );

    console.log(new AstPrinter().print(expression));
  }
}
