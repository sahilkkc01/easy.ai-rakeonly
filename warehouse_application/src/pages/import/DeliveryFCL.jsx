import React, { useState, useEffect, useRef } from 'react'
import Header from '../main/header'
import Nav from '../main/nav'
import { Link } from 'react-router-dom'
import Footer from '../main/footer'
import { Modal } from 'bootstrap';
import { useNavigate } from 'react-router-dom';

export default function DeliveryFCL() {
    const [containerNo, setContainerNo] = useState('');
    const [truckNo, setTruckNo] = useState('');
    const [sBillNumbers] = useState(['S123', 'S456', 'S789']);
    const [selectedSBill, setSelectedSBill] = useState('');
    const [selectedBills, setSelectedBills] = useState([]);

    const containerModalRef = useRef(null);
    const truckModalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get modal elements from the DOM
        const containerModalEl = document.getElementById('containerModal');
        const truckModalEl = document.getElementById('truckModal');

        // Initialize the Bootstrap modal instances if the elements exist
        if (containerModalEl) {
            containerModalRef.current = new Modal(containerModalEl);
        }
        if (truckModalEl) {
            truckModalRef.current = new Modal(truckModalEl);
        }
    }, []);

    // Open the Container Modal
    const openContainerModal = () => {
        if (containerModalRef.current) {
            containerModalRef.current.show();
        } else {
            console.error('Container modal instance is not available.');
        }
    };

    // Hide Container Modal and show Truck Modal
    const openTruckModal = () => {
        if (containerModalRef.current && truckModalRef.current) {
            containerModalRef.current.hide();
            truckModalRef.current.show();
        } else {
            console.error('One of the modal instances is not available.');
        }
    };

    // Toggle selection of bill numbers
    const toggleSelect = (bill) => {
        setSelectedBills((prev) =>
            prev.includes(bill) ? prev.filter((b) => b !== bill) : [...prev, bill]
        );
    };


    return (
        <> <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <Header />
                <div className="layout-page">
                    <Nav />
                    <div className="content-wrapper">
                        <div className="container-xxl flex-grow-1 container-p-y">
                            <div className="card card-body">
                                {/* Breadcrumb */}
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="/">Import</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Delivery FCL
                                        </li>
                                    </ol>
                                </nav>

                                {/* Create New Button */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="fw-bold text-primary"> Delivery FCL</h4>
                                    <button className="btn btn-success" onClick={openContainerModal}>+ Create Job</button>
                                </div>

                                {/* Tabs */}

                                {/* Data Table */}

                                <div className="table-responsive">
                                    <table className="table table-striped table-font table-hover">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>#</th>
                                                <th>Truck No</th>
                                                <th>CRN</th>
                                                <th>Created On</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>PB65BD0271</td>
                                                <td>F240925032</td>
                                                <td>25/09/24 <sub>13:56</sub></td>

                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>PB65BD0271</td>
                                                <td>F240925032</td>
                                                <td>25/09/24 <sub>13:56</sub></td>

                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>PB65BD0271</td>
                                                <td>F240925032</td>
                                                <td>25/09/24 <sub>13:56</sub></td>

                                            </tr>

                                        </tbody>
                                    </table>
                                </div>


                                {/* Container Modal */}
                                <div className="modal fade" id="containerModal" tabIndex="-1" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header bg-label-primary p-4">
                                                <h5 className="modal-title">Delivery FCL</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                                            </div>
                                            <div className="modal-body">
                                                <p>Please Enter Gpm Number to Fetch Data</p>
                                                <div className="form-floating form-floating-outline mb-6">
                                                    <input
                                                        type="text"
                                                        className="form-control mb-3"
                                                        placeholder="Enter Gpm Number"
                                                        value={containerNo}
                                                        onChange={(e) => setContainerNo(e.target.value)}
                                                    />
                                                    <label htmlFor="Gpm_Number">Gpm Number</label>
                                                </div>
                                                <button className="btn btn-primary w-100" onClick={openTruckModal}>
                                                    Fetch Data
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Truck Modal */}
                                <div className="modal fade" id="truckModal" tabIndex="-1" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header bg-label-primary p-4">
                                                <h5 className="modal-title">Enter Truck Details</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="form-floating form-floating-outline mb-6">
                                                    <input
                                                        type="text"
                                                        className="form-control mb-3"
                                                        placeholder="Enter Truck Number"
                                                        value={truckNo}
                                                        onChange={(e) => setTruckNo(e.target.value)}
                                                    />
                                                    <label htmlFor="Truck_Number"> Truck Number</label>
                                                </div>
                                                <p className="fw-bold">S Bill Numbers:</p>
                                                <div className="d-flex flex-wrap gap-3 justify-content-center">
                                                    {sBillNumbers.map((bill, index) => (
                                                        <div
                                                            key={index}
                                                            className={`card p-2 mb-2 position-relative ${selectedBills.includes(bill) ? 'selected-card' : ''}`}
                                                            onClick={() => toggleSelect(bill)}
                                                            style={{ cursor: 'pointer', width: '200px' }}
                                                        >
                                                            <div>
                                                                <p>Sbill No.</p>
                                                                <p>7131358</p>
                                                            </div>
                                                            <span className="bill-text">{bill}</span>
                                                            {selectedBills.includes(bill) && (
                                                                <i className="fa fa-check-circle text-primary fs-3 selected-icon" aria-hidden="true"></i>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>



                                                <button className="btn btn-primary w-100 mt-3">Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>





                            </div>


                            <Footer />
                            <div className="content-backdrop fade" />
                        </div >
                    </div >
                </div >
                <div className="layout-overlay layout-menu-toggle"></div>
                <div className="drag-target"></div>
            </div >
        </div >

        </>
    )
}
