import React, { useState, useEffect } from "react";
import Footer from "./main/footer";
import Nav from "./main/nav";
import "../Pages.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "./main/header";
import { ApiBaseUrl } from "../Config";

export default function RakeOutWordData() {
  const { type } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const portNo = searchParams.get("port_no");
  const navigate = useNavigate();

  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(null);
  const [Data, setData] = useState([]);
  const [VerifyData, setVerifyData] = useState([]);
  const [FinalizeData, setFinalizeData] = useState([]);
  const [Step, setStep] = useState(1);
  const [ButtonStatus, setButtonStatus] = useState(true);

  const [NewPendencyModalOpen, setNewPendencyModalOpen] = useState(false);
  const [NewPendencyStep, setNewPendencyStep] = useState(1);
  const [NewPendencyType, setNewPendencyType] = useState(null);
  const handleOnClick = (T) => {
    setNewPendencyType(T);
    setNewPendencyStep(2);
  };

  const handleNewPendencyFormSubmit = async (e) => {
    e.preventDefault();
    const NewPendencyPort = e.target.port_no.value;
    console.log(NewPendencyPort);
    console.log(NewPendencyType);
    // console.log(e);
    GetDataNewPendency(NewPendencyPort, NewPendencyType);
  };

  const GetDataNewPendency = async (NewPendencyPort, NewPendencyType) => {
    setLoading(true);
    // const url = `https://ctas.live/backend/api/get/RakeOutWord?port_no=${NewPendencyPort}&type=${NewPendencyType}`;
    const url = `${ApiBaseUrl}/get/RakeOutWord?port_no=${NewPendencyPort}&type=${NewPendencyType}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("model1");
      if (response.data && response.data.data) {
        const Body = response.data.data;
        if (
          Body["env:Body"] &&
          Body["env:Body"]["PendencyWrite"]["tns:PendencyWriteOutputColl"]
        ) {
          const newData =
            Body?.["env:Body"]?.["PendencyWrite"]?.[
            "tns:PendencyWriteOutputColl"
            ] || [];
          setData((prevData) => [...prevData, ...newData]);
          setNewPendencyModalOpen(false)
        }
      } else {
        Swal.fire({
          icon: "info",
          text: `Error in Data Fetch :  SomeThing Want Wrong.`,
          timer: 2000,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error in Data Fetch :  ${error.message}`,
        timer: 2000,
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    }
  };

  useEffect(() => {
    GetData();
  }, []);

  const GetData = async () => {
    setLoading(true);
    // const url = `https://ctas.live/backend/api/get/RakeOutWord?port_no=${portNo}&type=${type}`;
    const url = `${ApiBaseUrl}/get/RakeOutWord?port_no=${portNo}&type=${type}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data.data) {
        const Body = response.data.data;
        if (
          Body["env:Body"] &&
          Body["env:Body"]["PendencyWrite"]["tns:PendencyWriteOutputColl"]
        ) {
          setData(
            Body["env:Body"]["PendencyWrite"]["tns:PendencyWriteOutputColl"]
          );
        }
      } else {
        Swal.fire({
          icon: "info",
          text: `Error in Data Fetch :  SomeThing Want Wrong.`,
          timer: 3000,
        }).than(() => {
          navigate("/RakeOutWord");
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error in Data Fetch :  ${error.message}`,
        timer: 3000,
      }).then(() => {
        navigate("/RakeOutWord");
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3500);
    }
  };

  const handleRemove = (id) => {
    const item = VerifyData.find((data) => data["ctrNo"] === id);
    // Add `tns:` back to the keys for the item being moved to Data
    const transformedItem = Object.keys(item).reduce((acc, key) => {
      const newKey = key.startsWith("tns:") ? key : `tns:${key}`;
      acc[newKey] = item[key];
      return acc;
    }, {});

    delete transformedItem["type"];

    setData([...Data, transformedItem]);
    setVerifyData(VerifyData.filter((data) => data["ctrNo"] !== id));
  };

  const handleVerify = (id) => {
    if (id === "All") {
      // Approve all items
      const transformedItems = Data.map((item) => {
        const transformedItem = Object.keys(item).reduce((acc, key) => {
          const newKey = key.startsWith("tns:") ? key.replace("tns:", "") : key;
          acc[newKey] = item[key];
          return acc;
        }, {});

        transformedItem["type"] = type; // Add the type to all items
        return transformedItem;
      });

      // Update state with all approved items
      setVerifyData([...VerifyData, ...transformedItems]);
      setData([]); // Clear all items from Data
    } else {
      const item = Data.find((data) => data["tns:ctrNo"] === id);
      // Remove `tns:` from the keys for the item being moved to VerifyData
      const transformedItem = Object.keys(item).reduce((acc, key) => {
        const newKey = key.startsWith("tns:") ? key.replace("tns:", "") : key;
        acc[newKey] = item[key];
        return acc;
      }, {});

      transformedItem["type"] = type;

      setVerifyData([...VerifyData, transformedItem]);
      setData(Data.filter((data) => data["tns:ctrNo"] !== id));
    }
  };

  const handleSubmitData = async () => {
    setLoading(true);
    // const url = `https://ctas.live/backend/api/rake/outword/post`;
    const url = `${ApiBaseUrl}/rake/outword/post`;
    try {
      const response = await axios.post(
        url,
        { data: VerifyData },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setButtonStatus(false);
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
                <div className="">
                  {Step === 1 ? (
                    <div className="row">
                      <div className="col-4 mb-3">
                        <div className="card card-body px-2">
                          <div className="row justify-content-between">
                            <h6 className="col">Approved Data</h6>
                            <div className="col text-end">
                              <button
                                // onClick={handleSubmitData}
                                onClick={() => setStep(2)}
                                className="btn btn-label-primary btn-sm mb-2"
                              >
                                Finalize
                              </button>
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table table-font-sm table-striped table-hover">
                              <thead>
                                <tr className="table-primary text-nowrap">
                                  <th>Container</th>
                                  <th>Port</th>
                                  <th>Approval</th>
                                </tr>
                              </thead>
                              <tbody>
                                {VerifyData &&
                                  VerifyData.map((item, k) => (
                                    <tr key={k}>
                                      <td>{item["ctrNo"]}</td>
                                      <td>{item["gwPortCd"]}</td>
                                      <td>
                                        <button
                                          onClick={() =>
                                            handleRemove(item["ctrNo"])
                                          }
                                          className="btn btn-label-danger btn-sm px-2 py-1"
                                        >
                                          Remove
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className="col-8 mb-3">
                        <div className="card card-body px-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6>Data</h6>
                            <div className="">
                              <button
                                className="btn btn-sm btn-primary mb-2"
                                onClick={() => setNewPendencyModalOpen(true)}
                              >
                                Add Pendency
                              </button>

                              {NewPendencyModalOpen && (
                                <div
                                  className="modal fade show d-block"
                                  id="addPendency"
                                  tabIndex={-1}
                                >
                                  <div className="modal-dialog">
                                    <div className="modal-content">
                                      <div className="modal-header bg-label-primary py-3">
                                        <h1
                                          className="modal-title fs-5"
                                          id="exampleModalLabel"
                                        >
                                          Add Pendency
                                        </h1>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() =>
                                            setNewPendencyModalOpen(false)
                                          }
                                        />
                                      </div>
                                      <div className="modal-body">
                                        <div className="p-3">
                                          {NewPendencyStep === 1 ? (
                                            <div className="row">
                                              <div
                                                className="col-6 mb-4"
                                                onClick={() =>
                                                  handleOnClick("express")
                                                }
                                              >
                                                <div className="card p-5 div-card-hover">
                                                  <div className="app-brand justify-content-center mt-5 d-block">
                                                    <h5 className="text-center">
                                                      Express
                                                    </h5>
                                                    <p className="text-center">
                                                      Select Express
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                className="col-6 mb-4"
                                                onClick={() =>
                                                  handleOnClick("block")
                                                }
                                              >
                                                <div className="card p-5 div-card-hover">
                                                  <div className="app-brand justify-content-center mt-5 d-block">
                                                    <h5 className="text-center">
                                                      Block
                                                    </h5>
                                                    <p className="text-center">
                                                      Select Block
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                className="col-6 mb-4"
                                                onClick={() =>
                                                  handleOnClick("normal")
                                                }
                                              >
                                                <div className="card p-5 div-card-hover">
                                                  <div className="app-brand justify-content-center mt-5 d-block">
                                                    <h5 className="text-center">
                                                      Normal
                                                    </h5>
                                                    <p className="text-center">
                                                      Select Normal
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                className="col-6 mb-4"
                                                onClick={() =>
                                                  handleOnClick("empty")
                                                }
                                              >
                                                <div className="card p-5 div-card-hover">
                                                  <div className="app-brand justify-content-center mt-5 d-block">
                                                    <h5 className="text-center">
                                                      Empty
                                                    </h5>
                                                    <p className="text-center">
                                                      Select Empty
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <>
                                              <div className="authentication-inner py-6 mx-4">
                                                <div className="card p-7">
                                                  <div className="app-brand justify-content-center mt-5">
                                                    <h3 className="text-capitalize">
                                                      {NewPendencyType}
                                                    </h3>
                                                  </div>
                                                  <div className="card-body">
                                                    <p className="mb-5">
                                                      Please Enter Port Number
                                                      to Fetch Data
                                                    </p>
                                                    <form
                                                      id="formAuthentication"
                                                      className="mb-5 fv-plugins-bootstrap5 fv-plugins-framework"
                                                      onSubmit={
                                                        handleNewPendencyFormSubmit
                                                      }
                                                    >
                                                      <div className="form-floating form-floating-outline mb-5 fv-plugins-icon-container">
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                          id="port_no"
                                                          name="port_no"
                                                          placeholder="Port Number"
                                                          required
                                                        />
                                                        <label htmlFor="email">
                                                          Port Number
                                                        </label>
                                                        <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback" />
                                                      </div>
                                                      <div className="mb-5">
                                                        <button
                                                          className="btn btn-primary d-grid w-100 waves-effect waves-light"
                                                          type="submit"
                                                        >
                                                          Fetch Data
                                                        </button>
                                                      </div>
                                                    </form>
                                                    <button
                                                      className="btn btn-danger"
                                                      onClick={() =>
                                                        setNewPendencyStep(1)
                                                      }
                                                    >
                                                      Go Back
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <div className="modal-footer bg-label-primary py-2">
                                        <button
                                          type="button"
                                          className="btn btn-secondary btn-sm"
                                          onClick={() =>
                                            setNewPendencyModalOpen(false)
                                          }
                                        >
                                          Close
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-sm"
                                        >
                                          Save changes
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table table-striped table-font-sm table-hover">
                              <thead>
                                <tr className="text-nowrap">
                                  <th>Container</th>
                                  <th>Size</th>
                                  <th>Port</th>
                                  <th>Seal</th>
                                  <th>SBill No</th>
                                  <th>Approval</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Data && Data.length > 0 && (
                                  <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                      <button
                                        onClick={() => handleVerify("All")}
                                        className="btn btn-label-primary btn-sm px-2 py-1 text-nowrap"
                                      >
                                        All Approve
                                      </button>
                                    </td>
                                  </tr>
                                )}
                                {Data &&
                                  Data.map((item, i) => (
                                    <tr key={i}>
                                      <td>{item["tns:ctrNo"]}</td>
                                      <td>{item["tns:ctrSize"]}</td>
                                      <td>{item["tns:gwPortCd"]}</td>
                                      <td>{item["tns:sealNo"]}</td>
                                      <td>{item["tns:sbillNo"]}</td>
                                      <td>
                                        <button
                                          onClick={() =>
                                            handleVerify(item["tns:ctrNo"])
                                          }
                                          className="btn btn-label-primary btn-sm px-2 py-1"
                                        >
                                          Approve
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-12 mb-3">
                        <div className="card card-body px-2">
                          <div className="row justify-content-between">
                            <h6 className="col">Finalize Data</h6>
                            <div className="col text-end">
                              {ButtonStatus && (
                                <>
                                  <button
                                    className="btn btn-label-info btn-sm mb-2 mx-1"
                                    onClick={() => setStep(1)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-label-primary btn-sm mb-2 mx-1"
                                    onClick={handleSubmitData}
                                  >
                                    Save Finalize Data
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table table-striped table-hover">
                              <thead>
                                <tr className="table-primary">
                                  <th>Container</th>
                                  <th>Size</th>
                                  <th>Port</th>
                                  <th>Seal</th>
                                  <th>SBill No</th>
                                </tr>
                              </thead>
                              <tbody>
                                {VerifyData &&
                                  VerifyData.map((item, q) => (
                                    <tr key={q}>
                                      <td>{item["ctrNo"]}</td>
                                      <td>{item["ctrSize"]}</td>
                                      <td>{item["gwPortCd"]}</td>
                                      <td>{item["sealNo"]}</td>
                                      <td>{item["sbillNo"]}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 text-center mt-3">
                        {!ButtonStatus && (
                          <Link
                            to={`/RakeOutWordWTR?type=${type}&&port_no=${portNo}`}
                            className="btn btn-label-primary"
                          >
                            GO WTR
                          </Link>
                        )}
                      </div>
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
