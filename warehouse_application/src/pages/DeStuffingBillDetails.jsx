import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import Header from "./main/header";
import Nav from "./main/nav";
import Footer from "./main/footer";
import axios from "axios";
import Swal from "sweetalert2";

export default function DeStuffingBillDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ContainerNo, setContainerNo] = useState(null);
  const [Data, setData] = useState(null);
  const [Locations, setLocations] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = async (containerNo) => {
    setLoading(true);
    const url = `https://ctas.live/backend/api/get/de_stuffing_data/LCL/${containerNo}`;
    try {
      const response = await axios.get(url);
      if (response?.data?.status === "success") {
        setData(response?.data?.data);
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

  const fetchLocations = async () => {
    setLoading(true);
    const url = `https://ctas.live/backend/api/warehouse/empty/locations?type=Import`;
    try {
      const response = await axios.get(url);
      if (response?.data?.status === "success") {
        setLocations(response?.data?.data);
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

  const GetFormData = async (e) => {
    e.preventDefault();
    const container_no = e.target.container_no.value.toUpperCase();
    setContainerNo(container_no);
    setSearchParams({ container_no });
    fetchData(container_no);
  };

  useEffect(() => {
    const container_no = searchParams.get("container_no");
    if (container_no) {
      setContainerNo(container_no);
      fetchData(container_no);
    }
  }, [searchParams]);

  useEffect(() => {
    if (Data) {
      fetchLocations();
    }
  }, [Data]);

  const GridComponent = ({ details, index }) => {
    const [gridInputs, setGridInputs] = useState([{ id: 1 }]);

    const addGridInput = () => {
      setGridInputs([...gridInputs, { id: gridInputs.length + 1 }]);
    };

    return (
      <div className="col-3">
        <label className="form-label">Grid Location & Area (SQM)</label>
        {gridInputs.map((input, i) => (
          <div key={input.id} className="d-flex align-items-center gap-3 mb-2">
            <select className="form-select p-2">
              <option selected disabled>
                Select Location
              </option>
              {Locations?.map((location, j) => (
                <option key={j} value={location.camera_locations}>
                  {location.camera_locations}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control p-2"
              placeholder="Area (SQM)"
            />
            <button
              className="btn btn-success btn-sm px-2 py-1"
              onClick={addGridInput}
            >
              +
            </button>
          </div>
        ))}
      </div>
    );
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
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header />
          <div className="layout-page">
            <Nav />
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                {Data && ContainerNo ? (
                  <>
                    <div className="row">
                      <h4 className="text-primary mb-3">Bill Details</h4>
                      {Data?.de_stuffing_bill_details?.map((details, i) => (
                        <div key={i} className="card card-body px-3 py-4 my-2">
                          <div className="row">
                            <div className="col-2">
                              <label htmlFor="billNo" className="form-label">
                                Bill Number
                              </label>
                              <input
                                type="text"
                                className="form-control p-2"
                                defaultValue={details?.bol_number}
                              />
                            </div>
                            <div className="col-3">
                              <label className="form-label">
                                Cargo Description (Code)
                              </label>
                              <input
                                type="text"
                                className="form-control p-2"
                                defaultValue={details?.commodity_description}
                              />
                            </div>
                            <div className="col-2">
                              <label className="form-label">No of Pkgs</label>
                              <input
                                type="number"
                                className="form-control p-2"
                                defaultValue={details?.no_of_packages_declared}
                              />
                            </div>
                            <div className="col-2">
                              <label className="form-label">Pkg Weight</label>
                              <input
                                type="text"
                                className="form-control p-2"
                                defaultValue={details?.package_weight}
                              />
                            </div>
                            <GridComponent details={details} index={i} />
                          </div>
                        </div>
                      ))}
                      <button className="btn btn-primary w-20 mt-3">
                        Submit
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="row justify-content-center align-items-center h-75">
                    <div className="col-6">
                      <div className="card my-3">
                        <div className="card-body">
                          <h4 className="text-center text-primary">
                            DeStuffing
                          </h4>
                          <form action="" onSubmit={GetFormData}>
                            <p>Please Enter Container Number to Fetch Data</p>
                            <div className="form-floating form-floating-outline mb-6">
                              <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter Container Number"
                                name="container_no"
                                onChange={(e) =>
                                  (e.target.value =
                                    e.target.value.toUpperCase())
                                }
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
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
