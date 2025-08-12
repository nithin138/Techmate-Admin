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
  const [selectedRow, setSelectedRow] = useState(null);
  const [collectionData, setCollectionData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [BasicTab, setBasicTab] = useState(1);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [subCollectionValue, setSubCollectionValue] = useState("");
 const [showCatModal, setShowCatModal] = useState(false);
  const [showeCatModal, setShoweCatModal] = useState(false);  
  const [CatFormData, setCatFormData] = useState({
    name:"",
    duration:"",
    type:"",
    price:"",
    features:[],
    tempDescription:''
  });
  const [eCatFormData, seteCatFormData] = useState({
    name:"",
    duration:"",
    durationUnit:"",
    price:"",
    features:[],
    tempDescription:''
  });
  
  const toggleModal = () => {
    setShowCatModal(!showCatModal);
  };
    console.log(selectedRow)
  const fetchItems = async () => {
    setIsLoading(true);
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
 

      const products = await axios.get(
        `${baseURL}/api/subscriptionplan`
        , {
        // params: params,
        headers: {
            Authorization: `${token}`,
        }}
      );
      // //console.log(products, "products");

      // Check if products and products.data exist
      const productsData = products?.data|| []; // Default to an empty array if undefined
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


  useEffect(() => {
    fetchItems();
  }, [selectedCollectionId, subCollectionValue]);

  const fetchSearchResults = async () => {
    // setLoading(true);
    try {
      // Make API call to search products (adjust URL based on your backend)
      const response = await axios.get(
        `${baseURL}/api/dashboard/productCategory/search?query=${searchTerm}`
      );
      //console.log(response, "respnse for search results");
      setProductsData(response.data.categories);
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
        fetchItems(); // Fetch all items when search bar is empty
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
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
          const token = JSON.parse(localStorage.getItem("token"));
          const res = await axios.delete(`${baseURL}/api/subscriptionplan/${id}`, {
            headers: { Authorization: `${token}` },
          });
          if(res.status === 200){
   Swal.fire({
            icon: "success",
            title: res?.data?.message || "Deleted successfully!",
          });
  
          fetchItems(); 
          }
       
        } 
        catch (err) {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong!",
          });
        }
      }
    });
  };

  const orderColumns = [
    {
      name: "ID",
      selector: (row) => `ID-${row?._id.slice(-6)}`, // Masked ID with last 6 characters
      center: true,
      width: "150px",
      cell: (row) => `ID-${row?._id.slice(-6)}`,
    },
    {
      name: "NAME",
      selector: (row) => row?.name || "N/A", // subCategoryName field
      center: true,
      width: "200px",
    
      cell: (row) => (
        <div >
          <span>{row?.name || "N/A"}</span>
        </div>
      ),
    },
    {
      name: "Benificier",
      selector: (row) => row?.type || "N/A", // subCategoryName field
      center: true,
      minWidth: "100px",
      cell: (row) => (
        <div >
          <span>{row?.type || "N/A"}</span>
        </div>
      ),
    },
    {
      name: "DURATION",
      selector: (row) => row?.name || "N/A", // subCategoryName field
      center: true,
      minWidth: "100px",
      cell: (row) => (
        <div >
          <span>{`${row?.duration} Months` || "N/A"}</span>
        </div>
      ),
    },
    {
      name: "PRICE",
      selector: (row) => row?.price || "N/A", // subCategoryName field
      center: true,
      minWidth: "100px",
      cell: (row) => (
        <div >
          <span>₹{row?.price || "N/A"}</span>
        </div>
      ),
    },
    {
      name: "FEATURES",
      selector: (row) =>
        row?.features?.length
          ? row.features.map((feature, index) => `${index + 1}. ${feature}`).join(", ")
          : "N/A",
      width: "450px",
      cell: (row) => {
        const features = row?.features || [];
        
        return features.length > 0 ? (
          <ul style={{ paddingLeft: "15px", margin: 0 }}>
            {features.map((feature, index) => (
              <li key={index} style={{ listStyleType: "none" }}>
                {index + 1}. {feature}
              </li>
            ))}
          </ul>
        ) : (
          <>N/A</>
        );
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
                  setSelectedRow(row?._id)
                  setCatFormData({
                    name:row?.name,
                    duration:row?.duration,
                    price:row?.price,
                    features:row?.features,
                  })
                  toggleModal()
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
  const handleCreateCategory = async () => {
    //console.log(CatFormData, "from click function");
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.post(
        `${baseURL}/api/subscriptionplan`,
        CatFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(response);

      if (response.status === 201 || response.statusText === "Created") {
        Swal.fire({
          title: "Success!",
          text: `Subscription plan created successfully.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setShowCatModal(false); // Close modal
          setCatFormData({    name:"",
            duration:"",
            durationUnit:"",
            price:0,
            features:[],
            tempDescription:'' }); // Reset form
fetchItems();
        });
      } else {
        throw new Error("Failed to create Category");
      }
    } catch (error) {
      console.log(error)
      Swal.fire(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    }
  };
  const handleEditCategory = async () => {
    //console.log(CatFormData, "from edit function");
    const token = JSON.parse(localStorage.getItem("token"));
    console.log(CatFormData,"data into API")
    try {
      const response = await axios.put(
        `${baseURL}/api/subscriptionplan/${selectedRow}`,
        CatFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(response);

      if (response.status === 200 || response.statusText === "Created") {
        Swal.fire({
          title: "Success!",
          text: `Category Updated successfully.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setShoweCatModal(false); // Close modal
          setCatFormData({ categoryName: "", description: "" }); // Reset form
fetchItems();
        });
      } else {
        throw new Error("Failed to create Category");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    }
  };

  //console.log(CatFormData, "CatFormData");
  
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
                    All Subscription Plans
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
               <div className="d-flex mb-3">
              
                {userRole === "SuperAdmin" && (
                  <Button
                    className="btn btn-primary d-flex align-items-center ms-3"
                    onClick={toggleModal}
                  >
                    <PlusCircle style={{marginRight:"8px"}}/>
                    Add Subscription Plan
                  </Button>
                )}
                
                
              </div>
            </div>
          </Col>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content file-content1 justify-content-between">
            <div style={{display:"flex",gap:"24px",width:"750px"}}>
              {/* <div className="mb-0 form-group position-relative search_outer d-flex align-items-center">
                <i className="fa fa-search" style={{ top: "unset" }}></i>
                <input
                  className="form-control border-0"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e)}
                  type="text"
                  placeholder="Search..."
                />
              </div>              */}
                </div>
             
            </div>
          </Col>
        </Row>
      </Row>

      <DataTable
        data={productsData || []}
        columns={orderColumns}
        pagination
        // onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        progressPending={isLoading}
        progressComponent={<Loader />}
      />



      

{/* <CommonModal
  isOpen={showCatModal}
  title={"Create New Subscription Plan"}
  toggler={() => setShowCatModal(false)}
  size="lg"
>
  <Container>
    <Form
      className="subcategory-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateCategory();
      }}
    >
      <Row className="mb-3">
        <Col xxl={6} className="mb-3">
          <FormGroup>
            <Label for="name" className="form-label">
              Name :
            </Label>
            <Input
              type="text"
              id="name"
              value={CatFormData.name}
              onChange={(e) =>
                setCatFormData({
                  ...CatFormData,
                  name: e.target.value,
                })
              }
              className="form-control"
              placeholder="Enter Plan name"
            />
          </FormGroup>
        </Col>
        <Col xxl={6} className="mb-3">
          <FormGroup>
            <Label for="price" className="form-label">
              Price :
            </Label>
            <Input
              type="number"
              id="price"
              value={CatFormData.price}
              onChange={(e) =>
                setCatFormData({
                  ...CatFormData,
                  price: e.target.value,
                })
              }
              className="form-control"
              placeholder="Enter Plan price"
            />
          </FormGroup>
        </Col>
        <Col xxl={6} className="mb-3">
          <FormGroup>
            <Label for="duration" className="form-label">
              Duration :
            </Label>
            <Input
              type="text"
              id="duration"
              value={CatFormData.duration}
              onChange={(e) =>
                setCatFormData({
                  ...CatFormData,
                  duration: e.target.value,
                })
              }
              className="form-control"
              placeholder="Enter Plan duration in months"
            />
          </FormGroup>
        </Col>
        <Col xxl={6} className="mb-3">
  <FormGroup>
    <Label for="type" className="font-medium text-base">
      Available for
    </Label>
    <Input
      type="select"
      id="type"
      value={CatFormData.type}
      onChange={(e) =>
        setCatFormData({
          ...CatFormData,
          type: e.target.value,
        })
      }
    >
      <option value="" disabled>
        Select Benificier
      </option>
      <option value="Freelancer">Freelancer</option>
      <option value="Service & Product Provider">Business</option>
    </Input>
  </FormGroup>
</Col>


        <Col xxl={12} className="mb-3">
          <FormGroup>
            <Label for="features" className="form-label">
              Description (Enter points, press Enter to add)
            </Label>
            <Input
              type="text"
              id="features"
              value={CatFormData.tempDescription || ""}
              onChange={(e) =>
                setCatFormData({
                  ...CatFormData,
                  tempDescription: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && CatFormData.tempDescription.trim()) {
                  e.preventDefault();
                  setCatFormData({
                    ...CatFormData,
                    features: [
                      ...CatFormData.features,
                      CatFormData.tempDescription.trim(),
                    ],
                    tempDescription: "",
                  });
                }
              }}
              className="form-control"
              placeholder="Enter a point and press Enter"
            />
          </FormGroup>
          <ul className="list-group">
            {CatFormData?.features?.map((point, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{color:"inherit"}}
              >
                {point}
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setCatFormData({
                      ...CatFormData,
                      features: CatFormData.features.filter(
                        (_, i) => i !== index
                      ),
                    });
                  }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </Col>
      </Row>

      <Col xxl={12} className="d-flex justify-content-end">
        <Button
          type="button"
          className="cancel-btn btn btn-secondary me-2"
          onClick={() => setShowCatModal(false)}
        >
          Cancel
        </Button>
        <Button type="submit" className="submit-btn btn btn-primary">
          Create
        </Button>
      </Col>
    </Form>
  </Container>
</CommonModal> */}


<CommonModal
  isOpen={showCatModal}
  title={selectedRow ? "Update the Selected Subscription Plan" : " Create New Subscription Plan"}
  toggler={toggleModal}
  size="lg"
>
  <Container>
    <Form
      className="subcategory-form"
      onSubmit={(e) => {
        e.preventDefault();
        selectedRow ? handleEditCategory() : handleCreateCategory();
      }}
    >
        <Row className="mb-3">
        <Col xxl={6} className="mb-3">
          <FormGroup>
            <Label for="name" className="form-label">
              Name :
            </Label>
            <Input
              type="text"
              id="name"
              value={CatFormData.name}
              onChange={(e) =>
                setCatFormData({
                  ...CatFormData,
                  name: e.target.value,
                })
              }
              className="form-control"
              placeholder="Enter Plan name"
            />
          </FormGroup>
        </Col>
        <Col xxl={6} className="mb-3">
          <FormGroup>
            <Label for="price" className="form-label">
              Price :
            </Label>
            <Input
              type="number"
              id="price"
              value={CatFormData.price}
              onChange={(e) =>
                setCatFormData({
                  ...CatFormData,
                  price: e.target.value,
                })
              }
              className="form-control"
              placeholder="Enter Plan price"
            />
          </FormGroup>
        </Col>
        <Col xxl={6} className="mb-3">
          <FormGroup>
            <Label for="duration" className="form-label">
              Duration :
            </Label>
            <Input
              type="text"
              id="duration"
              value={CatFormData.duration}
              onChange={(e) =>
                setCatFormData({
                  ...CatFormData,
                  duration: e.target.value,
                })
              }
              className="form-control"
              placeholder="Enter Plan duration"
            />
          </FormGroup>
        </Col>
        <Col xxl={6} className="mb-3">
<FormGroup>
    <Label for="type" className="font-medium text-base">
      Available for
    </Label>
    <Input
      type="select"
      id="type"
      value={CatFormData.type}
      onChange={(e) =>
        setCatFormData({
          ...CatFormData,
          type: e.target.value,
        })
      }
    >
      <option value="" disabled>
        Select Benificier
      </option>
      <option value="Freelancer">Freelancer</option>
      <option value="Service & Product Provider">Business</option>
    </Input>
  </FormGroup>
</Col>


        {/* Description Box */}
        <Col xxl={12} className="mb-3">
          <FormGroup>
            <Label for="features" className="form-label">
              Description (Enter points, press Enter to add)
            </Label>
            <Input
              type="text"
              id="features"
              value={CatFormData.tempDescription || ""}
              onChange={(e) =>
                setCatFormData({
                  ...CatFormData,
                  tempDescription: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && CatFormData.tempDescription.trim()) {
                  e.preventDefault();
                  setCatFormData({
                    ...CatFormData,
                    features: [
                      ...CatFormData.features,
                      CatFormData.tempDescription.trim(),
                    ],
                    tempDescription: "",
                  });
                }
              }}
              className="form-control"
              placeholder="Enter a point and press Enter"
            />
          </FormGroup>
          {/* Display Added Points */}
          <ul className="list-group">
            {CatFormData?.features?.map((point, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{color:"inherit"}}
              >
                {point}
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setCatFormData({
                      ...CatFormData,
                      features: CatFormData.features.filter(
                        (_, i) => i !== index
                      ),
                    });
                  }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    

      <Col xxl={12} className="d-flex justify-content-end">
        <Button
          type="button"
          className="cancel-btn btn btn-secondary me-2"
          onClick={toggleModal}
        >
          Cancel
        </Button>
        <Button type="submit" className="submit-btn btn btn-primary">
          {selectedRow ? "Update" : "Create"}
        </Button>
      </Col>
    </Form>
  </Container>
</CommonModal>

    </Fragment>
  );
};
export default ItemsTable;




// --------------------------------------------------------------------------------------------
// const getFilteredData = async () => {
//   setIsLoading(true);
//   try {
//     const token = await JSON.parse(localStorage.getItem("token"));
//     let params = {};
//     if (subCollectionValue) {
//       params = {
//         subCategory_id: subCollectionValue,
//       };
//     }
//     if (selectedCollectionId) {
//       params = {
//         category_id: selectedCollectionId,
//       };
//     }

//     const response = await axios.get(
//       `${productBaseURL}/products/get-products`,
//       {
//         params: params,
//         headers: {
//           Authorization: `${token}`,
//         },
//       }
//     );

//     if (response?.status === 200 && response) {
//       setProductsData(response?.data?.data.reverse());
//       //console.log(response?.data?.data.reverse());
//       setIsLoading(false);
//     }
//   } catch (error) {
//     console.error(error);
//     setIsLoading(false);
//   }
// };
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