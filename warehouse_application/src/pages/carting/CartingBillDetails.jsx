import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../main/header";
import Nav from "../main/nav";
import { formatToDateTimeLocal } from "../main/formatToDateTime";
import ExportMap from "../ExportMap";
import MezzanineMap from "../MezzanineMap";
import { MapAreaModal, MapModal } from "../MapModal";

export default function CartingBillDetails() {
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [CrnNo, setCrnNo] = useState(null);
  const [TallySheet, setTallySheet] = useState(null);
  const [Data, setData] = useState(null);
  const [Locations, setLocations] = useState(null);
  const [TotalTruck, setTotalTrucks] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFinalSubmit, setIsFinalSubmit] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [ID, setID] = useState(false);
  const [MapName, setMapName] = useState(null);
  const [LocationNames, setLocationNames] = useState([]);
  const [LocationsArea, setLocationsArea] = useState(null);
  const today = new Date();

  const [visibleModals, setVisibleModals] = useState({});
  const [visibleAreaModals, setVisibleAreaModals] = useState({});
  const [activeGridSelections, setActiveGridSelections] = useState({});
  const [gridAreas, setGridAreas] = useState({});
  const [ModalIds, setModalIds] = useState(0);

  const fetchData = async (crn_number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://ctas.live/backend/api/get/carting?crn_number=${crn_number}`
      );

      if (response.data?.status === "success") {
        setData(response.data.data);
        setID(response.data.data?.id);
        setIsFinalSubmit(
          response.data.data?.status === "1" ||
            response.data.data?.status === "2"
        );
      } else {
        throw new Error(response.data?.message || "Failed to fetch data");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    setLoading(true);
    let url = `https://ctas.live/backend/api/warehouse/locations?type=Export`;
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

  const fetchLocationsName = async () => {
    setLoading(true);
    let url = `https://ctas.live/backend/api/warehouse/location/name?warehouse_type=Export`;
    try {
      const response = await axios.get(url);
      if (response?.data?.status === "success") {
        setLocationNames(response?.data?.data);
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
    const crn_number = e.target.crn_number.value.toUpperCase();
    setCrnNo(crn_number);
    setSearchParams({ crn_number });
  };

  useEffect(() => {
    const crn_number = searchParams.get("crn_number");
    const tallySheet = searchParams.get("tally_sheet");
    const finalSubmit = searchParams.get("isFinalSubmit");
    const id = searchParams.get("id");

    if (crn_number) setCrnNo(crn_number);
    if (tallySheet) setTallySheet(tallySheet);
    if (finalSubmit) setIsFinalSubmit(finalSubmit === "1");
    if (id) setID(id);

    if (crn_number && !tallySheet) {
      fetchData(crn_number);
    }
  }, [searchParams]);

  useEffect(() => {
    if (Data) {
      setID(Data?.id);
      fetchLocationsName();

      if (Data.status === "1" || Data.status === "2") {
        navigate(
          `?isFinalSubmit=1&id=${Data.id}&tally_sheet=1&crn_number=${CrnNo}`
        );
      }
      if (Data?.carting_trucks) {
        setTotalTrucks(Data?.carting_trucks.length);
      }
    }
  }, [Data]);

  useEffect(() => {
    if (LocationNames) {
      setMapName(LocationNames[0]);
    }
  }, [LocationNames]);

  useEffect(() => {
    if (MapName) {
      fetchLocations();
    }
  }, [MapName]);

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const url = `https://ctas.live/backend/api/carting/final/submit?id=${ID}&crn_number=${CrnNo}`;
      const response = await axios.get(
        url,
        {
          id: ID,
          crn_number: CrnNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response?.data?.status === "success") {
        await Swal.fire({
          icon: "success",
          text: response.data.message,
          timer: 2000,
        });

        navigate(`?isFinalSubmit=1&id=${ID}&tally_sheet=1&crn_number=${CrnNo}`);
      } else {
        Swal.fire({
          icon: "error",
          text: response?.data?.message || "Final submit failed",
          timer: 3000,
        });
      }
    } catch (error) {
      console.error("Final submit error:", error);
      Swal.fire({
        icon: "error",
        text:
          error.response?.data?.message ||
          "Failed to complete final submission. Please try again.",
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const response = await axios.post(
        "https://ctas.live/backend/api/carting/update",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.status === "success") {
        const updatedId = response.data.data?.id || ID;
        setID(updatedId);
        setSubmissionStatus("saved");

        await Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Job details saved successfully",
          timer: 2000,
        });

        // navigate(
        //   `?isFinalSubmit=0&id=${updatedId}&tally_sheet=1&crn_number=${CrnNo}`
        // );
        navigate(`/carting`);
      } else {
        throw new Error(response.data?.message || "Failed to  job");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const [allGridInputs, setAllGridInputs] = useState({});

  useEffect(() => {
    if (Data && LocationsArea) {
      const gridData = {};

      Data?.carting_trucks.forEach((data, index) => {
        if (data?.grid_area?.length > 0) {
          gridData[index] = data?.grid_area?.map((item, i) => {
            const matchedArea =
              LocationsArea?.length > 0
                ? LocationsArea.find(
                    (area) => area.location_code === item.grid_locations
                  )
                : null;

            return {
              id: i + 1,
              grid_location: item.grid_locations || "",
              area: matchedArea?.ocr_occupied_area ?? item.area ?? "",
            };
          });
        } else {
          gridData[index] = [{ id: 1, grid_location: "", area: "" }];
        }
      });

      setAllGridInputs(gridData);
    }
  }, [Data, LocationsArea]);

  useEffect(() => {
    if (TotalTruck) {
        if (!allGridInputs[TotalTruck - 1]) {
          setAllGridInputs({
            ...allGridInputs,
            [TotalTruck - 1]: [{ id: 1, grid_location: "", area: "" }],
          });
          // alert(TotalTruck);
      }
    }
  }, [TotalTruck]);

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

  const GridComponents = ({ index }) => {
    const gridInputs = allGridInputs[index];
    console.log(gridInputs);
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
                    setGridAreas((prev) => ({ ...prev, [modalId]: [] }));
                    setVisibleModals((prev) => ({ ...prev, [modalId]: true }));
                  }}
                >
                  <i className="fa fa-map" />
                </button>

                <input
                  type="text"
                  className="form-control p-2"
                  placeholder="Grid Location"
                  name={`grid_locations[${index}][${i}]`}
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
                  name={`area[${index}][${i}]`}
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
                  name={`wh_area_loc[${index}][${i}]`}
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

  const handleBillDetails = (key, sbill) => {
    Data?.carting_shipping_bill_details?.map((details, a) => {
      if (details.shipping_bill_number == sbill) {
        document.getElementById(
          `cargo_description_${key}`
        ).value = `${details?.commodity_description}`;
        document.getElementById(
          `no_of_pkgs_${key}`
        ).value = `${details?.no_of_packages_declared}`;
        document.getElementById(
          `pkgs_weight_${key}`
        ).value = `${details?.package_weight}`;
        document.getElementById(
          `pkg_code_${key}`
        ).value = `${details?.package_code}`;
      }
    });
  };

  const handleBillPkgW = (key, pkg) => {
    let no_of_pkgs = 0;
    let package_weight = 0;
    let gross_weight = 0;
    let dec_pkg = 0;
    let Per_package_weight = 0;

    let shipping_bill_number = document.getElementById(`boe_${key}`)?.value;

    const billDetail = Data?.carting_shipping_bill_details?.find(
      (details) => details.shipping_bill_number == shipping_bill_number
    );

    if (billDetail) {
      if (billDetail?.package_weight && billDetail?.package_weight != "0") {
        package_weight = parseFloat(billDetail.package_weight) || 0;
      } else {
        gross_weight = parseFloat(Data.gross_weight) || 0;
      }

      if (
        billDetail?.no_of_packages_declared &&
        billDetail.no_of_packages_declared != "0"
      ) {
        no_of_pkgs = parseFloat(billDetail?.no_of_packages_declared) || 0;
      } else {
        for (let i = 0; i < TotalTruck; i++) {
          const billInput = document.getElementById(`boe_${i}`);
          const pkgInput = document.getElementById(`no_of_pkgs_${i}`);
          if (pkgInput) {
            dec_pkg += parseFloat(pkgInput.value ?? 0) || 0;
          }

          if (
            billInput &&
            pkgInput &&
            billInput.value == shipping_bill_number
          ) {
            let pkgVal = parseFloat(pkgInput.value);
            if (!isNaN(pkgVal) && pkgVal > 0) {
              no_of_pkgs += pkgVal;
            }
          }
        }
      }
    }
    if (billDetail?.package_weight && billDetail?.package_weight != "0") {
      if (
        package_weight &&
        no_of_pkgs &&
        package_weight != 0 &&
        no_of_pkgs != 0
      ) {
        Per_package_weight = package_weight / no_of_pkgs.toFixed(2);
      }
    } else {
      if (gross_weight && dec_pkg && gross_weight != 0 && dec_pkg != 0) {
        Per_package_weight = gross_weight / dec_pkg.toFixed(2);
      }
    }

    if (billDetail?.no_of_packages_declared) {
      let weightInput = document.getElementById(`pkgs_weight_${key}`);

      if (weightInput) {
        if (pkg && pkg != 0) {
          weightInput.value = (Per_package_weight * pkg).toFixed(2);
        } else if (pkg == 0) {
          weightInput.value = 0;
        }
      } else {
        console.log("Package weight input not found!");
      }
    } else {
      for (let i = 0; i < TotalTruck; i++) {
        const billInputs = document.getElementById(`boe_${i}`);

        if (billDetail.package_weight && billDetail.package_weight != "0") {
          if (billInputs.value == shipping_bill_number) {
            let weightInput = document.getElementById(`pkgs_weight_${i}`);
            let pkgInput = document.getElementById(`no_of_pkgs_${i}`);
            let pkgValue = parseFloat(pkgInput?.value || 0);

            if (weightInput) {
              if (pkgValue && pkgValue != 0) {
                weightInput.value = (Per_package_weight * pkgValue).toFixed(2);
              } else if (pkgValue == 0) {
                weightInput.value = 0;
              }
            } else {
              console.log("Package weight input not found!");
            }
          }
        } else {
          let weightInput = document.getElementById(`pkgs_weight_${i}`);
          let pkgInput = document.getElementById(`no_of_pkgs_${i}`);
          let pkgValue = parseFloat(pkgInput?.value || 0);

          if (weightInput) {
            if (pkgValue && pkgValue != 0) {
              weightInput.value = (Per_package_weight * pkgValue).toFixed(2);
            } else if (pkgValue == 0) {
              weightInput.value = 0;
            }
          } else {
            console.log("Package weight input not found!");
          }
        }
      }
    }
  };

  const fetchLocationsArea = async () => {
    setLoading(true);
    let url = `https://ctas.live/backend/api/warehouse/location/ocr_area?warehouse_type=Export`;
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
    if (Data) {
      fetchLocationsArea();
    }
  }, [searchParams, Data]);

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
      />
      <div className="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
        <div className="layout-container">
          <div className="layout-page">
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="container">
                  {CrnNo && TallySheet ? (
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
                              className="btn btn-label-primary mb-2"
                            >
                              Print
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="btn btn-primary mb-2"
                                onClick={handleFinalSubmit}
                              >
                                Final Submit
                              </button>
                              <a
                                href={`?isFinalSubmit=0&id=${ID}&crn_number=${CrnNo}`}
                                className="btn btn-primary mb-2 ms-2"
                              >
                                Edit
                              </a>
                            </>
                          )}
                          <a href="?" className="btn btn-primary mb-2 ms-2">
                            Search Another
                          </a>
                        </div>
                        <div className="" style={{ width: 789, height: 1099 }}>
                          <iframe
                            ref={iframeRef}
                            src={`/carting/tally_sheet?crn_number=${CrnNo}`}
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
                  ) : Data && CrnNo ? (
                    <>
                      <form action="" onSubmit={handleSubmitForm}>
                        <div className="text-end">
                          <a href="?" className="btn btn-primary mb-2 ms-2">
                            Search Another
                          </a>
                          <Link
                            to={"/carting"}
                            className="btn btn-primary mb-2 ms-2"
                          >
                            Go Back
                          </Link>
                        </div>
                        <div className="row">
                          <h4 className="text-primary mb-3">
                            Container Details
                          </h4>
                          <div className="card">
                            <div className="card-body">
                              <div className="row">
                                <input
                                  type="hidden"
                                  name="id"
                                  defaultValue={Data?.id}
                                />
                                <div className="col-4">
                                  <label className="form-label">Crn No</label>
                                  <input
                                    type="text"
                                    className="form-control p-2"
                                    defaultValue={Data?.crn_number}
                                    readOnly
                                  />
                                </div>
                                {Data?.carting_containers?.map(
                                  (container, i) => (
                                    <div className="col-8 d-flex gap-2">
                                      <div className="col">
                                        <label className="form-label">
                                          Container No
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control p-2"
                                          defaultValue={
                                            container?.container_number
                                          }
                                          readOnly
                                        />
                                      </div>
                                      <div className="col">
                                        <label className="form-label">
                                          Container Size
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control p-2"
                                          defaultValue={
                                            container?.container_size
                                          }
                                          readOnly
                                        />
                                      </div>
                                    </div>
                                  )
                                )}

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
                                <div className="col-4">
                                  <label className="form-label">
                                    Handling Type
                                  </label>
                                  <select
                                    className="form-select p-2"
                                    name="handline_type"
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
                                {LocationNames?.map((map, i) => (
                                  <option value={map}>{map}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          {Array.from({ length: TotalTruck }, (_, i) => (
                            <div key={i} className="card card-body my-3">
                              <div className="d-flex gap-3 flex-row overflow-auto">
                                <div className="col-md-2 col-3">
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
                                    defaultValue={
                                      Data?.carting_trucks[i]?.truck_number ??
                                      null
                                    }
                                    onChange={(e) => {
                                      e.target.value =
                                        e.target.value.toUpperCase();
                                    }}
                                  />
                                </div>
                                <div className="col-md-2 col-3">
                                  <label
                                    htmlFor="billNo"
                                    className="form-label"
                                  >
                                    Bill Number
                                  </label>
                                  <select
                                    name={`boe[${i}]`}
                                    className="form-select p-2"
                                    onChange={(e) =>
                                      handleBillDetails(i, e.target.value)
                                    }
                                    id={`boe_${i}`}
                                    defaultValue={
                                      Data?.carting_trucks[i]?.sbill || ""
                                    }
                                  >
                                    <option value="">Select Bill</option>
                                    {Data?.carting_shipping_bill_details.map(
                                      (bill, k) => (
                                        <option
                                          key={k}
                                          value={bill.shipping_bill_number}
                                        >
                                          {bill.shipping_bill_number}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>

                                <div className="col-md-3 col-4">
                                  <label className="form-label">
                                    Cargo Description (Code)
                                  </label>
                                  <input
                                    type="hidden"
                                    className="form-control p-2"
                                    name={`pkg_code[${i}]`}
                                    id={`pkg_code_${i}`}
                                    readOnly
                                    defaultValue={
                                      Data?.carting_trucks[i]?.pkg_code ?? null
                                    }
                                  />
                                  <input
                                    type="text"
                                    className="form-control p-2"
                                    name={`cargo_description[${i}]`}
                                    id={`cargo_description_${i}`}
                                    readOnly
                                    defaultValue={
                                      Data?.carting_trucks[i]
                                        ?.cargo_description ?? null
                                    }
                                  />
                                </div>
                                <div className="col-md-2 col-3">
                                  <label className="form-label">
                                    No of Pkgs
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control p-2"
                                    id={`no_of_pkgs_${i}`}
                                    name={`no_of_pkgs[${i}]`}
                                    onChange={(e) =>
                                      handleBillPkgW(i, e.target.value)
                                    }
                                    defaultValue={
                                      Data?.carting_trucks[i]?.no_of_pkgs ??
                                      null
                                    }
                                  />
                                </div>
                                <div className="col-md-2 col-3">
                                  <label className="form-label">
                                    Pkg Weight
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control p-2"
                                    id={`pkgs_weight_${i}`}
                                    name={`pkgs_weight[${i}]`}
                                    defaultValue={
                                      Data?.carting_trucks[i]?.pkgs_weight ??
                                      null
                                    }
                                  />
                                </div>
                                <GridComponents index={i} />
                              </div>
                            </div>
                          ))}

                          <div className="col-12 my-2 text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => setTotalTrucks(TotalTruck + 1)}
                            >
                              Add Truck
                            </button>
                          </div>
                          <hr />
                          <button className="btn btn-primary w-25 mt-3">
                            Create Job
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div
                      className="row justify-content-center align-items-center"
                      style={{ height: "70vh" }}
                    >
                      <div className="col-md-6 col-8">
                        <div className="card my-3">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <h4 className="text-left text-primary">
                                Carting
                              </h4>
                              <div className="text-end">
                                <Link
                                  to={"/carting"}
                                  className="btn btn-label-danger btn-sm"
                                >
                                  Back
                                </Link>
                              </div>
                            </div>

                            <form action="" onSubmit={GetFormData}>
                              <p>Please Enter CRN Number to Fetch Data</p>
                              <div className="form-floating form-floating-outline mb-6">
                                <input
                                  type="text"
                                  className="form-control mb-3"
                                  placeholder="Enter CRN Number"
                                  name="crn_number"
                                  onChange={(e) =>
                                    (e.target.value =
                                      e.target.value.toUpperCase())
                                  }
                                />
                                <label htmlFor="crn_number">CRN Number</label>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
