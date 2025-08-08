// src/components/Summary.js
import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Summary({ data, onPrev }) {
  const categories = [
    { id: "matiere", label: "Matières premières" },
    { id: "produits", label: "Produits / Résidus" },
    { id: "eaux", label: "Eau de décharge" },
    { id: "electricite", label: "Électricité" },
    { id: "eaudouce", label: "Eau douce" },
    { id: "gaz", label: "Gaz" },
    { id: "dechets", label: "Déchets" },
    { id: "transport", label: "Transport" }
  ];

  // Calcul totaux
  const totals = categories.map(cat => {
    const items = data[cat.id] || [];
    const sum = items.reduce((acc, cur) => acc + Number(cur.emission || 0), 0);
    return { label: cat.label, value: sum };
  });

  const totalGeneral = totals.reduce((acc, t) => acc + t.value, 0);

  // Données pour graphiques
  const chartData = {
    labels: totals.map(t => t.label),
    datasets: [
      {
        label: "tCO₂e",
        data: totals.map(t => t.value),
        backgroundColor: [
          "#4cafef", "#ff9800", "#4caf50", "#9c27b0",
          "#f44336", "#00bcd4", "#8bc34a", "#ff5722"
        ]
      }
    ]
  };

  // Export Excel
  const exportExcel = () => {
    const wsData = [["Catégorie", "Émissions (tCO₂e)"], ...totals.map(t => [t.label, t.value])];
    wsData.push(["Total général", totalGeneral]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bilan Carbone");

    const fileName = `Bilan_Carbone_${new Date().getFullYear()}.xlsx`;
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  return (
    <div className="step-card">
      <h2>Synthèse des émissions</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Catégorie</th>
            <th>Émissions (tCO₂e)</th>
          </tr>
        </thead>
        <tbody>
          {totals.map((t, i) => (
            <tr key={i}>
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

      <div className="charts-container" style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ flex: 1 }}>
          <h3>Répartition par catégorie</h3>
          <Pie data={chartData} />
        </div>
        <div style={{ flex: 1 }}>
          <h3>Comparaison par catégorie</h3>
          <Bar data={chartData} />
        </div>
      </div>

      <div className="actions" style={{ marginTop: "20px" }}>
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button className="primary" onClick={exportExcel}>Exporter en Excel</button>
      </div>
    </div>
  );
}
