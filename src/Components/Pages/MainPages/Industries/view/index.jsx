import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";
// import { H3 } from "../../../../AbstractElements";
import { FaDownload, FaTrash } from "react-icons/fa";
// import dummyImg from "../../../../../src/assets/images/product/1.png";
import { useParams } from "react-router";
import axios from "axios";
import {
  baseURL,
  imageURL,
  orderURL,
} from "../../../../../Services/api/baseURL";
import moment from "moment";
// import star from "../../../../../src/assets/images/Star.svg";
// import { BackgroundColor } from "../../../../../Constant";
const ProductDetails = () => {
  const { id } = useParams();

  //console.log(id);
  const [businessDetails, setBusinessDetails] = useState();
  const getbusinessDetails = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      await axios
        .get(`${baseURL}/api/business/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          //console.log(res);
          if (res && res.status === 200) {
            //console.log(res.data, "data by id for business");
            // let response = res?.data?.data.length > 0 && res.data?.data[0];
            setBusinessDetails(res?.data);
          }
        });
    } catch (err) {
      console.error(err);
    }
  };
  function capitalizeFirstLetter(string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  }
  const statusColors = {
    Approved: "primary",
    pending: "info",
    "on-the-way": "warning",
    delivered: "success",
    Rejected: "danger",
  };
  useEffect(() => {
    if (id) {
      getbusinessDetails();
    }
  }, []);
  const statusKey = businessDetails?.business?.status;
  const color = statusColors[statusKey] || "primary";
  console.log(businessDetails);
  return (
    <>
      <Container fluid>
        <div className="page-title">
          <Row className="align-items-center">
            <Col xs="12">
              <p className="mb-0 d-flex align-items-center">
                Order Id:{" "}
                <b className="ms-1"> {businessDetails?.business?._id}</b>{" "}
                <span style={{ color: "#E1E6EF" }} className="mx-2">
                  {" "}
                  |{" "}
                </span>{" "}
                Application Status : {" "}
                <span
                  style={{ fontSize: "13px" }}
                  className={`badge badge-light-${color}`}
                >
                  {businessDetails?.business?.applicationStatus
                    ? businessDetails?.business?.applicationStatus
                    : "N/A"}
                </span>
                <span style={{ color: "#E1E6EF" }} className="mx-2">
                  {" "}
                  |{" "}
                </span>
                Role : {" "}
                <span
                  style={{ fontSize: "13px" }}
                  className={`badge badge-light-${color}`}
                >
                  {businessDetails?.business?.role
                    ? businessDetails?.business?.role
                    : "N/A"}
                </span>
              </p>
            </Col>
            <Col xs="6">
              <div className="d-flex justify-content-end">
                {/* <Button className='filter_btn'
                                onClick={() => downloadInvoice(id)}
                            >
                                <FaDownload color='#d422ad' />
                            </Button> */}

                {/* <Button className='filter_btn ms-2'>
                                <FaTrash color='red' />
                            </Button> */}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
      <button
        style={{ margin: "10px 0" }}
        onClick={() => window.history.back()}
      >
        {" "}
        {" < "}Back to Service Providers
      </button>
      <Container fluid>
        <div className="order_details">
          <Row className="d-flex justify-content-center">
            <Col lg={4} md={6} className="d-flex">
              <Card className="flex-fill card-equal-height">
                <CardHeader>
                  <h5> Business Details </h5>
                </CardHeader>
                <CardBody>
                  <Table className="detail_table">
                    <tr>
                      <th>{businessDetails?.business?.role === 'Freelancer' ? 'Service Provider Name' : "Business Name"}</th>
                      <td>
                        {businessDetails?.business?.role === 'Freelancer' ? businessDetails?.business?.fullName : businessDetails?.business?.businessName || 'Not Avaialable'}
                      </td>{" "}
                    </tr>
                    {businessDetails?.business?.tagline && <tr>
                      <th>Tagline :</th>
                      <td>
                        {businessDetails?.business?.tagline
                          || "N/A"}
                      </td>
                    </tr>}
                    <tr>
                      <th>Mobile Number :</th>
                      <td>
                        {businessDetails?.busines?.mobileNumber
                          || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <th>Email Address :</th>
                      <td>
                        {businessDetails?.business?.email
                          || "N/A"}
                      </td>
                    </tr>

                    {businessDetails?.business?.gstName && <tr>
                      <th>GST Name :</th>
                      <td>
                        {businessDetails?.business?.gstName
                          || "N/A"}
                      </td>
                    </tr>}
                    <tr>
                      <th>Address :</th>
                      <td className="ellipses_text_2">
                        {businessDetails?.business
                          ? [
                            businessDetails?.business.addressLine,
                            businessDetails?.business.village,
                            businessDetails?.business.city,
                            businessDetails?.business.state,
                            businessDetails?.business.pincode,
                          ]
                            .filter(Boolean) // removes undefined, null, empty strings
                            .join(", ")
                          : "N/A"}
                      </td>
                    </tr>
                    {businessDetails?.business?.doorstepService && <tr>
                      <th>GST Name :</th>
                      <td>
                        {businessDetails?.business?.doorstepService === true ? "Yes" : "No"
                          || "N/A"}
                      </td>
                    </tr>}


                  </Table>
                </CardBody>
              </Card>
            </Col>
            {/* <Col lg={4} md={6} sm={12} className="d-flex">
              <Card className="flex-fill card-equal-height">
                <CardHeader>
                  <h5> Owner Details</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Table className="detail_table">
                      <tr>
                        <th>Owner Name :</th>
                        <td>
                          {businessDetails?.business?.owner?.firstName &&
                          businessDetails?.business?.owner?.lastName
                            ? `${businessDetails?.business?.owner.firstName} ${businessDetails?.business?.owner.lastName}`
                            : "N/A"}
                        </td>{" "}
                      </tr>
                      <tr>
                        <th>owner Mobile :</th>
                        <td>
                          {businessDetails?.business?.owner?.mobileNumber}
                        </td>
                      </tr>
                      <tr>
                        <th>owner Email :</th>
                        <td>{businessDetails?.business?.owner?.email}</td>
                        {/* // ) : (
                        //   <td>{""}</td>
                      </tr>
                      <tr>
                        <th>owner Address :</th>
                        <td>{businessDetails?.business?.owner?.fullAddress}</td>
                      </tr>
                      {businessDetails?.business?.owner?.educationDetails && <tr>
                        <th>Education Details :</th>
                        <td>{businessDetails?.business?.owner?.educationDetails}</td>
                      </tr>}
                      {businessDetails?.business?.owner?.employmentDetails && <tr>
                        <th>Employment Details :</th>
                        <td>{businessDetails?.business?.owner?.employmentDetails}</td>
                      </tr>}
                      {businessDetails?.business?.owner?.skills && <tr>
                        <th> Skills :</th>
                        <td>{businessDetails?.business?.owner?.skillsa}</td>
                      </tr>}
                    </Table>
                  </Row>
                </CardBody>
              </Card>
            </Col> */}
            <Col lg={4} md={6} sm={12} className="d-flex">
              <Card className="flex-fill card-equal-height">
                <CardHeader>
                  <h5> User Details</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Table className="detail_table">

                      <tr>
                        <th>User Mobile :</th>
                        <td>
                          {businessDetails?.business?.userId?.phoneNumber}
                        </td>
                      </tr>
                      <tr>
                        <th>User Email :</th>
                        <td>{businessDetails?.business?.userId?.email}</td>
                      </tr>
                      <tr>
                        <th>address :</th>
                        <td>{businessDetails?.business?.userId?.address}</td>
                      </tr>
                      <tr>
                        <th>Joined On :</th>
                        <td>
                          {moment(
                            businessDetails?.business?.userId?.createdAt
                          ).format("DD MMM YYYY, h:mm A")}
                        </td>{" "}
                      </tr>
                    </Table>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card>
                <CardHeader>
                  <h5>Other Details</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Table className="detail_table">
                      <tr>
                        <th>Services Posted :</th>
                        <td>{businessDetails?.services?.length}</td>
                      </tr>
                      <tr>
                        <th>Products Posted :</th>
                        <td>
                          {businessDetails?.products?.length}
                        </td>
                      </tr>
                      <tr>
                        <th>Postings Posted :</th>
                        <td>{businessDetails?.posts?.length}</td>
                      </tr>
                      <tr>
                        <th>KYC Verified</th>
                        <td>{businessDetails?.business?.otpVerified === true ? "YES" : "NO"}</td>
                      </tr>
                      <tr>
                        <th>Joined On :</th>
                        <td>
                          {moment(
                            businessDetails?.business?.createdAt
                          ).format("DD MMM YYYY, h:mm A")}
                        </td>{" "}
                      </tr>
                      <tr>
                        <th>Updated On :</th>
                        <td>
                          {moment(
                            businessDetails?.business?.updatedAt
                          ).format("DD MMM YYYY, h:mm A")}
                        </td>{" "}
                      </tr>
                      <tr>
                        <th>Comments :</th>
                        <td>{businessDetails?.business?.adminComments || "N/A"}</td>
                      </tr>
                    </Table>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg={12} md={12} sm={12}>
              <Card>
                <CardHeader>
                  <h5>Additional Details</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Table className="detail_table">
                      <tr>
                        <th>DESCRIPTION :</th>
                        <td>
                          {businessDetails?.business?.description}
                        </td>
                      </tr>
                      <tr>
                        <th>PROVIDER IN :</th>
                        <td>
                          {businessDetails?.business?.serviceCategories
                            ?.map((service) => service.categoryName)
                            .join(" , ")}
                        </td>
                      </tr>


                      {businessDetails?.images &&
                        businessDetails.images.length > 0 && (
                          <tr>
                            <th>IMAGES:</th>
                            <td>
                              <div
                                className="d-flex flex-wrap"
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                }}
                              >
                                {businessDetails.images.map((image, index) => (
                                  <div
                                    key={index}
                                    className="image-container"
                                    style={{
                                      width: "33.33%",
                                      padding: "5px",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    <img
                                      src={image}
                                      alt={`Product  ${index + 1}`}
                                      style={{
                                        width: "100%",
                                        height: "179px",
                                        borderRadius: "8px",
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      <tr>
                        <th>KYC Document</th>
                        <td className='d-flex gap-4'>
                          {
                            businessDetails?.business?.aadharCard?.map((image,index) => 
  <img
                            src={image}
                            alt="KYC Document"
                            style={{
                              width: "40%",
                              height: "220px",
                              borderRadius: "8px",
                            }}
                          />
                            )
                          }
                        
                        </td>
                      </tr>


                      {businessDetails?.business?.customCategories && <tr>
                        <th>Custom Category Request :</th>
                        <td>
                          {JSON.stringify(businessDetails?.business?.customCategories)}
                        </td>
                      </tr>}
                    </Table>
                  </Row>
                </CardBody>
              </Card>
            </Col>

          </Row>
        </div>
      </Container>
    </>
  );
};

export default ProductDetails;
