import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Header from "./main/header";
import Footer from "./main/footer";
import Nav from "./main/nav";
import Swal from "sweetalert2";
import axios from "axios";
import { ApiBaseUrl } from "../Config";

export default function Rake_survey_tool() {
  const [type, setType] = useState("Survey");
  const [SearchContainerNo, setSearchContainerNo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [containerID, setContainerID] = useState(null);
  const [containerNo, setContainerNo] = useState(null);
  const [containerType, setContainerType] = useState(null);
  const [isDamage, setIsDamge] = useState("NO");

  const [Data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    if (SearchContainerNo) {
      setFilterData(
        Data.filter(
          (preValue) =>
            preValue.container_no &&
            preValue.container_no.includes(SearchContainerNo)
        )
      );
    } else {
      setFilterData(Data);
    }
  }, [SearchContainerNo, Data]);

  useEffect(() => {
    GetSurveyContainers();
  }, []);

  const GetSurveyContainers = async () => {
    setLoading(true);
    // const url = `https://ctas.live/backend/api/rake/survey/containers`;
    const url = `${ApiBaseUrl}/rake/survey/containers`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data) {
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


  
  const DataFormSubmit = async (payload) => {
    setLoading(true);
    // const url = `https://ctas.live/backend/api/rake/container/survey/post`;
    const url = `${ApiBaseUrl}/rake/container/survey/post`;
    try {
      const response = await axios.post(url, payload,{
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data && response.data) {
       console.log(response.data);
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


  const handleFormData = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    console.log(formValues);
    DataFormSubmit(formValues);
    //  /rake/container/survey/post
  };

  

  return (
    <>
      {loading ? (
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
      ) : (
        ""
      )}
      <div className="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
        <div className="layout-container">
          <Nav />
          <div className="layout-page">
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row align-items-center position-relative">
                  <div className={`text-center col-md-6 col-sm-6`}>
                    <img
                      src="/assets/images/file.png"
                      className="w-100 m-auto"
                      style={{ transform: " rotate(0deg)" }}
                      alt=""
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6   position-absolute top-0 end-0">
                    <form action="" onSubmit={handleFormData}>
                      {type == "Survey" ? (
                        <div className="card mb-5">
                          <div className="card-body border-bottom py-2 px-1">
                            <h4 className="m-0 text-center">
                              Ready For Survey
                            </h4>
                          </div>
                          <div className="card-body border-bottom">
                            <div className="d-flex gap-3 align-items-center">
                              {/* <h5 className="mb-1">Container No.</h5> */}
                              <div className="form-floating form-floating-outline w-75">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Container Number"
                                  onChange={(e) =>
                                    setSearchContainerNo(
                                      e.target.value.toUpperCase()
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="card-body border-bottom px-1">
                            {filterData && filterData.length > 0 ? (
                              <div className="d-flex align-items-center gap-3 flex-row overflow-scroll pb-3 no-scrollbar p-2">
                                {filterData.slice(0, 20).map((data, i) => (
                                  <div className="col-sm-4" key={i}>
                                    <div className="card shadow-lg">
                                      <img
                                        src={
                                          data.container_image
                                            ? data.container_image
                                            : "/no_image_icon.jpg"
                                        }
                                        className="card-img-top"
                                        alt="..."
                                      />
                                      <div className="card-body">
                                        <p className="fw-bold">
                                          {data.container_no}
                                        </p>
                                        <button
                                          className="btn btn-sm btn-label-primary"
                                          onClick={() => {
                                            setType("containerType");
                                            setContainerNo(data.container_no);
                                            setContainerID(data.id);
                                          }}
                                        >
                                          Start Survey
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-center">No Data Available</p>
                            )}
                          </div>
                        </div>
                      ) : type == "containerType" ? (
                        <div className="card mb-5">
                          <div className="card-body border-bottom py-2">
                            <h4 className="m-0">
                              Container Details :
                              <span className="text-secondary ms-2">
                                {containerNo}
                              </span>
                            </h4>
                          </div>
                          <div className="card-body border-bottom py-2">
                            <div className="row align-items-center">
                              <h6 className="mb-1">Container Type</h6>
                              <input
                                type="hidden"
                                name="id"
                                id="id"
                                defaultValue={containerID}
                              />
                              <input
                                type="hidden"
                                name="container_no"
                                id="container_no"
                                defaultValue={containerNo}
                              />
                              <div className="col-6">
                                <div
                                  className={`form-check custom-option custom-option-label custom-option-basic ${
                                    containerType == "Empty" ? "checked" : ""
                                  } `}
                                >
                                  <label
                                    className="form-check-label custom-option-content text-center p-3"
                                    htmlFor="Empty"
                                  >
                                    <input
                                      name="container_type"
                                      className="form-check-input"
                                      type="radio"
                                      id="Empty"
                                      defaultValue={"Empty"}
                                      hidden
                                      onChange={() =>
                                        setContainerType(
                                          containerType == "Empty"
                                            ? ""
                                            : "Empty"
                                        )
                                      }
                                    />
                                    <b
                                      className={`fs-6 ${
                                        containerType == "Empty"
                                          ? "text-primary"
                                          : ""
                                      }`}
                                    >
                                      Empty
                                    </b>
                                  </label>
                                </div>
                              </div>
                              <div className="col-6">
                                <div
                                  className={`form-check custom-option custom-option-label custom-option-basic ${
                                    containerType == "Loaded" ? "checked" : ""
                                  } `}
                                >
                                  <label
                                    className="form-check-label custom-option-content text-center p-3"
                                    htmlFor="Loaded"
                                  >
                                    <input
                                      name="container_type"
                                      className="form-check-input"
                                      type="radio"
                                      id="Loaded"
                                      hidden
                                      defaultValue={"Loaded"}
                                      onChange={() =>
                                        setContainerType(
                                          containerType == "Loaded"
                                            ? ""
                                            : "Loaded"
                                        )
                                      }
                                    />
                                    <b
                                      className={`fs-6 ${
                                        containerType == "Loaded"
                                          ? "text-primary"
                                          : ""
                                      }`}
                                    >
                                      Loaded
                                    </b>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          {containerType == "Loaded" ? (
                            <div className="card-body border-bottom py-2">
                              <h4 className="m-0">Seals</h4>
                              <div className="row align-items-center">
                                <h6 className="mb-1"> Liner Seal Number</h6>
                                <div className="col-12 mb-3 d-flex gap-3 justify-content-between align-items-center">
                                  <input
                                    type="text"
                                    className="form-control p-2 w-75"
                                    placeholder="eg. GVTU 3599 322FT"
                                    name="seal_1_no"
                                  />
                                  <div className="">
                                    <label
                                      htmlFor="upload"
                                      className="btn border waves-effect waves-light p-2"
                                      tabIndex={0}
                                    >
                                      <i className="ri-camera-line ri-24px"></i>{" "}
                                      Seal&nbsp;Image
                                      <input
                                        type="file"
                                        id="upload"
                                        className="account-file-input"
                                        hidden
                                        name="seal_1_image"
                                        accept="image/png, image/jpeg"
                                      />
                                    </label>
                                  </div>
                                </div>
                                <h6 className="mb-1"> Custom Seal Number</h6>
                                <div className="col-12 mb-3 d-flex gap-3 justify-content-between align-items-center">
                                  <input
                                    type="text"
                                    className="form-control p-2 w-75"
                                    placeholder="eg. GVTU 3599 322FT"
                                    name="seal_2_no"
                                  />
                                  <div className="w-25">
                                    <label
                                      htmlFor="upload"
                                      className="btn border waves-effect waves-light p-2"
                                      tabIndex={0}
                                    >
                                      <i className="ri-camera-line ri-24px"></i>{" "}
                                      Seal&nbsp;Image
                                      <input
                                        type="file"
                                        id="upload"
                                        className="account-file-input"
                                        hidden
                                        name="seal_2_image"
                                        accept="image/png, image/jpeg"
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : containerType == "Empty" ? (
                            <div className="card-body border-bottom">
                              <div className="">
                                <label
                                  htmlFor="upload"
                                  className="btn border waves-effect waves-light p-2"
                                  tabIndex={0}
                                >
                                  <i className="ri-camera-line ri-24px me-1"></i>{" "}
                                  Container image
                                  <input
                                    type="file"
                                    id="upload"
                                    className="account-file-input"
                                    hidden
                                    name="container_image"
                                    accept="image/png, image/jpeg"
                                  />
                                </label>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="card-body border-bottom py-2">
                            <h5 className="mb-1">Select ITV</h5>
                            <div className="">
                              <select
                                name="itv_name"
                                id="itv_name"
                                className="form-control p-2 mb-2"
                              >
                                <option>
                                  Select ITV{" "}
                                </option>
                                {Array.from({ length: 30 }, (_, index) => {
                                  const value = `itv${String(
                                    index + 1
                                  ).padStart(2, "0")}`;
                                  return (
                                    <option key={value} value={value}>
                                      {value}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>

                            <hr />
                            <h5 className="m-1">Is Damage</h5>
                            <div className="">
                              <select
                                name="is_damage"
                                onChange={(e) => setIsDamge(e.target.value)}
                                id="itv_name"
                                className="form-control p-2 mb-2"
                              >
                                <option value="NO">No </option>
                                <option value="YES">Yes </option>
                              </select>
                            </div>
                            <div className="">
                              {isDamage == "YES" && (
                                <>
                                  <label htmlFor="">Damage Note</label>
                                  <input
                                    type="text"
                                    name="damage_note"
                                    placeholder="enter damage note"
                                    className="form-control p-2 mb-2"
                                  />
                                </>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-6 border-end pe-0 ">
                              <div className="card-body p-0 py-1 text-center bg-label-secondary ">
                                <button
                                  type="button"
                                  className="btn m-0  w-100"
                                  onClick={() => setType("Survey")}
                                >
                                  Back
                                </button>
                              </div>
                            </div>
                            <div className="col-6 ps-0 ">
                              <div className="card-body p-0 py-1 text-center bg-label-primary ">
                                <button
                                  type="submit"
                                  className="btn m-0  w-100"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </form>
                  </div>
                </div>

                <button
                  className={`btn btn-label-danger ${
                    type == "eal"
                      ? "mt-3"
                      : "position-absolute bottom-0 start-0 mb-5 ms-5"
                  }`}
                  onClick={() => setType("Survey")}
                >
                  <span className="fs-6 me-1">&times; </span> Cancel Survey
                </button>
              </div>

              <Footer />
              <div className="content-backdrop fade"></div>
            </div>
          </div>
        </div>
        <div className="layout-overlay layout-menu-toggle"></div>
        <div className="drag-target"></div>
      </div>
    </>
  );
}
