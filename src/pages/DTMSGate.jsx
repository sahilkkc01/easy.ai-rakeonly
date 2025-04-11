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
                      <div className="row align-items-center">
                        <div className="col-md-12 d-flex gap-3 mb-5">
                          <button className={`btn btn-primary`}>Normal</button>
                          <button className={`btn btn-label-primary`}>
                            Unreadable
                          </button>
                        </div>
                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
                            <select
                              name="type"
                              id="type"
                              className="form-select"
                            >
                              <option value="EXIM">DSO IN EXIM</option>
                              <option value="EXIM">EXIM/Normal </option>
                              <option value="DOM">DOM</option>
                            </select>
                            <label htmlFor="type">Type</label>
                          </div>
                        </div>
                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Container No"
                              id="container_no"
                              name="container_no"
                              onChange={(e) => {
                                let myValue = e.target.value;
                                e.target.value = myValue.toUpperCase();
                              }}
                            />
                            <label htmlFor="container_no">Container No</label>
                          </div>
                        </div>
                        <div className="col-md-4 mb-4">
                          <label
                            htmlFor="file"
                            className="btn btn-sm btn-label-primary"
                          >
                            <input
                              hidden
                              className="form-control"
                              type="file"
                              id="file"
                              accept="image/*"
                              capture="environment"
                            />
                            <i className="ri-camera-fill"></i>&nbsp;&nbsp;Container Image
                          </label>
                        </div>
                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
                            <select
                              name="container_size"
                              id="container_size"
                              className="form-select"
                            >
                              <option value="40">Railside</option>
                              <option value="20">Path</option>
                              <option value="20">Stack Location</option>
                              <option value="20">Other</option>
                            </select>
                            <label htmlFor="container_no">Location</label>
                          </div>
                        </div>

                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Stack"
                              id="iso_code"
                              name="iso_code"
                            />
                            <label htmlFor="iso_code">Stack</label>
                          </div>
                        </div>

                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Row"
                              id="iso_code"
                              name="iso_code"
                            />
                            <label htmlFor="iso_code">Row</label>
                          </div>
                        </div>

                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Tear"
                              id="iso_code"
                              name="iso_code"
                            />
                            <label htmlFor="iso_code">Tear</label>
                          </div>
                        </div>

                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
                            <select
                              name="container_size"
                              id="container_size"
                              className="form-select"
                            >
                              <option value="40">YES</option>
                              <option value="20">No</option>
                            </select>
                            <label htmlFor="container_no">Damage Status</label>
                          </div>
                        </div>
                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Damage Remark"
                              id="iso_code"
                              name="iso_code"
                            />
                            <label htmlFor="iso_code">Damage Remark</label>
                          </div>
                        </div>

                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
                            <select
                              name="container_size"
                              id="container_size"
                              className="form-select"
                            >
                              <option value="40">40</option>
                              <option value="20">20</option>
                            </select>
                            <label htmlFor="container_no">Container Size</label>
                          </div>
                        </div>
                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="ISO Code"
                              id="iso_code"
                              name="iso_code"
                            />
                            <label htmlFor="iso_code">ISO Code</label>
                          </div>
                        </div>
                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Stack Name"
                              id="stack_name"
                              name="stack_name"
                            />
                            <label htmlFor="container_no">Stack Name</label>
                          </div>
                        </div>
                        <div className="col-md-4 mb-4">
                          <div className="form-floating form-floating-outline">
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
