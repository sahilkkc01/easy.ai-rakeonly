import React, { useEffect, useState } from "react";
import Nav from "./main/nav";
import Footer from "./main/footer";
import axios from "axios";
import Swal from "sweetalert2";
import { formatToDateTime } from "./main/formatToDateTime";
import { Link } from "react-router-dom";
// Link

function Rst() {
  const [type, setType] = useState("Grid");
  const [Data, setData] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);

  const equipment_id = localStorage.getItem("equipment_id");

  const GetData = async () => {
    // setLoading(true);
    // const url = `http://192.168.1.4:8000/api/get/rst/application/jobs?equipment_id=${equipment_id}`;
    const url = `https://ctas.live/backend/api/get/rst/application/jobs/v2?equipment_id=${equipment_id}`;
    try {
      const response = await axios.get(url);
      if (response.data && response.data.status == "success") {
        setData(response.data);
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
    let interval;

    if (equipment_id) {
      interval = setInterval(() => {
        GetData();
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [equipment_id]);

  useEffect(() => {
    if (equipment_id) {
      setLoading(true);
      GetData();
    }
  }, [equipment_id]);

  const GetEquipment = async () => {
    setLoading(true);
    let url = `https://ctas.live/backend/api/get/equipments`;

    try {
      const response = await axios.get(url);
      if (response.data && response.data.status === "success") {
        setEquipments(response.data.data);
      } else {
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
    if (!equipment_id) {
      GetEquipment();
    }
  }, []);

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
      <div class="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
        <div class="layout-container">
          <Nav />
          <div className="layout-page">
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                {equipment_id ? (
                  <>
                    <ul className="nav nav-pills ">
                      <li className="nav-item pe-3">
                        <button
                          className={`${type === "Grid"
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
                          className={`${type === "Table"
                              ? "btn btn-primary"
                              : "btn btn-label-primary"
                            }`}
                          onClick={() => setType("Table")}
                        >
                          Table
                        </button>
                      </li>
                      <li className="nav-item  pe-3">
                        {/* <button
                          className={`${
                            type === "Map"
                              ? "btn btn-primary "
                              : "btn btn-label-primary"
                          }`}
                          onClick={() => setType("Map")}
                        > */}
                        {/* Map
                        </button> */}
                        <Link to='/RSTMap' class="btn btn-label-primary"> Map </Link>
                      </li>
                    </ul>

                    <div className="mt-5">
                      <div className="">
                        {type === "Grid" ? (
                          <>
                            <div className="row justify-content-evenly">
                              <div className="col-lg-3 col-4 mt-3">
                                <h4 className="text-primary text-center">
                                  Gate Jobs
                                </h4>
                                {Data?.yard_jobs_within_radius?.gate?.map(
                                  (data, i) => (
                                    <div key={i} className="custom-card mb-4">
                                      <div className="custom-card-body" style={i ==  0 ? { backgroundColor: '#bfedbf' } : i ==  1 ? {backgroundColor: '#ecf6ec'} : {}}>
                                        <table className="table table-sm mb-0">
                                          <tbody>
                                            <tr>
                                              <td>Job Type</td>
                                              <td>
                                                <strong>{data.job_type.toUpperCase()}</strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>C.NO.</td>
                                              <td>
                                                <strong>
                                                  {data.container_no}
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>SIZE</td>
                                              <td>
                                                <strong>
                                                  {
                                                    data?.container_master
                                                      ?.container_size
                                                  }
                                                </strong>
                                              </td>
                                            </tr>

                                            <tr>
                                              <td>SOURCE</td>
                                              <td>
                                                <strong>
                                                  {data.pickup_from}
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>DEST</td>
                                              <td>
                                                <strong>{data.drop_to} {data.drop_height ?? ''}</strong>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="col-lg-3 col-4 mt-3">
                                <h4 className="text-primary text-center">
                                  Rake Jobs
                                </h4>
                                {Data?.yard_jobs_within_radius?.rake?.map(
                                  (data, i) => (
                                    <div key={i} className="custom-card mb-4"   >
                                      <div className="custom-card-body" style={i ==  0 ? { backgroundColor: '#bfedbf' } : i ==  1 ? {backgroundColor: '#ecf6ec'} : {}}>
                                        <table className="table table-sm mb-0">
                                          <tbody>
                                            <tr>
                                              <td>Job Type</td>
                                              <td>
                                                <strong>{data.job_type.toUpperCase()}</strong>
                                                {/* <strong>Rake</strong> */}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>C.NO.</td>
                                              <td>
                                                <strong>
                                                  {data.container_no}
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>SIZE</td>
                                              <td>
                                                <strong>
                                                  {
                                                    data?.container_master
                                                      ?.container_size
                                                  }
                                                </strong>
                                              </td>
                                            </tr>

                                            <tr>
                                              <td>SOURCE</td>
                                              <td>
                                                <strong>
                                                  {data.pickup_from}
                                                </strong>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>DEST</td>
                                              <td>
                                                <strong>{data.drop_to} {data.drop_height ?? ''}</strong>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>

                              <div className="col-lg-3 col-4 mt-3">
                                <h4 className="text-primary text-center">
                                  Warehouse Jobs
                                </h4>
                                {Data?.warehouse_jobs?.map((data, i) => (
                                  <div key={i} className="custom-card mb-4"  >
                                    <div className="custom-card-body">
                                      <table className="table table-sm mb-0">
                                        <tbody>
                                          <tr>
                                            <td>Job Type</td>
                                            <td>
                                              <strong>{data.job_type.toUpperCase()}</strong>
                                              {/* <strong>Warehouse</strong> */}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>C.NO.</td>
                                            <td>
                                              <strong>
                                                {data.container_no}
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>SIZE</td>
                                            <td>
                                              <strong>
                                                {data?.container_size ??
                                                  data?.container_master
                                                    ?.container_size}
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>SOURCE</td>
                                            <td>
                                              <strong>
                                                {
                                                  data?.container_master
                                                    ?.last_stk_loc
                                                }
                                              </strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>DEST</td>
                                            <td>
                                              <strong> {data?.warehouse?.toUpperCase()}</strong>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : type === "Table" ? (
                          <>
                            <div className="">
                              <div className="card">
                                <div className="card-body">
                                  <div className="table-responsive">
                                    <table className="table table-striped table-bordered table-hover table-sm">
                                      <thead>
                                        <tr>
                                          <th>#</th>
                                          <th>Container No.</th>
                                          <th>Size</th>
                                          <th>Job Type.</th>
                                          {/* <th>ISO</th> */}
                                          <th>Source</th>
                                          <th>Destination</th>
                                          <th>DateTime</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {Data?.data?.map((data, i) => (
                                          <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{data.container_no}</td>
                                            <td>
                                              {
                                                data?.container_master
                                                  ?.container_size
                                              }
                                            </td>
                                            <td>
                                              {data?.job_type}
                                            </td>
                                            {/* <td>
                                              {data?.container_master?.iso_code}
                                            </td> */}
                                            <td>{data.pickup_from}</td>
                                            <td>{data.drop_to}</td>
                                            <td>
                                              <span className="text-nowrap">
                                                {" "}
                                                {formatToDateTime(
                                                  data.created_at
                                                )}
                                              </span>
                                            </td>
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
                  </>
                ) : (
                  <div className="row justify-content-center align-items-center mb-6">
                    <div className="col-8">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="text-primary">Select Equipment</h5>

                          <div class="form-floating form-floating-outline">
                            <select
                              name="equipment_id"
                              id="equipment_id"
                              className="form-select"
                              onChange={(e) => {
                                localStorage.setItem(
                                  "equipment_id",
                                  e.target.value
                                );

                                window.location.reload();
                              }}
                            >
                              <option value="">Select Equipment</option>
                              {equipments?.map((equipment, i) => (
                                <option
                                  value={equipment.equipment_name}
                                  key={i}
                                >
                                  {equipment.equipment_name}
                                </option>
                              ))}
                            </select>
                            <label for="equipment_id">Equipment Name</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

export default Rst;
