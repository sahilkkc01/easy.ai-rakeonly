import React, { useState, useEffect, useRef } from 'react'
import Header from '../main/header'
import Nav from '../main/nav'
import { Link } from 'react-router-dom'
import Footer from '../main/footer'
import { Modal } from 'bootstrap';
import { useNavigate } from 'react-router-dom';

export default function DestuffingBill() {
    const [gridInputs, setGridInputs] = useState([{ id: 1, location: "", area: "" }]);

    const addGridInput = () => {
        setGridInputs([...gridInputs, { id: gridInputs.length + 1, location: "", area: "" }]);
    };

    const removeGridInput = (id) => {
        setGridInputs(gridInputs.filter(input => input.id !== id));
    };

    const handleInputChange = (id, field, value) => {
        setGridInputs(gridInputs.map(input =>
            input.id === id ? { ...input, [field]: value } : input
        ));
    };

    return (
        <> <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <Header />
                <div className="layout-page">
                    <Nav />
                    <div className="content-wrapper">
                        <div className="container-xxl flex-grow-1 container-p-y">
                            <h4 className="text-primary mb-3">Bill Details</h4>
                            <div className="card card-body p-4">
                                {/* Truck Modal */}


                                <div className="row">
                                    {/* Bill No Selection */}
                                    <div className="col-2 mb-3">
                                        <label htmlFor="billNo" className="form-label">Select Bill Number</label>
                                        <select className="form-select p-2" id="billNo">
                                            <option value="">Select Bill No</option>
                                            <option value="7131358">7131358</option>
                                        </select>
                                    </div>


                                    {/* Cargo Description */}
                                    <div className="col-3 mb-3">
                                        <label htmlFor="cargoDesc" className="form-label">Cargo Description (Code)</label>
                                        <input type="text" className="form-control p-2" placeholder="Cargo Description (Code)" />
                                    </div>

                                    {/* No of Pkgs */}
                                    <div className="col-2 mb-3">
                                        <label htmlFor="noOfPkgs" className="form-label">No of Pkgs</label>
                                        <input type="number" className="form-control p-2" placeholder="No of Pkgs" />
                                    </div>

                                    {/* Pkg Weight */}
                                    <div className="col-2 mb-3">
                                        <label htmlFor="pkgWeight" className="form-label">Pkg Weight</label>
                                        <input type="text" className="form-control p-2" placeholder="Pkg Weight" />
                                    </div>

                                    {/* Dynamic Grid Location and Area (SQM) Inputs */}
                                    <div className="col-3 mb-3">
                                        <label className="form-label">Grid Location & Area (SQM)</label>
                                        {gridInputs.map((input, index) => (
                                            <div key={input.id} className="d-flex align-items-center gap-4 mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control p-2"
                                                    placeholder="Grid Location"
                                                    value={input.location}
                                                    onChange={(e) => handleInputChange(input.id, "location", e.target.value)}
                                                />
                                                &nbsp;
                                                <input
                                                    type="text"
                                                    className="form-control p-2"
                                                    placeholder="Area (SQM)"
                                                    value={input.area}
                                                    onChange={(e) => handleInputChange(input.id, "area", e.target.value)}
                                                />
                                                &nbsp;
                                                <button className="btn btn-success btn-sm px-2 py-1" onClick={addGridInput}>+</button>
                                                {/* {gridInputs.length > 1 && (
                                                    <button className="btn btn-danger btn-sm px-2 py-1  " onClick={() => removeGridInput(input.id)}>-</button>
                                                )} */}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                            </div>
                            <button className="btn btn-primary w-20 mt-3">Submit</button>
                        </div>
                    </div>
                </div>





            </div>


            <Footer />
            <div className="content-backdrop fade" />
        </div >


            <div className="layout-overlay layout-menu-toggle"></div>
            <div className="drag-target"></div>


        </>
    )
}
