import React, { useEffect, useState } from "react";
import "./EIR.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
export default function EIRMain(data = []) {
  const { Permit } = useParams();
  const [Data,setData] = useState(data.data);

  // useEffect(() => {
  //   GetData(Permit);
  // }, [Permit])

  useEffect(() => {
    console.log("Response from server:", Data);
  }, [Data])

  // const GetData = async (Permit) => {
  //   const url = `https://ctas.live/backend/api/get/permit_detail/${Permit}?gate_no=1&type=IN`;
  //   try {
  //     const response = await axios.get(url, {
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     if (response.data && response.data.data) {
  //       setData(response.data.data);
  //     } else {
  //       Swal.fire({
  //         icon: "Info",
  //         text: `No message returned from the server.`,
  //         timer: 3000,
  //         showConfirmButton: false,
  //       });
  //       console.warn("No data found for the given input.");
  //     }
  //   } catch (error) {
  //     console.error("Error in Permit Data Fetch :", error);
  //     Swal.fire({
  //       icon: "error",
  //       text: `Error in Data Submit: ${error.message}`,
  //       timer: 3000,
  //       showConfirmButton: false,
  //     });
  //   }
  // };

  // const handleFormSubmit =(e)=>{
  //     e.preventDefault();
  //     const formData = new FormData(e.target);
  //     const formValues = Object.fromEntries(formData.entries());

  //     console.log(formValues);
  //     alert('success');
  // }


  return (
    <>
      <div className="A5 m-auto main-p p-2 px-5">
        <form className="row justify-content-center align-items-center" >
          <div className="text-end position-absolute top-0 right-0">
            {/* <button className="btn btn-label-info btn-sm m-3" type="submit" >Close</button> */}
            {/* <a href="?" className="btn btn-danger mt-2 me-2">Close</a> */}
          </div>
          <div className="col-8 text-center  mb-5">
            <h1 className="m-0 h1">SUNIC TECHNOLOGIES PVT. LTD.</h1>
            <p className="m-0 address">
              Unit No 561, Tower B, Bl, 5th Floor, Spaze I-tech Park, Sector-49,
              Sohna Road, Gurgaon -122002 Haryana
            </p>
          </div>
          <div className="col-12  mb-4">
            <div className="row">
              <div className="col-6">
                <p>
                  <b>No.</b>
                </p>
              </div>
              <div className="col-6 text-end">
                <b className="fs-small">(EQUIPMENT INTERCHANGE REPORT)</b>
              </div>
            </div>
          </div>
          <div className="col-12    mb-3">
            <div className="row">
              <div className="col-6">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Date.</label>
                  <input
                    type="text"
                    className="form-control border-bottom-dash"
                    name="date"
                  />
                </div>
              </div>
              <div className="col-6 text-end">
                <div className="d-flex align-items-end justify-content-end">
                  <label htmlFor="">Time Gate Out.</label>
                  <input
                    type="text"
                    className="form-control border-bottom-dash"
                    name="gate_out_time"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Container&nbsp;No.</label>
              <input type="text" className="form-control border-bottoms"  defaultValue={Data && (Data.container_no ?? Data.ctrno)} name="container_no" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="row">
              <div className="col-7">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Size</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data && (Data.container_size ?? Data.ctrsize)} name="container_size" />
                </div>
              </div>
              <div className="col-5">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Type</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data && (Data.container_type ?? Data.ctrtype)} name="container_type" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="row">
              <div className="col-7">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Line</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data && Data.gate_no} name="gate_no"  />
                </div>
              </div>
              <div className="col-5">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Lorry/WagonNo.</label>
                  <input type="text" className="form-control border-bottoms" defaultValue={Data && (Data.vehicle_no ?? Data.wagon_no)} name="vehicle_no"  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="row">
              <div className="col-5">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Status</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data && Data.is_container_damage} name="containerStatus" />
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Seal&nbsp;No.&nbsp;(1)</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data && Data.seal_1_no} name="seal_1_no" />
                </div>
              </div>
              <div className="col-3">
                <div className="d-flex align-items-end">
                  <label htmlFor="">(2)</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data && Data.seal_2_no} name="seal_2_no" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Remark</label>
              <input type="text" className="form-control border-bottoms" defaultValue={Data && Data.remark} name="damage_remark" />
            </div>
          </div>

          {/* <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Rear</label>
              <input type="text" className="form-control border-bottoms" name="rear" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Right</label>
              <input type="text" className="form-control border-bottoms" name="right" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Left</label>
              <input type="text" className="form-control border-bottoms" name="lift" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Front</label>
              <input type="text" className="form-control border-bottoms" name="front" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Roof</label>
              <input type="text" className="form-control border-bottoms" name="roof" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Interior</label>
              <input type="text" className="form-control border-bottoms" name="interior" />
            </div>
          </div>
          <div className="col-12 mb-5">
            <div className="d-flex align-items-end">
              <label htmlFor="">Floor</label>
              <input type="text" className="form-control border-bottoms" name="floor" />
            </div>
          </div> */}
          <div className="col-12 mb-4">
            <div className="d-flex align-items-end">
              <label htmlFor="">
                IMO&nbsp;Stickers&nbsp;:&nbsp;Found/Not&nbsp;Found
              </label>
              <input type="text" className="form-control border-bottoms" name="imo_stickers" />
              <label htmlFor="">Removed/Not&nbsp;Removed</label>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="row">
              <div className="col-7">
                <label htmlFor="">
                  Fot O.T Container : 1 Tarpaulin available
                </label>
              </div>
              <div className="col-5">
                <label htmlFor="">Yes/ No.</label>
              </div>
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="d-flex align-items-end">
              <label htmlFor="">Condition&nbsp;of&nbsp;Tarpaulin</label>
              <input type="text" className="form-control border-bottoms" name="condition_of_tarpaulin" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">No.&nbsp;of&nbsp;Rods&nbsp;Available</label>
              <input type="text" className="form-control border-bottoms" name="no_of_rods_available" />
              <label htmlFor="">Fitted/Loose</label>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="row">
              <div className="col-12">
                <label htmlFor="">CSC Details :</label>
              </div>
            </div>
          </div>
          <div className="col-12  mb-4">
            <div className="row">
              <div className="col-5">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Date&nbsp;of&nbsp;Mfg.</label>
                  <input type="text" className="form-control border-bottoms" name="date_of_mfg" />
                </div>
              </div>
              <div className="col-7">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Next&nbsp;Date&nbsp;of&nbsp;Exmm.</label>
                  <input type="text" className="form-control border-bottoms" name="next_date_of_exm" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row justify-content-end">
              <div className="col-12 text-end">
                <b>For Sunic Technologies Pvt. Ltd.</b>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row justify-content-between align-items-end">
              <div className="col-6 ">
                <p className="m-0">Signature of</p>
                <p className="m-0">Driver/CHA Rep.</p>
              </div>
              <div className="col-6 text-end">
                <p className="m-0">Authorised Signatory</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
