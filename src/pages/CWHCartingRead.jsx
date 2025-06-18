import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Footer from "./main/footer";
import Nav from "./main/nav";
import Swal from "sweetalert2";
import "../Pages.css";
import LinksButtons from "./main/LinksButtons";
import TallySheetCartingReadFCL from "./TallySheetCartingReadFCL";
import Header from "./main/header";
import { formatToDateTimeLocal } from "./main/formatToDateTime";
import { ApiBaseUrl } from "../Config";

export default function CWHCartingRead() {
  const [Error, setError] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [Type, setType] = useState("SearchForm");
  const [crnNumber, setCrnNumber] = useState("");
  const [CartingOrderNumber, setCartingOrderNumber] = useState("0");
  const [ReadOnly, setReadOnly] = useState(true);
  const [DisAbled, setDisAbled] = useState(false);

  const GetData = async () => {
    // const url = `https://ctas.live/backend/api/get/carting/data?crn_number=${crnNumber}`;
    const url = `${ApiBaseUrl}/get/carting/data?crn_number=${crnNumber}`;
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
        setError(`Please Enter a Valid CRN Number .`);
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
    // const url = `https://ctas.live/backend/api/update/carting/data/${upperCaseFormValues.id}`;
    const url = `${ApiBaseUrl}/update/carting/data/${upperCaseFormValues.id}`;
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

  const a4Width = 819;
  const a4Height = 1129;
  const iframeRef = useRef(null);

  useEffect(() => {
    if (Type == "ShowTable") {
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
          className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark-subtle"
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
                {/* {JSON.stringify(Data)} */}

                {/* <LinksButtons /> */}

                {Type == "SearchForm" ? (
                  <div className="position-relative">
                    <div
                      className="authentication-wrapper authentication-basic container-p-y"
                      style={{ minHeight: "86vh" }}
                    >
                      <div className="authentication-inner py-6 mx-4">
                        <div className="card p-7">
                          <div className="app-brand justify-content-center mt-5">
                            <h3>Carting FCL👋🏻</h3>
                          </div>
                          <div className="card-body">
                            {Error && (
                              <div className="alert alert-danger" role="alert">
                                {Error}
                              </div>
                            )}
                            <p className="mb-5">
                              Please Enter CRN Number to Fetch Data
                            </p>
                            <form
                              id="formAuthentication"
                              className="mb-5 fv-plugins-bootstrap5 fv-plugins-framework"
                            >
                              <div className="form-floating form-floating-outline mb-5 fv-plugins-icon-container">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="crn_number"
                                  name="crn_number"
                                  placeholder="CRN Number"
                                  required
                                  defaultValue={crnNumber}
                                  onChange={(e) => setCrnNumber(e.target.value.toUpperCase())}
                                />
                                <label htmlFor="email">CRN Number</label>
                                <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback" />
                              </div>
                              <div className="form-floating form-floating-outline mb-5 fv-plugins-icon-container">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="carting_order_number"
                                  name="carting_order_number"
                                  placeholder="Carting Order Number"
                                  required
                                  defaultValue={CartingOrderNumber}
                                  onChange={(e) =>
                                    setCartingOrderNumber(e.target.value.toUpperCase())
                                  }
                                />
                                <label htmlFor="email">
                                  Carting Order Number
                                </label>
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
                    <h3 className="text-center text-primary">CARTING FCL</h3>
                    <form action="" onSubmit={handleFormSubmit}>
                      <div className="card my-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <h5>Basic Details {Type}</h5>
                            <div className="text-end">
                              <button
                                type="button"
                                onClick={() => setReadOnly(!ReadOnly)}
                                className={`btn ${ReadOnly
                                  ? "btn-label-primary"
                                  : "btn-label-danger"
                                  }`}
                              >
                                {ReadOnly ? "Edit" : "Cancel Edit"}
                              </button>
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
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="id"
                                  name="id"
                                  hidden
                                  placeholder="Carting order number"
                                  defaultValue={Data["id"]}
                                />
                                <input
                                  type="text"
                                  className="form-control"
                                  name="type"
                                  hidden
                                  defaultValue={Data["type"]}
                                />

                                <input
                                  type="text"
                                  className="form-control"
                                  id="carting_order_number"
                                  name="carting_order_number"
                                  placeholder="Carting order number"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                  defaultValue={Data["carting_order_number"]}
                                />
                                <label htmlFor="carting_order_number">
                                  Carting order number
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6  mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="cha_code"
                                  name="cha_code"
                                  placeholder="Cha code"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                  defaultValue={Data["cha_code"]}
                                />
                                <label htmlFor="cha_code">CHA code</label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="cha_name"
                                  name="cha_name"
                                  defaultValue={Data["cha_name"]}
                                  placeholder="Cha Name"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="cha_name">Cha Name</label>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="datetime-local"
                                  className="form-control"
                                  id="con_date"
                                  name="con_date"
                                  defaultValue={formatToDateTimeLocal(
                                    Data["con_date"]
                                  )}
                                  placeholder="Con date"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="floatingInput">Con date</label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="gw_port_code"
                                  name="gw_port_code"
                                  defaultValue={Data["gw_port_code"]}
                                  placeholder="Gw port code"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="gw_port_code">
                                  Gw port code
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="datetime-local"
                                  className="form-control"
                                  id="max_date_unloading"
                                  name="max_date_unloading"
                                  defaultValue={formatToDateTimeLocal(
                                    Data["max_date_unloading"]
                                  )}
                                  placeholder="Max date unloading"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="max_date_unloading">
                                  Max date unloading
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="no_of_packages_unloaded"
                                  name="no_of_packages_unloaded"
                                  defaultValue={Data["no_of_packages_unloaded"]}
                                  placeholder="No of packages unloaded"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="no_of_packages_unloaded">
                                  No of packages unloaded
                                </label>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="party_code"
                                  name="party_code"
                                  defaultValue={Data["party_code"]}
                                  placeholder="Party code"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="party_code">Party code</label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="is_cargo_card_generated"
                                  name="is_cargo_card_generated"
                                  defaultValue={Data["is_cargo_card_generated"]}
                                  placeholder="Is cargo card generated"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="is_cargo_card_generated">
                                  Is cargo card generated
                                </label>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="reserve_flag"
                                  name="reserve_flag"
                                  defaultValue={Data["reserve_flag"]}
                                  placeholder="Reserve flag"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="reserve_flag">
                                  Reserve flag
                                </label>
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
                                <label htmlFor="floatingInput">Cncl flag</label>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="exporter_name"
                                  name="exporter_name"
                                  defaultValue={Data["exporter_name"]}
                                  placeholder="Exporter name"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="exporter_name">
                                  Exporter name
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="private_or_concor_labour_flag"
                                  name="private_or_concor_labour_flag"
                                  defaultValue={
                                    Data["private_or_concor_labour_flag"]
                                  }
                                  placeholder="Private or concor labour flag"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="private_or_concor_labour_flag">
                                  Private or concor labour flag
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6 col-sm-6 mb-2">
                              <div className="form-floating form-floating-outline">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="shipping_liner_code"
                                  defaultValue={Data["shipping_liner_code"]}
                                  name="shipping_liner_code"
                                  placeholder="Shipping liner code"
                                  readOnly={ReadOnly}
                                  disabled={DisAbled}
                                />
                                <label htmlFor="shipping_liner_code">
                                  Shipping liner code
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="my-4">
                        {Data["carting_containers"][0] && (
                          <h5 className="my-1">Container Details</h5>
                        )}
                        {Data["carting_containers"] &&
                          Data["carting_containers"].map((Containers, i) => (
                            <div className="card mb-2" key={i}>
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`container_number_${Containers["id"]}`}
                                        name={`container_number[${Containers["id"]}]`}
                                        defaultValue={
                                          Containers["container_number"]
                                        }
                                        placeholder="Container number"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`container_number_${Containers["id"]}`}
                                      >
                                        Container number
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`container_type_${Containers["id"]}`}
                                        name={`container_type[${Containers["id"]}]`}
                                        defaultValue={
                                          Containers["container_type"]
                                        }
                                        placeholder="Container type"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`container_type_${Containers["id"]}`}
                                      >
                                        Container type
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`container_size_${Containers["id"]}`}
                                        name={`container_size[${Containers["id"]}]`}
                                        defaultValue={
                                          Containers["container_size"]
                                        }
                                        placeholder="Container size"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`container_size_${Containers["id"]}`}
                                      >
                                        Container size
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="datetime-local"
                                        className="form-control"
                                        id={`container_life_${Containers["id"]}`}
                                        name={`container_life[${Containers["id"]}]`}
                                        defaultValue={formatToDateTimeLocal(
                                          Containers["container_life"]
                                        )}
                                        placeholder="Container life"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`container_life_${Containers["id"]}`}
                                      >
                                        Container life
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      <div className="my-4">
                        {Data["carting_trucks"][0] && (
                          <h5 className="my-1">Truck Details</h5>
                        )}
                        {Data["carting_trucks"] &&
                          Data["carting_trucks"].map((Trucks, i) => (
                            <div className="card mb-2" key={i}>
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`truck_number${Trucks["id"]}`}
                                        name={`truck_number[${Trucks["id"]}]`}
                                        defaultValue={Trucks["truck_number"]}
                                        placeholder="Container number"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`truck_number${Trucks["id"]}`}
                                      >
                                        Truck number
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="datetime-local"
                                        className="form-control"
                                        id={`truck_arrival_date${Trucks["id"]}`}
                                        name={`truck_arrival_date[${Trucks["id"]}]`}
                                        defaultValue={formatToDateTimeLocal(
                                          Trucks["truck_arrival_date"]
                                        )}
                                        placeholder="Truck Arrival Date"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`truck_arrival_date${Trucks["id"]}`}
                                      >
                                        Truck Arrival Date
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      <div className="my-4">
                        {Data["carting_shipping_bill_details"][0] && (
                          <h5> Shipping Details</h5>
                        )}

                        {Data["carting_shipping_bill_details"] &&
                          Data["carting_shipping_bill_details"].map(
                            (Details, i) => (
                              <div className="card card-body mb-2" key={i}>
                                <div className="row">
                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`commodity_code_${Details["id"]}`}
                                        name={`commodity_code[${Details["id"]}]`}
                                        defaultValue={Details["commodity_code"]}
                                        placeholder="Commodity code"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`commodity_code_${Details["id"]}`}
                                      >
                                        Commodity code
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`no_of_packages_declared_${Details["id"]}`}
                                        name={`no_of_packages_declared[${Details["id"]}]`}
                                        defaultValue={
                                          Details["no_of_packages_declared"]
                                        }
                                        placeholder="No of packages declared"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`no_of_packages_declared_${Details["id"]}`}
                                      >
                                        No of packages declared
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`grid_locations_${Details["id"]}`}
                                        name={`grid_locations[${Details["id"]}]`}
                                        defaultValue={
                                          Details["grid_locations"]
                                        }
                                        placeholder="Grid Locations"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`grid_locations_${Details["id"]}`}
                                      >
                                        Grid Locations
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`area_${Details["id"]}`}
                                        name={`area[${Details["id"]}]`}
                                        defaultValue={
                                          Details["area"]
                                        }
                                        placeholder="Area"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`area_${Details["id"]}`}
                                      >
                                        Area
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`package_type_${Details["id"]}`}
                                        name={`package_type[${Details["id"]}]`}
                                        defaultValue={Details["package_type"]}
                                        placeholder="Package type"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`package_type_${Details["id"]}`}
                                      >
                                        Package type
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`shipping_bill_number_${Details["id"]}`}
                                        name={`shipping_bill_number[${Details["id"]}]`}
                                        defaultValue={
                                          Details["shipping_bill_number"]
                                        }
                                        placeholder="Shipping bill number"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`shipping_bill_number_${Details["id"]}`}
                                      >
                                        Shipping bill number
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="datetime-local"
                                        className="form-control"
                                        id={`shipping_bill_date_${Details["id"]}`}
                                        name={`shipping_bill_date[${Details["id"]}]`}
                                        defaultValue={formatToDateTimeLocal(
                                          Details["shipping_bill_date"]
                                        )}
                                        placeholder="Shipping bill date"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`shipping_bill_date_${Details["id"]}`}
                                      >
                                        Shipping bill date
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`package_weight_${Details["id"]}`}
                                        name={`package_weight[${Details["id"]}]`}
                                        defaultValue={Details["package_weight"]}
                                        placeholder="Package weight"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`package_weight_${Details["id"]}`}
                                      >
                                        Package weight
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`commodity_description_${Details["id"]}`}
                                        name={`commodity_description[${Details["id"]}]`}
                                        defaultValue={
                                          Details["commodity_description"]
                                        }
                                        placeholder="Commodity description"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`commodity_description_${Details["id"]}`}
                                      >
                                        Commodity description
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-md-6 col-sm-6 mb-2">
                                    <div className="form-floating form-floating-outline">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`package_code_${Details["id"]}`}
                                        name={`package_code[${Details["id"]}]`}
                                        defaultValue={Details["package_code"]}
                                        placeholder="Package code"
                                        readOnly={ReadOnly}
                                        disabled={DisAbled}
                                      />
                                      <label
                                        htmlFor={`package_code_${Details["id"]}`}
                                      >
                                        Package code
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
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
                  <div className="col-md-10 m-auto">
                    <div className="text-end">
                      <button
                        onClick={handlePrint}
                        className="btn btn-label-primary mb-2 print-button-tally"
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
                        src={`/TallySheetCartingReadFCL/${crnNumber}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "white",
                        }}
                        title="A4 Iframe"
                      ></iframe>
                    </div>


                    {/* <TallySheetCartingReadFCL Data={Data} /> */}
                  </div>
                )}

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
