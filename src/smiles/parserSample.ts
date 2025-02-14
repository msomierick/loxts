interface Token {
  type: TokenType;
  value: string;
}

class SMILESParser {
  private tokens: Token[];
  private currentIndex: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.currentIndex = 0;
  }

  // Peek at the current token without consuming it
  private peek(): Token {
    return this.tokens[this.currentIndex];
  }

  // Consume and return the current token
  private consume(): Token {
    return this.tokens[this.currentIndex++];
  }

  // Check if the current token matches the expected type
  private match(type: TokenType): boolean {
    return this.peek().type === type;
  }

  // Expect a specific token type, throw error if not found
  private expect(type: TokenType): Token {
    if (!this.match(type)) {
      throw new Error(`Expected token type ${type}, found ${this.peek().type}`);
    }
    return this.consume();
  }

  // Main parsing method
  parse(): void {
    while (!this.match(TokenType.EOF)) {
      this.parseChain();
    }
    this.expect(TokenType.EOF);
  }

  // Parse a chain of atoms
  private parseChain(): void {
    // Handle optional bond or dot at the start of chain
    if (this.match(TokenType.BOND)) {
      this.consume(); // Consume bond
    }
    if (this.match(TokenType.DOT)) {
      this.consume(); // Consume dot
    }

    // Parse the branched atom
    this.parseBranchedAtom();
  }

  // Parse a branched atom
  private parseBranchedAtom(): void {
    // Parse the base atom
    this.parseAtom();

    // Parse any ringbonds
    while (
      this.match(TokenType.RING_NUMBER) ||
      (this.match(TokenType.BOND) &&
        this.tokens[this.currentIndex + 1].type === TokenType.RING_NUMBER)
    ) {
      this.parseRingbond();
    }

    // Parse any branches
    while (this.match(TokenType.BRANCH_START)) {
      this.parseBranch();
    }
  }

  // Parse a branch
  private parseBranch(): void {
    this.expect(TokenType.BRANCH_START); // Consume '('

    // Parse zero or more chains within the branch
    while (!this.match(TokenType.BRANCH_END)) {
      this.parseChain();
    }

    this.expect(TokenType.BRANCH_END); // Consume ')'
  }

  // Parse an atom
  private parseAtom(): void {
    if (this.match(TokenType.BRACKET_START)) {
      this.parseBracketAtom();
    } else if (this.match(TokenType.SYMBOL)) {
      const symbol = this.consume();
      // Check if it's an aliphatic or aromatic organic symbol
      const validAliphaticSymbols = [
        "Br",
        "B",
        "Cl",
        "C",
        "N",
        "O",
        "S",
        "P",
        "F",
        "I",
      ];
      const validAromaticSymbols = ["b", "c", "n", "o", "s", "p"];

      if (
        !validAliphaticSymbols.includes(symbol.value) &&
        !validAromaticSymbols.includes(symbol.value) &&
        symbol.value !== "*"
      ) {
        throw new Error(`Invalid atom symbol: ${symbol.value}`);
      }
    } else {
      throw new Error(
        `Unexpected token when parsing atom: ${this.peek().type}`
      );
    }
  }

  // Parse a bracket atom
  private parseBracketAtom(): void {
    this.expect(TokenType.BRACKET_START);

    // Optional isotope
    if (this.match(TokenType.ISOTOPE)) {
      this.consume();
    }

    // Symbol is required
    this.expect(TokenType.SYMBOL);

    // Optional chirality
    if (this.match(TokenType.CHIRALITY)) {
      this.consume();
    }

    // Optional hydrogen count
    if (this.match(TokenType.HCOUNT)) {
      this.consume();
    }

    // Optional charge
    if (this.match(TokenType.CHARGE)) {
      this.consume();
    }

    // Optional class
    if (this.match(TokenType.CLASS)) {
      this.consume();
    }

    this.expect(TokenType.BRACKET_END);
  }

  // Parse a ringbond
  private parseRingbond(): void {
    // Optional bond
    if (this.match(TokenType.BOND)) {
      this.consume();
    }

    // Ring number (either single digit or two-digit)
    if (this.match(TokenType.RING_NUMBER)) {
      this.consume();
    } else {
      throw new Error("Expected ring number");
    }
  }
}

export default SMILESParser;
