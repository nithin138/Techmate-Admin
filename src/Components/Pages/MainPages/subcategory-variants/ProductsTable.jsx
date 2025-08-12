import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import DataTable from "react-data-table-component";
import {
  Btn,
  H1,
  H4,
  H6,
  Image,
  P,
  Spinner,
  ToolTip,
} from "../../../../AbstractElements";
import CommonModal from "../../../UiKits/Modals/common/modal";
import { products, spinnerData } from "./data";
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Card,
  CardBody,
  TabContent,
  TabPane,
  Container,
  Nav,
  NavItem,
  NavLink,
  Media,
  Button,
  DropdownToggle,
  UncontrolledAccordion,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  CardTitle,
  CardText,
} from "reactstrap";
import {
  Download,
  MoreVertical,
  PlusCircle,
  PlusSquare,
  Trash,
  Upload,
} from "react-feather";
// import * as XLSX from 'xlsx';
import axios from "axios";
import "react-dropdown/style.css";
import {FaExchangeAlt} from "react-icons/fa";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import {
  baseURL,
  imageURL,
  productBaseURL,
} from "../../../../Services/api/baseURL";
import endPoints from "../../../../Services/EndPoints";
import dummyImg from "../../../../assets/images/product/2.png";
import Loader from "../../../Loader/Loader";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useDataContext } from "../../../../context/hooks/useDataContext";

const ItemsTable = () => {
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem("role_name"));
  const { productsData, setProductsData } = useDataContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [editData, seteditdata] = useState([]);
  const [subCollectionData, setSubCollectionData] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [BasicTab, setBasicTab] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [subCollectionValue, setSubCollectionValue] = useState("");
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [selectedFile, setSelectedFile] = useState(null);
    const [showModal, SetShowmodal] = useState(false);
    const [showcatModal, SetShowcatmodal] = useState(false);
    const [showSubCatModal,setShowSubCatModal] = useState(false);
    const [categoryName,setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [productStatus, setProductStatus] = useState(""); // Current product status
    const [statusValue, setStatusValue] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [subCategories , setSubCategories] = useState([]);
    const [catformData, setCatformData] = useState({
      categoryName: "", // Initialize with an empty string
      description: "",
    });

    
    const [selectedRow, setSelectedRow] = useState(null); // Row data for the selected product
  
    const [subCatFormData, setSubCatFormData] = useState({
      categoryId: "",
      subCategoryName: "",
      description: "",
    });
    
    
    // Fetch Categories for Select Box
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const token = JSON.parse(localStorage.getItem("token"));
          const response = await axios.get(`${baseURL}/api/subcategoryvariants`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          //console.log(response)
          setCategories(response.data.categories);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
    
      fetchCategories();
    }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const toggleModal = (row = null) => {
    SetShowmodal(!showModal);
    if (row) {
      setSelectedRow(row?._id);
      setProductStatus(row?.status); // Set current status from the selected row
      setStatusValue(row.status); // Default to current status in the dropdown
    }
  };
  const toggleCatModal = (row = null) => {
    SetShowcatmodal(!showcatModal);
    if (row) {
      // setSelectedRow(row?._id);
      setCatformData(row?.categoryName); // Set current status from the selected row
      setCatformData(row.description); // Default to current status in the dropdown
    }
  }
  const handleStatus = async (e) => {
    e.preventDefault();
  
    if (statusValue === "rejected" && !description.trim()) {
      Swal.fire({
        icon: "error",
        title: "Description is required",
        text: "Please provide a reason for rejection.",
      });
      return; // Stop submission
    }
  
    //console.log(selectedRow, statusValue);
    const token = await JSON.parse(localStorage.getItem("token"));
    let body = {
      status: statusValue,
      rejectionReason: statusValue === "rejected" ? description : undefined,
    };
  
    //console.log(`Updating status for product ID ${selectedRow} to ${statusValue}`);
    try {
      await axios
        .patch(`${baseURL}/api/products/update/${selectedRow}`, body, {
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
            setProductStatus("");
            setStatusValue("");
            setSelectedRow(null);
            setDescription(""); // Clear description
            fetchItems();
          }
        });
    } catch (err) {
      console.error(err);
    }
  };
  

  
  // const handleStatus = async (e) => {
  //   e.preventDefault();
  //   const token = await JSON.parse(localStorage.getItem("token"));
  //   let body = {    toggleModal(); // Close modal after update

  //     order_status: statusValue,
  //     cancel_reason: cancelReason,
  //   };
  //   if (body.order_status === "") {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Provide Order Status",
  //     });
  //   }
  //   try {
  //     await axios
  //       // .patch(`${orderURL}/update-order-status/${orderId}`, body, {
  //         headers: {
  //           Authorization: `${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         if (res && res.status === 200) {
  //           Swal.fire({
  //             icon: "success",
  //             title: res?.data?.message,
  //           });
  //           //SetShowmodal(false);
  //           // setShowOrderCancellationPopup(false);
  //           //SetShowmodal(false);
  //           // setShowOrderCancellationPopup(false);
  //           // setOrderId("");
  //           // setStatusValue("");
  //           // getOrderData();
  //         }
  //       });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const fetchCategoryList = async () => {
  //     const token = await JSON.parse(localStorage.getItem("token"))
  //     try {
  //         const collectData = await axios.get(`${baseURL}/api/admin/get-collections?page=1&limit=1000`, {
  //             headers: {
  //                 Authorization: `${token}`,
  //             }
  //         });
  //         let data = collectData?.data?.data.filter((item) => item.status === "active")
  //         setCollectionData(data)
  //     } catch (error) {
  //         //console.log(error)
  //     }
  // }

  // const fetchSubcollectionsList = async () => {
  //     const token = await JSON.parse(localStorage.getItem("token"))
  //     let limit = 1000;
  //     try {
  //         const response = await axios.get(`${baseURL}/api/admin/get-sub-collections?page=1&limit=${limit}`, {
  //             headers: {
  //                 Authorization: `${token}`
  //             }
  //         })
  //         let data = response?.data?.data.filter((item) => item.status === "active");
  //         setSubCollectionData(data);

  //     } catch (error) {
  //         //console.log(error)
  //     }
  // }

  // const fetchItems = async () => {
  //     setIsLoading(true)
  //     const token = await JSON.parse(localStorage.getItem("token"))
  //     try {
  //         let params = {};
  //         if (selectedCollectionId) {
  //             params = {
  //                 category_id: selectedCollectionId
  //             };
  //         }
  //         if (subCollectionValue) {
  //             params = {
  //                 subCategory_id: subCollectionValue
  //             };
  //         }

  //         const userData = await JSON.parse(localStorage.getItem('UserData'))
  //         const userRole = JSON.parse(localStorage.getItem('role_name'));

  //         if(userRole==='store'){
  //             params = {
  //                 role: userRole,
  //                 storeId: userData?._id
  //             };
  //         }

  //         const products = await axios.get(`${productBaseURL}/products/get-products`, {
  //             params: params,
  //             headers: {
  //                 Authorization: `${token}`,
  //             }
  //         })

  //         const productsData = products?.data?.data

  //         // if (productsData.length > 0) {
  //         setIsLoading(false)
  //         setProductsData(productsData.reverse());
  //         // }

  //     } catch (error) {
  //         setIsLoading(false)
  //         //console.log(error, 'error from items getting')
  //     }
  // }

  // const inactiveItem = async (id) => {
  //     const token = await JSON.parse(localStorage.getItem("token"))
  //     try {
  //         const status = editData.status === "inactive" ? "active" : 'inactive'

  //         let formData = new FormData();
  //         formData.append('status', status);

  //         const itemsData = await axios.patch(`${baseURL}/products/update-product-status/${editData._id}`, formData, {
  //             headers: {
  //                 Authorization: `${token}`,
  //             }
  //         })

  //         fetchItems()
  //         setDeleteModal(!deleteModal)
  //     }
  //     catch (err) {
  //         //console.log(err)
  //     }
  // }
  const fetchItems = async () => {
    setIsLoading(true);
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      // let params = {};
      // if (selectedCollectionId) {
      //     params = {
      //         category_id: selectedCollectionId
      //     };
      // }
      // if (subCollectionValue) {
      //     params = {
      //         subCategory_id: subCollectionValue
      //     };
      // }

      // const userData = await JSON.parse(localStorage.getItem('UserData'))
      // const userRole = JSON.parse(localStorage.getItem('role_name'));

      // if(userRole==='store'){
      //     params = {
      //         role: userRole,
      //         storeId: userData?._id
      //     };
      // }

      const products = await axios.get(
        `${baseURL}/api/subcategoryvariants`
        , {
        // params: params,
        headers: {
            Authorization: `${token}`,
        }}
      );
      //console.log(products, "products from varinats");

      // Check if products and products.data exist
      const productsData = products?.data?.subCategoryVariants || []; // Default to an empty array if undefined
      // //console.log(productsData, "osvnisjd");

      // If you're accessing the length of productsData
      if (productsData.length > 0) {
        //   //console.log("There are products:", productsData);
      } else {
        //   //console.log("No products available");
      }

      // if (productsData.length > 0) {
      setIsLoading(false);
      setProductsData(productsData.reverse());
      // }
    } catch (error) {
      setIsLoading(false);
      // //console.log(error, 'error from items getting')
    }
  };
  // useEffect(() => {
  //     fetchCategoryList();
  //     fetchSubcollectionsList();
  // }, []);

  useEffect(() => {
    fetchItems();
  }, [selectedCollectionId, subCollectionValue]);

  const handleNavigate = () => {
    navigate("/product/create");
  };

  const handleNavigateEdit = (id) => {
    navigate(`/product/edit/${id}`);
  };
  const handleprodNavigation = (id) => {
    navigate(`/products/${id}`);
  }

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };

  const handleAll = () => {
    setBasicTab(1);
    setSubCollectionValue("");
    setSelectedCollectionId(null);
    fetchItems();
  };

  const handleTabs = async (data, index) => {
    setBasicTab(index + 2);
    setSelectedCollectionId(data?._id);
    setSubCollectionValue();
    // getFilteredData(data?._id, "");
  };

  const handleSubCollectionChange = (e) => {
    let value = e.target.value;
    setSubCollectionValue(value);
    // getFilteredData("", value);
  };

  const getFilteredData = async () => {
    setIsLoading(true);
    try {
      const token = await JSON.parse(localStorage.getItem("token"));
      let params = {};
      if (subCollectionValue) {
        params = {
          subCategory_id: subCollectionValue,
        };
      }
      if (selectedCollectionId) {
        params = {
          category_id: selectedCollectionId,
        };
      }

      const response = await axios.get(
        `${productBaseURL}/products/get-products`,
        {
          params: params,
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response?.status === 200 && response) {
        setProductsData(response?.data?.data.reverse());
        //console.log(response?.data?.data.reverse());
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  //console.log(productsData, "products");
  // const filteredProducts = productsData.filter(
  //   (item) =>
  //     item?.productName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     item?.description?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     item?.brand?.brandName
  //       ?.toLowerCase()
  //       .includes(searchTerm?.toLowerCase()) ||
  //     item?.subCategory?.sub_collection_name
  //       ?.toLowerCase()
  //       .includes(searchTerm?.toLowerCase()) ||
  //     item?.tags.some((tag) =>
  //       tag.value.toLowerCase().includes(searchTerm?.toLowerCase())
  //     )
  // );

  const deleteVariant = async (id) => {
    if (window.confirm(`Are you sure you want to delete this Product ?`)) {
      try {
        const token = await JSON.parse(localStorage.getItem("token"));
        await axios
          .delete(`${baseURL}/api/products/${id}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: res?.data?.message,
            });
            fetchItems();
          });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const orderColumns = [
    {
      name: "Sub-Category Variant ID",
      selector: (row) => `${row?._id.slice(-6)}`, // Display the last 6 characters of the ID
      width: "150px",
      cell: (row) => (
        <span style={{ fontSize: "13px" }}>
          {row?._id.slice(-6)}
        </span>
      ),
      center: true,
    },
    {
      name: "Sub-Category Name",
      selector: (row) => row?.subCategory?.toUpperCase(),
      center: true,
      width: "200px",
      cell: (row) => (
        <span style={{ fontSize: "13px" }}>
          {row?.subCategory?.toUpperCase()}
        </span>
      ),
    },
    {
      name: "Category Name",
      selector: (row) => row?.categoryName?.toUpperCase(),
      center: true,
      width: "200px",
      cell: (row) => (
        <span style={{ fontSize: "13px" }}>
          {row?.categoryName?.toUpperCase()}
        </span>
      ),
    },
    {
      name: "Description",
      selector: (row) => `${row?.description?.slice(0, 100)}`,
      width: "300px",
      cell: (row) => {
        const description = row?.description;
        const maxLength = 50;
  
        if (description && description.length > maxLength) {
          return <>{description.slice(0, maxLength)}...</>;
        } else {
          return <>{description}</>;
        }
      },
      center: true,
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
                  Edit
                  <FaPen />
                </DropdownItem>
                <DropdownItem
                  className="delete_item"
                  onClick={() => deleteVariant(row?._id)}
                >
                  Delete
                  <FaTrashAlt />
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      ),
      right: true,
    },
  ];
  

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const uploadCSV = async (selectedFile) => {
    setIsLoading(true);
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const formData = new FormData();
      formData.append("csv", selectedFile);
      const res = await axios.post(
        `${baseURL}/api/csv/import-from-csv
            `,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (res) {
        fetchItems();
        setIsLoading(false);
      }
    } catch (error) {
      // //console.log(error);
      setIsLoading(false);
    }
  };
  // //console.log(collectionData,'json');
  const handleCreateCategory = async () => {
    const token = JSON.parse(localStorage.getItem("token"));  
    try {
      const response = await axios.post(
        `${baseURL}/api/categories`,
        catformData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201 || response.statusText === "Created") {
        Swal.fire({
          title: 'Success!',
          text: `Category "${response.data.categoryName}" created successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          SetShowcatmodal(false); // Close the modal
          setCatformData({ categoryName: "", description: "" }); // Reset form data
          window.location.reload(); // Refresh the page
        });
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      Swal.fire(
        'Error',
        error.response?.data?.message || error.message,
        'error'
      );
    }
    toggleModal(); // Close modal after update

  };
  const handleCreateSubcategory = async () => {
    //console.log(subCatFormData,"from click function")
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.post(
        `${baseURL}/api/subcategories`,
        subCatFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(response)
  
      if (response.status === 201 || response.statusText === "Created") {
        Swal.fire({
          title: "Success!",
          text: `Subcategory "${response.data.subCategoryName}" created successfully.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setShowSubCatModal(false); // Close modal
          setSubCatFormData({ category_id: "", subCategoryName: "", description: "" }); // Reset form
          window.location.reload(); // Refresh the page (or re-fetch data)
        });
      } else {
        throw new Error("Failed to create subcategory");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || error.message, "error");
    }
  };
  
  
  
  return (
    <Fragment>
      <Row xxl={12} className="pb-2">
        <Row>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <Nav tabs className="product_variant_tabs mb-3">
                <NavItem>
                  <NavLink
                    className={BasicTab === 1 ? "active" : ""}
                    onClick={() => handleAll()}
                  >
                    All Products
                  </NavLink>
                  
                </NavItem>
                
                {
                  // Ensure collectionData is defined and has data
                  Array.isArray(collectionData) &&
                    collectionData.length > 0 &&
                    collectionData
                      .sort((a, b) =>
                        a.collection_name.localeCompare(b.collection_name)
                      )
                      .slice(0, 20)
                      .map((data, index) => {
                        return (
                          <NavItem key={data?._id}>
                            <NavLink
                              className={BasicTab === index + 2 ? "active" : ""}
                              onClick={() => handleTabs(data, index)}
                            >
                              {data.collection_name}
                            </NavLink>
                          </NavItem>
                        );
                      })
                }
              </Nav>
              <div style={{display:"flex",gap:"24px",width:"750px"}}>
              <div className="mb-0 form-group position-relative search_outer d-flex align-items-center">
                <i className="fa fa-search" style={{ top: "unset" }}></i>
                <input
                  className="form-control border-0"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e)}
                  type="text"
                  placeholder="Search..."
                />
              </div>
              <div style={{display:"flex",gap:"24px",width:"600px",height:"45px"}}>

              <Input
                  type="select"
                  className="ms-3"
                  name="subCategory"
                  value={subCollectionValue}
                  onChange={(e) => handleSubCollectionChange(e)}
                >
                  <option value="">Select Category</option>
                  {
                    // Ensure subCollectionData is defined and has data
                    Array.isArray(subCollectionData) &&
                    subCollectionData.length > 0 &&
                    selectedCollectionId
                      ? subCollectionData
                          .filter(
                            (item) =>
                              item?.collection_id?._id === selectedCollectionId
                          )
                          .map((data) => {
                            return (
                              <option key={data?._id} value={data?._id}>
                                {data?.sub_collection_name}
                              </option>
                            );
                          })
                      : Array.isArray(subCollectionData) &&
                        subCollectionData.length > 0 &&
                        subCollectionData.map((data) => {
                          return (
                            <option key={data?._id} value={data?._id}>
                              {data?.sub_collection_name}
                            </option>
                          );
                        })
                  }
                </Input>
                <Input
                  type="select"
                  className="ms-3"
                  name="subCategory"
                  value={subCollectionValue}
                  onChange={(e) => handleSubCollectionChange(e)}
                  
                >
                  <option value="">Select Sub Category</option>
                  {
                    // Ensure subCollectionData is defined and has data
                    Array.isArray(subCollectionData) &&
                    subCollectionData.length > 0 &&
                    selectedCollectionId
                      ? subCollectionData
                          .filter(
                            (item) =>
                              item?.collection_id?._id === selectedCollectionId
                          )
                          .map((data) => {
                            return (
                              <option key={data?._id} value={data?._id}>
                                {data?.sub_collection_name}
                              </option>
                            );
                          })
                      : Array.isArray(subCollectionData) &&
                        subCollectionData.length > 0 &&
                        subCollectionData.map((data) => {
                          return (
                            <option key={data?._id} value={data?._id}>
                              {data?.sub_collection_name}
                            </option>
                          );
                        })
                  }
                </Input>
                </div>
                </div>
            </div>
          </Col>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content file-content1 justify-content-between">
              
              <div className="d-flex">
              
                {userRole === "SuperAdmin" && (
                  <Button
                    className="btn btn-primary d-flex align-items-center ms-3"
                    onClick={()=>SetShowcatmodal(true)}
                  >
                    <PlusCircle />
                    Add Category
                  </Button>
                )}
                {userRole === "SuperAdmin" && (
                  <Button
                    className="btn btn-primary d-flex align-items-center ms-3"
                    onClick={()=>setShowSubCatModal(true)}
                  >
                    <PlusCircle />
                    Add Sub-Category
                  </Button>
                )}
                {userRole === "SuperAdmin" && (
                  <Button
                    className="btn btn-primary d-flex align-items-center ms-3"
                    onClick={handleNavigate}
                  >
                    <PlusCircle />
                    Add Sub-Category Variant
                  </Button>
                )}
                
              </div>
            </div>
          </Col>
        </Row>
      </Row>

      <DataTable
        data={productsData || []}
        columns={orderColumns}
        pagination
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        progressPending={isLoading}
        progressComponent={<Loader />}
      />


<CommonModal
  isOpen={showSubCatModal}
  title={"Create New Subcategory"}
  className="create-subcategory-modal"
  toggler={() => setShowSubCatModal(false)}
  size="md"
>
  <Container>
    <Form
      className="subcategory-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateSubcategory();
      }}
    >
      <Col xxl={12} className="mb-3">
  <FormGroup>
    <Label for="categorySelect" className="form-label">
      Select Category:
    </Label>
    <Input
      type="select"
      id="categorySelect"
      value={subCatFormData.categoryId}  // Bind this to category_id in the form state
      onChange={(e) =>
        setSubCatFormData({
          ...subCatFormData,
          categoryId: e.target.value,  // Update category_id when a new category is selected
        })
      }
      className="form-control"
      required
    >
      <option value="">-- Select a Category --</option>
      {categories.map((category) => (
        <option key={category.id} value={category._id}>
          {category.categoryName}  {/* Show the categoryName in the dropdown */}
        </option>
      ))}
    </Input>
  </FormGroup>
</Col>

      <Col xxl={12} className="mb-3">
        <FormGroup>
          <Label for="subCategoryName" className="form-label">
            Subcategory Name:
          </Label>
          <Input
            type="text"
            id="subCategoryName"
            value={subCatFormData.subCategoryName}
            onChange={(e) =>
              setSubCatFormData({
                ...subCatFormData,
                subCategoryName: e.target.value,
              })
            }
            className="form-control"
            placeholder="Enter subcategory name"
            required
          />
        </FormGroup>
      </Col>
      <Col xxl={12} className="mb-4">
        <FormGroup>
          <Label for="description" className="form-label">
            Description:
          </Label>
          <Input
            type="textarea"
            id="description"
            value={subCatFormData.description}
            onChange={(e) =>
              setSubCatFormData({
                ...subCatFormData,
                description: e.target.value,
              })
            }
            className="form-control"
            placeholder="Enter subcategory description"
            required
          />
        </FormGroup>
      </Col>
      <Col xxl={12} className="d-flex justify-content-end">
        <Button
          type="button"
          className="cancel-btn btn btn-secondary me-2"
          onClick={() => setShowSubCatModal(false)}
        >
          Cancel
        </Button>
        <Button type="submit" className="submit-btn btn btn-primary">
          Create
        </Button>
      </Col>
    </Form>
  </Container>
</CommonModal>
    </Fragment>
  );
};
export default ItemsTable;
