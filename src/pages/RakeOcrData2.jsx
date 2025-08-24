import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../Pages.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function RakeOcrData2() {
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [VehicleNo, setVehicleNo] = useState(null);
  const [ContainerNo, setContainerNo] = useState(null);
  const [Start, setStart] = useState(null);
  const [End, setEnd] = useState(null);
  const [modalData, setModalData] = useState(null);

  // ✅ Only these fields will be shown
  const columns = [
    "id",
    "type",
    "side",
    "wagon_no",
    // "wagon_no_img",
    "container_no_1",
    "iso_code_1",
    // "container_no_img_1",
    "container_no_2",
    "iso_code_2",
    // "container_no_img_2",
    "rake_ocr_id",
    "created_at",
    "entry_type",
  ];

  const GetData = async () => {
    setLoading(true);
    let url = `https://ctas.live/backend/api/get/ocr2/data?`;

    if (ContainerNo) url += "&wagon_no=" + ContainerNo;
    if (Start) url += "&start=" + Start;
    if (End) url += "&end=" + End;
    if (VehicleNo) url += "&side=" + VehicleNo;

    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        setData([]);
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

  useEffect(() => {
    GetData();
  }, []);

  const exportToExcel = () => {
    if (!Data || Data.length === 0) {
      Swal.fire({
        icon: "info",
        text: "No data available to export!",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    // ✅ Pick only required fields for Excel
    const formattedData = Data.map((item, i) => {
      const row = { "Sr No": i + 1 };
      columns.forEach((col) => {
        row[col] =
          col === "created_at" && item[col]
            ? new Date(item[col]).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour12: false,
              })
            : item[col] ?? "-";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OCR Data");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "OCR_Data.xlsx"
    );
  };

  return (
    <>
      {/* Filters */}
      <div className="card m-3">
        <div className="card-body">
          <h3 className="text-primary">Get OCR Data</h3>
          <div className="row">
            <div className="col-md-3">
              <label>Side</label>
              <input
                type="text"
                className="form-control"
                placeholder="Side"
                onChange={(e) => setVehicleNo(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label>Wagon No</label>
              <input
                type="text"
                className="form-control"
                placeholder="Wagon No"
                onChange={(e) => setContainerNo(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label>Start</label>
              <input
                type="datetime-local"
                className="form-control"
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label>End</label>
              <input
                type="datetime-local"
                className="form-control"
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <button className="btn btn-info mt-5" onClick={GetData}>
                Submit
              </button>
              <button
                className="btn btn-primary mt-5 ms-3"
                onClick={exportToExcel}
              >
                Download Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card m-3">
        <div className="card-body">
          {loading ? (
            <p className="text-center text-info">Loading...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-font table-sm">
                <thead>
                  <tr>
                    <th>Sr No</th>
                    {columns.map((col) => (
                      <th key={col} className="text-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Data.length > 0 ? (
                    Data.map((item, index) => (
                      <tr
                        key={index}
                        className="text-nowrap"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => setModalData(item)}
                      >
                        <td>{index + 1}</td>
                        {columns.map((col, i) => (
                          <td key={i}>
                            {col === "created_at" && item[col]
                              ? new Date(item[col]).toLocaleString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                  hour12: false,
                                })
                              : item[col] ?? "-"}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header bg-label-primary py-3">
              <h1 className="modal-title fs-5">Image View</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="row">
                {[
                  "wagon_no_img",
                  "container_no_img_1",
                  "container_no_img_2",
                  "container_img_front",
                  "container_img_left",
                  "container_img_right",
                  "container_img_top",
                  "container_img_back",
                ].map((field, i) => (
                  <div className="col" key={i}>
                    {modalData?.[field] ? (
                      <a
                        href={`https://ctas.live/ocr_backend/gate_ocr_img/${modalData[field]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`https://ctas.live/ocr_backend/gate_ocr_img/${modalData[field]}`}
                          className="w-100"
                          alt={field}
                        />
                      </a>
                    ) : (
                      <p className="text-muted">No {field} available</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer bg-label-primary py-3">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
