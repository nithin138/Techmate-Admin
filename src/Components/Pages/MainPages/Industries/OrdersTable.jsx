import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import DataTable from "react-data-table-component";
import { Btn, H4, H5,Image } from "../../../../AbstractElements";
import { tableColumns, orderColumns, products } from "./data";
import dummyImg from "../../../../assets/images/product/2.png";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Pagination,
  PaginationItem,
  Row,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import CommonModal from "../../../UiKits/Modals/common/modal";
// import ExcelExport from 'react-data-export';
// import * as XLSX from 'xlsx';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  UncontrolledDropdown,
} from "reactstrap";
import { MoreVertical, Trash2 } from "react-feather";
import { FaDownload, FaRegEye, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import axios from "axios";
import { baseURL, orderURL } from "../../../../Services/api/baseURL";
import moment from "moment";
import Loader from "../../../Loader/Loader";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import {FaExchangeAlt,FaPen} from "react-icons/fa";
import { Widgets } from "../../../../Constant";


const DataTableComponent = () => {
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem("role_name"));
  const [selectedRows, setSelectedRows] = useState([]);
  const [orderData, setOrderData] = useState([])
  const [toggleDelet, setToggleDelet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, SetShowmodal] = useState(false);
  const [showVModal, SetShowVmodal] = useState(false);
  const [file, setFile] = useState({});
  const fileInputRef = useRef(null);
  const [fileData, setFileData] = useState([]);
  const [addExcel, setAddExcel] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [selectedServiceStatus, setSelectedServiceStatus] = useState("");
  const [searchText, setSearchText] = useState('');
  const [orderId, setOrderId] = useState('');
  const [statusValue, setStatusValue] = useState('')
  const [showOrderCancellationPopup, setShowOrderCancellationPopup] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);  const [BasicTab, setBasicTab] = useState(4);
      const [description, setDescription] = useState("");
const [applicationStatus,setApplicationStatus]=useState('') 
const [verificationStatus,setVerificationStatus]=useState('') 
    const [selectedRow, setSelectedRow] = useState(null); // Row data for the selected product



  const serviceStatusOptions = [
    { _id: "Pending", status_name: "Pending" },
    { _id: "Approved", status_name: "Approved" },
    { _id: "Rejected", status_name: "Rejected" }
  ];


  const handleServiceStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setSelectedServiceStatus(selectedStatus); // Ensure this function is defined
    getOrderData(selectedStatus);
  };

  const formik = useFormik({
    initialValues: {
      cancel_reason: "",
    },
    validationSchema: Yup.object({
      cancel_reason: Yup.string().required(
        "Please Enter Reason for Order Cancellation"
      ),
    }),
    onSubmit: async (values) => {
      const token = await JSON.parse(localStorage.getItem("token"));
      let body = {
        order_status: statusValue,
        cancel_reason: formik.values.cancel_reason,
      };
      if (body.order_status === "") {
        return Swal.fire({
          icon: "error",
          title: "Provide Order Status",
        });
      }
      try {
        await axios
          .patch(`${orderURL}/update-order-status/${orderId}`, body, {
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
              //SetShowmodal(false);
              setShowOrderCancellationPopup(false);
              setOrderId("");
              setStatusValue("");
              formik.setFieldValue("cancel_reason", "");
              getOrderData();
            }
          });
      } catch (err) {
        console.error(err);
      }
    },
  });
  const getOrderData = async (filterValue = "All") => {
    try {
      let apiUrl = `${baseURL}/api/business?r=admin`;
      if (filterValue !== "All") {
        apiUrl += `&applicationStatus=${filterValue}`;
      }
  await axios.get(apiUrl).then((res) => {
            if (res && res.status === 200) {
              console.log(res?.data)
              setOrderData(res.data.businesses.reverse());
            }
        }
        )
    }
    catch (error) {
        console.error(error)
    }
}
const toggleModal = (row = null) => {
  SetShowmodal(!showModal);
  if (row) {
    setSelectedRow(row?._id);
    setApplicationStatus(row?.applicationStatus); // Set current status from the selected row
    setStatusValue(row.applicationStatus); // Default to current status in the dropdown
  }
};
const verificationtoggleModal = (row = null) => {
  SetShowVmodal(!showVModal);
  if (row) {
    setSelectedRow(row?._id);
    setVerificationStatus(row?.verificationStatus); // Set current status from the selected row
    setStatusValue(row.verificationStatus); // Default to current status in the dropdown
  }
};

  const toggleCancelOrderModal = () => {
    formik.resetForm();
    setOrderId("");
    setShowOrderCancellationPopup(!showOrderCancellationPopup);
  };

  const debouncedSearch = React.useRef(
    debounce(async (searchTerm) => {
      setSearchText(searchTerm);
    }, 300)
  ).current;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleapplicationStatus = async (e) => {
    e.preventDefault();
  
    if (statusValue === "Rejected" && !description.trim()) {
      Swal.fire({
        icon: "error",
        title: "Description is required",
        text: "Please provide a reason for rejection.",
      });
      return; // Stop submission
    }
  
    // //console.log(selectedRow, statusValue);
    const token = await JSON.parse(localStorage.getItem("token"));
    let body = {
      businessId:selectedRow,
      status: statusValue,
      adminComments: description
    };
  //console.log("control came here",body)
    //console.log(`Updating status for busuness application ID ${selectedRow} to ${statusValue}`);
    try {
      await axios
        .put(`${baseURL}/api/business/admin`, body, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          //console.log(res)
          if (res && res.status === 200) {
            Swal.fire({
              icon: "success",
              title: res?.data?.message,
            });
getOrderData();
          }
        });
    } catch (err) {
      console.error(err);
    }
    toggleModal(); // Close modal after update
  };
  const handleverificationStatus = async (e) => {
    e.preventDefault();
  
    if (statusValue === "Rejected" && !description.trim()) {
      Swal.fire({
        icon: "error",
        title: "Description is required",
        text: "Please provide a reason for rejection.",
      });
      return; // Stop submission
    }
  
    // //console.log(selectedRow, statusValue);
    const token = await JSON.parse(localStorage.getItem("token"));
    let body = {
      businessId:selectedRow,
      status: statusValue,
      adminComments: verificationStatus === "Rejected" ? description : undefined,
      type:"verification"
    };
  
    // //console.log(`Updating verification status for busuness application ID ${selectedRow} to ${statusValue}`);
    try {
      await axios
        .put(`${baseURL}/api/business/admin`, body, {
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
            window.location.reload(); // Refresh the page after successful update

          }
        });
    } catch (err) {
      console.error(err);
    }
    toggleModal(); // Close modal after update
  };
  const handleNavigate = (id) => {
    navigate(`/businesses/${id}`);
  };

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      //console.log(searchTerm)
      // Make API call to search products (adjust URL based on your backend)
      const response = await axios.get(
        `${baseURL}/api/dashboard/business/search?query=${searchTerm}`
      );
      console.log(response)
      //console.log(response.data.businesses, "respnse for search results");
      setResults(response.data.businesses);
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

  // function capitalizeFirstLetter(string) {
  //   return string?.charAt(0)?.toUpperCase() + string.slice(1);
  // }


  useEffect(() => {
    getOrderData();
  }, [BasicTab,searchTerm]);

  const handleNavigateEdit = (id) => {
    navigate(`/businesses/edit/${id}`);
  }


  const orderColumns = [
    {
      name: "PROFILE PICTURE",
      selector: (row) => `${row?._id}`,
      // width: "210px",
      cell: (row) => (
        <>
          <Media className="d-flex" style={{cursor:"pointer"}}
                        onClick={() =>handleNavigate(row?._id)}
>
            <Image
              attrImage={{
                className: "img-50 me-3",
                src: `${
                  row?.profilePic || row?.business?.businessLogo || dummyImg
                }`,
                alt: "Generic placeholder image",
              }}
            />
          
          </Media>
        </>
      ),
      center: true,
    },   
    {
      name: "BUSINESS NAME",
      selector: (row) => `${row.business.businessName || "N/A"}`,
      sortable: true,
      center: true,
      width:"200px",
      cell: (row) => (
        <div style={{cursor:"pointer"}} onClick={() =>handleNavigate(row?._id)}
>
          {row.businessName ? row?.businessName : "N/A"}
        </div>
      ),
    },
    {
      name: "FULL NAME",
      selector: (row) => `${row?.fullName || "N/A"}`,
      sortable: true,
      center: true,
      width:"200px",
      cell: (row) => (
        <div style={{cursor:"pointer"}} onClick={() =>handleNavigate(row?._id)}
>
          {row.fullName || "N/A"}
        </div>
      ),
    },
    {
      name: "BUSINESS TYPE",
      selector: (row) => `${row.role || "N/A"}`,
      sortable: true,
      center: true,
      width:"200px",

      cell: (row) => (
        <div>
          {row.role ? row.role : "N/A"}
        </div>
      ),
    },
    {
      name: "ADDRESS",
      selector: (row) => `${row?.city || "N/A"}`,
      width:"210px",
      cell: (row) => (
        <div>
          {row?.city || "N/A"}
        </div>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "GST NO",
      selector: (row) => `${row?.gstNo}`,
      width:'150px',
      cell: (row) => {
        const gstNo = row?.gstNo || "N/A";
        // const maskedGstName = gstName.length > 4 ? 
        //   gstName.slice(0, -4) + "*".repeat(4) : gstName;
          
        return (
          <div>
            {gstNo}
          </div>
        );
      },
      sortable: true,
      center: true,
    },
    
    {
      name: "MOBILE NUMBER",
      selector: (row) => `${row?.mobileNumber}`,
      cell: (row) => {
        const mobileNumber = row?.mobileNumber || "N/A";
        // const maskedMobileNumber = mobileNumber.length > 4 ? 
        //   mobileNumber.slice(0, -4) + "*".repeat(4) : mobileNumber;
    
        return (
          <div>
            {mobileNumber}
          </div>
        );
      },
      sortable: true,
      center: true,
    },
    {
      name: "EMAIL",
      selector: (row) => `${row?.email}`,
      width:"210px",
      cell: (row) => {
        const email = row?.email || "N/A";
 
    
        return (
          <div >
            {email}
          </div>
        );
      },
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      selector: (row) => `${row.applicationStatus}`,
      sortable: true,
      center: true,
      cell: (row) => {
        // //console.log(row.applicationStatus,'row.applicationStatus')
        const getStatusStyle = (status) => {
          switch (status) {
            case "Approved":
              return {
                backgroundColor: "green",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
              };
            case "Pending":
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
          <span style={{ fontSize: "13px", ...getStatusStyle(row?.applicationStatus) }}>
            {(row?.applicationStatus)}
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
                  onClick={() => {
                    toggleModal(row)
                                    }}
                >
                  Update Application <FaExchangeAlt />
                </DropdownItem>
                {/* <DropdownItem
                  onClick={() => {
                    verificationtoggleModal(row)
                    // handleUpdateVerification(row?._id);
                  }}
                >
                  Update Verification <FaExchangeAlt />
                </DropdownItem> */}
                <DropdownItem className="delete_item"
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
    }
    
   
    
    // {
    //     name: 'PAYMENT DETAILS',
    //     selector: row => `${row.payment_method}`,
    //     cell: (row) => (
    //         row.payment_method
    //     ),
    //     sortable: true,
    //     center: true,
    // },
    // {
    //   name: "DELIVERY ADDRESS",
    //   selector: (row) => `${row.address}`,
    //   width: "350px",
    //   cell: (row) => (
    //     <div className="ellipses_text_1">
    //       {row.address?.address ? (
    //         <>
    //           <p className="ellipses-line-1">{row.address?.address}</p>
    //         </>
    //       ) : (
    //         <>
    //         {/* {//console.log(row,"fillesrefs")} */}
    //           {/* {row.address?.addressFullName}
    //           {row.address?.houseNo}, {row.address?.roadName}, {row.address?.locality}
    //           {row.address?.city}, {row.address?.country}, {row.address?.addressPincode}
    //           {row.address?.addressPhoneNumber} */}
    //           {row?.address[0]?.addressFullName || ""}
    //           {row?.address[0]?.houseNo || ""}, {row?.address[0]?.roadName || ""},{" "}
    //           {row?.address[0]?.locality || ""}
    //           {row?.address[0]?.city || ""}, {row?.address[0]?.country || ""},{" "}
    //           {row?.address[0]?.addressPincode || ""}
    //           {row?.address[0]?.addressPhoneNumber || ""}
    //         </>
    //       )}
    //     </div>
    //   ),
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: "STORE",
    //   selector: (row) => `${row.discard_from}`,
    //   cell: (row) => row?.store?.storeName,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: "ORDER STATUS",
    //   selector: (row) => `${row.order_status}`,
    //   cell: (row) => {
    //     const customColors = {
    //       accepted: "primary",
    //       processing: "warning",
    //       "on-the-way": "info",
    //       delivered: "success",
    //       Rejected: "danger",
    //       cancelled: "danger",
    //       returned: "secondary",
    //     };

    //     const statusKey = row?.order_status?.toLowerCase();
    //     const color = customColors[statusKey] || 'primary';
    //     return (
    //       <span style={{ fontSize: '13px' }} className={`badge badge-light-${color}`}>
    //         {/* {capitalizeFirstLetter(row?.order_status)} */}
    //       </span>
    //     );
    //   },
    //   sortable: true,
    //   center: true,
    // },
    

    // {
    //   name: 'Actions',
    //   cell: (row) => (
    //     <div className='d-flex justify-content-end align-items-center' style={{ marginRight: '20px' }}>
    //       <div
    //         className='cursor-pointer'
    //       >
    //         <UncontrolledDropdown className='action_dropdown'>
    //           <DropdownToggle className='action_btn'
    //           >
    //             <MoreVertical color='#000' size={16} />
    //           </DropdownToggle>
    //           <DropdownMenu>
    //             <DropdownItem onClick={() => handleNavigate(row?._id)}>
    //               View
    //               <FaRegEye />
    //             </DropdownItem>
    //             {(row.order_status !== 'cancelled') &&
    //               <DropdownItem onClick={() => {
    //                 toggleCancelOrderModal()
    //                 setOrderId(row?._id)
    //                 setStatusValue("cancelled")
    //               }
    //               }>
    //                 Cancel Order
    //                 <i className="fa fa-refresh" aria-hidden="true"></i>
    //               </DropdownItem>}
    //             <DropdownItem onClick={() => downloadInvoice(row?._id)}>
    //               Invoice
    //               <FaDownload />
    //             </DropdownItem>
    //             {/* <DropdownItem className='delete_item' onClick={() => handleDelete(row?._id)} >
    //                                 Delete
    //                                 <FaTrashAlt />
    //                             </DropdownItem> */}
    //           </DropdownMenu>
    //         </UncontrolledDropdown>
    //       </div>
    //     </div>
    //   ),
    //   sortable: false,
    //   center: true,
    // },
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
             .delete(`${baseURL}/api/business/${id}`, {
               headers: {
                 Authorization: `${token}`,
               },
             })
             .then((res) => {
               Swal.fire({
                 icon: "success",
                 title: res?.data?.message,
               });
               getOrderData();
             });
         } 
         catch (err) {
           console.error(err);
         }
       }
   });
   };
  //console.log(results[0]?.business?.businessName,'sidjvnisjdnv')

  return (
    <Fragment>
      <Row xxl={12} className="p-3">
        <Row>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content align-items-center justify-content-between">
              <H5 attrH5={{ className: "mb-0" }}>Service Providers</H5>
              <div class="flex flex-row items-center gap-4">
              <div style={{position:"relative"}}>
                <div className="mb-0 form-group position-relative search_outer d-flex align-items-center">
                  <i className="fa fa-search"></i>
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
      {results.map((result,index) => {
        //console.log(result);
        return (
        <li
          key={index}
          style={{
            padding: "10px",
            cursor: "pointer",
            listStyle: "none",
          }}
          onClick={() => handleNavigate(result?._id)}
        >
          {result?.businessName || result?.fullName}
        </li>
      )})}
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
            </div>
            </div>
          </Col>
        </Row>
      </Row>

      <DataTable
        data={orderData}
        columns={orderColumns}
        pagination
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        progressPending={isLoading}
        // paginationServer
        progressComponent={<Loader />}
      // paginationTotalRows={totalRows}
      // onChangeRowsPerPage={handlePerRowsChange}
      // onChangePage={handlePageChange}
      />

<CommonModal
        isOpen={showModal}
        title={"Change Status"}
        className="store_modal"
        toggler={toggleModal}
        size="md"
      >
        <Container>
        <Form className="status_form" onSubmit={handleapplicationStatus}>
  <Col xxl={12} className="mb-3">
    <p className="current-status">
      The product's current Application status is:{" "}
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
                <option value="">select a status</option>

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
export default DataTableComponent;


  // useEffect(() => {
  //     getOrderData();
  // }, [currentPage, perPage, searchText]);
  // const filteredData = orderData.filter((order) => {
  //   const address = order?.address;
  //   const addressMatches =
  //     address?.addressFullName
  //       ?.toLowerCase()
  //       .includes(searchTerm?.toLowerCase()) ||
  //     address?.addressPhoneNumber?.includes(searchTerm) ||
  //     address?.addressPincode?.includes(searchTerm) ||
  //     address?.city?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     address?.country?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     address?.houseNo?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     address?.locality?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     address?.roadName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     address?.state?.toLowerCase().includes(searchTerm?.toLowerCase());

    // const variantMatches = order.products.some((product) => {
    //   return (
    //     product.variant.variantName
    //       ?.toLowerCase()
    //       .includes(searchTerm?.toLowerCase()) ||
    //     product.variant.variantCode
    //       ?.toLowerCase()
    //       .includes(searchTerm?.toLowerCase())
    //   );
    // });

    // const productMatches = order.products.some((product) => {
    //   if (product.product) {
    //     return (
    //       product.product.productName
    //         ?.toLowerCase()
    //         .includes(searchTerm?.toLowerCase()) ||
    //       product.product.description
    //         ?.toLowerCase()
    //         .includes(searchTerm?.toLowerCase()) ||
    //       product.product.brand.brandName
    //         ?.toLowerCase()
    //         .includes(searchTerm?.toLowerCase()) ||
    //       product.product.category.collection_name
    //         ?.toLowerCase()
    //         .includes(searchTerm?.toLowerCase()) ||
    //       product.product.subCategory.collection_id
    //         ?.toLowerCase()
    //         .includes(searchTerm?.toLowerCase()) ||
    //       product.product.tags.some((tag) =>
    //         tag.tag?.toLowerCase().includes(searchTerm?.toLowerCase())
    //       )
    //     );
    //   } else {
    //     return false;
    //   }
    // });

    // return addressMatches || variantMatches || productMatches;
  // });

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  // const handlePerRowsChange = async (newPerPage, page) => {
  //   setPerPage(newPerPage);
  // };

    // const getOrderData = async () => {
  //   setIsLoading(true);

  //   let startDate, endDate;
  //   const tab=BasicTab;
  
  //     switch (tab) {
  //       case 1: // Today
  //         startDate = moment().startOf('day');
  //         endDate = moment().endOf('day');
  //         break;
  //       case 2: // Weekly
  //         startDate = moment().startOf('week');
  //         endDate = moment().endOf('week');
  //         break;
  //       case 3: // Monthly
  //         startDate = moment().startOf('month');
  //         endDate = moment().endOf('month');
  //         break;
  //       case 4: // Be default ALL, no date condition.
  //       startDate = null;
  //       endDate = null;
  //         break;
  //       default:
  //         startDate = null;
  //         endDate = null;
  //         break;
  //     }

  //   try {
  //     const token = await JSON.parse(localStorage.getItem("token"));
  //     const userData = await JSON.parse(localStorage.getItem("UserData"));
  //     let url =
  //       userRole !== "admin"
  //         ? `${baseURL}/api/dashboard/get-orders-with-status?storeId=${userData?._id}&search_string=${searchTerm}`
  //         : `${baseURL}/api/dashboard/get-orders-with-status?search_string=${searchTerm}`;
  //       let params= {};
  //         if(startDate !==null && endDate !==null) {
  //             params={  
  //               start_date: moment(startDate).format("YYYY-MM-DD"),
  //               end_date: moment(endDate).format("YYYY-MM-DD")
  //             }           
  //       }

  //     await axios
  //       .get(url, {
  //         params: params,
  //         headers: {
  //           Authorization: `${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         if (res?.data?.success && res) {
  //           setOrderData(res?.data?.data);
  //           setIsLoading(false);
  //         }
  //       });
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.error(error);
  //   }
  // };

    // const addmodalExcel = () => setAddExcel(!addExcel);
    // const token = await JSON.parse(localStorage.getItem("token"));
        // await axios.get(`${baseURL}/api/dashboard/get-orders-with-status-count`, {
 // , {

            // headers: {
            //     Authorization: `${token}`,
            // }
        // }
         // const handleDelete = async (id) => {
  //     const token = await JSON.parse(localStorage.getItem("token"));
  //     if (window.confirm(`Are you sure you want to delete this Order?`)) {
  //         try {
  //             const res = await axios.delete(`${baseURL}/api/order/delete/${id}`, {
  //                 headers: {
  //                     Authorization: `${token}`
  //                 }
  //             });
  //             if (res?.status === 200 && res) {
  //                 Swal.fire({
  //                     icon: 'success',
  //                     title: res?.data?.message
  //                 })
  //                 getOrderData();
  //             }
  //         }
  //         catch (error) {
  //             console.error(error);
  //         }
  //     }
  // };

  // const handleFileUpload = (e) => {
  //   const reader = new FileReader();
  //   reader.readAsBinaryString(e.target.files[0]);
  //   // reader.onload = (e) => {
  //   //     const data = e.target.result;
  //   //     const workbook = XLSX.read(data, { type: "binary" });
  //   //     const sheetName = workbook.SheetNames[0];
  //   //     const sheet = workbook.Sheets[sheetName];
  //   //     const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  //   //     setFileData(parsedData);
  //   //     addmodalExcel(); // Open the modal after reading the file
  //   // };
  // };

  // const handleClickImport = () => {
  //   // Trigger the file input click
  //   fileInputRef.current.click();
  // };

  /* const handleChange = (e) => {
       const files = e.target.files;
       if (files && files[0]) setFile(files[0]);
   };*/

  // const handleChange = (name, value) => {
  //   formik.setFieldValue(name, value);
  // }

  //-------------------------------------------------
//   <CommonModal isOpen={showOrderCancellationPopup} title={"Cancel Order"} className="store_modal" toggler={toggleCancelOrderModal} size="md">
//   <Container>
//     <form className="p-2 md:p-4" onSubmit={formik.handleSubmit}>
//       <div className="flex flex-col gap-4">

//         <label
//           style={{
//             fontFamily: 'Lato',
//             fontSize: '18px',
//             fontWeight: '400',
//             textAlign: 'left',
//           }}
//         >
//           Please enter the reason for cancellation
//         </label>
//         <input
//           type="text"
//           id="reason"
//           name='cancel_reason'
//           placeholder="Enter reason for cancellation"
//           className={`w-[100%] focus:outline-none border-b-2 p-2`}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.cancel_reason}
//         />
//         {formik.touched.cancel_reason && formik.errors.cancel_reason ? (
//           <span className="text-red-500 text-sm mt-2">{formik.errors.cancel_reason}</span>

//         ) : (
//           ""
//         )}
//       </div>
//       <div className="flex justify-center gap-4">
//         <button
//           className="bg-[#D3178A] mt-4 w-32 h-12 rounded-full text-white"
//           type="submit"
//         >
//           Cancel Order
//         </button>

//       </div>
//     </form>
//   </Container>
// </CommonModal>

// <CommonModal
//   isOpen={showModal}
//   title={"Change Status"}
//   className="store_modal"
//   toggler={toggleModal}
//   size="md"
// >
//   <Container>
//     <Form className="status_form" onSubmit={handleStatus}>
//       <>
//         <Col xxl={12}>
//           <FormGroup>
//             <Row>
//               {/* <Col>
//                                       <Label>
//                                           <Input type='radio' name='status' className='me-2' id='1' />
//                                           Pending
//                                       </Label>
//                                   </Col> */}
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     id="1"
//                     value={"accepted"}
//                     checked={statusValue === "accepted"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   Accepted
//                 </Label>
//               </Col>
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     id="1"
//                     value={"Rejected"}
//                     checked={statusValue === "Rejected"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   Rejected
//                 </Label>
//               </Col>
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     id="1"
//                     value="on-the-way"
//                     checked={statusValue === "on-the-way"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   On the way
//                 </Label>
//               </Col>
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     value="delivered"
//                     id="1"
//                     checked={statusValue === "delivered"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   Delivered
//                 </Label>
//               </Col>
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     value="cancelled"
//                     id="1"
//                     checked={statusValue === "cancelled"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   Cancelled
//                 </Label>
//               </Col>
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     value="returned"
//                     id="1"
//                     checked={statusValue === "returned"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   Returned
//                 </Label>
//               </Col>
//             </Row>
//           </FormGroup>
//         </Col>
//       </>
//       <Row>
//         <Col xxl={12} className="text-right mt-3">
//           <Button
//             type="button"
//             className="cancel_Btn"
//             onClick={() => SetShowmodal(false)}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             className="cursor-pointer bg-[#ff0000] font-medium w-40 ms-2 px-2 py-2 rounded-2xl text-white flex justify-center items-center"
//           >
//             Change Status
//           </Button>
//         </Col>
//       </Row>
//     </Form>
//   </Container>
// </CommonModal> 

 // {!isLoading && filteredData.length === 0 &&
                // <>
                //     <p className='my-5 text-center'>No Data Found</p>
                // </>
            //} 