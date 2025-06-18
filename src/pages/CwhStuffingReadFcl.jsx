import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Footer from "./main/footer";
import Nav from "./main/nav";
import Swal from "sweetalert2";
import "../Pages.css";
import LinksButtons from "./main/LinksButtons";
import TallySheetStuffingFCL from "./TallySheetStuffingFCL";
import Header from "./main/header";
import { formatToDateTimeLocal } from "./main/formatToDateTime";
import { ApiBaseUrl } from "../Config";

export default function CWHStuffingReadFCL() {
  const [Data, setData] = useState([]);
  const [Error, setError] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [Type, setType] = useState("SearchForm");
  const [ContainerNo, setContainerNo] = useState("");
  const [ReadOnly, setReadOnly] = useState(true);
  const [DisAbled, setDisAbled] = useState(false);

  const GetData = async () => {
    // const url = `https://ctas.live/backend/api/get/stuffing_data/FCL/${ContainerNo}`;
    const url = `${ApiBaseUrl}/get/stuffing_data/FCL/${ContainerNo}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data.data) {
        setData(response.data.data);
        if (Type === "SearchForm") {
          setType("EditForm");
        }
      } else {
        setError(`Error in Data Fetch :  SomeThing Want Wrong.`);
      }
    } catch (error) {
      setError(`Error in Data Fetch :  ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    const upperCaseFormValues = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => [
        key,
        value.toString().toUpperCase(),
      ])
    );
    console.log(upperCaseFormValues);
    // UpdateData(upperCaseFormValues);
  };

  const UpdateData = async (upperCaseFormValues) => {
    // const url = `https://ctas.live/backend/api/stuffing_data/update`;
    const url = `${ApiBaseUrl}/stuffing_data/update`;
    try {
      const response = await axios.post(url, upperCaseFormValues, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.message) {
        Swal.fire({
          icon: "success",
          text: response.data.message,
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          setType("ShowTable");
          setTimeout(() => {
            GetData();
          }, 1500);
        });
      } else {
        Swal.fire({
          icon: "info",
          text: "No message returned from the server.",
          timer: 3000,
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

  const a4Width = 789;
  const a4Height = 1099;
  const iframeRef = useRef(null);

  useEffect(() => {
    if (Type === "ShowTable") {
      console.log(Type);
      const iframe = iframeRef.current;

      if (iframe) {
        iframe.onload = () => {
          // Send the data when the iframe has fully loaded
          iframe.contentWindow.postMessage(Data, "*");
        };
      }
    }
  }, [Type]);

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.print();
    }
  };
  return (
    <>
      {Loading && (
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
<div className="row">

                {Type == "SearchForm" ? (
                  <div className="position-relative">
                    <div
                      className="authentication-wrapper authentication-basic container-p-y"
                      style={{ minHeight: "86vh" }}
                    >
                      <div className="authentication-inner py-6 mx-4">
                        <div className="card p-7">
                          <div className="app-brand justify-content-center mt-5">
                            <h3>Stuffing FCL👋🏻</h3>
                          </div>
                          <div className="card-body">
                            {Error && (
                              <div className="alert alert-danger" role="alert">
                                {Error}
                              </div>
                            )}
                            <p className="mb-5">
                              Please Enter Container Number to Fetch Data
                            </p>
                            <form
                              id="formAuthentication"
                              className="mb-5 fv-plugins-bootstrap5 fv-plugins-framework"
                            >
                              <div className="form-floating form-floating-outline mb-5 fv-plugins-icon-container">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="Container_Number"
                                  name="Container_Number"
                                  placeholder="Container Number"
                                  required
                                  defaultValue={ContainerNo}
                                  onChange={(e) =>
                                    setContainerNo(e.target.value.toUpperCase())
                                  }
                                />
                                <label htmlFor="email">Container Number</label>
                                <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback" />
                              </div>
                              <div className="mb-5">
                                <button
                                  className="btn btn-primary d-grid w-100 waves-effect waves-light"
                                  type="button"
                                  onClick={() => {
                                    setLoading(true);
                                    GetData();
                                  }}
                                >
                                  Fetch Data
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                        <img
                          src="/assets/img/illustrations/tree-3.png"
                          alt="auth-tree"
                          className="authentication-image-object-left d-none d-lg-block"
                        />
                        <img
                          src="/assets/img/illustrations/auth-basic-mask-light.png"
                          className="authentication-image d-none d-lg-block scaleX-n1-rtl"
                          height={172}
                          alt="triangle-bg"
                          data-app-light-img="illustrations/auth-basic-mask-light.png"
                          data-app-dark-img="illustrations/auth-basic-mask-dark.png"
                        />
                        <img
                          src="/assets/img/illustrations/tree.png"
                          alt="auth-tree"
                          className="authentication-image-object-right d-none d-lg-block"
                        />
                      </div>
                    </div>
                  </div>
                ) : Type == "EditForm" ? (
                  <div className="container col-md-10 m-auto mt-2">
                    <h3 className="text-center text-primary">Stuffing FCL</h3>

                    <form action="" onSubmit={handleFormSubmit}>
                      <div className="card my-4">
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <h5>Basic Details</h5>
                            <div className="text-end">
                              {/* <button
                                type="button"
                                onClick={() => setReadOnly(!ReadOnly)}
                                className={`btn ${ReadOnly
                                  ? "btn-label-primary"
                                  : "btn-label-danger"
                                  }`}
                              >
                                {ReadOnly ? "Edit" : "Cancel Edit"}
                              </button> */}
                              &nbsp;
                              <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="btn btn-label-info"
                              >
                                Search Another
                              </button>
                            </div>
                          </div>

                          <div className="row mt-2">
                            <div className="col-md-6  col-sm-6 mb-2">
                              <input
                                type="text"
                                className="form-control"
                                id="id"
                                name="id"
                                hidden
                                defaultValue={Data["id"]}
                              />
                              <input
                                type="text"
                                className="form-control"
                                id="type"
                                name="type"
                                hidden
                                defaultValue={Data["type"]}
                              />
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="cargo_weight_in_crn"
                                  name="cargo_weight_in_crn"
                                  placeholder="Cargo weight in crn"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                  defaultValue={Data["cargo_weight_in_crn"]}
                                />
                                <label htmlFor="cargo_weight_in_crn">
                                  Cargo weight in crn
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="stuffing_job_order"
                                  name="stuffing_job_order"
                                  defaultValue={Data["stuffing_job_order"]}
                                  placeholder="Stuffing job order"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="stuffing_job_order">
                                  Stuffing job order
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="seal_number"
                                  name="seal_number"
                                  defaultValue={Data["seal_number"]}
                                  placeholder="Seal number"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="seal_number">Seal number</label>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="datetime-local"
                                  className="form-control"
                                  id="crn_date"
                                  name="crn_date"
                                  defaultValue={formatToDateTimeLocal(
                                    Data["crn_date"]
                                  )}
                                  placeholder="Crn date"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="crn_date">Crn date</label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="crn_number"
                                  name="crn_number"
                                  defaultValue={Data["crn_number"]}
                                  placeholder="Crn number"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="crn_number">Crn number</label>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="gross_weight"
                                  name="gross_weight"
                                  defaultValue={Data["gross_weight"]}
                                  placeholder="Gross weight"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="gross_weight">
                                  Gross weight
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="shipping_liner_code"
                                  name="shipping_liner_code"
                                  defaultValue={Data["shipping_liner_code"]}
                                  placeholder="Shipping liner code"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="shipping_liner_code">
                                  Shipping liner code
                                </label>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="icd_location_code"
                                  name="icd_location_code"
                                  defaultValue={Data["icd_location_code"]}
                                  placeholder="Icd location code"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="icd_location_code">
                                  Icd location code
                                </label>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="cncl_flag"
                                  name="cncl_flag"
                                  defaultValue={Data["cncl_flag"]}
                                  placeholder="Cncl flag"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="cncl_flag">Cncl flag</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h5 className="m-0">Container Details</h5>
                      <div className="card my-4">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6 col-sm-6  mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="container_iso_code"
                                  name="container_iso_code"
                                  placeholder="Container iso code"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                  defaultValue={Data["container_iso_code"]}
                                />
                                <label htmlFor="container_iso_code">
                                  Container iso code
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="container_location_code"
                                  name="container_location_code"
                                  defaultValue={Data["container_location_code"]}
                                  placeholder="Container location code"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="container_location_code">
                                  Container location code
                                </label>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="container_number"
                                  name="container_number"
                                  defaultValue={Data["container_number"]}
                                  placeholder="Container number"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="container_number">
                                  Container number
                                </label>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="container_type"
                                  name="container_type"
                                  defaultValue={Data["container_type"]}
                                  placeholder="Container type"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="container_type">
                                  Container type
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="container_size"
                                  name="container_size"
                                  defaultValue={Data["container_size"]}
                                  placeholder="Container size"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="container_size">
                                  Container size
                                </label>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="datetime-local"
                                  className="form-control"
                                  id="container_life"
                                  name="container_life"
                                  defaultValue={formatToDateTimeLocal(
                                    Data["container_life"]
                                  )}
                                  placeholder="Container life"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="container_life">
                                  Container life
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4 mt-2">
                          {ReadOnly ? (
                            <button
                              type="button"
                              onClick={() => setType("ShowTable")}
                              className="btn btn-dark"
                            >
                              Next
                            </button>
                          ) : (
                            <button type="submit" className="btn btn-dark">
                              Submit & Next
                            </button>
                          )}
                          {/* <button type="submit" className="btn btn-dark">Submit</button> */}
                        </div>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="col-md-11 m-auto">
                    <div className="text-end">
                      <button
                        onClick={handlePrint}
                        className="btn btn-label-primary"
                      >
                        Print
                      </button>
                    </div>
                    <div  className=""
                      style={{width:a4Width, height:a4Height}}>

                    <iframe
                      ref={iframeRef}
                      src={`/TallySheetStuffingFCL/${ContainerNo}`}
                      style={{width:"100%", height:"100%",backgroundColor:"white",}}
                      title="A4 Iframe"
                      ></iframe>
                      </div>
                    {/* <TallySheetStuffingFCL Data={Data} /> */}
                  </div>
                )}
</div>
                <Footer />
                <div className="content-backdrop fade"></div>
              </div>
            </div>
          </div>
          <div className="layout-overlay layout-menu-toggle"></div>
          <div className="drag-target"></div>
        </div>
      </div>
    </>
  );
}
