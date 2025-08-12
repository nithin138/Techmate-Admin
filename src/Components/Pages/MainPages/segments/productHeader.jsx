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
  const [countData, setCountData] = useState('');
  const getData = async () => {
    try {
      await axios
        .get(`${baseURL}/api/segments`)
        .then((response) => {
          //console.log(response, "response from product header");
          if (response.status === 200) {
            let updatedData = response?.data?.categories?.length;
           //console.log(updatedData);
            setCountData(updatedData);
          }})
    }
     catch (error) {
      console.error(error);
    }
  };
 
  useEffect(() => {
    getData();
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
              <h6 className="mb-0">Total Service Categories</h6>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <h5 className="fw-600 f-16 mb-0">{countData}</h5>
          </div>
        </CardBody>
      </Card>
      </Col>
      
      </Row>
    </>
  );
}

export default ProductsHeader;
