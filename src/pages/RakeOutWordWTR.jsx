import React, { useState, useEffect } from "react";
import Footer from "./main/footer";
import Nav from "./main/nav";
import "../Pages.css";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "./main/header";
import Select from "react-select";
import { ApiBaseUrl } from "../Config";

export default function RakeOutWordWTR() {
  const user = JSON.parse(localStorage.getItem("user"));

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialRakeId = searchParams.get("rake_id");
  const [rakeId, setRakeId] = useState(initialRakeId);
  // const rakeId = searchParams.get("rake_id");

  useEffect(() => {
    if (initialRakeId) {
      setRakeId(initialRakeId);
    }
  }, [location.search]); // Update rakeId if URL changes

  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(null);

  const [Data, setData] = useState([]);
  const [wagons, setWagons] = useState([]);
  const [containers, setContainers] = useState([]);
  const [ModalWagon, setModalWagon] = useState([]);
  const [ModalRakeID, setModalRakeID] = useState(null);
  const [EditWagon, setEditWagon] = useState(false);
  const [EditWagonID, setEditWagonID] = useState(null);

  const [EditSNWagon, setEditSNWagon] = useState(false);
  const [EditSNWagonID, setEditSNWagonID] = useState(null);

  const [AssignedContainers, setAssignedContainers] = useState([]);

  useEffect(() => {
    GetData();
  }, [rakeId]);

  const GetData = async () => {
    setLoading(true);
    // const url = `https://ctas.live/backend/api/rake/outword/wtr/data`;
    let url;
    if (rakeId) {
      // url = `https://ctas.live/backend/api/rake/outword/wtr/data?id=${rakeId}`;
      url = `${ApiBaseUrl}/rake/outword/wtr/data?id=${rakeId}`;
    } else {
      // url = `https://ctas.live/backend/api/rake/outword/wtr/data`;
      url = `${ApiBaseUrl}/rake/outword/wtr/data`;
    }
    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data.data) {
        console.log(response.data.data);
        setData(response.data.data);
        setWagons(response.data.wagons);
        setContainers(response.data.containers);
      } else {
        setError(`Error in Data Fetch :  SomeThing Want Wrong.`);
      }
    } catch (error) {
      setError(`Error in Data Fetch :  ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, row) => {
    e.dataTransfer.setData("rowData", JSON.stringify(row));
  };

  const handleDrop = (e, targetRow) => {
    e.preventDefault();
    const draggedRow = JSON.parse(e.dataTransfer.getData("rowData"));
    const containerSize = parseInt(draggedRow.ctrsize); // Assuming ctrsize holds the size as string e.g., "20", "40"

    console.log(`draggedRow::`, draggedRow);
    console.log(`targetRow::`, targetRow);

    if (
      (targetRow.container_1 && targetRow.remainingSize != containerSize) ||
      targetRow.remainingSize === 0
    ) {
      Swal.fire({
        icon: "info",
        text: "This Wagon already has a Container assigned!",
        timer: 2500,
        showConfirmButton: false,
      });

      return;
    }

    setData((prevData) =>
      prevData.map((row) => ({
        ...row,
        wagons: row.wagons.map((wagon) => {
          if (wagon.id === targetRow.id) {
            const updatedSize =
              (wagon.remainingSize ? wagon.remainingSize : 40) - containerSize;

            return {
              ...wagon,
              container_1: wagon.container_1
                ? wagon.container_1
                : draggedRow.ctrno,
              container_2:
                wagon.container_1 && !wagon.container_2
                  ? draggedRow.ctrno
                  : wagon.container_2,
              gw_port: draggedRow.gwportcd,
              totalSize: wagon.totalSize
                ? wagon.totalSize + containerSize
                : 0 + containerSize,
              remainingSize: Math.max(0, updatedSize), // Ensure it doesn't go below 0
            };
          }
          return wagon;
        }),
        outword_cntr: row.outword_cntr.filter(
          (data) => data.ctrno !== draggedRow.ctrno
        ),
      }))
    );

    setAssignedContainers((prevAssigned) => [
      ...prevAssigned,
      { wagon_id: targetRow.id, container_no: draggedRow.id },
    ]);

    // // Remove the dragged container from the Data list
    // setData(Data.filter((data) => data.ctrno !== draggedRow.ctrno));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteWagon = async (id) => {
    setLoading(true);
    const payload = {
      wagon_id: id,
      rake_id: ModalRakeID,
    };
    // const url = `https://ctas.live/backend/api/rake/wtr/wagon/delete`;
    const url = `${ApiBaseUrl}/rake/wtr/wagon/delete`;
    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (
        response.data &&
        response.data.status &&
        response.data.status == "success"
      ) {
        console.log(response.data);
        setModalWagon(
          ModalWagon &&
            ModalWagon.filter((preValue) => {
              return preValue.id !== id;
            })
        );
      } else {
        setError(`Error Wagon Delete  :  SomeThing Want Wrong.`);
      }
    } catch (error) {
      setError(`Error in Wagon Delete :  ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const handleAddWagon = async (e) => {
    setLoading(true);
    e.preventDefault();
    // alert("yutyu");
    const formData = new FormData(e.target);
    let formValues = Object.fromEntries(formData.entries());

    // const url = `https://ctas.live/backend/api/rake/wtr/wagon/add`;
    const url = `${ApiBaseUrl}/rake/wtr/wagon/add`;
    try {
      const response = await axios.post(url, formValues, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data.status) {
        console.log(response.data);
        // setModalWagon(
        //   ModalWagon &&
        //     ModalWagon.filter((preValue) => {
        //       return preValue.id !== id;
        //     })
        // );
        GetData();
        // Modal.colse()
      } else {
        setError(`Error Wagon add  :  SomeThing Want Wrong.`);
      }
    } catch (error) {
      setError(`Error in Wagon add :  ${error.message}`);
    } finally {
      setLoading(false);
    }
    // setModalWagon(...ModalWagon, items);
  };

  const handleAssignData = async (container_id, wagon_id) => {
    setLoading(true);
    const formValues = {
      container_id: container_id,
      wagon_id: wagon_id,
    };

    // const url = `https://ctas.live/backend/api/rake/outword/wtr/wagon/assign`;
    const url = `${ApiBaseUrl}/rake/outword/wtr/wagon/assign`;
    try {
      const response = await axios.post(url, formValues, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data) {
        console.log(response.data);
        GetData();
      } else {
        setError(`Error Wagon Assign  :  SomeThing Want Wrong.`);
      }
    } catch (error) {
      setError(`Error in Wagon Assign :  ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReamoveData = async (container_id, wagon_id) => {
    setLoading(true);
    const formValues = {
      container_id: container_id,
      wagon_id: wagon_id,
    };

    // const url = `https://ctas.live/backend/api/rake/outword/wtr/wagon/remove`;
    const url = `${ApiBaseUrl}/rake/outword/wtr/wagon/remove`;
    try {
      const response = await axios.post(url, formValues, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data) {
        console.log(response.data);
        GetData();
      } else {
        setError(`Error Wagon Delete  :  SomeThing Want Wrong.`);
      }
    } catch (error) {
      setError(`Error in Wagon Delete :  ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWagonData = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    let formValues = Object.fromEntries(formData.entries());

    // const url = `https://ctas.live/backend/api/rake/wagon/create_update`;
    const url = `${ApiBaseUrl}/rake/wagon/create_update`;
    try {
      const response = await axios.post(url, formValues, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data) {
        console.log(response.data);

        setEditWagon(false);
        setEditWagonID(null);

        GetData();
      } else {
        setError(`Error Wagon Delete  :  SomeThing Want Wrong.`);
      }
    } catch (error) {
      setError(`Error in Wagon Delete :  ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateWagonSNData = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    let formValues = Object.fromEntries(formData.entries());

    // const url = `https://ctas.live/backend/api/rake/outword/wagon/s_no_update`;
    const url = `${ApiBaseUrl}/rake/outword/wagon/s_no_update`;
    try {
      const response = await axios.post(url, formValues, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data) {
        console.log(response.data);

        setEditSNWagon(false);
        setEditSNWagonID(null);

        GetData();
      } else {
        setError(`Error Wagon Delete  :  SomeThing Want Wrong.`);
      }
    } catch (error) {
      setError(`Error in Wagon Delete :  ${error.message}`);
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
                {rakeId ? (
                  <div className="">
                    <div className="text-end">
                      <a href="?" className="btn btn-info mb-2">Back</a>
                    </div>
                    <div className="row">
                      <div className="d-flex justify-content-between">
                        <h4 className="text-primary">Rake ID: {Data.id} </h4>
                        <div className="text-end">
                          <button
                            type="button"
                            className="btn btn-primary mb-3"
                            data-bs-toggle="modal"
                            data-bs-target="#editWagonNo"
                            onClick={() => {
                              setModalWagon(wagons);
                              setModalRakeID(Data.id);
                            }}
                          >
                            Wagon List
                          </button>
                        </div>
                      </div>
                      {/* <div className="col-4 mb-3">
                      <div className="card card-body px-2">
                        <div className="d-flex gap-3 align-items-center justify-content-between mb-2">
                          <h6 className="">Wagon List </h6>
                          
                        </div>
                        <div className="table-responsive">
                          <table className="table table-font table-striped table-hover">
                            <thead>
                              <tr className="table-primary">
                                <th>SN</th>
                                <th>Wagon No</th>
                                <th>Container No</th>
                                <th>Port</th>
                              </tr>
                            </thead>
                            <tbody>
                              {wagons &&
                                wagons.map((wagon, k) => (
                                  <tr key={k}>
                                    <td>{wagon.sq_no ? wagon.sq_no : k + 1}</td>
                                    <td>{wagon.wagon_no}</td>
                                    <td>
                                      {wagon.container &&
                                        wagon.container.map((container, i) => {
                                          return <p>{container.ctrno}</p>;
                                        })}
                                    </td>
                                    <td>
                                      {wagon.container &&
                                        wagon.container.map((container, i) => {
                                          return <p>{container.gwportcd}</p>;
                                        })}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div> */}

                      <div className="col-12 mb-3">
                        <div className="card card-body px-2">
                          <div className="d-flex gap-3 justify-content-between">
                            <h6>Container List</h6>
                            <div className="text-end">
                              {/* <button
                                  className="btn btn-sm btn-primary"
                                  onClick={handleAssignData}
                                >
                                  Submit WTR
                                </button> */}
                            </div>
                          </div>
                          <div className="table-responsive">
                            {/* <form action=""> */}
                            <table className="table table-striped table-font table-hover">
                              <thead>
                                <tr>
                                  <th>Container No</th>
                                  <th>Size</th>
                                  {/* <th>Port</th> */}
                                  <th>Seal No</th>
                                  {/* <th>SBill No</th> */}
                                  <th>Wagon</th>
                                </tr>
                              </thead>
                              <tbody>
                                {containers &&
                                  containers.map((container, q) => (
                                    <tr key={q}>
                                      <td>{container.ctrno}</td>
                                      <td>{container.ctrsize}</td>
                                      {/* <td>{container.gwportcd}</td> */}
                                      <td>{container.seal_1_no}</td>
                                      {/* <td>{container.sbillno}</td> */}
                                      <td>
                                        {container.r_wagon_id ? (
                                          <>
                                            {container.rake_wagon?.wagon_no}{" "}
                                            <button
                                              className="btn btn-sm btn-danger px-2 py-1 m-1"
                                              onClick={() =>
                                                handleReamoveData(
                                                  container.id,
                                                  container.rake_wagon?.id
                                                )
                                              }
                                            >
                                              <i className="ri-delete-bin-fill"></i>
                                            </button>
                                          </>
                                        ) : (
                                          // <form action=""  onSubmit={()=>handleAssignData}>
                                          //     <input type="hidden" name="container_id" defaultValue={container.id} />
                                          <WagonSelect
                                            containerSize={container.ctrsize}
                                            wagons={wagons}
                                            onSelect={(selectedWagonId) =>
                                              handleAssignData(
                                                container.id,
                                                selectedWagonId
                                              )
                                            }
                                          />
                                          //   <button type="submit" className="btn btn-info btn-sm px-2 py-1 m-1">save</button>
                                          // </form>
                                        )}
                                        {/* {container.r_wagon_id == null ? (
                                              <form action="" onSubmit={handleAssignData}>
                                                  <input type="hidden" name="container_id" defaultValue={container.id} />
                                                <select name="wagon_id" className="form-select p-1" id="select">
                                                  {wagons && wagons.map((wagon,i)=>(
                                                    !wagon.container[0] ? (
                                                      <option value={wagon.id}>{wagon.wagon_no}</option>
                                                    )  : ''
                                                  ))}
                                                </select>
                                                <button type="submit" className="btn btn-info btn-sm px-2 py-1 m-1">save</button>
                                                </form>
                                            )  : (
                                              <>
                                              {container.rake_wagon?.wagon_no}
                                              </>
                                            )} */}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                            {/* </form> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="row gy-4 align-items-center">
                    {Data &&
                      Data.map((data, i) => (
                        <div className="col-6">
                          <a href={`?rake_id=${data.id}`}>
                            <div className="card mb-4">
                              <div className="card-body">
                                <div className="table-responsive text-nowrap">
                                  <table className="table table-bordered table-hover table-striped">
                                    <thead>
                                      <tr className="table-primary">
                                        <td
                                          colSpan={2}
                                          className="fs-3 text-center"
                                        >
                                          Train NO : {data.train_no}
                                        </td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <span>Rake ID</span>
                                        </td>
                                        <td>
                                          <span>{data.id}</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <span>Track</span>
                                        </td>
                                        <td>
                                          <span>{data.track}</span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      ))}
                  </div>
                )}

                <div
                  className="modal fade"
                  id="editWagonNo"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header bg-label-primary py-3">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Wagon List
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          <div className="table-responsive">
                            <div className="text-end mb-2">
                              <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#AddWagonNo"
                              >
                                Add Wagon
                              </button>
                            </div>

                            <table className="table table-striped table-hover">
                              <thead>
                                <tr className="table-primary">
                                  <th>SN</th>
                                  <th>Wagon No</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {wagons &&
                                  wagons.map((wagon, k) => (
                                    <tr key={k}>
                                      <td>
                                        {EditSNWagon &&
                                        EditSNWagonID == wagon.id ? (
                                          <form
                                            action=""
                                            onSubmit={handleUpdateWagonSNData}
                                          >
                                            <input
                                              type="hidden"
                                              className="form-control p-1"
                                              name="id"
                                              defaultValue={wagon.id}
                                            />
                                            <input
                                              type="hidden"
                                              className="form-control p-1"
                                              name="train_no"
                                              defaultValue={wagon.train_no}
                                            />

                                            <input
                                              type="text"
                                              className="form-control p-1"
                                              name="sq_no"
                                              style={{ width: "4rem" }}
                                              defaultValue={wagon?.sq_no}
                                            />

                                            <button
                                              className="btn btn-sm btn-label-primary"
                                              type="submit"
                                            >
                                              <i className="ri-verified-badge-fill"></i>
                                            </button>
                                          </form>
                                        ) : (
                                          <>
                                            {wagon?.sq_no}
                                            <button
                                              className="btn btn-sm btn-label-primary px-2 py-1 m-1"
                                              onClick={() => {
                                                setEditSNWagon(true);
                                                setEditSNWagonID(wagon.id);
                                              }}
                                            >
                                              <i class="ri-edit-circle-fill"></i>
                                            </button>
                                          </>
                                        )}
                                      </td>
                                      <td>
                                        {EditWagon &&
                                        EditWagonID == wagon.id ? (
                                          <form
                                            action=""
                                            onSubmit={handleUpdateWagonData}
                                          >
                                            <input
                                              type="hidden"
                                              className="form-control p-1"
                                              name="id"
                                              defaultValue={wagon.id}
                                            />
                                            <input
                                              type="hidden"
                                              className="form-control p-1"
                                              name="train_no"
                                              defaultValue={wagon.train_no}
                                            />
                                            <input
                                              type="text"
                                              name="wagon_no"
                                              className="form-control p-1"
                                              defaultValue={wagon.wagon_no}
                                            />

                                            <button
                                              className="btn btn-sm btn-label-info"
                                              type="submit"
                                            >
                                              <i className="ri-verified-badge-fill"></i>
                                            </button>
                                          </form>
                                        ) : (
                                          <>
                                            {wagon.wagon_no}
                                            <button
                                              className="btn btn-sm btn-label-info px-2 py-1 m-1"
                                              onClick={() => {
                                                setEditWagon(true);
                                                setEditWagonID(wagon.id);
                                              }}
                                            >
                                              <i class="ri-edit-circle-fill"></i>
                                            </button>
                                          </>
                                        )}
                                      </td>
                                      <td>
                                        <button
                                          className="btn btn-sm btn-label-danger"
                                          onClick={() =>
                                            handleDeleteWagon(wagon.id)
                                          }
                                        >
                                          <i className="ri-delete-bin-fill"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer py-3">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="modal fade"
                  id="AddWagonNo"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <form action="" onSubmit={handleAddWagon}>
                        <div className="modal-header bg-label-primary py-3">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Add Wagon
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div className="modal-body">
                          <div className="row">
                            <input
                              type="hidden"
                              name="rake_id"
                              id="rake_id"
                              defaultValue={ModalRakeID}
                            />
                            <input
                              type="hidden"
                              name="create_by"
                              id="create_by"
                              defaultValue={user.id}
                            />

                            <div className="form-floating form-floating-outline mb-6">
                              <input
                                className="form-control"
                                type="text"
                                placeholder="Wagon No"
                                required
                                name="wagon_no"
                                id="wagon_no"
                              />
                              <label htmlFor="wagon_no">Wagon No</label>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer py-3">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary btn-sm"
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
      </div>
    </>
  );
}

const WagonSelect = ({ wagons, onSelect, containerSize }) => {
  const availableWagons = wagons
    .filter(
      (wagon) =>
        !wagon.container[0] ||
        (wagon.container[0].ctrsize == 20 &&
          !wagon.container[1] &&
          containerSize == 20)
    )
    .map((wagon) => ({
      value: wagon.id,
      label: wagon.wagon_no,
    }));

  return (
    <Select
      options={availableWagons}
      onChange={(selectedOption) => onSelect(selectedOption.value)}
      placeholder="Search & Select Wagon"
      isSearchable={true}
    />
  );
};
