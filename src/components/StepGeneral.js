import React, { useState, useEffect } from "react";

export default function StepGeneral({ data, setData, onNext }) {
  const [infos, setInfos] = useState(data.general || {});
  const [touched, setTouched] = useState({});

  const validateYear = (value) => {
    const v = String(value || "").trim();
    if (!/^\d{4}$/.test(v)) return "Saisir une année sur 4 chiffres (ex. 2025).";
    const n = Number(v);
    const MIN = 1990;
    const MAX = new Date().getFullYear() + 5;
    if (n < MIN || n > MAX) return `L’année doit être entre ${MIN} et ${MAX}.`;
    return "";
  };

  const errors = {
    annee: validateYear(infos.annee),
    produit: !String(infos.produit || "").trim() ? "Obligatoire." : "",
    entreprise: !String(infos.entreprise || "").trim() ? "Obligatoire." : "",
    site: !String(infos.site || "").trim() ? "Obligatoire." : "",
    volume: !String(infos.volume || "").trim() ? "Obligatoire." : ""
  };
  const isValid = Object.values(errors).every((e) => e === "");

  const handleChange = (e) => setInfos((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleYearInput = (e) => {
    const v = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
    setInfos((p) => ({ ...p, annee: v }));
  };
  const handleBlur = (e) => setTouched((p) => ({ ...p, [e.target.name]: true }));
  const markAllTouched = () => {
    const t = {}; ["annee","produit","entreprise","site","volume"].forEach((k)=>t[k]=true);
    setTouched(t);
  };

  const handleNext = () => {
    if (!isValid) { markAllTouched(); return; }
    setData({ ...data, general: infos });
    onNext();
  };

  const clearAll = () => {
    if (window.confirm("Supprimer toutes les informations générales ?")) {
      setInfos({});
      setData({ ...data, general: {} });
      setTouched({});
    }
  };

  // auto-save (utile si tu veux pousser la granularité)
  useEffect(() => {
    setData((prev) => ({ ...prev, general: infos }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infos]);

  const invalid = (k) => touched[k] && errors[k];

  return (
    <div className="step-card">
      <h2>Informations générales</h2>

      <input name="annee" placeholder="Année (ex: 2025)" value={infos.annee || ""} onChange={handleYearInput} onBlur={handleBlur} className={invalid("annee") ? "invalid" : ""}/>
      {invalid("annee") && <div className="error">{errors.annee}</div>}

      <input name="produit" placeholder="Type de produit/projet" value={infos.produit || ""} onChange={handleChange} onBlur={handleBlur} className={invalid("produit") ? "invalid" : ""}/>
      {invalid("produit") && <div className="error">{errors.produit}</div>}

      <input name="entreprise" placeholder="Nom de l’entreprise" value={infos.entreprise || ""} onChange={handleChange} onBlur={handleBlur} className={invalid("entreprise") ? "invalid" : ""}/>
      {invalid("entreprise") && <div className="error">{errors.entreprise}</div>}

      <input name="site" placeholder="Nom du site" value={infos.site || ""} onChange={handleChange} onBlur={handleBlur} className={invalid("site") ? "invalid" : ""}/>
      {invalid("site") && <div className="error">{errors.site}</div>}

      <input name="volume" placeholder="Volume de production" value={infos.volume || ""} onChange={handleChange} onBlur={handleBlur} className={invalid("volume") ? "invalid" : ""}/>
      {invalid("volume") && <div className="error">{errors.volume}</div>}

      <div className="actions">
        <button onClick={handleNext} disabled={!isValid}>Suivant</button>
        <button className="btn-danger" onClick={clearAll}>Supprimer tout</button>
      </div>
    </div>
  );
}
