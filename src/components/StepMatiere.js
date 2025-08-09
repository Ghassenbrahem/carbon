import React, { useState } from "react";

export default function StepMatiere({ data, setData, onNext, onPrev }) {
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [facteur, setFacteur] = useState("");

  // On lit depuis formData global
  const matieres = data.matieres || [];

  const ajouterMatiere = () => {
    if (!nom || !quantite || !facteur) return;

    setData(prev => ({
      ...prev,
      matieres: [
        ...(prev.matieres || []),
        {
          nom,
          quantite: parseFloat(quantite),
          facteur: parseFloat(facteur)
        }
      ]
    }));

    setNom("");
    setQuantite("");
    setFacteur("");
  };

  const supprimerTout = () => {
    setData(prev => ({
      ...prev,
      matieres: []
    }));
  };

 

  return (
    <div>
      <h2>Matières premières</h2>

      {/* Champs de saisie */}
      <input
        type="text"
        placeholder="Nom (acier, plastique...)"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantité"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
      />
      <input
        type="number"
        placeholder="Facteur"
        value={facteur}
        onChange={(e) => setFacteur(e.target.value)}
      />
      <button onClick={ajouterMatiere}>Ajouter</button>

      {/* Tableau */}
      {matieres.length === 0 ? (
        <p>Aucune matière pour l'instant.</p>
      ) : (
      <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Quantité</th>
              <th>Facteur</th>
              <th>Total (tCO₂e)</th>
            </tr>
          </thead>
          <tbody>
            
            {matieres.map((m, i) => (
              <tr key={i}>
                <td>{m.nom}</td>
                <td>{m.quantite}</td>
                <td>{m.facteur}</td>
                <td>{(m.quantite * m.facteur).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div>
        <button onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
        <button onClick={supprimerTout}>Supprimer tout</button>
      </div>
    </div>
  );
}
