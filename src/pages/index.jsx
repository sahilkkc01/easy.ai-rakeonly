import React, { useState, useEffect, useRef } from "react";
import Footer from "./main/footer";
import Nav from "./main/nav";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import "../Pages.css";
import LinksButtons from "./main/LinksButtons";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Header from "./main/header";
import { compressImage, formatToDateTimeLocal } from "./main/formatToDateTime";
import { ApiBaseUrl } from "../Config";

export default function Index() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const formRef = useRef(null);
  const [GateName, setGateName] = useState("EXIM");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrScanner, setQrScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [Error, setError] = useState(null);

  const [Type, setType] = useState("IN");
  const [ISContainer, setISContainer] = useState("N");
  const [ContainerSize, setContainerSize] = useState("40");
  const [ContainerType, setContainerType] = useState("Empty");
  const [DamageStatus, setDamageStatus] = useState("NO");
  const [Data, setData] = useState([]);

  const stopQrScanner = () => {
    if (qrScanner) {
      qrScanner
        .stop()
        .then(() => {
          setIsScanning(false);
          setQrScanner(null); // Clear scanner instance
        })
        .catch((err) => console.error("Error stopping QR scanner:", err));
    }
  };

  const startQrScanner = () => {
    setIsScanning(true);
    const html5QrCode = new Html5Qrcode("reader");
    setQrScanner(html5QrCode);

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const environmentCamera = devices.find(
            (device) =>
              device.kind === "videoinput" && device.facing === "environment"
          );
          const constraints = environmentCamera
            ? { deviceId: { exact: environmentCamera.deviceId } }
            : { facingMode: "environment" };
          html5QrCode
            .start(
              constraints,
              { fps: 10, qrbox: { width: 250, height: 250 } },
              (decodedText) => {
                // stopQrScanner();
                handleSubmit(decodedText);
                setIsScanning(false);
                setQrScanner(null);
                html5QrCode.stop();
              },
              (errorMessage) => {
                console.error("ScanningError:", errorMessage);
              }
            )
            .catch((err) => {
              console.error("Error starting QR scanner:", err);
              setError("Error starting QR scanner:", err);
              setIsScanning(false);
            });
        })
        .catch((err) => {
          console.error("Error enumerating devices:", err);
          setError("Error enumerating devices: ", err);
          setIsScanning(false);
        });
    } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = { video: { facingMode: "environment" } };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          html5QrCode
            .start(
              { facingMode: "environment" },
              { fps: 10, qrbox: { width: 250, height: 250 } },
              (decodedText) => {
                handleSubmit(decodedText);
                setIsScanning(false);
                // stopQrScanner();
                setQrScanner(null);
                html5QrCode.stop();
              },
              (errorMessage) => {
                console.error("ScanningError:", errorMessage);
              }
            )
            .catch((err) => {
              console.error("Error starting QR scanner:", err);

              setError("Error starting QR scanner: ", err);
              setIsScanning(false);
            });
        })
        .catch((err) => {
          console.error("Error accessing the camera:", err);
          setError("Error accessing the camera: ", err);

          setIsScanning(false);
        });
    } else {
      console.error("Media devices are not supported on this device.");
      setError("Media devices are not supported on this device ");
      setIsScanning(false);
    }
  };

  const handleSubmit = async (decodedText) => {
    stopQrScanner();
    setPreview(true);
    const newDate = new Date();
    const date = formatToDateTimeLocal(newDate);
    setLoading(true);
    // const url = `https://ctas.live/backend/api/get/permit_detail/${decodedText}?created_by=${user.id}&gate_name=${GateName}&scan_time=${date}&type=${Type}`;
    const url = `${ApiBaseUrl}/get/permit_detail/${decodedText}?created_by=${user.id}&gate_name=${GateName}&scan_time=${date}&type=${Type}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data && response.data.data) {
        setPreview(true);
        setData(response.data.data);
        if (response.data.data.container_size) {
          setContainerSize(response.data.data.container_size);
        }
        if (response.data.data.is_container) {
          setISContainer(response.data.data.is_container);
        }
        if (response.data.data.ldd_mt_flg) {
          if (response.data.data.ldd_mt_flg == "L") {
            setContainerType("Laden");
          } else if (response.data.data.ldd_mt_flg == "E") {
            setContainerType("Empty");
          }
          // setContainerType(response.data.data.container_type);
        }
        if (response.data.data.is_container_damage) {
          setDamageStatus(response.data.data.is_container_damage);
        }
      } else if (response.data && response.data.message) {
        // setPreview('')
        stopQrScanner();
        Swal.fire({
          icon: "info",
          text: response.data.message,
          // timer: 3000,
          // showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "info",
          text: `Data Not Found, Something Want Wrong..! `,
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
      stopQrScanner();
      setLoading(false);
    }
  };

  const handlePermitNumber = (e) => {
    e.preventDefault();
    const permit_no = e.target.permit_no.value.toUpperCase();
    setIsScanning(false);
    handleSubmit(permit_no);
  };

  const handlePostSubmit = async (payload) => {
    setLoading(true);

    // const url = `https://ctas.live/backend/api/gate_transection/update`;
    const url = `${ApiBaseUrl}/gate_transection/update`;
    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data && response.data.data) {
        Swal.fire({
          icon: "success",
          text: `Data Updated SuccessFully.`,
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          setIsScanning(false);
          setPreview(false);
          if (formRef.current) {
            formRef.current.reset(); // Reset form fields
          }
          stopQrScanner();
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "Info",
          text: `Something Want Wrong..! Data Don't Updated ..! `,
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let formValues = Object.fromEntries(formData.entries());

    const FIles = [
      "container_image",
      "seal_1_image",
      "seal_2_image",
      "driver_photo",
      "driver_license",
      "custom_documents",
      "e_bill",
    ];

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

    const newDate = new Date();
    const date = formatToDateTimeLocal(newDate);
    formValues["type"] = Type;
    formValues["survey_end_time"] = date;
    const date90DaysLater = new Date(newDate.setDate(newDate.getDate() + 90));
    const date90Formatted = formatToDateTimeLocal(date90DaysLater);
    formValues["ctrlifenumber"] = date90Formatted;
    console.log(formValues);
    handlePostSubmit(formValues);
  };

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
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header />
          <div className="layout-page">
            <div className="content-wrapper">
              <Nav />
              <div className="container-xxl flex-grow-1 container-p-y">
                {/* <LinksButtons /> */}
                <div className="row">
                  <div className="col-md-12 m-auto">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            {Error && (
                              <div
                                className="alert alert-danger mt-3"
                                role="alert"
                              >
                                {Error}
                              </div>
                            )}
                            <h4 className="text-primary">Gate Application</h4>
                          </div>
                          <div className="col-6 m-auto">
                            <div className="form-floating form-floating-outline mb-6">
                              <select
                                name="type"
                                id="type"
                                className="form-control"
                                value={Type}
                                onChange={(e) => setType(e.target.value)}
                              >
                                <option selected disabled>
                                  Select Type
                                </option>
                                <option value="IN">IN</option>
                                <option value="OUT">OUT</option>
                              </select>
                              <label htmlFor="type">Transaction Type</label>
                            </div>
                          </div>

                          {!preview && (
                            <>
                              <div className="col-md-12 mb-2">
                                <div className="col-md-4 m-auto text-center QrScanBox">
                                  {isScanning ? (
                                    "Scanning..."
                                  ) : (
                                    <div
                                      onClick={startQrScanner}
                                      disabled={isScanning}
                                    >
                                      <img
                                        src="/camra.png"
                                        alt=""
                                        className="qrImg"
                                      />
                                      <h4>Scan Permit</h4>
                                    </div>
                                  )}
                                  {isScanning && (
                                    <button
                                      onClick={() => {
                                        setIsScanning(false);
                                        setPreview(false);
                                        if (formRef.current) {
                                          formRef.current.reset();
                                        }
                                        stopQrScanner();
                                      }}
                                      className="btn btn-label-danger ms-3"
                                    >
                                      Cancel
                                    </button>
                                  )}

                                  <div
                                    id="reader"
                                    className="mt-3 m-auto"
                                    style={{
                                      width: "300px",
                                      height: "300px",
                                      display: isScanning ? "block" : "none",
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <h4 className="text-center">Or</h4>
                              <div className="col-md-6 m-auto">
                                <form
                                  ref={formRef}
                                  className="d-flex gap-3 align-items-center"
                                  onSubmit={handlePermitNumber}
                                >
                                  <div className="w-75">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Permit No."
                                        name="permit_no"
                                        id="permit_no"
                                        required=""
                                      />
                                      <label htmlFor="permit_no">
                                        Permit No.
                                      </label>
                                    </div>
                                  </div>
                                  <div className="">
                                    <button
                                      type="submit"
                                      className="btn btn-primary"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </>
                          )}
                          {preview && (
                            <>
                              <hr />
                              <form   ref={formRef} onSubmit={handleFormSubmit} id="myForm">
                                <div className="row p-5">
                                  <input
                                    type="hidden"
                                    name="id"
                                    id="id"
                                    value={Data?.id}
                                  />
                                  <div className="col-sm-6 mb-4">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="permit_no"
                                        name="permit_no"
                                        readOnly={true}
                                        defaultValue={Data?.permit_no}
                                      />
                                      <label htmlFor="permit_no">
                                        Permit Number
                                      </label>
                                    </div>
                                  </div>
                                  {/* <div className="col-sm-6 mb-4">
                                    <div className="form-floating form-floating-outline">
                                      <select
                                        name="type"
                                        id="type"
                                        className="form-control"
                                        onChange={(e) =>
                                          setType(e.target.value)
                                        }
                                      >
                                        <option value="IN">IN</option>
                                        <option value="OUT">OUT</option>
                                      </select>
                                      <label htmlFor="type">
                                        Transaction Type
                                      </label>
                                    </div>
                                  </div> */}

                                  <div className="col-sm-6 mb-4">
                                    <div className="form-floating form-floating-outline">
                                      <select
                                        name="gate_no"
                                        id="gate_no"
                                        className="form-control"
                                      >
                                        <option value="1">Gate 1</option>
                                        <option value="2">Gate 2</option>
                                        <option value="3">Gate 3</option>
                                        <option value="4">Gate 4</option>
                                        {Type != "OUT" && (
                                          <option value="5">Gate 5</option>
                                        )}
                                      </select>
                                      <label htmlFor="gate_no">Gate NO</label>
                                    </div>
                                  </div>
                                  {ISContainer == "Y" && (
                                    <>
                                      <div className="col-sm-6 mb-4">
                                        <div className="form-floating form-floating-outline">
                                          <select
                                            name="container_type"
                                            id="container_type"
                                            className="form-control"
                                            value={ContainerType}
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
                                            name="container_size"
                                            id="container_size"
                                            className="form-control"
                                            value={ContainerSize}
                                            onChange={(e) =>
                                              setContainerSize(e.target.value)
                                            }
                                          >
                                            <option value="40">40</option>
                                            <option value="20">20</option>
                                          </select>
                                          <label htmlFor="container_size">
                                            Container Size
                                          </label>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  <div className="col-sm-6 mb-4">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="container_no"
                                        name="container_no"
                                        defaultValue={Data?.container_no}
                                      />
                                      <label htmlFor="container_no">
                                        Container/CRN Number
                                      </label>
                                    </div>
                                  </div>
                                  {ContainerSize == "20" && (
                                    <div className="col-sm-6 mb-4">
                                      <div className="form-floating form-floating-outline">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="container_no2"
                                          name="container_no2"
                                        />
                                        <label htmlFor="container_no2">
                                          Container-2 Number
                                        </label>
                                      </div>
                                    </div>
                                  )}

                                  <div className="col-sm-6 mb-4">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="datetime-local"
                                        className="form-control"
                                        readOnly={true}
                                        defaultValue={formatToDateTimeLocal(
                                          Data?.ispermitvalid
                                        )}
                                      />
                                      <label htmlFor="">
                                        Permit Valid Time
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-sm-6 mb-4">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="vehicle_no"
                                        id="vehicle_no"
                                        required
                                        defaultValue={Data?.vehicle_no}
                                      />
                                      <label htmlFor="vehicle_no">
                                        Vehicle Number
                                      </label>
                                    </div>
                                  </div>

                                  {ContainerType == "Laden" &&
                                    ISContainer == "Y" && (
                                      <>
                                        <div className="col-sm-6 mb-4">
                                          <div className="form-floating form-floating-outline">
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="seal_1_no"
                                              id="seal_1_no"
                                            />
                                            <label htmlFor="seal_1_no">
                                              Linear Seal
                                            </label>
                                          </div>
                                        </div>
                                        <div className="col-sm-6 mb-4">
                                          <div className="form-floating form-floating-outline">
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="seal_2_no"
                                              id="seal_2_no"
                                            />
                                            <label htmlFor="seal_2_no">
                                              Custom Seal
                                            </label>
                                          </div>
                                        </div>
                                      </>
                                    )}

                                  <div className="col-sm-6 mb-4">
                                    <div className="form-floating form-floating-outline">
                                      <select
                                        name="is_container_damage"
                                        id="is_container_damage"
                                        className="form-control"
                                        value={DamageStatus}
                                        onChange={(e) =>
                                          setDamageStatus(e.target.value)
                                        }
                                      >
                                        <option value="NO">NO</option>
                                        <option value="YES">YES</option>
                                      </select>
                                      <label htmlFor="is_container_damage">
                                        Damage Status
                                      </label>
                                    </div>
                                  </div>
                                  {DamageStatus == "YES" && (
                                    <div className="col-sm-6 mb-4">
                                      <div className="form-floating form-floating-outline">
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="damage_remark"
                                          id="damage_remark"
                                        />
                                        <label htmlFor="damage_remark">
                                          Damage Remark
                                        </label>
                                      </div>
                                    </div>
                                  )}

                                  <div className="col-md-12 mb-3">
                                    {ContainerType == "Empty" ? (
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
                                        />
                                      </label>
                                    ) : (
                                      ContainerType == "Laden" && (
                                        <>
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
                                            />
                                          </label>
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
                                            />
                                          </label>
                                        </>
                                      )
                                    )}
                                  </div>

                                  <div className="col-md-12">
                                    <hr />
                                    <h6>Driver Information</h6>
                                  </div>
                                  <div className="col-md-12 mb-4">
                                    <label
                                      htmlFor="DriverPhoto"
                                      className="btn btn-outline-info btn-sm me-2"
                                    >
                                      <i className="ri-camera-fill me-1"></i>{" "}
                                      Driver Photo
                                      <input
                                        type="file"
                                        id="DriverPhoto"
                                        name="driver_photo"
                                        className="d-none "
                                        accept="image/*"
                                        capture="environment"
                                      />
                                    </label>
                                    <label
                                      htmlFor="DriverLicense"
                                      className="btn btn-outline-info btn-sm me-2"
                                    >
                                      <i className="ri-camera-line me-1"></i>{" "}
                                      Driver License
                                      <input
                                        type="file"
                                        id="DriverLicense"
                                        className="d-none "
                                        name="driver_license"
                                        accept="image/*"
                                        capture="environment"
                                      />
                                    </label>
                                    {Type && Type == "IN" ? (
                                      <label
                                        htmlFor="e_bill"
                                        className="btn btn-outline-info btn-sm me-2"
                                      >
                                        <i className="ri-camera-fill me-1"></i>{" "}
                                        E Bill
                                        <input
                                          type="file"
                                          id="e_bill"
                                          className="d-none"
                                          name="e_bill"
                                          accept="image/*"
                                          capture="environment"
                                        />
                                      </label>
                                    ) : (
                                      <>
                                        <label
                                          htmlFor="custom_documents"
                                          className="btn btn-outline-info btn-sm me-2"
                                        >
                                          <i className="ri-camera-fill me-1"></i>
                                          Custom Documents
                                          <input
                                            type="file"
                                            id="custom_documents"
                                            className="d-none "
                                            name="custom_documents"
                                            accept="image/*"
                                            capture="environment"
                                          />
                                        </label>
                                      </>
                                    )}
                                  </div>

                                  <div className="col-md-12 d-flex gap-3">
                                    <button
                                      className="btn btn-label-primary"
                                      type="submit"
                                      // onClick={(e) => handleFormSubmit(e)}
                                      // onClick={() => document.getElementById("myForm").submit()}
                                    >
                                      Submit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsScanning(false);
                                        setPreview(false);
                                        if (formRef.current) {
                                          formRef.current.reset();
                                        }
                                        stopQrScanner();
                                      }}
                                      className="btn btn-danger ms-auto"
                                    >
                                      Scan Another Permit
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </>
                          )}
                        </div>
                      </div>
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
      </div>
    </>
  );
}
