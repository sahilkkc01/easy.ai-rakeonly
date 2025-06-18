import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  formatToDateTime,
  formatToDateTimeLocal,
} from "./main/formatToDateTime";
import { ApiBaseUrl } from "../Config";

// const TallySheetStuffingFCL = ({ Data }) => {
const TallySheetStuffingFCL = () => {
  const { ContainerNo } = useParams();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");
  const [EditAble, setEditAble] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [totalPackages, setTotalPackages] = useState(0);
  const [totalPackagesWeight, setTotalPackagesWeight] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
   const [Area, setArea] = useState({});

  const addRow = () => {
    const newBill = {
      id: null,
      stuffing_id: null,
      commodity_code: null,
      no_of_packages_declared: null,
      package_type: null,
      shipping_bill_number: null,
      shipping_bill_date: null,
      package_weight: null,
      commodity_description: null,
      package_code: null,
      grid_locations: null,
      area: null,
      remark: null,
      status: null,
      created_at: null,
      updated_at: null,
      created_by: null,
      integration_flag: null,
      read_flag: null,
      status_flag: null,
      cycle_flag: null,
      cha_code: null,
      cha_name: null,
      hsn_code: null,
    };

    setData((prevData) => ({
      ...prevData,
      stuffing_shipping_bill_details: [...prevData.stuffing_shipping_bill_details, newBill],
    }));
  };

  useEffect(() => {
    GetData();
  }, [ContainerNo]);

  const GetData = async () => {
    setLoading(true);
    // const url = `https://ctas.live/backend/api/get/stuffing_data/FCL/${ContainerNo}`;
    const url = `${ApiBaseUrl}/get/stuffing_data/FCL/${ContainerNo}`;
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

    if (Data && Data.stuffing_shipping_bill_details) {
      Data.stuffing_shipping_bill_details.forEach((Details) => {
        totalPackages += parseInt(Details.no_of_packages_declared ?? 0);
        totalPackagesWeight += parseFloat(Details.package_weight ?? 0);
        // totalArea += parseFloat(Details.area ?? 0);
        Details?.grid_area?.map((grid_area)=>(
          totalArea +=  parseFloat(grid_area.area??0)
        ))
      });
    }
    setTotalPackages(totalPackages);
    setTotalPackagesWeight(totalPackagesWeight.toFixed(2));
    setTotalArea(totalArea);
  }, [Data, EditAble]);

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
    // const url = `https://ctas.live/backend/api/stuffing_data/update`;
    const url = `${ApiBaseUrl}/stuffing_data/update`;
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

  const handleBillPkgW = (id, k, pkg) => {

    // let no_of_pkgs = 0;
    // let package_weight = 0;
    // let Per_package_weight = 0;
    // Data?.stuffing_shipping_bill_details?.forEach((details) => {
    //   if (details.id == id) {
    //     package_weight += parseFloat(details.package_weight) || 0;
    //     no_of_pkgs += parseFloat(details.no_of_packages_declared) || 0;
    //   }
    // });
    // if (
    //   package_weight &&
    //   no_of_pkgs &&
    //   package_weight != 0 &&
    //   no_of_pkgs != 0
    // ) {
    //   Per_package_weight += package_weight / no_of_pkgs.toFixed(2);
    // }

    // let weightInput = document.querySelector(
    //   `input[name="package_weight[${k}]"]`
    // );
    // if (weightInput) {
    //   if (pkg && pkg != 0) {
    //     weightInput.value = (Per_package_weight * pkg).toFixed(2);
    //   } else {
    //     weightInput.value = parseFloat(Per_package_weight) || 0;
    //   }
    // } else {
    //   console.log("Package weight input not found!");
    // }

    let totalPackages = 0;
    let totalPackagesWeight = 0;
    let totalArea = 0;
    if (Data && Data.stuffing_shipping_bill_details) {
      Data.stuffing_shipping_bill_details.forEach((Details, i) => {
        let no_of_pkgs =
          document
            .querySelector(`input[name="no_of_packages_declared[${i}]"]`)
            ?.value.trim() || "0";
        let pkgs_weight =
          document
            .querySelector(`input[name="package_weight[${i}]"]`)
            ?.value.trim() || "0";
        let area_m =
          document.querySelector(`input[name="area[${i}]"]`)?.value.trim() ||
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
          <input type="hidden" name="type" defaultValue={Data.type} />
          <div className="row">
            <div className="col">
              <span> S.No:</span> <b> {Data.id}</b>
              <br />
              <span>Date: </span> <b>{formattedDate}</b>
            </div>
            <div className="col text-center">
              <b>Cargo Handling Operator </b>
              <br />
              <span>Container Stuffing Tally Sheet</span>
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
                      {Data?.stuffing_shipping_bill_details?.map((bills, i) => (
                        <span key={i}>{bills.shipping_bill_number} ,</span>
                      ))}
                    </strong>
                  </td>
                  <td>Total No Of Containers</td>
                  <td>
                    <strong>: 1</strong>
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
                    {EditAble ? (
                      <>
                        <input
                          type="datetime-local"
                          className="form-control p-1"
                          defaultValue={formatToDateTimeLocal(today)}
                          name="start_time"
                        />
                      </>
                    ) : (
                      <strong>: {formatToDateTime(Data.start_time)}</strong>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>GW Port Code</td>
                  <td>
                    <strong>:{Data.gw_port}</strong>
                  </td>
                  <td>End Date & Time</td>
                  <td>
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
                      <strong>: {formatToDateTime(Data.end_time)}</strong>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Cha Code</td>
                  <td>
                    <strong>:{Data?.stuffing_shipping_bill_details?.map((details, i) => (
                      <>
                        <span>{details.cha_code} ,</span>
                      </>
                    ))}</strong>
                  </td>
                  <td>Excess / Short Packages</td>
                  <td>
                    <strong>: --</strong>
                  </td>
                </tr>
                <tr>
                  <td>Total No. of Packages Declared</td>
                  <td>
                    <strong>: {totalPackages}</strong>
                  </td>
                  <td>Exporter Name</td>
                  <td>
                    <strong>: {Data?.stuffing_shipping_bill_details?.map((details, i) => (
                      <>
                        <span>{details.cha_name} ,</span>
                      </>
                    ))}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Handling Type</td>
                  <td>
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

                      <strong>:   {Data.handling_type}</strong>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row main">
            <table className="table table-bordered table-font">
              <thead className="">
                <tr>
                  <th>Container Number</th>
                  <th>SBill No</th>
                  <th>Pkg Code</th>
                  <th>Cargo Description (Code)</th>
                  <th>No of Pkgs</th>
                  <th>Pkg Weight</th>
                  <th>Grid Locations</th>
                  <th>Area (Sqm)</th>
                </tr>
              </thead>
              <tbody>
                {Data?.stuffing_shipping_bill_details?.map((Details, i) => (
                  <tr key={i}>
                    <td>{Data.container_number}</td>
                    <td>
                      {EditAble ? (
                        <>
                          <input
                            className="form-control p-1"
                            name={`shipping_bill_id[${i}]`}
                            defaultValue={Details.id}
                            type="hidden"
                          />
                          <input
                            className="form-control p-1"
                            name={`shipping_bill_number[${i}]`}
                            defaultValue={Details.shipping_bill_number}
                            placeholder="Shipping Bill Number"
                          />
                        </>
                      ) : (
                        Details.shipping_bill_number
                      )}
                    </td>
                    <td>
                      {EditAble ? (
                        <>
                          <input
                            className="form-control p-1"
                            name={`package_code[${i}]`}
                            defaultValue={Details.package_code}
                            placeholder="Package Code"
                          />
                        </>
                      ) : (
                        Details.package_code
                      )}
                    </td>

                    <td>
                      {EditAble ? (
                        <input
                          className="form-control p-1"
                          name={`commodity_description[${i}]`}
                          defaultValue={Details.commodity_description}
                          placeholder="Cargo Description Code"
                        />
                      ) : (
                        <>
                          {Details.commodity_description} (
                          {Details.commodity_code})
                        </>
                      )}
                    </td>
                    <td>
                      {EditAble ? (
                        <>
                          <input
                            className="form-control p-1"
                            name={`no_of_packages_declared[${i}]`}
                            defaultValue={Details.no_of_packages_declared}
                            onKeyUp={(e) =>
                              handleBillPkgW(Details.id, i, e.target.value)
                            }
                            placeholder="No of package"
                          />
                        </>
                      ) : (
                        Details.no_of_packages_declared
                      )}
                    </td>
                    <td>
                      {EditAble ? (
                        <>
                          <input
                            className="form-control p-1"
                            name={`package_weight[${i}]`}
                            defaultValue={Details.package_weight}
                            placeholder="No of package"
                          />
                        </>
                      ) : (
                        Details.package_weight
                      )}
                    </td>

                    <td>
                        {EditAble ? (
                          <>
                            <textarea
                              className="form-control p-1"
                              name={`grid_locations[${i}]`}
                              placeholder="Grid Location"
                              defaultValue={Details.grid_locations}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^a-zA-Z0-9 ]/g,
                                  ""
                                );
                                e.target.value = value;
                                const values = value.split(" ");

                                setArea((prev) => ({
                                  ...prev,
                                  [`area[${i}]`]: values,
                                }));
                              }}
                              required
                            />
                          </>
                        ) : (
                          Details.grid_locations
                        )}
                      </td>
                      <td>
                        {EditAble ? (
                          <>
                            {Area[`area[${i}]`] ? ( 
                              Area[`area[${i}]`].map((area, q) => (
                                <label className="mb-1">
                                  {area.toUpperCase()}
                                <input
                                className="form-control p-1"
                                type=""
                                name={`area[${i}][${area.toUpperCase()}]`}
                                // defaultValue={area.toUpperCase()}
                                placeholder="Area"
                                required
                              />
                              </label>
                              ))
                            ) : (
                              <input
                                className="form-control p-1"
                                name={`area[${Details.id}]`}
                                defaultValue={Details.area}
                                placeholder="Area"
                                required
                              />
                            )}
                          </>
                        ) : (
                          Details?.grid_area?.map((grid_area)=>(
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
                        Add&nbsp;Bill
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
                {Data?.stuffing_shipping_bill_details
                  ? Array.from(
                    {
                      length: Math.max(
                        0,
                        10 - Data.stuffing_shipping_bill_details.length
                      ),
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

export default TallySheetStuffingFCL;
