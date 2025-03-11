import React from 'react'
import Header from './main/header'
import Nav from './main/nav'
import Footer from './main/footer'
import { Link, NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
export default function Jobs() {
    const location = useLocation();
    const { shippingBill, commodity, warehouse, area, locationsUsed, declaredCount } = location.state || {};
    return (
        <>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    <Header />
                    <div className="layout-page">
                        <Nav />
                        <div className="content-wrapper">
                            <div className="container-xxl flex-grow-1 container-p-y">
                                <>

                                    <div className="container mt-5">
                                        <div className="col-md-4">
                                            <div className="card p-4 shadow">
                                                <h3 className="text-center">Job Details</h3>
                                                <hr />
                                                <p><strong>Shipping Bill:</strong> 4307761{shippingBill}</p>
                                                <p><strong>Commodity (Code):</strong>FOOTWEAR (376){commodity}</p>
                                                <p><strong>Warehouse Name:</strong>O SQM {warehouse}</p>
                                                <p><strong>Area:</strong> {area}</p>
                                                <p><strong>Locations Used:</strong> {locationsUsed}</p>
                                                <p><strong>Declared Count:</strong> 1095{declaredCount}</p>
                                                <div className="d-flex justify-content-between">
                                                    <button className="btn btn-primary w-50 mt-3">Start Carting</button>
                                                    <button className="btn btn-primary w-10 mt-3">:</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>


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
