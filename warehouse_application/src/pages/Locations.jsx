import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Locations() {
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [location_code, setLocation_code] = useState(null);
  const [LocationNames, setLocationNames] = useState([]);
  const [MapName, setMapName] = useState(null);

  const fetchLocationsName = async () => {
    setLoading(true);
    let url = `https://ctas.live/backend/api/warehouse/location/name`;
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

  const GetData = async (page = 1) => {
    setLoading(true);
    let url;
    url = `https://ctas.live/backend/api/warehouse/locations?`;
    if (MapName) {
      url += "&warehouse_name=" + MapName;
    }
    if (location_code) {
      url += "&new_location_code=" + location_code;
    }

    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        console.warn("No data found for the given input.");
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

  const updateGrid = async (id) => {
    setLoading(true);
    let url;
    url = `https://ctas.live/backend/api/warehouse/locations/empty?id=${id}`;

    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.status == "success") {
        Swal.fire({
          icon: response?.data?.status,
          text: response?.data?.message,
          timer: 3000,
        });
        GetData();
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
        text: `Error in Data Submit: ${error.message}`,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationsName();
  }, []);

  useEffect(() => {
    if (LocationNames) {
      setMapName(LocationNames[0]);
    }
  }, [LocationNames]);

  return (
    <>
      {/* <div className="container">
        <div className="row align-items-center justify-content-center" style={{ height: "90vh" }}>
        {LocationNames?.map((map, i) => (
          <div className="col-lg-3 col-md-4 col-sm-5 col-6 mb-3" key={i}>
            <div className="card border border-primary border-2">
              <div className="card-body">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "150px" }}
                >
                  <h4 className="text-primary text-nowrap">{map}</h4>
                </div>
              </div>
            </div>
          </div>
             ))}
        </div>
      </div> */}

      <div className="container">
        {/* {JSON.stringify(Data.data[0])} */}
        <h3 className="mt-3">Locations</h3>
        <div className="row mt-4">
          <div className="col-md-3">
            <label htmlFor="">Warehouse Name</label>
            <select
              className="form-select"
              value={MapName}
              onChange={(e) => setMapName(e.target.value)}
            >
              {LocationNames?.map((map, i) => (
                <option value={map}>{map}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="">Location Code</label>
            <input
              type="text"
              className="form-control"
              name="container_no"
              placeholder="Location Code"
              value={location_code}
              onChange={(e) => setLocation_code(e.target.value.toUpperCase())}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-info mt-5" onClick={() => GetData()}>
              Submit
            </button>
            <Link to={"/"} className="btn btn-primary mt-5 ms-3">
              Go Back
            </Link>
          </div>
        </div>

        <div className="card my-3">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-font table-sm">
                <thead className="">
                  <tr className="text-nowrap text-center">
                    <th>SN</th>
                    <th>wh_name</th>
                    <th>locations</th>
                    <th>location_code</th>
                    <th>total_area</th>
                    <th>occupied</th>
                    <th>spillover</th>
                    <th>action</th>
                  </tr>
                </thead>
                <tbody>
                  {Data?.length > 0 ? (
                    Data?.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td>{index + 1}</td>
                        <td>{item["warehouse_name"]}</td>
                        <td>{item["camera_locations"]}</td>
                        <td>{item["new_location_code"]}</td>
                        <td>{item["total_area"]}</td>
                        <td>{item["occupied_area"]}</td>
                        <td>{item["ocr_occupied_area"]}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-label-primary"
                            onClick={() => {
                              Swal.fire({
                                title: "Are you sure?",
                                text: "You want to update this grid!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, update it!",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  updateGrid(item.id);
                                }
                              });
                            }}
                          >
                            Empty
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
