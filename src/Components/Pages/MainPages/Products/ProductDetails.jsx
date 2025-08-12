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
import { H3 } from "../../../../AbstractElements";
import { FaDownload, FaTrash } from "react-icons/fa";
import dummyImg from "../../../../../src/assets/images/product/1.png";
import { useParams } from "react-router";
import axios from "axios";
import { baseURL, imageURL, orderURL } from "../../../../Services/api/baseURL";
import moment from "moment";
import star from "../../../../../src/assets/images/Star.svg";
import { BackgroundColor } from "../../../../Constant";
const ProductDetails = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState();
  const getOrderDetails = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      await axios
        .get(`${baseURL}/api/products/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          //console.log(res);
          if (res && res.status === 200) {
            //console.log(res.data, "data by id for service");
            // let response = res?.data?.data.length > 0 && res.data?.data[0];
            setOrderDetails(res?.data);
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
    accepted: "primary",
    processing: "info",
    "on-the-way": "warning",
    delivered: "success",
    rejected: "danger",
  };
  useEffect(() => {
    if (id) {
      getOrderDetails();
    }
  }, []);
  const statusKey = orderDetails?.status.toLowerCase();
  const color = statusColors[statusKey] || "primary";
  console.log(orderDetails);
  return (
    <>
      <Container fluid>
        <div className="page-title">
          <Row className="align-items-center">
            <Col xs="6">
              <p className="mb-0 d-flex align-items-center">
                Product Id: <b className="ms-1"> {orderDetails?._id}</b>{" "}
                <span style={{ color: "#E1E6EF" }} className="mx-2">
                  {" "}
                  |{" "}
                </span>{" "}
                <span
                  style={{ fontSize: "13px" }}
                  className={`badge badge-light-${color}`}
                >
                  {orderDetails?.status
                    ? capitalizeFirstLetter(orderDetails?.status)
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
      <button style={{margin: "10px 0"}} onClick={() => window.history.back()}> {" < "}Back to Products</button>

      <Container fluid>
        <div className="order_details">
          <Row className="d-flex justify-content-center">
            <Col lg={4} md={6} className="d-flex">
              <Card className="flex-fill card-equal-height">
                <CardHeader>
                  <h5> Provider Details </h5>
                </CardHeader>
                <CardBody>
                  <Table className="detail_table">
                    <tr>
                      <th>Provider Name :</th>
                      <td>
                        {orderDetails?.addedBy?.role === 'Freelancer' ? orderDetails?.addedBy?.fullName : orderDetails?.addedBy?.businessName}
                      </td>{" "}
                    </tr>
                    <tr>
                      <th>Mobile Number :</th>
                      <td>
                        {orderDetails?.addedBy?.mobileNumber
                         ||"N/A"}
                      </td>
                    </tr>
                    <tr>
                      <th>Address :</th>
                      <td className="ellipses_text_2" style={{textWrap:"wrap"}}>
                        {[orderDetails?.addedBy?.addressLine,orderDetails?.addedBy?.village,orderDetails?.addedBy?.city,orderDetails?.addedBy?.state,orderDetails?.addedBy?.pincode].filter(Boolean).join(',')
                          || "N/A"}
                      </td>
                    </tr>
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
                        <th>Owner Name</th>
                        <td>
                          {orderDetails?.addedBy?.owner?.firstName &&
                          orderDetails?.addedBy?.owner?.lastName
                            ? `${orderDetails.addedBy?.owner.firstName} ${orderDetails.addedBy?.owner.lastName}`
                            : "N/A"}
                        </td>{" "}
                      </tr>
                      <tr>
                        <th>Order Mobile :</th>
                        <td>{orderDetails?.addedBy?.owner?.mobileNumber}</td>
                      </tr>
                      <tr>
                        <th>Joined On</th>
                          <td>
                            {moment(orderDetails?.addedBy?.updatedAt).format(
                              "DD MMM YYYY, h:mm A"
                            )}
                          </td>
                        {/* // ) : (
                        //   <td>{""}</td>
                      </tr> 
                    </Table>
                  </Row>
                </CardBody>
              </Card>
            </Col> */}
            
            <Col lg={4} md={6} sm={12} className="d-flex">
              <Card className="flex-fill card-equal-height">
                <CardHeader>
                  <h5> Category Details</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Table className="detail_table">
                      <tr>
                        <th>Segment Name</th>
                        <td>{orderDetails?.segment?.name}</td>
                      </tr>
                      <tr>
                        <th>Category Name</th>
                        <td>{orderDetails?.category?.categoryName}</td>
                      </tr>
                      <tr>
                        <th>Sub Category Name</th>
                        <td>{orderDetails?.product?.categoryName}</td>
                      </tr>
                      <tr>
                        <th>Created At</th>
                        <td>
                            {moment(orderDetails?.category?.createdAt).format(
                              "DD MMM YYYY, h:mm A"
                            )}
                          </td>                      </tr>
                    </Table>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
            <Card>
  <CardHeader>
    <h5>Additional Details</h5>
  </CardHeader>
  <CardBody>
  <Row>
  <Table className="detail_table">
    {orderDetails?.productDetails ? (
      (() => {
        let productDetails = orderDetails.productDetails;

        // Check if it's a string and try to parse it
        if (typeof productDetails === "string") {
          try {
            productDetails = JSON.parse(productDetails);
          } catch (error) {
            console.error("Invalid JSON string:", error);
            productDetails = {}; // Fallback to empty object
          }
        }

        return Object.keys(productDetails).length > 0 ? (
          Object.entries(productDetails).map(([key, value]) => (
            <tr key={key}>
              <th>{key}:</th>
              <td>{value}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2" className="text-center">
              No data available
            </td>
          </tr>
        );
      })()
    ) : (
      <tr>
        <td colSpan="2" className="text-center">
          No data available
        </td>
      </tr>
    )}
  </Table>
</Row>

  </CardBody>
</Card>


            </Col>
            <Col lg={12} md={12} sm={12}>
            <Card>
  <CardHeader>
    <h5>Product Details</h5>
  </CardHeader>
  <CardBody>
    <Row>
      <Table className="detail_table">
        <tr>
          <th>PRODUCT NAME :</th>
          <td>{orderDetails?.productName}</td>
        </tr>
        <tr>
          <th>DESCRIPTION :</th>
          <td>{orderDetails?.description}</td>
        </tr>

        {/* Display Images in Grid */}
        {orderDetails?.imageUrl && orderDetails.imageUrl.length > 0 && (
          <tr>
            <th>IMAGES :</th>
            <td>
              <div className="d-flex flex-wrap" style={{backgroundColor:"transparent",border:"none"}}>
                {orderDetails.imageUrl.map((image, index) => (
                  <div
                    key={index}
                    className="image-container"
                    style={{
                      width: '20%',
                      padding: '5px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <img
                      src={image}
                      alt={`Product  ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '179px',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                ))}
              </div>
            </td>
          </tr>
        )}

      </Table>
    </Row>
  </CardBody>
</Card>

            </Col>
        
            {/* <Col lg={6} md={6} sm={12}>
                        <Col lg={12} md={12} sm={12}>
                            <Card>
                                <CardHeader>
                                    <h6 className='d-flex mb-0 align-items-center justify-content-between'>
                                        GoBooze Rating
                                        <span className='d-flex align-items-center'>
                                            {orderDetails?.gobooze_rating && (
                                                <>
                                                    <img src={star} alt="Star Icon" />
                                                    {orderDetails?.gobooze_rating}
                                                </>
                                            )}
                                        </span>
                                    </h6>
                                </CardHeader>
                                <CardBody>
                                    <p className='review_text ellipses_text_5'> {orderDetails?.gobooze_review ? '“' + orderDetails?.gobooze_review + '”' : 'Rating Not Provided'}</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={12} md={12} sm={12}>
                            <Card>
                                <CardHeader>
                                    <h6 className='d-flex mb-0 align-items-center justify-content-between'>
                                        Driver Rating
                                        <span className='d-flex align-items-center'>
                                            {orderDetails?.deliveryUser?.delivery_rating && (
                                                <>
                                                    <img src={star} alt="Star Icon" />
                                                    {orderDetails?.deliveryUser?.delivery_rating}
                                                </>
                                            )}
                                        </span>
                                    </h6>                                </CardHeader>
                                <CardBody>
                                    <p className='review_text'>{orderDetails?.deliveryUser?.delivery_review ? '“' + orderDetails?.deliveryUser?.delivery_review + '”' : 'Rating Not Provided'}</p>
                                </CardBody>
                            </Card>
                        </Col> 
                    </Col> */}

            {/* <Col lg={6} md={6} sm={12}>
                        <Card>
                            <CardHeader>
                                <h5>Products Ratings</h5>
                            </CardHeader>
                            <CardBody>
                                {
                                    orderDetails?.products.length > 0 ? (
                                        orderDetails.products.map((data, index) => (
                                            <div key={index} className='mb-3'>
                                                <div className='d-flex align-items-center'>
                                                    <img alt='variant' width={50} height={50} src={data?.variant?.variantImage ? imageURL + data.variant.variantImage : dummyImg} />
                                                    <span className='ms-2'>
                                                        <span style={{color: '#1D2433CC'}}>{data?.variant?.product?.brand?.brandName.toUpperCase()}</span> <br />
                                                        <strong> {data?.variant?.variantName}</strong>
                                                    </span>
                                                </div>
                                                <div className='d-flex align-items-center mt-1'>
                                                    {data?.product_rating && (
                                                        <>
                                                            <img width={20} height={20} src={star} alt="Star Icon" className="me-1" />
                                                            <span className="me-2">{data.product_rating}</span>
                                                        </>
                                                    )}
                                                    {data?.product_review && (
                                                        <span>| {data.product_review}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='text-center my-5'>No products available</div>
                                    )
                                }

                            </CardBody>
                        </Card>
                    </Col> */}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default ProductDetails;
