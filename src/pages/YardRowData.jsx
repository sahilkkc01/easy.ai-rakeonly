import React, { useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./main/header";
import Footer from "./main/footer";
import Nav from "./main/nav";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../Pages.css";
import { compressImage } from "./main/formatToDateTime";
import EIRMain from "./EIRMain";
import { useReactToPrint } from "react-to-print";
export default function YardRowData() {

  const [Data, setData] = useState([]);
  
  const [ContainerNo, setContainerNo] = useState(null);
  const [From, setFrom] = useState(null);
  const [To, setTo] = useState(null);
  
const [loading, setLoading] = useState(false);

const GetData = async (page=1) => {
  // alert('1');
    setLoading(true);
    let url;
    url = `https://ctas.live/backend/api/yard/row/data?page=`+page;

    if(ContainerNo){
      url += '&container_no='+ContainerNo;
    }
    if(From){
      url += '&from='+From;
    }
    if(To){
      url += '&to='+To;
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

  useEffect(() => {
    GetData();
  }, []);

  return (
    <>
        <div className="container">
            {/* {JSON.stringify(Data.data[0])} */}
          <h3 className="mt-3">Row Data</h3>
            <div className="row mt-4">
              <div className="col-md-3">
                <label htmlFor="">Contianer No</label>
                <input type="text" className="form-control" name="container_no"  placeholder="Container No"  onChange={(e) => setContainerNo(e.target.value)} />
              </div>
              <div className="col-md-3">
              <label htmlFor="">From</label>
                <input type="date" className="form-control" name="start" onChange={(e) => setFrom(e.target.value)}  />
              </div>
              <div className="col-md-3">
              <label htmlFor="">To</label>
                <input type="date" className="form-control"  name="end" onChange={(e) => setTo(e.target.value)} />
              </div>
              <div className="col-md-3">
                <button className="btn btn-info mt-5" onClick={()=>GetData()}>Submit</button>
              </div>
            </div>

            <div className="card my-3">
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-striped table-font table-sm">
                          <thead className="">
                            <tr className="text-nowrap">
                              <th>SN</th>
                              <th>equipmentid</th>
                              <th>latitude</th>
                              <th>longitude</th>
                              <th>altitude</th>
                              <th>analog</th>
                              <th>containerno</th>
                              <th>datetime</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Data.data?.length > 0 ? (
                              Data.data?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item["equipmentid"]}</td>
                                  <td>{item["latitude"]}</td>
                                  <td>{item["longitude"]}</td>
                                  <td>{item["altitude"]}</td>
                                  <td>{item["analog"]}</td>
                                  <td>{item["containerno"]}</td>
                                  <td>{item["datetime"]}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="11" className="text-center">No Data Found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        {Data && Data.data && (
                              <div className="container mt-4">
                                <div className="row">
                                  <div className="col-sm-12 col-md-6">
                                    <div
                                      className="dataTables_info"
                                      id="DataTables_Table_0_info"
                                      role="status"
                                      aria-live="polite"
                                    >
                                      Showing {Data.from} to {Data.to} of{" "}
                                      {Data.total} entries
                                    </div>
                                  </div>
                                  <div className="col-10 m-auto mt-2">
                                    <div
                                      className="dataTables_paginate paging_simple_numbers"
                                      id="DataTables_Table_0_paginate"
                                    >
                                      <ul className="pagination ">
                                        {Data &&
                                          Data.links &&
                                          Data?.links?.map((link, q) => {
                                            let showData =
                                              Data.links.length == q + 1
                                                ? "Next"
                                                : q == 0
                                                  ? "Previous"
                                                  : link.label;
                                            return (
                                              <li
                                                key={q}
                                                className={`paginate_button page-item ${link.active === true
                                                  ? "active"
                                                  : ""
                                                  }  ${showData == "Next" &&
                                                    Data.current_page ==
                                                    Data.last_page
                                                    ? "disabled"
                                                    : showData == "Previous" &&
                                                      Data.current_page == 1
                                                      ? "disabled"
                                                      : ""
                                                  } `}
                                              >
                                                <button
                                                  onClick={() => {
                                                    showData == "Previous"
                                                      ? GetData(
                                                        Data.current_page - 1
                                                      )
                                                      : showData == "Next"
                                                        ? GetData(
                                                          Data.current_page + 1
                                                        )
                                                        : GetData(link.label);
                                                  }}
                                                  aria-controls="DataTables_Table_0"
                                                  role="link"
                                                  aria-current="page"
                                                  data-dt-idx={0}
                                                  tabIndex={0}
                                                  className="page-link"
                                                >
                                                  {showData}
                                                </button>
                                              </li>
                                            );
                                          })}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                      </div>
                    </div>
                  </div>

        </div>
    </>
  );
}
