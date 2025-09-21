import React from "react";

// images depuis /public/images
const uniLogo = process.env.PUBLIC_URL + "/images/universite.png";
const companyLogo = process.env.PUBLIC_URL + "/images/societe.png";

export default function Header() {
  return (
    <header className="topbar">
      <img src={uniLogo} alt="Université" className="logo" />
      <img src={companyLogo} alt="Société" className="logo" />
    </header>
  );
}

