import * as React from "react";

export type Props = {
  drawSmiles: (parsedSmilesText: string, smilesDrawer: unknown) => void;
};

export const MoleculeSmiles = () => {
  return (
    <div>
      <svg id="example-svg" />
    </div>
  );
};
