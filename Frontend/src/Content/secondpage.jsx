import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const ContainerTracknViewPortal = () => {
  const [visibleSection, setVisibleSection] = useState(null);
  const [formValues, setFormValues] = useState({});

  const handleSectionToggle = (index) => {
    setVisibleSection(visibleSection === index ? null : index);
  };

  const handleReset = () => {
    setFormValues({});
    setVisibleSection(null);
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const sections = [
    {
      title: "Gate-in of trailer for empty container pickup",
      content: (
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="vehicleNumberGateIn">
              <Form.Label>Vehicle number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter vehicle number"
                name="vehicleNumberGateIn"
                onChange={handleChange}
                value={formValues.vehicleNumberGateIn || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="permitGatepassNumberGateIn">
              <Form.Label>Permit/Gatepass number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter permit number"
                name="permitGatepassNumberGateIn"
                onChange={handleChange}
                value={formValues.permitGatepassNumberGateIn || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="yardInTime">
              <Form.Label>Yard in time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="yardInTime"
                onChange={handleChange}
                value={formValues.yardInTime || ""}
              />
            </Form.Group>
          </Row>
        </Form>
      ),
    },
    {
      title: "Empty pickup",
      content: (
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="containerLoadingTime">
              <Form.Label>Container loading time</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter loading time"
                name="containerLoadingTime"
                onChange={handleChange}
                value={formValues.containerLoadingTime || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="equipmentIDEmptyPickup">
              <Form.Label>Equipment ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter equipment ID"
                name="equipmentIDEmptyPickup"
                onChange={handleChange}
                value={formValues.equipmentIDEmptyPickup || ""}
              />
            </Form.Group>
          </Row>
        </Form>
      ),
    },
    {
      title: "Empty container gate-out for factory stuffing",
      content: (
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="vehicleNumberGateOut">
              <Form.Label>Vehicle number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter vehicle number"
                name="vehicleNumberGateOut"
                onChange={handleChange}
                value={formValues.vehicleNumberGateOut || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="permitGatepassNumberGateOut">
              <Form.Label>Permit/Gatepass number</Form.Label>
              <Form.Control
                type="text"
                placeholder="--"
                name="permitGatepassNumberGateOut"
                onChange={handleChange}
                value={formValues.permitGatepassNumberGateOut || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="containerNumber">
              <Form.Label>Container number</Form.Label>
              <Form.Control
                type="text"
                placeholder="--"
                name="containerNumberGateOut"
                onChange={handleChange}
                value={formValues.containerNumberGateOut || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="yardOutTime">
              <Form.Label>Yard OUT time (24 hrs)</Form.Label>
              <Form.Control
                type="text"
                name="yardOutTime"
                placeholder="--"
                onChange={handleChange}
                value={formValues.yardOutTime || ""}
              />
            </Form.Group>
          </Row>
        </Form>
      ),
    },
    {
      title: "Container arrival",
      content: (
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="vehicleNumberArrival">
              <Form.Label>Vehicle number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter vehicle number"
                name="vehicleNumberArrival"
                onChange={handleChange}
                value={formValues.vehicleNumberArrival || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="permitGatepassNumberArrival">
              <Form.Label>Permit/Gatepass number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter permit number"
                name="permitGatepassNumberArrival"
                onChange={handleChange}
                value={formValues.permitGatepassNumberArrival || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="containerNumberArrival">
              <Form.Label>Container number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Container number"
                name="containerNumberArrival"
                onChange={handleChange}
                value={formValues.containerNumberArrival || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="yardInTimeArrival">
              <Form.Label>Yard in time (24 hrs)</Form.Label>
              <Form.Control
                type="text"
                name="yardInTimeArrival"
                placeholder="--"
                onChange={handleChange}
                value={formValues.yardInTimeArrival || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="sealNumber">
              <Form.Label>Seal(s) number</Form.Label>
              <Form.Control
                type="text"
                name="sealNumber"
                placeholder="--"
                onChange={handleChange}
                value={formValues.sealNumber || ""}
              />
            </Form.Group>
          </Row>
        </Form>
      ),
    },
    {
      title: "Container dispatch schedule",
      content: (
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="containerPlanningTime">
              <Form.Label>Container planning time (24 hrs)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Container planning"
                name="containerPlanningTime"
                onChange={handleChange}
                value={formValues.containerPlanningTime || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="PODNumber">
              <Form.Label>POD</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter POD number"
                name="PODNumber"
                onChange={handleChange}
                value={formValues.PODNumber || ""}
              />
            </Form.Group>
          </Row>
        </Form>
      ),
    },
    {
      title: "Container loading for dispatch",
      content: (
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="jobCompletionTime">
              <Form.Label>Job completion time (24 hrs)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter job completion time"
                name="jobCompletionTime"
                onChange={handleChange}
                value={formValues.jobCompletionTime || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="equipmentIDLoading">
              <Form.Label>Equipment ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Equipment ID"
                name="equipmentIDLoading"
                onChange={handleChange}
                value={formValues.equipmentIDLoading || ""}
              />
            </Form.Group>
          </Row>
        </Form>
      ),
    },
    {
      title: "Container dispatch from ICD",
      content: (
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="WTRSubmissionTime">
              <Form.Label>WTR submission time (24 hrs)</Form.Label>
              <Form.Control
                type="text"
                placeholder="--"
                name="WTRSubmissionTime"
                onChange={handleChange}
                value={formValues.WTRSubmissionTime || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="containerNumberDispatch">
              <Form.Label>Container number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Container number"
                name="containerNumberDispatch"
                onChange={handleChange}
                value={formValues.containerNumberDispatch || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="wagonNumber">
              <Form.Label>Wagon number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Wagon number"
                name="wagonNumber"
                onChange={handleChange}
                value={formValues.wagonNumber || ""}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="trainNumber">
              <Form.Label>Train number</Form.Label>
              <Form.Control
                type="text"
                name="trainNumber"
                placeholder="--"
                onChange={handleChange}
                value={formValues.trainNumber || ""}
              />
            </Form.Group>
          </Row>
        </Form>
      ),
    },
  ];

  return (
    <Container fluid className="bg-light py-4">
      <Row className="justify-content-between align-items-center mb-4">
        <Col xs="auto">
          <Button variant="outline-primary" onClick={() => alert("Back clicked!")}>
            &larr; Back
          </Button>
        </Col>
        <Col xs="auto">
          <h3 className="hhh text-center text-success" style={{ cursor: "pointer", transition: "background-color 0.3s", color: "purple" }}>
            Container TracknView Portal
          </h3>
        </Col>
        {/* <Col xs="auto">
          <Button variant="success" disabled>
            <i className="bi bi-file-excel"></i>
          </Button>
        </Col> */}
      </Row>
      <Row className="mb-4">
        <Col>
          <h4 className="text-success" style={{ cursor: "pointer", transition: "background-color 0.3s" }}>Container Information</h4>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="containerNumber">
                <Form.Label>Container Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="UACU3842313"
                  name="containerNumber"
                  onChange={handleChange}
                  value={formValues.containerNumber || ""}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="size">
                <Form.Label>Size (ft)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="20"
                  name="size"
                  onChange={handleChange}
                  value={formValues.size || ""}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="GL"
                  name="type"
                  onChange={handleChange}
                  value={formValues.type || ""}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="transactionType">
                <Form.Label>Transaction Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="EXPORT"
                  name="transactionType"
                  onChange={handleChange}
                  value={formValues.transactionType || ""}
                />
              </Form.Group>
            </Row>
          </Form>
        </Col>
      </Row>

      {sections.map((section, index) => (
        <Row key={index} className="mb-3">
          <Col className="" >
            <div
              className="border p-3 mb-2 bg-white rounded hover-section"
              onClick={() => handleSectionToggle(index)}
              style={{ cursor: "pointer", transition: "background-color 0.3s ", background:"#f6fbef", }}
            >
              <h5 className="d-flex justify-content-between align-items-center ">
                {section.title}
                <span>{visibleSection === index ? "-" : "+"}</span>
              </h5>
            </div>
            <div
              className={`p-3 border bg-light rounded ${visibleSection === index ? 'show' : 'collapse'}`}
              style={{
                maxHeight: visibleSection === index ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.5s ease-in-out',
              }}
            >
              {section.content}
            </div>
          </Col>
        </Row>
      ))}

      <Row className="mt-4">
        <Col className="text-center">
          <Button variant="primary" className="me-3">
            Submit
          </Button>
          <Button variant="danger" onClick={handleReset}>
            Reset
          </Button>
        </Col>
      </Row>
      <footer className="text-center text-success mt-4 "><u>Powered by CTMS. All rights reserved. Copyright © 2024.</u></footer>
    </Container>
  );
};

export default ContainerTracknViewPortal;