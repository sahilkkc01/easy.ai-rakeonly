import React, { useEffect, useState } from "react";
import Nav from "./main/nav";
import Footer from "./main/footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "./main/header";
import { formatToDateTime } from "./main/formatToDateTime";
import { ApiBaseUrl, ImgBaseUrl, OcrImgBaseUrl } from "../Config";

export default function CisfOut() {
  const navigate = useNavigate();
  const NewUser = localStorage.getItem("user");
  const user = JSON.parse(NewUser);
  const [gate_name, setGateName] = useState("EXIM");
  const type = "OUT";
  const [ImageView, setImageView] = useState("");
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState("false");

  useEffect(() => {
    GetData();
  }, []);

  const GetData = async () => {
    setLoading(true);
    // const url = `https://ctas.live/backend/api/gate/cisf/data?type=${type}&gate_name=${gate_name}`;
    const url = `${ApiBaseUrl}/gate/cisf/data?type=${type}&gate_name=${gate_name}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data.data && response.data.data.data) {
        setData(response.data.data.data);
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

  const handleApprove = async (id, type) => {
    // const url = `https://ctas.live/backend/api/gate/cisf/status/update`;
    const url = `${ApiBaseUrl}/gate/cisf/status/update`;
    let payload = {
      id: id,
      type: type,
      gate_name: "EXIM",
    };
    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data.status) {
        Swal.fire({
          icon: "success",
          text: response.data.message,
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          GetData();
        });
      } else {
        Swal.fire({
          icon: "Info",
          text: `No message returned from the server.`,
          timer: 3000,
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
      setLoading(true);
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
              <div className="container-xxl flex-grow-1">
                <div className="row mt-5">
                  <div className="d-flex justify-content-between align-items-center mb-5">
                    <h3 className="text-primary text-center">CISF OUT</h3>
                    <div className="text-end">
                      <button
                        className={`btn btn-sm ${
                          gate_name === "EXIM"
                            ? "btn-label-primary"
                            : "btn-outline-primary"
                        } m-1`}
                        onClick={() => setGateName("EXIM")}
                      >
                        EXIM Gate
                      </button>
                      <button
                        className={`btn btn-sm ${
                          gate_name === "DTMS"
                            ? "btn-label-primary"
                            : "btn-outline-primary"
                        } m-1`}
                        onClick={() => setGateName("DTMS")}
                      >
                        DTMS Gate
                      </button>
                    </div>
                  </div>
                  {Data &&
                    Data.map((row, i) => (
                      <div className="col-lg-6 " key={i}>
                        <div className="card shadow-lg rounded mb-4">
                          <div className="card-body">
                            <div className="row align-item-center">
                              <div className="col">
                                <div className="mb-2">
                                  <p className="mb-0">Gate Number :</p>
                                  <p className="mb-0 fw-bold text-uppercase">
                                    {row.gate_no}
                                  </p>
                                </div>
                                <div className="mb-2">
                                  <p className="mb-0">Vehicle Number :</p>
                                  <p className="mb-0 fw-bold text-uppercase">
                                    {row.vehicle_no}
                                    <img
                                      src={
                                        `${OcrImgBaseUrl}/uploads/` +
                                        row.ocr_vehicle_data?.vehicle_no_img
                                      }
                                      alt=""
                                      style={{ width: "50px" }}
                                      data-bs-toggle="modal"
                                      data-bs-target="#exampleModal"
                                      onClick={() =>
                                        setImageView(
                                          `${OcrImgBaseUrl}/uploads/` +
                                            row.ocr_vehicle_data?.vehicle_no_img
                                        )
                                      }
                                    />
                                  </p>
                                </div>
                                <div className="mb-2">
                                  <p className="mb-0">Permit Number :</p>
                                  <p className="mb-0 fw-bold text-uppercase">
                                    {row.permit_no}
                                  </p>
                                </div>
                                {row.is_container == "Y" &&
                                row.empty_container_image_1 == null ? (
                                  <>
                                    <div className="mb-2">
                                      <p className="mb-0"> Liner Seal :</p>
                                      <p className="mb-0 fw-bold text-uppercase">
                                        {row.seal_1_no}
                                        <img
                                          src={
                                            `${ImgBaseUrl}/uploads/` +
                                            row.seal_1_image
                                          }
                                          alt=""
                                          style={{ width: "50px" }}
                                          data-bs-toggle="modal"
                                          data-bs-target="#exampleModal"
                                          onClick={() =>
                                            setImageView(
                                              `${ImgBaseUrl}/uploads/` +
                                                row.seal_1_image
                                            )
                                          }
                                        />
                                      </p>
                                    </div>
                                    <div className="mb-2">
                                      <p className="mb-0">Custom Seal :</p>
                                      <p className="mb-0 fw-bold text-uppercase">
                                        {row.seal_2_no}
                                        <img
                                          src={
                                            `${ImgBaseUrl}/uploads/` +
                                            row.seal_2_image
                                          }
                                          alt=""
                                          style={{ width: "50px" }}
                                          data-bs-toggle="modal"
                                          data-bs-target="#exampleModal"
                                          onClick={() =>
                                            setImageView(
                                              `${ImgBaseUrl}/uploads/` +
                                                row.seal_2_image
                                            )
                                          }
                                        />
                                      </p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {row.empty_container_image_1 != null ? (
                                      <div className="mb-2">
                                        <p className="mb-0">
                                          Empty Container Image :
                                        </p>
                                        <p className="mb-0 fw-bold text-uppercase">
                                          {row.seal_2_no}
                                          <img
                                            src={
                                              `${ImgBaseUrl}/uploads/` +
                                              row.empty_container_image_1
                                            }
                                            alt=""
                                            style={{ width: "50px" }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
                                            onClick={() =>
                                              setImageView(
                                                `${ImgBaseUrl}/uploads/` +
                                                  row.empty_container_image_1
                                              )
                                            }
                                          />
                                        </p>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                )}
                                <div className="mb-2">
                                  <p className="mb-0">Survey Time :</p>
                                  <p className="mb-0 fw-bold text-uppercase">
                                    {" "}
                                    {formatToDateTime(
                                      row.survey_start_time
                                    )}
                                  </p>
                                </div>
                                <div className="mb-2">
                                  <p className="mb-0">Surveyor Name :</p>
                                  <p className="mb-0 fw-bold text-uppercase">
                                    {" "}
                                    {row.user_data?.name}{" "}
                                  </p>
                                </div>
                              </div>
                              <div className="col">
                                {["PMD", "GPCP"].some((prefix) =>
                                  row?.permit_no?.startsWith(prefix)
                                ) && row?.type == "OUT" ? (
                                  <>
                                    <div className="mb-2">
                                      <p className="mb-0"> Container No :</p>
                                      <p className="mb-0 fw-bold text-uppercase">
                                        {row.container_no}
                                        <img
                                          src={
                                            `${OcrImgBaseUrl}/uploads/` +
                                            row.ocr_container_data
                                              ?.container_image
                                          }
                                          alt=""
                                          style={{ width: "50px" }}
                                          data-bs-toggle="modal"
                                          data-bs-target="#exampleModal"
                                          onClick={() =>
                                            setImageView(
                                              `${OcrImgBaseUrl}/uploads/` +
                                                row.ocr_container_data
                                                  ?.container_image
                                            )
                                          }
                                        />
                                        <img
                                          src={
                                            `${OcrImgBaseUrl}/uploads/` +
                                            row.container_image
                                          }
                                          alt=""
                                          style={{ width: "50px" }}
                                          data-bs-toggle="modal"
                                          data-bs-target="#exampleModal"
                                          onClick={() =>
                                            setImageView(
                                             `${OcrImgBaseUrl}/uploads/` +
                                                row.container_image
                                            )
                                          }
                                        />
                                      </p>
                                    </div>
                                    <div className="mb-2">
                                      <p className="mb-0">
                                        {" "}
                                        Container Size(ft) :
                                      </p>
                                      <p className="mb-0 fw-bold text-uppercase">
                                        {row.container_size}
                                      </p>
                                    </div>
                                    <div className="mb-2">
                                      <p className="mb-0"> Container Type :</p>
                                      <p className="mb-0 fw-bold text-uppercase">
                                        {row.container_type}
                                      </p>
                                    </div>
                                    <div className="mb-2">
                                      <img
                                        src={
                                          `${ImgBaseUrl}/uploads/` +
                                          row?.driver_photo
                                        }
                                        alt=""
                                        style={{ width: "50px" }}
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() =>
                                          setImageView(
                                            `${ImgBaseUrl}/uploads/` +
                                              row?.driver_photo
                                          )
                                        }
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="mb-2">
                                      <p className="mb-0"> CRN No :</p>
                                      <p className="mb-0 fw-bold text-uppercase">
                                        {row.container_no}
                                        {/* {row.id} */}
                                        {/* <img src={'https://ctas.live/ocr_backend/uploads/'+row.ocr_container_data?.container_image} alt="" style={{width:'50px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" 
                                      onClick={()=>setImageView('https://ctas.live/ocr_backend/uploads/'+row.ocr_container_data?.container_image)} />
                                      <img src={'https://ctas.live/ocr_backend/uploads/'+row.container_image} alt="" style={{width:'50px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" 
                                      onClick={()=>setImageView('https://ctas.live/ocr_backend/uploads/'+row.container_image)} /> */}
                                      </p>
                                    </div>
                                  </>
                                )}
                                {/* <div className="mb-2">
                                  <p className="mb-0">Package Type :</p>
                                  <p className="mb-0 fw-bold text-uppercase">N/A</p>
                                </div>
                                <div className="mb-2">
                                  <p className="mb-0">Package Count :</p>
                                  <p className="mb-0 fw-bold text-uppercase">N/A</p>
                                </div> */}

                                <div className="">
                                  <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      handleApprove(row.id, row.type)
                                    }
                                  >
                                    Approve
                                  </button>
                                </div>
                              </div>
                              {/* <div className="col-4 d-flex flex-column justify-content-between align-items-center">
                                <div className="">
                                  <img
                                    src="https://m.media-amazon.com/images/I/4140ugrV62L.jpg"
                                    alt="Vehicle"
                                    className="img-fluid w-100"
                                  />
                                </div>
                                <div className="">
                                  <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      handleApprove(row.id, row.type)
                                    }
                                  >
                                    Approve
                                  </button>
                                </div>
                              </div> */}
                            </div>

                            <div
                              class="modal fade"
                              id="exampleModal"
                              tabindex="-1"
                              aria-labelledby="exampleModalLabel"
                              aria-hidden="true"
                            >
                              <div class="modal-dialog">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <h5
                                      class="modal-title"
                                      id="exampleModalLabel"
                                    >
                                      Modal title
                                    </h5>
                                    <button
                                      type="button"
                                      class="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div class="modal-body text-center">
                                    <img
                                      src={ImageView}
                                      alt=""
                                      style={{ width: "50%" }}
                                    />
                                  </div>
                                  <div class="modal-footer">
                                    <button
                                      type="button"
                                      class="btn btn-secondary"
                                      data-bs-dismiss="modal"
                                    >
                                      Close
                                    </button>
                                    <button
                                      type="button"
                                      class="btn btn-primary"
                                    >
                                      Save changes
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
