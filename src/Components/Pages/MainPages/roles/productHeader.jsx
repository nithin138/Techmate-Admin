import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import axios from "axios";
import { baseURL } from "../../../../Services/api/baseURL";
import square from "../../../../../src/assets/images/sqaurebox.svg";
import { useDataContext } from "../../../../context/hooks/useDataContext";

function ProductsHeader() {
  const { productsData } = useDataContext();

  // State Variables with Proper Naming
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [completedReferrals, setCompletedReferrals] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);

  const fetchReferralStats = async () => {
    const token = JSON.parse(localStorage.getItem("token"));

    try {
      const response = await axios.get(`${baseURL}/api/refer/referal-stats`, {
        headers: { Authorization: `${token}` },
      });

      if (response.status === 200) {
        const data = response.data;
        setTotalReferrals(data?.totalReferrals || 0);
        setCompletedReferrals(data?.completedReferrals || 0);
        setTotalWithdrawals(data?.totalWithdrawals || 0);
      }
    } catch (error) {
      console.error("Error fetching referral stats:", error);
    }
  };

  useEffect(() => {
    fetchReferralStats();
  }, [productsData]);

  return (
    <Row>
      {/* Total Referrals */}
      <Col xl="3" sm="6">
        <Card className="social-widget widget-hover">
          <CardBody>
            <div className="d-flex align-items-center gap-2">
              <img src={square} alt="" className="square_box" />
              <h6 className="mb-0">Total Referrals Happened</h6>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <h5 className="fw-600 f-16 mb-0">{totalReferrals}</h5>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Completed Referrals */}
      <Col xl="3" sm="6">
        <Card className="social-widget widget-hover">
          <CardBody>
            <div className="d-flex align-items-center gap-2">
              <img src={square} alt="" className="square_box" />
              <h6 className="mb-0">Completed Referrals</h6>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <h5 className="fw-600 f-16 mb-0">{completedReferrals}</h5>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Total Withdrawal Requests */}
      <Col xl="3" sm="6">
        <Card className="social-widget widget-hover">
          <CardBody>
            <div className="d-flex align-items-center gap-2">
              <img src={square} alt="" className="square_box" />
              <h6 className="mb-0">Total Withdrawal Requests</h6>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <h5 className="fw-600 f-16 mb-0">{totalWithdrawals}</h5>
            </div>
          </CardBody>
        </Card>
      </Col>


    </Row>
  );
}

export default ProductsHeader;
