import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  const user_permissions = localStorage.getItem("user_permissions");
  const [permissions, setPermissions] = useState([]);
  const initialToggleSide = sessionStorage.getItem("myToggleSide") === "false";
  const [toggleSide, setToggleSide] = useState(initialToggleSide);
  const isWideScreen = window.innerWidth <= 1200;

  useEffect(() => {
    if (user_permissions) {
      // Parse the JSON string back into an object
      const parsedPermissions = JSON.parse(user_permissions);
      setPermissions(parsedPermissions);
      // console.log(parsedPermissions);
      // This will now log the object correctly
    }
  }, [user_permissions]);
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

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
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

  return (
    <>
      <nav
        className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme px-3"
        id="layout-navbar"
      >
        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
          <a className="nav-item nav-link px-0 me-xl-6" href="#">
            <i
              className="ri-menu-fill ri-24px"
              onClick={() => setToggleSide(!toggleSide)}
            ></i>
          </a>
        </div>

        <div
          className="navbar-nav-right d-flex align-items-center"
          id="navbar-collapse"
        >
          {/* <!-- Search --> */}
          {/* <div className="navbar-nav align-items-center gap-2">
            <div className="nav-item navbar-search-wrapper mb-0">
              <div className="d-none d-md-inline-block text-muted ms-1_5">
                <a href="http://gate.easyaiconnect.com/" className="btn btn-outline-primary waves-effect waves-light me-2">Gate</a>
                <a href="http://rake.easyaiconnect.com/" className="btn btn-outline-primary waves-effect waves-light me-2">Rake</a>
                <a href="http://yard.easyaiconnect.com/" className="btn btn-outline-primary waves-effect waves-light me-2">Yard</a>
                <a href="http://warehouse.easyaiconnect.com/" className="btn btn-primary waves-effect waves-light me-2">Warehouse</a>
                <a href="http://equipment.easyaiconnect.com/" className="btn btn-outline-primary waves-effect waves-light me-2">Equipment</a>
              </div>
            </div>
          </div> */}
          {localStorage.getItem("equipment_id") && (
            <div className="navbar-nav align-items-center gap-2 ms-5">
              <div className="nav-item navbar-search-wrapper mb-0">
                <button className="btn btn-primary ">
                  {" "}
                  {localStorage.getItem("equipment_id")}
                </button>
              </div>
            </div>
          )}
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="nav-item ">
              <h4 className="mb-0 me-4">{time.toLocaleTimeString()}</h4>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link btn btn-text-secondary rounded-pill btn-icon">
                <i
                  className={`${
                    theme ? "ri-moon-line" : "ri-sun-line"
                  }  ri-22px`}
                  onClick={changeTheme}
                />
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to={"/Logout"}
                className="nav-link btn btn-text-danger rounded-pill btn-icon btn-label-danger"
              >
                {/* <i class="ri-logout-box-r-line ri-24px"></i> */}
                <img src="/logout.png" style={{ width: "22px" }} alt="" />
              </Link>
            </li>

            <li className="nav-item navbar-dropdown dropdown-user dropdown d-none">
              <Link
                className="nav-link dropdown-toggle hide-arrow p-0"
                data-bs-toggle="dropdown"
              >
                <div className="avatar avatar-online me-2">
                  <img
                    src="/assets/img/avatars/1.png"
                    alt=""
                    className="w-px-40 h-auto rounded-circle"
                  />
                </div>
              </Link>
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
                    <Link to={"/Logout"} className="btn btn-danger d-flex">
                      <small className="align-middle">Logout</small>
                      <i className="ri-logout-box-r-line ms-2 ri-16px" />
                    </Link>
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
