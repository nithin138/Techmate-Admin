import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import axios from "axios";
import { baseURL } from "../../../../Services/api/baseURL";
import square from "../../../../../src/assets/images/sqaurebox.svg";
import { useDataContext } from "../../../../context/hooks/useDataContext";

const labelMap = {
  referralReward: "Points per Refer",
  amountPerCoin: "Amount Per Coin",
  maxRewardPoints: "Maximum Withdrawal Points",
  minRewardPoints: "Minimum Withdrawal Points"
};

function ProductsHeader() {
  const { productsData } = useDataContext();
  const [configData, setConfigData] = useState({});

  const fetchReferralStats = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.get(`${baseURL}/api/config/get-configs`, {
        headers: { Authorization: `${token}` },
      });

      if (response.status === 200) {
        setConfigData(response.data?.config || {});
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
      {Object.entries(labelMap).map(([key, label]) => (
        <Col xl="3" sm="6" key={key}>
          <Card className="social-widget widget-hover">
            <CardBody>
              <div className="d-flex align-items-center gap-2">
                <img src={square} alt="" className="square_box" />
                <h6 className="mb-0">{label}</h6>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <h5 className="fw-600 f-16 mb-0">
                  {configData[key] !== undefined ? configData[key] : 0}
                </h5>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ProductsHeader;
