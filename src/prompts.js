import fs from "fs";
import path from "path";

export const getPrompt = (name, params) => {
  const filename = path.resolve(`prompts/${name}.txt`);
  const template = fs.readFileSync(filename, "utf8");
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`\${${key}}`, value),
    template
  );
};
