import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../main/header";
import Nav from "../main/nav";
import Footer from "../main/footer";
import { formatToDateTimeLocal } from "../main/formatToDateTime";
import ImportMap from "../ImportMap";
import $ from "jquery";
import { MapAreaModal, MapModal } from "../MapModal";
import { ApiBaseUrl } from "../../Config";

export default function DeStuffingBillDetails() {
  const [isFinalSubmit, setIsFinalSubmit] = useState(false);
  const [ID, setID] = useState(false);
  const [MapName, setMapName] = useState("Import");
  const iframeRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [Type, setType] = useState(null);
  const [ContainerNo, setContainerNo] = useState(null);
  const [TallySheet, setTallySheet] = useState(null);
  const [Data, setData] = useState(null);
  const [Locations, setLocations] = useState(null);
  const [LocationsArea, setLocationsArea] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const today = new Date();

  const [visibleModals, setVisibleModals] = useState({});
  const [visibleAreaModals, setVisibleAreaModals] = useState({});
  const [activeGridSelections, setActiveGridSelections] = useState({});
  const [gridAreas, setGridAreas] = useState({});
  const [ModalIds, setModalIds] = useState(0);
  const [SelectedGrids, setSelectedGrids] = useState({});

  const fetchData = async (type, containerNo) => {
    setLoading(true);
    const url = `${ApiBaseUrl}get/de_stuffing/${type}/${containerNo}`;
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
    let url = `${ApiBaseUrl}warehouse/locations?warehouse_type=Import`;
    if (MapName) {
      url += `&warehouse_name=${MapName}`;
    }
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
    const FinalSubmit = searchParams.get("isFinalSubmit");
    const id = searchParams.get("id");
    if (FinalSubmit) {
      setIsFinalSubmit(FinalSubmit == "1" ? true : false);
    }
    if (id) {
      setID(id);
    }
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
      setID(Data?.id);
      fetchLocations();
      if (Data.status === "1" || Data.status === "2") {
        navigate(
          `?isFinalSubmit=1&id=${ID}&tally_sheet=1&type=${Type}&container_no=${ContainerNo}`
        );
      }
    }
  }, [Data, MapName]);

  const [user, setUser] = useState("");
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")) ?? "{}");
  }, []);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      Swal.fire({
        icon: "warning",
        title: "User not found",
        text: "Please login or select a valid user before submitting the form.",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.replace(window.location.href);
      });
      return;
    }


    setLoading(true);
    const formData = new FormData(e.target);
    formData.append("created_by", user?.id);
    
    const url = `${ApiBaseUrl}de_stuffing/update`;
    try {
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.data?.status === "success") {
        Swal.fire({
          icon: response?.data?.status,
          text: response?.data?.message,
          timer: 2000,
        }).then(() => {
          navigate(
            `?isFinalSubmit=0&id=${ID}&tally_sheet=1&type=${Type}&container_no=${ContainerNo}`
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

  const [allGridInputs, setAllGridInputs] = useState({});

  useEffect(() => {
    if (Data && LocationsArea) {
      const gridData = {};

      Data?.de_stuffing_bill_details.forEach((data, index) => {
        if (data?.grid_area?.length > 0) {
          gridData[index] = data?.grid_area?.map((item, i) => {
            const matchedArea =
              LocationsArea?.length > 0
                ? LocationsArea.find(
                    (area) => area.location_code == item.grid_locations
                  )
                : null;

            return {
              id: i + 1,
              grid_location: item.grid_locations || "",
              area: item.area ?? "",
            };
          });
        } else {
          gridData[index] = [{ id: 1, grid_location: "", area: "" }];
        }
      });

      setAllGridInputs(gridData);
    }
  }, [Data, LocationsArea]);

  const addGridInput = (index) => {
    const updatedInputs = [...(allGridInputs[index] || [])];
    updatedInputs.push({
      id: updatedInputs.length + 1,
      grid_location: "",
      area: "",
    });

    setAllGridInputs({
      ...allGridInputs,
      [index]: updatedInputs,
    });
  };

  const removeGridInput = (id, index) => {
    const updatedInputs = (allGridInputs[index] || []).filter(
      (input) => input.id !== id
    );

    setAllGridInputs({
      ...allGridInputs,
      [index]: updatedInputs,
    });
  };

  const GridComponents = ({ index, details }) => {
    const gridInputs = allGridInputs[index];
    return (
      <div className="col-md-4 col-6">
        <label className="form-label">Grid Location & Area (SQM)</label>
        {gridInputs?.map((input, i) => {
          const modalId = `${index}_${i}`;
          return (
            <div key={input.id} className="mb-2">
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-sm btn-info me-1"
                  type="button"
                  onClick={() => {
                    setModalIds(modalId);
                    setVisibleModals((prev) => ({ ...prev, [modalId]: true }));
                  }}
                >
                  <i className="fa fa-map" />
                </button>
                <input
                  type="text"
                  className="form-control p-2"
                  placeholder="Grid Location"
                  name={`grid_locations[${details.id}][${i}]`}
                  value={
                    activeGridSelections[modalId]?.location_code ??
                    input.grid_location
                  }
                  readOnly
                />
                {/* <span>
                  {JSON.stringify(gridAreas[modalId])}
                </span> */}
                <input
                  type="text"
                  className="form-control p-2"
                  placeholder="Area (SQM)"
                  name={`area[${details.id}][${i}]`}
                  id={`area_${index}_${i}`}
                  defaultValue={gridAreas[modalId]?.length ?? input.area}
                  onChange={(e) => AreaHandle(index, i)}
                  max={
                    Number(activeGridSelections[modalId]?.total_area ?? 20) -
                    Number(activeGridSelections[modalId]?.occupied_area ?? 0)
                  }
                />
                <input
                  type="hidden"
                  className="form-control p-2"
                  name={`wh_area_loc[${details.id}][${i}]`}
                  value={JSON.stringify(gridAreas[modalId])}
                />

                <button
                  type="button"
                  className="btn btn-success btn-sm px-2 py-1"
                  onClick={() => addGridInput(index)}
                >
                  +
                </button>
                {gridInputs.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm px-2 py-1"
                    onClick={() => {
                      removeGridInput(input.id, index);
                    }}
                  >
                    -
                  </button>
                )}
              </div>
              <small id={`error_area_${index}_${i}`}></small>
            </div>
          );
        })}
      </div>
    );
  };

  const GridAreaHandle = (grid, id, key) => {
    let totalArea = 0;
    let occupied = 0;
    let loc_i = 1;

    Locations?.forEach((location) => {
      if (location.location_code === grid && loc_i == 1) {
        loc_i++;
        totalArea += parseInt(location.total_area) || 0;
        occupied +=
          parseInt(location.occupied_area) || 0;
      }
    });

    let available = totalArea - occupied;
    let areaInput = document.getElementById(`area_${id}_${key}`);

    if (areaInput) {
      areaInput.value = available >= 0 ? available : 0;
      areaInput.max = totalArea;
    }
  };

  const AreaHandle = (id, key) => {
    let areaInput = document.getElementById(`area_${id}_${key}`);
    let errorMsg = document.getElementById(`error_area_${id}_${key}`);

    if (areaInput) {
      let myValue = parseFloat(areaInput.value) || 0;
      let maxAttr = parseFloat(areaInput.getAttribute("max"));
      let myMaxValue = maxAttr || maxAttr == 0 ? maxAttr : 20;

      if (myValue > myMaxValue) {
        areaInput.classList.add("border", "border-danger");
        if (errorMsg) {
          errorMsg.className = "text-danger d-block mt-1";
          errorMsg.innerText = `Grid Maximum Area Available ${myMaxValue}`;
        }
      } else {
        areaInput.classList.remove("border", "border-danger");
        if (errorMsg) {
          errorMsg.className = "";
          errorMsg.innerText = "";
        }
      }
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
      Per_package_weight += package_weight / no_of_pkgs;
    }

    let weightInput = document.getElementById(`pkgWeight_${id}`);

    if (weightInput) {
      if (pkg && pkg != 0) {
        weightInput.value = (Per_package_weight * pkg).toFixed(5);
      } else {
        weightInput.value = parseFloat(Per_package_weight) || 0;
      }
    } 
  };

  const handleFinalSubmit = async () => {
    setLoading(true);

    const url = `${ApiBaseUrl}de_stuffing/final/submit?id=${ID}&container_no=${ContainerNo}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.data?.status === "success") {
        Swal.fire({
          icon: response?.data?.status,
          text: response?.data?.message,
          timer: 2000,
        }).then(() => {
          // navigate(
          //   `?isFinalSubmit=1&id=${ID}&tally_sheet=1&type=${Type}&container_no=${ContainerNo}`
          // );
          navigate(`/de-stuffing`);
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

  const handleRestData = async () => {
    setLoading(true);
    const url = `${ApiBaseUrl}de_stuffing/reset/data?type=${Type}&container_no=${ContainerNo}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.data?.status == "success") {
        Swal.fire({
          icon: response?.data?.status,
          text: response?.data?.message,
          timer: 2000,
        }).then(() => {
          window.location.reload();
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

  const fetchLocationsArea = async () => {
    setLoading(true);
    let url = `${ApiBaseUrl}warehouse/location/ocr_area?warehouse_type=Import`;
    try {
      const response = await axios.get(url);
      if (response?.data?.status === "success") {
        setLocationsArea(response?.data?.data);
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

  useEffect(() => {
    fetchLocationsArea();
  }, [searchParams, Data]);

  return (
    <>
      {loading && (
        <div
          className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 myDiv"
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

      <MapModal
        isVisible={visibleModals[ModalIds] || false}
        onClose={() =>
          setVisibleModals((prev) => ({ ...prev, [ModalIds]: false }))
        }
        MapName={MapName}
        setActiveGridSelection={(val) =>
          setActiveGridSelections((prev) => ({
            ...prev,
            [ModalIds]: val,
          }))
        }
        activeGridSelection={activeGridSelections[ModalIds]}
        setModalVisible2={(val) =>
          setVisibleAreaModals((prev) => ({ ...prev, [ModalIds]: val }))
        }
        SelectedGrids={SelectedGrids}
        setSelectedGrids={setSelectedGrids}
      />

      <MapAreaModal
        isVisible2={visibleAreaModals[ModalIds] || false}
        onClose2={() =>
          setVisibleAreaModals((prev) => ({
            ...prev,
            [ModalIds]: false,
          }))
        }
        activeGridSelection={activeGridSelections[ModalIds]}
        setGridArea={(area) =>
          setGridAreas((prev) => {
            const current = prev[ModalIds] || [];
            const updated = current.includes(area)
              ? current.filter((item) => item != area)
              : [...current, area];
            return { ...prev, [ModalIds]: updated };
          })
        }
        gridArea={gridAreas[ModalIds] ?? []}
        SelectedGrids={SelectedGrids}
        setSelectedGrids={setSelectedGrids}
      />
      
      <div className="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
        <div className="layout-container">
          <div className="layout-page">
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                {/* {JSON.stringify(SelectedGrids)} */}
                {ContainerNo && Type && TallySheet ? (
                  <div className="row justify-content-center">
                    <div className="col-lg-10 col-md-11">
                      <div className="text-end">
                        {isFinalSubmit ? (
                          <button
                            onClick={() => {
                              if (iframeRef.current) {
                                iframeRef.current.contentWindow.print();
                              }
                            }}
                            className="btn btn-label-primary mx-2"
                          >
                            Print
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              //  href={`?isFinalSubmit=1&tally_sheet=1&type=${Type}&container_no=${ContainerNo}`}
                              className="btn btn-primary mx-2"
                              onClick={handleFinalSubmit}
                            >
                              Final Submit
                            </button>

                            <button
                              type="button"
                              className="btn btn-info mb-2"
                              onClick={() => {
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: "This will reset the data.!",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#3085d6",
                                  cancelButtonColor: "#d33",
                                  confirmButtonText: "Yes, reset it!",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    handleRestData();
                                  }
                                });
                              }}
                            >
                              Reset From
                            </button>
                            <a
                              href={`?isFinalSubmit=0&id=${ID}&type=${Type}&container_no=${ContainerNo}`}
                              className="btn btn-primary mx-2"
                            >
                              Edit
                            </a>
                          </>
                        )}

                        <a href="?" className="btn btn-primary mx-2">
                          Search Another
                        </a>
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
                        <a href="?" className="btn btn-primary mx-2">
                          Search Another
                        </a>
                        <Link
                          to={"/de-stuffing"}
                          className="btn btn-primary mx-2"
                        >
                          Go Back
                        </Link>
                        <button
                          type="button"
                          className="btn btn-info mx-2"
                          onClick={() => {
                            Swal.fire({
                              title: "Are you sure?",
                              text: "This will reset the data.!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Yes, reset it!",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                handleRestData();
                              }
                            });
                          }}
                        >
                          Reset From
                        </button>
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
                                  defaultValue={formatToDateTimeLocal(Data.start_time??today)}
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
                                  defaultValue={formatToDateTimeLocal(Data.end_time??today)}
                                />
                              </div>
                              <div className="col-4">
                                <label className="form-label">
                                  Handling Type
                                </label>
                                <select
                                  className="form-select p-2"
                                  name="handling_type"
                                >
                                  <option value="LCH">LCH</option>
                                  <option value="MCH">MCH</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center my-2">
                          <h4 className="text-primary m-0">Bill Details</h4>
                          <div className="w-25">
                            <select
                              className="form-select p-2"
                              value={MapName}
                              onChange={(e) => setMapName(e.target.value)}
                            >
                              <option value="Import">Import</option>
                              {/* <option value="OpenYard">Open Yard</option> */}
                            </select>
                          </div>
                        </div>
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
                              {/* <GridComponent details={details} index={i} /> */}
                              <GridComponents index={i} details={details} />
                            </div>
                          </div>
                        ))}

                        <button
                          type="submit"
                          className="btn btn-primary w-25 mt-3"
                        >
                          Create Job
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="row justify-content-center align-items-center h-75">
                    <div className="col-md-6 col-8">
                      <div className="card my-3">
                        <div className="card-body">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h4 className="text-primary">DeStuffing</h4>
                            <div className="text-end">
                              <Link
                                to={"/de-stuffing"}
                                className="btn btn-label-danger btn-sm"
                              >
                                Back
                              </Link>
                            </div>
                          </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
