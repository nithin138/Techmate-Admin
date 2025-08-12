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
  const [showCatModal, setShowCatModal] = useState(false);
  const [segmentData, setSegmentData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [selectedSegment, setSelectedSegment] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
  const [showeCatModal, setShoweCatModal] = useState(false);
  const [CatFormData, setCatFormData] = useState({
    segmentId: "",
    categoryId:"",
    categoryName: "",
    type:"",

  });


  const toggleModal = () => {
    setShowCatModal(!showeCatModal);
  };

  const fetchItems = async (selectedSegment,selectedCategory) => {
    setIsLoading(true);
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const params = {}
      if(selectedSegment && selectedSegment !== "") {params.segmentId = selectedSegment};
      if(selectedCategory && selectedCategory !=="") {params.categoryId = selectedCategory};

      const response = await axios.get(
        `${baseURL}/api/subcategories`
        , {
          params: params,
          headers: {
            Authorization: `${token}`,
          }
        }
      );
      //console.log(response)
      // Check if products and products.data exist
      const productsData = response?.data || []; // Default to an empty array if undefined
      console.log(productsData)
      // if (productsData.length > 0) {
      setIsLoading(false);
      setProductsData(productsData);
      // }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const getData = async () => {
    try {
      await axios
        .get(`${baseURL}/api/segments`)
        .then((response) => {
          if (response.status === 200) {
            let updatedData = response.data.categories;
            setSegmentData(updatedData);
          }
        })
    }
    catch (error) {
      console.error(error);
    }
  };
  const getCData = async () => {
    try {
      const params = {};
      if (CatFormData.type){
        params.type = CatFormData.type
      }
      await axios
        .get(`${baseURL}/api/categories/${CatFormData?.segmentId}`,{params})
        .then((response) => {
          if (response.status === 200) {
            let updatedData = response.data;
            setCategoryData(updatedData);
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
    getCData();
  }, [CatFormData?.segmentId,CatFormData?.type]);

  useEffect(() => {
    fetchItems();
  }, [selectedCollectionId, subCollectionValue]);

  const fetchSearchResults = async () => {
    // setLoading(true);
    try {
      // Make API call to search products (adjust URL based on your backend)
      const response = await axios.get(
        `${baseURL}/api/dashboard/subcategory/search?query=${searchTerm}`
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
          const res = await axios.delete(`${baseURL}/api/subcategories/${id}`, {
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

  const orderColumns = [
    {
      name: "ID",
      selector: (row) => `ID-${row?._id}`, 
      center: true,
      width:"235px",
      cell: (row) => `ID-${row?._id}`,
    },
    {
      name: "Category Name",
      selector: (row) => row?.categoryName || "N/A", // subCategoryName field
      sortable: true,
      width:"350px",
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
      width:"150px"
    },
    {
      name: "Category",
      selector: (row) => row?.categoryId?.categoryName, // Masked ID with last 6 characters
      center: true,
      sortable: true,
      cell: (row) => row?.categoryId?.categoryName,
      width:"200px"
    },
   {
      name: "Type",
      selector: (row) => row?.categoryId?.type, // Masked ID with last 6 characters
      center: true,
      sortable: true,
      cell: (row) => row?.categoryId?.type,
      width:"200px"
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
                      type:row?.type}
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
        `${baseURL}/api/subcategories/`,
        CatFormData,
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
            type:""}); // Reset form
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
        `${baseURL}/api/subcategories/${selectedRow}`,
        CatFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
            type:""}); // Reset form
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
  setSelectedSegment(selectedStatus); // update state
  fetchItems(selectedStatus, selectedCategory); // pass current + existing type
};

const handleCategoryChange = (e) => {
  const selectedType = e.target.value;
  setSelectedCategory(selectedType); // update state
  fetchItems(selectedSegment, selectedType); // pass existing + current type
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
                    All Sub-Categories
                  </NavLink>

                </NavItem>

             
              </Nav>

            </div>
          </Col>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content file-content1 justify-content-between">
              <div style={{ display: "flex", gap: "24px" }}>
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
                            value={selectedSegment} // Ensure state is managed
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
                                                      value={selectedCategory} // Ensure state is managed
                                                      onChange={handleCategoryChange}
                                                    >
                                                      <option value="">All Caegories</option>
                                                      {Array.isArray(categoryData) &&
                                                        categoryData.length > 0 &&
                                                        categoryData.map((status) => (
                                                          <option key={status._id} value={status._id}>
                                                            {status.categoryName}
                                                          </option>
                                                        ))}
                                                    </Input>
                {userRole === "SuperAdmin" && (
                  <Button
                    className="btn btn-primary d-flex align-items-center ms-3"
                    onClick={() => setShowCatModal(true)}
                  >
                    <PlusCircle />
                    Add sub-category
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
        title={`${selectedRow ? "Update " : "Create New" } Sub-Category`}
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
          >
         
            <Col xxl={12} className="mb-3">
            <Label for="catType" className="form-label">
                  Segment:
                </Label>
              <Input
                type="select"
                name="catType"
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
            <Label for="serviceType" className="form-label">
                  Categories:
                </Label>
              <Input
                type="select"
                name="serviceType"
                onChange={(e) =>
                  setCatFormData({
                    ...CatFormData,
                    categoryId: e.target.value,
                  })}
                value={CatFormData.categoryId}
              >
                <option value="">Select Category</option>
                {categoryData?.length > 0 && categoryData?.map((segment) => (
                  <option key={segment?._id} value={segment?._id}>
                    {segment?.categoryName}
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
            {/* <Col xxl={12} className="mb-3">
              <Input
                type="select"
                name="serviceType"
                onChange={(e) =>
                  setCatFormData({
                    ...CatFormData,
                    scope: e.target.value,
                  })}
                value={CatFormData.scope}
              >
                <option value="">Select Scope</option>
                {[{type:"Industrial"},{type:"Domestic"}]?.map((segment,index) => (
                  <option key={index} value={segment?.type}>
                    {segment?.type}
                  </option>
                ))}
              </Input></Col>
              <Col xxl={12} className="mb-3">
              <Input
                type="select"
                name="serviceType"
                onChange={(e) =>
                  setCatFormData({
                    ...CatFormData,
                    type: e.target.value,
                  })}
                value={CatFormData.type}
              >
                <option value="">Select Scope</option>
                {[{type:"Service"},{type:"Product"}]?.map((segment,index) => (
                  <option key={index} value={segment?.type}>
                    {segment?.type}
                  </option>
                ))}
              </Input></Col> */}
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
