import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useSearchParams,
} from "react-router-dom";
import Footer from "./main/footer";
import Nav from "./main/nav";
import { Html5Qrcode } from "html5-qrcode";
import Swal from "sweetalert2";
import "../App.css";
import axios from "axios";
import { compressImage, formatToDateTime } from "./main/formatToDateTime";
import { ApiBaseUrl, OcrImgBaseUrl } from "../Config";

export default function DtmsGate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const formRef = useRef(null);

  const [showScreen, setShowScreen] = useState("Gate");
  const [type, setType] = useState("IN");
  const [gate_no, setGateNo] = useState('1');
  const [lane_no, setLineNo] = useState('1');
  const [DamageStatus, setDamageStatus] = useState(null);

  useEffect(() => {
    setShowScreen(searchParams.get("showScreen") ?? "Gate");
    setType(searchParams.get("type") ?? "IN");
    setGateNo(searchParams.get("gate_no") ?? '1');
    setLineNo(searchParams.get("lane_no") ?? '1');
  }, [searchParams]);

  useEffect(() => {
    if (showScreen && type && gate_no && lane_no) GetLIveData();
  }, [type, gate_no, lane_no]);

  const [EditVehicleNo, setEditVehicleNo] = useState(null);
  const [EditVehicleID, setEditVehicleID] = useState(null);
  const [EditAbleVehicleNo, setEditAbleVehicleNo] = useState(null);

  const [EditAblePermit, setEditAblePermit] = useState(false);
  const [PermitData, setPermitData] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const [isSpecialPermit, setIsSpecialPermit] = useState(false);
  const [specialPermit, setSpecialPermit] = useState(null);
  const [isContainer, setIsContainer] = useState(false);
  const [container, setContainer] = useState("");
  const [containerType, setContainerType] = useState(null);

  const [isContainerDamage, setIsContainerDamage] = useState(false);

  const [rearSideDamage, setRearSideDamage] = useState(null);
  const [leftSideDamage, setLeftSideDamage] = useState(null);
  const [frontSideDamage, setFrontSideDamage] = useState(null);
  const [rightSideDamage, setRightSideDamage] = useState(null);
  const [topSideDamage, setTopSideDamage] = useState(null);

  const [Error, setError] = useState("");

  const [Data, setData] = useState([]);
  const [NewVehicle, setNewVehicle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [SelectedData, setSelectedData] = useState("");

  const [ocr_vehicle_number, setOcr_vehicle_number] = useState("");
  const [vehicle_no_image, setVehicle_no_image] = useState("");

  const [Seal_1_no, setSeal_1_no] = useState("");
  const [Seal_2_no, setSeal_2_no] = useState("");

  let html5QrCode;
  const stopQrScanner = () => {
    if (html5QrCode) {
      html5QrCode
        .stop()
        .then(() => {
          console.log("QR scanner stopped.");
          setIsScanning(false);
        })
        .catch((err) => {
          console.error("Error stopping the QR scanner:", err);
        });
    }
  };
  const startQrScanner = () => {
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.style.display = "none";
    }

    setIsScanning(true);
    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode("reader");
    }

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
                setScannedData(decodedText);
                setIsScanning(false);
                html5QrCode.stop();
                // QrScanBox
                document
                  .querySelector('#QrScanBox [aria-label="Close"]')
                  .click();
              },
              (errorMessage) => {
                console.error("ScanningError:", errorMessage);
                setError("ScanningError:", errorMessage);
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
                setScannedData(decodedText);
                setIsScanning(false);
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
      Swal.fire({
        icon: "error",
        text: `Media devices are not supported on this device.`,
        timer: 1500,
        customClass: {
          popup: "custom-swal-popup",
        },
      });
      console.error("Media devices are not supported on this device.");
      setError("Media devices are not supported on this device ");
      setIsScanning(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // const user = JSON.parse(localStorage.getItem("user"));

    const formData = new FormData(e.target);

    formData.append("ocr_vehicle_number", ocr_vehicle_number); // Append the vehicle number
    formData.append("vehicle_no_image", vehicle_no_image);

    let formEntries = Object.fromEntries(formData.entries());

    const FIles = [
      "vehicle_no_image",
      "driver_photo",
      "driver_license",
      "e_bill",
      "custom_documents",
      // "special_permit",
      "seal_1_image",
      "seal_2_image",
      "empty_container_image_1",
      "empty_container_image_2",
      "cntr_back_img",
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
            formEntries = Object.fromEntries(formData.entries());
          } else {
            alert("Could not compress this file.");
            return;
          }
        }
      }
    }

    // formEntries.id = SelectedData.id;
    formEntries.type = type;
    formEntries.gate_no = gate_no;
    formEntries.lane_no = lane_no;
    formEntries.gate_name = "DTMS";
    // formEntries.created_by = user.id;
    formEntries.vehicle_no_id = SelectedData.id;
    formEntries.vehicle_no = SelectedData.vehicle_no;

    console.log(formEntries);
    const url = `${ApiBaseUrl}/dtms/gate/surveyData/post`;

    try {
      const response = await axios.post(url, formEntries, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      if (response.data.status && response.data.status == "success") {
        Swal.fire({
          icon: "success",
          text: response.data.message,
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          formRef?.current?.reset();
          window.location.reload();
          setShowScreen("Vehicles");
          GetLIveData();
        });
      } else {
        let errorMessage = "";
        if (typeof response.data.message === "object") {
          errorMessage = Object.entries(response.data.message)
            .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
            .join("\n");
        } else {
          errorMessage = response.data.message;
        }
        Swal.fire({
          icon: "error",
          text: `Please check all fields:\n${errorMessage}`,
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

  const GetLIveData = async () => {
    setLoading(true);
    const url = `${ApiBaseUrl}/dtms/gate/new/vehicles?type=${type}&lane_no=${lane_no}`;
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

  const [Photos, setPhotos] = useState({
    driverPhoto: null,
    driverLicense: null,
    driverEBill: null,
    driverCustom: null,
    permit: null,
    specialPermit: null,
    seal1: null,
    seal2: null,
  });

  const handleImageChange = (event, name) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prevPhotos) => ({
          ...prevPhotos,
          [name]: reader.result, // Dynamically update the correct field
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePermitNo = async () => {
    setLoading(true);
    if (scannedData && type) {
      const url = `${ApiBaseUrl}/dtms/get/permit_detail_v2/${scannedData}?gate_name=DTMS&type=${type}&gate_no=${gate_no}&lane_no=${lane_no}`;

      try {
        const response = await axios.get(url, {
          headers: { "Content-Type": "application/json" },
        });
        console.log(response.data);
        if (response.data.data) {
          setPermitData(response.data);
        } else {
          Swal.fire({
            icon: "info",
            text: `Something Want Wrong..! ${response.data.message}`,
            // timer: 3000,
            // showConfirmButton: false,
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
    } else {
      setLoading(false);
      Swal.fire({
        icon: "info",
        text: `Please Check all Field .... Something Want Wrong..!`,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handleEditVehicleNo = async () => {
    setLoading(true);
    if (EditVehicleID && EditVehicleNo) {
      const payload = {
        id: EditVehicleID,
        vehicle_no: EditVehicleNo,
      };
      const url = `${ApiBaseUrl}/dtms/gate/ocr/vehicle/update`;

      try {
        const response = await axios.post(url, payload, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.data.status && response.data.status == "success") {
          Swal.fire({
            icon: "success",
            text: response.data.message,
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            setEditVehicleID(null);
            setEditVehicleNo(null);
            setEditAbleVehicleNo(false);
            setEditAblePermit(true);
          });
        } else {
          Swal.fire({
            icon: "info",
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
    } else {
      setLoading(false);
      Swal.fire({
        icon: "info",
        text: `Please Check all Field .... Something Want Wrong..!`,
        timer: 3000,
        showConfirmButton: false,
      });
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

    const url = `${ApiBaseUrl}/text/extract/vision`;

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
      <div className="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
        <div
          className="layout-container"
          style={{
            backgroundImage: "url('/background.webp')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.9,
          }}
        >
          {/* <Nav /> */}

          <div
            className="layout-page"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y ">
                <div className="row align-items-center justify-content-center ">
                  <div className="col-lg-6 col-md-9 col-sm-12  ">
                    {showScreen && showScreen == "Gate" || showScreen == "Vehicles" ? (
                      <>
                      <div className="ms-auto col-md-12 text-center mb-3">
                          <button
                            className={
                              type == "IN"
                                ? "btn me-2 btn-info"
                                : "btn me-2 btn-outline-info"
                            }
                            onClick={() => setType("IN")}
                          >
                            In Gate
                          </button>
                          <button
                            className={
                              type == "IN"
                                ? "btn me-2 btn-outline-info"
                                : "btn me-2 btn-info"
                            }
                            onClick={() => setType("OUT")}
                          >
                            Out Gate
                          </button>
                        </div>
                      
                      <div className="card">
                        <div className="card-body border-bottom">
                          <div className="row">
                            <div className="col-md-6">
                              <h4 className="m-0">Vehicles</h4>
                            </div>
                            <div className="col-md-6 text-end">
                              <button
                                className="btn btn-warning me-3"
                                onClick={GetLIveData}
                              >
                                {" "}
                                <i class="fa fa-refresh" aria-hidden="true"></i>
                                Fetch New
                              </button>
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => setNewVehicle(true)}
                              >
                                Add New Vehicle
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="card-body border-bottom">
                          <div className="d-flex align-items-center gap-3 flex-row overflow-scroll pb-3 no-scrollbar">
                            {NewVehicle ? (
                              <div className="form col-6">
                                <label htmlFor="">Enter Vehicle Number</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="ocr_vehicle_number"
                                  onChange={(e) =>
                                    setOcr_vehicle_number(
                                      e.target.value?.toUpperCase()
                                    )
                                  }
                                  placeholder="Vehicle No"
                                />
                                <hr />
                                <label htmlFor="">Capture Image</label>
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={(e) =>
                                    setVehicle_no_image(e.target.value)
                                  }
                                  name="vehicle_no_image"
                                  placeholder="Vehicle No"
                                />

                                <hr />
                                <button
                                  type="button"
                                  className="btn btn-success m-0  w-100"
                                  onClick={() => {
                                    setShowScreen("Permit");
                                    setSelectedData({
                                      id: 0,
                                      vehicle_no: ocr_vehicle_number,
                                    });
                                  }}
                                >
                                  Start Survey
                                </button>
                                <button
                                  onClick={() => {
                                    setNewVehicle(false);
                                    setSelectedData("");
                                  }}
                                  className="btn btn-danger mt-3"
                                >
                                  Cancle
                                </button>
                              </div>
                            ) : (
                              <></>
                            )}
                            {Data &&
                              Data.map((row, i) => (
                                <div className="col-md-6" key={i}>
                                  <div className="card">
                                    <img
                                      src={
                                        `${OcrImgBaseUrl}/uploads/` +
                                        row.vehicle_no_img
                                      }
                                      className="card-img-top"
                                      alt="..."
                                      // style={{ height: "200px" }}
                                    />
                                    <div className="card-body">
                                      <div className="d-flex justify-content-between align-items-center gap-1 mb-1">
                                        <h5 className="card-title">
                                          {EditAbleVehicleNo &&
                                          row.id === EditVehicleID ? (
                                            <input
                                              type="text"
                                              className="form-control p-1"
                                              defaultValue={row.vehicle_no}
                                              onChange={(e) =>
                                                setEditVehicleNo(e.target.value)
                                              }
                                              name="vehicle_no"
                                              id="vehicle_no"
                                            />
                                          ) : (
                                            row.vehicle_no
                                          )}
                                        </h5>

                                        {EditAbleVehicleNo &&
                                        row.id === EditVehicleID ? (
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-label-primary"
                                            onClick={handleEditVehicleNo}
                                          >
                                            <i className="ri-verified-badge-line"></i>
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-label-primary"
                                            onClick={() => {
                                              setEditVehicleID(row.id);
                                              setEditAbleVehicleNo(true);
                                            }}
                                          >
                                            <i className="ri-edit-circle-fill"></i>
                                          </button>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-label-primary"
                                        onClick={() => {
                                          setShowScreen("Permit");
                                          setSelectedData(row);
                                        }}
                                      >
                                        Start Survey
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="card-body p-0 py-1 text-center bg-label-secondary ">
                              <button
                                type="button"
                                className="btn m-0  w-100"
                                onClick={() => setShowScreen("Gate")}
                              >
                                Back
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      </>
                    ) : (
                      <form
                        className="card"
                        ref={formRef}
                        onSubmit={handleFormSubmit}
                      >
                        <div className="card-body border-bottom">
                          <div className="d-flex align-items-center justify-content-between">
                            <h5 className="m-0">Driver Information</h5>
                            <b>{SelectedData.vehicle_no}</b>
                          </div>
                          <hr className="my-2" />
                          <div className="row align-items-center justify-contact-between">
                            <div className="col-4">
                              <label
                                htmlFor="DriverPhoto"
                                className="btn btn-secondary btn-sm"
                              >
                                <i className="ri-camera-line me-1"></i>{" "}
                                Driver&nbsp;Photo
                                <input
                                  type="file"
                                  id="DriverPhoto"
                                  name="driver_photo"
                                  className="d-none "
                                  accept="image/*"
                                  capture="environment"
                                  onChange={(e) =>
                                    handleImageChange(e, "driverPhoto")
                                  }
                                />
                              </label>
                              {Photos?.driverPhoto && (
                                <div className="mt-2">
                                  <img
                                    src={Photos.driverPhoto}
                                    alt="Driver"
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
                            <div className="col-4">
                              <label
                                htmlFor="DriverLicense"
                                className="btn btn-secondary btn-sm"
                              >
                                <i className="ri-camera-line me-1"></i>{" "}
                                Driver&nbsp;License
                                <input
                                  type="file"
                                  id="DriverLicense"
                                  className="d-none "
                                  name="driver_license"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={(e) =>
                                    handleImageChange(e, "driverLicense")
                                  }
                                />
                              </label>
                              {Photos?.driverLicense && (
                                <div className="mt-2">
                                  <img
                                    src={Photos.driverLicense}
                                    alt="Driver"
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
                            {type && type == "IN" ? (
                              <div className="col-4">
                                <label
                                  htmlFor="e_bill"
                                  className="btn btn-secondary btn-sm"
                                >
                                  <i className="ri-camera-line me-1"></i>{" "}
                                  E&nbsp;Bill
                                  <input
                                    type="file"
                                    id="e_bill"
                                    className="d-none "
                                    name="e_bill"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) =>
                                      handleImageChange(e, "driverEBill")
                                    }
                                  />
                                </label>
                                {Photos?.driverEBill && (
                                  <div className="mt-2">
                                    <img
                                      src={Photos.driverEBill}
                                      alt="Driver"
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
                            ) : (
                              <>
                                <div className="col-4">
                                  <label
                                    htmlFor="custom_documents"
                                    className="btn btn-secondary btn-sm"
                                  >
                                    <i className="ri-camera-line me-1"></i>{" "}
                                    Custom&nbsp;Documents
                                    <input
                                      type="file"
                                      id="custom_documents"
                                      className="d-none "
                                      name="custom_documents"
                                      accept="image/*"
                                      capture="environment"
                                      onChange={(e) =>
                                        handleImageChange(e, "driverCustom")
                                      }
                                    />
                                  </label>
                                  {Photos?.driverCustom && (
                                    <div className="mt-2">
                                      <img
                                        src={Photos.driverCustom}
                                        alt="Driver"
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
                              </>
                            )}
                          </div>
                        </div>
                        <div className="card-body border-bottom">
                          <div className="row align-items-end">
                            <div className="col-12 mb-4">
                              <div className="d-flex gap-4 justify-content-between align-items-center">
                                <div className="w-100">
                                  <h5 className="m-0">Permit Number</h5>
                                  <input
                                    type="text"
                                    className="form-control p-2 fs-6 mb-2"
                                    placeholder="PMA2007040012"
                                    name="permit_no"
                                    readOnly={EditAblePermit}
                                    defaultValue={scannedData}
                                    onChange={(e) =>
                                      setScannedData(e.target.value)
                                    }
                                  />
                                  <span className="mt-2 text-primary fw-bold">
                                    {PermitData?.data["tns:IsPermitValid"]
                                      ? formatToDateTime(
                                          PermitData?.data["tns:IsPermitValid"]
                                        )
                                      : ""}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-label-secondary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#QrScanBox"
                                  onClick={startQrScanner}
                                >
                                  <i className="ri-camera-line fs-4"></i>
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-label-primary"
                                  onClick={handlePermitNo}
                                >
                                  <i className="ri-verified-badge-line fs-4"></i>
                                </button>
                              </div>
                            </div>

                            <div className="col-12 mb-1">
                              <div className="form-check align-items-center">
                                <input
                                  className="form-check-input rounded-circle fs-6 me-2"
                                  type="checkbox"
                                  id="flexCheck"
                                  onChange={() => {
                                    if (!isSpecialPermit) {
                                      setIsContainer(!isSpecialPermit);
                                      setContainer("1");
                                    }
                                    setIsSpecialPermit(!isSpecialPermit);
                                  }}
                                />
                                <label
                                  className="form-check-label fs-6"
                                  htmlFor="flexCheck"
                                >
                                  Special Permit
                                </label>
                              </div>
                              {isSpecialPermit && (
                                <div className="d-flex align-items-center gap-5">
                                  <label
                                    htmlFor="special_permit"
                                    className="btn btn-secondary"
                                  >
                                    <i className="ri-camera-line me-2"></i>{" "}
                                    Special Permit
                                    <input
                                      type="file"
                                      name="special_permit"
                                      id="special_permit"
                                      className="d-none "
                                      accept="image/*"
                                      capture="environment"
                                      onChange={(e) =>
                                        handleImageChange(e, "specialPermit")
                                      }
                                    />
                                  </label>
                                  {Photos?.specialPermit && (
                                    <div className="mt-2">
                                      <img
                                        src={Photos.specialPermit}
                                        alt="specialPermit"
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
                              )}
                            </div>
                            <hr />
                            <div className="col-md-12">
                              <div className="form-check align-items-center">
                                <input
                                  className="form-check-input rounded-circle fs-6 me-2"
                                  type="checkbox"
                                  id="isContainer"
                                  name="is_container"
                                  value="Y"
                                  checked={isContainer}
                                  onChange={() => {
                                    if (!isSpecialPermit) {
                                      setIsContainer(!isContainer);
                                    }
                                  }}
                                />
                                <label
                                  className="form-check-label h5 mb-0"
                                  htmlFor="isContainer"
                                >
                                  Container
                                </label>
                              </div>
                              {isContainer && (
                                <>
                                  <div className="row ps-5">
                                    <div className="col-2">
                                      <div
                                        className={`form-check custom-option custom-option-label custom-option-basic ${
                                          container == "1" ? "checked" : ""
                                        } `}
                                      >
                                        <label
                                          className="form-check-label custom-option-content text-center p-2"
                                          htmlFor="container1"
                                        >
                                          <input
                                            name="container_count"
                                            className="form-check-input"
                                            type="radio"
                                            id="container1"
                                            value="1"
                                            hidden
                                            onChange={() => {
                                              setContainer("1");
                                            }}
                                          />
                                          <b
                                            className={`fs-6  ${
                                              container == "1"
                                                ? "text-primary"
                                                : ""
                                            } `}
                                          >
                                            1
                                          </b>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-2">
                                      <div
                                        className={`form-check custom-option custom-option-label custom-option-basic  ${
                                          container == "2" ? "checked" : ""
                                        }  `}
                                      >
                                        <label
                                          className="form-check-label custom-option-content text-center p-2"
                                          htmlFor="container2"
                                        >
                                          <input
                                            name="container_count"
                                            className="form-check-input"
                                            type="radio"
                                            id="container2"
                                            value={2}
                                            hidden
                                            onChange={() => {
                                              setContainer("2");
                                            }}
                                          />
                                          <b
                                            className={`fs-6  ${
                                              container == "2"
                                                ? "text-primary"
                                                : ""
                                            } `}
                                          >
                                            2
                                          </b>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    {Array.from({ length: container }).map(
                                      (_, index) => (
                                        <>
                                          <div className="col-md-8 my-1">
                                            <label htmlFor="">
                                              Container Number
                                            </label>
                                            <input
                                              key={index}
                                              type="text"
                                              className="form-control"
                                              name={`container_no_${index + 1}`}
                                              defaultValue={
                                                index === 0
                                                  ? PermitData?.data[
                                                      "tns:ContainerNumber"
                                                    ]
                                                  : ""
                                              }
                                              placeholder="Container Number"
                                            />
                                          </div>

                                          <div className="w-50">
                                            <label htmlFor="">
                                              Container Back Side Image <br />
                                            </label>
                                            <label
                                              htmlFor="cntr_back_img"
                                              className="btn btn-secondary"
                                            >
                                              <i className="ri-camera-line me-2"></i>
                                              Image
                                              <input
                                                type="file"
                                                id="cntr_back_img"
                                                className="d-none "
                                                name="cntr_back_img"
                                                accept="image/*"
                                                capture="environment"
                                                onChange={(e) => {
                                                  // handleImageToText(e, 1);
                                                  handleImageChange(
                                                    e,
                                                    "cntr_back_img"
                                                  );
                                                }}
                                              />
                                            </label>
                                          </div>
                                          {Photos?.cntr_back_img && (
                                            <div className="mt-2">
                                              <img
                                                src={Photos.cntr_back_img}
                                                alt="cntr_back_img"
                                                className="img-thumbnail rounded-3"
                                                style={{
                                                  width: "100px",
                                                  height: "100px",
                                                  objectFit: "cover",
                                                }}
                                              />
                                            </div>
                                          )}

                                          <input
                                            type="hidden"
                                            name="ocr_container_id"
                                            defaultValue={
                                              PermitData?.container?.id
                                            }
                                          />

                                          <div className="col-md-4">
                                            <img
                                              src={
                                                `${OcrImgBaseUrl}/uploads/` +
                                                PermitData?.container
                                                  ?.container_image
                                              }
                                              alt=""
                                              style={{ "max-height": "110px" }}
                                            />
                                          </div>
                                        </>
                                      )
                                    )}
                                  </div>
                                  <div className="row">
                                    <h5 className="mt-3 mb-1">
                                      Container Type
                                    </h5>
                                    <div className="col-4">
                                      <div
                                        className={`form-check custom-option custom-option-label custom-option-basic ${
                                          containerType == "Laden"
                                            ? "checked"
                                            : ""
                                        } `}
                                      >
                                        <label
                                          className="form-check-label custom-option-content text-center p-2"
                                          htmlFor="Laden"
                                        >
                                          <input
                                            name="containerType"
                                            className="form-check-input"
                                            type="radio"
                                            value="Laden"
                                            id="Laden"
                                            hidden
                                            onChange={() => {
                                              setContainerType("Laden");
                                            }}
                                          />
                                          <b
                                            className={`fs-6  ${
                                              containerType == "Laden"
                                                ? "text-primary"
                                                : ""
                                            } `}
                                          >
                                            Laden
                                          </b>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-4">
                                      <div
                                        className={`form-check custom-option custom-option-label custom-option-basic  ${
                                          containerType == "Empty"
                                            ? "checked"
                                            : ""
                                        }  `}
                                      >
                                        <label
                                          className="form-check-label custom-option-content text-center p-2"
                                          htmlFor="Empty"
                                        >
                                          <input
                                            name="containerType"
                                            className="form-check-input"
                                            type="radio"
                                            value="Empty"
                                            id="Empty"
                                            hidden
                                            onChange={() => {
                                              setContainerType("Empty");
                                            }}
                                          />
                                          <b
                                            className={`fs-6  ${
                                              containerType == "Empty"
                                                ? "text-primary"
                                                : ""
                                            } `}
                                          >
                                            Empty
                                          </b>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    {containerType == "Laden" && (
                                      <>
                                        <div className="row">
                                          <div className="col-md-12 d-flex gap-4 align-items-center">
                                            <input
                                              type="text"
                                              className="form-control w-50"
                                              defaultValue={Seal_1_no}
                                              name="seal_1_no"
                                              placeholder="Liner Seal Number"
                                            />

                                            <div className="w-50">
                                              <label
                                                htmlFor="seal_1_image"
                                                className="btn btn-secondary"
                                              >
                                                <i className="ri-camera-line me-2"></i>
                                                Image
                                                <input
                                                  type="file"
                                                  id="seal_1_image"
                                                  className="d-none "
                                                  name="seal_1_image"
                                                  accept="image/*"
                                                  capture="environment"
                                                  onChange={(e) => {
                                                    handleImageToText(e, 1);
                                                    handleImageChange(
                                                      e,
                                                      "seal1"
                                                    );
                                                  }}
                                                />
                                              </label>
                                            </div>
                                            {Photos?.seal1 && (
                                              <div className="mt-2">
                                                <img
                                                  src={Photos.seal1}
                                                  alt="seal1"
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

                                        <div className="row mt-2">
                                          <div className="col-md-12 d-flex gap-4  align-items-center">
                                            <input
                                              type="text"
                                              className="form-control w-50"
                                              defaultValue={Seal_2_no}
                                              name="seal_2_no"
                                              placeholder="Custom Seal Number"
                                            />
                                            <div className="w-50">
                                              <label
                                                htmlFor="seal_2_image"
                                                className="btn btn-secondary"
                                              >
                                                <i className="ri-camera-line me-2"></i>
                                                Image
                                                <input
                                                  type="file"
                                                  id="seal_2_image"
                                                  name="seal_2_image"
                                                  className="d-none "
                                                  accept="image/*"
                                                  capture="environment"
                                                  onChange={(e) => {
                                                    handleImageToText(e, 2);
                                                    handleImageChange(
                                                      e,
                                                      "seal2"
                                                    );
                                                  }}
                                                />
                                              </label>
                                            </div>
                                            {Photos?.seal2 && (
                                              <div className="mt-2">
                                                <img
                                                  src={Photos.seal2}
                                                  alt="CustomSealImage"
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
                                    )}
                                    {containerType === "Empty" &&
                                      (container === "1" ? (
                                        <div>
                                          <label
                                            htmlFor="containerImage1"
                                            className="btn btn-secondary"
                                          >
                                            <i className="ri-camera-line me-2"></i>
                                            Add Photo
                                            <input
                                              type="file"
                                              id="containerImage1"
                                              name="empty_container_image_1"
                                              className="d-none"
                                              accept="image/*"
                                              capture="environment"
                                              onChange={(e) =>
                                                handleImageChange(
                                                  e,
                                                  "empty_container_image_1"
                                                )
                                              }
                                            />
                                          </label>
                                          {Photos?.empty_container_image_1 && (
                                            <div className="mt-2">
                                              <img
                                                src={
                                                  Photos.empty_container_image_1
                                                }
                                                alt="empty_container_image_1"
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
                                      ) : (
                                        <div className="d-flex gap-5 align-items-center">
                                          <div>
                                            <label
                                              htmlFor="containerImage1"
                                              className="btn btn-secondary"
                                            >
                                              <i className="ri-camera-line me-2"></i>
                                              Add Photo
                                              <input
                                                type="file"
                                                id="containerImage1"
                                                className="d-none"
                                                name="empty_container_image_1"
                                                accept="image/*"
                                                capture="environment"
                                                onChange={(e) =>
                                                  handleImageChange(
                                                    e,
                                                    "empty_container_image_1"
                                                  )
                                                }
                                              />
                                            </label>
                                            {Photos?.empty_container_image_1 && (
                                              <div className="mt-2">
                                                <img
                                                  src={
                                                    Photos.empty_container_image_1
                                                  }
                                                  alt="empty_container_image_1"
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
                                          <div>
                                            <label
                                              htmlFor="containerImage2"
                                              className="btn btn-secondary"
                                            >
                                              <i className="ri-camera-line me-2"></i>
                                              Add Photo
                                              <input
                                                type="file"
                                                id="containerImage2"
                                                name="empty_container_image_2"
                                                className="d-none"
                                                accept="image/*"
                                                capture="environment"
                                                onChange={(e) =>
                                                  handleImageChange(
                                                    e,
                                                    "empty_container_image_2"
                                                  )
                                                }
                                              />
                                            </label>
                                            {Photos?.empty_container_image_2 && (
                                              <div className="mt-2">
                                                <img
                                                  src={
                                                    Photos.empty_container_image_2
                                                  }
                                                  alt="empty_container_image_2"
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
                                      ))}
                                  </div>
                                  <hr />
                                  <div className="row my-3">
                                    <div className="form-check align-items-center">
                                      <input
                                        className="form-check-input rounded-circle fs-6 me-2"
                                        type="checkbox"
                                        id="isContainerDamage"
                                        name="is_container_damgage"
                                        value="Y"
                                        onChange={() =>
                                          setIsContainerDamage(
                                            !isContainerDamage
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label h5 mb-0"
                                        htmlFor="isContainerDamage"
                                      >
                                        Container Damage
                                      </label>
                                    </div>

                                    {isContainerDamage && (
                                      <>
                                        <div className="col-sm-6 mb-4">
                                          <div className="form-floating form-floating-outline">
                                            <select
                                              name="damage_status"
                                              id="damage_status"
                                              className="form-control"
                                              value={DamageStatus}
                                              required
                                              onChange={(e) => {
                                                setDamageStatus(e.target.value);
                                              }}
                                            >
                                              <option value="N">NO</option>
                                              <option value="contianer_damage">
                                                Container Damage
                                              </option>
                                              <option value="seal_damage">
                                                Seal Damage
                                              </option>
                                              <option value="seal_mismatch">
                                                Seal Mismatch
                                              </option>
                                              <option value="seal_missing">
                                                Seal Missing
                                              </option>
                                            </select>
                                            <label htmlFor="damage_status">
                                              Damage Status
                                            </label>
                                          </div>
                                        </div>
                                        {DamageStatus != "N" && (
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
                                      </>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6 border-end pe-0 ">
                            <div
                              className="card-body p-0 py-1 text-center bg-label-secondary"
                              // onClick={() => setShowScreen("Vehicles")}
                              onClick={(e) => {
                                e.preventDefault();
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: "Do you really want to cancel the survey?",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#d33",
                                  cancelButtonColor: "#3085d6",
                                  confirmButtonText: "Yes, Cancel it!",
                                  cancelButtonText: "No, Keep it",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    formRef?.current?.reset();
                                    window.location.reload();
                                    setShowScreen("Vehicles");
                                    GetLIveData();
                                  }
                                });
                              }}
                            >
                              <button className="btn m-0  w-100" type="button">
                                Back
                              </button>
                            </div>
                          </div>
                          <div className="col-6 ps-0 ">
                            <div className="card-body p-0 py-1 text-center bg-label-primary ">
                              <button type="submit" className="btn m-0  w-100">
                                Submit Survey
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
                {showScreen !== "Gate" ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();

                      Swal.fire({
                        title: "Are you sure?",
                        text: "Do you really want to cancel the survey?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, Cancel it!",
                        cancelButtonText: "No, Keep it",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          formRef?.current?.reset();
                          window.location.reload();
                          setShowScreen("Vehicles");
                          GetLIveData();
                        }
                      });
                    }}
                    className="btn btn-label-danger my-3"
                  >
                    <span className="fs-6 me-1">&times;</span> Cancel Survey
                  </button>
                ) : (
                  ""
                )}
              </div>

              <div
                className="modal fade"
                id="QrScanBox"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        QR Scan
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={stopQrScanner}
                      />
                    </div>
                    <div className="modal-body">
                      <div className="row p-5">
                        <div className="col-md-6 m-auto text-center QrScanBox">
                          {isScanning ? (
                            "Scanning..."
                          ) : (
                            <div onClick={startQrScanner} disabled={isScanning}>
                              <img src="/camra.png" alt="" className="qrImg" />
                              <h4>Scan Permit</h4>
                            </div>
                          )}
                          {isScanning ? (
                            <>
                              <button
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={stopQrScanner}
                                className="btn btn-danger ms-3"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            ""
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
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={stopQrScanner}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <Footer />
              <div className="position-absolute top-0 end-0 p-3">
                <Link
                  to={"/Profile"}
                  className="btn fw-bold btn-outline-danger text-nowrap me-2"
                >
                  Reset Password
                </Link>

                <Link to={"/Logout"} className="btn btn-danger">
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
