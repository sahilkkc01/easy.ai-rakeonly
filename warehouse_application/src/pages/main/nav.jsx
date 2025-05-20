import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  const initialToggleSide = sessionStorage.getItem("myToggleSide") === "false";
  const [toggleSide, setToggleSide] = useState(initialToggleSide);
  const isWideScreen = window.innerWidth <= 1200;

  const initialTheme = sessionStorage.getItem("myTheme") === "true";
  const [theme, setTheme] = useState(initialTheme);
  const effectTrigger = useRef(false);

  const changeTheme = () => {
    setTheme((prevTheme) => !prevTheme);
    effectTrigger.current = !effectTrigger.current;
  };

  useEffect(() => {
    if (effectTrigger.current) {
      effectTrigger.current = !effectTrigger.current;
      sessionStorage.setItem("myTheme", theme);
      const coreCss = document.querySelector(".template-customizer-core-css");
      const themeCss = document.querySelector(".template-customizer-theme-css");

      if (theme) {
        document.documentElement.setAttribute("data-style", "dark");
        if (coreCss && themeCss) {
          coreCss.setAttribute("href", "/assets/vendor/css/rtl/core-dark.css");
          themeCss.setAttribute(
            "href",
            "/assets/vendor/css/rtl/theme-default-dark.css"
          );
        }
      } else {
        document.documentElement.setAttribute("data-style", "light");
        if (coreCss && themeCss) {
          coreCss.setAttribute("href", "/assets/vendor/css/rtl/core.css");
          themeCss.setAttribute(
            "href",
            "/assets/vendor/css/rtl/theme-default.css"
          );
        }
      }
    }
  }, [theme]);

  useEffect(() => {
    sessionStorage.setItem("myToggleSide", toggleSide);
    const SideMenu = sessionStorage.getItem("myToggleSide") === "true";
    if (isWideScreen) {
      if (SideMenu) {
        document.documentElement.className =
          "light-style layout-navbar-fixed layout-compact layout-menu-100vh layout-menu-fixed";
      } else {
        document.documentElement.className =
          "light-style layout-navbar-fixed layout-compact layout-menu-100vh layout-menu-fixed layout-menu-expanded";
      }
    }
  }, [toggleSide]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <nav
        className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
        id="layout-navbar"
      >
        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
          <a className="nav-item nav-link px-0 me-xl-6" >
            <i className="ri-menu-fill ri-24px" onClick={() => setToggleSide(!toggleSide)}></i>
          </a>
        </div>

        <div
          className="navbar-nav-right d-flex align-items-center"
          id="navbar-collapse"
        >
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="nav-item ">
              <h4 className="mb-0 me-4">{time.toLocaleTimeString()}</h4>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link btn btn-text-secondary rounded-pill btn-icon">
                <i
                  className={`${theme ? "ri-moon-line" : "ri-sun-line"
                    }  ri-22px`}
                  onClick={changeTheme}
                />
              </a>
            </li>

            <li className="nav-item navbar-dropdown dropdown-user dropdown">
              <a
                className="nav-link dropdown-toggle hide-arrow p-0"
                data-bs-toggle="dropdown"
              >
                <div className="avatar avatar-online">
                  <img
                    src="/assets/img/avatars/1.png"
                    alt=""
                    className="w-px-40 h-auto rounded-circle"
                  />
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end mt-3 py-2">
                <li>
                  <a className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-2">
                        <div className="avatar avatar-online">
                          <img
                            src="/assets/img/avatars/1.png"
                            alt=""
                            className="w-px-40 h-auto rounded-circle"
                          />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 small">John Doe</h6>
                        <small className="text-muted">Admin</small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item">
                    <i className="ri-user-3-line ri-22px me-2" />
                    <span className="align-middle">My Profile</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item">
                    <i className="ri-settings-4-line ri-22px me-2" />
                    <span className="align-middle">Settings</span>
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider" />
                </li>
                <li>
                  <div className="d-grid px-4 pt-2 pb-1">
                    <a
                      className="btn btn-danger d-flex"
                      href="#"
                      target="_blank"
                    >
                      <small className="align-middle">Logout</small>
                      <i className="ri-logout-box-r-line ms-2 ri-16px" />
                    </a>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* <!-- Search Small Screens --> */}
        <div className="navbar-search-wrapper search-input-wrapper d-none">
          <input
            type="text"
            className="form-control search-input container-xxl border-0"
            placeholder="Search..."
            aria-label="Search..."
          />
          <i className="ri-close-fill search-toggler cursor-pointer"></i>
        </div>
      </nav>
    </>
  );
}
