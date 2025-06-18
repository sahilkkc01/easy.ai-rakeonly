import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Footer from "./main/footer";
import Nav from "./main/nav";
import Swal from "sweetalert2";
import "../Pages.css";
import LinksButtons from "./main/LinksButtons";
import TallySheetDeStuffingLCL from "./TallySheetDeStuffingLCL";
import Header from "./main/header";
import { formatToDateTimeLocal } from "./main/formatToDateTime";
import { ApiBaseUrl } from "../Config";

export default function CWHDestuffingReadLCL() {
  const [Data, setData] = useState([]);
  const [Error, setError] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [Type, setType] = useState("SearchForm");
  const [ContainerNo, setContainerNo] = useState("");
  const [ReadOnly, setReadOnly] = useState(true);
  const [DisAbled, setDisAbled] = useState(false);


  const GetData = async () => {
    // const url = `https://ctas.live/backend/api/get/de_stuffing_data/LCL/${ContainerNo}`;
    const url = `${ApiBaseUrl}/get/de_stuffing_data/LCL/${ContainerNo}`;
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

    UpdateData(upperCaseFormValues);
  };

  const UpdateData = async (upperCaseFormValues) => {
    // const url = `https://ctas.live/backend/api/de_stuffing_data/update`;
    const url = `${ApiBaseUrl}/de_stuffing_data/update`;
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
                            <h3>DeStuffing LCL 👋🏻</h3>
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
                                  value={ContainerNo}
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
                    <h4 className="text-center text-primary">
                      DeStuffing LCL
                    </h4>

                    <form action="" onSubmit={handleFormSubmit}>
                      <div className="card card-body my-5">
                        <div className="d-flex justify-content-between">
                          <h5>Basic Details</h5>
                          <div className="text-end">

                            <button type="button" onClick={() => setReadOnly(!ReadOnly)} className={`btn ${ReadOnly ? "btn-label-primary" : "btn-label-danger"}`}  >{ReadOnly ? "Edit" : "Cancel Edit"}</button>&nbsp;
                            <button type="button" onClick={() => (window.location.reload())} className="btn btn-label-info">Search Another</button>

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
                                id="cargo_gross_weight"
                                name="cargo_gross_weight"
                                placeholder="Cargo gross weight"
                                readOnly={ReadOnly}
                                disabled={DisAbled}
                                defaultValue={Data["cargo_gross_weight"]}
                              />
                              <label htmlFor="cargo_gross_weight">
                                Cargo gross weight
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6 col-sm-6  mb-2">
                            <div className="form-floating form-floating-outline">
                              <input
                                type="datetime-local"
                                className="form-control"
                                id="container_life"
                                name="container_life"
                                placeholder="Container life"
                                readOnly={ReadOnly}
                                disabled={DisAbled}
                                defaultValue={formatToDateTimeLocal(Data["container_life"])}
                              />
                              <label htmlFor="container_life">Container life</label>
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
                                type="number"
                                className="form-control"
                                id="container_size"
                                name="container_size"
                                defaultValue={Data["container_size"]}
                                placeholder="Container size"
                                readOnly={ReadOnly}
                                disabled={DisAbled}
                              />
                              <label htmlFor="container_size">Container size</label>
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
                                type="text"
                                className="form-control"
                                id="container_type"
                                name="container_type"
                                defaultValue={Data["container_type"]}
                                placeholder="Container type"
                                readOnly={ReadOnly}
                                disabled={DisAbled}
                              />
                              <label htmlFor="container_type">Container type</label>
                            </div>
                          </div>

                          <div className="col-md-6 col-sm-6 mb-2">
                            <div className="form-floating form-floating-outline">
                              <input
                                type="text"
                                className="form-control"
                                id="destuffing_job_order"
                                name="destuffing_job_order"
                                defaultValue={Data["destuffing_job_order"]}
                                placeholder="Destuffing job order"
                                readOnly={ReadOnly}
                                disabled={DisAbled}
                              />
                              <label htmlFor="destuffing_job_order">
                                Destuffing job order
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6 col-sm-6 mb-2">
                            <div className="form-floating form-floating-outline">
                              <input
                                type="text"
                                className="form-control"
                                id="handling_code"
                                name="handling_code"
                                defaultValue={Data["handling_code"]}
                                placeholder="Handling code"
                                readOnly={ReadOnly}
                                disabled={DisAbled}
                              />
                              <label htmlFor="handling_code">Handling code</label>
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
                                type="datetime-local"
                                className="form-control"
                                id="destuffing_plan_date"
                                name="destuffing_plan_date"
                                defaultValue={formatToDateTimeLocal(Data["destuffing_plan_date"])}
                                placeholder="Destuffing plan date"
                                readOnly={ReadOnly}
                                disabled={DisAbled}
                              />
                              <label htmlFor="destuffing_plan_date">
                                Destuffing plan date
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

                          <div className="col-md-6 col-sm-6 mb-2">
                            <div className="form-floating form-floating-outline">
                              <input
                                type="text"
                                className="form-control"
                                id="hld_rls_flag"
                                name="hld_rls_flag"
                                defaultValue={Data["hld_rls_flag"]}
                                placeholder="Hld rls flag"
                                readOnly={ReadOnly}
                                disabled={DisAbled}
                              />
                              <label htmlFor="hld_rls_flag">Hld rls flag</label>
                            </div>
                          </div>
                          <div className="col-md-6 col-sm-6 mb-2">
                            <div className="form-floating form-floating-outline">
                              <input
                                type="text"
                                className="form-control"
                                id="Forwarder"
                                name="Forwarder"
                                defaultValue={Data["Forwarder"]}
                                placeholder="Forwarder"
                                readOnly={ReadOnly}
                                disabled={DisAbled}
                              />
                              <label htmlFor="floatingInput">Forwarder</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h5 className="m-0">Bill Details</h5>
                      {Data["de_stuffing_bill_details"] &&
                        Data["de_stuffing_bill_details"].map((Details, i) => (
                          <div className="card my-5 card-body" key={i}>
                            <div className="row">
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="bill_date"
                                    name={`bill_date[${Details['id']}]`}
                                    defaultValue={Details["bill_date"] || ""}
                                    placeholder="Bill Date"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="bill_date">Bill Date</label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="bol_number"
                                    name={`bol_number[${Details['id']}]`}
                                    defaultValue={Details["bol_number"] || ""}
                                    placeholder="Bol Number"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="bol_number">Bol Number</label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="boe_number"
                                    name={`boe_number[${Details['id']}]`}
                                    defaultValue={Details["boe_number"] || ""}
                                    placeholder="Boe Number"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="boe_number">Boe Number</label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="gwportcode"
                                    name={`gwportcode[${Details['id']}]`}
                                    defaultValue={Details["gwportcode"] || ""}
                                    placeholder="GW Port Code"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="gwportcode">
                                    GW Port Code
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="commodity_code"
                                    name={`commodity_code[${Details['id']}]`}
                                    defaultValue={
                                      Details["commodity_code"] || ""
                                    }
                                    placeholder="Commodity Code"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="commodity_code">
                                    Commodity Code
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="commodity_description"
                                    name={`commodity_description[${Details['id']}]`}
                                    defaultValue={
                                      Details["commodity_description"] || ""
                                    }
                                    placeholder="Commodity Description"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="commodity_description">
                                    Commodity Description
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="importer_code"
                                    name={`importer_code[${Details['id']}]`}
                                    defaultValue={
                                      Details["importer_code"] || ""

                                    }
                                    placeholder="Importer Code"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="importer_code">
                                    Importer Code
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="importer_name"
                                    name={`importer_name[${Details['id']}]`}
                                    defaultValue={
                                      Details["importer_name"] || ""
                                    }
                                    placeholder="Importer Name"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="importer_name">
                                    Importer Name
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="no_of_packages_declared"
                                    name={`no_of_packages_declared[${Details['id']}]`}
                                    defaultValue={
                                      Details["no_of_packages_declared"] || ""
                                    }
                                    placeholder="No Of Packages Declared"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="no_of_packages_declared">
                                    No Of Packages Declared
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="grid_locations"
                                    name={`grid_locations[${Details['id']}]`}
                                    defaultValue={
                                      Details["grid_locations"] || ""
                                    }
                                    placeholder="Grid Locations"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="grid_locations">
                                    Grid Locations
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="area"
                                    name={`area[${Details['id']}]`}
                                    defaultValue={
                                      Details["area"] || ""
                                    }
                                    placeholder="Area"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="area">
                                    Area
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="package_code"
                                    name={`package_code[${Details['id']}]`}
                                    defaultValue={Details["package_code"] || ""}
                                    placeholder="Package Code"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="package_code">
                                    Package Code
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="package_type"
                                    name={`package_type[${Details['id']}]`}
                                    defaultValue={Details["package_type"] || ""}
                                    placeholder="Package Type"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="package_type">
                                    Package Type
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="package_weight"
                                    name={`package_weight[${Details['id']}]`}
                                    defaultValue={
                                      Details["package_weight"] || ""
                                    }
                                    placeholder="Package Weight"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="package_weight">
                                    Package Weight
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="cha_code"
                                    name={`cha_code[${Details['id']}]`}
                                    defaultValue={Details["cha_code"] || ""}
                                    placeholder="Cha Code"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="cha_code">Cha Code</label>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 mb-2">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="cha_name"
                                    name={`cha_name[${Details['id']}]`}
                                    defaultValue={Details["cha_name"] || ""}
                                    placeholder="Cha Name"
                                    readOnly={ReadOnly}
                                    disabled={DisAbled}
                                  />
                                  <label htmlFor="cha_name">Cha Name</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
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
                        className="btn btn-label-primary mb-2"
                      >
                        Print
                      </button>
                    </div>
                    <div
                      className=""
                      style={{ width: a4Width, height: a4Height }}
                    >
                      <iframe
                        ref={iframeRef}
                        src={`/TallySheetDeStuffingLCL/${Data['container_number']}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "white",
                        }}
                        title="A4 Iframe"
                      ></iframe>
                    </div>

                    {/* <TallySheetDeStuffingLCL Data={Data} /> */}
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
