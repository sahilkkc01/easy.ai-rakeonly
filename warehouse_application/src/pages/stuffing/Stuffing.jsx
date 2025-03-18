import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../main/header";
import Nav from "../main/nav";
import Footer from "../main/footer";

export default function Stuffing() {
  const containerModalRef = useRef(null);
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    const containerModalEl = document.getElementById("containerModal");
    if (containerModalEl) {
      containerModalRef.current = new Modal(containerModalEl);
    }
  }, []);

  // Open the Container Modal
  const openContainerModal = () => {
    if (containerModalRef.current) {
      containerModalRef.current.show();
    } else {
      console.error("Container modal instance is not available.");
    }
  };


  const GetFormData = async(e)=>{
    e.preventDefault();

    const url = `https://ctas.live/backend/api/get/de_stuffing_data/LCL/${e.target.container_no.value}`;
    try {
      const response = await axios.post(url);
      if (response?.data?.status=="success") {
        navigate(`/de-stuffing/bill-details?container_no=${e.target.container_no.value}`);
      } else {
        Swal.fire({
          icon: response?.data?.status,
          text: response?.data?.message,
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error Fetch Data: ${error.message}`,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  }

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
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header />
          <div className="layout-page">
            <Nav />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card card-body">
                  {/* Breadcrumb */}
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item fw-bold">
                        <Link to="/">Export</Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Stuffing
                      </li>
                    </ol>
                  </nav>

                  {/* Create New Button */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="fw-bold text-primary">Stuffing</h4>
                    <Link to={`/stuffing/bill-details`}
                      className="btn btn-success"
                    >
                      + Create Job
                    </Link>
                  </div>

                  {/* Tabs */}

                  {/* Data Table */}

                  <div className="table-responsive">
                    <table className="table table-striped table-font table-hover">
                      <thead className="table-primary">
                        <tr>
                          <th>#</th>
                          <th>Truck No</th>
                          <th>CRN</th>
                          <th>Created On</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>PB65BD0271</td>
                          <td>F240925032</td>
                          <td>
                            25/09/24 <sub>13:56</sub>
                          </td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>PB65BD0271</td>
                          <td>F240925032</td>
                          <td>
                            25/09/24 <sub>13:56</sub>
                          </td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>PB65BD0271</td>
                          <td>F240925032</td>
                          <td>
                            25/09/24 <sub>13:56</sub>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Container Modal */}
                  <div
                    className="modal fade"
                    id="containerModal"
                    tabIndex="-1"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <form action="" 
                        onSubmit={GetFormData}
                        >
                          <div className="modal-header bg-label-primary p-4">
                            <h5 className="modal-title">Stuffing</h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <p>Please Enter Container Number to Fetch Data</p>
                            <div className="form-floating form-floating-outline mb-6">
                              <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter Container Number"
                                name="container_no"
                                onChange={(e) => e.target.value = e.target.value.toUpperCase()}
                              />
                              <label htmlFor="Container_Number">
                                Container Number
                              </label>
                            </div>
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                            >
                              Fetch Data
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <Footer />
                <div className="content-backdrop fade" />
              </div>
            </div>
          </div>
          <div className="layout-overlay layout-menu-toggle"></div>
          <div className="drag-target"></div>
        </div>
      </div>
    </>
  );
}
