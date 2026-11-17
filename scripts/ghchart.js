// Compacts the ghchart SVG into a solid heatmap: adjacent active days are
// merged into 12px strokes and empty days are simply not drawn.
const GREENS = {
  1: "#3bbd70",
  2: "#2aa25c",
  3: "#1b8447",
  4: "#0a5f2e",
};

function parseGrid(svg) {
  const rects = [];
  for (const m of svg.matchAll(/<rect\b([^>]*)\/?>/g)) {
    const attrs = m[1];
    const score = /data-score="([^"]*)"/.exec(attrs)?.[1];
    const x = Number(/x="([^"]*)"/.exec(attrs)?.[1]);
    const y = Number(/y="([^"]*)"/.exec(attrs)?.[1]);
    if (score === undefined || !Number.isFinite(x) || !Number.isFinite(y)) continue;
    rects.push({ x, y, score });
  }
  return rects.length ? rects : null;
}

function buildRuns(rects) {
  const rows = new Map();
  for (const r of rects) {
    if (!rows.has(r.y)) rows.set(r.y, []);
    rows.get(r.y).push(r);
  }

  const runs = new Map(); // score -> [{ x, y, count }]
  for (const [y, cells] of rows) {
    cells.sort((a, b) => a.x - b.x);
    let start = cells[0].x;
    let prev = start;
    let count = 1;
    let score = cells[0].score;
    for (let i = 1; i <= cells.length; i++) {
      const next = cells[i];
      if (next && next.x === prev + 12 && next.score === score) {
        prev = next.x;
        count++;
        continue;
      }
      if (!runs.has(score)) runs.set(score, []);
      runs.get(score).push({ x: start, y, count });
      if (next) {
        start = prev = next.x;
        count = 1;
        score = next.score;
      }
    }
  }
  return runs;
}

export function compactGhChart(svg) {
  const rects = parseGrid(svg);
  if (!rects) return null;

  const xs = rects.map((r) => r.x);
  const ys = rects.map((r) => r.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const width = Math.max(...xs) - minX + 12;
  const height = Math.max(...ys) - minY + 12;
  const runs = buildRuns(rects);

  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    '<g fill="none" stroke-width="12">',
  ];

  for (const score of [...runs.keys()].sort()) {
    if (score === "0") continue;
    const d = runs
      .get(score)
      .map(({ x, y, count }) => `M${x - minX} ${y - minY + 6}h${12 * count}`)
      .join("");
    parts.push(`<path stroke="${GREENS[score] ?? GREENS[4]}" d="${d}"/>`);
  }

  parts.push("</g></svg>\n");
  return parts.join("");
}
