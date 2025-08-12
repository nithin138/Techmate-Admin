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
    const [selectedServiceStatus, setSelectedServiceStatus] = useState("");  
    const [selectedRows, setSelectedRows] = useState([]);
    const [referralData, setReferralData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [toggleDelet, setToggleDelet] = useState(false);
    // const [BasicTab, setBasicTab] = useState(1);
    // const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState(null);
    const [subCollectionValue, setSubCollectionValue] = useState("");
    // const toggle = () => setDropdownOpen((prevState) => !prevState);
    const [loading,setLoading] = useState(false);

        const [results, setResults] = useState([]);
    

    
    
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
  
    //   
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
        let apiUrl = `${baseURL}/api/refer/admin/all`;
    
        if (filterValue !== "All") {
          apiUrl += `?status=${filterValue}`;
        }
    
        const products = await axios.get(apiUrl);
  
        // Check if products and products.data exist
        const referalData = products?.data?.referrals || []; // Default to an empty array if undefined
        //console.log(referalData, "referals");

        setIsLoading(false);
        setReferralData(referalData.reverse());
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
      name: "S.No",
      selector: (row, index) => index + 1,
      center: true,
      width: "100px",
      cell: (row, index) => index + 1,
    },
    {
      name: "Referrer",
      selector: (row) => row?.referrerId?.phoneNumber,
      center: true,
      // width: "210px",
      cell: (row) => row?.referrerId?.phoneNumber || "N/A",
    },
    {
      name: "Referred User",
      selector: (row) => row?.referredUserId?.phoneNumber,
      center: true,
      // width: "210px",
      cell: (row) => row?.referredUserId?.phoneNumber || "N/A",
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
      center: true,
      // width: "150px",
      cell: (row) => {
        const getStatusStyle = (status) => {
          switch (status?.toLowerCase()) {
            case "completed":
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
            default:
              return {
                backgroundColor: "gray",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
              };
          }
        };
  
        const capitalizeFirstLetter = (str) => 
          str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "Pending";
  
        return (
          <span style={{ fontSize: "13px", ...getStatusStyle(row?.status) }}>
            {capitalizeFirstLetter(row?.status)}
          </span>
        );
      },
    },
  
    {
      name: "Amount of Reward",
      selector: (row) => row?.amount,
      center: true,
      // width: "210px",
      cell: (row) => `${row?.amount || 0} Points`,
    },
  ];
  

  

    return (
      <Fragment>
        <Row xxl={12} className="pb-2">
          <Row>
            
            <Col md={12} lg={12} xl={12} xxl={12}>
              <div className="file-content file-content1 justify-content-between">
                  <H5 attrH5={{ className: "mb-0" }}>Referrals</H5>
  
              <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
  
                <div style={{ position: "relative"}}>
                {/* <div className="mb-0 form-group position-relative search_outer d-flex align-items-center">
                  <i className="fa fa-search" style={{ top: "unset" }}></i>
                  <input
                    className="form-control border-0"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e)}
                    type="text"
                    placeholder="Search..."
                  />
                </div> */}
                {/* {results?.length > 0 && (
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
  )} */}
                </div>
           
                 {/* <Input
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
                 </Input>                  */}
                </div>
              </div>
            </Col>
          </Row>
        </Row>
  
        <DataTable
          data={referralData}
          columns={orderColumns}
          pagination
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleDelet}
          progressPending={isLoading}
          progressComponent={<Loader />}
        />
  
  
  
      </Fragment>
    );
  };
  export default ItemsTable;
  