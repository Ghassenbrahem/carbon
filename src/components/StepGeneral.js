import React, { useState, useEffect } from "react";

export default function StepGeneral({ data, setData, onNext }) {
  const [infos, setInfos] = useState({
    ...(data.general || {}),
    images: (data.general && data.general.images) || []
  });
  const [touched, setTouched] = useState({});
  const [imgIndex, setImgIndex] = useState(0); // position actuelle dans la galerie

  // ---------- Validation ----------
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
    // typePneu & description sont optionnels
  };
  const isValid = Object.values(errors).every((e) => e === "");

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfos((p) => ({ ...p, [name]: value }));
  };

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
      setImgIndex(0);
    }
  };

  // auto-save de la section
  useEffect(() => {
    setData((prev) => ({ ...prev, general: infos }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infos]);

  // ---------- Gestion images ----------
  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setInfos((prev) => {
        const arr = [...(prev.images || []), { name: file.name, dataUrl }];
        return { ...prev, images: arr };
      });
      setImgIndex((idx) => Math.max(0, (infos.images?.length || 0))); // aller sur la dernière
    };
    reader.readAsDataURL(file);
    // reset input pour pouvoir re-uploader le même nom
    e.target.value = "";
  };

  const hasImages = (infos.images || []).length > 0;

  const prevImage = () => {
    if (!hasImages) return;
    setImgIndex((i) => (i - 1 + infos.images.length) % infos.images.length);
  };

  const nextImage = () => {
    if (!hasImages) return;
    setImgIndex((i) => (i + 1) % infos.images.length);
  };

  const removeCurrentImage = () => {
    if (!hasImages) return;
    const updated = [...infos.images];
    updated.splice(imgIndex, 1);
    setInfos((p) => ({ ...p, images: updated }));
    setImgIndex(0);
  };

  const invalid = (k) => touched[k] && errors[k];

  return (
    <div className="step-card">
      <h2>Informations générales</h2>

      <input
        name="annee"
        placeholder="Année (ex: 2025)"
        value={infos.annee || ""}
        onChange={handleYearInput}
        onBlur={handleBlur}
        className={invalid("annee") ? "invalid" : ""}
      />
      {invalid("annee") && <div className="error">{errors.annee}</div>}

      <input
        name="produit"
        placeholder="Type de produit/projet"
        value={infos.produit || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className={invalid("produit") ? "invalid" : ""}
      />
      {invalid("produit") && <div className="error">{errors.produit}</div>}

      <input
        name="entreprise"
        placeholder="Nom de l’entreprise"
        value={infos.entreprise || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className={invalid("entreprise") ? "invalid" : ""}
      />
      {invalid("entreprise") && <div className="error">{errors.entreprise}</div>}

      <input
        name="site"
        placeholder="Nom du site"
        value={infos.site || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className={invalid("site") ? "invalid" : ""}
      />
      {invalid("site") && <div className="error">{errors.site}</div>}

      <input
        name="volume"
        placeholder="Volume de production"
        value={infos.volume || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className={invalid("volume") ? "invalid" : ""}
      />
      {invalid("volume") && <div className="error">{errors.volume}</div>}

      {/* --- Nouveau : Type de pneu --- */}
      <select name="typePneu" value={infos.typePneu || ""} onChange={handleChange}>
        <option value="">Type de pneu (optionnel)</option>
        <option value="tourisme">Tourisme</option>
        <option value="camion">Camion</option>
        <option value="agricole">Agricole</option>
        <option value="industriel">Industriel</option>
        <option value="2-roues">2-roues</option>
        <option value="autre">Autre</option>
      </select>

      {/* --- Nouveau : Description --- */}
      <textarea
        name="description"
        placeholder="Description (optionnelle)…"
        value={infos.description || ""}
        onChange={handleChange}
        rows={3}
        style={{
          width: "100%",
          background: "var(--panel-2)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "8px 12px",
          marginTop: 8
        }}
      />

      {/* --- Nouveau : Galerie d’images avec flèches --- */}
      <div
        className="image-picker"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 12,
          flexWrap: "wrap"
        }}
      >
        <input type="file" accept="image/*" onChange={onPickImage} />
        {hasImages && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button type="button" className="secondary" onClick={prevImage}>◀</button>
            <div
              style={{
                width: 160,
                height: 100,
                border: "1px solid var(--border)",
                borderRadius: 8,
                overflow: "hidden",
                background: "var(--panel-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              title={infos.images[imgIndex]?.name}
            >
              {/* preview */}
              {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
              <img
                src={infos.images[imgIndex]?.dataUrl}
                alt="aperçu image"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
            <button type="button" className="secondary" onClick={nextImage}>▶</button>
            <button type="button" className="btn-danger" onClick={removeCurrentImage}>
              Supprimer l’image
            </button>
          </div>
        )}
      </div>

      <div className="actions" style={{ marginTop: 12 }}>
        <button onClick={handleNext} disabled={!isValid}>Suivant</button>
        <button className="btn-danger" onClick={clearAll}>Supprimer tout</button>
      </div>
    </div>
  );
}
