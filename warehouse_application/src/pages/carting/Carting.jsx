import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../main/header";
import Nav from "../main/nav";
import Footer from "../main/footer";
import { formatToDateTime, formatToDateTimeLocal } from "../main/formatToDateTime";


export default function Carting() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState("")
  const [view, setView] = useState("Table");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://ctas.live/backend/api/carting/live/data"
      );
      if (response.data.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch data.");

      Swal.fire({
        title: "Error!",
        text: "Failed to fetch data.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFinalSubmit = async (
    ID,
    crn_number,
    start_time,
    end_time
  ) => {
    setLoading(true);

    const url = `https://ctas.live/backend/api/carting/final/submit?id=${ID}&crn_number=${crn_number}&start_time=${start_time}&end_time=${end_time}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      if (response?.data?.status === "success") {
        fetchData();
        Swal.fire({
          icon: response?.data?.status,
          text: response?.data?.message,
          timer: 2000,
        }).then(() => {
          navigate(
            `/carting/bill-details?isFinalSubmit=1&id=${ID}&tally_sheet=1&crn_number=${crn_number}`
          );
        });
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
        text: `Error Fetching Data: ${error.message}`,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    let ID = formData.get("id");
    let crn_number = formData.get("crn_number");
    let start_time = formData.get("start_time");
    let end_time = formData.get("end_time");

    handleFinalSubmit(ID,crn_number, start_time, end_time);
  };

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
      <div className="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
        <div className="layout-container">
          <div className="layout-page">
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                  <div className="card-header">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="">
                        <h3 className="text-primary">Carting</h3>
                      </div>
                      <div className="">
                        <Link
                          to={`/carting/bill-details`}
                          className="btn btn-label-success"
                        >
                          + Create Job
                        </Link>
                        <Link to={`/`} className="btn btn-label-primary ms-2">
                          Go Back
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 px-4">
                    <div className="d-flex gap-2 align-items-center">
                      <button
                        className={`btn ${
                          view === "Table"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setView("Table")}
                      >
                        Table
                      </button>
                      <button
                        className={`btn ${
                          view === "Grid"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setView("Grid")}
                      >
                        Grid
                      </button>
                    </div>
                  </div>

                  <div className="card-body">
                    {view === "Table" ? (
                      <table className="table table-striped table-sm table-hover">
                        <thead className="table-primary">
                          <tr>
                            <th>#</th>

                            <th>Type</th>
                            <th>CRN</th>
                            <th>Gw Port</th>
                            <th>Start time</th>
                            <th>End time</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.length > 0 ? (
                            data.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>

                                <td>{item.type}</td>
                                <td>{item.crn_number}</td>
                                <td>{item.gw_port_code}</td>
                                <td>{item.start_time}</td>
                                <td>{item.end_time}</td>
                                <td>
                                <Link to={`/carting/bill-details?crn_number=${item.crn_number}`}
                                    className="btn btn-label-primary btn-sm mx-1"
                                  >
                                   Edit
                                  </Link>

                                  <button
                                    type="button"
                                    className="btn btn-label-info btn-sm mx-1"
                                    data-bs-toggle="modal"
                                    data-bs-target="#myModal"
                                    onClick={() => setModalData(item)}
                                  >
                                    Final Submit
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center">
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>   ) : (
                      <div className="row align-items-center justify-content-between">
                        {data && data.length > 0 ? (
                          data.map((item, index) => (
                            <div className="col-md-4 col-sm-6">
                              <div className="card border-primary border-1">
                                <div className="card-body ">
                                  <table className="table table-sm mb-0">
                                    <tbody>
                                      <tr>
                                        <td>Type</td>
                                        <td>
                                          <strong>{item.type}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>CRN.</td>
                                        <td>
                                          <strong>{item.crn_number}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>PORT</td>
                                        <td>
                                          <strong>{item.gw_port_code}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Start Time</td>
                                        <td>
                                          <strong>{formatToDateTime(item.start_time)}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                        <Link
                                      to={`/de-stuffing/bill-details?type=${item.type}&container_no=${item.container_number}`}
                                      className="btn btn-label-primary btn-sm mx-1"
                                    >
                                      Edit
                                    </Link>
                                    </td>
                                    <td>
                                    <button
                                      type="button"
                                      className="btn btn-label-info btn-sm mx-1"
                                      data-bs-toggle="modal"
                                      data-bs-target="#myModal"
                                      onClick={() => setModalData(item)}
                                    >
                                      Final Submit
                                    </button>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <h6 className="text-center">No data available</h6>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="modal fade"
                  id="myModal"
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Final Submit Data</h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        {/* Form inside the modal */}
                        <form onSubmit={handleSubmitForm}>
                            <input
                              type="hidden"
                              name="id"
                              className="form-control"
                              value={modalData?.id}
                            />
                          <div className="mb-3">
                            <label className="form-label">Crn Number </label>
                            <input
                              type="text"
                              name="crn_number"
                              className="form-control"
                              readOnly
                              value={modalData?.crn_number}

                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Start Time</label>
                            <input
                              type="datetime-local"
                              name="start_time"
                              className="form-control"
                              defaultValue={formatToDateTimeLocal(modalData?.start_time)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">End Time</label>
                            <input
                              type="datetime-local"
                              name="end_time"
                              className="form-control"
                              defaultValue={formatToDateTimeLocal(modalData?.end_time)}
                            />
                          </div>

                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary"
                                 data-bs-dismiss="modal"
                            >Final Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
