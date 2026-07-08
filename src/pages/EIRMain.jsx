import React, { useEffect, useState ,forwardRef} from "react";
import "./EIR.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { formatToDate, formatToDateTime, formatToTime } from "./main/formatToDateTime";

const EIRMain = forwardRef(({ data }, ref) => {
  const { Permit } = useParams();
  const [Data, setData] = useState(data);

  return (
    <div ref={ref} className="A5 m-auto main-p p-2 px-5">
        <div className="row justify-content-center align-items-center" >
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
                  <b>No. 
                    {/* {Data?.id??null}  */}
                    </b>
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
                    name="eir_date"
                    defaultValue={formatToDate(Data?.created_at??null)}
                  />
                </div>
              </div>
              <div className="col-6 text-end">
                <div className="d-flex align-items-end justify-content-end">
                  <label htmlFor="">Time</label>
                  <input
                    type="text"
                    className="form-control border-bottom-dash"
                    name="eir_time"
                    defaultValue={formatToTime(Data?.created_at??null)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Container&nbsp;No.</label>
              <input type="text" className="form-control border-bottoms"  defaultValue={Data && (Data.container_no ?? Data.ctrno)} name="eir_container_no" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="row">
              <div className="col-7">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Size</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data && (Data.container_size ?? Data.ctrsize)} name="eir_container_size" />
                </div>
              </div>
              <div className="col-5">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Type</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data && (Data.container_type ?? Data.ctrtype)} name="eir_container_type" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="row">
              <div className="col-7">
                <div className="d-flex align-items-end">
                  <label htmlFor="">SLine</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data?.slinecd??null} name="eir_gate_no"  />
                </div>
              </div>
              <div className="col-5">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Lorry/WagonNo.</label>
                  <input type="text" className="form-control border-bottoms" defaultValue={Data && (Data.vehicle_no ?? Data.wagon_no)} name="eir_vehicle_no"  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="row">
              <div className="col-5">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Status</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data && Data.is_container_damage} name="eir_containerStatus" />
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Seal&nbsp;No.&nbsp;(1)</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data && Data.seal_1_no} name="eir_seal_1_no" />
                </div>
              </div>
              <div className="col-3">
                <div className="d-flex align-items-end">
                  <label htmlFor="">(2)</label>
                  <input type="text" className="form-control border-bottoms"  defaultValue={Data && Data.seal_2_no} name="eir_seal_2_no" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Remark</label>
              <input type="text" className="form-control border-bottoms" defaultValue={Data?.damage_remark??null} name="eir_damage_remark" />
            </div>
          </div>

          {/* <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Rear</label>
              <input type="text" className="form-control border-bottoms" name="eir_rear" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Right</label>
              <input type="text" className="form-control border-bottoms" name="eir_right" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Left</label>
              <input type="text" className="form-control border-bottoms" name="eir_lift" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Front</label>
              <input type="text" className="form-control border-bottoms" name="eir_front" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Roof</label>
              <input type="text" className="form-control border-bottoms" name="eir_roof" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">Interior</label>
              <input type="text" className="form-control border-bottoms" name="eir_interior" />
            </div>
          </div>
          <div className="col-12 mb-5">
            <div className="d-flex align-items-end">
              <label htmlFor="">Floor</label>
              <input type="text" className="form-control border-bottoms" name="eir_floor" />
            </div>
          </div> */}
          <div className="col-12 mb-4">
            <div className="d-flex align-items-end">
              <label htmlFor="">
                IMO&nbsp;Stickers&nbsp;:&nbsp;Found/Not&nbsp;Found
              </label>
              <input type="text" className="form-control border-bottoms" name="eir_imo_stickers" />
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
              <input type="text" className="form-control border-bottoms" name="eir_condition_of_tarpaulin" />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="d-flex align-items-end">
              <label htmlFor="">No.&nbsp;of&nbsp;Rods&nbsp;Available</label>
              <input type="text" className="form-control border-bottoms" name="eir_no_of_rods_available" />
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
                  <input type="text" className="form-control border-bottoms" name="eir_date_of_mfg" />
                </div>
              </div>
              <div className="col-7">
                <div className="d-flex align-items-end">
                  <label htmlFor="">Next&nbsp;Date&nbsp;of&nbsp;Exmm.</label>
                  <input type="text" className="form-control border-bottoms" name="eir_next_date_of_exm" />
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
        </div>
    </div>
  );
});

export default EIRMain;