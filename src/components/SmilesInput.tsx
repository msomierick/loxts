import * as React from "react";

import { drawSmilesSvg } from "../service/drawSmilesSvg";
import { parseTokens, scanTokens } from "../service/scanTokens";
import { Token } from "../smiles/Scanner";

export const SmilesInput = () => {
  const [tokens, setTokens] = React.useState<Token[]>([]);
  const handleSmilesForm = (e) => {
    console.log("");
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    drawSmilesSvg(formJson.smilesInput as string);
    const tokens = scanTokens(formJson.smilesInput as string);
    setTokens(tokens);
    parseTokens(tokens);
  };

  return (
    <div>
      <form method="post" onSubmit={handleSmilesForm}>
        <label>
          Text input: <input name="smilesInput" />
        </label>
        <hr />
        <button type="reset" className="mr-2">
          Reset form
        </button>
        <button type="submit">Submit form</button>
      </form>
      {tokens.length > 0 && (
        <ul>
          {tokens.map((token) => (
            <li key={token.position}>
              {token.value} - {token.type} - {token.position}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
