import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleMap, useJsApiLoader, Marker, OverlayView } from "@react-google-maps/api";
import Header from "./main/header";
import Nav from "./main/nav";
import Footer from "./main/footer";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const containerStyle = {
    width: "96%",
    height: "70vh",
};

const center = {
    lat: 28.5116,  // Default latitude
    lng: 77.2878,  // Default longitude
};

const GoogleMapComponent = () => {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [Data, setData] = useState([]);
    //   equipment_id
    const equipment_id = localStorage.getItem("equipment_id");

    // ✅ Use `useJsApiLoader` to ensure Google Maps API is loaded
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDPMF7fzNp0C0PJbwtSFQNf1icTv2ceO4c",
    });

    useEffect(() => {
        GetData();
    }, []);

    const GetData = async () => {
        // setLoading(true);
        // const url = `http://192.168.1.4:8000/api/get/rst/application/jobs?equipment_id=${equipment_id}`;
        const url = `https://ctas.live/backend/api/get/rst/application/jobs?equipment_id=${equipment_id}`;
        try {
          const response = await axios.get(url);
          if (response.data && response.data.status == "success") {
            setData(response.data);
            
          } else {
            setData([]);
            Swal.fire({
              icon: "Info",
              text: `Something Want Wrong..! `,
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

    const CustomMarker = ({ position, number, image='rst.png' }) => {
        return (
            <OverlayView
                position={position}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
                <div
                    style={{
                        position: "relative",
                        width: "50px",
                        height: "50px",
                        backgroundImage: `url(/${image})`,
                        backgroundSize: "cover",
                        textAlign: "center",
                        lineHeight: "50px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "white",
                        borderRadius: "5%",
                        border: "2px solid blue",
                    }}
                >
                    {number}
                </div>
            </OverlayView>
        );
    };

    const LocationMarker = ({ position, number, image='location.png' }) => {
        return (
            <OverlayView
                position={position}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
                <div
                    style={{
                        position: "relative",
                        width: "30px",
                        height: "30px",
                        backgroundImage: `url(/${image})`,
                        backgroundSize: "cover",
                        textAlign: "center",
                        lineHeight: "30px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "white",
                        borderRadius: "5%",
                        // border: "1px solid red",
                    }}
                >
                    {number}
                </div>
            </OverlayView>
        );
    };

    // ✅ Prevent rendering until Google Maps is fully loaded
    if (!isLoaded) return <p>Loading map...</p>;

    return (
        <>
            {/* <div>
            ah
            {JSON.stringify(equipments[0])}
        </div> */}

            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    <Header />
                    <div className="layout-page">
                        <Nav />
                        <div className="content-wrapper">
                            <ul className="nav nav-pills ">

                                <li className="nav-item  pe-3 mt-5">
                                    <Link to='/Rst' class="btn btn-outline-info me-2"> Grid Jobs </Link>
                                    <Link to='/RSTMap' class="btn btn-info"> Map </Link>
                                </li>
                            </ul>
                            <div className="row">
                            {/* {JSON.stringify(Data?.equipment_location.lat)}
                            {JSON.stringify(Data?.equipment_location.lng)} */}
                                <div className="col-md-4">
                                    <h4 className="text-center text-primary">Jobs List</h4>
                                    <div className="card">
                                        <div className="card-body px-1">
                                            <div className="table-responsive text-nowrap">
                                                <table className="table table-hover table-font table-striped">
                                                    <thead>
                                                        <tr className="table-primary">
                                                            <th>S.No.</th>
                                                            <th>Job Type</th>
                                                            <th>C.NO.</th>
                                                            <th>SOURCE</th>
                                                            <th>DEST</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Data.yard_jobs_within_radius?.rake?.map((dd, i) => (
                                                            <tr>
                                                                <td>{i + 1}</td>
                                                                <td>{dd.job_type}</td>
                                                                <td>{dd.container_no}</td>
                                                                <td>{dd.pickup_from}</td>
                                                                <td>{dd.drop_to}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <h4 className="text-center text-primary">Location in Map</h4>
                                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17.5} mapTypeId="satellite">
                                        {/* Default Marker */}
                                        {/* <Marker
                                            position={center}
                                            icon={{
                                                url: "/rst.png",
                                                scaledSize: new window.google.maps.Size(50, 50),
                                            }}
                                        /> */}

                                        {/* Dynamic Markers */}
                                        {Data.yard_jobs_within_radius?.rake.map((dd, index) => {
                                            const lastLatLong = dd.container_master?.last_lat_long; // Ensure it exists
                                            if (!lastLatLong) return null; // Skip if missing data

                                            // Split "28.5126 77.288" into [lat, lng]
                                            const [lat, lng] = lastLatLong.split(" ").map(parseFloat);

                                            return (
                                                <React.Fragment key={index}>
                                                    {lastLatLong} 
                                                    <LocationMarker position={{ lat, lng }} number={null} image='location.gif' />
                                                </React.Fragment>
                                            );
                                        })}

                                        <CustomMarker position={{ lat: parseFloat(Data?.equipment_location?.lat), lng: parseFloat(Data?.equipment_location?.lng) }} number={equipment_id} image='rst.png' />

                                    </GoogleMap>
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


        </>
    );
};

export default GoogleMapComponent;
