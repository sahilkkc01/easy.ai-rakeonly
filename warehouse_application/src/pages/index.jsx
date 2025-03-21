import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./main/header";
import Footer from "./main/footer";
import Nav from "./main/nav";

export default function Index() {
  return (
    <>
      <div className="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
        <div
          className="layout-container"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-photo/scene-with-photorealistic-logistics-operations-proceedings_23-2151468847.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.9,
          }}
        >
          <div
            className="layout-page"
            // style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
          >
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y ">
                <div className="container py-5">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "75vh" }}
                  >
                    <div className="row w-100 align-items-center justify-content-center gap-5">
                      <div className="col-lg-5 col-md-7">
                        <div className="rounded-3 px-3 py-5 text-center"
                         style={{backgroundColor:"#bebebe63"}}
                        //  style={{backgroundColor:"rgb(38 38 38 / 70%)"}}
                         >
                          <img
                            src="/import-export.png"
                            alt=""
                            style={{ width: "130px" }}
                          />
                          <h2 className="text-white">Import</h2>
                          <div className="d-flex justify-content-evenly">
                            <Link to="/de-stuffing" className="btn btn-primary">
                              DeStuffing
                            </Link>
                            <Link to="/delivery" className="btn btn-primary">
                              Delivery
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-5 col-md-7">
                        <div className="rounded-3 px-3 py-5 text-center "
                        //  style={{backgroundColor:"rgb(38 38 38 / 70%)"}}
                        style={{backgroundColor:"#bebebe63"}}
                         >
                          <img
                            src="/import-export.png"
                            alt=""
                            style={{ width: "130px" }}
                          />
                          <h2 className="text-white">Export</h2>
                          <div className="d-flex justify-content-evenly">
                            <Link to="/carting" className="btn btn-info">
                              Carting
                            </Link>
                            <Link to="/stuffing" className="btn btn-info">
                              Stuffing
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
