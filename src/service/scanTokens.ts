import { SmilesScanner, Token } from "../smiles/Scanner";

const testCases = [
  "CC-C", // hyphen as bond
  "C-C[NH3-]", // hyphen as both bond and charge
  "[Fe+2]-[OH-]", // charges and bond
  "C(:N)C", // aromatic bond
  "[13CH3-]", // isotope and charge
  "[C@H](O)CC", // chirality and implicit H
  "[NH4+]", // H count and charge
  "[Fe+2:1]", // charge and class
  "[2H]", // isotope only
  "[C@@](C)(N)(O)CC", // complex chirality
  "[NH3+:2]", // H count, charge, and class
  "[13C@H](O)CC", // isotope, chirality, and implicit H
  "CCl", // organic chlorine
  "Br2", // organic bromine with digit
  "*CC*", // wildcards
  "c1ccccc1", // aromatic benzene
  "[Se]", // selenium in brackets
  "[NH4+]", // charged ammonium
  "N1CC[O]CC1", // morpholine with one bracketed atom
  "[13CH4]", // isotope
  "C[2H]", // deuterium
  "[Ru](Cl)Cl", // ruthenium complex
  "CC(=O)O", // carboxylic acid
  "C1=CC=C[*]C=C1", // benzene with wildcard
];

export function scanTokens(source: string): Token[] {
  console.log(`Scanning: ${source}`);
  const scanner = new SmilesScanner(source);
  const tokens = scanner.scanTokens();
  console.log(tokens);
  return tokens;
}
