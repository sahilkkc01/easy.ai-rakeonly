import React, { useState, useEffect} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Header from "../main/header";
import Nav from "../main/nav";
import Footer from "../main/footer";
import { formatToDateTime } from "../main/formatToDateTime";


export default function DeStuffingTallySheet() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [Data, setData] = useState(null);
  
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

  useEffect(() => {
    const container_no = searchParams.get("container_no");
    const type = searchParams.get("type");
    if (container_no && type) {
      fetchData(type, container_no);
    }
  }, [searchParams]);

  const [totalPackages, setTotalPackages] = useState(0);
  const [totalPackagesWeight, setTotalPackagesWeight] = useState(0);
  const [totalArea, setTotalArea] = useState(0);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");

  useEffect(() => {
    if (Data?.de_stuffing_bill_details) {
      let totalPackages = 0;
      let totalPackagesWeight = 0;
      let totalArea = 0;

      Data.de_stuffing_bill_details.forEach((Details) => {
        totalPackages += parseInt(Details.no_of_packages_declared ?? 0);
        totalPackagesWeight += parseFloat(Details.package_weight ?? 0);
        
        if (Array.isArray(Details?.grid_area)) {
          Details.grid_area.forEach((grid) => {
            totalArea += parseFloat(grid.area ?? 0);
          });
        }
      });

      setTotalPackages(totalPackages);
      setTotalPackagesWeight(totalPackagesWeight);
      setTotalArea(totalArea);
    }
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
        <div className="card tally-sheet shadow-none">
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
            <div className="col text-end"></div>
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
                    <strong>: {Data.seal_number}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Container Size</td>
                  <td>
                    <strong>: {Data.container_size}</strong>
                  </td>
                  <td>Sline Code</td>
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
                    <strong>: {Data.gw_port}</strong>
                  </td>
                  <td>Start Date & Time</td>
                  <td>
                    <strong>: {formatToDateTime(Data.start_time)}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Cha Code</td>
                  <td>
                    <strong>: --</strong>
                  </td>
                  <td>End Date & Time</td>
                  <td>
                    <strong>: {formatToDateTime(Data.end_time)}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Total No. of Packages Declared</td>
                  <td>
                    <strong>: {totalPackages}</strong>
                  </td>
                  <td>Excess / Short Packages</td>
                  <td>
                    <strong>: -- </strong>
                  </td>
                </tr>
                <tr>
                  <td>Handling Type</td>
                  <td>
                    <strong>: {Data.handling_type}</strong>
                  </td>
                  <td>Importer Name</td>
                  <td>
                    <strong>: --</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row main">
            <table className="table table-bordered table-font">
              <thead>
                <tr>
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
                {Data.de_stuffing_bill_details?.map((Details, k) => (
                  <tr key={k}>
                    <td>{Details.bol_number}</td>
                    <td>{Details.package_code}</td>
                    <td>
                      {Details.commodity_description} ({Details.commodity_code})
                    </td>
                    <td>{Details.no_of_packages_declared}</td>
                    <td>{Details.package_weight}</td>
                    <td>{Details.grid_locations}</td>
                    <td>
                      {Details.grid_area?.map((grid, index) => (
                        <span key={index}>{grid.area}, </span>
                      ))}
                    </td>
                  </tr>
                ))}
                {Array.from(
                  {
                    length: Math.max(
                      0,
                      10 - (Data.de_stuffing_bill_details?.length || 0)
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
                )}

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
        </div>
      </div>
    </>
  );
}

