import factors from "../data/facteurs.json";

export function computeTotals(data = {}) {
const ids = [
  "general",
  "matieres",
  "transportMatiere",
  "electricite",
  "eaudouce",
  "gaz",
  "eau",
  "distribution",
  "dechets",
  "refroidissement"
];


  const perCategory = {};
  let grandTotal = 0;

  ids.forEach((id) => {
    const list = Array.isArray(data[id]) ? data[id] : [];

    const sum = list.reduce((total, x) => {
      let emission = 0;

      switch (id) {

        /** -----------------------------
         *   MATIÈRES PREMIÈRES
         * ----------------------------- */
        case "matieres":
  emission = Number(x?.quantite || 0) * Number(x?.facteur || 0);
  break;

        /** -----------------------------
         *   ÉLECTRICITÉ
         * ----------------------------- */
        case "electricite":
          emission = Number(x?.valeur || 0) * Number(factors.electricite.kWh);
          break;

        /** -----------------------------
         *   EAU DE DÉCHARGE (STEP)
         * ----------------------------- */
     case "eau":
  emission = Number(x?.quantite || x?.valeur || 0) * factors.eau.Step;
  break;


        /** -----------------------------
         *   EAU DOUCE
         * ----------------------------- */
        case "eaudouce":
          emission =
            Number(x?.quantite || 0) * Number(factors.eaudouce.m3 || 0);
          break;

        /** -----------------------------
         *   GAZ
         * ----------------------------- */
        case "gaz":
          emission =
            Number(x?.valeur || 0) * Number(factors.gaz.Tep || 0);
          break;

        /** -----------------------------
         *   TRANSPORT MATIÈRES
         * ----------------------------- */
        case "transportMatiere":
          emission =
            Number(x?.distance || 0) *
            Number(factors.transportMatiere[x?.type] || 0);
          break;

        /** -----------------------------
         *   DISTRIBUTION
         * ----------------------------- */
        case "distribution":
          emission =
            Number(x?.distance || 0) *
            Number(factors.distribution[x?.type] || 0);
          break;

        /** -----------------------------
         *   DÉCHETS
         * ----------------------------- */
        case "dechets":
  emission =
    Number(x?.quantite || 0) * Number(x?.facteur || 0);
  break;


        /** -----------------------------
         *   REFROIDISSEMENT (GWP)
         * ----------------------------- */
        case "refroidissement":
          emission =
            Number(x?.quantite || 0) *
            Number(factors.refroidissement[x?.type] || 0);
          break;

        default:
          emission = Number(x?.emission || 0);
      }

      return total + emission;
    }, 0);

    perCategory[id] = sum;
    grandTotal += sum;
  });

  return { perCategory, grandTotal };
}
