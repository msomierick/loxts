import { SmilesInput } from "./SmilesInput";
import { MoleculeSmiles } from "./MoleculeSmiles";

export function Smiles() {
  return (
    <>
      <p> Smiles Renderer</p>
      <SmilesInput />
      <MoleculeSmiles  />
    </>
  );
}
