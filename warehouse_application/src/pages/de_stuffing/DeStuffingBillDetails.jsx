import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../main/header";
import Nav from "../main/nav";
import Footer from "../main/footer";
import { formatToDateTimeLocal } from "../main/formatToDateTime";

export default function DeStuffingBillDetails() {
  const iframeRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [Type, setType] = useState(null);
  const [ContainerNo, setContainerNo] = useState(null);
  const [TallySheet, setTallySheet] = useState(null);
  const [Data, setData] = useState(null);
  const [Locations, setLocations] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const today = new Date();

  const fetchData = async (type, containerNo) => {
    setLoading(true);
    const url = `https://ctas.live/backend/api/get/de_stuffing/${type}/${containerNo}`;
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
    const type = e.target.type.value.toUpperCase();
    setContainerNo(container_no);
    setType(type);
    setSearchParams({ type, container_no });
    // fetchData(type,container_no);
  };

  useEffect(() => {
    const container_no = searchParams.get("container_no");
    const type = searchParams.get("type");
    const tallySheet = searchParams.get("tally_sheet");
    if (container_no && type) {
      setContainerNo(container_no);
      setType(type);
      if (tallySheet) {
        setTallySheet(tallySheet);
      } else {
        fetchData(type, container_no);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (Data) {
      fetchLocations();
    }
  }, [Data]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const url = `https://ctas.live/backend/api/de_stuffing/update`;
    try {
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      if (response?.data?.status === "success") {
        Swal.fire({
          icon: response?.data?.status,
          text: response?.data?.message,
          timer: 2000,
        }).then(() => {
          navigate(`?tally_sheet=1&type=${Type}&container_no=${ContainerNo}`);
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

  const GridComponent = ({ details, index }) => {
    const [gridInputs, setGridInputs] = useState([{ id: 1 }]);

    const addGridInput = () => {
      setGridInputs([...gridInputs, { id: gridInputs.length + 1 }]);
    };

    return (
      <div className="col-md-3 col-5">
        <label className="form-label">Grid Location & Area (SQM)</label>
        {gridInputs.map((input, i) => (
          <div key={input.id} className="d-flex align-items-center gap-3 mb-2">
            <select
              className="form-select p-2"
              name={`grid_locations[${details.id}][${i}]`}
              onChange={(e) => GridAreaHandle(e.target.value, details.id, i)}
            >
              <option selected disabled>
                Select Grid
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
              name={`area[${details.id}][${i}]`}
              id={`area_${details.id}_${i}`}
            />
            <button
              type="button"
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

  const GridAreaHandle = (grid, id, key) => {
    let totalArea = 0;
    let occupied = 0;
  
    Locations?.forEach((location) => {
      if (location.camera_locations === grid) {
        totalArea += parseInt(location.total_area) || 0;
        occupied += parseInt(location.occupied_area) || 0;
      }
    });
  
    let available = totalArea - occupied;
    let areaInput = document.getElementById(`area_${id}_${key}`);
  
    if (areaInput) {
      areaInput.value = available >= 0 ? available : 0;
      areaInput.max = available >= 0 ? available : 0; 
    }
  };
  
  const handleBillPkgW = (id, pkg) => {
    let no_of_pkgs = 0;
    let package_weight = 0;
    let Per_package_weight = 0;

    Data?.de_stuffing_bill_details?.forEach((details) => {
      if (details.id == id) {
        package_weight += parseFloat(details.package_weight) || 0;
        no_of_pkgs += parseFloat(details.no_of_packages_declared) || 0;
      }
    });
    if (
      package_weight &&
      no_of_pkgs &&
      package_weight != 0 &&
      no_of_pkgs != 0
    ) {
      Per_package_weight += package_weight / no_of_pkgs.toFixed(2);
    }

    let weightInput = document.getElementById(`package_weight_${id}`);

    if (weightInput) {
      if (pkg && pkg != 0) {
        weightInput.value = (Per_package_weight * pkg).toFixed(2);
      } else {
        weightInput.value = parseFloat(Per_package_weight) || 0;
      }
    } else {
      console.log("Package weight input not found!");
    }
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
                {ContainerNo && Type && TallySheet ? (
                  <div className="row justify-content-center">
                    <div className="col-lg-10 col-md-11">
                      <div className="text-end">
                        <button
                          onClick={() => {
                            if (iframeRef.current) {
                              iframeRef.current.contentWindow.print();
                            }
                          }}
                          className="btn btn-label-primary mb-2"
                        >
                          Print
                        </button>
                        <a href="?" className="btn btn-primary mb-2 ms-2">
                          Search Another
                        </a>
                        <Link
                          to={"/de-stuffing"}
                          className="btn btn-primary mb-2 ms-2"
                        >
                          Go Back
                        </Link>
                      </div>
                      <div className="" style={{ width: 789, height: 1099 }}>
                        <iframe
                          ref={iframeRef}
                          src={`/de-stuffing/tally_sheet?type=${Type}&container_no=${ContainerNo}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "white",
                          }}
                          title="A4 Iframe"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                ) : Data && ContainerNo && Type ? (
                  <>
                    <form action="" onSubmit={handleSubmitForm}>
                      <div className="text-end">
                        <a href="?" className="btn btn-primary mb-2 ms-2">
                          Search Another
                        </a>
                        <Link
                          to={"/de-stuffing"}
                          className="btn btn-primary mb-2 ms-2"
                        >
                          Go Back
                        </Link>
                      </div>
                      <div className="row">
                        <h4 className="text-primary mb-3">Container Details</h4>
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <input
                                type="hidden"
                                name="id"
                                defaultValue={Data?.id}
                              />
                              <div className="col-4">
                                <label className="form-label">
                                  Container No
                                </label>
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  defaultValue={Data?.container_number}
                                  readOnly
                                />
                              </div>
                              <div className="col-4">
                                <label className="form-label">
                                  Container Size
                                </label>
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  defaultValue={Data?.container_size}
                                  readOnly
                                />
                              </div>
                              <div className="col-4">
                                <label className="form-label">
                                  Container Type
                                </label>
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  defaultValue={Data?.container_type}
                                  readOnly
                                />
                              </div>
                              <div className="col-4">
                                <label className="form-label">
                                  Start Date Time
                                </label>
                                <input
                                  type="datetime-local"
                                  className="form-control p-2"
                                  name="start_time"
                                  defaultValue={formatToDateTimeLocal(today)}
                                />
                              </div>
                              <div className="col-4">
                                <label className="form-label">
                                  End Date Time
                                </label>
                                <input
                                  type="datetime-local"
                                  className="form-control p-2"
                                  name="end_time"
                                  defaultValue={formatToDateTimeLocal(today)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <h4 className="text-primary mb-3">Bill Details</h4>
                        {Data?.de_stuffing_bill_details?.map((details, i) => (
                          <div key={i} className="card card-body my-3">
                            <div className="d-flex gap-3 flex-row overflow-auto">
                              <div className="col-md-2 col-3">
                                <label
                                  htmlFor={`billNo_${details.id}`}
                                  className="form-label"
                                >
                                  Bill Number
                                </label>
                                <input
                                  id={`billNo_${details.id}`}
                                  type="text"
                                  className="form-control p-2 text-nowrap"
                                  defaultValue={
                                    details?.bol_number ?? details?.boe_number
                                  }
                                  readOnly
                                />
                              </div>
                              <div className="col-md-3 col-5">
                                <label
                                  htmlFor={`cargoDesc_${details.id}`}
                                  className="form-label"
                                >
                                  Cargo Description (Code)
                                </label>
                                <input
                                  id={`cargoDesc_${details.id}`}
                                  type="text"
                                  className="form-control p-2 text-nowrap"
                                  defaultValue={details?.commodity_description}
                                  readOnly
                                />
                              </div>
                              <div className="col-md-2 col-2">
                                <label
                                  htmlFor={`noOfPkgs_${details.id}`}
                                  className="form-label"
                                >
                                  No of Pkgs
                                </label>
                                <input
                                  id={`noOfPkgs_${details.id}`}
                                  type="number"
                                  className="form-control p-2 text-nowrap"
                                  defaultValue={
                                    details?.no_of_packages_declared
                                  }
                                  name={`no_of_packages_declared[${details.id}]`}
                                  onChange={(e) => {
                                    handleBillPkgW(details.id, e.target.value);
                                  }}
                                />
                              </div>
                              <div className="col-2">
                                <label
                                  htmlFor={`pkgWeight_${details.id}`}
                                  className="form-label"
                                >
                                  Pkg Weight
                                </label>
                                <input
                                  id={`pkgWeight_${details.id}`}
                                  type="text"
                                  className="form-control p-2 text-nowrap"
                                  defaultValue={details?.package_weight}
                                  name={`package_weight[${details.id}]`}
                                />
                              </div>
                              <GridComponent details={details} index={i} />
                            </div>
                          </div>
                        ))}

                        <button className="btn btn-primary w-25 mt-3">
                          Submit
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="row justify-content-center align-items-center h-75">
                    <div className="col-md-6 col-8">
                      <div className="card my-3">
                        <div className="card-body">
                          <h4 className="text-center text-primary">
                            DeStuffing
                          </h4>
                          <form action="" onSubmit={GetFormData}>
                            <p>Please Enter Container Number to Fetch Data</p>
                            <div className="form-floating form-floating-outline mb-6">
                              <select
                                name="type"
                                id="type"
                                className="form-select"
                                required
                              >
                                <option value="" selected disabled>
                                  Select Type
                                </option>
                                <option value="LCL">LCL</option>
                                <option value="FCL">FCL</option>
                              </select>
                              <label htmlFor="type">Type</label>
                            </div>
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
