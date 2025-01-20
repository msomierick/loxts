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

## Depth first version

<smiles> ::= <atom> ( <branch> | <dot> <smiles> | <bond>? ( <smiles> | <rnum> ) )\*
<branch> ::= "(" <bond>? <smiles> ")"

<atom> ::= <organic> | <bracket> | "_"
<bracket> ::= "[" <isotope>? <bracket_element> <parity>? <hcount>? <charge>? <map>? "]"
<bracket_element> ::= <symbol> | <bracket_aromatic> | "_"
<isotope> ::= <digit> <digit>? <digit>?
<hcount> ::= "H" <digit>?
<charge> ::= "+" <plus_minus>? | "-" <plus_minus>?
<plus_minus> ::= "+" | <fifteen>
<map> ::= ":" <digit> <digit>? <digit>? <digit>?

<rnum> ::= <digit> | "%" <digit> <digit>
<parity> ::= "@" ( "@" | <parity_suffix> )?
<parity_suffix> ::= "TH" <th1_2> | "AL" <th1_2> | "SP" <sp1_3> | "TB" <twenty> | "OH" <thirty>
<th1_2> ::= "1" | "2"
<sp1_3> ::= "1" | "2" | "3"

<organic> ::= "B" "r"? | "C" "l"? | "N" | "O" | "P" | "S" | "F" | "I" | "At" | "Ts"
| "b" | "c" | "n" | "o" | "p" | "s"
<symbol> ::= "A" <symbol_suffix>? | "B" <b_suffix>? | "C" <c_suffix>?
| "D" <d_suffix>? | "E" <e_suffix>? | "F" <f_suffix>?
| "G" <g_suffix>? | "H" <h_suffix>? | "I" <i_suffix>?
| "K" "r"? | "L" <l_suffix>? | "M" <m_suffix>?
| "N" <n_suffix>? | "O" <o_suffix>? | "P" <p_suffix>?
| "R" <r_suffix>? | "S" <s_suffix>? | "T" <t_suffix>?
| "U" | "V" | "W" | "Xe" | "Y" "b"? | "Z" <z_suffix>?
<symbol_suffix> ::= "c" | "g" | "l" | "m" | "r" | "s" | "t" | "u"
<b_suffix> ::= "a" | "e" | "h" | "i" | "k" | "r"?
<c_suffix> ::= "a" | "d" | "e" | "f" | "l" | "m" | "n" | "o" | "r" | "s" | "u"?
<d_suffix> ::= "b" | "s" | "y"
<e_suffix> ::= "r" | "s" | "u"
<f_suffix> ::= "e" | "l" | "m" | "r"?
<g_suffix> ::= "a" | "d" | "e"
<h_suffix> ::= "e" | "f" | "g" | "o" | "s"?
<i_suffix> ::= "n" | "r"?
<l_suffix> ::= "a" | "i" | "r" | "u" | "v"
<m_suffix> ::= "c" | "g" | "n" | "o" | "t"
<n_suffix> ::= "a" | "b" | "d" | "e" | "h" | "i" | "o" | "p"?
<o_suffix> ::= "g" | "s"?
<p_suffix> ::= "a" | "b" | "d" | "m" | "o" | "r" | "t" | "u"?
<r_suffix> ::= "a" | "b" | "e" | "f" | "g" | "h" | "n" | "u"
<s_suffix> ::= "b" | "c" | "e" | "g" | "i" | "m" | "n" | "r"?
<t_suffix> ::= "a" | "b" | "c" | "e" | "h" | "i" | "l" | "m" | "s"
<z_suffix> ::= "n" | "r"

<bracket_aromatic>::= "b" | "c" | "n" | "o" | "p" | "s" "e"? | "as"
<bond> ::= "-" | "=" | "#" | "$" | "/" | "\\"

<fifteen> ::= "1" ("0" | "1" | "2" | "3" | "4" | "5")? | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<twenty> ::= "1" <digit>? | "2" "0"? | <digit> ("3" | "4" | "5" | "6" | "7" | "8" | "9")
<thirty> ::= "1" <digit>? | "2" <digit>? | "3" "0"? | "4" | "5" | "6" | "7" | "8" | "9"

<digit> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<dot> ::= "."

### Working version. Tested at: https://bnfplayground.pauliankline.com/

<smiles> ::= <chain> <terminator>
<chain> ::= <branched_atom> | <chain> <branched_atom> | <chain> <bond> <branched_atom> | <chain> <dot> <branched_atom>
<branched_atom> ::= <atom> <ringbond>_ <branch>_
<bond> ::= "-" | "=" | "#" | "$" | ":" | "/" | "\\"
<dot> ::= "."
<atom> ::= <bracket_atom> | <organic_atom> | "_"
<organic_atom> ::= <aliphatic_organic> | <aromatic_organic>
<ringbond> ::= <bond>? <DIGIT> | <bond>? "%" <DIGIT> <DIGIT>
<branch> ::= "(" <chain> ")" | "(" <bond> <chain> ")" | "(" <dot> <chain> ")"
<bracket_atom> ::= "[" <isotope>? <symbol> <chiral>? <hcount>? <charge>? <class>? "]"
<aliphatic_organic> ::= "B" | "C" | "N" | "O" | "S" | "P" | "F" | "Cl" | "Br" | "I"
<aromatic_organic> ::= "b" | "c" | "n" | "o" | "s" | "p"
<DIGIT> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<isotope> ::= <NUMBER>
<symbol> ::= <element_symbols> | <aromatic_organic> | "se" | "as" | "_"
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
