import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import DataTableComponent from "./OrdersTable";
import "./style.scss";
import square from "../../../../../src/assets/images/sqaurebox.svg";
import axios from "axios";
import { baseURL, orderURL } from "../../../../Services/api/baseURL";

const Orders = () => {
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const [applicationApproved, setApplicationApproved] = useState(0);
  const [applicationPending, setApplicationPending] = useState(0);
  const [applicationRejected, setApplicationRejected] = useState(0);
  const getCount = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/business/stats`);
      
      if (response && response.status === 200) {
        const data = response.data;
        setTotalBusinesses(data.totalBusinesses);
        setApplicationApproved(data.applicationApproved);
        setApplicationPending(data.applicationPending);
        setApplicationRejected(data.applicationRejected);
      }
    } catch (error) {
      console.error("Error fetching business stats:", error);
    }
  };
  

  useEffect(() => {
    getCount();
  }, []);

  return (
    <Fragment>
      <Container fluid={true} style={{ paddingTop: "30px" }}>
        <Row>
          <Col xl="3" sm="6">
            <Card className="social-widget widget-hover">
              <CardBody>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <img src={square} alt="" className="square_box" />
                    <h6 className="mb-0"> Total Business Records</h6>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <h5 className="fw-600 f-16 mb-0">
                    {totalBusinesses}
                  </h5>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" sm="6">
            <Card className="social-widget widget-hover">
              <CardBody>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <img src={square} alt="" className="square_box" />
                    <h6 className="mb-0">Application approved</h6>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <h5 className="fw-600 f-16 mb-0">
                    {applicationApproved}
                  </h5>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" sm="6">
            <Card className="social-widget widget-hover">
              <CardBody>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <img src={square} alt="" className="square_box" />
                    <h6 className="mb-0"> Application pending</h6>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <h5 className="fw-600 f-16 mb-0">
                    {applicationPending}
                  </h5>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" sm="6">
            <Card className="social-widget widget-hover">
              <CardBody>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <img src={square} alt="" className="square_box" />
                    <h6 className="mb-0"> Application Rejected</h6>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <h5 className="fw-600 f-16 mb-0">
                    {applicationRejected}
                  </h5>
                </div>
              </CardBody>
            </Card>
          </Col>

        </Row>

        <Row>
          <Col sm="12">
            <Card>
              <DataTableComponent />
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Orders;
