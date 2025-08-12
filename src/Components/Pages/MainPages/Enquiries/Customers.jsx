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
import { FaExchangeAlt } from "react-icons/fa";
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
import DatePicker from 'react-datepicker';


const ItemsTable = () => {
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem("role_name"));
  const { productsData, setProductsData } = useDataContext();
  console.log(productsData);
  const [selectedServiceStatus, setSelectedServiceStatus] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
   const [startDate, setStartDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toggleDelet, setToggleDelet] = useState(false);
  // const [BasicTab, setBasicTab] = useState(1);
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [subCollectionValue, setSubCollectionValue] = useState("");
  // const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [loading, setLoading] = useState(false);

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
      let apiUrl = `${baseURL}/api/broadcastenquiries`;

      if (filterValue !== "All") {
        apiUrl += `?status=${filterValue}`;
      }

      const products = await axios.get(apiUrl);
      console.log(products, "products");

      // Check if products and products.data exist
      const productsData = products?.data?.enquiries?.reverse() || []; // Default to an empty array if undefined
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
        `${baseURL}/api/dashboard/users/search?phoneNumber=${searchTerm}`
      );
      //console.log(response, "respnse for search results");
      setProductsData(response.data.users);
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





  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
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
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("[ERROR] No token found in localStorage");
            return;
          }

          //console.log("[DEBUG] Token before request:", token);

          await axios.delete(`${baseURL}/api/broadcastenquiries/${id}`, {
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`, // Ensure no extra quotes
            },
          }).then((res) => {
            console.log(res)
            Swal.fire({
              icon: "success",
              title: res?.data?.message,
            });
            fetchItems();
          });
        } catch (err) {
          console.error("[ERROR] Axios request failed:", err);
        }
      }
    });
  };

  const handleApproval = async (id) => {
    try {
      const response = await axios.patch(`${baseURL}/api/broadcastenquiries/${id}`)
      console.log(response)
      if (response?.data?.success === true) {
        Swal.fire({
          icon: "success",
          text: response?.data?.message,
        })
        fetchItems();
      }
      else {
        Swal.fire({
          icon: "error",
          title: response?.data?.error
        })
      }
    }
    catch (error) {
      console.log(error)
      Swal.fire({
        icon: "warning",
        title: error?.response?.data?.error
      })
    }
  }


  const orderColumns = [
    {
      name: "Name",
      selector: (row) => `${row?._id}`,
      width: "260px",
      cell: (row) => (

        <div className="ellipses_text_1">
          {(row?.name || "unspecified")}
        </div>

      ),
      center: true,
    },
    {
      name: "Contact Number",
      selector: (row) => row?.mobile,
      center: true,
      width: "210px",
      cell: (row) => row?.mobile,
    },

    {
      name: "Description",
      selector: (row) => row?.description,
      center: true,
      width: "210px",
      cell: (row) => row?.description || "unspecified",
    },
    {
      name: "Registered Mobile",
      selector: (row) => row?.userId?.phoneNumber,
      center: true,
      width: "210px",
      cell: (row) => row?.userId?.phoneNumber || "unspecified",
    },
    {
      name: "Registered Email",
      selector: (row) => row?.userId?.email,
      center: true,
      width: "210px",
      cell: (row) => row?.userId?.email || "unspecified",
    },
    {
      name: "Requested Service",
      selector: (row) => row?.subCategory?.categoryName,
      center: true,
      width: "210px",
      cell: (row) => row?.subCategory?.categoryName,
    },
    {
      name: "Total Service Providers Notified",
      selector: row => row.businessesNotified?.length || 0,
      center: true,
      width: "210px"
    },
    {
      name: "Requested On",
      center: true,
      width: "210px",
      selector: row => row.createdAt,
      cell: row => {
        const date = new Date(row.createdAt);
        return date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }
    },
    {
      name: "Approval Status",
      selector: (row) => row.isApproved ? "Approved" : "Unapproved",
      sortable: true,
      width: "135px",
      center: true,
      cell: (row) => {
        const getStatusStyle = (isApproved) => {
          if (isApproved === true) {
            return {
              backgroundColor: "green",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
            };
          } else if (isApproved === false) {
            return {
              backgroundColor: "#f4c908",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
            };
          } else {
            // In case isApproved is undefined or null
            return {
              backgroundColor: "gray",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
            };
          }
        };

        return (
          <span style={{ fontSize: "13px", ...getStatusStyle(row?.isApproved) }}>
            {row?.isApproved === true ? "Approved" : row?.isApproved === false ? "Unapproved" : "Unknown"}
          </span>
        );
      },
    },
    {
      name: "Enquiry Status",
      selector: (row) => row?.status,
      sortable: true,
      width: "135px",
      center: true,
      cell: (row) => {
        const getStatusStyle = (status) => {
          if (status === "Open") {
            return {
              backgroundColor: "#f4c908",
              color: "white",
              padding: "5px 14px",
              borderRadius: "5px",
            };
          } else if (status === "Accepted") {
            return {
              backgroundColor: "green",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
            };
          }
          else {
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
            {row?.status ?? "Unknown"}
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
                {row?.isApproved === false && (
                  <DropdownItem
                    style={{ color: "green" }}
                    onClick={() => handleApproval(row?._id)}
                  >
                    Approve
                    <FaPen />
                  </DropdownItem>
                )}
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


  return (
    <Fragment>
      <Row xxl={12} className="pb-2">
        <Row>

          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content file-content1 justify-content-between">            
            
              <H5 attrH5={{ className: "mb-0" }}>Public Enquiries</H5>
              <DatePicker className="datepickerr form-control digits mx-2"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                showIcon
                placeholderText='Select Month'
              />
            

              {/* <div style={{ display: "flex", alignItems: "center", gap: "16px" }}> */}

                {/* <div style={{ position: "relative" }}> */}
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

                {/* </div> */}


              {/* </div> */}
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



    </Fragment>
  );
};
export default ItemsTable;
