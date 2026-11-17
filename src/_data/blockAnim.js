import fs from "node:fs";
import path from "node:path";

export default () => {
  const dir = path.resolve("public/assets/images/scenes");
  const out = [];

  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith("-anim.json")) continue;
    const design = f.replace("-anim.json", "");
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    out.push({ design, ...data });
  }

  return out;
};
