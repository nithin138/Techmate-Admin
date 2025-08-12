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

const ItemsTable = () => {
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem("role_name"));
  const { productsData, setProductsData } = useDataContext();
  const [selectedServiceStatus, setSelectedServiceStatus] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [action, setAction] = useState(null)
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(null);
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
    console.log(selectedStatus)
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
    console.log(filterValue)
    try {
      let apiUrl = `${baseURL}/api/withdrawal`;

      if (filterValue !== "All") {
        apiUrl += `?status=${filterValue}`;
      }

      const products = await axios.get(apiUrl);
      console.log(products, "withdrawls");

      // Check if products and products.data exist
      const productsData = products?.data?.requests || []; // Default to an empty array if undefined
      // //console.log(productsData, "osvnisjd");

      // If you're accessing the length of productsData


      // if (productsData.length > 0) {
      setIsLoading(false);
      setProductsData(productsData);
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
  }, []);

  const orderColumns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      center: true,
      width: "80px",
      cell: (row, index) => index + 1,
    },
    {
      name: "Phone Number",
      selector: (row) => row?.userId?.phoneNumber,
      center: true,
      cell: (row) => row?.userId?.phoneNumber || "N/A",
    },
    {
      name: "Email",
      selector: (row) => row?.userId?.email,
      center: true,
      cell: (row) => row?.userId?.email || "Unspecified",
    },
    // {
    //   name: "Status",
    //   selector: (row) => row?.status,
    //   sortable: true,
    //   center: true,
    //   cell: (row) => {
    //     const getStatusStyle = (status) => {
    //       switch (status?.toLowerCase()) {
    //         case "approved":
    //           return { backgroundColor: "green", color: "white", padding: "5px 10px", borderRadius: "5px" };
    //         case "pending":
    //           return { backgroundColor: "#f4c908", color: "white", padding: "5px 10px", borderRadius: "5px" };
    //         default:
    //           return { backgroundColor: "gray", color: "white", padding: "5px 10px", borderRadius: "5px" };
    //       }
    //     };

    //     const capitalizeFirstLetter = (str) =>
    //       str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "Pending";

    //     return (
    //       <span style={{ fontSize: "13px", ...getStatusStyle(row?.status) }}>
    //         {capitalizeFirstLetter(row?.status)}
    //       </span>
    //     );
    //   },
    // },
    {
      name: "Request",
      selector: (row) => row?.coins,
      center: true,
      cell: (row) => row?.coins || 0,
    },
     {
      name: "Amount",
      selector: (row) => row?.amount,
      center: true,
      cell: (row) => row?.amount || 0,
    },
        {
      name: "Payment status",
      selector: (row) => row?.paymentStatus,
      center: true,
cell: (row) => {
        const getStatusStyle = (paymentStatus) => {
          switch (paymentStatus?.toLowerCase()) {
            case "paid":
              return { backgroundColor: "green", color: "white", padding: "5px 10px", borderRadius: "5px" };
         
            default:
              return { backgroundColor: "gray", color: "white", padding: "5px 10px", borderRadius: "5px" };
          }
        };

        const capitalizeFirstLetter = (str) =>
          str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "Pending";

        return (
          <span style={{ fontSize: "13px", ...getStatusStyle(row?.paymentStatus) }}>
            {capitalizeFirstLetter(row?.paymentStatus)}
          </span>
        );
      },    },
    {
      name: "Application Date",
      selector: (row) => row?.createdAt,
      center: true,
      cell: (row) => {
        if (!row?.createdAt) return "N/A";
        const formattedDate = new Date(row.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return formattedDate.replace(",", " "); // Adds space between date and time
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
                {
                  row?.paymentStatus?.toLowerCase() !== 'paid' &&
                  <DropdownItem style={{ color: "green" }} onClick={() => { handleStatusUpdate('Approved', row?._id) }}>Settle
                    <FaPen />
                  </DropdownItem>
                }
              </DropdownMenu>

            </UncontrolledDropdown>
          </div>
        </div>
      ),
      right: true,
    },
  ];
  const handleUpdateReward = async (amount) => {
    //console.log(amount, "from click function");

    let body = {
      key: action,
      value: amount,
    };

    const token = JSON.parse(localStorage.getItem("token"));

    try {
      const response = await axios.post(
        `${baseURL}/api/config/update-configs`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //console.log(response);

      if (response.status === 200 || response.statusText === "Created") {
        Swal.fire({
          title: "Success!",
          text: response?.data?.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setShowCatModal(false); // Close modal
          fetchItems(); // Refresh data
          setRewardAmount('')
          window.location.reload()
        });
      } else {
        throw new Error("Failed to update reward amount");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    }
  };
  const handleStatusUpdate = async (status, id) => {
    const body = {
      status: status
    }
    try {
      const response = await axios.patch(`${baseURL}/api/withdrawal/admin/${id}`, body)
      console.log(response)
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: response?.data?.message || "update Successful",
          showConfirmButton: false,
          timer: 2000
        })
      }
      fetchItems();
    }
    catch (error) {
      console.log(error)
    }
  }


  return (
    <Fragment>
      <Row xxl={12} className="pb-2">
        <Row>

          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content file-content1 justify-content-between">
              <H5 attrH5={{ className: "mb-0" }}>withdrawals</H5>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>



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
                <Button
                  className="btn btn-primary d-flex align-items-center ms-3"
                  onClick={() => {
                    setShowCatModal(true);
                    setAction("minRewardPoints")
                  }}
                >
                  <PlusCircle />
                  Update Minimum  Withdrawal
                </Button>
                <Button
                  className="btn btn-primary d-flex align-items-center ms-3"
                  onClick={() => {
                    setShowCatModal(true);
                    setAction("maxRewardPoints")
                  }}                          >
                  <PlusCircle />
                  Update Maximum Withdrawal
                </Button>
                <Button
                  className="btn btn-primary d-flex align-items-center ms-3"
                  onClick={() => {
                    setShowCatModal(true);
                    setAction("referralReward")
                  }}                          >
                  <PlusCircle />
                  Update Reward
                </Button>
                    <Button
                  className="btn btn-primary d-flex align-items-center ms-3"
                  onClick={() => {
                    setShowCatModal(true);
                    setAction("amountPerCoin")
                  }}                          >
                  <PlusCircle />
                  Update amount per coin
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Row>

      <DataTable
        data={productsData ? productsData : []}
        columns={orderColumns}
        pagination
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        progressPending={isLoading}
        progressComponent={<Loader />}
      />

      <CommonModal
        isOpen={showCatModal}
        title={"Update Reward Conigurations"}
        toggler={() => setShowCatModal(false)}
        size="md"
      >
        <Container>
          <Form
            className="reward-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateReward(rewardAmount); // Pass rewardAmount when submitting
            }}
          >
            {action === "minRewardPoints" && <Col xxl={12} className="mb-3">
              <FormGroup>
                <Label for="rewardAmount" className="form-label">
                  Enter Minimum Claim Points:
                </Label>
                <Input
                  type="number"
                  id="rewardAmount"
                  placeholder="Enter value"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                />
              </FormGroup>
            </Col>}
            {action === "maxRewardPoints" && <Col xxl={12} className="mb-3">
              <FormGroup>
                <Label for="rewardAmount" className="form-label">
                  Enter Maximum Withdrawal Points:
                </Label>
                <Input
                  type="number"
                  id="rewardAmount"
                  placeholder="Enter value"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                />
              </FormGroup>
            </Col>}
            {action === "referralReward" && <Col xxl={12} className="mb-3">
              <FormGroup>
                <Label for="rewardAmount" className="form-label">
                  Enter Reward Points:
                </Label>
                <Input
                  type="number"
                  id="rewardAmount"
                  placeholder="Enter value"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                />
              </FormGroup>
            </Col>}
                {action === "amountPerCoin" && <Col xxl={12} className="mb-3">
              <FormGroup>
                <Label for="rewardAmount" className="form-label">
                  Enter Amount Per Coin:
                </Label>
                <Input
                  type="text"
                  id="rewardAmount"
                  placeholder="Enter value"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                />
              </FormGroup>
            </Col>}



            <Col xxl={12} className="d-flex justify-content-end">
              <Button
                type="button"
                className="cancel-btn btn btn-secondary me-2"
                onClick={() => setShowCatModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="submit-btn btn btn-primary">
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
