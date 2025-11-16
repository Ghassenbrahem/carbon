import factors from "../data/facteurs.json";

export function computeTotals(data = {}) {
  const ids = [
    "matiere",
    "transportMatiere",
    "electricite",
    "eaux",
    "gaz",
    "eaudouce",
    "distribution",
    "dechets",
    "refroidissement"
  ];

  const perCategory = {};
  let grandTotal = 0;

  ids.forEach((id) => {
    const list = Array.isArray(data[id]) ? data[id] : [];

    const sum = list.reduce((s, x) => {
      let emission = 0;

      switch (id) {

        /** -----------------------------
         *   MATIÈRES PREMIÈRES  (FIX)
         * ----------------------------- */
        case "matiere":
          emission =
            Number(x?.quantite || 0) * Number(x?.facteur || 0);
          break;

        case "electricite":
          emission = Number(x?.valeur || 0) * factors.electricite.kWh;
          break;

        case "eaux":
          emission = Number(x?.valeur || 0) * factors.eau.m3;
          break;

        case "gaz":
          emission = Number(x?.valeur || 0) * factors.gaz.m3;
          break;

        case "eaudouce":
          emission = Number(x?.valeur || 0) * factors.eaudouce.m3;
          break;

        case "transportMatiere":
          emission =
            Number(x?.distance || 0) *
            (factors.transportMatiere[x?.type] || 0);
          break;

        case "distribution":
          emission =
            Number(x?.distance || 0) *
            (factors.distribution[x?.type] || 0);
          break;

        case "dechets":
          emission = Number(x?.poids || 0) * factors.dechets.kg;
          break;

        case "refroidissement":
          emission =
            Number(x?.poids || 0) *
            (factors.gwp[x?.type] || 0);
          break;

        default:
          emission = Number(x?.emission || 0);
      }

      return s + emission;
    }, 0);

    perCategory[id] = sum;
    grandTotal += sum;
  });

  return { perCategory, grandTotal };
}
