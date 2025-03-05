import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const Form = () => {
  const [formData, setFormData] = useState({
    transactionType: "",
    crnNumber: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { transactionType, crnNumber } = formData;

    if (!transactionType || !crnNumber) return;

    try {
      let apiEndpoint = "";
      if (transactionType === "Export") {
        apiEndpoint = `https://ctas.live/backend/api/kycl/export/data?crnNumber=${crnNumber}`;
      } else if (transactionType === "Import") {
        apiEndpoint = `https://ctas.live/backend/api/kycl/import/data?crnNumber=${crnNumber}`;
      }

      const response = await axios.get(apiEndpoint);
      if (response.data) {
        localStorage.setItem("searchResults", JSON.stringify(response.data));
        navigate(transactionType === "Export" ? "/secondpagee" : "/Import", {
          state: { formData, responseData: response.data },
        });
      }
    } catch (error) {
      console.error("Error fetching container data:", error);
    }
  };

  return (
    <>
      <div className="animated-bg">
        <div className="glowing-circle"></div>
        <div className="glowing-circle circle2"></div>
      </div>

      <div className="hero-section">
        <h1 className="hero-title">
          Container <span className="highlight">TracknView</span> Portal
        </h1>
        <p className="hero-subtitle">AI-Powered Real-Time Status & Tracking Dashboard</p>
      </div>

      <div className="form-container">
        <h2 className="form-title">
          Know Your <span className="highlight">Container</span> Location
        </h2>
        <form onSubmit={handleSubmit} className="form-box">
          <div className="form-group">
            <label>Transaction Type:</label>
            <select 
              name="transactionType" 
              className="form-select dark-input" 
              value={formData.transactionType} 
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="Export">Export</option>
              <option value="Import">Import</option>
            </select>
          </div>

          <div className="form-group">
            <label>CRN/Container Number:</label>
            <input 
              type="text" 
              name="crnNumber"
              className="form-control dark-input" 
              placeholder="Enter CRN/Container Number" 
              value={formData.crnNumber} 
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>

      <footer className="footer">
        <p>Powered by <span className="footer-highlight">CTAS</span>. All rights reserved. Copyright © 2025.</p>
      </footer>
    </>
  );
};

export default Form;
