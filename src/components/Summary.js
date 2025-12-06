// ---------------------------
// IMPORTS EN TÊTE (OBLIGATOIRE)
// ---------------------------
import React, { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Pie, Bar } from "react-chartjs-2";

// Chart.js v4 – Enregistrement manuel
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,     // Pie charts
  BarElement,     // Bar charts
  CategoryScale,  // X axis
  LinearScale,    // Y axis
  Tooltip,
  Legend
);

// ---------------------------
// COMPOSANT Summary
// ---------------------------
export default function Summary({ data, onPrev }) {
  const pdfRef = useRef(null);

  const categories = [
    { id: "matiere", label: "Matières premières" },
    { id: "transportMatiere", label: "Transport matières premières" },
    { id: "distribution", label: "Distribution" },
    { id: "eaux", label: "Eau de décharge" },
    { id: "refroidissement", label: "Refroidissement" },
    { id: "electricite", label: "Électricité" },
    { id: "eaudouce", label: "Eau" },
    { id: "gaz", label: "Gaz" },
    { id: "dechets", label: "Déchets" }
  ];

  // Calcul totaux
  const totals = categories.map((cat) => {
    const items = data?.[cat.id] || [];
    const sum = items.reduce((acc, cur) => acc + Number(cur.emission || 0), 0);
    return { id: cat.id, label: cat.label, value: sum };
  });

  const totalGeneral = totals.reduce((s, t) => s + t.value, 0);

  // Données Chart.js
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
          "#ff5722"
        ]
      }
    ]
  };

  // ---------------------------
  // EXPORT PDF
  // ---------------------------
  const exportPDF = async () => {
    const input = pdfRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save("bilan_carbone.pdf");
  };

  return (
    <div className="step-card" ref={pdfRef}>
      <h2>Synthèse des émissions</h2>

      {/* TOTAL */}
      <div className="total-card">
        <h3>Total des émissions :</h3>
        <p style={{ fontSize: "32px", fontWeight: "bold" }}>
          {totalGeneral.toFixed(2)} tCO₂e
        </p>
      </div>

      {/* TABLEAU */}
      <table className="data-table">
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
        </tbody>
      </table>

      {/* GRAPHIQUES */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>Répartition par catégorie</h3>
          <Pie data={chartData} />
        </div>

        <div style={{ flex: 1 }}>
          <h3>Comparaison par catégorie</h3>
          <Bar data={chartData} />
        </div>
      </div>

      {/* BOUTONS */}
      <div className="actions" style={{ marginTop: 20 }}>
        <button className="secondary" onClick={onPrev}>
          Précédent
        </button>
        <button className="primary" onClick={exportPDF}>
          Exporter PDF
        </button>
      </div>
    </div>
  );
}
