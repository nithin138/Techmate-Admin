import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumbs, H3 } from "../../../../../AbstractElements";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import CreatableSelect from "react-select/creatable";
import { Table } from "../../../../Table";
import axios from "axios";
import { baseURL } from "../../../../../Services/api/baseURL";
import { useFormik } from "formik";
import { useProductVariantContext } from "../../../../../context/hooks/useProductVariant";
// import { options, options2, options3, options4 } from './OptionDatas';
import * as Yup from "yup"; // Import Yup for validation
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router";

function CreateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, setData, setOriginalData } = useProductVariantContext();
  // const [collectionData, setCollectionData] = useState([]);
  const [token, setToken] = useState(null);
    const [segments,setSegments] = useState([]);
    const [categories,setCategories] = useState([]);
      const [serviceCategories, setServiceCategories] = useState([]);
    
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    UserData();
    setData([
      {
        variantCode: "",
        variantImage: "",
        // sellingPrice: 0,
        purchasePrice: 0,
        quantity: 0,
        // discount: 0,
        // finalSellingPrice: 0,
        isTopSellingProduct: false,
        vol: "",
        offers: [],
        alcohol_percentage: 0,
        isOfferApplied: false,
        status: "active",
        label: "none",
        description: "",
      },
    ]);
    setOriginalData([
      {
        variantCode: "",
        variantImage: "",
        // sellingPrice: 0,
        purchasePrice: 0,
        quantity: 0,
        // discount: 0,
        // finalSellingPrice: 0,
        isTopSellingProduct: false,
        vol: "",
        alcohol_percentage: 0,
        isOfferApplied: false,
        offers: [],
        status: "active",
        label: "",
        description: "",
      },
    ]);
  }, []);

  const UserData = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    setToken(token);
  };



  const formik = useFormik({
    initialValues: {
        serviceName: "",
        segment:"",
        category: "",
        service:"",
        description: "",
        serviceType: "",
        selectedCat:"",
        selectedSegment:"",
    },
    onSubmit: async (values) => {
        console.log(values, "values");
    
        try {
            setIsLoading(true);
            let res;
    
            if (id) {
                res = await axios.patch(`${baseURL}/api/services/updateserv/${id}`, values, {
                    headers: { Authorization: `${token}` },
                });
            } else {
                res = await axios.post(`${baseURL}/api/services/add`, values, {
                    headers: { Authorization: `${token}` },
                });
            }
    
            if (res?.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: id ? "Service Updated Successfully!" : "Service Added Successfully!",
                    text: res?.data?.message || "Your service has been saved.",
                });
    
                navigate("/services");
                formik.resetForm();
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Unexpected Response",
                    text: res?.data?.message || "Something went wrong. Please try again.",
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
    }
    
});

  useEffect(() => {
    if (id) {
        //console.log(`Fetching blog details for ID: ${id}`);
        setIsLoading(true);
        axios.get(`${baseURL}/api/services/${id}`, {
            headers: {
                Authorization: `${token}`,
            }
        }).then((response) => {
            //console.log(response)
            //console.log("Fetched service Data:", response);
            formik.setValues({
                serviceName: response?.data?.serviceName,
                segment:response?.data?.segment?._id,
        category:response?.data?.category?._id,
        description: response?.data?.description,
        serviceType: response?.data?.serviceType,
            });
        }).catch((error) => {
            console.error("Error fetching service data:", error);
            Swal.fire({
                icon: "error",
                title: "Error fetching service details",
            });
        }).finally(() => {
            setIsLoading(false);
        });
    }
}, [id]);
  // const fetchCategoryList = async () => {
  //   const token = await JSON.parse(localStorage.getItem("token"));
  //   try {
  //     const collectData = await axios.get(`${baseURL}/api/subcategories`, {
  //       headers: {
  //         Authorization: `${token}`,
  //       },
  //     });
  //     //console.log(collectData, "collectData");
  //     let data = collectData?.data?.categories || [];
  //     setCollectionData(data);
  //   } catch (error) {
  //     //console.log(error);
  //   }
  // };



  // useEffect(() => {
  //   fetchCategoryList();
  // }, [formik?.values?.selectedCat]);




  const handleReset = () => {
    formik.resetForm();
    setData([]);
    setOriginalData([]);
  };
  useEffect(() => {
    fetchSegments();
  }, []);
  useEffect(() => {
    if (formik?.values?.segment){
      fetchCategories()
    }
  },[formik?.values?.segment])
  useEffect(() => {
    if(formik?.values?.category){
      fetchSubCategories()
  }
  },[formik?.values?.category])
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
      const params = {type:"Service"}
      const response = await axios.get(`${baseURL}/api/categories/${formik?.values?.segment}`,{params});
      setCategories(response?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/subcategories/${formik?.values?.category}`);
      setServiceCategories(response?.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
 

  console.log("formik values", formik.values);

  return (
    <Fragment>
      <Form className="theme-form product-form" onSubmit={formik.handleSubmit}>
        <Container fluid={true}>
          <div className="page-title">
            <Row>
              <Col xs="6">
                <H3>{id ? "Update Service" : "Add a New Service"}</H3>
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
        <Container fluid={true}>
          <Row>
            <Col sm="12">
              <Card>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>
                          Service Name <span className="text-danger">*</span>{" "}
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter Service Name"
                          name="serviceName"
                          onChange={formik.handleChange}
                          value={formik.values.serviceName}
                          onBlur={formik.handleBlur}
                        ></Input>
                        {formik.touched.serviceName &&
                        formik.errors.serviceName ? (
                          <span className="error text-danger">
                            {formik.errors.serviceName}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>
                          Service Type <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="select"
                          name="serviceType"
                          onChange={formik.handleChange}
                          value={formik.values.serviceType}
                          onBlur={formik.handleBlur}
                        >
                          <option value="">Select Service Type</option>
                          {[
                            "Consulting",
                            "Repair",
                            "Maintenance",
                            "Installation",
                          ].map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </Input>
                        {formik.touched.serviceType &&
                        formik.errors.serviceType ? (
                          <span className="error text-danger">
                            {formik.errors.serviceType}
                          </span>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Row className="mb-3 align-items-center">
        <Col md={6}>
          <FormGroup>
            <Label>Select Segments</Label>
            <Input   type="select"
                          value={formik?.values?.segment} name="segment" onChange={formik.handleChange} onBlur={formik.handleBlur} defaultValue="">
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
        </Col>
           <Col md={6}>
          <FormGroup>
            <Label>Select category</Label>
            <Input   type="select"
                          name="category"                    onChange={formik.handleChange}
                          value={formik.values.category}
                          onBlur={formik.handleBlur} defaultValue="">
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
 
              </Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>
                          Service <span className="text-danger">*</span>{" "}
                        </Label>
                        <Input
                          type="select"
                          name="service"
                          onChange={formik.handleChange}
                          value={formik.values.service}
                          onBlur={formik.handleBlur}
                        >
                          <option>Select Category</option>
                          {serviceCategories.length > 0 &&
                            serviceCategories.map((data) => {
                              return (
                                <>
                                  <option key={data?._id} value={data?._id}>
                                    {data?.categoryName}
                                  </option>
                                </>
                              );
                            })}
                        </Input>
                        {formik.touched.category && formik.errors.category ? (
                          <span className="error text-danger">
                            {formik.errors.category}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </Col>
                   

                    <Col md={6}>
                      <FormGroup>
                        <Label>
                          Service Description{" "}
                          <span className="text-danger">*</span>{" "}
                        </Label>
                        <Input
                          type="textarea"
                          rows={4}
                          placeholder="Enter Service Description"
                          name="description"
                          onChange={formik.handleChange}
                          value={formik.values.description}
                          onBlur={formik.handleBlur}
                        ></Input>
                        {formik.touched.description &&
                        formik.errors.description ? (
                          <span className="error text-danger">
                            {formik.errors.description}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </Col>
                         <Col md={6}>
                                         <FormGroup>
                                           <Label>
                                           Custom Categories <span className="text-danger">*</span>{" "}
                                           </Label>
                                           <Input
                                             type="text"
                                             placeholder="Custom Categories"
                                             name="customCategory"
                                             onChange={formik.values.customCategory}
                                             value={formik.values.customCategory}
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

          {/* <Row >
                        <Col sm='12'>
                            <div className='mb-5'>
                                <Table />
                            </div>
                        </Col>
                    </Row> */}
        </Container>
      </Form>
    </Fragment>
  );
}

export default CreateProduct;
