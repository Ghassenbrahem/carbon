// src/components/Summary.js
import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import TotalBar from "./TotalBar";
import TotalCard from "./TotalCard";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Summary({ data, onPrev }) {
 const categories = [
  { id: "matiere", label: "Matières premières" },
  { id: "transportMatiere", label: "Transport matières premières" }, // ✅
  { id: "distribution", label: "Distribution" },                     // ✅
  { id: "eaux", label: "Eau de décharge" },
  { id: "refroidissement", label: "Refroidissement" }, // ⬅️ nouveau
  { id: "electricite", label: "Électricité" },
  { id: "eaudouce", label: "Eau " },
  { id: "gaz", label: "Gaz" },
  { id: "dechets", label: "Déchets" }
];


  // Totaux par catégorie
  const totals = categories.map((cat) => {
    const items = data?.[cat.id] || [];
    const sum = items.reduce((acc, cur) => acc + Number(cur.emission || 0), 0);
    return { id: cat.id, label: cat.label, value: sum };
  });

  const totalGeneral = totals.reduce((acc, t) => acc + t.value, 0);

  // Graph data
  const chartData = {
    labels: totals.map((t) => t.label),
    datasets: [
      {
        label: "tCO₂e",
        data: totals.map((t) => t.value),
        backgroundColor: [
          "#4cafef",
          "#ff9800",
          "#4caf50",
          "#9c27b0",
          "#f44336",
          "#00bcd4",
          "#8bc34a",
          "#ff5722",
        ],
      },
    ],
  };

  // Export Excel (feuille synthèse)
  const exportExcel = () => {
    const wsData = [
      ["Catégorie", "Émissions (tCO₂e)"],
      ...totals.map((t) => [t.label, t.value]),
      [],
      ["Total général", totalGeneral],
      [],
      ["Année", data?.general?.annee || ""],
      ["Entreprise", data?.general?.entreprise || ""],
      ["Site", data?.general?.site || ""],
      ["Type de produit", data?.general?.produit || ""],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bilan Carbone");
    const fileName = `Bilan_Carbone_${data?.general?.annee || new Date().getFullYear()}.xlsx`;
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  return (
    <div className="step-card">
      <h2>Synthèse des émissions</h2>

      {/* Carte "TOTAL DES ÉMISSIONS" */}
      <TotalCard total={totalGeneral} />

      {/* Barre de progression + encart à droite */}
      <TotalBar
        total={totalGeneral}
        max={200}                          // ajuste l’objectif/échelle
        year={data?.general?.annee}
        onDetails={() => {
          const el = document.getElementById("rapport-detaille");
          if (el) el.scrollIntoView({ behavior: "smooth" });
          // ou: exportExcel();
        }}
      />

      {/* Tableau détaillé */}
      <table id="rapport-detaille" className="data-table">
        <thead>
          <tr>
            <th>Catégorie</th>
            <th>Émissions (tCO₂e)</th>
          </tr>
        </thead>
        <tbody>
          {totals.map((t) => (
            <tr key={t.id}>
              <td>{t.label}</td>
              <td>{t.value.toFixed(2)}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td><strong>Total général</strong></td>
            <td><strong>{totalGeneral.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>

      {/* Graphiques */}
      <div className="charts-container" style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>Répartition par catégorie</h3>
          <Pie data={chartData} />
        </div>
        <div style={{ flex: 1 }}>
          <h3>Comparaison par catégorie</h3>
          <Bar data={chartData} />
        </div>
      </div>

      {/* Actions */}
      <div className="actions" style={{ marginTop: 20 }}>
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button className="primary" onClick={exportExcel}>Exporter en Excel</button>
      </div>
    </div>
  );
}
