import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./main/header";
import Footer from "./main/footer";
import Nav from "./main/nav";






export default function Index() {


  return (
    <>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header />
          <div className="layout-page">
            <Nav />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row gy-6">


                  <div className="container py-5">

                    <div className="row">

                      {/* Import Box */}
                      <div className="col-md-6">

                        <div className="card p-4 text-center shadow-sm card-box border-0">
                          <div className="icon-box bg-primary text-white mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>

                          </div>
                          <h4 className="fw-semibold">Import</h4>
                          <div className="d-flex justify-content-evenly">
                            <Link to="/DeliveryLCL" className="btn btn-label-primary">
                              DeStuffing
                            </Link>
                            <Link to="/DeliveryLCL" className="btn btn-label-primary">
                            Delivery
                            </Link>
                            {/* <Link to="/DeliveryLCL" className="btn btn-label-primary">
                              Delivery LCL
                            </Link>
                            <Link to="/DeliveryFCL" className="btn btn-label-primary">
                              Delivery FCL
                            </Link> */}
                          </div>
                          {/* <div className="d-flex mt-3 justify-content-evenly">
                            <Link to="/DirectDelivery " className="btn btn-label-primary">
                              Direct Delivery
                            </Link>
                            <Link to="/DestuffingLCL" className="btn btn-label-primary">
                              Destuffing LCL
                            </Link>
                          </div>
                          <div className="d-flex mt-3 justify-content-evenly">
                            <Link to="/DestuffingFCL" className="btn btn-label-primary">
                              Destuffing FCL
                            </Link>

                          </div> */}
                        </div>

                      </div>

                      {/* Export Box */}
                      <div className="col-md-6">

                        <div className="card p-4 text-center shadow-sm card-box border-0">
                          <div className="icon-box bg-success text-white mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>

                          </div>
                          <h4 className="fw-semibold">Export</h4>
                          <div className="d-flex justify-content-evenly">
                            <Link to="/CartingLCL" className="btn btn-label-success">
                              Carting 
                            </Link>
                            <Link to="/CartingFCL" className="btn btn-label-success">
                            Stuffing
                            </Link>
                          </div>
                          {/* <div className="d-flex mt-3 justify-content-evenly">
                            <Link to="/DirectStuffing " className="btn btn-label-success">
                              Direct Stuffing
                            </Link>
                            <Link to="/StuffingLCL" className="btn btn-label-success">
                              Stuffing LCL
                            </Link>
                          </div>
                          <div className="d-flex mt-3 justify-content-evenly">
                            <Link to="/StuffingFCL" className="btn btn-label-success">
                              Stuffing FCL
                            </Link>

                          </div> */}

                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="layout-overlay layout-menu-toggle"></div>
              <div className="drag-target"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
