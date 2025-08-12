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
  const [selectedRow, setSelectedRow] = useState([]);
  // const [editData, seteditdata] = useState([]);
  // const [subCollectionData, setSubCollectionData] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  // const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [BasicTab, setBasicTab] = useState(1);
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [subCollectionValue, setSubCollectionValue] = useState("");
  // const toggle = () => setDropdownOpen((prevState) => !prevState);
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [showModal, SetShowmodal] = useState(false);
  // const [showcatModal, SetShowcatmodal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showeCatModal, setShoweCatModal] = useState(false);

  // const [results, setResults] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [categoryDescription, setCategoryDescription] = useState("");
  // const [productStatus, setProductStatus] = useState(""); // Current product status
  // const [statusValue, setStatusValue] = useState("");
  // const [description, setDescription] = useState("");
  // const [selectedRow, setSelectedRow] = useState(null); // Row data for the selected product
  const [CatFormData, setCatFormData] = useState({
    name: "",
  });
  // const handleRowSelected = useCallback((state) => {
  //   setSelectedRows(state.selectedRows);
  // }, []);
  const toggleModal = () => {
    setShoweCatModal(!showeCatModal);
  };

  const fetchItems = async () => {
    setIsLoading(true);
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const products = await axios.get(`${baseURL}/api/segments`, {
        // params: params,
        headers: {
          Authorization: `${token}`,
        },
      });
      //console.log(products, "products in segments");

      // Check if products and products.data exist
      const productsData = products?.data?.categories || []; // Default to an empty array if undefined
      // //console.log(productsData, "osvnisjd");

   

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
        `${baseURL}/api/dashboard/segment/search?query=${searchTerm}`
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
          const res = await axios.delete(`${baseURL}/api/segments/${id}`, {
            headers: { Authorization: `${token}` },
          });
  
          Swal.fire({
            icon: "success",
            title: res?.data?.message || "Deleted successfully!",
          });
  
          fetchItems(); // Refresh items after deletion
        } catch (err) {
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
      name: "Item ID",
      selector: (row) => `ID-${row?._id}`, // Masked item ID
      center: true,
      cell: (row) => `ID-${row?._id}`, // Display last 6 characters with prefix "ID"
    },
    {
      name: "Segment Name",
      selector: (row) => row?.name || "N/A", // subCategoryName field
      center: true,
      sortable: true,
      cell: (row) =>row?.name || "N/A"
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
                      name:row?.name
                    })
                    setShowCatModal(!showCatModal)
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
    try {
      const response = await axios.post(
        `${baseURL}/api/segments`,
        CatFormData,
      );
      //console.log(response);

      if (response.status === 201 || response.statusText === "Created") {
        Swal.fire({
          title: "Success!",
          text: `Segment created successfully.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setShowCatModal(false); // Close modal
          setCatFormData({ name: ""}); // Reset form
fetchItems();
        });
      } else {
        throw new Error("Failed to create Segment");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    }
  };
  const handleEditCategory = async () => {
    //console.log(CatFormData, "from edit function");
    try {
      const response = await axios.patch(
        `${baseURL}/api/segments/${selectedRow}`,
        CatFormData,
      );
      //console.log(response);

      if (response.status === 200 || response.statusText === "Created") {
        Swal.fire({
          title: "Success!",
          text: `Category Updated successfully.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setShowCatModal(false); // Close modal
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
  return (
    <Fragment>
      <Row xxl={12} className="pb-2">
        <Row>
          <Col md={12} lg={12} xl={12} xxl={12}>
            {/* <div style={{display:'flex',justifyContent:'space-between'}}> */}
            <Nav tabs className="product_variant_tabs mb-3">
              <NavItem>
                <NavLink
                  className={BasicTab === 1 ? "active" : ""}
                  onClick={() => handleAll()}
                >
                  All Segments
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
          </Col>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content file-content1 justify-content-between">
              <div>
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
              </div>
              <div className="d-flex ">
                {/* <Input
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
                </Input> */}
                {userRole === "SuperAdmin" && (
                  <Button
                    className="btn btn-primary d-flex align-items-center ms-3"
                    onClick={() => {
                      setShowCatModal(true)
                      setSelectedRow('')
                      setCatFormData({
                        name:""
                      })
                    }}
                  >
                    <PlusCircle />
                    Add Segment
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
        // onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        progressPending={isLoading}
        progressComponent={<Loader />}
      />

<CommonModal
  isOpen={showCatModal}
  title={`${selectedRow ? "Update " : "Create New" } Segment`}
  toggler={() => setShowCatModal(false)}
  size="md"
>
  <Container>
    <Form
      className="subcategory-form"
      onSubmit={(e) => {
        e.preventDefault();
        {selectedRow ? handleEditCategory() : handleCreateCategory()}
      }}
    >
      {/* Category Name */}
      <Col xxl={12} className="mb-3">
        <FormGroup>
          <Label for="name" className="form-label">
           Segment Name:
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
            placeholder="Enter segment name"
            required
          />
        </FormGroup>
      </Col>
      {/* Buttons */}
      <Col xxl={12} className="d-flex justify-content-end">
        <Button
          type="button"
          className="cancel-btn btn btn-secondary me-2"
          onClick={() => setShowCatModal(false)}
        >
          Cancel
        </Button>
        <Button type="submit" className="submit-btn btn btn-primary">
          {selectedRow ?"Update":"Create"}
        </Button>
      </Col>
    </Form>
  </Container>
</CommonModal>


      
    </Fragment>
  );
};
export default ItemsTable;
