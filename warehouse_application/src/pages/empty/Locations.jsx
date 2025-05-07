import axios from "axios";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Swal from "sweetalert2";
import EmptyImportMap from "./EmptyImportMap";
import EmptyExportMap from "./EmptyExportMap";
import EmptyMezzanineMap from "./EmptyMezzanineMap";
import { ApiBaseUrl } from "../../Config";

export default function Locations() {
  const [loading, setLoading] = useState(false);
  const [LocationNames, setLocationNames] = useState([]);
  const [MapName, setMapName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [SelectedGrid, setSelectedGrid] = useState(null);
  const [SelectedArea, setSelectedArea] = useState([]);

  const [Data, setData] = useState([]);
  const [location_code, setLocation_code] = useState(null);

  const openModal = (mapName) => {};

  const fetchLocationsName = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ApiBaseUrl}warehouse/location/name`);
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
      });
    } finally {
      setLoading(false);
    }
  };

  const GetData = async () => {
    setLoading(true);
    let url = `${ApiBaseUrl}warehouse/locations?`;

    if (MapName) url += `&warehouse_name=${MapName}`;
    if (location_code) url += `&new_location_code=${location_code}`;

    try {
      const response = await axios.get(url);
      if (response?.data?.data) {
        setData(response.data.data);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error Fetching Data: ${error.message}`,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGrid = async (id, location_code, area = 0) => {
    setLoading(true);
    try {
      const url = `${ApiBaseUrl}warehouse/locations/empty?id=${id}&location_code=${location_code}&area=${area}`;
      const response = await axios.get(url);

      Swal.fire({
        icon: response.data.status,
        text: response.data.message,
        timer: 3000,
      });

      if (response.data.status === "success") GetData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error: ${error.message}`,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationsName();
  }, []);

  useEffect(() => {
    if (LocationNames.length > 0) {
      setMapName(LocationNames[0]);
    }
  }, [LocationNames]);

  const mapComponents = {
    Import: (
      <EmptyImportMap
        setSelectedGrid={setSelectedGrid}
        setIsModalOpen={setIsModalOpen}
        setIsModalOpen2={setIsModalOpen2}
      />
    ),
    Export: (
      <EmptyExportMap
        setSelectedGrid={setSelectedGrid}
        setIsModalOpen={setIsModalOpen}
        setIsModalOpen2={setIsModalOpen2}
      />
    ),
    Mazzanine: (
      <EmptyMezzanineMap
        setSelectedGrid={setSelectedGrid}
        setIsModalOpen={setIsModalOpen}
        setIsModalOpen2={setIsModalOpen2}
      />
    ),
  };

  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (SelectedGrid?.total_area == "10") {
      setRow(2);
      setCol(5);
      setWidth("50px");
      setHeight("10vh");
    } else {
      setRow(4);
      setCol(5);
      setWidth("50px");
      setHeight("10vh");
    }
  }, [SelectedGrid]);

  return (
    <>
      <div className="d-none">
        {/* Grid Map Selector */}
        <div className="container">
          <div
            className="row justify-content-center align-items-center"
            style={{ height: "90vh" }}
          >
            {LocationNames.map((map, i) => (
              <div
                key={i}
                className="col-lg-3 col-md-4 col-sm-5 col-6 mb-3"
                onClick={() => {
                  setMapName(map);
                  setIsModalOpen(true);
                }}
              >
                <div className="card border border-primary border-2">
                  <div
                    className="card-body d-flex align-items-center justify-content-center"
                    style={{ height: "150px" }}
                  >
                    <h4 className="text-primary">{map}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-fullscreen" role="document">
              <div className="modal-content">
                <div className="modal-header bg-label-primary py-3">
                  <h5 className="modal-title">Map Select :: {MapName}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {mapComponents[MapName] || (
                    <h4 className="text-danger">Map Not Found</h4>
                  )}
                </div>
                <div className="modal-footer bg-label-primary py-3">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModalOpen2 && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header bg-label-primary py-3">
                  <h5 className="modal-title">Map Select :: {MapName}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsModalOpen2(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="container">
                    <h3 className="text-primary">
                      {MapName} :: {SelectedGrid.new_location_code}
                      <p className="d-none">{JSON.stringify(SelectedArea)}</p>
                    </h3>
                    <div className="d-flex align-items-center justify-content-center">
                      <div style={{ width: "260px" }}>
                        <div className="main bg-dark p-1 d-flex flex-column border-light border border-2 position-relative w-auto">
                          {[...Array(row)].map((_, rowIndex) => (
                            <div key={rowIndex} className="d-flex">
                              {[...Array(col)].map((_, colIndex) => {
                                const cellValue = rowIndex * 5 + colIndex + 1;
                                const isSelected = (
                                  Array.isArray(SelectedArea)
                                    ? SelectedArea
                                    : []
                                ).includes(cellValue);
                                let color = "bg-secondary";
                                if (
                                  SelectedGrid?.ocr_occupied_area &&
                                  SelectedGrid?.ocr_occupied_area >= cellValue
                                ) {
                                  color = "bg-info";
                                }
                                if (
                                  SelectedGrid?.occupied_area &&
                                  SelectedGrid?.occupied_area >= cellValue
                                ) {
                                  color = "bg-primary";
                                }
                                if (isSelected) {
                                  color = "bg-danger";
                                }
                                return (
                                  <button
                                    key={colIndex}
                                    className={`border border-light rounded text-white d-flex align-items-center justify-content-center bg-secondary
                                ${color}
                                `}
                                    style={{
                                      height: height,
                                      width: width,
                                      fontSize: "18px",
                                    }}
                                    onClick={() => {
                                      setSelectedArea((prev) =>
                                        prev.includes(cellValue)
                                          ? prev.filter(
                                              (val) => val !== cellValue
                                            )
                                          : [...prev, cellValue]
                                      );
                                    }}
                                  >
                                    {cellValue}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-label-primary py-3">
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => setIsModalOpen2(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
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
                          updateGrid(
                            SelectedGrid?.id,
                            SelectedGrid?.new_location_code,
                            SelectedArea.length
                          );
                          setIsModalOpen2(false);
                        }
                      });
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Filter & Table */}
      <div className="container">
        <h3 className="mt-3">Locations</h3>
        <div className="row mt-4">
          <div className="col-md-3">
            <label>Warehouse Name</label>
            <select
              className="form-select"
              value={MapName}
              onChange={(e) => setMapName(e.target.value)}
            >
              {LocationNames.map((map, i) => (
                <option key={i} value={map}>
                  {map}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label>Location Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Location Code"
              value={location_code}
              onChange={(e) => setLocation_code(e.target.value.toUpperCase())}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-info mt-5" onClick={GetData}>
              Submit
            </button>
            <Link to="/" className="btn btn-primary mt-5 ms-3">
              Go Back
            </Link>
          </div>
        </div>

        <div className="card my-3">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-font table-sm text-center">
                <thead>
                  <tr>
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
                  {Data.length > 0 ? (
                    Data.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.warehouse_name}</td>
                        <td>{item.camera_locations}</td>
                        <td>{item.new_location_code}</td>
                        <td>{item.total_area}</td>
                        <td>{item.occupied_area}</td>
                        <td>{item.ocr_occupied_area}</td>
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
                                if (result.isConfirmed)
                                  updateGrid(item.id, item.new_location_code);
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
                      <td colSpan="8">No Data Found</td>
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
