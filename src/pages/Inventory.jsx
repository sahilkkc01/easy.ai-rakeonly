import React, { useState, useEffect } from "react";
import Footer from "./main/footer";
import Nav from "./main/nav";
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Inventory() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("Form");
  const [type, setType] = useState("Normal");
  const [location, setLocation] = useState(null);
  const [damage, setDamage] = useState("N");
  const [containerNo, setContainerNo] = useState(null);
  const [data, setData] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [selectStack, setSelectStack] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    let formEntries = Object.fromEntries(formData.entries());
    formEntries.created_by = user.id;
    formEntries.readable_status = type;

    console.log(formEntries);

    const url = `https://ctas.live/backend/api/yard/inventory/update`;

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
          // window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "info",
          text: `Please Check all Field .... ${response.data.message}`,
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

  const GetData = async () => {
    setLoading(true);
    const url = `https://ctas.live/backend/api/get/yard/inventory/data?container_no=${containerNo}`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        setData([]);
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
  const GetStackData = async () => {
    setLoading(true);
    const url = `https://ctas.live/backend/api/get/yard/stack/data`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data.data) {
        setStacks(response.data.data);
      } else {
        setStacks([]);
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

  useEffect(() => {
    if (containerNo && type === "Normal") {
      const ctrNoLnt = containerNo.length;
      if (ctrNoLnt > 3) {
        GetData();
      } else {
        setData([]);
      }
    }
  }, [containerNo, type]);

  useEffect(() => {
    if (type != "Normal") {
      const generateRandomContainerNo = () => {
        const numbers = String(Math.floor(1000000 + Math.random() * 9999999)); // ensures 8 digits

        return `DUMM` + numbers;
      };
      setContainerNo(generateRandomContainerNo());
    }
  }, [type]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const container = params.get("container_no");
    setContainerNo(container);
  }, []);

  useEffect(() => {
    if (location == "Stack") {
      GetStackData();
    }
  }, [location]);

  const [Photos, setPhotos] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [updatedData, setUpdatedData] = useState([]);

  const GetUpdatedData = async (page = 1) => {
    setLoading(true);
    const url = `https://ctas.live/backend/api/get/yard/inventory/updated/data`;
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data.data) {
        setUpdatedData(response.data.data);
      } else {
        setUpdatedData([]);
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

  useEffect(() => {
if(view!='Form'){
  GetUpdatedData();
}
  }, [view]);

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
                <div className="container">
                  {view == "Form" ? (
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                          <h4 className="text-primary">Inventory</h4>
                          <button
                            type="button"
                            onClick={() => setView("List")}
                            className="btn btn-sm btn-label-primary"
                          >
                            Inventory List
                          </button>
                        </div>
                        <form
                          action=""
                          onSubmit={handleFormSubmit}
                          encType="multipart/form-data"
                        >
                          <div className="row align-items-center">
                            <div className="col-md-12 d-flex gap-3 mb-5">
                              <button
                                type="button"
                                className={`btn ${
                                  type == "Normal"
                                    ? "btn-primary"
                                    : "btn-label-primary"
                                }`}
                                onClick={() => {
                                  setType("Normal");
                                  setContainerNo("");
                                }}
                              >
                                Normal
                              </button>
                              <button
                                type="button"
                                className={`btn ${
                                  type == "Unreadable"
                                    ? "btn-primary"
                                    : "btn-label-primary"
                                }`}
                                onClick={() => setType("Unreadable")}
                              >
                                {" "}
                                Unreadable
                              </button>
                            </div>
                            <div className="col-md-4 mb-4">
                              <div className="form-floating form-floating-outline">
                                <input
                                  readOnly={type == "Unreadable" ? true : false}
                                  className="form-control"
                                  type="text"
                                  placeholder="Container No"
                                  id="container_no"
                                  name="container_no"
                                  value={containerNo}
                                  onChange={(e) =>
                                    setContainerNo(e.target.value.toUpperCase())
                                  }
                                />
                                <label htmlFor="container_no">
                                  Container No
                                </label>
                              </div>
                              <div className="position-relative">
                                {data &&
                                  data?.length > 0 &&
                                  type == "Normal" && (
                                    <div className="card card-body p-2 mt-2">
                                      {data?.map((dd, i) => (
                                        <>
                                          <a
                                            href={`?container_no=${dd.container_no}`}
                                            onClick={() =>
                                              setContainerNo(dd.container_no)
                                            }
                                            className=""
                                          >
                                            {dd.container_no}
                                          </a>
                                        </>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            </div>
                            <div className="col-md-4 mb-4">
                              <div className="form-floating form-floating-outline">
                                <select
                                  name="type"
                                  id="type"
                                  className="form-select"
                                >
                                  <option value="EXIM">EXIM/Normal </option>
                                  <option value="DSOinEXIM">DSO IN EXIM</option>
                                  <option value="DOM">DOM</option>
                                </select>
                                <label htmlFor="type">Type</label>
                              </div>
                            </div>
                            <div className="col-md-4 mb-4 d-flex gap-2 align-items-center">
                              <label
                                htmlFor="container_image"
                                className="btn btn-sm btn-label-primary"
                              >
                                <input
                                  hidden
                                  className="form-control"
                                  type="file"
                                  id="container_image"
                                  name="container_image"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={(e) =>
                                    handleImageChange(e, "driverPhoto")
                                  }
                                />
                                <i className="ri-camera-fill"></i>
                                &nbsp;&nbsp;Container Image
                              </label>
                              {Photos && (
                                <div className="mt-2">
                                  <img
                                    src={Photos}
                                    alt="container"
                                    className="img-thumbnail rounded-3"
                                    style={{
                                      width: "200px",
                                      height: "200px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="col-md-4 mb-4">
                              <div className="form-floating form-floating-outline">
                                <select
                                  name="location"
                                  id="location"
                                  className="form-select"
                                  onChange={(e) => setLocation(e.target.value)}
                                >
                                  <option value="RSP">Railside(RSP)</option>
                                  <option value="Path">Path</option>
                                  <option value="Stack">Stack</option>
                                  <option value="Other">Other</option>
                                </select>
                                <label htmlFor="location">Location</label>
                              </div>
                            </div>
                            {location && location == "Stack" && (
                              <>
                                <div className="col-md-4 mb-4">
                                  <div className="form-floating form-floating-outline">
                                    <select
                                      name="stack"
                                      id="stack"
                                      className="form-select"
                                      value={selectStack}
                                      required
                                      onChange={(e) =>
                                        setSelectStack(e.target.value)
                                      }
                                    >
                                      <option value="">Select Stack</option>
                                      {stacks?.map((stack, i) => (
                                        <option value={stack.name}>
                                          {stack.name}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="stack">Stack</label>
                                  </div>
                                </div>

                                <div className="col-md-4 mb-4">
                                  <div className="form-floating form-floating-outline">
                                    <select
                                      className="form-select mt-2"
                                      id="row"
                                      name="row"
                                      required
                                    >
                                      <option value="" disabled>
                                        Select Row
                                      </option>
                                      {stacks
                                        ?.filter(
                                          (stack) => stack.name === selectStack
                                        )
                                        .flatMap((stack) =>
                                          Array.from(
                                            {
                                              length:
                                                stack.row_end -
                                                stack.row_start +
                                                1,
                                            },
                                            (_, i) => {
                                              const row = String(
                                                Number(stack.row_start) + i
                                              ).padStart(3, "0");
                                              return (
                                                <option key={row} value={row}>
                                                  {row}
                                                </option>
                                              );
                                            }
                                          )
                                        )}
                                    </select>

                                    <label htmlFor="row">Row</label>
                                  </div>
                                </div>
                                <div className="col-md-4 mb-4">
                                  <div className="form-floating form-floating-outline">
                                    <select
                                      className="form-select mt-2"
                                      id="col"
                                      name="col"
                                      required
                                    >
                                      <option value="" disabled>
                                        Select Col
                                      </option>
                                      {stacks
                                        ?.filter(
                                          (stack) => stack.name === selectStack
                                        )
                                        .flatMap((stack) =>
                                          Array.from(
                                            {
                                              length:
                                                stack.col_end -
                                                stack.col_start +
                                                1,
                                            },
                                            (_, i) => {
                                              const col = String(
                                                Number(stack.col_start) + i
                                              ).padStart(3, "0");
                                              return (
                                                <option key={col} value={col}>
                                                  {col}
                                                </option>
                                              );
                                            }
                                          )
                                        )}
                                    </select>

                                    <label htmlFor="col">Col</label>
                                  </div>
                                </div>

                                <div className="col-md-4 mb-4">
                                  <div className="form-floating form-floating-outline">
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="Tear"
                                      id="tear"
                                      name="tear"
                                      required
                                      maxLength={1}
                                      onChange={(e) => {
                                        const allowed = [
                                          "A",
                                          "B",
                                          "C",
                                          "D",
                                          "0",
                                        ];
                                        const value =
                                          e.target.value.toUpperCase();

                                        if (allowed.includes(value)) {
                                          e.target.value = value;
                                        } else {
                                          e.target.value = "";
                                        }
                                      }}
                                    />

                                    <label htmlFor="tear">Tear</label>
                                  </div>
                                </div>
                              </>
                            )}
                            {location && location == "Other" && (
                              <>
                                <div className="col-md-4 mb-4">
                                  <div className="form-floating form-floating-outline">
                                    <input
                                      name="stack"
                                      id="stack"
                                      type="text"
                                      className="form-control"
                                      placeholder="Stack"
                                      required
                                      onChange={(e) =>
                                        e.target.value.toUpperCase()
                                      }
                                    />
                                    <label htmlFor="stack">Stack</label>
                                  </div>
                                </div>

                                <div className="col-md-4 mb-4">
                                  <div className="form-floating form-floating-outline">
                                    <input
                                      id="row"
                                      name="row"
                                      type="text"
                                      className="form-control"
                                      placeholder="Row"
                                      maxLength={3}
                                      required
                                      onChange={(e) =>
                                        e.target.value.toUpperCase()
                                      }
                                    />
                                    <label htmlFor="row">Row</label>
                                  </div>
                                </div>
                                <div className="col-md-4 mb-4">
                                  <div className="form-floating form-floating-outline">
                                    <input
                                      type="text"
                                      id="col"
                                      name="col"
                                      className="form-control"
                                      placeholder="Col"
                                      minLength={3}
                                      required
                                      onChange={(e) =>
                                        e.target.value.toUpperCase()
                                      }
                                    />
                                    <label htmlFor="col">Col</label>
                                  </div>
                                </div>

                                <div className="col-md-4 mb-4">
                                  <div className="form-floating form-floating-outline">
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="Tear"
                                      id="tear"
                                      name="tear"
                                      maxLength={1}
                                      required
                                      onChange={(e) => {
                                        const allowed = [
                                          "A",
                                          "B",
                                          "C",
                                          "D",
                                          "0",
                                        ];
                                        const value =
                                          e.target.value.toUpperCase();

                                        if (allowed.includes(value)) {
                                          e.target.value = value;
                                        } else {
                                          e.target.value = "";
                                        }
                                      }}
                                    />

                                    <label htmlFor="tear">Tear</label>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="col-md-4 mb-4">
                              <div className="form-floating form-floating-outline">
                                <select
                                  name="damage"
                                  id="damage"
                                  className="form-select"
                                  onChange={(e) => setDamage(e.target.value)}
                                >
                                  <option value="N">No</option>
                                  <option value="Y">YES</option>
                                </select>
                                <label htmlFor="damage">Damage Status</label>
                              </div>
                            </div>
                            {damage && damage == "Y" && (
                              <div className="col-md-4 mb-4">
                                <div className="form-floating form-floating-outline">
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Damage Remark"
                                    id="damage_remark"
                                    name="damage_remark"
                                    onChange={(e) => {
                                      e.target.value =
                                        e.target.value.toUpperCase();
                                    }}
                                  />
                                  <label htmlFor="damage_remark">
                                    Damage Remark
                                  </label>
                                </div>
                              </div>
                            )}

                            <div className="col-lg-5 col-md-7 col-sm-10 m-auto my-3">
                              <button
                                className="btn btn-primary w-100"
                                type="submit"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                          <h4 className="text-primary">Inventory List</h4>
                          <button
                            type="button"
                            onClick={() => setView("Form")}
                            className="btn btn-sm btn-label-primary"
                          >
                            Go Back
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-striped table-sm">
                            <thead>
                              <tr>
                                <th>SN</th>
                                <th>Container No</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Damage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {updatedData?.data?.map((dd, i) => (
                                <tr>
                                  <td>{dd.rn}</td>
                                  <td>{dd.container_no}</td>
                                  <td>{dd.container_type}</td>
                                  <td>{dd.int_stack}</td>
                                  <td>{dd.damage}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
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
