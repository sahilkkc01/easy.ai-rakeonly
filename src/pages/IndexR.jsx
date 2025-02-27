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

export default function IndexR() {
  const NewUser = localStorage.getItem("user");
  const user = JSON.parse(NewUser);

  const [loading, setLoading] = useState(false);
  const [advanceSummeryTrain, setAdvanceSummeryTrain] = useState([]);
  const [ContainerType, setContainerType] = useState("Empty");
  const [DamageStatus, setDamageStatus] = useState("N");
  const [ModelData, setModelData] = useState(null);
  const [wagon, setWagon] = useState(null);
  const [train, setTrain] = useState(null);
  const [container, setContainer] = useState(null);


  const [Seal_1_no, setSeal_1_no] = useState("");
  const [Seal_2_no, setSeal_2_no] = useState("");

  
  const fetchData = async () => {
    setLoading(true);
    let url;
    url = `https://ctas.live/backend/api/rake/survey/train/data/inword`;
    if (train) {
      url += `/${train}`;
    }
    if (wagon) {
      url += `?wagon_no=${wagon}`;
    } else {
      url += `?`;
    }
    if (container) {
      url += `&container_no=${container}`;
    }

    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.data) {
        setAdvanceSummeryTrain(response.data.data);
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
    fetchData();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    let wagon_no = e.target.wagon.value;
    let container_no = e.target.container.value;
    // let train_no = e.target.train.value;
    setWagon(wagon_no);
    setContainer(container_no);
    // setTrain(train_no);
    fetchData();
  };

  const submitData = async (payload) => {
    const url = `https://ctas.live/backend/api/rake/survey/train/data/inword/post`;

    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.data);
      if (response.data && response.data.status && response.data.status == 'success') {
        Swal.fire({
          icon: "success",
          text: response.data.message ?? response.data.status,
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          fetchData();
        });
      } else {
        Swal.fire({
          icon: "warning",
          text: response.data.message ?? "Something want wrong..!",
          timer: 1500,
          showConfirmButton: false,
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let formValues = Object.fromEntries(formData.entries());

    const FIles = ["container_image", "seal_1_image", "seal_2_image"];

    const targetSize = 20 * 1024; // 50KB

    for (let index = 0; index < FIles.length; index++) {
      const element = FIles[index];
      if (element) {
        const file = formData.get(element);
        if (file && file.name) {
          const compressedFile = await compressImage(file, targetSize);
          if (compressedFile) {
            formData.set(element, compressedFile);
            formValues = Object.fromEntries(formData.entries());
            // alert('success');
          } else {
            alert("Could not compress this file.");
            return;
          }
        }
      }
    }

    console.log(formValues);

    submitData(formValues);
  };

  const [Photos, setPhotos] = useState({
    seal1: null,
    seal2: null,
    container: null,
  });

  const handleImageChange = (event, name) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prevPhotos) => ({
          ...prevPhotos,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleImageToText = async (e, seal) => {
    e.preventDefault();
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;


    const formData = new FormData();
    const targetSize = 20 * 1024; // 50KB

        if (file && file.name) {
          const compressedFile = await compressImage(file, targetSize);
          if (compressedFile) {
            formData.set("image", compressedFile);
            // formData.set(element, compressedFile);
            // formEntries = Object.fromEntries(formData.entries());
          } else {
            alert("Could not compress this file.");
            return;
          }
        }
        

    const url = `https://ctas.live/backend/api/text/extract/vision`;

    try {
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      if (response.data.status && response.data.status == "success") {
        if (seal == 1) {
          setSeal_1_no(response.data.data[0]);
        }
        if (seal == 2) {
          setSeal_2_no(response.data.data[0]);
        }
      } else {
        Swal.fire({
          icon: "info",
          text: `Please Try ...`,
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
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header />
          <div className="layout-page">
            <div className="content-wrapper">
              <Nav />
              <div className="container-xxl flex-grow-1 container-p-y">
                {/* <LinksButtons /> */}

                <div className="row">
                  <div className="col-md-12 d-none">
                    <div className="card">
                      <div className="card-body">
                        <div className="col-md-12">
                          <h5 className="text-primary">Train Details</h5>
                        </div>
                        <form
                          className="row align-items-center"
                          onSubmit={handleFilter}
                        >
                          {/* <div className="col-sm-6 col-md-3 mb-2">
                            <label htmlFor="">Train Number</label>
                            <input
                              type="text"
                              className="form-control"
                              name="train"
                            />
                          </div> */}
                          <div className="col-sm-6 col-md-3 mb-2">
                            <label htmlFor="">Wagon Number</label>
                            <input
                              type="text"
                              className="form-control"
                              name="wagon"
                            />
                          </div>
                          <div className="col-sm-6 col-md-3 mb-2">
                            <label htmlFor="">Container Number</label>
                            <input
                              type="text"
                              className="form-control"
                              name="container"
                            />
                          </div>
                          <div className="col-sm-2">
                            <button
                              type="submit"
                              className="btn btn-label-primary mt-2"
                            >
                              <i className="ri ri-arrow-right-line"></i>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="card my-3">
                      <div className="card-body px-2">
                        {advanceSummeryTrain &&
                          advanceSummeryTrain.map((trainData, i) => (
                            <div key={i}>
                              <div className="table-responsive text-nowrap mb-4">
                                <h5 className="text-primary">
                                  Train No: <b>{trainData.train_no}</b>
                                </h5>
                                <table className="table table-hover table-font table-bordered table-striped ">
                                  <thead>
                                    <tr className="table-primary">
                                      <td>#</td>
                                      <td>Container Number</td>
                                      <td>Linear Seal</td>
                                      <td>Custom Seal</td>
                                      <td>Action</td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {trainData &&
                                      trainData.rake_transections &&
                                      trainData.rake_transections.map(
                                        (summery, index) => {
                                          if (summery.status == "0") {
                                            return (
                                              <tr key={index}>
                                                <td>
                                                  <span>{index + 1}</span>
                                                </td>
                                                <td>
                                                  <span>
                                                    C : {summery.container_no}
                                                  </span>
                                                  <br />
                                                  <span>
                                                    W : {summery.wagon_no}
                                                  </span>
                                                </td>
                                                <td>
                                                  {summery.seal_1_no
                                                    ? summery.seal_1_no
                                                    : "--"}
                                                </td>
                                                <td>
                                                  {summery.seal_2_no
                                                    ? summery.seal_2_no
                                                    : "--"}
                                                </td>
                                                <td>
                                                  <button
                                                    onClick={() =>
                                                      setModelData(summery)
                                                    }
                                                    className="btn btn-sm btn-label-primary"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#verifyModel"
                                                  >
                                                    <i className="ri-verified-badge-fill me-1"></i>
                                                    Verify
                                                  </button>
                                                </td>
                                              </tr>
                                            );
                                          }
                                        }
                                      )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}

                        {advanceSummeryTrain.length === 0 && (
                          <p className="text-center text-danger">
                            No Data Found
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="modal fade"
                id="verifyModel"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content">
                    <form action="" onSubmit={handleFormSubmit}>
                      <div className="modal-header bg-label-primary py-3">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Container No : {ModelData?.container_no}
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => setModelData(null)}
                        />
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          <input
                            type="hidden"
                            name="id"
                            id="id"
                            defaultValue={ModelData?.id}
                          />
                          <input
                            type="hidden"
                            name="container_no"
                            id="container_no"
                            defaultValue={ModelData?.container_no}
                          />
                          <div className="col-sm-6 mb-4">
                            <div className="form-floating form-floating-outline">
                              <select
                                name="container_type"
                                id="container_type"
                                className="form-control"
                                value={ContainerType}
                                required
                                onChange={(e) =>
                                  setContainerType(e.target.value)
                                }
                              >
                                <option value="Empty">Empty</option>
                                <option value="Laden">Laden</option>
                              </select>
                              <label htmlFor="container_type">
                                Container Type
                              </label>
                            </div>
                          </div>
                          <div className="col-sm-6 mb-4">
                            <div className="form-floating form-floating-outline">
                              <select
                                name="itv_name"
                                id="itv_name"
                                className="form-control p-2 mb-2"
                                required
                              >
                                <option>Select ITV </option>
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
                              <label htmlFor="itv_name">Select ITV</label>
                            </div>
                          </div>

                          <div className="col-sm-6 mb-4">
                            <div className="form-floating form-floating-outline">
                              <select
                                name="equipment_name"
                                id="equipment_name"
                                className="form-control p-2 mb-2"
                                required
                              >
                                <option value="" selected disable>
                                  Select Equipment Name
                                </option>
                                <option value="RTG9">RTG9</option>
                                <option value="RTG8">RTG8</option>
                                <option value="RTG7">RTG7</option>
                                <option value="RTG6">RTG6</option>
                                <option value="R-S3">R-S3</option>
                                <option value="R-S2">R-S2</option>
                                <option value="R-S1">R-S1</option>
                                <option value="RH03">RH03</option>
                                <option value="RH04">RH04</option>
                                <option value="RH05">RH05</option>
                                <option value="RH06">RH06</option>
                                <option value="RH07">RH07</option>
                                <option value="RH08">RH08</option>
                                <option value="RH10">RH10</option>
                                <option value="RH12">RH12</option>
                                <option value="RH13">RH13</option>
                              </select>
                              <label htmlFor="equipment_name">
                                Select Equipment Name
                              </label>
                            </div>
                          </div>
                          <div className="col-sm-6 mb-4">
                            <div className="form-floating form-floating-outline">
                              <select
                                name="is_container_damage"
                                id="is_container_damage"
                                className="form-control"
                                value={DamageStatus}
                                required
                                onChange={(e) =>
                                  setDamageStatus(e.target.value)
                                }
                              >
                                <option value="N">NO</option>
                                <option value="Y">YES</option>
                              </select>
                              <label htmlFor="is_container_damage">
                                Damage Status
                              </label>
                            </div>
                          </div>
                          {DamageStatus == "Y" && (
                            <div className="col-sm-6 mb-4">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="damage_remark"
                                  id="damage_remark"
                                  placeholder="Damage Remark"
                                />
                                <label htmlFor="damage_remark">
                                  Damage Remark
                                </label>
                              </div>
                            </div>
                          )}

                          {ContainerType == "Laden" && (
                            <>
                              <div className="col-md-6">
                                <div className="form-floating form-floating-outline mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="seal_1_no"
                                    id="seal_1_no"
                                    placeholder="Linear Seal"
                                    defaultValue={Seal_1_no ?? ModelData?.seal_1_no}
                                  />
                                  <label htmlFor="seal_1_no">Linear Seal</label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating form-floating-outline mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="seal_2_no"
                                    id="seal_2_no"
                                    placeholder="Custom Seal"
                                    defaultValue={Seal_2_no ?? ModelData?.seal_2_no}
                                  />
                                  <label htmlFor="seal_2_no">Custom Seal</label>
                                </div>
                              </div>
                            </>
                          )}

                          <div className="col-md-12 my-3">
                            {ContainerType == "Empty" ? (
                              <>
                              <label
                                htmlFor="container_image"
                                className="btn btn-outline-info btn-sm me-2"
                              >
                                <i className="ri-camera-fill me-1"></i>
                                Container Image
                                <input
                                  type="file"
                                  id="container_image"
                                  name="container_image"
                                  className="d-none"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={(e) =>
                                    handleImageChange(e, "container")
                                  }
                                />
                              </label>
                              {Photos?.container && (
                                <div className="mt-2">
                                  <img
                                    src={Photos.container}
                                    alt="Custom Seal"
                                    className="img-thumbnail rounded-3"
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                              )}
                              </>
                            ) : (
                              ContainerType == "Laden" && (
                                <>
                                  <div className="d-flex align-items-center gap-4">
                                    <div className="">
                                      <label
                                        htmlFor="seal_1_image"
                                        className="btn btn-outline-info btn-sm me-2"
                                      >
                                        <i className="ri-camera-fill me-1"></i>{" "}
                                          Linear Seal
                                        <input
                                          type="file"
                                          id="seal_1_image"
                                          name="seal_1_image"
                                          className="d-none"
                                          accept="image/*"
                                          capture="environment"
                                          onChange={(e) =>
                                            {handleImageChange(e, "seal1");  handleImageToText(e, 1)}
                                          }
                                        />
                                      </label>
                                      {Photos?.seal1 && (
                                        <div className="mt-2">
                                          <img
                                            src={Photos.seal1}
                                            alt="Linear Seal"
                                            className="img-thumbnail rounded-3"
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <div className="">
                                      <label
                                        htmlFor="seal_2_image"
                                        className="btn btn-outline-info btn-sm me-2"
                                      >
                                        <i className="ri-camera-fill me-1"></i>
                                        Custom Seal
                                        <input
                                          type="file"
                                          id="seal_2_image"
                                          name="seal_2_image"
                                          className="d-none"
                                          accept="image/*"
                                          capture="environment"
                                          onChange={(e) =>
                                           { handleImageChange(e, "seal2"); handleImageToText(e, 2) }
                                          }
                                        />
                                      </label>
                                      {Photos?.seal2 && (
                                        <div className="mt-2">
                                          <img
                                            src={Photos.seal2}
                                            alt="Custom Seal"
                                            className="img-thumbnail rounded-3"
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer border-top py-3">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          data-bs-dismiss="modal"
                          onClick={() => setModelData(null)}
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          data-bs-dismiss="modal"
                          className="btn btn-label-primary btn-sm"
                        >
                          Save changes
                        </button>
                      </div>
                    </form>
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
      </div>
    </>
  );
}
