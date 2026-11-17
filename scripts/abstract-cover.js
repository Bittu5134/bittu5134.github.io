// Deterministic abstract cover for posts without a coverImage.
// The slug is hashed to a stable index so a post always gets the same art,
// regardless of build machine or build order.
const UNSPLASH_ABSTRACT_COVERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?w=1200&h=630&auto=format&fit=crop&q=80",
];

export function getDeterministicAbstractCover(str) {
  let hash = 0;
  const s = String(str || "default");
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return UNSPLASH_ABSTRACT_COVERS[Math.abs(hash) % UNSPLASH_ABSTRACT_COVERS.length];
}
