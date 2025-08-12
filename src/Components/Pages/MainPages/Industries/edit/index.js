import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumbs, H3 } from "../../../../../AbstractElements";
import {
  //   Button,
  //   Card,
  CardBody,
  //   Col,
  Container,
  //   Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  //   Row,

} from "reactstrap";
import { Button, Card, Form, FormControl, Row, Col, Badge } from "react-bootstrap";


import CreatableSelect from "react-select/creatable";
import { Table } from "../../../../Table";
import axios from "axios";
import { baseURL, productBaseURL } from "../../../../../Services/api/baseURL";
import { useProductVariantContext } from "../../../../../context/hooks/useProductVariant";
// import { options, options2, options3, options4 } from './OptionDatas';
import * as Yup from "yup"; // Import Yup for validation
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router";

function CreateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, setData, setOriginalData } = useProductVariantContext();
  const [segments, setSegments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    selectedSegment: "",
    selectedCat: "",
    serviceCategories: "",
    customCategories: "",
    category: ""
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //  service updation logic ---------------------------------------------------
 const handleRemoveService = (category) => {
  setSelectedServices((prev) => {
    const updatedServices = prev.filter((item) => item._id !== category._id);
    handleUpdateCategories(updatedServices); // ✅ Call update after removing
    return updatedServices;
  });
};

  const handleServiceChange = (e) => {
    const selectedId = e.target.value;
    const selectedCategory = serviceCategories.find(
      (category) => category._id === selectedId
    );

    if (selectedCategory && !selectedServices.some((cat) => cat._id === selectedId)) {
      setSelectedServices((prev) => {
        const updatedServices = [...prev, selectedCategory];
        handleUpdateCategories(updatedServices); // Pass latest state
        return updatedServices;
      });
    }
  };
  const handleUpdateCategories = (updatedServices) => {
    console.log(updatedServices)
    const serviceIds = updatedServices.map((category) => category._id);
    console.log(serviceIds)

    setFormData((prev) => ({
      ...prev,
      serviceCategories: serviceIds,
    }));

    console.log(formData)
    Swal.fire({
      icon: "success",
      title: "Criteria updated successfully",
      timer: 1000,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });
  };
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents dehefault form submission
    console.log(formData)
    try {
      setIsLoading(true);
      const res = await axios.patch(`${baseURL}/api/business/${id}`, formData, {
        headers: { Authorization: `${token}` },
      });


      if (res?.status === 200) {
        Swal.fire({
          icon: "success",
          title: id ? "Business Updated Successfully!" : "Product Added Successfully!",
          text: res?.data?.message || "Your Business has been saved.",
        });

        navigate("/businesses");
        setFormData({
          businessName: "",
          tagline: "",
          address: "",
          description: "",
          servicesList: [],
          productsList: [],
          customCategories: "",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error?.response?.data?.message || "An unexpected error occurred.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  // initial data fetch --------------------------------------------------------
  const fetchBusinessData = async () => {
    try {
      //console.log(id)
      const response = await axios.get(`${baseURL}/api/business/${id}`);
      const businessData = response?.data?.business;
      setFormData({
        serviceCategories: businessData?.serviceCategories && businessData?.serviceCategories?.map(service => service._id) || [],
        customCategories: businessData?.customCategories ? JSON.stringify(businessData?.customCategories)?.slice(1, -1) : [],
      });

      // Set selected categories
      setSelectedServices(businessData?.serviceCategories || []);
    } catch (error) {
      //console.log("Error fetching business data:", error);
    }
  };
  useEffect(() => {
    fetchBusinessData();
  }, [id]);
  useEffect(() => {
    fetchSegments();
  }, []);
  useEffect(() => {
    if (formData?.selectedSegment) {
      fetchCategories()
    }
  }, [formData?.selectedSegment])
  useEffect(() => {
    if (formData?.selectedCat) {
      fetchSubCategories()
    }
  }, [formData?.selectedCat])
  const fetchSegments = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/segments`);
      setSegments(response?.data?.categories);
    } catch (error) {
      console.error("Error fetching segments:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/categories/${formData?.selectedSegment}`);
      setCategories(response?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/subcategories/${formData.selectedCat}`);
      setServiceCategories(response?.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };



  const handleReset = () => {
    setFormData({});
    setData([]);
    setOriginalData([]);
  };


  console.log(formData)


  return (
    <Fragment>
      <Form className="theme-form product-form" onSubmit={handleSubmit}>
        <Container fluid={true}>
          <div className="page-title">
            <Row>
              <Col xs="6">
                <H3>{id ? "Update Business" : "Add a New Business"}</H3>
              </Col>
              <Col xs="6">
                <div className="text-right">
                  {!id && (
                    <Button
                      onClick={() => handleReset()}
                      className="me-3 reset_btn"
                    >
                      Reset All
                    </Button>
                  )}
                  <Button className="save_btn" type="submit">
                    {!isLoading && (id ? "Update Details" : "Save Details")}
                    {isLoading && (id ? "Updating..." : "Saving...")}
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
        <button
          style={{ margin: "10px 0" }}
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
        >
          {" "}
          {" < "}Back to Service Providers
        </button>
        <Container fluid={true}>
          <Row>

          </Row>
          <Row>
            <Col sm="12">
              <Card>
                <CardBody>
                  <Row>
                    <Row className="mb-3 align-items-center">
                      <Col md={6}>
                        <FormGroup>
                          <Form.Label>Select Segments</Form.Label>
                          <Input type="select"
                            name="selectedSegment" onChange={handleChange} defaultValue="">
                            <option value="" disabled>
                              Choose a Segment
                            </option>
                            {segments?.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>   <Col md={6}>
                        <FormGroup>
                          <Form.Label>Select category</Form.Label>
                          <Input type="select"
                            name="selectedCat" onChange={handleChange} defaultValue="">
                            <option value="" disabled>
                              Choose a service category
                            </option>
                            {categories?.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.categoryName}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Form.Label>Select Services</Form.Label>
                          <Input type="select"
                            name="category" onChange={handleServiceChange} defaultValue="">
                            <option value="" disabled>
                              Choose a service category
                            </option>
                            {serviceCategories?.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.categoryName}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={5}>
                        <div>
                          <Form.Label>Selected Services List</Form.Label>
                          <div>
                            {selectedServices.map((category) => (
                              <Badge
                                key={category._id}
                                disabled
                                bg="primary"
                                style={{
                                  marginRight: "8px",
                                  marginBottom: "8px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                {category.categoryName}
                                <span
                                  style={{
                                    marginLeft: "8px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleRemoveService(category)}
                                >
                                  ✖
                                </span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Col>

                    </Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>
                          Custom Categories <span className="text-danger">*</span>{" "}
                        </Label>
                        <Input
                          type="text"
                          placeholder="custom categories"
                          name="customCategories"
                          onChange={handleChange}
                          value={formData.customCategories}
                        ></Input>

                      </FormGroup>
                    </Col>






                  </Row>

                  <Row>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>


        </Container>
      </Form>
    </Fragment>
  );
}

export default CreateProduct;
