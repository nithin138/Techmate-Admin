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
  H5,
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
  const [selectedServiceStatus, setSelectedServiceStatus] = useState("");  
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
  const [loading,setLoading] = useState(false);
    const [showModal, SetShowmodal] = useState(false);
      const [results, setResults] = useState([]);
  
    const [productStatus, setProductStatus] = useState(""); // Current product status
    const [statusValue, setStatusValue] = useState("");
    const [description, setDescription] = useState("");
    const [selectedRow, setSelectedRow] = useState(null); // Row data for the selected product
  
  
    const serviceStatusOptions = [
      { _id: "pending", status_name: "Pending" },
      { _id: "Approved", status_name: "Approved" },
      { _id: "Rejected", status_name: "Rejected" }
    ];
    
    const handleServiceStatusChange = (e) => {
      const selectedStatus = e.target.value;
      setSelectedServiceStatus(selectedStatus); // Ensure this function is defined
      fetchItems(selectedStatus);
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
  const handleStatus = async (e) => {
    e.preventDefault();
  //console.log(statusValue)
    if (statusValue === "Rejected" && !description.trim()) {
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
      rejectionReason: statusValue === "Rejected" ? description : undefined,
    };
    //console.log(body)
    //console.log(statusValue)
  
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
    toggleModal(); // Close modal after update
  };
  

  
  // const handleStatus = async (e) => {
  //   e.preventDefault();
  //   const token = await JSON.parse(localStorage.getItem("token"));
  //   let body = {
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
  const fetchItems = async (filterValue = "All") => {
    setIsLoading(true);
    try {
      let apiUrl = `${baseURL}/api/products`;
  
      if (filterValue !== "All") {
        apiUrl += `?status=${filterValue}`;
      }
      //console.log(apiUrl,"goiing to request")
      const products = await axios.get(apiUrl);
      //console.log(products, "products");

      // Check if products and products.data exist
      const productsData = products?.data || []; // Default to an empty array if undefined
      // //console.log(productsData, "osvnisjd");

      // If you're accessing the length of productsData
     

      // if (productsData.length > 0) {
      setIsLoading(false);
      setProductsData(productsData.reverse());
      // }
    } catch (error) {
      setIsLoading(false);
      // //console.log(error, 'error from items getting')
    }
  };
  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      // Make API call to search products (adjust URL based on your backend)
      const response = await axios.get(
        `${baseURL}/api/dashboard/products/search?query=${searchTerm}`
      );
      //console.log(response, "respnse for search results");
      setResults(response.data.products);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Set a timeout to delay the API call to reduce requests when user is typing quickly
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchSearchResults();
      } else {
        setResults([]); // Clear results if the search term is empty
      }
    }, 500); // Delay of 500ms after the user stops typing

    // Cleanup the timeout if searchTerm changes before the timeout completes
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
  })
}

  const orderColumns = [
    {
      name: "Product",
      selector: (row) => `${row?._id}`,
      width: "210px",
      cell: (row) => (
        <>
          <Media className="d-flex">
            <Image
              attrImage={{
                className: "img-30 me-3",
                src: Array.isArray(row?.imageUrl) && row?.imageUrl.length > 0 
                  ? row.imageUrl[0] 
                  : dummyImg,
                alt: "Generic placeholder image",
              }}
            />
            <Media body className="align-self-center" style={{ cursor: "pointer" }}>
              <div className="ellipses_text_1" onClick={() => handleprodNavigation(row?._id)}>
                {row?.productName}
              </div>
            </Media>
          </Media>
        </>
      ),
      center: true,
    },    
    {
      name: "Segment",
      selector: (row) => row?.segment?.name,
      center: true,
      width: "175px",

      cell: (row) => row?.segment?.name,
    },
    {
      name: "Category Name",
      selector: (row) => row?.category?.categoryName,
      center: true,
      width: "200px",

      cell: (row) => row?.category?.categoryName,
    },
    {
      name: "Product",
      selector: (row) => row?.product?.categoryName,
      center: true,
      sortable:true,
      width:"245px",
      cell: (row) => row?.product?.categoryName
    },
    // {
    //     name: 'Sub Category',
    //     selector: row => row?.subCategory?.sub_collection_name.toUpperCase(),
    //     center: true,
    //     // width: "100px",
    //     cell: (row) => (
    //         row?.subCategory?.sub_collection_name.toUpperCase()
    //     )
    // },
  
    {
      name: "Description",
      selector: (row) => `${row?.description.slice(0, 100)}`,
      width: "450px",
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
      name: "Status",
      selector: (row) => `${row.status}`,
      sortable: true,
      center: true,
      width: "150px",
      cell: (row) => {
        const getStatusStyle = (status) => {
          switch (status) {
            case "Approved":
              return {
                backgroundColor: "green",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
              };
            case "pending":
              return {
                backgroundColor: "#f4c908",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
              };
            case "Rejected":
              return {
                backgroundColor: "red",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
              };
            default:
              return {
                backgroundColor: "gray",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
              };
          }
        };
    
        return (
          <span style={{ fontSize: "13px", ...getStatusStyle(row?.status) }}>
            {capitalizeFirstLetter(row?.status)}
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
                <DropdownItem onClick={() => toggleModal(row)}>
  Change Status <FaExchangeAlt />
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
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  }
  return (
    <Fragment>
      <Row xxl={12} className="pb-2">
        <Row>
          
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content file-content1 justify-content-between">
                <H5 attrH5={{ className: "mb-0" }}>Products</H5>

            <div style={{display:"flex",alignItems:"center",gap:"16px"}}>

              <div style={{ position: "relative"}}>
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
              {results?.length > 0 && (
  <div className="autocomplete-dropdown-container">
    <div className="header-search-suggestion custom-scrollbar" style={{ border: "none" }}>
      {results.map((result) => (
        <li
          key={result._id}
          style={{
            padding: "10px",
            cursor: "pointer",
            listStyle: "none",
          }}
          onClick={() => handleprodNavigation(result?._id)}
        >
          {result.productName}
        </li>
      ))}
    </div>
  </div>
)}
              </div>
         
               <Input
                 type="select"
                 name="serviceStatus"
                 value={selectedServiceStatus} // Ensure state is managed
                 onChange={handleServiceStatusChange}
               >
                 <option value="">All</option>
                 {Array.isArray(serviceStatusOptions) &&
                   serviceStatusOptions.length > 0 &&
                   serviceStatusOptions.map((status) => (
                     <option key={status._id} value={status._id}>
                       {status.status_name}
                     </option>
                   ))}
               </Input>
                {/* {userRole === "SuperAdmin" && (
                  <Button
                    className="btn btn-primary d-flex align-items-center ms-3"
                    onClick={handleNavigate}
                  >
                    <PlusCircle />
                    Add Product
                  </Button>
                )} */}
               
              </div>
            </div>
          </Col>
        </Row>
      </Row>

      <DataTable
        data={productsData?productsData : []}
        columns={orderColumns}
        pagination
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        progressPending={isLoading}
        progressComponent={<Loader />}
      />


<CommonModal
        isOpen={showModal}
        title={"Change Status"}
        className="store_modal"
        toggler={toggleModal}
        size="md"
      >
        <Container>
        <Form className="status_form" onSubmit={handleStatus}>
  <Col xxl={12} className="mb-3">
    <p className="current-status">
      The application's current status is:{" "}
      <span style={{ fontWeight: "bold", color: "#007bff" }}>
        {productStatus ? productStatus.toUpperCase() : "N/A"}
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
                        <option value="">select</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </Input>
    </FormGroup>
  </Col>
  {statusValue === "Rejected" && (
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
      onClick={toggleModal}
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

    </Fragment>
  );
};
export default ItemsTable;
