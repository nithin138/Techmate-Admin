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
  const [countData, setCountData] = useState([]);
      const [rejectedCount , setRejectedCount] = useState();
  

  const getData = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    const userData = await JSON.parse(localStorage.getItem("UserData"));
    const userRole = JSON.parse(localStorage.getItem("role_name"));
    let user =
      userRole !== "admin" ? { role: userRole, storeId: userData?._id } : {};

    try {
      await axios
        .get(`${baseURL}/api/categories`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          //console.log(response, "response from product header");
          if (response.status === 200) {
            // Safely count the length of response.data
            //console.log(response.data.categories, "response ");
            const updatedData = response?.data?.length || 0;
        
            //console.log(updatedData, "Total Products Count");
        
            // Set the total count
            setCountData(updatedData);
          }
        });
        
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
              <h6 className="mb-0">Total Categories</h6>
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
