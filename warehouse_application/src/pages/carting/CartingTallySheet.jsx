import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Header from "../main/header";
import Nav from "../main/nav";
import Footer from "../main/footer";
import { formatToDateTime } from "../main/formatToDateTime";

export default function CartingTallySheet() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [Data, setData] = useState(null);

  const fetchData = async (crn_number) => {
    setLoading(true);
    const url = `https://ctas.live/backend/api/get/carting?crn_number=${crn_number}`;
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

  useEffect(() => {
    const crn_number = searchParams.get("crn_number");
    if (crn_number) {
      fetchData(crn_number);
    }
  }, [searchParams]);

  const [totalPackages, setTotalPackages] = useState(0);
  const [totalPackagesWeight, setTotalPackagesWeight] = useState(0);
  const [totalArea, setTotalArea] = useState(0);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");

  useEffect(() => {
    let totalPackages = 0;
    let totalPackagesWeight = 0;
    let totalArea = 0;

    if (Data && Data.carting_trucks) {
      Data.carting_trucks.forEach((Details) => {
        totalPackages += parseInt(Details.no_of_pkgs ?? 0);
        totalPackagesWeight += parseFloat(Details.pkgs_weight ?? 0);
        Details?.grid_area?.map(
          (grid_area) => (totalArea += parseFloat(grid_area.area ?? 0))
        );
      });
    }
    setTotalPackages(totalPackages);
    setTotalPackagesWeight(totalPackagesWeight.toFixed(2));
    setTotalArea(totalArea);
  }, [Data]);

  if (!Data) {
    return (
      <div className="alert alert-danger" role="alert">
        No data received yet.
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div
          className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 9999 }}
        >
          <div className="sk-chase sk-primary display-1">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="sk-chase-dot" />
            ))}
          </div>
        </div>
      )}

      <div className="card card-body p-4">
        <div className="card tally_sheet shadow-none">
          <div className="row">
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
            <div className="col text-end"></div>
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
                      {Data?.carting_shipping_bill_details?.map((de, i) => (
                        <>
                          <span>{de.shipping_bill_number},</span>
                          {(i + 1) % 3 === 0 && <br />}
                        </>
                      ))}
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
                      :{Data.start_time && formatToDateTime(Data.start_time)}
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
                      :{Data.end_time && formatToDateTime(Data.end_time)}
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
                    {/* <strong>: {totalPackages}</strong> */}
                    <strong> : 
                      {(() => {
                        const sum = Data?.carting_shipping_bill_details?.reduce(
                          (total, details) =>
                            total + Number(details.no_of_packages_declared??0),
                          0
                        );
                        return sum && sum != 0 ? sum : totalPackages;
                      })()}
                    </strong>
                  </td>
                  <td>Exporter Name</td>
                  <td>
                    <strong>: {Data.exporter_name}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Handling Type</td>
                  <td>
                    <strong>:{Data.handline_type}</strong>
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
                  {/* <th>Truck Arrival Date</th> */}
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
                        <td>{Trucks.truck_number}</td>
                        {/* <td>{formatToDateTime(Trucks.truck_arrival_date)}</td> */}
                        <td>{Trucks.sbill}</td>
                        <td>{Trucks.pkg_code}</td>
                        <td>{Trucks.cargo_description}</td>

                        <td>{Trucks.no_of_pkgs}</td>
                        <td>{Trucks.pkgs_weight}</td>
                        <td>
                          {Trucks?.grid_area?.map((grid_area) => (
                            <span>{grid_area.grid_locations} ,</span>
                          ))}
                        </td>
                        <td>
                          {Trucks?.grid_area?.map((grid_area) => (
                            <span>{grid_area.area} ,</span>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                {Data.carting_trucks
                  ? Array.from(
                      {
                        length: Math.max(0, 10 - Data.carting_trucks.length),
                      },
                      (_, i) => (
                        <tr key={i}>
                          <td></td>
                          {/* <td></td> */}
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
                        {/* <td></td> */}
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
                  {/* <td></td> */}
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{totalPackages}</td>
                  <td>{totalPackagesWeight && !isNaN(Number(totalPackagesWeight)) ? Number(totalPackagesWeight).toFixed(2) : 0}</td>
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
        </div>
      </div>
    </>
  );
}
