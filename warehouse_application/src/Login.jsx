import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const [passwordShow, setPasswordShow] = useState(false);
  const [user_permissions, setuser_permissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [ip, setIp] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {

    const getIP = async () => {
      const response = await axios.get("https://api64.ipify.org?format=json");
      if (response.data) {
        setIp(response.data.ip);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            JSON.stringify({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            })
          );
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    getIP();
  }, []);

  const formHandel = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    // console.log(formValues);
    if (formValues.user_name && formValues.password) {
      try {
        const response = await axios.post(`https://ctas.live/backend/api/user/login`, formValues );

        if (response?.data?.status == "success") {

          localStorage.setItem("access_token",JSON.stringify(response.data.access_token));
          localStorage.setItem("user", JSON.stringify(response.data.data));
          localStorage.setItem("user_permissions",JSON.stringify(response.data.data.permissions));

          Swal.fire({
            icon: response.data.status,
            text: response.data.message,
            confirmButtonText: "OK",
            timer: 3000,
          }).then(() => {
            navigate("/");
          });

        } else {
          Swal.fire({
            icon: "info",
            text: response.data.message,
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: error.message,
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    }


    // formValues.user_name == "SUNIC@RAKE" &&
    // formValues.password == "JEETU@123"

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
      <div className="position-relative">
        <div className="authentication-wrapper authentication-basic container-p-y">
          <div className="authentication-inner py-6 mx-4">
            <div className="card p-7">
              <div className="app-brand justify-content-center mt-5">
                <h3> Welcome to Dashboard 👋🏻</h3>
              </div>
              <div className="card-body">
                <p className="mb-5">
                  Please sign-in to your account and start the adventure
                </p>
                <form
                  id="formAuthentication"
                  className="mb-5 fv-plugins-bootstrap5 fv-plugins-framework login"
                  onSubmit={formHandel}
                >
                  <div className="form-floating form-floating-outline mb-5 fv-plugins-icon-container">
                    <input
                      type="text"
                      className="form-control"
                      id="user_name"
                      name="user_name"
                      placeholder="USERNAME"
                      required
                    />
                    <label htmlFor="user_name">USERNAME</label>
                    <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback" />
                  </div>
                  <div className="mb-5 fv-plugins-icon-container">
                    <div className="form-password-toggle">
                      <div className="input-group input-group-merge">
                        <div className="form-floating form-floating-outline">
                          <input
                            type={`${passwordShow ? "text" : "password"}`}
                            id="password"
                            className="form-control"
                            name="password"
                            placeholder="············"
                            required
                          />
                          <label htmlFor="password">Password</label>
                        </div>
                        <span className="input-group-text cursor-pointer">
                          <i
                            className={`${passwordShow ? "ri-eye-line" : "ri-eye-off-line"
                              }  ri-20px`}
                            onClick={() => setPasswordShow(!passwordShow)}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback" />
                  </div>
                  {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="mb-5 pb-2 d-flex justify-content-between pt-2 align-items-center">
                    <div className="form-check mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember-me"
                      />
                      <label className="form-check-label" htmlFor="remember-me">
                        {" "}
                        Remember Me{" "}
                      </label>
                    </div>
                    <a className="float-end mb-1">
                      <span>Forgot Password?</span>
                    </a>
                  </div>
                  <div className="mb-5">
                    <button
                      className="btn btn-primary d-grid w-100 waves-effect waves-light"
                      type="submit"
                    >
                      login
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <img
              src="/assets/img/illustrations/tree-3.png"
              alt="auth-tree"
              className="authentication-image-object-left d-none d-lg-block"
            />
            <img
              src="/assets/img/illustrations/auth-basic-mask-light.png"
              className="authentication-image d-none d-lg-block scaleX-n1-rtl"
              height={172}
              alt="triangle-bg"
              data-app-light-img="illustrations/auth-basic-mask-light.png"
              data-app-dark-img="illustrations/auth-basic-mask-dark.png"
            />
            <img
              src="/assets/img/illustrations/tree.png"
              alt="auth-tree"
              className="authentication-image-object-right d-none d-lg-block"
            />
          </div>
        </div>
      </div>
    </>
  );
}
