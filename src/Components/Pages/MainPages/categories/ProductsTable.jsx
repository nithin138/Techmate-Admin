import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import DataTable from "react-data-table-component";
import CommonModal from "../../../UiKits/Modals/common/modal";
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
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
  const [selectedRow, setSelectedRow] = useState('');
  const [collectionData, setCollectionData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [BasicTab, setBasicTab] = useState(1);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [subCollectionValue, setSubCollectionValue] = useState("");
  const [segmentData, setSegmentData] = useState([])
  // const [showeCatModal, setShoweCatModal] = useState(false);
    const [showCatModal, setShowCatModal] = useState(false);
  const [selectedServiceSegment, setSelectedServiceSegment] = useState("");
    const [selectedServiceType, setSelectedServiceType] = useState("");


  const [CatFormData, setCatFormData] = useState({
    categoryName: "",
    segmentId: "",
  });
      const categoryTypes = [
        { _id: "Product", name: "Product" },
        { _id: "Service", name: "Service" },
      ];


  const toggleModal = () => {
    setShowCatModal(!showCatModal);
  };

 
  const getData = async () => {
    try {
      await axios
        .get(`${baseURL}/api/segments`)
        .then((response) => {
          //console.log(response, "response from product header");
          if (response.status === 200) {
            let updatedData = response.data.categories;
            //console.log(updatedData);
            setSegmentData(updatedData);
          }
        })
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [selectedCollectionId, subCollectionValue]);

  const fetchSearchResults = async () => {
    // setLoading(true);
    try {
      // Make API call to search products (adjust URL based on your backend)
      const response = await axios.get(
        `${baseURL}/api/dashboard/category/search?query=${searchTerm}`
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
          const res = await axios.delete(`${baseURL}/api/categories/${id}`, {
            headers: { Authorization: `${token}` },
          });

          Swal.fire({
            icon: "success",
            title: res?.data?.message || "Deleted successfully!",
          });

          fetchItems(); // Refresh items after deletion
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
console.log(selectedServiceSegment)
  const orderColumns = [
    {
      name: "ID",
      selector: (row) => `ID-${row?._id}`, 
      center: true,
      cell: (row) => `ID-${row?._id}`,
    },
    {
      name: "Category Name",
      selector: (row) => row?.categoryName || "N/A", // subCategoryName field
      sortable: true,
      width:"320px",
      center: true,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {row?.image ? (
            <img src={row.image} alt={row.categoryName} width="40" height="40" style={{ borderRadius: "5px" }} />
          ) : (
            <span>No Image</span>
          )}
          <span>{row?.categoryName || "N/A"}</span>
        </div>
      ),
    },
    {
      name: "Segment",
      selector: (row) => row?.segmentId?.name, // Masked ID with last 6 characters
      center: true,
      sortable: true,
      cell: (row) => row?.segmentId?.name,
    },
    {
      name: "Type",
      selector: (row) => row?.type, // Masked ID with last 6 characters
      center: true,
      sortable: true,
      cell: (row) => row?.type,
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
                    setCatFormData(
                    {  categoryName: row?.categoryName,
                      segmentId: row?.segmentId,
                   }
                    )
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
    try {
      const response = await axios.post(
        `${baseURL}/api/categories/${CatFormData?.segmentId}`,
        CatFormData,  
        {  headers: {
            'Content-Type': 'multipart/form-data',
          }}
      );
      //console.log(response);

      if (response.status === 201 || response.statusText === "Created") {
        Swal.fire({
          title: "Success!",
          text: `Category created successfully.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setShowCatModal(false); // Close modal
          setCatFormData({   categoryName: "",
            segmentId: "",
           }); // Reset form
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
  const handleEditCategory = async () => {
    //console.log(CatFormData, "from edit function");
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.patch(
        `${baseURL}/api/categories/${selectedRow}`,
        CatFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
          setShowCatModal(false); // Close modal
          setCatFormData({   categoryName: "",
            segmentId: "",
         }); // Reset form
          fetchItems();
          setSelectedRow('')
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
const handleCategorySegmentChange = (e) => {
  const selectedStatus = e.target.value;
  setSelectedServiceSegment(selectedStatus); // update state
  fetchItems(selectedStatus, selectedServiceType); // pass current + existing type
};

const handleCategoryTypeChange = (e) => {
  const selectedType = e.target.value;
  setSelectedServiceType(selectedType); // update state
  fetchItems(selectedServiceSegment, selectedType); // pass existing + current type
};
const fetchItems = async (segmentId,type) => {
  setIsLoading(true);
  const token = await JSON.parse(localStorage.getItem("token"));
  try {
    const params = {};
    if (segmentId && segmentId !== "") params.segmentId = segmentId;
    if (type && type !== "") params.type = type;
    

    const products = await axios.get(`${baseURL}/api/categories`, {
      params,
      headers: {
        Authorization: `${token}`,
      },
    });

    const productsData = products?.data || [];
    setIsLoading(false);
    setProductsData(productsData);
  } catch (error) {
    setIsLoading(false);
    console.error("Error fetching items:", error);
  }
};


  return (
    <Fragment>
      <Row xxl={12} className="pb-2">
        <Row>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Nav tabs className="product_variant_tabs mb-3">
                <NavItem>
                  <NavLink
                    className={BasicTab === 1 ? "active" : ""}
                    onClick={() => handleAll()}
                  >
                    All Categories
                  </NavLink>

                </NavItem>

         
              </Nav>

            </div>
          </Col>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content file-content1 justify-content-between">
              <div style={{ display: "flex", gap: "24px", width: "750px" }}>
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
              <div className="d-flex">
  <Input
                            type="select"
                            name="serviceStatus"
                            value={selectedServiceSegment} // Ensure state is managed
                            onChange={handleCategorySegmentChange}
                          >
                            <option value="">All Segments</option>
                            {Array.isArray(segmentData) &&
                              segmentData.length > 0 &&
                              segmentData.map((status) => (
                                <option key={status._id} value={status._id}>
                                  {status.name}
                                </option>
                              ))}
                          </Input>
                           <Input
                           style={{marginLeft:"12px"}}
                            type="select"
                            name="serviceStatus"
                            value={selectedServiceType} // Ensure state is managed
                            onChange={handleCategoryTypeChange}
                          >
                            <option value="">All Types</option>
                            {Array.isArray(categoryTypes) &&
                              categoryTypes.length > 0 &&
                              categoryTypes.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                  {cat.name}
                                </option>
                              ))}
                          </Input>
                {userRole === "SuperAdmin" && (
                  <Button
                    className="btn btn-primary d-flex align-items-center ms-3"
                    onClick={() => setShowCatModal(true)}
                  >
                    <PlusCircle />
                    Add Category
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
        title={`${selectedRow ? "Update " : "Create New" } Category`}
        toggler={() => setShowCatModal(false)}
        size="md"
      >
        <Container>
          <Form
            className="subcategory-form"
            onSubmit={(e) => {
              e.preventDefault();
              selectedRow ? handleEditCategory() :handleCreateCategory();
            }}
          > <Col xxl={12} className="mb-3">
                 <Label for="serviceType" className="form-label">
                  Segment:
                </Label>
          <Input
            type="select"
            name="serviceType"
            onChange={(e) =>
              setCatFormData({
                ...CatFormData,
                segmentId: e.target.value,
              })}
            value={CatFormData.segmentId}
          >
            <option value="">Select Segment</option>
            {segmentData?.map((segment) => (
              <option key={segment?._id} value={segment?._id}>
                {segment?.name}
              </option>
            ))}
          </Input></Col>
            <Col xxl={12} className="mb-3">
              <FormGroup>
                <Label for="categoryName" className="form-label">
                  Category Name:
                </Label>
                <Input
                  type="text"
                  id="categoryName"
                  value={CatFormData.categoryName}
                  onChange={(e) =>
                    setCatFormData({
                      ...CatFormData,
                      categoryName: e.target.value,
                    })
                  }
                  className="form-control"
                  placeholder="Enter Category name"
                  required
                />
              </FormGroup>
            </Col>
            <Col xxl={12} className="mb-3">
                 <Label for="type" className="form-label">
                  Type:
                </Label>
          <Input
            type="select"
            name="type"
            onChange={(e) =>
              setCatFormData({
                ...CatFormData,
                type: e.target.value,
              })}
            value={CatFormData.type}
          >
            <option value="">Select Type</option>
            {[{name:"Service",value:"Service"},{name:"Product",value:"Product"}]?.map((segment) => (
              <option key={segment?.value} value={segment?.value}>
                {segment?.name}
              </option>
            ))}
          </Input></Col>
           
            <Col xxl={12} className="mb-3">
              <FormGroup>
                <Label for="image" className="form-label">
                  Upload Image:
                </Label>
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) =>
                    setCatFormData({
                      ...CatFormData,
                      image: e.target.files[0], // Store selected file
                    })
                  }
                  className="form-control"
                />
              </FormGroup>
            </Col>
        
            <Col xxl={12} className="d-flex justify-content-end">
              <Button
                type="button"
                className="cancel-btn btn btn-secondary me-2"
                onClick={() => setShowCatModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="submit-btn btn btn-primary">
                {selectedRow? 'Update':'Create'}
              </Button>
            </Col>
          </Form>
        </Container>
      </CommonModal>

    </Fragment>
  );
};
export default ItemsTable;
