// src/utils/calc.js
export function computeTotals(data = {}) {
  const ids = [
    "matiere",
    "produits",
    "eaux",
    "electricite",
    "eaudouce",
    "gaz",
    "dechets",
    "transport",
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
