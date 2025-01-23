# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

## Lox

Some Lox commands

Building: `yarn lox` Will run the Tpescript compiler and output js files in dist.

Running
npx lox to open the Lox REPL

npx lox loxfile.lox to parse the submitted lox file.

### Working version. Tested at: https://bnfplayground.pauliankline.com/

<smiles> ::= <chain> <terminator>
<chain> ::= <branched_atom> <connection>* 
<connection> ::= <bond> <branched_atom>
               | <dot> <branched_atom>
               | <branched_atom>  // implicit single bond
<branched_atom> ::= <atom> <ringbond>* <branch>_
<bond> ::= "-" | "=" | "#" | "$" | ":" | "/" | "\\"
<dot> ::= "."
<atom> ::= <bracket_atom> | <organic_atom> | "_"
<organic*atom> ::= <aliphatic_organic> | <aromatic_organic>
<ringbond> ::= <bond>? <DIGIT> | <bond>? "%" <DIGIT> <DIGIT>
<branch> ::= "(" <chain> ")" | "(" <bond> <chain> ")" | "(" <dot> <chain> ")"
<bracket_atom> ::= "[" <isotope>? <symbol> <chiral>? <hcount>? <charge>? <class>? "]"
<aliphatic_organic> ::= "B" | "C" | "N" | "O" | "S" | "P" | "F" | "Cl" | "Br" | "I"
<aromatic_organic> ::= "b" | "c" | "n" | "o" | "s" | "p"
<DIGIT> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<isotope> ::= <NUMBER>
<symbol> ::= <element_symbols> | <aromatic_organic> | "se" | "as" | "*"
<chiral> ::= "@" | "@@" | "@TH1" | "@TH2" | "@AL1" | "@AL2" | "@SP1" | "@SP2" | "@SP3" | "@TB1" | "@TB2" | "@TB3" | "@TB19" | "@TB20" | "@OH1" | "@OH2" | "@OH3" | "@OH29" | "@OH30"
<hcount> ::= "H" | "H" <DIGIT>
<charge> ::= "-" | "-" <DIGIT> | "+" | "+" <DIGIT>
<class> ::= ":" <NUMBER>
<NUMBER> ::= <DIGIT>+
<element_symbols> ::= "H" | "He" | "Li" | "Be" | "B" | "C" | "N" | "O" | "F" | "Ne" | "Na" | "Mg" | "Al" | "Si" | "P" | "S" | "Cl" | "Ar" | "K" | "Ca" | "Sc" | "Ti" | "V" | "Cr" | "Mn" | "Fe" | "Co" | "Ni" | "Cu" | "Zn" | "Ga" | "Ge" | "As" | "Se" | "Br" | "Kr" | "Rb" | "Sr" | "Y" | "Zr" | "Nb" | "Mo" | "Tc" | "Ru" | "Rh" | "Pd" | "Ag" | "Cd" | "In" | "Sn" | "Sb" | "Te" | "I" | "Xe" | "Cs" | "Ba" | "Hf" | "Ta" | "W" | "Re" | "Os" | "Ir" | "Pt" | "Au" | "Hg" | "Tl" | "Pb" | "Bi" | "Po" | "At" | "Rn" | "Fr" | "Ra" | "Rf" | "Db" | "Sg" | "Bh" | "Hs" | "Mt" | "Ds" | "Rg" | "La" | "Ce" | "Pr" | "Nd" | "Pm" | "Sm" | "Eu" | "Gd" | "Tb" | "Dy" | "Ho" | "Er" | "Tm" | "Yb" | "Lu" | "Ac" | "Th" | "Pa" | "U" | "Np" | "Pu" | "Am" | "Cm" | "Bk" | "Cf" | "Es" | "Fm" | "Md" | "No" | "Lr"
<terminator> ::= " " | "\t" | "\n" | "\r"

TODO:

- Add validation for Ring numbers; matching pairs, invalid ring numbers.

CC1=C(\C=C/C(C=C)C2=CC3=C(C=C2)N(C2=C3C=C(C=C2)C2(C)CC3=C(C=C2)N(C2=C3C=CC=C2)C2=CC=CC=C2)C2=CC=CC=C2)N(C2=C1CCC(=C2)C1=CC(=CC=C1)C1=CC=C(C=C1)N1C2=C(C=CC=C2)C2=C1C=CC(=C2)C1=CC2=C(CC1)N(C1=C2C=CCC1)C1=CC=C(C=C1)C1=CC=CC=C1)C1=CC=CC=C1

Let me analyze the SMILES grammar to determine if it's LL(k):

To be LL(k), a grammar must be:

1. Unambiguous
2. Left-factored (no common prefixes longer than k-1 tokens)
3. Not left-recursive

Let's examine the problematic rules:

```
<chain> ::= <branched_atom>
          | <chain> <branched_atom>
          | <chain> <bond> <branched_atom>
          | <chain> <dot> <branched_atom>
```

This rule has immediate left recursion with `<chain>` appearing at the start of three productions. This violates requirement #3 for LL(k) grammars. No amount of lookahead can resolve this left recursion.

The left recursion can be eliminated by rewriting the rule as:

```
<chain> ::= <branched_atom> <chain_tail>
<chain_tail> ::= ε
               | <branched_atom> <chain_tail>
               | <bond> <branched_atom> <chain_tail>
               | <dot> <branched_atom> <chain_tail>
```

However, even after removing left recursion, we have another issue:

```
<ringbond> ::= <bond>? <DIGIT> | <bond>? "%" <DIGIT> <DIGIT>
```

This rule requires lookahead to determine if we're parsing a single digit or a "%" followed by two digits. However, this is still tractable with finite lookahead (k=2 in this case).

Looking at the branched atom rule:

```
<branched_atom> ::= <atom> <ringbond>* <branch>*
```

The optional and repeating nature of `ringbond` and `branch` is not inherently problematic for LL(k) parsing, as we can determine which one we're parsing by looking at the next token (either a digit/bond for ringbond, or an opening parenthesis for branch).

Therefore, this grammar is:

1. Not LL(k) in its original form due to left recursion
2. Could be converted to LL(k) by:
   - Eliminating left recursion in the `<chain>` rule
   - Ensuring proper left factoring where needed
   - Using sufficient lookahead (k=2) for the ringbond rule

The grammar would be better classified as LR(1) in its original form because:

1. LR parsers can handle left recursion naturally
2. All decisions can be made with one token of lookahead after seeing the handle
3. The ambiguity in the ringbond rule can be resolved through shift/reduce decisions

This explains why many SMILES parsers are implemented using bottom-up parsing techniques like LR parsing, although as we demonstrated with our recursive descent implementation, it's possible to modify the grammar to work with top-down parsing approaches by eliminating the left recursion.

A key insight is that while our recursive descent parser works, it required us to effectively transform the grammar in our implementation to eliminate the left recursion. We did this procedurally in our code rather than formally in the grammar, but the transformation was still necessary.


// Types and interfaces
interface Token {
    type: TokenType;
    value: string;
    position: number;
}

class Scanner {
    private source: string;
    private tokens: Token[] = [];
    private start: number = 0;
    private current: number = 0;

    constructor(source: string) {
        this.source = source;
    }

    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        return this.tokens;
    }

    private scanToken(): void {
        const c = this.advance();
        switch (c) {
            // Structure tokens
            case '[': this.addToken(TokenType.OPEN_BRACKET); break;
            case ']': this.addToken(TokenType.CLOSE_BRACKET); break;
            case '(': this.addToken(TokenType.OPEN_BRANCH); break;
            case ')': this.addToken(TokenType.CLOSE_BRANCH); break;

            // Bonds
            case '-': this.addToken(TokenType.SINGLE_BOND); break;
            case '=': this.addToken(TokenType.DOUBLE_BOND); break;
            case '#': this.addToken(TokenType.TRIPLE_BOND); break;
            case '$': this.addToken(TokenType.QUADRUPLE_BOND); break;
            case ':': this.addToken(TokenType.AROMATIC_BOND); break;
            case '/': this.addToken(TokenType.UP_BOND); break;
            case '\\': this.addToken(TokenType.DOWN_BOND); break;
            case '.': this.addToken(TokenType.DOT); break;

            // Charges
            case '+': 
                if (this.isDigit(this.peek())) {
                    this.number();
                }
                this.addToken(TokenType.CHARGE_POSITIVE);
                break;

            // Whitespace
            case ' ':
            case '\r':
            case '\t':
            case '\n':
                this.addToken(TokenType.TERMINATOR);
                break;

            default:
                if (this.isDigit(c)) {
                    if (this.previous() === '%') {
                        // Handle two-digit ring bonds
                        this.advance(); // Consume second digit
                        this.addToken(TokenType.NUMBER);
                    } else {
                        this.number();
                    }
                } else if (this.isAlpha(c)) {
                    this.atom();
                } else {
                    throw new Error(`Unexpected character: ${c} at position ${this.current}`);
                }
                break;
        }
    }

    private atom(): void {
        // Handle multi-character atoms and decorators
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }

        const text = this.source.substring(this.start, this.current);
        
        // Check for aromatic atoms
        if (this.isAromaticOrganic(text)) {
            this.addToken(TokenType.AROMATIC_ORGANIC);
            return;
        }

        // Check for aliphatic organic atoms
        if (this.isAliphaticOrganic(text)) {
            this.addToken(TokenType.ALIPHATIC_ORGANIC);
            return;
        }

        // Check for element symbols
        if (this.isElementSymbol(text)) {
            this.addToken(TokenType.ELEMENT_SYMBOL);
            return;
        }

        // Check for chirality markers
        if (text.startsWith('@')) {
            this.addToken(TokenType.CHIRAL);
            return;
        }

        // Check for hydrogen count
        if (text.startsWith('H')) {
            this.addToken(TokenType.HCOUNT);
            return;
        }

        throw new Error(`Invalid atom or decorator: ${text} at position ${this.start}`);
    }

    private number(): void {
        while (this.isDigit(this.peek())) {
            this.advance();
        }
        this.addToken(TokenType.NUMBER);
    }

    private isAromaticOrganic(text: string): boolean {
        const aromaticAtoms = ['b', 'c', 'n', 'o', 's', 'p', 'se', 'as'];
        return aromaticAtoms.includes(text.toLowerCase());
    }

    private isAliphaticOrganic(text: string): boolean {
        const aliphaticAtoms = ['B', 'C', 'N', 'O', 'S', 'P', 'F', 'Cl', 'Br', 'I'];
        return aliphaticAtoms.includes(text);
    }

    private isElementSymbol(text: string): boolean {
        // This would contain the full list of element symbols from the grammar
        const elementSymbols = new Set([
            'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
            // ... (rest of element symbols)
        ]);
        return elementSymbols.has(text);
    }

    private isDigit(c: string): boolean {
        return c >= '0' && c <= '9';
    }

    private isAlpha(c: string): boolean {
        return (c >= 'a' && c <= 'z') ||
               (c >= 'A' && c <= 'Z') ||
               c === '_' ||
               c === '@';
    }

    private isAlphaNumeric(c: string): boolean {
        return this.isAlpha(c) || this.isDigit(c);
    }

    private advance(): string {
        return this.source.charAt(this.current++);
    }

    private peek(): string {
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.current);
    }

    private previous(): string {
        return this.source.charAt(this.current - 2);
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    private addToken(type: TokenType): void {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push({
            type,
            value: text,
            position: this.start
        });
    }
}

// Example usage
function parseSMILES(smiles: string): Token[] {
    const scanner = new Scanner(smiles);
    return scanner.scanTokens();
}

## Another working version. Tested at: https://bnfplayground.pauliankline.com/
This version was generated by Claude using https://github.com/bergos/smiles/blob/master/lib/smiles.pegjs

<Smiles> ::= <Chain>*
<Chain> ::= <BranchedAtom> | <Bond> <BranchedAtom> | <Dot> <BranchedAtom>
<BranchedAtom> ::= <Atom> <Ringbond>* <Branch>*
<Branch> ::= "(" <Chain>* ")"
<Atom> ::= <BracketAtom> | <AliphaticOrganic> | <AromaticOrganic> | "*"
<AliphaticOrganic> ::= "Br" | "B" | "Cl" | "C" | "N" | "O" | "S" | "P" | "F" | "I"
<AromaticOrganic> ::= "b" | "c" | "n" | "o" | "s" | "p"
<BracketAtom> ::= "[" <Isotope>? <Symbol> <Chiral>? <HydrogenCount>? <Charge>? <Class>? "]"
<Symbol> ::= <ElementSymbol> | <AromaticSymbol> | "*"
<Isotope> ::= <NUMBER>
<ElementSymbol> ::= "Ac" | "Ag" | "Al" | "Am" | "Ar" | "As" | "At" | "Au"
                | "Ba" | "Be" | "Bh" | "Bi" | "Bk" | "Br" | "B"
                | "Ca" | "Cd" | "Ce" | "Cf" | "Cl" | "Cm" | "Cn" | "Co" | "Cr" | "Cs" | "Cu" | "C"
                | "Db" | "Ds" | "Dy"
                | "Er" | "Es" | "Eu"
                | "Fe" | "Fl" | "Fm" | "Fr" | "F"
                | "Ga" | "Gd" | "Ge"
                | "He" | "Hf" | "Hg" | "Ho" | "Hs" | "H"
                | "In" | "Ir" | "I"
                | "Kr" | "K"
                | "La" | "Li" | "Lr" | "Lu" | "Lv"
                | "Md" | "Mg" | "Mn" | "Mo" | "Mt"
                | "Na" | "Nb" | "Nd" | "Ne" | "Ni" | "No" | "Np" | "N"
                | "Os" | "O"
                | "Pa" | "Pb" | "Pd" | "Pm" | "Po" | "Pr" | "Pt" | "Pu" | "P"
                | "Ra" | "Rb" | "Re" | "Rf" | "Rg" | "Rh" | "Rn" | "Ru"
                | "Sb" | "Sc" | "Se" | "Sg" | "Si" | "Sm" | "Sn" | "Sr" | "S"
                | "Ta" | "Tb" | "Tc" | "Te" | "Th" | "Ti" | "Tl" | "Tm"
                | "U"
                | "V"
                | "W"
                | "Xe"
                | "Yb" | "Y"
                | "Zn" | "Zr"

<AromaticSymbol> ::= "as" | "b" | "c" | "n" | "o" | "p" | "se" | "s"
<Chiral> ::= "@@" | "@"
<HydrogenCount> ::= "H" <DIGIT>?
<Charge> ::= "-" <NUMBER>? | "+" <NUMBER>?
<Class> ::= ":" <NUMBER>
<Bond> ::= "-" | "=" | "#" | "$" | ":" | "/" | "\\"
<Ringbond> ::= <Bond>? <DIGIT> | <Bond>? "%" <NUMBER>
<Dot> ::= "."
<DIGIT> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<NUMBER> ::= <DIGIT>+

Other SMILES grammar sources:
- https://pathway.yeastgenome.org/help.html?object=smiles
- https://github.com/reymond-group/smilesDrawer/blob/master/peg/smiles.pegjs
- https://web.archive.org/web/20160716172704/http://www.moldb.net/smiley-docs/index.html