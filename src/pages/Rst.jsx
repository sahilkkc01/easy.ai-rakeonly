import Nav from './main/nav';
import Header from './main/header';
import Footer from './main/footer';
import ReactDOM from 'react-dom/client';
import React, { useEffect, useRef, useState } from 'react';

function Rst() {
    const [type, setType] = useState("Grid");
    const cardData = [
        { id: 1, cardColor: "#8c57ff" },
        { id: 2, cardColor: "#007bff" },
        { id: 3, cardColor: "#ffc107" }
    ];

    // Inline style functions that return style objects based on the card color
    const cardWrapStyle = (color) => ({
        borderBottom: `5px solid ${color}`
    });

    const cardHeaderStyle = (color) => ({
        backgroundColor: color
    });



    const [rows, setRows] = useState([
        { id: 1, containerNo: "MSMU4692602", size: "40", source: "HR38X7238", destination: "023/077D" },
        { id: 2, containerNo: "MSMU4692602", size: "20", source: "HR38X7238", destination: "023/077D" },
        { id: 3, containerNo: "MSMU4692602", size: "20", source: "HR38X7238", destination: "023/077D" },
        { id: 4, containerNo: "MSMU4692602", size: "40", source: "HR38X7238", destination: "023/077D" },
        { id: 5, containerNo: "MSMU4692602", size: "20", source: "HR38X7238", destination: "023/077D" },
        { id: 6, containerNo: "MSMU4692602", size: "40", source: "HR38X7238", destination: "023/077D" },
        { id: 7, containerNo: "MSMU4692602", size: "40", source: "HR38X7238", destination: "023/077D" },
        { id: 8, containerNo: "MSMU4692602", size: "20", source: "HR38X7238", destination: "023/077D" },
        { id: 9, containerNo: "MSMU4692602", size: "40", source: "HR38X7238", destination: "023/077D" },
        { id: 10, containerNo: "MSMU4692602", size: "40", source: "HR38X7238", destination: "023/077D" }
    ]);
    const removeRow = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };
    

    return (
        <>
            <div class="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
                <div class="layout-container">
                    <Nav />
                    <div className="layout-page">
                        <div className="content-wrapper">
                            <div className="container-xxl flex-grow-1 container-p-y">
                                <div className="">
                                    {/* Nav pills */}
                                    <ul className="nav nav-pills container ">
                                        <li className="nav-item pe-3">
                                            <button className={`${type === 'Grid' ? "btn btn-primary" : 'btn btn-label-primary'}`} onClick={() => setType('Grid')}>
                                                Grid
                                            </button>
                                        </li>
                                        <li className="nav-item  pe-3">
                                            <button className={`${type === 'Table' ? 'btn btn-primary' : 'btn btn-label-primary'}`} onClick={() => setType('Table')}>
                                                Table
                                            </button>
                                        </li>
                                        <li className="nav-item  pe-3">
                                            <button className={`${type === 'Map' ? 'btn btn-primary ' : 'btn btn-label-primary'}`} onClick={() => setType('Map')}>
                                                Map
                                            </button>
                                        </li>
                                    </ul>

                                </div>
                                {/* Tab panes */}
                                <div className="mt-5">
                                    <div className="" >
                                        {type === "Grid" ? (
                                            <>
                                                <div className="container">
                                                    <div className="row">
                                                        {cardData.map((item, index) => (
                                                            <div className="col-md-4 mt-3 col-6 col-sm-6">
                                                                <div className="custom-card" style={{ border: "#007bff solid 1px" }}>
                                                                    {/* Card Header */}
                                                                    <div className="custom-card-header bg-light blue" >
                                                                        <img src="assets/images/cnt.png" alt="" className='img-fluid w-50' />
                                                                    </div>

                                                                    {/* Card Body */}
                                                                    <div className="custom-card-body">
                                                                        <h2 className="custom-card-title">
                                                                            C.NO. : <span><strong>MSMU46926{index}2</strong></span>
                                                                        </h2>
                                                                        <p className="custom-card-text">
                                                                            SIZE : <span><strong>{40 + index}</strong></span>
                                                                        </p>
                                                                        <p className="custom-card-text">
                                                                            SOURCE : <span><strong>HR38X723{index}</strong></span>
                                                                        </p>
                                                                        <p className="custom-card-text">
                                                                            DEST : <span><strong>023/077D</strong></span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>
                                            </>
                                        ) : type === 'Table' ? (
                                            <>
                                                <div className="container">
                                                    <div className="table-responsive">
                                                        <table className='table table-striped table-bordered table-font-sm table-hover table-sm'>
                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>Container No.</th>
                                                                    <th>Size</th>
                                                                    <th>Source</th>
                                                                    <th>Destination</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {rows.map(row => (
                                                                    <tr key={row.id}>
                                                                        <td>{row.id < 10 ? `0${row.id}` : row.id}</td>
                                                                        <td>{row.containerNo}</td>
                                                                        <td>{row.size}</td>
                                                                        <td>{row.source}</td>
                                                                        <td>{row.destination}</td>
                                                                        <td>
                                                                            <button
                                                                                className="btn btn-danger btn-sm"
                                                                                onClick={() => removeRow(row.id)}
                                                                            >
                                                                                <i class="ri-delete-bin-7-line fs-6"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                            </>
                                        ) : type === 'Map' && (
                                            <>
                                                <div className="container">
                                                    <h3 className='text-primary'>Coming Soon</h3>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                            </div>

                        </div>


                        <Footer />
                        <div className="content-backdrop fade"></div>
                    </div>
                </div>
            </div >
            <div className="layout-overlay layout-menu-toggle"></div>
            <div className="drag-target"></div>


        </>
    )
}

export default Rst;