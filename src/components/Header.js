// src/components/Header.js
import React from "react";

// Utilise PUBLIC_URL pour être OK sur GitHub Pages
const uniLogo = process.env.PUBLIC_URL + "/images/universite.png";
const companyLogo = process.env.PUBLIC_URL + "/images/societe.png";

export default function Header() {
  return (
    <header className="topbar">
      <img src={uniLogo} alt="Université" className="logo left" />
      <div className="brand-title">Carbon Assistant</div>
      <img src={companyLogo} alt="Société" className="logo right" />
    </header>
  );
}
