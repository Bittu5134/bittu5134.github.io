import fs from "node:fs";
import path from "node:path";

export default () => {
  const dir = path.resolve("assets/images/blocks");
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith("-anim.json")) continue;
    out.push({ design: f.replace("-anim.json", ""), cells: JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) });
  }
  return out;
};
