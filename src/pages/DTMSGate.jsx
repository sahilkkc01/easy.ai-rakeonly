import React, { useState, useEffect } from "react";
import Footer from "./main/footer";
import Nav from "./main/nav";

export default function Inventory() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && (
        <div
          className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 9999 }}
        >
          <div className="sk-chase sk-primary display-1">
            <div className="sk-chase-dot" />
            <div className="sk-chase-dot" />
            <div className="sk-chase-dot" />
            <div className="sk-chase-dot" />
            <div className="sk-chase-dot" />
            <div className="sk-chase-dot" />
          </div>
        </div>
      )}
      <div class="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
        <div class="layout-container">
          <Nav />
          <div className="layout-page">
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="container">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="text-primary">Inventory List</h4>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-floating form-floating-outline mb-6">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Container No"
                              id="container_no"
                              name="container_no"
                            />
                            <label htmlFor="container_no">Container No</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
