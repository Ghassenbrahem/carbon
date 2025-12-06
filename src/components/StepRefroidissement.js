import React, { useState, useEffect } from "react";
import facteurs from "../data/facteurs.json";

export default function StepRefroidissement({ data, setData, onNext, onPrev }) {
  const items = data.refroidissement || [];

  const gwpMap = {
    R134a: 1430,
    R404A: 3922,
    R410A: 2088,
    R22: 1760,
    R32: 675,
    ...(facteurs.refroidissement || {})
  };

  const [row, setRow] = useState({
    type: "R404A",
    quantite: "",
    gwp: gwpMap["R404A"] || 3922
  });

  useEffect(() => {
    const val = gwpMap[row.type];
    if (val) setRow((r) => ({ ...r, gwp: val }));
  }, [row.type]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!row.type || !row.quantite || !row.gwp) return;

    const q = Number(row.quantite);
    const g = Number(row.gwp);
    const emission = q * g;

    setData((prev) => ({
      ...prev,
      refroidissement: [
        ...(prev.refroidissement || []),
        { type: row.type, quantite: q, gwp: g, emission }
      ]
    }));

    setRow((r) => ({ ...r, quantite: "" }));
  };

  const removeItem = (i) => {
    const updated = [...items];
    updated.splice(i, 1);
    setData((prev) => ({
      ...prev,
      refroidissement: updated
    }));
  };

  const removeAll = () => {
    if (window.confirm("Supprimer toutes les lignes ?")) {
      setData((prev) => ({ ...prev, refroidissement: [] }));
    }
  };

  const totalSection = items.reduce((s, x) => s + Number(x.emission), 0);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Émissions – Systèmes de refroidissement</h2>

      {/* FORMULAIRE */}
      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20
        }}
      >
        {/* Select */}
        <select
          value={row.type}
          onChange={(e) => setRow({ ...row, type: e.target.value })}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "1px solid #d0d0d0",
            background: "#f1f5f9",
            flex: 1
          }}
        >
          {Object.keys(gwpMap).map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {/* Quantité */}
        <input
          type="number"
          placeholder="Quantité (kg)"
          value={row.quantite}
          onChange={(e) => setRow({ ...row, quantite: e.target.value })}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "1px solid #d0d0d0",
            background: "#f1f5f9",
            flex: 1
          }}
        />

        {/* GWP */}
        <input
          type="number"
          placeholder="GWP"
          value={row.gwp}
          onChange={(e) => setRow({ ...row, gwp: e.target.value })}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "1px solid #d0d0d0",
            background: "#f1f5f9",
            flex: 1
          }}
        />

        {/* Ajouter */}
        <button
          type="submit"
          style={{
            background: "#00994C",
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Ajouter
        </button>
      </form>

      {/* TABLEAU */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          borderRadius: 10,
          overflow: "hidden"
        }}
      >
        <thead>
          <tr
            style={{
              background: "linear-gradient(90deg, #003B73, #0056A6)",
              color: "white",
              textAlign: "left"
            }}
          >
            <th style={{ padding: 12 }}>TYPE</th>
            <th style={{ padding: 12 }}>QUANTITÉ (KG)</th>
            <th style={{ padding: 12 }}>GWP</th>
            <th style={{ padding: 12 }}>TOTAL (KGCO₂E)</th>
            <th style={{ padding: 12 }}></th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                Aucune donnée pour l’instant.
              </td>
            </tr>
          ) : (
            items.map((it, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8f8f8" }}>
                <td style={{ padding: 12 }}>{it.type}</td>
                <td style={{ padding: 12 }}>{it.quantite}</td>
                <td style={{ padding: 12 }}>{it.gwp}</td>
                <td style={{ padding: 12 }}>{it.emission.toFixed(2)}</td>
                <td style={{ padding: 12 }}>
                  <button
                    onClick={() => removeItem(i)}
                    style={{
                      background: "#C62828",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* FOOTER BUTTONS */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          onClick={onPrev}
          style={{
            background: "#00994C",
            color: "white",
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Précédent
        </button>

        <button
          onClick={onNext}
          style={{
            background: "#00994C",
            color: "white",
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Suivant
        </button>

        {items.length > 0 && (
          <button
            onClick={removeAll}
            style={{
              background: "#C62828",
              color: "white",
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Supprimer tout
          </button>
        )}
      </div>
    </div>
  );
}
