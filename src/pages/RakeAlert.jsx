import React, { useEffect, useState } from "react";
import Nav from "./main/nav";
import Footer from "./main/footer";
import axios from "axios";
import Swal from "sweetalert2";
import { formatToDateTime } from "./main/formatToDateTime";
import { Link } from "react-router-dom";
import { ApiBaseUrl } from "../Config";
// Link

export function RakeAlert() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    let url = `${ApiBaseUrl}/rake/application/alert`;
    try {
      const response = await axios.get(url);
      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        Swal.fire({
          icon: "Info",
          text: `Something Want Wrong..!`,
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
  const SaveTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    let url = `${ApiBaseUrl}/rake/application/alert/save`;
    try {
      const response = await axios.post(url, formData);
      if (response.data && response.data.status) {
        Swal.fire({
          icon: response.data.status,
          text: response.data.message,
          timer: 3000,
          showConfirmButton: false,
        });
        fetchData();
      } else {
        Swal.fire({
          icon: response.data.status,
          text: response.data.message,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error in Data Save: ${error.message}`,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 100000);
    return () => clearInterval(intervalId);
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
                {Data && Data?.length > 0 ? (
                  <form onSubmit={SaveTrack} className="row">
                    {Data?.map((data, i) => {
                      return (
                        <div className="col-12 mb-4">
                          <div className="card">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="form-floating form-floating-outline mb-4">
                                    <input
                                      type="text"
                                      name={`rake_ocr_id[${i}]`}
                                      className="form-control"
                                      readOnly
                                      value={data}
                                    />
                                    <label>Train No</label>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-floating form-floating-outline mb-4">
                                    <select
                                      name={`track_no[${i}]`}
                                      id=""
                                      className="form-select"
                                    >
                                      <option value="" selected disabled>
                                        Select Track
                                      </option>
                                      <option value="H1">H1</option>
                                      <option value="H2">H2</option>
                                      <option value="H3">H3</option>
                                      <option value="H4">H4</option>
                                    </select>
                                    <label htmlFor="">Select Track</label>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-floating form-floating-outline mb-4">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name={`first_wagon_distance[${i}]`}
                                      placeholder="Fist Wagon Distance"
                                    />
                                    <label htmlFor="">
                                      Fist Wagon Distance
                                    </label>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-floating form-floating-outline mb-4">
                                    <input
                                      type="number"
                                      className="form-control"
                                      name={`total_wagon[${i}]`}
                                      placeholder="Total Wagon"
                                    />
                                    <label htmlFor="">Total Wagon</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div className="col-12 text-end p-4">
                      <button type="submit" className="btn btn-lg btn-primary">
                        Save
                      </button>
                    </div>
                  </form>
                ):(
                  <p className="text-center display-4">NO DATA FOUND</p>
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


