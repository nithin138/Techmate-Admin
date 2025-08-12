import { debounce } from "lodash";
import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { MoreVertical, PlusCircle } from "react-feather";
import { useNavigate } from "react-router";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import dummyImg from "../../../../assets/images/product/2.png";
import { Btn, H4, H5,Image } from "../../../../AbstractElements";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { baseURL } from "../../../../Services/api/baseURL";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import CommonModal from "../../../UiKits/Modals/common/modal";
import Loader from "../../../Loader/Loader";
import { FaExchangeAlt } from "react-icons/fa";

const CouponsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [AddModal, SetAddmodal] = useState(false);
  const [data, setData] = useState([]);
  const [token, setToken] = useState(null);
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [showModal, SetShowmodal] = useState(false);
  const [selectedServiceStatus, setSelectedServiceStatus] = useState("");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      setToken(token);
      return;
    }
    setToken(null);
  }, []);

  const formik = useFormik({
    initialValues: {
      coupan_name: "",
      description: "",
      validFrom: "",
      validTill: "",
      coupan_value: "",
      coupan_value_type: "dollar",
      minimum_purchase_amount: 0,
      minimum_quantity_items: 0,
      purchase_requirement: "no_minimum_requirements",
      status: "",
    },
    validationSchema: Yup.object({
      coupan_name: Yup.string()
        .transform((value) => value?.toUpperCase())
        .required("Coupon Name is required"),
      description: Yup.string().required("Description is required"),
      validFrom: Yup.date()
        .min(
          moment().subtract(1, "day").toDate(),
          "Start Date cannot be in the past"
        )
        .required("Start Date is required"),
      validTill: Yup.date()
        .min(Yup.ref("validFrom"), "End Date cannot be before Start Date")
        .required("End Date is required"),
      coupan_value: Yup.number().required("Coupon Value is required"),
      coupan_value_type: Yup.string().required("Coupon Value Type is required"),
      status: Yup.string().required("Status is required"),
      // minimum_purchase_amount: Yup.string().required('Minimum Purchase Amount is required'),
      // minimum_quantity_items: Yup.string().required('Minimum Item Quantity is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const token = await JSON.parse(localStorage.getItem("token"));

      let updatedValus = {
        ...values,
        coupan_name: values?.coupan_name?.toUpperCase(),
      };

      try {
        let response;
        if (id) {
          response = await axios.put(
            `${baseURL}/api/admin/coupan/${id}`,
            updatedValus,
            {
              headers: {
                Authorization: `${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          response = await axios.post(
            `${baseURL}/api/admin/coupan/create`,
            updatedValus,
            {
              headers: {
                Authorization: `${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          //console.log("response", response);
        }
        if (response?.data?.success) {
          setLoading(false);
          formik.resetForm();
          toggleModal();
          getData();
          Swal.fire({
            title: response?.data?.message,
            icon: "success",
            confirmButtonColor: "#d3178a",
          });
        }
      } catch (error) {
        setLoading(false);
        Swal.fire({
          title: error?.response?.data?.message,
          icon: "error",
          confirmButtonColor: "#d3178a",
        });
      }
    },
  });
  const serviceStatusOptions = [
    { _id: "true", status_name: "Published" },
    { _id: "false", status_name: "Unpublished" },
  ];
  const handleServiceStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setSelectedServiceStatus(selectedStatus); // Ensure this function is defined
    getData(selectedStatus);
  };
  const fetchSearchResults = async () => {
    // setLoading(true);
    try {
      // Make API call to search products (adjust URL based on your backend)
      const response = await axios.get(
        `${baseURL}/api/dashboard/postings/search?query=${searchTerm}`
      );
      //console.log(response, "respnse for search results");
      setData(response.data.posts);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchSearchResults();
      } else {
        getData(); // Fetch all items when search bar is empty
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };
  const ktoggleModal = () => {
    formik.resetForm();
    setId("");
    SetAddmodal(!AddModal);
    setLoading(false);
  };
  const handleapplicationStatus = async (e) => {
    e.preventDefault();

    //console.log(selectedRow, statusValue);
    const token = await JSON.parse(localStorage.getItem("token"));
    let body = {
      postId: selectedRow,
      status: statusValue,
      //   adminComments: statusValue === "rejected" ? description : undefined,
    };

    //console.log(
    //   `Updating status for Posting application ID ${selectedRow} to ${statusValue}`
    // );
    try {
      await axios
        .put(`${baseURL}/api/postings/`, body, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res && res.status === 200) {
            Swal.fire({
              icon: "success",
              title: res?.data?.message,
            });
            SetShowmodal(false);
            setApplicationStatus("");
            setStatusValue("");
            setSelectedRow(null);
            setDescription(""); // Clear description
            getData();
          }
        });
    } catch (err) {
      console.error(err);
    }
    toggleModal(); // Close modal after update
  };
  const debouncedSearch = useRef(
    debounce(async (searchTerm) => {
      setSearchTerm(searchTerm);
    }, 300)
  ).current;

  const getEditData = async (id) => {
    let endPoint = `/api/admin/coupan/${id}`;

    const response = await axios.patch(
      `${baseURL}${endPoint}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    let data = response?.data?.data;

    if (response?.data?.success) {
      //console.log(" data.validFrom ", data.validFrom);
      data.coupan_name && formik.setFieldValue("coupan_name", data.coupan_name);
      data.coupan_value &&
        formik.setFieldValue("coupan_value", data.coupan_value);
      data.coupan_value_type &&
        formik.setFieldValue("coupan_value_type", data.coupan_value_type);
      data.description && formik.setFieldValue("description", data.description);
      data.validFrom &&
        formik.setFieldValue(
          "validFrom",
          moment(data.validFrom).format("YYYY-MM-DD")
        );
      data.validTill &&
        formik.setFieldValue(
          "validTill",
          moment(data.validTill).format("YYYY-MM-DD")
        );
      data.status && formik.setFieldValue("status", data.status);
      data.minimum_purchase_amount &&
        formik.setFieldValue(
          "minimum_purchase_amount",
          data.minimum_purchase_amount
        );
      data.minimum_quantity_items &&
        formik.setFieldValue(
          "minimum_quantity_items",
          data.minimum_quantity_items
        );
      data.purchase_requirement &&
        formik.setFieldValue("purchase_requirement", data.purchase_requirement);
    }
  };
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/createBlog");
  };

  const handleNavigateEdit = (id) => {
    navigate(`/createBlog/${id}`);
  };
 
  const toggleModal = (row = null) => {
    SetShowmodal(!showModal);
    if (row) {
      setSelectedRow(row?._id);
      setApplicationStatus(row?.status); // Set current status from the selected row
      setStatusValue(row.status); // Default to current status in the dropdown
    }
  };
  useEffect(() => {
    getData();
  }, [searchTerm]);
  const togglePublishStatus = async (blogId) => {
    //console.log(blogId)
    try {
      const response = await axios.patch(`${baseURL}/api/blog/${blogId}`, {
        
      });
      //console.log(response.data)
      if (response?.data.success) {
        //console.log("Blog status updated successfully:", data); // Log response for debugging
        Swal.fire({
            title: "Success!",
            text: response?.data.message, // <-- Access data.message directly
            icon: "success",
        });
        getData();
    } else {
        console.error("Failed to update blog status:", data); // Log error response
        Swal.fire({
            title: "Error",
            text: "Failed to update blog status",
            icon: "error",
        });
    }
    
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Something went wrong!",
        icon: "error",
      });
    }
  };
  

  const orderColumns = [
    {
      name: "Post",
      selector: (row) => row?.image,
      sortable: true,
      center: true,
      cell: (row) =>
        row?.image ? (
            <Image
            attrImage={{
              className: "img-100 me-3",
              src: `${
                row?.image || dummyImg
              }`,
              alt: "Generic placeholder image",
            }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      name: "TITLE",
      selector: (row) => row?.title,
      sortable: true,
      center: true,
      width:"200px",

      cell: (row) => row?.title,
    },
    {
      name: "Content",
      selector: (row) => row?.description,
      sortable: true,
      width:"400px",
      center: true,
      cell: (row) => (
        <div
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            whiteSpace: "normal",
            maxHeight: "5em", // Adjust height for 2 lines
          }}
        >
          {row?.description}
        </div>
      ),
    },
    {
      name: "POSTED ON",
      selector: (row) => `${row.createdAt}`,
      sortable: true,
      center: true,
      cell: (row) => moment(row?.createdAt).format("DD MMM YYYY"),
    },
   
    {
      name: "Published Status",
      selector: (row) => `${row.isPublished ? "Published" : "Unpublished"}`,
      width: "150px",
      sortable: true,
      center: true,
      cell: (row) => {
        const getStatusStyle = (isPublished) => ({
          backgroundColor: isPublished ? "green" : "gray",
          color: "white",
          padding: "5px 10px",
          borderRadius: "5px",
        });
    
        return (
          <span style={{ fontSize: "13px", ...getStatusStyle(row?.isPublished) }}>
            {row?.isPublished ? "Published" : "Unpublished"}
          </span>
        );
      },
    },    
    {
      name: "Actions",
      cell: (row) => (
        <div
          className="d-flex justify-content-end align-items-center"
          style={{ marginRight: "20px" }}
        >
          <div className="cursor-pointer">
            <UncontrolledDropdown className="action_dropdown">
              <DropdownToggle className="action_btn">
                <MoreVertical color="#000" size={16} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    handleNavigateEdit(row?._id);
                  }}
                >
                  Edit <FaPen />
                </DropdownItem>
                <DropdownItem
                  onClick={() => togglePublishStatus(row?._id, !row.isPublished)}
                >
                  {row.isPublished ? "Unpublish Blog" : "Publish Blog"} <FaExchangeAlt />
                </DropdownItem>
                <DropdownItem
                  className="delete_item"
                  onClick={() => deleteVariant(row?._id)}
                >
                  Delete <FaTrashAlt />
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      ),
      right: true,
    },
    
  ];
  const deleteVariant = async (id) => {
 Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {   
        if (result.isConfirmed) {
            try {
        const token = await JSON.parse(localStorage.getItem("token"));
        await axios
          .delete(`${baseURL}/api/blog/${id}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: res?.data?.message,
            });
            getData();
          });
      } 
      catch (err) {
        console.error(err);
      }
    }
});
};
  const getData = async (filterValue = "All") => {
    //console.log(filterValue)
    const token = await JSON.parse(localStorage.getItem("token"));
    setIsLoading(true);
    try {
              let apiUrl = `${baseURL}/api/blog?r=admin`;
              if (filterValue !== "All") {
                apiUrl += `&isPublished=${filterValue}`;
              }
              //console.log(apiUrl);
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(response, "response");

      if (response.status === 200 && response.data) {
        setData(response.data?.blogs); // Assign the "data" array from the response to setData
        setIsLoading(false);
      } else {
        setIsLoading(false);
        // Optionally handle the case when response.data.data is missing
      }
    } catch (error) {
      //console.log(error);
      setIsLoading(true);
    }
  };
  //console.log(data, "data......................");
  return (
    <Fragment>
      {/* <Container fluid={true} style={{ paddingTop: '30px' }}> */}
      {/* <Row>
                    <Col sm="12"> */}
      {/* <Card> */}
      {/* <CardBody style={{ padding: '15px' }}> */}
      <Row xxl={12} className="pb-2">
        <Row>
          <Col md={2} lg={2} xl={2} xxl={2}>
            <div>
              <h5 className="mb-0 font-bold">Posts</h5>
            </div>
          </Col>
          <Col md={10} lg={10} xl={10} xxl={10}>
            <div className="file-content file-content1 justify-content-end">
           
              <Input
                type="select"
                className="ms-3"
                name="serviceStatus"
                value={selectedServiceStatus} // Ensure state is managed
                onChange={handleServiceStatusChange}
              >
                <option value="">Filter By Publishment</option>
                {Array.isArray(serviceStatusOptions) &&
                  serviceStatusOptions.length > 0 &&
                  serviceStatusOptions.map((status) => (
                    <option key={status._id} value={status._id}>
                      {status.status_name}
                    </option>
                  ))}
              </Input>
              <Button
                                  className="btn btn-primary d-flex align-items-center ms-3"
                                  onClick={handleNavigate}
                                >
                                  <PlusCircle />
                                  Add a new Blog
                                </Button>
            </div>
          </Col>
        </Row>
      </Row>
      {/* </CardBody> */}

      <DataTable
        data={data}
        columns={orderColumns}
        striped={true}
        center={true}
        pagination
        paginationServer
        progressComponent={<Loader />}
        progressPending={isLoading}
      />

      <CommonModal
        isOpen={AddModal}
        title={id ? "Update Coupon" : "Add Coupon"}
        className="store_modal"
        toggler={toggleModal}
        size="lg"
      >
        <Container>
          <Form className="theme-form" onSubmit={formik.handleSubmit}>
            <Row>
              <Col xl={12}>
                <FormGroup>
                  <Label className="font-semibold text-base">
                    Coupon Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="coupan_name"
                    placeholder="Enter coupon name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.coupan_name.toUpperCase()}
                  />
                  {formik.touched.coupan_name && formik.errors.coupan_name ? (
                    <span className="error text-danger">
                      {formik.errors.coupan_name}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>
              <Col xl={12}>
                <FormGroup>
                  <Label className="font-semibold text-base">
                    Coupon Discount <span className="text-danger">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      className="w-5/6"
                      name="coupan_value"
                      min={1}
                      max={100}
                      placeholder="Enter discount"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.coupan_value}
                    />
                    <select
                      type="select"
                      name="coupan_value_type"
                      className="w-1/6"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.coupan_value_type}
                    >
                      <option value="dollar" label="$" selected />
                      <option value="percent" label="%" />
                    </select>
                  </div>
                  {formik.touched.coupan_value && formik.errors.coupan_value ? (
                    <span className="error text-danger">
                      {formik.errors.coupan_value}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>
              <Col xl={12}>
                <FormGroup>
                  <Label className="font-semibold text-base">
                    Description <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    placeholder="Enter Description"
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <span className="error text-danger">
                      {formik.errors.description}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>
              <Col xl={12}>
                <Row className="pe-0">
                  <Col xl={6}>
                    <FormGroup>
                      <Label className="font-semibold text-base">
                        Start Date <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="date"
                        name="validFrom"
                        placeholder="Select Date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.validFrom}
                      />
                      {formik.touched.validFrom && formik.errors.validFrom ? (
                        <span className="error text-danger">
                          {formik.errors.validFrom}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </Col>
                  <Col xl={6}>
                    <FormGroup>
                      <Label className="font-semibold text-base">
                        End Date <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="date"
                        name="validTill"
                        placeholder="Select Date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.validTill}
                      />
                      {formik.touched.validTill && formik.errors.validTill ? (
                        <span className="error text-danger">
                          {formik.errors.validTill}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              <Col xl={12}>
                <Row className="pe-0">
                  <Col xl={12}>
                    <FormGroup>
                      <Label className="font-semibold text-base">
                        Minimum Purchase Requirements{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <div className="flex flex-column justify-center">
                        <Label>
                          <Input
                            type="radio"
                            className="me-2"
                            id="no_minimum_requirements"
                            name="purchase_requirement"
                            label=""
                            onChange={() => {
                              formik.setFieldValue(
                                "purchase_requirement",
                                "no_minimum_requirements"
                              );
                              formik.setFieldValue(
                                "minimum_purchase_amount",
                                0
                              );
                              formik.setFieldValue("minimum_quantity_items", 0);
                            }}
                            checked={
                              formik.values.purchase_requirement ===
                              "no_minimum_requirements"
                            }
                          />
                          No minimum requirements
                        </Label>
                        <Label>
                          <Input
                            type="radio"
                            className="me-2"
                            id="minimum_purchase_amount"
                            name="purchase_requirement"
                            onChange={() => {
                              formik.setFieldValue(
                                "purchase_requirement",
                                "minimum_purchase_amount"
                              );
                              formik.setFieldValue(
                                "minimum_purchase_amount",
                                0
                              );
                              formik.setFieldValue("minimum_quantity_items", 0);
                            }}
                            checked={
                              formik.values.purchase_requirement ===
                              "minimum_purchase_amount"
                            }
                          />
                          Minimum purchase amount ($)
                        </Label>
                        <Label>
                          <Input
                            type="radio"
                            className="me-2"
                            id="minimum_quantity_items"
                            name="purchase_requirement"
                            onChange={() => {
                              formik.setFieldValue(
                                "purchase_requirement",
                                "minimum_quantity_items"
                              );
                              formik.setFieldValue(
                                "minimum_purchase_amount",
                                0
                              );
                              formik.setFieldValue("minimum_quantity_items", 1);
                            }}
                            checked={
                              formik.values.purchase_requirement ===
                              "minimum_quantity_items"
                            }
                          />
                          Minimum quantity of items
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                  {formik.values.purchase_requirement ===
                    "minimum_purchase_amount" && (
                    <Col xl={6}>
                      <FormGroup>
                        <Label className="font-semibold text-base">
                          Minimum Purchase Amount{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <InputGroup>
                          <InputGroupText>$</InputGroupText>
                          <Input
                            type="number"
                            min={0}
                            className="rouned-top-0 rounded-left-0"
                            name="minimum_purchase_amount"
                            placeholder="Enter Minimum Purchase Amount"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.minimum_purchase_amount}
                          />
                        </InputGroup>
                        <p className="font-medium mb-0 p-1">
                          Applied to all Products.
                        </p>
                        {formik.touched.minimum_purchase_amount &&
                        formik.errors.minimum_purchase_amount ? (
                          <span className="error text-danger">
                            {formik.errors.minimum_purchase_amount}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </Col>
                  )}
                  {formik.values.purchase_requirement ===
                    "minimum_quantity_items" && (
                    <Col xl={6}>
                      <FormGroup>
                        <Label className="font-semibold text-base">
                          Minimum Quantity of items{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="number"
                          name="minimum_quantity_items"
                          placeholder="Enter minimum quantity"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.minimum_quantity_items}
                        />
                        {formik.touched.minimum_quantity_items &&
                        formik.errors.minimum_quantity_items ? (
                          <span className="error text-danger">
                            {formik.errors.minimum_quantity_items}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </Col>
                  )}
                </Row>
              </Col>
              <Col xl={12}>
                <FormGroup>
                  <Label className="font-semibold text-base">
                    Status <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="select"
                    name="status"
                    placeholder="Select Status"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.status}
                  >
                    <option disabled label="Select Status"></option>
                    <option value={"active"} label="Active"></option>
                    <option value={"expired"} label="Expired"></option>
                  </Input>
                  {formik.touched.status && formik.errors.status ? (
                    <span className="error text-danger">
                      {formik.errors.status}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>
              <Col xl={12} className="modal_btm d-flex justify-content-end">
                <Button
                  className="cancel_Btn"
                  onClick={() => SetAddmodal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="ms-2 btn btn-primary"
                >
                  {id ? "Update Coupon" : "Add Coupon"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </CommonModal>
      {/* </Card> */}
      {/* </Col>
                </Row> */}

      <CommonModal
        isOpen={showModal}
        title={"Change Status"}
        className="store_modal"
        toggler={ktoggleModal}
        size="md"
      >
        <Container>
          <Form className="status_form" onSubmit={handleapplicationStatus}>
            <Col xxl={12} className="mb-3">
              <p className="current-status">
                The Posts's current status is:{" "}
                <span style={{ fontWeight: "bold", color: "#007bff" }}>
                  {applicationStatus ? applicationStatus.toUpperCase() : "N/A"}
                </span>
              </p>
            </Col>
            <Col xxl={12} className="mb-4">
              <FormGroup>
                <Label for="statusSelect" className="form-label">
                  Select a new status:
                </Label>
                <Input
                  type="select"
                  id="statusSelect"
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  className="form-select"
                >
                  <option value="Approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Input>
              </FormGroup>
            </Col>
            {statusValue === "rejected" && (
              <Col xxl={12} className="mb-4">
                <FormGroup>
                  <Label for="description" className="form-label">
                    Provide a reason for rejection:
                  </Label>
                  <Input
                    type="textarea"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    placeholder="Enter the reason for rejection"
                  />
                </FormGroup>
              </Col>
            )}
            <Col xxl={12} className="d-flex justify-content-end">
              <Button
                type="button"
                className="cancel_Btn btn btn-secondary me-2"
                onClick={ktoggleModal}
              >
                Cancel
              </Button>
              <Button type="submit" className="update_Btn btn btn-primary">
                Update
              </Button>
            </Col>
          </Form>
        </Container>
      </CommonModal>
      {/* </Container> */}
    </Fragment>
  );
};
export default CouponsTable;
