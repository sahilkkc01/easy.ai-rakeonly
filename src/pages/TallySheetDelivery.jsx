import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  formatToDateTime,
  formatToDateTimeLocal,
} from "./main/formatToDateTime";
import { ApiBaseUrl } from "../Config";

// const TallySheetDelivery = ({ Data }) => {
const TallySheetDelivery = () => {
  const { GpmNo } = useParams();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");
  const [EditAble, setEditAble] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);

  const [totalPackages, setTotalPackages] = useState(0);
  const [totalPackagesWeight, setTotalPackagesWeight] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
    const [Area, setArea] = useState({});

  // const [TruckCount, setTruckCount] = useState(0);

  const addRow = () => {
    const newTruck = {
      id: null,
      delivery_id: null,
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
      boe: null,
      pkg_code: null,
      cargo_description: null,
      no_of_pkgs: null,
      pkgs_weight: null,
      grid_location: null,
      area_m: null,
    };

    setData((prevData) => ({
      ...prevData,
      delivery_trucks: [...prevData.delivery_trucks, newTruck],
    }));
  };

  useEffect(() => {
    GetData();
  }, [GpmNo]);

  const GetData = async () => {
    // const url = `https://ctas.live/backend/api/get/delivery/${GpmNo}`;
    const url = `${ApiBaseUrl}/get/delivery/${GpmNo}`;
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
    if (Data && Data.delivery_trucks) {
      let totalPackages = 0;
      let totalPackagesWeight = 0;
      let totalArea = 0;

      Data.delivery_trucks.forEach((Details) => {
        totalPackages += parseInt(Details.no_of_pkgs ?? 0);
        totalPackagesWeight += parseFloat(Details.pkgs_weight ?? 0);
        // totalArea += parseFloat(Details.area_m ?? 0);
        Details?.grid_area?.map((grid_area)=>(
          totalArea +=  parseFloat(grid_area.area??0)
        ))
      });
      setTotalPackages(totalPackages);
      setTotalPackagesWeight(totalPackagesWeight);
      setTotalArea(totalArea);
    }
  }, [Data]);

  if (!Data) {
    return (
      <div class="alert alert-danger" role="alert">
        No data received yet.
      </div>
    );
  }

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
    setLoading(true);
    // const url = `https://ctas.live/backend/api/delivery/update`;
    const url = `${ApiBaseUrl}/delivery/update`;
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
    Data?.delivery_bill_details?.map((details, a) => {
      if (details.boe_number == sBillNo) {
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
    const totalWeight = Data.gross_weight;

    let sbillInput = document.querySelector(`select[name="boe[${truckId}]"]`);
    if (!sbillInput) {
      console.log("Shipping bill input not found!");
      return;
    }
    let sbill = sbillInput.value.trim();

    let no_of_pkgs = 0;
    let package_weight = 0;
    let Per_package_weight = 0;
    Data?.delivery_bill_details?.forEach((details) => {
      if (details.boe_number == sbill) {
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
    if (Data && Data.delivery_trucks) {
      Data.delivery_trucks.forEach((Details, i) => {
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
          <input type="hidden" name="id" defaultValue={Data.id} />
          <div className="row">
            <div className="col">
              <span> S.No:</span> <b> {Data.id}</b>
              <br />
              <span>Date: </span> <b>{formattedDate}</b>
            </div>
            <div className="col text-center">
              <b>Cargo Handling Operator </b>
              <br />
              <span>Container Delivery Tally Sheet</span>
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
                  <td>GPM Number</td>
                  <td>
                    <strong>: {Data.gpm_number}</strong>
                  </td>
                  <td>Total No Of Trucks</td>
                  <td>
                    <strong>: {Data?.delivery_trucks?.length}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Bill Of Entry</td>
                  <td>
                    <strong>: {Data?.delivery_bill_details?.map((details, i) => (
                      <>
                        <span>{details.boe_number},</span>
                      </>
                    ))}</strong>
                  </td>
                  <td>Sline Code</td>
                  <td>
                    <strong>: {Data.shipping_line_code}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Container Number</td>
                  <td>
                    <strong>: {Data.container_number}</strong>
                  </td>
                  <td>Declared Gross Weight</td>
                  <td>
                    <strong>: {Data.gross_weight} Tons</strong>
                  </td>
                </tr>
                <tr>
                  <td>Container Size</td>
                  <td>
                    <strong>: {Data.container_size}</strong>
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
                  <td>Cha Code</td>
                  <td>
                    <strong>: {Data.cha_code}</strong>
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
                  <td>Total No. of Packages Declared</td>
                  <td>
                    <strong>: {totalPackages}</strong>
                  </td>
                  <td>Excess / Short Packages</td>
                  <td>
                    <strong>:- </strong>
                  </td>
                </tr>
                <tr>
                  <td>Handling Type</td>
                  <td>
                    <strong>
                      :
                      {EditAble ? (
                        <>
                          <select
                            name="handling_type"
                            className="form-select"
                            id=""
                          >
                            <option value="LCH">LCH</option>
                            <option value="MCH">MCH</option>
                          </select>
                        </>
                      ) : (
                        Data.handling_type
                      )}
                    </strong>
                  </td>
                  <td>Importer Name</td>
                  <td>
                    <strong>
                      :
                      {/* {EditAble ? (
                        <input
                          className="form-control p-1"
                          name={"importer_name"}
                          placeholder="Importer Name"
                        />
                      ) : ( */}
                      {Data.importer_name}
                      {/* )} */}
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
                  <th>Bill of Entry No</th>
                  <th>Pkg Code</th>
                  <th>Cargo Description (Code)</th>
                  <th>No of Pkgs</th>
                  <th>Pkg Weight</th>
                  <th>Grid Locations</th>
                  <th>Area (Sqm)</th>
                </tr>
              </thead>
              <tbody>
                {Data.delivery_trucks &&
                  Data.delivery_trucks.map((Trucks, k) => (
                    <tr key={k}>
                      <td>
                        {EditAble ? (
                          <>
                            <input
                              type="hidden"
                              className="form-control p-1"
                              name={`truck_id[${k}]`}
                              defaultValue={Trucks.id}
                            />
                            <input
                              className="form-control p-1"
                              name={`truck_number[${k}]`}
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
                            <select
                              name={`boe[${k}]`}
                              id=""
                              className="form-select py-1"
                              onChange={(e) =>
                                handleBillDetails(k, e.target.value)
                              }
                            >
                              <option value="" selected disabled>
                                Select SBill No
                              </option>
                              {Data.delivery_bill_details &&
                                Data.delivery_bill_details.map((details, i) => (
                                  <option value={details.boe_number} key={i}>
                                    {details.boe_number}
                                  </option>
                                ))}
                            </select>
                          </>
                        ) : (
                          Trucks.boe
                        )}
                      </td>
                      <td>
                        {EditAble ? (
                          <>
                            <input
                              className="form-control p-1"
                              name={`pkg_code[${k}]`}
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
                              name={`cargo_description[${k}]`}
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
                              name={`no_of_pkgs[${k}]`}
                              placeholder="No of package"
                              defaultValue={Trucks.no_of_pkgs}
                              onKeyUp={(e) =>
                                handleBillPkgW(k, e.target.value)
                              }
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
                              name={`pkgs_weight[${k}]`}
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
                              name={`grid_location[${k}]`}
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
                                  [`area[${k}]`]: values,
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
                            {Area[`area[${k}]`] ? ( 
                              Area[`area[${k}]`].map((area, q) => (
                                <label className="mb-1">
                                  {area.toUpperCase()}
                                <input
                                className="form-control p-1"
                                type=""
                                name={`area[${k}][${area.toUpperCase()}]`}
                                // defaultValue={area.toUpperCase()}
                                placeholder="Area"
                                required
                              />
                              </label>
                              ))
                            ) : (
                              <input
                                className="form-control p-1"
                                name={`area[${k}]`}
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
                  ))}
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
                </tr>

                {Data.delivery_trucks
                  ? Array.from(
                    {
                      length: Math.max(0, 10 - Data.delivery_trucks.length),
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
                    </tr>
                  ))}

                <tr>
                  <td>Total</td>
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

export default TallySheetDelivery;
