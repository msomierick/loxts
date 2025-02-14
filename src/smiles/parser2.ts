interface RingBond {
  bond: string;
  id: number;
}

interface ASTNode {
  atom: string;
  isBracket: boolean;
  branches: ASTNode[];
  branchCount: number;
  ringbonds: RingBond[];
  ringbondCount: number;
  bond: string;
  next: ASTNode | null;
  hasNext: boolean;
  branchBond?: string;
}

interface Token {
  type: TokenType;
  value: string;
}

class SMILESParser {
  private tokens: Token[];
  private currentIndex: number;
  private ringbondTracker: Map<number, ASTNode>;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.currentIndex = 0;
    this.ringbondTracker = new Map();
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

  // Main parsing method to generate AST
  parseSmiles(): ASTNode | null {
    let root: ASTNode | null = null;
    let currentNode: ASTNode | null = null;

    while (!this.match(TokenType.EOF)) {
      const node = this.parseChain();

      if (!root) {
        root = node;
        currentNode = node;
      } else {
        // Link nodes
        if (currentNode) {
          currentNode.next = node;
          currentNode.hasNext = true;
          currentNode = node;
        }
      }
    }

    this.expect(TokenType.EOF);
    return root;
  }

  // Parse a chain of atoms
  private parseChain(): ASTNode {
    let bond = "-"; // Default bond

    // Check for optional bond
    if (this.match(TokenType.BOND)) {
      bond = this.consume().value;
    }

    // Check for optional dot
    if (this.match(TokenType.DOT)) {
      this.consume();
    }

    // Parse the branched atom
    const node = this.parseBranchedAtom();
    node.bond = bond;

    return node;
  }

  // Parse a branched atom
  private parseBranchedAtom(): ASTNode {
    const node: ASTNode = {
      atom: this.parseAtom(),
      isBracket: this.peek().type === TokenType.BRACKET_START,
      branches: [],
      branchCount: 0,
      ringbonds: [],
      ringbondCount: 0,
      bond: "-", // Default bond
      next: null,
      hasNext: false,
    };

    // Parse ringbonds
    while (
      this.match(TokenType.RING_NUMBER) ||
      (this.match(TokenType.BOND) &&
        this.tokens[this.currentIndex + 1].type === TokenType.RING_NUMBER)
    ) {
      const ringBond = this.parseRingbond();
      node.ringbonds.push(ringBond);
      node.ringbondCount++;

      // Track ringbond for later connection
      this.trackRingbond(ringBond, node);
    }

    // Parse branches
    while (this.match(TokenType.BRANCH_START)) {
      const branch = this.parseBranch();
      node.branches.push(branch);
      node.branchCount++;
    }

    return node;
  }

  // Track ringbond for later connection
  private trackRingbond(ringBond: RingBond, node: ASTNode) {
    const existingNode = this.ringbondTracker.get(ringBond.id);

    if (existingNode) {
      // Connect the two nodes that share this ringbond ID
      // This is a simplified connection - in a real parser,
      // you might want more complex logic
      existingNode.next = node;
      existingNode.hasNext = true;
      this.ringbondTracker.delete(ringBond.id);
    } else {
      this.ringbondTracker.set(ringBond.id, node);
    }
  }

  // Parse a branch
  private parseBranch(): ASTNode {
    this.expect(TokenType.BRANCH_START);

    // Determine branch bond (look ahead to next token after branch start)
    const branchBond = this.peek().value;

    const branch: ASTNode = {
      atom: this.parseAtom(),
      isBracket: false,
      branches: [],
      branchCount: 0,
      ringbonds: [],
      ringbondCount: 0,
      bond: "-", // Default bond
      next: null,
      hasNext: false,
      branchBond: branchBond,
    };

    // Parse branches within this branch if any
    while (!this.match(TokenType.BRANCH_END)) {
      const chainNode = this.parseChain();

      if (!branch.next) {
        branch.next = chainNode;
        branch.hasNext = true;
      } else {
        // Link chain nodes
        let currentNode = branch.next;
        while (currentNode.next) {
          currentNode = currentNode.next;
        }
        currentNode.next = chainNode;
        currentNode.hasNext = true;
      }
    }

    this.expect(TokenType.BRANCH_END);

    return branch;
  }

  // Parse an atom
  private parseAtom(): string {
    if (this.match(TokenType.BRACKET_START)) {
      return this.parseBracketAtom();
    } else if (this.match(TokenType.SYMBOL)) {
      const symbol = this.consume().value;
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
        !validAliphaticSymbols.includes(symbol) &&
        !validAromaticSymbols.includes(symbol) &&
        symbol !== "*"
      ) {
        throw new Error(`Invalid atom symbol: ${symbol}`);
      }
      return symbol;
    } else {
      throw new Error(
        `Unexpected token when parsing atom: ${this.peek().type}`
      );
    }
  }

  // Parse a bracket atom
  private parseBracketAtom(): string {
    this.expect(TokenType.BRACKET_START);

    // Optional isotope
    if (this.match(TokenType.ISOTOPE)) {
      this.consume();
    }

    // Symbol is required
    const symbol = this.expect(TokenType.SYMBOL).value;

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

    return symbol;
  }

  // Parse a ringbond
  private parseRingbond(): RingBond {
    let bond = "-"; // Default bond

    // Optional bond
    if (this.match(TokenType.BOND)) {
      bond = this.consume().value;
    }

    // Ring number (either single digit or two-digit)
    const ringNumber = this.expect(TokenType.RING_NUMBER);

    return {
      bond: bond,
      id: parseInt(ringNumber.value),
    };
  }
}

export { SMILESParser, ASTNode, RingBond };
