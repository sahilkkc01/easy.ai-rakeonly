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
import { ApiBaseUrl } from "../../Config";

export default function Profile() {
  const [oldPasswordShow, setOldPasswordShow] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordShow2, setPasswordShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const formHandel = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("created_by", userData?.id);
    
    const formValues = Object.fromEntries(formData.entries());
    if (formValues.id && formValues.user_name && formValues.new_password) {
      setLoading(true);
      let url = `${ApiBaseUrl}/change/user/password`

      try {
        const response = await axios.post(url,
          formValues
        );

        if (response?.data?.status == "success") {
          Swal.fire({
            icon: "success",
            text: response.data.message,
            confirmButtonText: "OK",
            timer: 3000,
          }).then(() => {
            navigate(-1);
          });
        } else {
          Swal.fire({
            icon: response.data.status,
            text: response.data.message,
            confirmButtonText: "OK",
            timer: 3000,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: error.message,
          confirmButtonText: "OK",
          timer: 3000,
        });
      } finally {
        setLoading(false);
      }
    } else {
      Swal.fire({
        icon: "info",
        text: "Something Want Wrong. Please Try Again!",
        confirmButtonText: "OK",
        timer: 3000,
      });
    }
  };

  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user) {
      const parseUser = JSON.parse(user);
      setUserData(parseUser);
    }
  }, []);

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

      <div className="container mt-5 login">
        <div
          className="row justify-content-center align-content-center"
          style={{ height: "90vh" }}
        >
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="text-center mb-6">Change Password</h3>
                <form onSubmit={formHandel}>
                  <input
                    type="text"
                    className="form-control"
                    id="id"
                    readOnly
                    hidden
                    name="id"
                    value={userData?.id}
                  />
                  <div className="form-floating form-floating-outline mb-6">
                    <input
                      type="text"
                      className="form-control"
                      id="user_name"
                      readOnly
                      name="user_name"
                      value={userData?.user_name}
                    />
                    <label htmlFor="user_name">User Name</label>
                  </div>
                  <div className="input-group input-group-merge mb-6">
                    <div className="form-floating form-floating-outline">
                      <input
                        type={`${oldPasswordShow ? "text" : "password"}`}
                        className="form-control"
                        id="old_password"
                        name="old_password"
                        placeholder="Enter old password"
                        required=""
                      />
                      <label htmlFor="old_password">Old Password</label>
                    </div>
                    <span className="input-group-text cursor-pointer">
                      <i
                        className={`${
                          oldPasswordShow ? "ri-eye-line" : "ri-eye-off-line"
                        }  ri-20px`}
                        onClick={() => setOldPasswordShow(!oldPasswordShow)}
                      />
                    </span>
                  </div>
                  <div className="input-group input-group-merge mb-6">
                    <div className="form-floating form-floating-outline">
                      <input
                        type={`${passwordShow ? "text" : "password"}`}
                        className="form-control"
                        id="new_password"
                        placeholder="Enter new password"
                        name="new_password"
                        required=""
                      />
                      <label htmlFor="new_password">New Password</label>
                    </div>
                    <span className="input-group-text cursor-pointer">
                      <i
                        className={`${
                          passwordShow ? "ri-eye-line" : "ri-eye-off-line"
                        }  ri-20px`}
                        onClick={() => setPasswordShow(!passwordShow)}
                      />
                    </span>
                  </div>
                  <div className="input-group input-group-merge mb-10">
                    <div className="form-floating form-floating-outline">
                      <input
                        type={`${passwordShow2 ? "text" : "password"}`}
                        className="form-control"
                        id="confirm_password"
                        placeholder="Confirm new password"
                        required=""
                        name="confirm_password"
                      />
                      <label htmlFor="confirm_password">
                        Confirm New Password
                      </label>
                    </div>
                    <span className="input-group-text cursor-pointer">
                      <i
                        className={`${
                          passwordShow2 ? "ri-eye-line" : "ri-eye-off-line"
                        }  ri-20px`}
                        onClick={() => setPasswordShow2(!passwordShow2)}
                      />
                    </span>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
