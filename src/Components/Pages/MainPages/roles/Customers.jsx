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
  const [loading, setLoading] = useState(false);
    const [showCatModal, setShowCatModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
    const [roles,setRoles] = useState([])


const [catFormData, setCatFormData] = useState({
  name: "",
features:[]
});

    const [results, setResults] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentSelection, setCurrentSelection] = useState("");

const handleFeatureSelect = (e) => {
    const selected = e.target.value;
    if (selected && !catFormData.features.includes(selected)) {
      setCatFormData((prev) => ({
        ...prev,
        features: [...prev.features, selected],
      }));
    }
  };

  const handleRemoveOption = (option) => {
    setCatFormData((prev) => ({
      ...prev,
      features: prev.features.filter((item) => item !== option),
    }));
  };

  const optionsList = ["dashboard","users","Service Providers","Products and Services","Enquiries","Reviews","Posts","Blogs","Subscriptions","Referrals and Rewards","Roles and Employees","Support Tickets","Cms"]


  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);
  const fetchItems = async (filterValue = "All") => {
    setIsLoading(true);
    try {
      let apiUrl = `${baseURL}/api/roles`;

      if (filterValue !== "All") {
        apiUrl += `?status=${filterValue}`;
      }

      const products = await axios.get(apiUrl);
      console.log('ntg')
      console.log(products)
      // Check if products and products.data exist
      const referalData = products?.data || []; // Default to an empty array if undefined
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
            .delete(`${baseURL}/api/roles/${id}`, {
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
  const toggleModal = () => {
    setShowCatModal(!showCatModal);
  };
  const orderColumns = [
    {
      name: "S.No",
      selector: (row, index) => row?._id,
      center: true,
      width: "250px",
      cell: (row, index) => `ID : ${row?._id}`,
    },
    {
      name: "S.No",
      selector: (row, index) => row?.name,
      center: true,
      width: "250px",
      cell: (row, index) => row?.name,
    },

    {
      name: "Features",
      selector: (row) => row?.features,
      center: true,
      cell: (row) =>
        row?.features?.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {row?.features?.map((feature, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#e0e0e0',
                  color: '#000',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        ) : (
          'None'
        ),
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
                    {  name: row?.name,
                      features: row?.features,
                   }
                    )
                    toggleModal()
                  }}
                >
                  Update
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

  const handleAddRole = async() => {
    console.log(catFormData)
    // return;
    try{
        const response = await axios.post(`${baseURL}/api/roles`,catFormData)
        console.log(response)
        if(response?.status === 201){
          Swal.fire({
            icon:"success",
            title:"Role added Successfully",
            timer:2500
          })
          setShowCatModal(!showCatModal)
          fetchItems()
        }
    }
    catch(error){
      console.log(error)
      Swal.fire({
        icon:"error",
        title:"Role Creation Failed",
        
      })
    }
  }
    const handleEditRole = async() => {
      console.log(selectedRow)
    console.log(catFormData)
    // return;
    try{
        const response = await axios.put(`${baseURL}/api/roles/${selectedRow}`,catFormData)
        console.log(response)
        if(response?.status === 200){
          Swal.fire({
            icon:"success",
            title:"Role Updated Successfully",
            timer:2500
          })
          setShowCatModal(!showCatModal)
          fetchItems()
          setCatFormData({})
        }
    }
    catch(error){
      console.log(error)
      Swal.fire({
        icon:"error",
        title:"Role Creation Failed",
        
      })
    }
  }
  return (
    <Fragment>
      <Row xxl={12} className="pb-2">
        <Row>

          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content file-content1 justify-content-between">
              <H5 attrH5={{ className: "mb-0" }}>Roles</H5>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

                <div style={{ position: "relative" }}>


                </div>


                <Button
                  className="btn btn-primary d-flex align-items-center ms-3"
                 onClick={() => setShowCatModal(true)}
                >
                  <PlusCircle />
                  Add Role
                </Button>
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


      <CommonModal
        isOpen={showCatModal}
        title={`${selectedRow ? "Update " : "Create New" } Role`}
        toggler={() => setShowCatModal(false)}
        size="md"
      >
        <Container>
       <Form
  className="category-form"
  onSubmit={(e) => {
    e.preventDefault();
    selectedRow ? handleEditRole() : handleAddRole();
    // Call your create/update API here with catFormData
  }}
>
 <Col xxl={12} className="mb-3">
        <FormGroup>
          <Label for="categoryName" className="form-label">Name:</Label>
          <Input
            type="text"
            id="categoryName"
            value={catFormData.name}
            onChange={(e) =>
              setCatFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="form-control"
            placeholder="Enter name"
            required
          />
        </FormGroup>
      </Col>

      {/* Feature Select */}
      <Col xxl={12} className="mb-3">
        <FormGroup>
          <Label for="featureSelect" className="form-label">Select Feature:</Label>
          <Input
            type="select"
            id="featureSelect"
            value=""
            onChange={handleFeatureSelect}
            className="form-control"
          >
            <option value="">Select a feature</option>
            {optionsList?.map((opt, index) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Col>

      {/* Selected Badges */}
      <Col xxl={12} className="mb-3">
        <div className="d-flex flex-wrap gap-2">
          {catFormData?.features?.map((opt) => (
            <span
              key={opt}
              className="badge bg-light border text-dark px-3 py-2 rounded-pill d-flex align-items-center"
            >
              {opt}
              <span
                className="ms-2 text-danger fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => handleRemoveOption(opt)}
              >
                ×
              </span>
            </span>
          ))}
        </div>
      </Col>



  <Col xxl={12} className="d-flex justify-content-end">
    <Button type="button" className="btn btn-secondary me-2" onClick={() => setShowCatModal(false)}>Cancel</Button>
    <Button type="submit" className="btn btn-primary">{selectedRow ? 'Update' : 'Create'}</Button>
  </Col>
</Form>

        </Container>
      </CommonModal>

    </Fragment>
  );
};
export default ItemsTable;
