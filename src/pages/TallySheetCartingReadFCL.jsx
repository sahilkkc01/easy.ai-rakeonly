import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  formatToDateTime,
  formatToDateTimeLocal,
} from "./main/formatToDateTime";
import { ApiBaseUrl } from "../Config";

// const TallySheetCartingReadFCL = ({ Data }) => {
const TallySheetCartingReadFCL = () => {
  const { crnNumber } = useParams();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");

  const [Data, setData] = useState([]);
  const [EditAble, setEditAble] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPackages, setTotalPackages] = useState(0);
  const [totalPackagesWeight, setTotalPackagesWeight] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
   const [Area, setArea] = useState({});

  // const [TruckCount, setTruckCount] = useState(0);

  const addRow = () => {
    const newTruck = {
      id: null, // Generate a unique ID
      carting_id: null,
      truck_arrival_date: null,
      truck_number: null,
      status: null,
      created_at: null,
      updated_at: null,
      created_by: null,
      integration_flag: null,
      read_flag: null,
      status_flag: null,
      cycle_flag: null,
      pkg_code: null,
      cargo_description: null,
      no_of_pkgs: null,
      pkgs_weight: null,
      grid_location: null,
      area_m: null,
      sbill: null,
      full_partial_flag: null,
    };

    setData((prevData) => ({
      ...prevData,
      carting_trucks: [...prevData.carting_trucks, newTruck],
    }));
  };

  useEffect(() => {
    GetData();
  }, [crnNumber]);

  const GetData = async () => {
    setLoading(true);
    // const url = `https://ctas.live/backend/api/get/carting/data?crn_number=${crnNumber}`;
    const url = `${ApiBaseUrl}/get/carting/data?crn_number=${crnNumber}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        Swal.fire({
          icon: "info",
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

  useEffect(() => {
    let totalPackages = 0;
    let totalPackagesWeight = 0;
    let totalArea = 0;

    if (Data && Data.carting_trucks) {
      Data.carting_trucks.forEach((Details) => {
        totalPackages += parseInt(Details.no_of_pkgs ?? 0);
        totalPackagesWeight += parseFloat(Details.pkgs_weight ?? 0);
        // totalArea += parseFloat(Details.area_m ?? 0);
        Details?.grid_area?.map((grid_area)=>(
          totalArea +=  parseFloat(grid_area.area??0)
        ))
      });
    }
    setTotalPackages(totalPackages);
    setTotalPackagesWeight(totalPackagesWeight.toFixed(2));
    setTotalArea(totalArea);
  }, [Data, EditAble]);

  useEffect(() => {
    if (!Data) {
      return (
        <div class="alert alert-danger" role="alert">
          No data received yet.
        </div>
      );
    }
  }, [Data]);

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
    console.log(upperCaseFormValues);
    setEditAble(false);
    UpdateData(upperCaseFormValues);
  };

  const UpdateData = async (upperCaseFormValues) => {
    // const url = `https://ctas.live/backend/api/update/carting/data/${upperCaseFormValues.id}`;
    const url = `${ApiBaseUrl}/update/carting/data/${upperCaseFormValues.id}`;
    // const url = `http://192.168.0.116:8000/api/update/carting/data/${upperCaseFormValues.id}`;
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
          setTimeout(() => {
            GetData();
          }, 1000);
        });
      } else {
        Swal.fire({
          icon: "info",
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

  const handleBillDetails = (truckId, sBillNo) => {
    Data?.carting_shipping_bill_details?.map((details, a) => {
      if (details.shipping_bill_number == sBillNo) {
        document.querySelector(`input[name="pkg_code[${truckId}]"]`).value =
          details.package_code;
        document.querySelector(
          `input[name="cargo_description[${truckId}]"]`
        ).value = `${details.commodity_description} (${details.commodity_code})`;
        document.querySelector(`input[name="no_of_pkgs[${truckId}]"]`).value =
          details.no_of_packages_declared;
        document.querySelector(`input[name="pkgs_weight[${truckId}]"]`).value =
          details.package_weight;
      }
    });
  };

  const handleBillPkgW = (truckId, pkg) => {
    const BillLength = Data?.carting_shipping_bill_details?.length;
    let Per_package_weight = 0;
    if (BillLength === 1 && Data?.carting_shipping_bill_details?.[0].package_weight == 0) {
      const totalWeight = parseFloat(Data.gross_weight) || 0;
      const totalPackages =
        parseFloat(
          Data?.carting_shipping_bill_details?.[0].no_of_packages_declared
        ) || 0;

      Per_package_weight += totalWeight / totalPackages;
    } else {
      let sbillInput = document.querySelector(
        `select[name="sbill[${truckId}]"]`
      );
      if (!sbillInput) {
        console.log("Shipping bill input not found!");
        return;
      }
      let sbill = sbillInput.value.trim();

      let no_of_pkgs = 0;
      let package_weight = 0;
      Data?.carting_shipping_bill_details?.forEach((details) => {
        if (details.shipping_bill_number == sbill) {
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
    }
    let weightInput = document.querySelector(
      `input[name="pkgs_weight[${truckId}]"]`
    );
    if (weightInput) {
      if (pkg && pkg != 0) {
        weightInput.value = (Per_package_weight * pkg).toFixed(2);
      } else {
        weightInput.value = parseFloat(Per_package_weight) || 0;
      }
    } else {
      console.log("Package weight input not found!");
    }

    let totalPackages = 0;
    let totalPackagesWeight = 0;
    let totalArea = 0;
    if (Data && Data.carting_trucks) {
      Data.carting_trucks.forEach((Details, i) => {
        let no_of_pkgs =
          document
            .querySelector(`input[name="no_of_pkgs[${i}]"]`)
            ?.value.trim() || "0";
        let pkgs_weight =
          document
            .querySelector(`input[name="pkgs_weight[${i}]"]`)
            ?.value.trim() || "0";
        let area_m =
          document.querySelector(`input[name="area_m[${i}]"]`)?.value.trim() ||
          "0";

        totalPackages += parseInt(no_of_pkgs);
        totalPackagesWeight += parseFloat(pkgs_weight);
        // totalArea += parseFloat(area_m);
        Details?.grid_area?.map((grid_area)=>(
          totalArea +=  parseFloat(grid_area.area)
        ))
      });
    }

    setTotalPackages(totalPackages);
    setTotalPackagesWeight(totalPackagesWeight.toFixed(2));
    setTotalArea(totalArea);
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
      <div className="card tally-sheet shadow-none">
        <form className="card-body" onSubmit={handleFormSubmit}>
          <div className="row">
            <input type="hidden" name="id" defaultValue={Data.id} />
            <input type="hidden" name="type" defaultValue={Data.type} />
            <div className="col">
              <span> S.No:</span> <b> {Data.id}</b>
              <br />
              <span>Date: </span> <b>{formattedDate}</b>
            </div>
            <div className="col text-center">
              <b>Cargo Handling Operator </b>
              <br />
              <span>Container Carting Tally Sheet</span>
            </div>
            <div className="col text-end">
              {EditAble ? (
                <button type="submit" className="btn btn-sm btn-label-primary">
                  Save
                </button>
              ) : (
                <span
                  type="button"
                  className="btn btn-sm btn-label-primary"
                  onClick={() => setEditAble(true)}
                >
                  Edit
                </span>
              )}
            </div>
          </div>
          <hr />
          <div className="row px-0 top">
            <table className="table table-borderless mb-4 table-font text-nowrap">
              <tbody>
                <tr>
                  <td>Sbill Number</td>
                  <td className="text-wrap">
                    <strong>
                      : 
                       {Data?.carting_shipping_bill_details?.map((de, i) => {
                        return `${de.shipping_bill_number}, `;
                      })}
                    </strong>
                  </td>
                  <td>Total No Of Trucks</td>
                  <td>
                    <strong>
                      : {Data.carting_trucks && Data.carting_trucks.length}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>CRN Number</td>
                  <td>
                    <strong>: {Data.crn_number}</strong>
                  </td>
                  <td>Sline Code</td>
                  <td>
                    <strong>: {Data.shipping_liner_code}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Container Number</td>
                  <td>
                    <strong>
                      : {Data?.carting_containers?.[0]?.container_number}
                    </strong>
                  </td>
                  <td>Declared Gross Weight</td>
                  <td>
                    <strong>: {Data.gross_weight}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Container Size</td>
                  <td>
                    <strong>
                      : {Data?.carting_containers?.[0]?.container_size}
                    </strong>
                  </td>
                  <td>Warehouse Name</td>
                  <td>
                    <strong>: Export Warehouse</strong>
                  </td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>
                    <strong className="text-uppercase">: {Data.type}</strong>
                  </td>
                  <td>Start Date & Time</td>
                  <td>
                    <strong>
                      :
                      {EditAble ? (
                        <>
                          <input
                            type="datetime-local"
                            className="form-control p-1"
                            name="start_time"
                            defaultValue={formatToDateTimeLocal(today)}
                          />
                        </>
                      ) : (
                        Data.start_time && formatToDateTime(Data.start_time)
                      )}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>GW Port Code</td>
                  <td>
                    <strong>:{Data.gw_port_code}</strong>
                  </td>
                  <td>End Date & Time</td>
                  <td>
                    <strong>
                      :
                      {EditAble ? (
                        <>
                          <input
                            type="datetime-local"
                            className="form-control p-1"
                            name="end_time"
                            defaultValue={formatToDateTimeLocal(today)}
                          />
                        </>
                      ) : (
                        Data.end_time && formatToDateTime(Data.end_time)
                      )}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Cha Code</td>
                  <td>
                    <strong>:{Data.cha_code}</strong>
                  </td>
                  <td>Excess / Short Packages</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Total No. of Packages Declared</td>
                  <td>
                    <strong>: {totalPackages}</strong>
                  </td>
                  <td>Exporter Name</td>
                  <td>
                    <strong>: {Data.exporter_name}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Handling Type</td>
                  <td>
                    <strong>
                      :{" "}
                      {EditAble ? (
                        <>
                          <select
                            name="handline_type"
                            className="form-control"
                            id=""
                          >
                            <option value="LCH">LCH</option>
                            <option value="MCH">MCH</option>
                          </select>
                        </>
                      ) : (
                        Data.handline_type
                      )}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row main">
            <table className="table table-bordered table-font">
              <thead className="">
                <tr>
                  <th>Truck Number</th>
                  <th>Truck Arrival Date</th>
                  <th>SBill</th>
                  <th>Pkg Code</th>
                  <th>Cargo Description (Code)</th>
                  <th>No of Pkgs</th>
                  <th>Pkg Weight</th>
                  <th>Grid Locations</th>
                  <th>Area (Sqm)</th>
                </tr>
              </thead>
              <tbody>
                {Data.carting_trucks &&
                  Data.carting_trucks.map((Trucks, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {EditAble ? (
                            <>
                              <input
                                type="hidden"
                                className="form-control p-1"
                                name={`truck_id[${index}]`}
                                defaultValue={Trucks.id}
                              />
                              <input
                                className="form-control p-1"
                                name={`truck_number[${index}]`}
                                defaultValue={Trucks.truck_number}
                              />
                            </>
                          ) : (
                            Trucks.truck_number
                          )}
                        </td>
                        <td>
                          {EditAble ? (
                            <>
                              <input
                                className="form-control p-1"
                                type="datetime-local"
                                name={`truck_arrival_date[${index}]`}
                                defaultValue={formatToDateTimeLocal(
                                  Trucks.truck_arrival_date
                                )}
                              />
                            </>
                          ) : (
                            formatToDateTime(Trucks.truck_arrival_date)
                          )}

                          {/* {formatToDateTime(Trucks.truck_arrival_date)} */}
                        </td>
                        <td>
                          {EditAble ? (
                            <>
                              <select
                                name={`sbill[${index}]`}
                                id=""
                                className="form-select py-1"
                                onChange={(e) =>
                                  handleBillDetails(index, e.target.value)
                                }
                              >
                                <option value="" selected disabled>
                                  Select SBill No
                                </option>
                                {Data.carting_shipping_bill_details &&
                                  Data.carting_shipping_bill_details.map(
                                    (details, i) => (
                                      <option
                                        value={details.shipping_bill_number}
                                        key={i}
                                      >
                                        {details.shipping_bill_number}
                                      </option>
                                    )
                                  )}
                              </select>
                            </>
                          ) : (
                            Trucks.sbill
                          )}
                        </td>
                        <td>
                          {EditAble ? (
                            <>
                              <input
                                className="form-control p-1"
                                name={`pkg_code[${index}]`}
                                placeholder="Package Code"
                                defaultValue={Trucks.pkg_code}
                              />
                            </>
                          ) : (
                            Trucks.pkg_code
                          )}
                        </td>
                        <td>
                          {EditAble ? (
                            <>
                              <input
                                className="form-control p-1"
                                name={`cargo_description[${index}]`}
                                placeholder="Commodity Description"
                                defaultValue={Trucks.cargo_description}
                              />
                            </>
                          ) : (
                            Trucks.cargo_description
                          )}
                        </td>

                        <td>
                          {EditAble ? (
                            <>
                              <input
                                className="form-control p-1"
                                name={`no_of_pkgs[${index}]`}
                                placeholder="No of package"
                                onKeyUp={(e) =>
                                  handleBillPkgW(index, e.target.value)
                                }
                                defaultValue={Trucks.no_of_pkgs}
                              />
                            </>
                          ) : (
                            Trucks.no_of_pkgs
                          )}
                        </td>
                        <td>
                          {EditAble ? (
                            <>
                              <input
                                className="form-control p-1"
                                name={`pkgs_weight[${index}]`}
                                placeholder="Package Weight"
                                defaultValue={Trucks.pkgs_weight}
                              />
                            </>
                          ) : (
                            Trucks.pkgs_weight
                          )}
                        </td>
                        <td>
                        {EditAble ? (
                          <>
                            <textarea
                              className="form-control p-1"
                              name={`grid_location[${index}]`}
                              placeholder="Grid Location"
                              defaultValue={Trucks.grid_location}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^a-zA-Z0-9 ]/g,
                                  ""
                                );
                                e.target.value = value;
                                const values = value.split(" ");

                                setArea((prev) => ({
                                  ...prev,
                                  [`area[${index}]`]: values,
                                }));
                              }}
                              required
                            />
                          </>
                        ) : (
                          Trucks.grid_location
                        )}
                      </td>
                      <td>
                        {EditAble ? (
                          <>
                            {Area[`area[${index}]`] ? ( 
                              Area[`area[${index}]`].map((area, q) => (
                                <label className="mb-1">
                                  {area.toUpperCase()}
                                <input
                                className="form-control p-1"
                                type=""
                                name={`area[${index}][${area.toUpperCase()}]`}
                                // defaultValue={area.toUpperCase()}
                                placeholder="Area"
                                required
                              />
                              </label>
                              ))
                            ) : (
                              <input
                                className="form-control p-1"
                                name={`area[${index}]`}
                                defaultValue={Trucks.area}
                                placeholder="Area"
                                required
                              />
                            )}
                          </>
                        ) : (
                          Trucks?.grid_area?.map((grid_area)=>(
                            <span>{grid_area.area} ,</span>
                          ))
                        )}
                      </td>
                      </tr>
                    );
                  })}

                {/* {Array.from({ length: TruckCount }, (_, i) => (
                  <tr key={i}>
                    <td>
                      {EditAble && (
                        <input
                          className="form-control p-1"
                          name={`truck_number[${i}]`}
                        />
                      )}
                    </td>
                    <td>
                      {EditAble && (
                        <input
                          className="form-control p-1"
                          name={`truck_arrival_date[${i}]`}
                        />
                      )}
                    </td>
                    <td>
                      {EditAble && (
                        <>
                          <select
                            name={`sbill[${i}]`}
                            id=""
                            className="form-select py-1"
                            onChange={(e) =>
                              handleBillDetails(i, e.target.value)
                            }
                          >
                            <option value="" selected disabled>
                              Select SBill No
                            </option>
                            {Data.carting_shipping_bill_details &&
                              Data.carting_shipping_bill_details.map(
                                (details, i) => (
                                  <option
                                    value={details.shipping_bill_number}
                                    key={i}
                                  >
                                    {details.shipping_bill_number}
                                  </option>
                                )
                              )}
                          </select>
                        </>
                      )}
                    </td>
                    <td>
                      {EditAble && (
                        <>
                          <input
                            className="form-control p-1"
                            name={`pkg_code[${i}]`}
                            placeholder="Package Code"
                          />
                        </>
                      )}
                    </td>
                    <td>
                      {EditAble && (
                        <>
                          <input
                            className="form-control p-1"
                            name={`cargo_description[${i}]`}
                            placeholder="Commodity Description"
                          />
                        </>
                      )}
                    </td>

                    <td>
                      {EditAble && (
                        <>
                          <input
                            className="form-control p-1"
                            name={`no_of_pkgs[${i}]`}
                            placeholder="No of package"
                          />
                        </>
                      )}
                    </td>
                    <td>
                      {EditAble && (
                        <>
                          <input
                            className="form-control p-1"
                            name={`pkgs_weight[${i}]`}
                            placeholder="Package Weight"
                          />
                        </>
                      )}
                    </td>
                    <td>
                      {EditAble && (
                        <>
                          <input
                            className="form-control p-1"
                            name={`grid_location[${i}]`}
                            placeholder="Grid Location"
                          />
                        </>
                      )}
                    </td>
                    <td>
                      {EditAble && (
                        <>
                          <input
                            className="form-control p-1"
                            name={`area_m[${i}]`}
                            placeholder="Area"
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))} */}

                <tr>
                  <td>
                    {EditAble && (
                      <button
                        className="btn btn-sm btn-label-primary px-2 py-1"
                        type="button"
                        onClick={addRow}
                      >
                        Add&nbsp;Truck
                      </button>
                    )}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                {Data.carting_trucks
                  ? Array.from(
                    {
                      length: Math.max(0, 10 - Data.carting_trucks.length),
                    },
                    (_, i) => (
                      <tr key={i}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    )
                  )
                  : Array.from({ length: 10 }, (_, i) => (
                    <tr key={i}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}

                <tr>
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{totalPackages}</td>
                  <td>{totalPackagesWeight}</td>
                  <td></td>
                  <td>{totalArea}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row border" style={{ height: "150px" }}>
            <div className="col-md-12">
              <p>
                <b>Remarks : </b>
                <span> </span>
              </p>
            </div>
          </div>
          <div className="row mt-1 align-items-end" style={{ height: "130px" }}>
            <div className="col">
              <span>
                Said to contain received cargo in sound condition and to my
                entire satisfaction.
              </span>
            </div>
            <div className="col text-center">
              <span>Tallied By</span> <br />
              <b>--</b>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default TallySheetCartingReadFCL;
