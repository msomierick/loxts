import TokenType from "./TokenType";

export default class Token {
  type: TokenType;
  lexeme: string;
  literal: unknown;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: unknown, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  public toString(): string {
    const literal = this.literal ? " " + this.literal : "";
    return this.type + " " + this.lexeme + literal;
  }
}
