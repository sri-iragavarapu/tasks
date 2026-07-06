import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { FaSearch, FaShoppingBasket, FaBars } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navRef = useRef(null);

  // CLICK OUTSIDE HANDLER (ORDERED CLOSE)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!navRef.current?.contains(e.target)) {

        if (dropdownOpen) {
          setDropdownOpen(false);
          return;
        }

        if (menuOpen) {
          setMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, dropdownOpen]);

  return (
    <nav className="navbar" ref={navRef}>

      {/* HAMBURGER */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </div>

      {/* LEFT MENU */}
      <div className={`nav-left ${menuOpen ? "active" : ""}`}>

        <div className="menu-item">BAKERY</div>

        {/* DROPDOWN */}
        <div className="dropdown">

          <div
            className="menu-item"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            PAGES ▾
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">

              <div className="menu-item">ABOUT US</div>
              <div className="menu-item">LANDING</div>
              <div className="menu-item">BAKERY TEAM</div>
              <div className="menu-item">WORKSHOPS</div>

            </div>
          )}

        </div>

        <div className="menu-item">OUR BREAD</div>
        <div className="menu-item">CONTACT</div>

      </div>

      {/* CENTER LOGO */}
      <div className="center-logo">
        <img src="/img1.png" alt="logo" />
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        <div className="search-box">
          <FaSearch className="icon" />
          <input type="text" placeholder="Search..." />
        </div>

        <FaShoppingBasket className="icon" />

      </div>

    </nav>
  );
}

export default Navbar;