import { Token, TokenType } from "./Scanner";

export class Expression {}

export class Parser {
  private readonly tokens: Array<Token>;
  private current: number;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse(): Expression | undefined {
    while (!this.isAtEnd()) {
      return this.chain();
    }
    this.consume(TokenType.EOF, "Expected an EOF token");
  }

  // smiles ::= chain*
  // Chain ::= BranchedAtom | Bond BranchedAtom | Dot BranchedAtom
  private chain(): Expression | undefined {
    if (this.match(TokenType.BOND)) {
      this.consume(TokenType.BOND);
    }
    if (this.match(TokenType.DOT)) {
      this.consume(TokenType.DOT);
    }
    return this.branchedAtom();
  }

  //BranchedAtom ::= Atom Ringbond* Branch*
  private branchedAtom(): Expression | undefined {
    this.atom();

    while (this.match(TokenType.RING_NUMBER)) {
      this.ringBond();
    }
    while (this.match(TokenType.BRANCH_START)) {
      this.branch();
    }
    return;
  }

  // BracketAtom | AliphaticOrganic | AromaticOrganic | "*"
  private atom() {
    if (this.match(TokenType.BRACKET_START)) {
      this.bracketAtom();
    }
    this.consume(TokenType.SYMBOL, "Expected an element symbol");
  }

  // Ringbond ::= Bond? DIGIT | Bond? "%" NUMBER
  private ringBond() {
    if (this.match(TokenType.BOND)) {
      this.consume(TokenType.BOND);
      this.consume(TokenType.RING_NUMBER, "Expected a ring number");
    }
  }

  // Branch ::= "(" Chain* ")"
  private branch() {
    this.consume(TokenType.BRANCH_START, "Expected a branch start");

    while (!this.match(TokenType.BRACKET_END)) {
      this.chain();
    }

    this.consume(TokenType.BRANCH_END, "Expected a branch end");
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  // "[" Isotope? Symbol Chiral? HydrogenCount? Charge? Class? "]"
  private bracketAtom() {
    this.consume(TokenType.BRACKET_START, "Expected a branch start");

    if (this.match(TokenType.ISOTOPE)) {
      this.consume(TokenType.ISOTOPE);
    }

    this.consume(TokenType.BRACKET_START, "Expected an element symbol");

    if (this.match(TokenType.CHIRALITY)) {
      this.consume(TokenType.CHIRALITY);
    }

    if (this.match(TokenType.HCOUNT)) {
      this.consume(TokenType.HCOUNT);
    }

    if (this.match(TokenType.CHARGE)) {
      this.consume(TokenType.CHARGE);
    }

    if (this.match(TokenType.CLASS)) {
      this.consume(TokenType.CLASS);
    }
  }

  private match(...types: Array<TokenType>): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) {
      return false;
    }
    return this.peek().type == type;
  }

  private isAtEnd(): boolean {
    return this.peek().type == TokenType.EOF;
  }

  private advance() {
    if (!this.isAtEnd()) {
      return this.current++;
    }
    return this.previous();
  }

  private previous() {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, message?: string) {
    if (this.check(type)) {
      return this.advance();
    }
    throw this.error(this.peek(), message || "Error occured");
  }

  private error(token: Token, message: string) {
    console.log(token);
    return new Error(message);
  }
}
