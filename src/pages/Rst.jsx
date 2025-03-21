import React, { useEffect, useState } from "react";
import Nav from "./main/nav";
import Footer from "./main/footer";
import axios from "axios";
import Swal from "sweetalert2";
import { formatToDateTime } from "./main/formatToDateTime";

function Rst() {
  const [type, setType] = useState("Grid");
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetData = async () => {
    setLoading(true);
    const url = `https://ctas.live/backend/api/get/rst/jobs?status=1`;
    try {
      const response = await axios.get(url);
      if (response.data && response.data.status == "success") {
        setData(response.data.data);
      } else {
        setData([]);
        Swal.fire({
          icon: "Info",
          text: `Something Want Wrong..! `,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error in Data Fetch: ${error.message}`,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      GetData();
    }, 10000);
  
    return () => clearInterval(interval); 
  }, []);
  
  useEffect(() => {
      GetData();
  }, []);
  

  return (
    <>
     {/* {loading && (
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
      )} */}
      <div class="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
        <div class="layout-container">
          <Nav />
          <div className="layout-page">
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="">
                  <ul className="nav nav-pills container ">
                    <li className="nav-item pe-3">
                      <button
                        className={`${
                          type === "Grid"
                            ? "btn btn-primary"
                            : "btn btn-label-primary"
                        }`}
                        onClick={() => setType("Grid")}
                      >
                        Grid
                      </button>
                    </li>
                    <li className="nav-item  pe-3">
                      <button
                        className={`${
                          type === "Table"
                            ? "btn btn-primary"
                            : "btn btn-label-primary"
                        }`}
                        onClick={() => setType("Table")}
                      >
                        Table
                      </button>
                    </li>
                    <li className="nav-item  pe-3">
                      <button
                        className={`${
                          type === "Map"
                            ? "btn btn-primary "
                            : "btn btn-label-primary"
                        }`}
                        onClick={() => setType("Map")}
                      >
                        Map
                      </button>
                    </li>
                  </ul>
                </div>
                {/* Tab panes */}
                <div className="mt-5">
                  <div className="">
                    {type === "Grid" ? (
                      <>
                        <div className="container">
                          <div className="row">
                            {Data?.data?.map((data, i) => (
                              <div className="col-md-4 mt-3 col-sm-6" key={i}>
                                <div
                                  className="custom-card"
                                  style={{ border: "#007bff solid 1px" }}
                                >
                                  <div className="custom-card-header bg-light blue">
                                    <img
                                      src="assets/images/cnt.png"
                                      alt=""
                                      className="img-fluid w-50"
                                    />
                                  </div>
                                  <div className="custom-card-body">
                                    <h2 className="custom-card-title">
                                      C.NO. :
                                      <span>
                                        <strong>{data.container_no}</strong>
                                      </span>
                                    </h2>
                                    <p className="custom-card-text">
                                      SIZE :
                                      <span>
                                        <strong>
                                            {data?.container_master?.container_size}
                                        </strong>
                                      </span>
                                    </p>
                                    <p className="custom-card-text">
                                      SOURCE :
                                      <span>
                                        <strong>{data.pickup_from}</strong>
                                      </span>
                                    </p>
                                    <p className="custom-card-text">
                                      DEST :
                                      <span>
                                        <strong>{data.drop_to}</strong>
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : type === "Table" ? (
                      <>
                        <div className="container">
                         <div className="card">
                            <div className="card-body">
                            <div className="table-responsive">
                            <table className="table table-striped table-bordered  table-hover table-sm">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Container No.</th>
                                  <th> Container Size</th>
                                  <th>ISO Code</th>
                                  <th>Source</th>
                                  <th>Destination</th>
                                  <th>DateTime</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Data?.data?.map((data,i) => (
                                  <tr key={i}>
                                    <td>
                                     {i+1}
                                    </td>
                                    <td>{data.container_no}</td>
                                    <td> {data?.container_master?.container_size}</td>
                                    <td> {data?.container_master?.iso_code}</td>
                                    <td>{data.pickup_from}</td>
                                    <td>{data.drop_to}</td>
                                    <td>{formatToDateTime(data.created_at)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                            </div>
                         </div>
                        </div>
                      </>
                    ) : (
                      type === "Map" && (
                        <>
                          <div className="container">
                            <h3 className="text-primary">Coming Soon</h3>
                          </div>
                        </>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Footer />
            <div className="content-backdrop fade"></div>
          </div>
        </div>
      </div>
      <div className="layout-overlay layout-menu-toggle"></div>
      <div className="drag-target"></div>
    </>
  );
}

export default Rst;
