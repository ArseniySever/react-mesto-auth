import React from "react";
import logo from "../images/Vector.svg";
function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип" />
    </header>
  );
}
export default Header;
