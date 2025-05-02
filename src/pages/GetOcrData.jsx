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
import EIRMain from "./EIRMain";
import { useReactToPrint } from "react-to-print";
export default function YardRowData() {

    const [loading, setLoading] = useState(false);
    const [Data, setData] = useState([]);
    const [VehicleNo, setVehicleNo] = useState(null);
    const [ContainerNo, setContainerNo] = useState(null);
    const [Start, setStart] = useState(null);
    const [End, setEnd] = useState(null);
    const [modalData, setModalData] = useState(null);

    const GetData = async () => {
        setLoading(true);
        let url;
        url = `https://ctas.live/backend/api/gate/ocr/data?`;

        if (ContainerNo) {
            url += '&container_no=' + ContainerNo;
        }
        if (Start) {
            url += '&start=' + Start;
        }
        if (End) {
            url += '&end=' + End;
        }
        if (VehicleNo) {
            url += '&vehicle_no=' + VehicleNo;
        }

        try {
            const response = await axios.get(url, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data && response.data.data) {
                setData(response.data.data);
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
        GetData();
    }, []);


    return (
        <>


            <div className="container">
                <div className="card mt-3">
                    <div className="card-body">
                    <h3 className="text-primary">Get Ocr Data</h3>
                <div className="row">
                    <div className="col-md-3">
                        <label htmlFor="">Vehicle No</label>
                        <input type="text" className="form-control" name="vehicle_no" placeholder="Vehicle No" onChange={(e) => setVehicleNo(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="">Contianer No</label>
                        <input type="text" className="form-control" name="container_no" placeholder="Container No" onChange={(e) => setContainerNo(e.target.value)} />
                    </div>


                    <div className="col-md-3">
                        <label htmlFor="">Start</label>
                        <input type="datetime-local" className="form-control" name="start" onChange={(e) => setStart(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="">End</label>
                        <input type="datetime-local" className="form-control" name="end" onChange={(e) => setEnd(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-info mt-5" onClick={() => GetData()}>Submit</button>
                    </div>
                </div>
                    </div>
                </div>
               

                <div className="card my-3">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-font table-sm">
                                <thead className="">
                                    <tr className="text-nowrap">
                                        <th>SN</th>
                                        <th>type</th>
                                        <th>lane_no</th>
                                        <th>vehicle_no</th>
                                        <th>container_no</th>
                                        <th>iso_code</th>
                                        <th>created_at</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {Data.length > 0 ? (
                                        Data.map((item, index) => (
                                            <tr key={index} data-bs-toggle="modal"
                                                data-bs-target="#exampleModal"
                                                onClick={()=>setModalData(item)}
                                                >
                                                <td>{index + 1}</td>
                                                <td>{item.type}</td>
                                                <td>{item.lane_no}</td>
                                                <td>{item.vehicle_no}</td>
                                                <td>{item.container_no}</td>
                                                <td>{item.iso_code}</td>
                                                <td>{item.created_at}</td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="text-center">No Data Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <>
                <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header bg-label-primary py-3">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">
                                  Image View
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
                                    <div className="col">
                                        <img src={`https://ctas.live/ocr_backend/gate_ocr_img/`+modalData?.vehicle_no_img} className="w-100" alt="vehicle_no_img" />
                                    </div>
                                    <div className="col">
                                        <img src={`https://ctas.live/ocr_backend/gate_ocr_img/`+modalData?.container_no_img} className="w-100" alt="container_no_img" />
                                    </div>
                                    <div className="col">
                                        <img src={`https://ctas.live/ocr_backend/gate_ocr_img/`+modalData?.container_img_front} className="w-100" alt="container_img_front" />
                                    </div>
                                    <div className="col">
                                        <img src={`https://ctas.live/ocr_backend/gate_ocr_img/`+modalData?.container_img_left} className="w-100" alt="container_img_left" />
                                    </div>
                                    <div className="col">
                                        <img src={`https://ctas.live/ocr_backend/gate_ocr_img/`+modalData?.container_img_right} className="w-100" alt="container_img_right" />
                                    </div>
                                    <div className="col">
                                        <img src={`https://ctas.live/ocr_backend/gate_ocr_img/`+modalData?.container_img_top} className="w-100" alt="container_img_top" />
                                    </div>
                                    <div className="col">
                                        <img src={`https://ctas.live/ocr_backend/gate_ocr_img/`+modalData?.container_img_back} className="w-100" alt="container_img_back" />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer  bg-label-primary py-3">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        </>
    );
}
