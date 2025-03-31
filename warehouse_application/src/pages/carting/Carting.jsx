import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../main/header";
import Nav from "../main/nav";
import Footer from "../main/footer";

export default function Carting() {
  const containerModalRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const containerModalEl = document.getElementById("containerModal");
    if (containerModalEl) {
      containerModalRef.current = new Modal(containerModalEl);
    }
  }, []);

  // Open the Container Modal
  const openContainerModal = () => {
    if (containerModalRef.current) {
      containerModalRef.current.show();
    } else {
      console.error("Container modal instance is not available.");
    }
  };

  // table data fetch from api


const fetchData = async () => {
  try {
    const response = await axios.get("https://ctas.live/backend/api/carting/live/data");
    setData(response.data); // Assuming API returns an array of objects
    setLoading(false);
  } catch (err) {
    setError("Failed to fetch data.");
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);

  const GetFormData = async (e) => {
    e.preventDefault();

    const url = `https://ctas.live/backend/api/get/de_stuffing_data/LCL/${e.target.container_no.value}`;
    try {
      const response = await axios.post(url);
      if (response?.data?.status == "success") {
        navigate(
          `/de-stuffing/bill-details?container_no=${e.target.container_no.value}`
        );
      } else {
        Swal.fire({
          icon: response?.data?.status,
          text: response?.data?.message,
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error Fetch Data: ${error.message}`,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
        <div className="layout-container">
          <div className="layout-page">
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                  <div className="card-header">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="">
                        <h3 className="text-primary">Carting</h3>
                      </div>
                      <div className="">
                        <Link
                          to={`/carting/bill-details`}
                          className="btn btn-label-success"
                        >
                          + Create Job
                        </Link>
                        <Link to={`/`} className="btn btn-label-primary ms-2">
                          Go Back
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      {/* <table className="table table-striped table-sm table-hover">
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
                            <td>25/09/24</td>
                          </tr>
                        </tbody>
                      </table> */}
                      <table className="table table-striped table-sm table-hover">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Truck No</th>
              <th>CRN</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.truck_no}</td>
                  <td>{item.crn}</td>
                  <td>{item.created_on}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
                    </div>
                  </div>
                </div>
                <Footer />
                <div className="content-backdrop fade" />
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
