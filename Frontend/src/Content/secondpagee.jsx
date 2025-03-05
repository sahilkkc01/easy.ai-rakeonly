import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./secondpagee.css"; // Ensure your styles are properly applied

const Secondpagee = () => {
  const location = useLocation();
  const { formData, responseData } = location.state || { formData: {}, responseData: {} };
  const [isLoaded, setIsLoaded] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => setIsLoaded(true), 500); // Add fade-in effect delay
  // }, []);

  return (
    <div className={`export-page ${isLoaded ? "fade-in" : ""}`}>

      {/* 🔥 Background Animations */}
      <div className="animated-bg">
        <div className="glowing-circle"></div>
        <div className="glowing-circle circle2"></div>
      </div>

      {/* 🚀 Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Intelligent <span className="highlight">Container</span> Tracker
        </h1>
        <p className="hero-subtitle">AI-Powered Real-Time Status & Tracking Dashboard</p>
      </div>

      {/* 🎯 Container Details */}
      <div style={{
        background: "#1a1a1a",
        padding: "50px",
        margin: "50px auto",
        maxWidth: "900px",
        boxShadow: "0px 4px 10px rgba(255, 0, 255, 0.3)",
        borderRadius: "12px"
      }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", textAlign: "center", marginBottom: "20px", color: "#aa00ff" }}>
          Export Container Details
        </h2>

        {/* Table: TAS_GATE_TRANSECTIONS */}
        <h3 style={{ color: "#aa00ff", marginTop: "20px" }}>Gate Transactions</h3>
        {responseData.gate_data?.length > 0 ? (
          <table className="table table-dark table-hover">
            <thead>
              <tr>
              <th>Container No</th>
                <th>Size</th>
                <th>Vehicle No</th>
                {/* <th>Gate IN Time</th> */}
                <th>Gate OUT Time</th>
                <th>Permit No</th>
              </tr>
            </thead>
            <tbody>
            {responseData.gate_data.map((item, index) => (
                <tr key={index}>
                  <td>{item.container_no || "N/A"}</td>
                  <td>{item.container_size || "N/A"}</td>
                  <td>{item.vehicle_no || "N/A"}</td>
                  {/* <td>{item.gate_in_time || "N/A"}</td> */}
                  <td>{item.gate_out_time ? new Date(item.gate_out_time).toISOString().replace("T", " ").split(".")[0] : "N/A"}</td>

                  <td>{item.permit_no || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{ color: "#bdbdbd" }}>No data found.</p>}

        {/* Table: TAS_YARD_CONTAINERS_TRANSACTIONS */}
        <h3 style={{ color: "#aa00ff", marginTop: "20px" }}>Yard Transactions</h3>
        {responseData.yard_data?.length > 0 ? (
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>Container No</th>
                <th>Stack Location</th>
                <th>Yard Created At</th>
              </tr>
            </thead>
            <tbody>
              {responseData.yard_data.map((item, index) => (
                <tr key={index}>
                  <td>{item.container_no || "N/A"}</td>
                  <td>{item.to || "N/A"}</td>
                  <td>{item.yard_created_at ? new Date(item.yard_created_at).toISOString().replace("T", " ").split(".")[0] : "N/A"}</td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{ color: "#bdbdbd" }}>No data found.</p>}

        {/* Table: TAS_RAKE_OUT_WORD */}
        <h3 style={{ color: "#aa00ff", marginTop: "20px" }}>Rake Outward Transactions</h3>
        {responseData.rake_data?.length > 0 ? (
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>Wagon No</th>
                <th>Departure Time</th>
                <th>Seal No</th>
                <th>Container Status</th>
              </tr>
            </thead>
            <tbody>
              {responseData.rake_data.map((item, index) => (
                <tr key={index}>
                  <td>{item.wagon_no || "N/A"}</td>
                  <td>{item.updated_at || "N/A"}</td>
                  <td>{item.seal_no || "N/A"}</td>
                  <td>{item.container_status || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{ color: "#bdbdbd" }}>No data found.</p>}

        {/* Table: TAS_STUFFING */}
        <h3 style={{ color: "#aa00ff", marginTop: "20px" }}>Stuffing Transactions</h3>
        {responseData.stuffing_data?.length > 0 ? (
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>CRN Number</th>
                <th>Created At</th>
                <th>No Of Packages</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Area Used</th>
              </tr>
            </thead>
            <tbody>
              {responseData.stuffing_data.map((item, index) => (

                <tr key={index}>
                  <td>{item.crn_number || "N/A"}</td>
                  <td>{item.stuffing_created_at ? new Date(item.stuffing_created_at).toISOString().replace("T", " ").split(".")[0] : "N/A"}</td>
                  <td>{item.no_of_packages}</td>
                  <td>{item.start_time ? new Date(item.start_time).toISOString().replace("T", " ").split(".")[0] : "N/A"}</td>
                  <td>{item.end_time ? new Date(item.end_time).toISOString().replace("T", " ").split(".")[0] : "N/A"}</td>

                  <td>{item.area_used}</td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{ color: "#bdbdbd" }}>No data found.</p>}
        {/* Table: Rake Inward Transactions */}
        {/* <h3 style={{ color: "#aa00ff", marginTop: "20px" }}>Rake Inward Transactions</h3>
        {responseData.rake_in_data?.length > 0 ? (
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>Train No</th>
                <th>Wagon No</th>
                <th>Rake In Time</th>
              </tr>
            </thead>
            <tbody>
              {responseData.rake_in_data.map((item, index) => (
                <tr key={index}>
                  <td>{item.train_no || "N/A"}</td>
                  <td>{item.wagon_no || "N/A"}</td>
                  <td>{item.rake_in_time ? new Date(item.rake_in_time).toISOString().replace("T", " ").split(".")[0] : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{ color: "#bdbdbd" }}>No data found.</p>} */}

        {/* Table: De-Stuffing Details */}
        {/* <h3 style={{ color: "#aa00ff", marginTop: "20px" }}>De-Stuffing Transactions</h3>
        {responseData.deStuffingData ? (
          <>
            <p style={{ color: "#bdbdbd" }}><strong>De-Stuffing Plan Date:</strong> {responseData.deStuffingData.destuffing_plan_date || "N/A"}</p>
            {responseData.deStuffingData.bill_details?.length > 0 ? (
              <table className="table table-dark table-hover">
                <thead>
                  <tr>
                    <th>De-Stuffing ID</th>
                    <th>No. of Packages Declared</th>
                  </tr>
                </thead>
                <tbody>
                  {responseData.deStuffingData.bill_details.map((item, index) => (
                    <tr key={index}>
                      <td>{item.DE_STUFFING_ID || "N/A"}</td>
                      <td>{item.NO_OF_PACKAGES_DECLARED || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ color: "#bdbdbd" }}>No bill details found.</p>}
          </>
        ) : <p style={{ color: "#bdbdbd" }}>No de-stuffing data found.</p>} */}
      </div>

      {/* 🔥 Footer */}
      <footer className="footer">
        <p>Powered by <span className="footer-highlight">CTAS</span>. All rights reserved. Copyright © 2025.</p>
      </footer>

    </div>
  );
};

export default Secondpagee;
