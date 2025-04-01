import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../main/header";
import Nav from "../main/nav";
import Footer from "../main/footer";
import { formatToDateTime, formatToDateTimeLocal } from "../main/formatToDateTime";

export default function DeStuffing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [modalData, setModalData] = useState("");
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://ctas.live/backend/api/de_stuffing/live/data"
      );
      console.log("API Response:", response.data); // Debugging

      if (response.data && Array.isArray(response.data.data)) {
        setData(response.data.data); // Ensure we're setting an array
      } else {
        setError("Invalid data format received.");
        setData([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
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
    Type,
    ContainerNo,
    start_time,
    end_time
  ) => {
    setLoading(true);

    const url = `https://ctas.live/backend/api/de_stuffing/final/submit?id=${ID}&container_no=${ContainerNo}&start_time=${start_time}&end_time=${end_time}`;
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
            `/de-stuffing/bill-details?isFinalSubmit=1&id=${ID}&tally_sheet=1&type=${Type}&container_no=${ContainerNo}`
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
    let Type = formData.get("type");
    let ContainerNo = formData.get("container_no");
    let start_time = formData.get("start_time");
    let end_time = formData.get("end_time");

    handleFinalSubmit(ID, Type, ContainerNo, start_time, end_time);
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
                <div className="card my-5">
                  <div className="card-header">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="">
                        <h3 className="text-primary">DeStuffing</h3>
                      </div>
                      <div className="">
                        <Link
                          to={`/de-stuffing/bill-details`}
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
                  <div className="card-body">
                    <div className="table-responsive">
                      {/* <table className="table table-striped table-sm table-hover">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Container No</th>
                            <th>Container Size</th>
                            <th>Seal No</th>
                            <th>Bills No</th>
                            <th>Start Date Time</th>
                            <th>End Date Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>FCL</td>
                            <td>F240925032</td>
                            <td>40</td>
                            <td>BOL7864</td>
                            <td>
                              4100606 <br /> 2402099 <br /> 2402122
                            </td>
                            <td>25/09/24 13:56</td>
                            <td>25/09/24 13:56</td>
                          </tr>
                        </tbody>
                      </table> */}

                      <table className="table table-striped table-sm table-hover">
                        <thead>
                          <tr>
                            <th>Sr no</th>
                            <th>Type</th>
                            <th>Container No</th>
                            <th>Container Size</th>
                            <th>Seal No</th>
                            <th>Start Date Time</th>
                            <th>End Date Time</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data && data.length > 0 ? (
                            data.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.type}</td>
                                <td>{item.container_number}</td>
                                <td>{item.container_size}</td>
                                <td>{item.seal_number}</td>
                                <td>{formatToDateTime(item.start_time)}</td>
                                <td>{formatToDateTime(item.end_time)}</td>
                                <td>
                                  <Link to={`/de-stuffing/bill-details?type=${item.type}&container_no=${item.container_number}`}
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
                              <td colSpan="8" className="text-center">
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
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
                            <input
                              type="hidden"
                              name="type"
                              className="form-control"
                              value={modalData?.type}
                            />

                          <div className="mb-3">
                            <label className="form-label">Container No</label>
                            <input
                              type="text"
                              name="container_no"
                              className="form-control"
                              readOnly
                              value={modalData?.container_number}

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
