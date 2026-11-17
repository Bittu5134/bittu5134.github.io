// Compacts the ghchart SVG: turns the per-day <rect> grid into one dashed
// stroke per contiguous colour run, drops labels/margins and data-* attrs.
const PALETTE = {
  0: "#d4d4d4",
  1: "#3bbd70",
  2: "#2aa25c",
  3: "#1b8447",
  4: "#0a5f2e",
};

export function compactGhChart(svg) {
  const rects = [];
  for (const m of svg.matchAll(/<rect\b([^>]*)\/?>/g)) {
    const attrs = m[1];
    const score = /data-score="([^"]*)"/.exec(attrs)?.[1];
    const x = Number(/x="([^"]*)"/.exec(attrs)?.[1]);
    const y = Number(/y="([^"]*)"/.exec(attrs)?.[1]);
    if (score === undefined || !Number.isFinite(x) || !Number.isFinite(y)) continue;
    rects.push({ x, y, score });
  }
  if (!rects.length) return svg;

  const xs = rects.map((r) => r.x);
  const ys = rects.map((r) => r.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const width = Math.max(...xs) - minX + 10;
  const height = Math.max(...ys) - minY + 10;

  const rows = new Map();
  for (const r of rects) {
    if (!rows.has(r.y)) rows.set(r.y, []);
    rows.get(r.y).push(r);
  }

  const runs = new Map();
  for (const [y, cells] of rows) {
    cells.sort((a, b) => a.x - b.x);
    let start = cells[0].x;
    let prev = start;
    let score = cells[0].score;
    for (let i = 1; i <= cells.length; i++) {
      const next = cells[i];
      if (next && next.x === prev + 12 && next.score === score) {
        prev = next.x;
        continue;
      }
      const length = 10 + 12 * Math.round((prev - start) / 12);
      if (!runs.has(score)) runs.set(score, []);
      runs.get(score).push(`M${start - minX} ${y - minY + 5}h${length}`);
      if (next) {
        start = prev = next.x;
        score = next.score;
      }
    }
  }

  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispedges">`,
    '<g fill="none" stroke-width="10" stroke-dasharray="10 2">',
  ];
  for (const score of [...runs.keys()].sort()) {
    parts.push(
      `<path stroke="${PALETTE[score] ?? PALETTE[0]}" d="${runs.get(score).join("")}"/>`
    );
  }
  parts.push("</g></svg>\n");
  return parts.join("");
}
