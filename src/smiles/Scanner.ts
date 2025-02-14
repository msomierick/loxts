export enum TokenType {
  SYMBOL = "SYMBOL",
  BOND = "BOND",
  BRANCH_START = "BRANCH_START",
  BRANCH_END = "BRANCH_END",
  BRACKET_START = "BRACKET_START",
  BRACKET_END = "BRACKET_END",
  RING_NUMBER = "RING_NUMBER",
  ISOTOPE = "ISOTOPE",
  CHIRALITY = "CHIRALITY",
  HCOUNT = "HCOUNT",
  CHARGE = "CHARGE",
  CLASS = "CLASS",
  EOF = "EOF",
  DOT = "DOT",
}

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

export class SmilesScanner {
  private source: string;
  private tokens: Token[] = [];
  private start: number = 0;
  private current: number = 0;
  /*
   * we use this to provide context aware scanning, to help us disambiguate properly
   * scan bracketed atom components
   */
  private inBracket: boolean = false;

  private organicAtoms = new Set([
    "B",
    "C",
    "N",
    "O",
    "P",
    "S",
    "F",
    "Cl",
    "Br",
    "I",
  ]);

  // All valid elements for bracketed atoms
  private elements = new Set([
    "H",
    "He",
    "Li",
    "Be",
    "B",
    "C",
    "N",
    "O",
    "F",
    "Ne",
    "Na",
    "Mg",
    "Al",
    "Si",
    "P",
    "S",
    "Cl",
    "Ar",
    "K",
    "Ca",
    "Sc",
    "Ti",
    "V",
    "Cr",
    "Mn",
    "Fe",
    "Co",
    "Ni",
    "Cu",
    "Zn",
    "Ga",
    "Ge",
    "As",
    "Se",
    "Br",
    "Kr",
    "Rb",
    "Sr",
    "Y",
    "Zr",
    "Nb",
    "Mo",
    "Tc",
    "Ru",
    "Rh",
    "Pd",
    "Ag",
    "Cd",
    "In",
    "Sn",
    "Sb",
    "Te",
    "I",
    "Xe",
    "Cs",
    "Ba",
    "La",
    "Ce",
    "Pr",
    "Nd",
    "Pm",
    "Sm",
    "Eu",
    "Gd",
    "Tb",
    "Dy",
    "Ho",
    "Er",
    "Tm",
    "Yb",
    "Lu",
    "Hf",
    "Ta",
    "W",
    "Re",
    "Os",
    "Ir",
    "Pt",
    "Au",
    "Hg",
    "Tl",
    "Pb",
    "Bi",
    "Po",
    "At",
    "Rn",
    "Fr",
    "Ra",
    "Ac",
    "Th",
    "Pa",
    "U",
    "Np",
    "Pu",
    "Am",
    "Cm",
    "Bk",
    "Cf",
    "Es",
    "Fm",
    "Md",
    "No",
    "Lr",
    "Rf",
    "Db",
    "Sg",
    "Bh",
    "Hs",
    "Mt",
    "Ds",
    "Rg",
    "Cn",
    "Nh",
    "Fl",
    "Mc",
    "Lv",
    "Ts",
    "Og",
  ]);

  constructor(source: string) {
    this.source = source;
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push({
      type: TokenType.EOF,
      value: "",
      position: this.current,
    });

    return this.tokens;
  }

  private scanToken(): void {
    const c = this.advance();

    switch (c) {
      case "[":
        this.inBracket = true;
        this.addToken(TokenType.BRACKET_START);
        this.bracketAtom();
        break;
      case "]":
        this.inBracket = false;
        this.addToken(TokenType.BRACKET_END);
        break;
      case "(":
        this.addToken(TokenType.BRANCH_START);
        break;
      case ")":
        this.addToken(TokenType.BRANCH_END);
        break;
      case "=":
        this.addToken(TokenType.BOND);
        break;
      case "#":
        this.addToken(TokenType.BOND);
        break;
      case "$":
        this.addToken(TokenType.BOND);
        break;
      case ":":
        if (!this.inBracket) {
          this.addToken(TokenType.BOND);
        }
        break;
      case "/":
        this.addToken(TokenType.BOND);
        break;
      case "\\":
        this.addToken(TokenType.BOND);
        break;
      case "-":
        if (this.inBracket) {
          this.start = this.current - 1;
          while (this.isDigit(this.peek())) this.advance();
          this.addToken(TokenType.CHARGE);
        } else {
          this.addToken(TokenType.BOND);
        }
        break;
      case "+":
        while (this.isDigit(this.peek())) this.advance();
        this.addToken(TokenType.CHARGE);
        break;
      case "%":
        this.start = this.current - 1;
        while (this.isDigit(this.peek())) this.advance();
        this.addToken(TokenType.RING_NUMBER);
        break;
      case " ":
      case "\r":
      case "\t":
      case "\n":
        break;
      default:
        if (this.isDigit(c)) {
          // Single-digit ring numbers
          this.start = this.current - 1;
          this.addToken(TokenType.RING_NUMBER);
        } else if (this.isAlpha(c)) {
          this.atomOrAromatic();
        } else {
          throw new Error(
            `Unexpected character '${c}' at position ${this.current}`
          );
        }
        break;
    }
  }

  private bracketAtom(): void {
    // 1. Isotope (optional)
    if (this.isDigit(this.peek())) {
      this.start = this.current;
      while (this.isDigit(this.peek())) this.advance();
      this.addToken(TokenType.ISOTOPE);
    }

    // 2. Element symbol (required)
    this.start = this.current;
    this.atomOrAromatic();

    // Advance after consuming atom
    this.advance();

    // 3. Chirality (optional)
    if (this.peek() === "@") {
      this.start = this.current;
      this.advance(); // consume first @

      if (this.peek() === "@") {
        this.advance();
      } else if (
        this.peek() === "T" ||
        this.peek() === "S" ||
        this.peek() === "A" ||
        this.peek() === "O"
      ) {
        while (this.isAlphaNumeric(this.peek())) {
          this.advance();
        }
      }
      this.addToken(TokenType.CHIRALITY);
    }

    // 4. Hydrogen count (optional)
    if (this.peek() === "H") {
      this.start = this.current;
      this.advance(); // consume H

      while (this.isDigit(this.peek())) this.advance(); // consume hcount digits

      this.addToken(TokenType.HCOUNT);
    }

    // 5. Charge (optional)
    if (this.peek() === "+" || this.peek() === "-") {
      this.start = this.current;
      this.advance(); // consume charge sign

      while (this.isDigit(this.peek())) this.advance(); // consume charge digits

      this.addToken(TokenType.CHARGE);
    }

    // 6. Class (optional)
    if (this.peek() === ":") {
      this.start = this.current;
      this.advance(); // consume :

      while (this.isDigit(this.peek())) this.advance();
      this.addToken(TokenType.CLASS);
    }
  }

  private atomOrAromatic(): void {
    const firstChar = this.source.charAt(this.start);

    if (firstChar === "*") {
      // Handle wildcard atom
      this.addToken(TokenType.SYMBOL);
      return;
    }

    // Try to match two-character elements first
    if (this.isUpperAlpha(firstChar) && this.isLowerAlpha(this.peek())) {
      const possibleElement = firstChar + this.peek();
      if (
        (this.inBracket && this.elements.has(possibleElement)) ||
        (!this.inBracket && this.organicAtoms.has(possibleElement))
      ) {
        this.advance(); // consume second character
        this.addToken(TokenType.SYMBOL);
        return;
      }
    }

    // If not a two-character atom, add single character
    this.addToken(TokenType.SYMBOL);
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  private addToken(type: TokenType): void {
    const text =
      this.start == this.current
        ? this.source.charAt(this.start)
        : this.source.substring(this.start, this.current);
    this.tokens.push({
      type: type,
      value: text,
      position: this.start,
    });
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
  }

  private isLowerAlpha(c: string): boolean {
    return c >= "a" && c <= "z";
  }

  private isUpperAlpha(c: string): boolean {
    return c >= "A" && c <= "Z";
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }
}
