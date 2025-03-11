import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;

  const initialMenu = sessionStorage.getItem('myMenu') || 'light-style layout-navbar-fixed layout-compact layout-menu-fixed';
  const initialToggle = sessionStorage.getItem('myToggle') === 'true';

  const [menu, setMenu] = useState(initialMenu);
  const [toggle, setToggle] = useState(initialToggle);

  useEffect(() => {
    sessionStorage.setItem('myMenu', menu);
    sessionStorage.setItem('myToggle', toggle);

    document.documentElement.className = menu;
  }, [menu, toggle]);

  const changeMenuOnHover = () => {
    if (toggle) {
      setMenu('light-style layout-navbar-fixed layout-compact layout-menu-fixed layout-menu-collapsed layout-menu-hover');
    } else {
      setMenu('light-style layout-navbar-fixed layout-compact layout-menu-fixed');
    }
  };

  const changeMenuOffHover = () => {
    if (toggle) {
      setMenu('light-style layout-navbar-fixed layout-compact layout-menu-fixed layout-menu-collapsed');
    } else {
      setMenu('light-style layout-navbar-fixed layout-compact layout-menu-fixed');
    }
  };

  const changeMenuOnClick = () => {
    setMenu('light-style layout-navbar-fixed layout-compact layout-menu-fixed layout-menu-collapsed');
    setToggle(!toggle);
  };

  return (
    <>
      <aside
        id="layout-menu"
        className="layout-menu menu-vertical menu bg-menu-theme"
        onMouseOver={changeMenuOnHover}
        onMouseOut={changeMenuOffHover}
      >
        <div className="app-brand demo">
          <Link to="/" className="app-brand-link">
            <span className="app-brand-logo demo me-1">
              <span style={{ color: "var(--bs-primary)" }}>
                <svg
                  width={30}
                  height={24}
                  viewBox="0 0 250 196"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG Content */}
                </svg>
              </span>
            </span>
            <span className="app-brand-text demo menu-text fw-semibold">
              Warehouse
            </span>
          </Link>
          <a
            href="#"
            className="layout-menu-toggle menu-link text-large ms-auto"
          >
            <i className="menu-toggle-icon d-xl-block align-middle" onClick={changeMenuOnClick} />
          </a>
        </div>
        <div className="menu-inner-shadow" />
        <ul className="menu-inner py-1">
          <li className={`menu-item ${pathname === '/' || pathname === "/DeliveryLCL" || pathname === "/DeliveryFCL" || pathname === "/DestuffingFCL" || pathname === "/DestuffingLCL" || pathname === "/DirectDelivery" ? 'active' : ''}`}>
            <Link to="/" className="menu-link">
              <i className="menu-icon tf-icons ri-home-smile-line" />
              <div data-i18n="Dashboard">Dashboard</div>
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/jobs' ? 'active' : ''}`}>
            <Link to="/jobs" className="menu-link">
              <i class="menu-icon tf-icons ri-sofa-line"></i>
              <div data-i18n="Jobs">Jobs</div>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}
