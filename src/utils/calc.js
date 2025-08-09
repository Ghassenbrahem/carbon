// src/utils/calc.js
export function computeTotals(data = {}) {
  const ids = [
    "matiere",
    "transportMatiere",   // ⬅️ nouveau
    "produits",
    "distribution",       // ⬅️ nouveau
    "eaux",
    "refroidissement",    // ⬅️ nouveau
    "electricite",
    "eaudouce",
    "gaz",
    "dechets"
  ];

  const perCategory = {};
  let grandTotal = 0;

  ids.forEach((id) => {
    const list = Array.isArray(data[id]) ? data[id] : [];
    const sum = list.reduce((s, x) => s + Number(x?.emission || 0), 0);
    perCategory[id] = sum;
    grandTotal += sum;
  });

  return { perCategory, grandTotal };
}
