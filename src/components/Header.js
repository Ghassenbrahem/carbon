import React from "react";

// images depuis /public/images (OK pour GitHub Pages)
const uniLogo = process.env.PUBLIC_URL + "/images/universite.png";
const companyLogo = process.env.PUBLIC_URL + "/images/societe.png";

export default function Header() {
  return (
    <header className="topbar no-title">
      <div className="logo-group">
        <img src={uniLogo} alt="Université" className="logo" />
        <img src={companyLogo} alt="Société" className="logo" />
      </div>
      {/* on ne met rien au centre ni à droite -> plus de titre */}
    </header>
  );
}
