import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../main/header";
import Nav from "../main/nav";
import Footer from "../main/footer";
import { formatToDateTimeLocal } from "../main/formatToDateTime";
import { ApiBaseUrl } from "../../Config";

export default function StuffingBillDetails() {
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [ContainerNo, setContainerNo] = useState(null);
  const [TallySheet, setTallySheet] = useState(null);
  const [Data, setData] = useState(null);
  const [Locations, setLocations] = useState(null);
  const [TotalBills, setTotalBills] = useState(1);
  const [Bills, setBills] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFinalSubmit, setIsFinalSubmit] = useState(false);
  const [ID, setID] = useState(null);
  const [gridData, setGridData] = useState({});
  const [gridData2, setGridData2] = useState({});
  const today = new Date();

  const fetchData = async (container_number) => {
    setLoading(true);
    const url = `${ApiBaseUrl}get/stuffing?type=FCL&container_number=${container_number}`;
    try {
      const response = await axios.get(url);
      if (response?.data?.status == "success") {
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

  const GetFormData = async (e) => {
    e.preventDefault();
    const container_number = e.target.container_number.value.toUpperCase();
    setContainerNo(container_number);
    setSearchParams({ container_number });
    fetchData(container_number);
  };

  useEffect(() => {
    const container_number = searchParams.get("container_number");
    const id = searchParams.get("id");
    const tallySheet = searchParams.get("tally_sheet");
    const finalSubmit = searchParams.get("isFinalSubmit");
    if (finalSubmit) setIsFinalSubmit(finalSubmit == "1");
    if (id) {
      setID(id);
    }
    if (container_number) {
      setContainerNo(container_number);
      if (tallySheet) {
        setTallySheet(tallySheet);
      } else {
        fetchData(container_number);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!Data) return;

    setID(Data?.id);

    let defaultGridData = {};

    const processGridItems = (billDetails, matchingTrucks) => {
      const rawGridItems = matchingTrucks.flatMap((truck) =>
        truck?.grid_area?.length > 0
          ? truck.grid_area.map((item) => ({
              grid_location: item.grid_locations || "NA",
              area: parseFloat(item.area) || 0,
              grid_pkg: Number(item.pkg) || 0,
              grid_pkgs_weight: Number(item.pkgs_weight) || 0,
              no_of_pkgs: Number(truck?.no_of_pkgs ?? 0),
            }))
          : []
      );

      const areaByLocation = {};
      rawGridItems.forEach((item) => {
        if (areaByLocation[item.grid_location]) {
          areaByLocation[item.grid_location].area += item.area;
          areaByLocation[item.grid_location].grid_pkg += item.grid_pkg;
          areaByLocation[item.grid_location].grid_pkgs_weight += item.grid_pkgs_weight;
          areaByLocation[item.grid_location].total_pkg += item.no_of_pkgs;
        } else {
          areaByLocation[item.grid_location] = {
            area: item.area,
            grid_pkg: item.grid_pkg,
            grid_pkgs_weight: item.grid_pkgs_weight,
            total_pkg: item.no_of_pkgs,
          };
        }
      });

      return Object.entries(areaByLocation).map(([location, data], index) => ({
        id: index + 1,
        grid_location: location,
        area: data.area,
        sBillNo: billDetails?.shipping_bill_number || 0,
        grid_pkg: Number(data.grid_pkg) || 0,
        grid_pkgs_weight: Number(data.grid_pkgs_weight) || 0,
        total_pkg: Number(data.total_pkg) || 0,
      }));
    };

    if (Data?.stuffing_shipping_bill_details?.length > 0) {
      setBills(Data.stuffing_shipping_bill_details);
      setTotalBills(Data.stuffing_shipping_bill_details.length);

      Data.stuffing_shipping_bill_details.forEach((billDetails, i) => {
        let gridItems = [];

        if (billDetails?.grid_area?.length > 0) {
          gridItems = billDetails.grid_area.map((item, index) => ({
            id: item.id || index + 1,
            grid_location: item.grid_locations || "NA",
            area: item.area || 0,
            sBillNo: billDetails?.shipping_bill_number || 0,
            grid_pkg: Number(item.pkg) || 0,
            grid_pkgs_weight: Number(item.pkgs_weight) || 0,
            total_pkg: Number(billDetails?.no_of_packages_declared) || 0,
          }));
        } else {
          const matchingTrucks =
            Data?.carting_container?.carting_trucks?.filter(
              (truck) => truck.sbill == billDetails.shipping_bill_number
            ) || [];

          gridItems = processGridItems(billDetails, matchingTrucks);
        }

        defaultGridData[i] = gridItems;
      });
    } else if (
      Data?.carting_container?.carting_shipping_bill_details?.length > 0
    ) {
      setBills(Data.carting_container.carting_shipping_bill_details);
      setTotalBills(
        Data.carting_container.carting_shipping_bill_details.length
      );

      Data.carting_container.carting_shipping_bill_details.forEach(
        (billDetails, i) => {
          const matchingTrucks =
            Data.carting_container.carting_trucks?.filter(
              (truck) => truck.sbill == billDetails.shipping_bill_number
            ) || [];

          const gridItems = processGridItems(billDetails, matchingTrucks);

          defaultGridData[i] = gridItems;
        }
      );
    }

    setGridData(defaultGridData);
    setGridData2(defaultGridData);
  }, [Data]);

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const url = `${ApiBaseUrl}stuffing/final/submit?id=${ID}&container_number=${ContainerNo}`;
      const response = await axios.get(
        url,
        {
          id: ID,
          container_number: ContainerNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response?.data?.status == "success") {
        Swal.fire({
          icon: "success",
          text: response.data.message,
          timer: 2000,
        });
        navigate(
          `?isFinalSubmit=1&id=${ID}&tally_sheet=1&container_number=${ContainerNo}`
        );
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
    const formData = new FormData(e.target);
    const url = `${ApiBaseUrl}stuffing/update`;
    try {
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log(response.data);
      if (response?.data?.status == "success") {
        Swal.fire({
          icon: response?.data?.status,
          text: response?.data?.message,
          timer: 3000,
        }).then(() => {
          navigate(`?id=${ID}&tally_sheet=1&container_number=${ContainerNo}`);
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

  const GridComponent = ({ index, data }) => {
    return (
      <div className="col-md-3 col-5">
        <label className="form-label">Grid Location & Area (SQM)</label>
        {data.length > 0 ? (
          data.map((input, i) => (
            <div key={input.id} className="mb-2">
              <div className="d-flex align-items-center gap-3">
                <input
                  type="hidden"
                  className="form-control p-2"
                  name={`pkg[${index}][${i}]`}
                  value={input.grid_pkg}
                />
                <input
                  type="text"
                  readOnly
                  className="form-control p-2"
                  name={`grid_locations[${index}][${i}]`}
                  value={input.grid_location}
                />
                <input
                  type="text"
                  className="form-control p-2"
                  placeholder="Area (SQM)"
                  name={`area[${index}][${i}]`}
                  id={`area_${index}_${i}`}
                  readOnly
                  value={input.area}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No Grid Data Available</p>
        )}
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

    let boe_number = document.getElementById(
      `shipping_bill_number_${key}`
    )?.value;
    Bills?.forEach((details) => {
      if (details.shipping_bill_number == boe_number) {
        package_weight += parseFloat(details.package_weight) || 0;
        no_of_pkgs += parseFloat(details.no_of_packages_declared ?? pkg) || 0;
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

    let weightInput = document.getElementById(`package_weight_${key}`);

    if (weightInput) {
      if (pkg && pkg != 0) {
        weightInput.value = (Per_package_weight * pkg).toFixed(5);
      } else if (pkg == 0) {
        weightInput.value = 0;
      } else {
        weightInput.value = parseFloat(Per_package_weight) || 0;
      }
    } else {
      console.log("Package weight input not found!");
    }

    const currentGrids = gridData2[key];
    console.log(currentGrids);
    if (currentGrids && currentGrids.length > 0 && pkg) {
      const updatedGrids = currentGrids.map((item) => {
        const totalPkg = item.total_pkg || 0;
        const gridPkg = item.grid_pkg || 0;
        const totalArea = Number(item.area || 0);

        let PKG = (totalPkg / no_of_pkgs) * pkg;
        let updatedItem = { ...item };

        if (totalPkg > 0 && totalArea > 0) {
          const perPackageArea = totalArea / totalPkg;
          updatedItem.area = Math.round(perPackageArea * PKG);
        }

        if (totalPkg > 0 && gridPkg > 0) {
          const perAreaPackage = gridPkg / totalPkg;
          updatedItem.grid_pkg = Math.round(perAreaPackage * PKG);
        }
        return updatedItem;

        // if (totalPkg > 0 && totalArea > 0) {
        //   const perPackageArea = totalArea / totalPkg;
        //   return {
        //     ...item,
        //     area: Math.round(perPackageArea * PKG),
        //   };
        // }
        // return item;
      });

      setGridData((prev) => ({
        ...prev,
        [key]: updatedGrids,
      }));
    }
  };

  useEffect(() => {
    if (Data) {
      setID(Data?.id);

      if (Data.status == "1" || Data.status == "2") {
        navigate(
          `?isFinalSubmit=1&id=${ID}&tally_sheet=1&container_number=${Data.container_number}`
        );
      }
    }
  }, [Data]);

  const handleRestData = async () => {
    setLoading(true);
    const url = `${ApiBaseUrl}stuffing/reset/data?id=${ID}&type=FCL&container_number=${ContainerNo}`;
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

  const handleDeleteBill = async (id,bill) => {
    setLoading(true);
    const url = `${ApiBaseUrl}stuffing/bill/delete?id=${id}&bill=${bill}`;
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
                {ContainerNo && TallySheet ? (
                  <div className="row justify-content-center">
                    <div className="col-lg-10 col-md-11">
                      {/* <div className="text-end">
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
                        <a href="?"
                          className="btn btn-primary mb-2 ms-2"
                        >
                          Search Another
                        </a>
                        <Link
                          to={"/stuffing"}
                          className="btn btn-primary mb-2 ms-2"
                        >
                          Go Back
                        </Link>
                      </div> */}
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
                              className="btn btn-primary mx-2"
                              onClick={handleFinalSubmit}
                            >
                              Final Submit
                            </button>
                            <a
                              href={`?isFinalSubmit=0&id=${ID}&container_number=${ContainerNo}`}
                              className="btn btn-primary mx-2"
                            >
                              Edit
                            </a>
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
                          </>
                        )}
                        <a href="?" className="btn btn-primary mx-2">
                          Search Another
                        </a>
                      </div>
                      <div className="" style={{ width: 789, height: 1099 }}>
                        <iframe
                          ref={iframeRef}
                          src={`/stuffing/tally_sheet?container_number=${ContainerNo}`}
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
                ) : Data && ContainerNo ? (
                  <>
                    <form action="" onSubmit={handleSubmitForm}>
                      <div className="text-end">
                        <a href="?" className="btn btn-primary mx-2">
                          Search Another
                        </a>
                        <Link
                          to={"/stuffing"}
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
                              <input
                                type="hidden"
                                name="cha_code"
                                defaultValue={Data?.carting_container?.cha_code}
                              />
                              <input
                                type="hidden"
                                name="gw_port_code"
                                defaultValue={
                                  Data?.carting_container?.gw_port_code
                                }
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
                                <label className="form-label">CRN NO</label>
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  defaultValue={Data?.crn_number}
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
                                  defaultValue={formatToDateTimeLocal(Data?.start_time??today)}
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
                                  defaultValue={formatToDateTimeLocal(Data?.end_time??today)}
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

                        <h4 className="text-primary mb-3">Bill Details</h4>
                         {/* {Bills?.map((billDetails, i) => ( */}
                              { TotalBills && TotalBills > 0 && Array.from({ length: TotalBills }, (_, i) => (
                          <div key={i} className="card card-body my-3">
                            <div className="d-flex gap-3 flex-row overflow-auto">
                              <div className="col-md-2 col-3">
                                <label
                                  htmlFor="shipping_bill_number"
                                  className="form-label"
                                >
                                  Bill Number
                                </label>
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  name={`shipping_bill_number[${i}]`}
                                  id={`shipping_bill_number_${i}`}
                                  defaultValue={
                                    Bills?.[i]?.shipping_bill_number??null
                                  }
                                />
                              </div>
                              <div className="col-md-3 col-4">
                                <label className="form-label">
                                  Cargo Description
                                </label>
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  name={`commodity_description[${i}]`}
                                  id={`commodity_description_${i}`}
                                  defaultValue={
                                    Bills?.[i]?.commodity_description??null
                                  }
                                />
                              </div>
                              <div className="col-md-3 col-4">
                                <label className="form-label">
                                  Package Code
                                </label>
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  name={`package_code[${i}]`}
                                  id={`package_code_${i}`}
                                  defaultValue={Bills?.[i]?.package_code??null}
                                />
                              </div>
                              <div className="col-md-2 col-3">
                                <label className="form-label">No of Pkgs</label>
                                <input
                                  type="number"
                                  className="form-control p-2"
                                  id={`no_of_packages_declared_${i}`}
                                  name={`no_of_packages_declared[${i}]`}
                                  defaultValue={
                                    Bills?.[i]?.no_of_packages_declared??null
                                  }
                                  onChange={(e) =>
                                    handleBillPkgW(i, e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-2 col-3">
                                <label className="form-label">Pkg Weight</label>
                                <input
                                  type="text"
                                  className="form-control p-2"
                                  id={`package_weight_${i}`}
                                  name={`package_weight[${i}]`}
                                  defaultValue={Bills?.[i]?.package_weight??null}
                                />
                              </div>
                              {/* <GridComponent
                                index={i}
                                data={Data?.stuffing_shipping_bill_details?.[i] ?? { grid_area: [] }}
                              /> */}

                              {Data?.carting_container && (
                                <>
                                  {gridData[i] && (
                                    <GridComponent
                                      index={i}
                                      data={gridData[i]}
                                    />
                                  )}
                                </>
                              )}
                              {Bills?.[i]?.id &&(
                              <div className="col-1 d-flex align-items-center">
                                <button className="btn btn-sm btn-danger" type="button" onClick={()=>{
                                  Swal.fire({
                                    title: 'Are you sure?',
                                    text: "This will delete data.!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, reset it!'
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      handleDeleteBill(Bills?.[i]?.id ,Bills?.[i]?.shipping_bill_number);
                                    }
                                  });
                                }} > Delete Bill</button>
                              </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="col-12 my-2 text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => setTotalBills(TotalBills + 1)}
                          >
                            Add Bill
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
                  <div className="row justify-content-center align-items-center h-75">
                    <div className="col-6">
                      <div className="card my-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <h4 className="text-left text-primary">Stuffing</h4>
                            <div className="text-end">
                              <Link
                                to={"/stuffing"}
                                className="btn btn-label-danger btn-sm"
                              >
                                Back
                              </Link>
                            </div>
                          </div>
                          <form action="" onSubmit={GetFormData}>
                            <p>Please Enter Container Number to Fetch Data</p>
                            <div className="form-floating form-floating-outline mb-6">
                              <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter Container Number"
                                name="container_number"
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
