import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { formatToDateTime, formatToDateTimeLocal } from "./main/formatToDateTime";
import { ApiBaseUrl } from "../Config";

// const TallySheetDeStuffingLCL = ({ Data }) => {
const TallySheetDeStuffingLCL = () => {
  const { ContainerNo } = useParams();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");
  const [Data, setData] = useState([]);
  const [EditAble, setEditAble] = useState(false);
  const [loading, setLoading] = useState(false);

  const [totalPackages, setTotalPackages] = useState(0);
  const [totalPackagesWeight, setTotalPackagesWeight] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
  const [Area, setArea] = useState({});

  useEffect(() => {
    GetData();
  }, [ContainerNo]);

  const GetData = async () => {
    setLoading(true);
    // const url = `https://ctas.live/backend/api/get/de_stuffing_data/LCL/${ContainerNo}`;
    const url = `${ApiBaseUrl}/get/de_stuffing_data/LCL/${ContainerNo}`;
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
    if (Data && Data.de_stuffing_bill_details) {
      let totalPackages = 0;
      let totalPackagesWeight = 0;
      let totalArea = 0;

      Data.de_stuffing_bill_details.forEach((Details) => {
        totalPackages += parseInt(Details.no_of_packages_declared ?? 0);
        totalPackagesWeight += parseFloat(Details.package_weight ?? 0);
        // totalArea += parseFloat(Details.area ?? 0);
        Details?.grid_area?.map((grid_area)=>(
          totalArea +=  parseFloat(grid_area.area)
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
    // const url = `https://ctas.live/backend/api/de_stuffing_data/update`;
    const url = `${ApiBaseUrl}/de_stuffing_data/update`;
    try {
      const response = await axios.post(url, upperCaseFormValues, {
        headers: { "Content-Type": "multipart/form-data" },
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

    let weightInput = document.querySelector(
      `input[name="package_weight[${id}]"]`
    );
    if (weightInput) {
      if (pkg) {
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
    if (Data && Data.de_stuffing_bill_details) {
      Data.de_stuffing_bill_details.forEach((Details, i) => {
        let no_of_pkgs =
          document
            .querySelector(`input[name="no_of_packages_declared[${Details.id}]"]`)
            ?.value.trim() || "0";
        let pkgs_weight =
          document
            .querySelector(`input[name="package_weight[${Details.id}]"]`)
            ?.value.trim() || "0";
        let area_m =
          document.querySelector(`input[name="area[${Details.id}]"]`)?.value.trim() ||
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
              <span>Container De Stuffing Tally Sheet</span>
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
                  <td>Container Number</td>
                  <td>
                    <strong>: {Data.container_number}</strong>
                  </td>
                  <td>Seal No</td>
                  <td>
                    <td>
                      {EditAble ? (
                        <div className="d-flex gap-1">
                          <input
                            className="form-control p-1"
                            name={`seal_number`}
                            defaultValue={Data.seal_number}
                            placeholder="Seal Number"
                          />
                          <label
                            htmlFor="seal_image"
                            className="btn btn-outline-primary btn-sm px-2 py-1"
                          >
                            <i className="ri-camera-fill"></i>
                            <input
                              type="file"
                              id="seal_image"
                              name="seal_image"
                              className="d-none"
                              accept="image/*"
                              capture="environment"
                            />
                          </label>
                        </div>
                      ) : (
                        <strong>: {Data.seal_number}</strong>
                      )}
                    </td>
                  </td>
                </tr>
                <tr>
                  <td>Container Size</td>
                  <td>
                    <strong>: {Data.container_size}</strong>
                  </td>
                  <td>SLine Code</td>
                  <td>
                    <strong>: {Data.shipping_liner_code}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>
                    <strong className="text-uppercase">: {Data.type}</strong>
                  </td>
                  <td>Warehouse Name</td>
                  <td>
                    <strong>: Import Warehouse</strong>
                  </td>
                </tr>
                <tr>
                  <td>GW Port Code</td>
                  <td>
                    {EditAble ? (
                      <input
                        className="form-control p-1"
                        name={`gw_port`}
                        defaultValue={Data.gw_port}
                        placeholder="Gw Port"
                      />
                    ) : (
                      <strong>: {Data.gw_port}</strong>
                    )}
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
                  <td>Total No. of Packages Declared</td>
                  <td>
                    <strong>: {totalPackages}</strong>
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
                      <strong>: {Data.handling_type}</strong>
                    )}
                  </td>
                  <td>Excess / Short Packages</td>
                  <td>
                    <strong>:-</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row main">
            <table className="table table-bordered table-font">
              <thead className="">
                <tr>
                  <th>Bol No</th>
                  <th>Importer Name</th>
                  <th>Cargo Description (Code)</th>
                  <th>No of Pkgs</th>
                  <th>Pkg Weight</th>
                  <th>Grid Locations</th>
                  <th>Area (Sqm)</th>
                </tr>
              </thead>
              <tbody>
                {Data.de_stuffing_bill_details &&
                  Data.de_stuffing_bill_details.map((Details, k) => (
                    <tr key={k}>
                      <td>
                        {EditAble ? (
                          <>
                            <input
                              className="form-control p-1"
                              name={`bol_number[${Details.id}]`}
                              defaultValue={Details.bol_number}
                              placeholder="Bol Number"
                            />
                          </>
                        ) : (
                          Details.bol_number
                        )}
                      </td>
                      <td>
                        {" "}
                        {EditAble ? (
                          <>
                            <input
                              className="form-control p-1"
                              name={`importer_name[${Details.id}]`}
                              defaultValue={Details.importer_name}
                              placeholder="Importer Name"
                            />
                          </>
                        ) : (
                          Details.importer_name
                        )}
                      </td>
                      <td>
                        {" "}
                        {EditAble ? (
                          <>
                            <input
                              className="form-control p-1"
                              name={`commodity_description[${Details.id}]`}
                              defaultValue={Details.commodity_description}
                              placeholder="Commodity Description"
                            />
                          </>
                        ) : (
                          Details.commodity_description
                        )}
                      </td>

                      <td>
                        {" "}
                        {EditAble ? (
                          <>
                            <input
                              className="form-control p-1"
                              name={`no_of_packages_declared[${Details.id}]`}
                              defaultValue={Details.no_of_packages_declared}
                              onKeyUp={(e) =>
                                handleBillPkgW(Details.id, e.target.value)
                              }
                              placeholder="No of package"
                            />
                          </>
                        ) : (
                          Details.no_of_packages_declared
                        )}
                      </td>
                      <td>
                        {" "}
                        {EditAble ? (
                          <>
                            <input
                              className="form-control p-1"
                              name={`package_weight[${Details.id}]`}
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
                              name={`grid_locations[${Details.id}]`}
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
                                  [`area[${Details.id}]`]: values,
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
                            {Area[`area[${Details.id}]`] ? ( 
                              Area[`area[${Details.id}]`].map((area, q) => (
                                <label className="mb-1">
                                  {area.toUpperCase()}
                                <input
                                className="form-control p-1"
                                type=""
                                name={`area[${Details.id}][${area.toUpperCase()}]`}
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
                {Data.de_stuffing_bill_details
                  ? Array.from(
                    {
                      length: Math.max(
                        0,
                        10 - Data.de_stuffing_bill_details.length
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
                    </tr>
                  ))}

                <tr>
                  <td>Total</td>
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

export default TallySheetDeStuffingLCL;
