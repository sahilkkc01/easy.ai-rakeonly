import React, { useEffect, useRef, useState } from "react";
import ExportMap from "./ExportMap";
import MezzanineMap from "./MezzanineMap";
import ImportMap from "./ImportMap";
import OycMap from "./OycMap";

const MapModal = ({
  isVisible,
  onClose,
  MapName,
  setActiveGridSelection,
  activeGridSelection,
  setModalVisible2,
  SelectedGrids,
  setSelectedGrids,
}) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    if (isVisible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const renderMap = () => {
    switch (MapName) {
      case "Import":
        return (
          <ImportMap
            setActiveGridSelection={setActiveGridSelection}
            activeGridSelection={activeGridSelection}
            onClose={onClose}
            setModalVisible2={setModalVisible2}
            SelectedGrids={SelectedGrids}
            setSelectedGrids={setSelectedGrids}
          />
        );
      case "Export":
        return (
          <ExportMap
            setActiveGridSelection={setActiveGridSelection}
            activeGridSelection={activeGridSelection}
            onClose={onClose}
            setModalVisible2={setModalVisible2}
          />
        );
      case "Mazzanine":
        return (
          <MezzanineMap
            setActiveGridSelection={setActiveGridSelection}
            activeGridSelection={activeGridSelection}
            onClose={onClose}
            setModalVisible2={setModalVisible2}
          />
        );
      case "OYC":
        return (
          <OycMap
            setActiveGridSelection={setActiveGridSelection}
            activeGridSelection={activeGridSelection}
            onClose={onClose}
            setModalVisible2={setModalVisible2}
          />
        );
      default:
        return <p>No map selected.</p>;
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1 }}
      ></div>
      <div
        className="modal-dialog modal-xl"
        ref={modalRef}
        tabIndex={-1}
        style={{ zIndex: 99 }}
      >
        <div className="modal-content">
          <div className="modal-header bg-label-primary py-2">
            <h1 className="modal-title fs-5">{MapName} Map</h1>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">{renderMap()}</div>
          <div className="modal-footer bg-label-primary py-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapAreaModal = ({
  isVisible2,
  onClose2,
  activeGridSelection,
  setGridArea,
  gridArea,
  SelectedGrids,
  setSelectedGrids,
}) => {
  const modalRef = useRef();
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (
      activeGridSelection?.warehouse_name == "Export" ||
      activeGridSelection?.warehouse_name == "Import"
    ) {
      setRow(4);
      setCol(5);
      setWidth("50px");
      setHeight("10vh");
    } else if (activeGridSelection?.warehouse_name == "OYC") {
      setRow(1);
      setCol(1);
      setWidth("250px");
      setHeight("40vh");
    } else if (activeGridSelection?.warehouse_name == "Mazzanine") {
      if (activeGridSelection?.area_boxes == "20") {
        setRow(4);
        setCol(5);
      } else if (activeGridSelection?.area_boxes == "2") {
        setRow(1);
        setCol(2);
      } else {
        setRow(1);
        setCol(1);
      }
      setWidth("250px");
      setHeight("40vh");
    } else {
      setRow(4);
      setCol(5);
      setWidth("50px");
      setHeight("10vh");
    }
  }, [activeGridSelection]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose2();
    };

    if (isVisible2) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible2, onClose2]);

  useEffect(() => {
    if (isVisible2 && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isVisible2]);

  if (!isVisible2) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="modal-backdrop fade show"
        onClick={onClose2}
        style={{ zIndex: 1 }}
      ></div>
      <div
        className="modal-dialog"
        ref={modalRef}
        tabIndex={-1}
        style={{ zIndex: 99 }}
      >
        <div className="modal-content">
          <div className="modal-header bg-label-primary py-2">
            <h1 className="modal-title fs-5">
              {activeGridSelection?.location_code} Map
            </h1>
            <button
              type="button"
              className="btn-close"
              onClick={onClose2}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <h2>{activeGridSelection?.location_code}</h2>
            {/* <p>{JSON.stringify(gridArea)}</p> */}
            <div className="d-flex align-items-center justify-content-center">
              <div style={{ width: "260px" }}>
                <div className="main bg-dark p-1 d-flex flex-column border-light border border-2 position-relative w-auto">
                  {[...Array(row)].map((_, rowIndex) => (
                    <div key={rowIndex} className="d-flex">
                      {[...Array(col)].map((_, colIndex) => {
                        const cellValue = rowIndex * 5 + colIndex + 1;
                        const isSelected = (
                          Array.isArray(gridArea) ? gridArea : []
                        ).includes(cellValue);
                        let color = "bg-secondary";
                        if (
                          activeGridSelection?.ocr_occupied_area &&
                          activeGridSelection?.ocr_occupied_area >= cellValue
                        ) {
                          color = "bg-info";
                        }
                        if (
                          activeGridSelection?.occupied_area &&
                          activeGridSelection?.occupied_area >= cellValue
                        ) {
                          color = "bg-primary";
                        }
                        if (isSelected) {
                          color = "bg-danger";
                        }
                        return (
                          <button
                            key={colIndex}
                            className={`border border-light rounded text-white d-flex align-items-center justify-content-center bg-secondary
                                ${color}
                                `}
                            style={{
                              height: height,
                              width: width,
                              fontSize: "18px",
                            }}
                            onClick={() => {
                              if (
                                activeGridSelection?.occupied_area < cellValue
                              ) {
                                setGridArea(cellValue);
                              }
                            }}
                          >
                            {activeGridSelection?.warehouse_name == "OYC" ||
                            (activeGridSelection?.warehouse_name ==
                              "Mazzanine" &&
                              activeGridSelection?.area_boxes != "20")
                              ? activeGridSelection?.location_code
                              : cellValue}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer bg-label-primary py-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose2();
                // setSelectedGrids((prev) => {
                //   const locationCode = activeGridSelection?.new_location_code;
                //   const SelectedAreas = gridArea;
                //   if (!locationCode) return prev;
                //   const existingValues = prev[locationCode] || [];
                //   let updatedValues = [];
                //   if (existingValues.includes(SelectedAreas)) {
                //     updatedValues = existingValues.filter(
                //       (v) => v !== SelectedAreas
                //     );
                //   } else {
                //     updatedValues = [...existingValues, SelectedAreas];
                //   }
                //   return {
                //     ...prev,
                //     [locationCode]: updatedValues,
                //   };
                // });
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MapModal, MapAreaModal };
