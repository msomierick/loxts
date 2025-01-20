import * as React from "react";

import { drawSmilesSvg } from "../service/drawSmilesSvg";
import { scanTokens } from "../service/scanTokens";

export const SmilesInput = () => {
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
    scanTokens(formJson.smilesInput as string);
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
    </div>
  );
};
