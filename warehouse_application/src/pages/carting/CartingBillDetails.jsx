// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, Link, useSearchParams } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Header from "../main/header";
// import Nav from "../main/nav";
// import Footer from "../main/footer";
// import { formatToDateTimeLocal } from "../main/formatToDateTime";

// export default function CartingBillDetails() {
//   const navigate = useNavigate();
//   const iframeRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [CrnNo, setCrnNo] = useState(null);
//   const [TallySheet, setTallySheet] = useState(null);
//   const [Data, setData] = useState(null);
//   const [Locations, setLocations] = useState(null);
//   const [TotalTrucks, setTotalTrucks] = useState(1);
//   const [searchParams, setSearchParams] = useSearchParams();

//   const today = new Date();

//   const fetchData = async (crn_number) => {
//     setLoading(true);
//     const url = `https://ctas.live/backend/api/get/carting?crn_number=${crn_number}`;
//     try {
//       const response = await axios.get(url);
//       if (response?.data?.status === "success") {
//         setData(response?.data?.data);
//       } else {
//         Swal.fire({
//           icon: response?.data?.status,
//           text: response?.data?.message,
//           timer: 3000,
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         text: `Error Fetching Data: ${error.message}`,
//         timer: 3000,
//         showConfirmButton: false,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLocations = async () => {
//     setLoading(true);
//     const url = `https://ctas.live/backend/api/warehouse/empty/locations?type=Export`;
//     try {
//       const response = await axios.get(url);
//       if (response?.data?.status === "success") {
//         setLocations(response?.data?.data);
//       } else {
//         Swal.fire({
//           icon: response?.data?.status,
//           text: response?.data?.message,
//           timer: 3000,
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         text: `Error Fetching Data: ${error.message}`,
//         timer: 3000,
//         showConfirmButton: false,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const GetFormData = async (e) => {
//     e.preventDefault();
//     const crn_number = e.target.crn_number.value.toUpperCase();
//     setCrnNo(crn_number);
//     setSearchParams({ crn_number });
//   };

//   useEffect(() => {
//     const crn_number = searchParams.get("crn_number");
//     const tallySheet = searchParams.get("tally_sheet");
//     if (crn_number) {
//       setCrnNo(crn_number);
//       if (tallySheet) {
//         setTallySheet(tallySheet);
//       } else {
//         fetchData(crn_number);
//       }
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (Data) {
//       fetchLocations();
//     }
//   }, [Data]);

//   const handleSubmitForm = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const formData = new FormData(e.target);
//     const url = `https://ctas.live/backend/api/carting/update`;
//     try {
//       const response = await axios.post(url, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       console.log(response.data);
//       if (response?.data?.status === "success") {
//         Swal.fire({
//           icon: response?.data?.status,
//           text: response?.data?.message,
//           timer: 3000,
//         }).then(() => {
//           navigate(`?tally_sheet=1&crn_number=${CrnNo}`);
//         });
//       } else {
//         Swal.fire({
//           icon: response?.data?.status,
//           text: response?.data?.message,
//           timer: 3000,
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         text: `Error Fetching Data: ${error.message}`,
//         timer: 3000,
//         showConfirmButton: false,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const GridComponent = ({ index }) => {
//     const [gridInputs, setGridInputs] = useState([{ id: 1 }]);

//     const addGridInput = () => {
//       setGridInputs([...gridInputs, { id: gridInputs.length + 1 }]);
//     };

//     return (
//       <div className="col-md-3 col-4">
//         <label className="form-label">Grid Location & Area (SQM)</label>
//         {gridInputs.map((input, i) => (
//           <div key={input.id} className="d-flex align-items-center gap-3 mb-2">
//             <select
//               className="form-select p-2"
//               name={`grid_location[${index}][${i}]`}
//             >
//               <option selected disabled>
//                 Select Grid
//               </option>
//               {Locations?.map((location, j) => (
//                 <option key={j} value={location.camera_locations}>
//                   {location.camera_locations}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="text"
//               className="form-control p-2"
//               placeholder="Area (SQM)"
//               name={`area[${index}][${i}]`}
//             />
//             <button
//               type="button"
//               className="btn btn-success btn-sm px-2 py-1"
//               onClick={addGridInput}
//             >
//               +
//             </button>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const handleBillDetails = (key, sBillNo) => {
//     Data?.carting_shipping_bill_details?.map((details, a) => {
//       if (details.shipping_bill_number == sBillNo) {
//         document.getElementById(
//           `cargo_description_${key}`
//         ).value = `${details.commodity_description}`;
//         document.getElementById(
//           `no_of_pkgs_${key}`
//         ).value = `${details.no_of_packages_declared}`;
//         document.getElementById(
//           `pkgs_weight_${key}`
//         ).value = `${details.package_weight}`;
//         document.getElementById(
//           `pkg_code_${key}`
//         ).value = `${details.package_code}`;
//       }
//     });
//   };

//   const handleBillPkgW = (key, pkg) => {
//     let no_of_pkgs = 0;
//     let package_weight = 0;
//     let Per_package_weight = 0;

//     let shipping_bill_number = document.getElementById(`sbill_${key}`)?.value;

//     Data?.carting_shipping_bill_details?.forEach((details) => {
//       if (details.shipping_bill_number == shipping_bill_number) {
//         package_weight += parseFloat(details.package_weight) || 0;
//         no_of_pkgs += parseFloat(details.no_of_packages_declared) || 0;
//       }
//     });
//     if (
//       package_weight &&
//       no_of_pkgs &&
//       package_weight != 0 &&
//       no_of_pkgs != 0
//     ) {
//       Per_package_weight += package_weight / no_of_pkgs.toFixed(2);
//     }

//     let weightInput = document.getElementById(`pkgs_weight_${key}`);

//     if (weightInput) {
//       if (pkg && pkg != 0) {
//         weightInput.value = (Per_package_weight * pkg).toFixed(2);
//       } else if (pkg == 0) {
//         weightInput.value = 0;
//       } else {
//         weightInput.value = parseFloat(Per_package_weight) || 0;
//       }
//     } else {
//       console.log("Package weight input not found!");
//     }
//   };

//   return (
//     <>
//       {loading && (
//         <div
//           className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
//           style={{ zIndex: 9999 }}
//         >
//           <div className="sk-chase sk-primary display-1">
//             <div className="sk-chase-dot" />
//             <div className="sk-chase-dot" />
//             <div className="sk-chase-dot" />
//             <div className="sk-chase-dot" />
//             <div className="sk-chase-dot" />
//             <div className="sk-chase-dot" />
//           </div>
//         </div>
//       )}
//       <div className="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
//         <div className="layout-container">
//           <div className="layout-page">
//             <div className="content-wrapper">
//               <div className="container-xxl flex-grow-1 container-p-y">
//             <div className="container">
//             {CrnNo && TallySheet ? (
//                   <div className="row justify-content-center">
//                     <div className="col-lg-10 col-md-11">
//                     <div className="text-end">
//                         <button
//                           onClick={() => {
//                             if (iframeRef.current) {
//                               iframeRef.current.contentWindow.print();
//                             }
//                           }}
//                           className="btn btn-label-primary mb-2"
//                         >
//                           Print
//                         </button>
//                         <a href="?"
//                           className="btn btn-primary mb-2 ms-2"
//                         >
//                           Search Another
//                         </a>
//                         <Link
//                           to={"/carting"}
//                           className="btn btn-primary mb-2 ms-2"
//                         >
//                           Go Back
//                         </Link>
//                       </div>
//                       <div className="" style={{ width: 789, height: 1099 }}>
//                         <iframe
//                           ref={iframeRef}
//                           src={`/carting/tally_sheet?crn_number=${CrnNo}`}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             backgroundColor: "white",
//                           }}
//                           title="A4 Iframe"
//                         ></iframe>
//                       </div>
//                     </div>
//                   </div>
//                 ) : Data && CrnNo ? (
//                   <>
//                     <form action="" onSubmit={handleSubmitForm}>
//                     <div className="text-end">
//                         <a href="?"
//                           className="btn btn-primary mb-2 ms-2"
//                         >
//                           Search Another
//                         </a>
//                         <Link
//                           to={"/carting"}
//                           className="btn btn-primary mb-2 ms-2"
//                         >
//                           Go Back
//                         </Link>
//                       </div>
//                       <div className="row">
//                         <h4 className="text-primary mb-3">Container Details</h4>
//                         <div className="card">
//                           <div className="card-body">
//                             <div className="row">
//                               <input
//                                 type="hidden"
//                                 name="id"
//                                 defaultValue={Data?.id}
//                               />
//                               <div className="col-4">
//                                 <label className="form-label">Crn No</label>
//                                 <input
//                                   type="text"
//                                   className="form-control p-2"
//                                   defaultValue={Data?.crn_number}
//                                   readOnly
//                                 />
//                               </div>
//                               {Data?.carting_containers?.map((container ,i)=>(
//                                 <div className="col-8 d-flex gap-2">
//                                  <div className="col">
//                                 <label className="form-label">
//                                   Container No
//                                 </label>
//                                 <input
//                                   type="text"
//                                   className="form-control p-2"
//                                   defaultValue={container?.container_number}
//                                   readOnly
//                                 />
//                               </div>
//                               <div className="col">
//                                 <label className="form-label">
//                                   Container Size
//                                 </label>
//                                 <input
//                                   type="text"
//                                   className="form-control p-2"
//                                   defaultValue={container?.container_size}
//                                   readOnly
//                                 />
//                               </div>
//                                 </div>
//                               ))}

//                               <div className="col-4">
//                                 <label className="form-label">
//                                   Start Date Time
//                                 </label>
//                                 <input
//                                   type="datetime-local"
//                                   className="form-control p-2"
//                                   name="start_time"
//                                   defaultValue={formatToDateTimeLocal(today)}
//                                 />
//                               </div>
//                               <div className="col-4">
//                                 <label className="form-label">
//                                   End Date Time
//                                 </label>
//                                 <input
//                                   type="datetime-local"
//                                   className="form-control p-2"
//                                   name="end_time"
//                                   defaultValue={formatToDateTimeLocal(today)}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <h4 className="text-primary mb-3">Bill Details</h4>
//                         {Array.from({ length: TotalTrucks }, (_, i) => (
//                           <div
//                             key={i}
//                             className="card card-body my-3"
//                           >
//                             <div className="d-flex gap-3 flex-row overflow-auto">
//                               <div className="col-md-2 col-3">
//                                 <label
//                                   htmlFor="truck_number"
//                                   className="form-label"
//                                 >
//                                   Truck Number
//                                 </label>
//                                 <input
//                                   type="text"
//                                   className="form-control p-2"
//                                   name={`truck_number[${i}]`}
//                                 />
//                               </div>
//                               <div className="col-md-2 col-3">
//                                 <label
//                                   htmlFor="truck_arrival_date"
//                                   className="form-label"
//                                 >
//                                   Truck Arrival Date
//                                 </label>
//                                 <input
//                                   type="datetime-local"
//                                   className="form-control p-2"
//                                   name={`truck_arrival_date[${i}]`}
//                                 />
//                               </div>
//                               <div className="col-md-2 col-3">
//                                 <label htmlFor="billNo" className="form-label">
//                                   Bill Number
//                                 </label>
//                                 <select
//                                   name={`sbill[${i}]`}
//                                   className="form-select p-2"
//                                   onChange={(e) =>
//                                     handleBillDetails(i, e.target.value)
//                                   }
//                                   id={`sbill_${i}`}
//                                 >
//                                   <option value="" selected disabled>
//                                     Select Bill
//                                   </option>
//                                   {Data?.carting_shipping_bill_details?.map(
//                                     (details, k) => (
//                                       <option
//                                         key={k}
//                                         value={details?.shipping_bill_number}
//                                       >
//                                         {details?.shipping_bill_number}
//                                       </option>
//                                     )
//                                   )}
//                                 </select>
//                               </div>
//                               <div className="col-md-3 col-4">
//                                 <label className="form-label">
//                                   Cargo Description (Code)
//                                 </label>
//                                 <input
//                                   type="hidden"
//                                   className="form-control p-2"
//                                   name={`pkg_code[${i}]`}
//                                   id={`pkg_code_${i}`}
//                                   readOnly
//                                 />
//                                 <input
//                                   type="text"
//                                   className="form-control p-2"
//                                   name={`cargo_description[${i}]`}
//                                   id={`cargo_description_${i}`}
//                                   readOnly
//                                 />
//                               </div>
//                               <div className="col-md-2 col-3">
//                                 <label className="form-label">No of Pkgs</label>
//                                 <input
//                                   type="number"
//                                   className="form-control p-2"
//                                   id={`no_of_pkgs_${i}`}
//                                   name={`no_of_pkgs[${i}]`}
//                                   onChange={(e) =>
//                                     handleBillPkgW(i, e.target.value)
//                                   }
//                                 />
//                               </div>
//                               <div className="col-md-2 col-3">
//                                 <label className="form-label">Pkg Weight</label>
//                                 <input
//                                   type="text"
//                                   className="form-control p-2"
//                                   id={`pkgs_weight_${i}`}
//                                   name={`pkgs_weight[${i}]`}
//                                 />
//                               </div>
//                               <GridComponent index={i} />
//                             </div>
//                           </div>
//                         ))}
//                         <div className="col-12 my-2 text-end">
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-primary"
//                             onClick={() => setTotalTrucks(TotalTrucks + 1)}
//                           >
//                             Add Truck
//                           </button>
//                         </div>
//                         <hr />
//                         <button className="btn btn-primary w-25 mt-3">
//                         Save Job
//                         </button>
//                       </div>
//                     </form>
//                   </>
//                 ) : (
//                   <div className="row justify-content-center align-items-center" style={{height:"70vh"}}>
//                     <div className="col-md-6 col-8">
//                       <div className="card my-3">
//                         <div className="card-body">
//                           <h4 className="text-center text-primary">Carting</h4>
//                           <form action="" onSubmit={GetFormData}>
//                             <p>Please Enter CRN Number to Fetch Data</p>
//                             <div className="form-floating form-floating-outline mb-6">
//                               <input
//                                 type="text"
//                                 className="form-control mb-3"
//                                 placeholder="Enter CRN Number"
//                                 name="crn_number"
//                                 onChange={(e) =>
//                                   (e.target.value =
//                                     e.target.value.toUpperCase())
//                                 }
//                               />
//                               <label htmlFor="crn_number">CRN Number</label>
//                             </div>
//                             <button
//                               type="submit"
//                               className="btn btn-primary w-100"
//                             >
//                               Fetch Data
//                             </button>
//                           </form>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//             </div>
//                 <Footer />
//                 <div className="content-backdrop fade" />
//               </div>
//             </div>
//           </div>
//           <div className="layout-overlay layout-menu-toggle"></div>
//           <div className="drag-target"></div>
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../main/header";
import Nav from "../main/nav";
import Footer from "../main/footer";
import { formatToDateTimeLocal } from "../main/formatToDateTime";

export default function CartingBillDetails() {
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [CrnNo, setCrnNo] = useState(null);
  const [TallySheet, setTallySheet] = useState(null);
  const [Data, setData] = useState(null);
  const [Locations, setLocations] = useState(null);
  const [TotalTruck, setTotalTrucks] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFinalSubmit, setIsFinalSubmit] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [ID, setID] = useState(false);

  const today = new Date();
  const fetchData = async (crn_number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://ctas.live/backend/api/get/carting?crn_number=${crn_number}`
      );

      if (response.data?.status === "success") {
        setData(response.data.data);
        setID(response.data.data?.id);
        setIsFinalSubmit(response.data.data?.status === '1' || response.data.data?.status === '2');
      } else {
        throw new Error(response.data?.message || 'Failed to fetch data');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        timer: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    setLoading(true);
    const url = `https://ctas.live/backend/api/warehouse/locations?type=Export`;
    try {
      const response = await axios.get(url);
      if (response?.data?.status === "success") {
        setLocations(response?.data?.data);
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
        text: `Error Fetching Data: ${error.message}`,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };
  const GetFormData = async (e) => {
    e.preventDefault();
    const crn_number = e.target.crn_number.value.toUpperCase();
    setCrnNo(crn_number);
    setSearchParams({ crn_number });
  };

  // useEffect(() => {
  //   const crn_number = searchParams.get("crn_number");
  //   const tallySheet = searchParams.get("tally_sheet");
  //   if (crn_number) {
  //     setCrnNo(crn_number);
  //     if (tallySheet) {
  //       setTallySheet(tallySheet);
  //     } else {
  //       fetchData(crn_number);
  //     }
  //   }
  // }, [searchParams]);

  // this is manoj

  useEffect(() => {
    const crn_number = searchParams.get("crn_number");
    const tallySheet = searchParams.get("tally_sheet");
    const finalSubmit = searchParams.get("isFinalSubmit");
    const id = searchParams.get("id");

    if (crn_number) setCrnNo(crn_number);
    if (tallySheet) setTallySheet(tallySheet);
    if (finalSubmit) setIsFinalSubmit(finalSubmit === '1');
    if (id) setID(id);

    if (crn_number && !tallySheet) {
      fetchData(crn_number);
    }
  }, [searchParams]);

  // useEffect(() => {
  //   if (Data) {
  //     fetchLocations();
  //   }
  // }, [Data]);

  useEffect(() => {
    if (Data) {
      setID(Data?.id);
      fetchLocations();

      if (Data.status === '1' || Data.status === '2') {
        navigate(`?isFinalSubmit=1&id=${Data.id}&tally_sheet=1&crn_number=${CrnNo}`);
      }
      if (Data?.carting_trucks) {
        setTotalTrucks(Data?.carting_trucks.length);
      }
    }
  }, [Data]);

  const handleFinalSubmit = async () => {
    setLoading(true);

    try {
      // Note the corrected endpoint URL (matches what you specified)
      const url = `https://ctas.live/backend/api/carting/final/submit?id=${ID}&crn_number=${CrnNo}`;
      // Using POST method with parameters in the body is more standard for submit actions
      const response = await axios.get(
        url,
        {
          id: ID,
          crn_number: CrnNo
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response?.data?.status === "success") {
        await Swal.fire({
          icon: "success",
          text: response.data.message,
          timer: 2000
        });

        // Navigate to view-only mode
        navigate(`?isFinalSubmit=1&id=${ID}&tally_sheet=1&crn_number=${CrnNo}`);
      } else {
        Swal.fire({
          icon: "error",
          text: response?.data?.message || "Final submit failed",
          timer: 3000
        });
      }
    } catch (error) {
      console.error("Final submit error:", error);
      Swal.fire({
        icon: "error",
        text: error.response?.data?.message ||
          "Failed to complete final submission. Please try again.",
        timer: 3000
      });
    } finally {
      setLoading(false);
    }
  };


  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const response = await axios.post(
        'https://ctas.live/backend/api/carting/update',
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.status === "success") {
        const updatedId = response.data.data?.id || ID;
        setID(updatedId);
        setSubmissionStatus('saved');

        await Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Job details saved successfully',
          timer: 2000
        });

        navigate(`?isFinalSubmit=0&id=${updatedId}&tally_sheet=1&crn_number=${CrnNo}`);
      } else {
        throw new Error(response.data?.message || 'Failed to save job');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        timer: 3000
      });
    } finally {
      setLoading(false);
    }
  };
  // const handleSubmitForm = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const formData = new FormData(e.target);
  //   const url = `https://ctas.live/backend/api/carting/update`;
  //   try {
  //     const response = await axios.post(url, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     console.log(response.data);
  //     if (response?.data?.status === "success") {
  //       Swal.fire({
  //         icon: response?.data?.status,
  //         text: response?.data?.message,
  //         timer: 3000,
  //       }).then(() => {
  //         navigate(`?tally_sheet=1&crn_number=${CrnNo}`);
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: response?.data?.status,
  //         text: response?.data?.message,
  //         timer: 3000,
  //       });
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       text: `Error Fetching Data: ${error.message}`,
  //       timer: 3000,
  //       showConfirmButton: false,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const GridComponent = ({ index, data }) => {

    const [gridInputs, setGridInputs] = useState(
      data?.grid_area?.length > 0
        ? data.grid_area.map((item, i) => ({
          id: i + 1,
          grid_location: item.grid_locations || "",
          area: item.area || "",
        }))
        : [{ id: 1, grid_location: "", area: "" }]
    );

    // Function to add a new grid input
    const addGridInput = () => {
      setGridInputs([...gridInputs, { id: gridInputs.length + 1, grid_location: "", area: "" }]);
    };

    // Function to remove a grid input
    const removeGridInput = (id) => {
      setGridInputs(gridInputs.filter((input) => input.id !== id));
    };
    // console.log(gridInputs);
    return (
      <div className="col-md-3 col-5">
        <label className="form-label">Grid Location & Area (SQM)</label>
        {gridInputs.map((input, i) => (
          <div key={input.id} className="mb-2">
            <div className="d-flex align-items-center gap-3 ">
              <select
                className="form-select p-2"
                name={`grid_locations[${index}][${i}]`}
                defaultValue={input.grid_location}
                onChange={(e) => GridAreaHandle(e.target.value, index, i)}
              >
                <option value="">Select Grid</option>
                {Locations?.map((location, j) => (
                  <option key={j} value={location.camera_locations}>
                    {location.camera_locations}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control p-2"
                placeholder="Area (SQM)"
                name={`area[${index}][${i}]`}
                id={`area_${index}_${i}`}
                defaultValue={input.area}
                onChange={(e) => AreaHandle(index, i)}
                // readOnly
              />
              {/* Add button */}
              <button type="button" className="btn btn-success btn-sm px-2 py-1" onClick={addGridInput}>
                +
              </button>
              {gridInputs.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm px-2 py-1"
                  onClick={() => removeGridInput(input.id)}
                >
                  -
                </button>
              )}
            </div>
            <small id={`error_area_${index}_${i}`}></small>
          </div>
        ))}
      </div>
    );
  };


  const GridAreaHandle = (grid, id, key) => {
    let totalArea = 0;
    let occupied = 0;
    let loc_i =1;

    Locations?.forEach((location) => {
      if (location.camera_locations === grid && loc_i == 1) {
        loc_i++;
        totalArea += parseInt(location.total_area) || 0;
        occupied += parseInt(location.occupied_area) || 0;
      }
    });

    let available = totalArea - occupied;
    let areaInput = document.getElementById(`area_${id}_${key}`);

    if (areaInput) {
      areaInput.value = available >= 0 ? available : 0;
      areaInput.max = available >= 0 ? available : 0;
    }
  };

  const AreaHandle = (id, key) => {
    let areaInput = document.getElementById(`area_${id}_${key}`);
    let errorMsg = document.getElementById(`error_area_${id}_${key}`);

    if (areaInput) {
      let myValue = parseFloat(areaInput.value) || 0;
      let maxAttr = parseFloat(areaInput.getAttribute("max"));
      let myMaxValue = maxAttr|| maxAttr == 0 ? maxAttr : 20;

      if (myValue > myMaxValue) {
        areaInput.classList.add("border", "border-danger");
        if (errorMsg) {
          errorMsg.className = "text-danger d-block mt-1";
          errorMsg.innerText = `Grid Maximum Area Available ${myMaxValue}`;
        }
      } else {
        areaInput.classList.remove("border", "border-danger");
        if (errorMsg) {
          errorMsg.className = '';
          errorMsg.innerText = '';
        }
      }
    }
  };

  // const GridComponent = ({ index }) => {
  //   const [gridInputs, setGridInputs] = useState([{ id: 1 }]);

  //   const addGridInput = () => {
  //     setGridInputs([...gridInputs, { id: gridInputs.length + 1 }]);
  //   };

  //   return (
  //     <div className="col-md-3 col-4">
  //       <label className="form-label">Grid Location & Area (SQM)</label>
  //       {gridInputs.map((input, i) => (
  //         <div key={input.id} className="d-flex align-items-center gap-3 mb-2">
  //           <select
  //             className="form-select p-2"
  //             name={`grid_location[${index}][${i}]`}
  //           >
  //             <option selected disabled>
  //               Select Grid
  //             </option>
  //             {Locations?.map((location, j) => (
  //               <option key={j} value={location.camera_locations}>
  //                 {location.camera_locations}
  //               </option>
  //             ))}
  //           </select>
  //           <input
  //             type="text"
  //             className="form-control p-2"
  //             placeholder="Area (SQM)"
  //             name={`area[${index}][${i}]`}
  //           />
  //           <button
  //             type="button"
  //             className="btn btn-success btn-sm px-2 py-1"
  //             onClick={addGridInput}
  //           >
  //             +
  //           </button>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  const handleBillDetails = (key, sbill) => {
    Data?.carting_trucks?.map((details, a) => {
      if (details.shipping_bill_number == sbill) {
        document.getElementById(
          `cargo_description_${key}`
        ).value = `${details.commodity_description}`;
        document.getElementById(
          `no_of_pkgs_${key}`
        ).value = `${details.no_of_packages_declared}`;
        document.getElementById(
          `pkgs_weight_${key}`
        ).value = `${details.package_weight}`;
        document.getElementById(
          `pkg_code_${key}`
        ).value = `${details.package_code}`;
      }
    });
  };

  const handleBillPkgW = (key, pkg) => {
    let no_of_pkgs = 0;
    let package_weight = 0;
    let Per_package_weight = 0;

    let shipping_bill_number = document.getElementById(`sbill_${key}`)?.value;

    Data?.carting_shipping_bill_details?.forEach((details) => {
      if (details.shipping_bill_number == shipping_bill_number) {
        package_weight += parseFloat(details.package_weight) || 0;
        no_of_pkgs += parseFloat(details.no_of_packages_declared) || 0;
      }
    });
    if (
      package_weight &&
      no_of_pkgs &&
      package_weight != 0 &&
      no_of_pkgs != 0
    ) {
      Per_package_weight += package_weight / no_of_pkgs.toFixed(2);
    }

    let weightInput = document.getElementById(`pkgs_weight_${key}`);

    if (weightInput) {
      if (pkg && pkg != 0) {
        weightInput.value = (Per_package_weight * pkg).toFixed(2);
      } else if (pkg == 0) {
        weightInput.value = 0;
      } else {
        weightInput.value = parseFloat(Per_package_weight) || 0;
      }
    } else {
      console.log("Package weight input not found!");
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
                <div className="container">
                  {CrnNo && TallySheet ? (
                    <div className="row justify-content-center">
                      <div className="col-lg-10 col-md-11">
                        <div className="text-end">
                          {isFinalSubmit ? (
                            <button
                              onClick={() => {
                                if (iframeRef.current) {
                                  iframeRef.current.contentWindow.print();
                                }
                              }}
                              className="btn btn-label-primary mb-2"
                            >
                              Print
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="btn btn-primary mb-2"
                                onClick={handleFinalSubmit}
                              >
                                Final Submit
                              </button>
                              <a
                                href={`?isFinalSubmit=0&id=${ID}&crn_number=${CrnNo}`}
                                className="btn btn-primary mb-2 ms-2"
                              >
                                Edit
                              </a>
                            </>
                          )}
                          <a href="?" className="btn btn-primary mb-2 ms-2">
                            Search Another
                          </a>
                          {/* <Link
    to={"/delivery"}
    className="btn btn-primary mb-2 ms-2"
  >
    Go Back
  </Link> */}
                        </div>
                        <div className="" style={{ width: 789, height: 1099 }}>
                          <iframe
                            ref={iframeRef}
                            src={`/carting/tally_sheet?crn_number=${CrnNo}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: "white",
                            }}
                            title="A4 Iframe"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  ) : Data && CrnNo ? (
                    <>
                      <form action="" onSubmit={handleSubmitForm}>
                        <div className="text-end">
                          <a href="?"
                            className="btn btn-primary mb-2 ms-2"
                          >
                            Search Another
                          </a>
                          <Link
                            to={"/carting"}
                            className="btn btn-primary mb-2 ms-2"
                          >
                            Go Back
                          </Link>
                        </div>
                        <div className="row">
                          <h4 className="text-primary mb-3">Container Details</h4>
                          <div className="card">
                            <div className="card-body">
                              <div className="row">
                                <input
                                  type="hidden"
                                  name="id"
                                  defaultValue={Data?.id}
                                />
                                <div className="col-4">
                                  <label className="form-label">Crn No</label>
                                  <input
                                    type="text"
                                    className="form-control p-2"
                                    defaultValue={Data?.crn_number}
                                    readOnly
                                  />
                                </div>
                                {Data?.carting_containers?.map((container, i) => (
                                  <div className="col-8 d-flex gap-2">
                                    <div className="col">
                                      <label className="form-label">
                                        Container No
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control p-2"
                                        defaultValue={container?.container_number}
                                        readOnly
                                      />
                                    </div>
                                    <div className="col">
                                      <label className="form-label">
                                        Container Size
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control p-2"
                                        defaultValue={container?.container_size}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                ))}

                                <div className="col-4">
                                  <label className="form-label">
                                    Start Date Time
                                  </label>
                                  <input
                                    type="datetime-local"
                                    className="form-control p-2"
                                    name="start_time"
                                    defaultValue={formatToDateTimeLocal(today)}
                                  />
                                </div>
                                <div className="col-4">
                                  <label className="form-label">
                                    End Date Time
                                  </label>
                                  <input
                                    type="datetime-local"
                                    className="form-control p-2"
                                    name="end_time"
                                    defaultValue={formatToDateTimeLocal(today)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <h4 className="text-primary mb-3">Bill Details</h4>
                          {Array.from({ length: TotalTruck }, (_, i) => (
                            <div key={i} className="card card-body my-3">
                              <div className="d-flex gap-3 flex-row overflow-auto">
                                <div className="col-md-2 col-3">
                                  <label
                                    htmlFor="truck_number"
                                    className="form-label"
                                  >
                                    Truck Number
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control p-2"
                                    name={`truck_number[${i}]`}
                                    defaultValue={Data?.carting_trucks[i]?.truck_number ?? null}
                                  />
                                </div>
                                <div className="col-md-2 col-3">
                                  <label htmlFor="billNo" className="form-label">Bill Number</label>
                                  <select
                                    name={`boe[${i}]`}
                                    className="form-select p-2"
                                    onChange={(e) => handleBillDetails(i, e.target.value)}
                                    id={`boe_${i}`}
                                    defaultValue={Data?.carting_trucks[i]?.sbill || ""}
                                  >
                                    <option value="" disabled>Select Bill</option>
                                    {Data?.carting_trucks
                                      ?.filter((truck) => truck.sbill) // Only include trucks with valid sbill
                                      .map((truck, k) => (
                                        <option key={k} value={truck.sbill}>
                                          {truck.sbill}
                                        </option>
                                      ))}
                                  </select>
                                </div>

                                <div className="col-md-3 col-4">
                                  <label className="form-label">
                                    Cargo Description (Code)
                                  </label>
                                  <input
                                    type="hidden"
                                    className="form-control p-2"
                                    name={`pkg_code[${i}]`}
                                    id={`pkg_code_${i}`}
                                    readOnly
                                    defaultValue={Data?.carting_trucks[i]?.pkg_code ?? null}
                                  />
                                  <input
                                    type="text"
                                    className="form-control p-2"
                                    name={`cargo_description[${i}]`}
                                    id={`cargo_description_${i}`}
                                    readOnly
                                    defaultValue={Data?.carting_trucks[i]?.cargo_description ?? null}
                                  />
                                </div>
                                <div className="col-md-2 col-3">
                                  <label className="form-label">No of Pkgs</label>
                                  <input
                                    type="number"
                                    className="form-control p-2"
                                    id={`no_of_pkgs_${i}`}
                                    name={`no_of_pkgs[${i}]`}
                                    onChange={(e) =>
                                      handleBillPkgW(i, e.target.value)
                                    }
                                    defaultValue={Data?.carting_trucks[i]?.no_of_pkgs ?? null}
                                  />
                                </div>
                                <div className="col-md-2 col-3">
                                  <label className="form-label">Pkg Weight</label>
                                  <input
                                    type="text"
                                    className="form-control p-2"
                                    id={`pkgs_weight_${i}`}
                                    name={`pkgs_weight[${i}]`}
                                    defaultValue={Data?.carting_trucks[i]?.pkgs_weight ?? null}
                                  />
                                </div>
                                <GridComponent
                                  index={i}
                                  data={Data?.carting_trucks?.[i] ?? { grid_area: [] }}
                                />
                              </div>
                            </div>
                          ))}

                          <div className="col-12 my-2 text-end">
                            <button
                              type="button"x
                              className="btn btn-sm btn-primary"
                              onClick={() => setTotalTrucks(TotalTruck + 1)}
                            >
                              Add Truck
                            </button>
                          </div>
                          <hr />
                          <button className="btn btn-primary w-25 mt-3">
                            Save Job
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="row justify-content-center align-items-center" style={{ height: "70vh" }}>
                      <div className="col-md-6 col-8">
                        <div className="card my-3">
                          <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                          <h4 className="text-left text-primary">Carting</h4>
                            <div className="text-end">
                              <Link
                                to={"/carting"}
                                className="btn btn-label-danger btn-sm"
                              >
                                Back
                              </Link>
                          </div>
                            
                            </div>
                        
                            <form action="" onSubmit={GetFormData}>
                              <p>Please Enter CRN Number to Fetch Data</p>
                              <div className="form-floating form-floating-outline mb-6">
                                <input
                                  type="text"
                                  className="form-control mb-3"
                                  placeholder="Enter CRN Number"
                                  name="crn_number"
                                  onChange={(e) =>
                                  (e.target.value =
                                    e.target.value.toUpperCase())
                                  }
                                />
                                <label htmlFor="crn_number">CRN Number</label>
                              </div>
                              <button
                                type="submit"
                                className="btn btn-primary w-100"
                              >
                                Fetch Data
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
