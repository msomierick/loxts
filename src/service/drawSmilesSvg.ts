import SmilesDrawer from "smiles-drawer";

export function drawSmilesSvg(text: string) {
  const options = {
    width: 700,
    height: 700,
    debug: false,
    atomVisualization: "default",
  };

  // Initialize the drawer to draw to SVG
  // Note: Canvas drawer is not working.
  const smilesDrawer = new SmilesDrawer.SvgDrawer(options); // TODO: make instance a sngleton
  // Clean the input (remove unrecognized characters, such as spaces and tabs) and parse it
  SmilesDrawer.parse(text, function (tree) {
    // Draw to the svg
    // TODO: useRef instead of passing Id
    smilesDrawer.draw(tree, "example-svg", "dark");
  });
}
