import React, { useEffect, useState } from "react";
import { ApiBaseUrl } from "../Config";
import axios from "axios";
import Swal from "sweetalert2";

export default function ContainerData() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    container_no: "",
    container_size: "",
    in_from: "GATE",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetData();
  }, [filters]);

  useEffect(() => {
    const id = setInterval(() => {
      GetData();
    }, 10000);
    return () => clearInterval(id);
  }, [filters]);

  const GetData = async () => {
    setLoading(true);
    const url = `${ApiBaseUrl}/get/in/container/data?`;
    try {
      const response = await axios.get(url, {
        params: filters,
      });
      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        Swal.fire({
          icon: "Info",
          text: `Something Want Wrong..!`,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `Error in Data Fetch: ${error.message}`,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      {loading ? (
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
      ) : (
        ""
      )}

      <h4 className="mb-3 fw-bold text-primary">📦 Container List</h4>

      {/* Filters */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-3">
              <input
                type="text"
                name="container_no"
                className="form-control"
                placeholder="Container No"
                value={filters.container_no}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <select
                name="container_size"
                className="form-select"
                value={filters.container_size}
                onChange={handleChange}
              >
                <option value="">Size</option>
                <option value="20">20</option>
                <option value="40">40</option>
              </select>
            </div>

            <div className="col-md-2">
              <select
                name="in_from"
                className="form-select"
                value={filters.in_from}
                onChange={handleChange}
              >
                <option value="GATE">GATE</option>
                <option value="RAKE">RAKE</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive shadow-sm">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Container No</th>
              <th scope="col">Size</th>
              <th scope="col">In From</th>
              <th scope="col">In Time</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.length > 0 ? (
              data?.data?.map((item, i) => (
                <tr key={item.id}>
                  <td>{item?.rn ?? i + 1}</td>
                  <td>{item.container_no}</td>
                  <td>{item.container_size}</td>
                  <td>{item.in_from}</td>
                  <td>{item.in_time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {data && data?.data && (
          <div className="container mt-4">
            <div
              className="dataTables_paginate paging_simple_numbers"
              id="DataTables_Table_0_paginate"
            >
              <ul className="pagination ">
                {data &&
                  data.links &&
                  data.links.map((link, q) => {
                    let showData =
                      data.links.length == q + 1
                        ? "Next"
                        : q == 0
                        ? "Previous"
                        : link.label;
                    return (
                      <li
                        key={q}
                        className={`paginate_button page-item ${
                          link.active === true ? "active" : ""
                        }  ${
                          showData == "Next" &&
                          data.current_page == data.last_page
                            ? "disabled"
                            : showData == "Previous" && data.current_page == 1
                            ? "disabled"
                            : ""
                        } `}
                      >
                        <button
                          onClick={() => {
                            showData == "Previous"
                              ? setFilters({
                                  ...filters,
                                  page: data.current_page - 1,
                                })
                              : showData == "Next"
                              ? setFilters({
                                  ...filters,
                                  page: data.current_page + 1,
                                })
                              : setFilters({
                                  ...filters,
                                  page: link.label,
                                });
                          }}
                          aria-controls="DataTables_Table_0"
                          role="link"
                          aria-current="page"
                          data-dt-idx={0}
                          tabIndex={0}
                          className="page-link"
                        >
                          {showData}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
