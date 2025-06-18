import React, { useEffect, useRef, useState } from "react";
import Nav from "./main/nav";
import Footer from "./main/footer";
import axios from "axios";
import Swal from "sweetalert2";
import DownloadExcel from "./main/DownloadExcel";
import Header from "./main/header";
import { ApiBaseUrl } from "../Config";

export default function DTMSRst(){
  const NewUser = localStorage.getItem("user");
  const user = JSON.parse(NewUser);
  const formRef = useRef(null);
  const [Loading, setLoading] = useState(false);
  const [From, setFrom] = useState("");
  const [To, setTo] = useState("");
  const [FromStack, setFromStack] = useState("");
  const [ToStack, setToStack] = useState("");
  const [Error, setError] = useState(null);
  const [LastTransactionData, setLastTransactionData] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    const upperCaseFormValues = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => [
        key,
        value.toString().toUpperCase(),
      ])
    );

    UpdateData(upperCaseFormValues);
  };

  const UpdateData = async (upperCaseFormValues) => {
    // const url = `https://ctas.live/backend/api/yard/container/transaction/post`;
    const url = `${ApiBaseUrl}/yard/container/transaction/post`;
    try {
      const response = await axios.post(url, upperCaseFormValues, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.message) {
        Swal.fire({
          icon: "success",
          text: response.data.message,
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          // window.location.reload();
          if (formRef.current) {
            formRef.current.reset(); // Reset form fields
          }
          getLastData();
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "No message returned from the server.",
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error in Data Submit: ${error.message}`,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    console.log(formValues);
    getData(formValues);
  };

  const getData = async (formValues) => {
    // const url = `https://ctas.live/backend/api/yard/container/transaction/data?created_by=${user.id}&start=${formValues.start}&end=${formValues.end}`;
    const url = `${ApiBaseUrl}/yard/container/transaction/data?created_by=${user.id}&start=${formValues.start}&end=${formValues.end}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.data) {
        console.log(response.data.data);

        const transformations = [];
        const columnsToDelete = ["id", "status", "updated_at", "user_id","created_by"];
        const fileName = "UserData";

        DownloadExcel(
          response.data.data,
          columnsToDelete,
          fileName,
          transformations
        );
      } else {
        Swal.fire({
          icon: "error",
          text: "No message returned from the server.",
          // timer: 3000,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error in Data Submit: ${error.message}`,
        // timer: 3000,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLastData();
  }, []);

  const getLastData = async () => {
    setLoading(true);
    // const url = `https://ctas.live/backend/api/yard/container/last/transaction/data?created_by=${user.id}`;
    const url = `${ApiBaseUrl}/yard/container/last/transaction/data?created_by=${user.id}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.data) {
        setLastTransactionData(response.data.data);
        console.log(response.data.data);
      } else {
        Swal.fire({
          icon: "error",
          text: "No message returned from the server.",
          // timer: 3000,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error in Data Submit: ${error.message}`,
        // timer: 3000,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {Loading && (
        <div
          className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark-subtle"
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
                  <div className="content-wrapper">
                    <Nav />
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="container">
                  <div className="card card-body my-5">
                    <div className="d-flex justify-content-between">
                      <h3 className="text-primary">DTMS Yard Transactions</h3>
                      <div className="text-end">
                        <button
                          className="btn btn-sm btn-label-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          Export{" "}
                        </button>
                      </div>

                      <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <form action="" onSubmit={handleFormFilter}>
                              <div className="modal-header bg-label-primary pb-2">
                                <h1
                                  className="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
                                  Export Data
                                </h1>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                />
                              </div>
                              <div className="modal-body border-bottom">
                                <div className="row">
                                  <input
                                    type="hidden"
                                    name="created_by"
                                    defaultValue={user.id}
                                  />
                                  <div className="col-md-6 mb-6">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="start"
                                        name="start"
                                      />
                                      <label htmlFor="start">
                                        Start Date Time Range
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="end"
                                        name="end"
                                      />
                                      <label htmlFor="end">
                                        End Date Time Range
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="modal-footer py-3 ">
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
                                >
                                  Download
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <form action="" onSubmit={handleFormSubmit} id="handleFormSubmit" ref={formRef}>
                      <div className="row">
                        <input
                          type="hidden"
                          name="created_by"
                          defaultValue={user.id}
                        />
                        <div className="col-md-12 FFFmb-5">
                          <div className="form-floating form-floating-outline">
                            <input
                              type="text"
                              className="form-control"
                              id="container_no"
                              name="container_no"
                              placeholder="Container No"
                            />
                            <label htmlFor="container_no">Container No</label>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-12 mb-5">
                          <div className="d-flex align-items-center">
                            <div className="me-4 fw-bold">From</div>
                            <div className="d-flex align-items-center mt-3">
                              <div className="form-check me-3">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="from"
                                  id="fromTruck"
                                  value="Truck"
                                  onChange={(e) => setFrom(e.target.value)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="fromTruck"
                                >
                                  Truck
                                </label>
                              </div>
                              <div className="form-check me-3">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="from"
                                  id="fromRake"
                                  value="Rake"
                                  onChange={(e) => setFrom(e.target.value)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="fromRake"
                                >
                                  Rake
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="from"
                                  id="fromStack"
                                  value="Stack"
                                  onChange={(e) => setFrom(e.target.value)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="fromStack"
                                >
                                  Stack
                                </label>
                              </div>
                            </div>
                          </div>
                          {From === "Stack" && (
                            <div className="col-md-6  mt-3">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  id="FromStack"
                                  className="form-control"
                                  placeholder="Enter details..."
                                  name="FromStack"
                                  onKeyUp={(e) => setFromStack(e.target.value)}
                                />
                                <label
                                  htmlFor="FromStack"
                                  className="form-label"
                                >
                                  Enter Stack Details
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-12 mb-5">
                          <div className="d-flex align-items-center">
                            <div className="me-4 fw-bold">To</div>
                            <div className="d-flex align-items-center mt-3">
                              <div className="form-check me-3">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="to"
                                  id="toTruck"
                                  value="Truck"
                                  onChange={(e) => setTo(e.target.value)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="toTruck"
                                >
                                  Truck
                                </label>
                              </div>
                              <div className="form-check me-3">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="to"
                                  id="toRake"
                                  value="Rake"
                                  onChange={(e) => setTo(e.target.value)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="toRake"
                                >
                                  Rake
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="to"
                                  id="toStack"
                                  value="Stack"
                                  onChange={(e) => setTo(e.target.value)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="toStack"
                                >
                                  Stack
                                </label>
                              </div>
                            </div>
                          </div>
                          {To === "Stack" && (
                            <div className="col-md-6  mt-3">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  id="ToStack"
                                  className="form-control"
                                  placeholder="Enter details..."
                                  name="ToStack"
                                  onKeyUp={(e) => setToStack(e.target.value)}
                                />
                                <label htmlFor="ToStack" className="form-label">
                                  Enter Stack Details
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-4">
                          <button
                            type="submit"
                            className="btn btn-label-primary"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="card card-body my-5">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Container</th>
                            <th>From</th>
                            <th>To</th>
                          </tr>
                        </thead>
                        <tbody>
                          {LastTransactionData &&
                            LastTransactionData.map((Data, i) => (
                              <tr key={i}>
                                <td>{i+1}</td>
                                <td>{Data.container_no}</td>
                                <td>{Data.from}</td>
                                <td>{Data.to}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
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
};

