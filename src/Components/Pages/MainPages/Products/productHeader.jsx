import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from "reactstrap";
import { H3, H5, H6, P } from "../../../../AbstractElements";
import axios from "axios";
import { baseURL } from "../../../../Services/api/baseURL";
import CategoryCountCard from "../../../CategoryCountCard";
import square from "../../../../../src/assets/images/sqaurebox.svg";
import { useDataContext } from "../../../../context/hooks/useDataContext";

function ProductsHeader() {
  const { productsData } = useDataContext();
  const [pendingCount,setPendingcount] = useState();
    const [rejectedCount , setRejectedCount] = useState();
    const [totalCount,setTotalCount] = useState();
    const [approvedCount,setApprovedCount] = useState()
  


  const getPendingProductData = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));


    try {
      await axios
        .get(`${baseURL}/api/products/pending`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          //console.log(response, "response from product header");
          if (response.status === 200) {
            // Ensure response.data is an array before accessing length
            setTotalCount(response?.data?.totalCount )
            setPendingcount(response?.data?.pendingCount);
            setRejectedCount(response?.data?.rejectedCount); 
            setApprovedCount(response?.data?.approvedCount);        }
        });
    }
     catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getPendingProductData();
  }, [productsData]);

  return (
    <>
      {/* <CategoryCountCard data={countData} /> */}
      <Row>
      <Col xl="3" sm="6">
            <Card className='social-widget widget-hover'>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <img src={square} alt="" className="square_box" />
              <h6 className="mb-0">Total Products</h6>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <h5 className="fw-600 f-16 mb-0">{totalCount}</h5>
          </div>
        </CardBody>
      </Card>
      </Col>
      <Col xl="3" sm="6">
            <Card className='social-widget widget-hover'>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <img src={square} alt="" className="square_box" />
              <h6 className="mb-0">Approved Products</h6>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <h5 className="fw-600 f-16 mb-0">{approvedCount}</h5>
          </div>
        </CardBody>
      </Card>
      </Col>
      <Col xl="3" sm="6">
            <Card className='social-widget widget-hover'>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <img src={square} alt="" className="square_box" />
              <h6 className="mb-0">Approval Pending Products</h6>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <h5 className="fw-600 f-16 mb-0">{pendingCount}</h5>
          </div>
        </CardBody>
      </Card>
      </Col>
       <Col xl="3" sm="6">
                  <Card className='social-widget widget-hover'>
                <CardBody>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <img src={square} alt="" className="square_box" />
                      <h6 className="mb-0">Rejected Products</h6>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <h5 className="fw-600 f-16 mb-0">{rejectedCount}</h5>
                  </div>
                </CardBody>
              </Card>
            </Col>
      </Row>
    </>
  );
}

export default ProductsHeader;
