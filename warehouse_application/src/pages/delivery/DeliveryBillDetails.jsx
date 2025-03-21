import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../main/header";
import Nav from "../main/nav";
import Footer from "../main/footer";
import { formatToDateTimeLocal } from "../main/formatToDateTime";

export default function DeliveryBillDetails() {
  const navigate = useNavigate();
    const iframeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [GpmNo, setGpmNo] = useState(null);
    const [TallySheet, setTallySheet] = useState(null);
  const [Data, setData] = useState(null);
  const [Locations, setLocations] = useState(null);
  const [TotalTrucks, setTotalTrucks] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const today = new Date();

  const fetchData = async (gpm_number) => {
    setLoading(true);
    const url = `https://ctas.live/backend/api/get/delivery/de_stuffing/${gpm_number}`;
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
    const gpm_number = e.target.gpm_number.value.toUpperCase();
    setGpmNo(gpm_number);
    setSearchParams({ gpm_number });
    fetchData(gpm_number);
  };

  useEffect(() => {
    const gpm_number = searchParams.get("gpm_number");
    const tallySheet = searchParams.get("tally_sheet");
    if (gpm_number) {
      setGpmNo(gpm_number);
      if (tallySheet) {
        setTallySheet(tallySheet);
      }else{
        fetchData(gpm_number);
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
    const url = `https://ctas.live/backend/api/delivery/de_stuffing/update`;
    try {
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      if (response?.data?.status === "success") {
        Swal.fire({
          icon: response?.data?.status,
          text: response?.data?.message,
          timer: 3000,
        }).then(() => {
          navigate(`?tally_sheet=1&gpm_number=${GpmNo}`);
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

  const GridComponent = ({ index }) => {
    const [gridInputs, setGridInputs] = useState([{ id: 1 }]);

    const addGridInput = () => {
      setGridInputs([...gridInputs, { id: gridInputs.length + 1 }]);
    };

    return (
      <div className="col-3">
        <label className="form-label">Grid Location & Area (SQM)</label>
        {gridInputs.map((input, i) => (
          <div key={input.id} className="d-flex align-items-center gap-3 mb-2">
            <select
              className="form-select p-2"
              name={`grid_location[${index}][${i}]`}
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
              name={`area[${index}][${i}]`}
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

  const handleBillDetails = (key, sBillNo) => {
    Data?.delivery_bill_details?.map((details, a) => {
      if (details.boe_number == sBillNo) {
        document.getElementById(
          `cargo_description_${key}`
        ).value = `${details.commodity_description}`;
        document.getElementById(
          `no_of_pkgs_${key}`
        ).value = `${details.no_of_packages_declared}`;
        document.getElementById(
          `pkgs_weight_${key}`
        ).value = `${details.package_weight}`;
        document.getElementById(
          `pkg_code_${key}`
        ).value = `${details.package_code}`;
      }
    });
  };

  const handleBillPkgW = (key, pkg) => {
    let no_of_pkgs = 0;
    let package_weight = 0;
    let Per_package_weight = 0;

    let boe_number = document.getElementById(`boe_${key}`)?.value;

    Data?.delivery_bill_details?.forEach((details) => {
      if (details.boe_number == boe_number) {
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

    let weightInput = document.getElementById(`pkgs_weight_${key}`);

    if (weightInput) {
      if (pkg && pkg != 0) {
        weightInput.value = (Per_package_weight * pkg).toFixed(2);
      } else if (pkg == 0) {
        weightInput.value = 0;
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
                {GpmNo && TallySheet ? (
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

                        <Link
                          to={"/delivery"}
                          className="btn btn-primary mb-2 ms-2"
                        >
                          Go Back
                        </Link>
                      </div>
                      <div className="" style={{ width: 789, height: 1099 }}>
                        <iframe
                          ref={iframeRef}
                          src={`/delivery/tally_sheet?gpm_number=${GpmNo}`}
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
                ) : Data && GpmNo ? (
                  <>
                    <form action="" onSubmit={handleSubmitForm}>
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
                                <label className="form-label">Gpm No</label>
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  defaultValue={Data?.gpm_number}
                                  readOnly
                                />
                              </div>
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
                        {Array.from({ length: TotalTrucks }, (_, i) => (
                          <div
                            key={i}
                            className="card card-body px-3 py-4 my-2"
                          >
                            <div className="row">
                              <div className="col-2">
                                <label
                                  htmlFor="truck_number"
                                  className="form-label"
                                >
                                  Truck Number
                                </label>
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  name={`truck_number[${i}]`}
                                />
                              </div>
                              <div className="col-2">
                                <label htmlFor="billNo" className="form-label">
                                  Bill Number
                                </label>
                                <select
                                  name={`boe[${i}]`}
                                  className="form-select p-2"
                                  onChange={(e) =>
                                    handleBillDetails(i, e.target.value)
                                  }
                                  id={`boe_${i}`}
                                >
                                  <option value="" selected disabled>
                                    Select Bill
                                  </option>
                                  {Data?.delivery_bill_details?.map(
                                    (details, k) => (
                                      <option
                                        key={k}
                                        value={details?.boe_number}
                                      >
                                        {details?.boe_number}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                              <div className="col-3">
                                <label className="form-label">
                                  Cargo Description (Code)
                                </label>
                                <input
                                  type="hidden"
                                  className="form-control p-2"
                                  name={`pkg_code[${i}]`}
                                  id={`pkg_code_${i}`}
                                  readOnly
                                />
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  name={`cargo_description[${i}]`}
                                  id={`cargo_description_${i}`}
                                  readOnly
                                />
                              </div>
                              <div className="col-2">
                                <label className="form-label">No of Pkgs</label>
                                <input
                                  type="number"
                                  className="form-control p-2"
                                  id={`no_of_pkgs_${i}`}
                                  name={`no_of_pkgs[${i}]`}
                                  onChange={(e) =>
                                    handleBillPkgW(i, e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-2">
                                <label className="form-label">Pkg Weight</label>
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  id={`pkgs_weight_${i}`}
                                  name={`pkgs_weight[${i}]`}
                                />
                              </div>
                              <GridComponent index={i} />
                            </div>
                          </div>
                        ))}
                        <div className="col-12 my-2 text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => setTotalTrucks(TotalTrucks + 1)}
                          >
                            Add Truck
                          </button>
                        </div>
                        <hr />
                        <button className="btn btn-primary w-25 mt-3">
                          Submit
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="row justify-content-center align-items-center h-75">
                    <div className="col-6">
                      <div className="card my-3">
                        <div className="card-body">
                          <h4 className="text-center text-primary">Delivery</h4>
                          <form action="" onSubmit={GetFormData}>
                            <p>Please Enter GPM Number to Fetch Data</p>
                            <div className="form-floating form-floating-outline mb-6">
                              <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter GPM Number"
                                name="gpm_number"
                                onChange={(e) =>
                                  (e.target.value =
                                    e.target.value.toUpperCase())
                                }
                              />
                              <label htmlFor="Container_Number">
                                GPM Number
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
