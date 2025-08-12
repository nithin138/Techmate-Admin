import React, { Fragment, useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import {
  Button,
  CardBody,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Media,
  Nav,
  NavItem,
  NavLink,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { MoreVertical, PlusCircle } from "react-feather";
import CommonModal from "../../../UiKits/Modals/common/modal";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { baseURL, imageURL } from "../../../../Services/api/baseURL";
import dummyImg from "../../../../assets/images/product/2.png";
import { Image } from "../../../../AbstractElements";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { debounce } from "lodash";
import Loader from "../../../Loader/Loader";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
//import GIF from 'gif.js';
//import { parseGIF, decompressFrames } from 'gifuct-js';
//import gifshot from 'gifshot';

export const spinnerData = [
  {
    id: 33,
    heading: "Loader 31",
    spinnerClass: "loader-35",
  },
];

function ContentManagementTable() {
  const [editData, setEditData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [AddModal, SetAddmodal] = useState(false);
  const [data, setData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [token, setToken] = useState(null);
  const [image, setImage] = useState("");
  const [id, setId] = useState("");
  const [BasicTab, setBasicTab] = useState("storePartner");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const inputRef = useRef();
  const [images, setImages] = useState([]);
  const imgRefs = useRef([]);
  const [cropList, setCropList] = useState([]);

  const banner_types = {
    subscribe_banner: "Subscribe Banner",
    festival_banner: "Festival Banner",
    landing_page_banner: "Landing Page Banner",
    category_search_banner: "Category Search Page Banner",
    none: "",
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      setToken(token);
      return;
    }
    setToken(null);
  }, []);

  const toggleModal = () => {
    formik.resetForm();
    setId("");
    SetAddmodal(!AddModal);
    setFiles([]);
    setSrc("");
    setImage("");
    setCrop();
    setLoading(false);
    setSelectedImage("");
    setImages([]);
  };

  
  
  const fetchBanners = async (searchTerm) => {
    try {
      if (!searchTerm.trim()) {
        setData([]); // Clear results if search term is empty
        return;
      }
  
      const response = await axios.get(`${baseURL}/api/dashboard/banners/search?title=${searchTerm}`, {
      });
      //console.log(response)
      setData(response.data.banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setData([]);
    }
  };
  
  const debouncedSearch = useRef(
    debounce(async (searchTerm) => {
      setSearchTerm(searchTerm);
      fetchBanners(searchTerm);
    }, 300)
  ).current;
  

  function capitalize(word) {
    const lower = word?.toLowerCase();
    return word?.charAt(0).toUpperCase() + lower?.slice(1);
  }

  const getEditData = async (data) => {
    if (data) {
      data.device_type && formik.setFieldValue("device_type", data.device_type);
      data.banner_type && formik.setFieldValue("banner_type", data.banner_type);
      data.theme_type && formik.setFieldValue("theme_type", data.theme_type);

      if (data?.image) {
        const imgSrc = imageURL + data?.image;
        setFiles(data?.image);
        setSelectedImage(imgSrc);
      }
      if (data?.images && data.images.length > 0) {
        const imgList = [];
        data.images.forEach((img) => {
          imgList.push(imageURL + img);
        });
        setFiles(imgList);
        setSelectedImages(imgList);
      }
    }
  };

  const getData = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      setIsLoading(true);
      // let endPoint = '/api/content-management/list';
      let endPoint = "/api/banner/all";

      // ?page=${currentPage}&limit=${perPage}&search_string=${searchTerm}
      const response = await axios.get(`${baseURL}${endPoint}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      //console.log(response);
      if (response?.data.success) {
        //console.log("At line 115", response);
        setData(response?.data?.data);
        setTotalRows(response?.data.total);
        setIsLoading(false);
      }
    } catch (error) {
      //console.log(error);
      setIsLoading(true);
    }
  };

  const deleteBrand = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this content? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = await JSON.parse(localStorage.getItem("token"));
  
        try {
          const response = await axios.delete(`${baseURL}/api/banner/${id}`, {
            headers: {
              Authorization: `${token}`,
            },
          });
  
          Swal.fire({
            icon: "success",
            title: response?.data?.message || "Banner deleted successfully",
          });
  
          getData();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed to delete",
            text: error?.response?.data?.message || "An error occurred",
          });
          console.error(error);
        }
      }
    });
  };
  

  useEffect(() => {
    getData();
  }, [BasicTab, currentPage, perPage]);

  const inactiveItem = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const obj = {
        status: editData.status === "inactive" ? "active" : "inactive",
      };

      const itemsData = await axios.patch(
        `${baseURL}/api/admin/update-collection-status/${editData._id}`,
        obj,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      getData();
      setDeleteModal(!deleteModal);
    } catch (err) {
      //console.log(err);
    }
  };

  const uploadImage = async (event) => {
    let file = event.target.files[0];
    let img = URL?.createObjectURL(file);
    formik.setFieldValue("image", file);
    setImage(img);
  };

  const deleteImage = () => {
    formik.setFieldValue("image", "");
    setImage("");
  };

  const handleClickPreview = (imageUrl) => {
    setSelectedImages(imageUrl);
    setIsPreview(!isPreview);
  };

  const formik = useFormik({
    initialValues: {
        device_type: "",
        banner_type: "",
        theme_type: "",
        title: "",
        image: "",
        content: "",
        redirect_url: "",
        start_date: "",
        end_date: "",
    },
    validationSchema: id
        ? null // Skip validation if id exists
        : Yup.object({
              device_type: Yup.string().required("Device Type is required"),
              banner_type: Yup.string().required("Banner Type is required"),
              theme_type: Yup.string().required("Theme Type is required"),
              title: Yup.string().required("Title is required"),
              image: Yup.mixed().required("Image is required"),
              start_date: Yup.date().required("Start Date is required"),
              end_date: Yup.date()
                  .required("End Date is required")
                  .min(Yup.ref("start_date"), "End Date must be after Start Date"),
          }),
    onSubmit: async (values) => {
        //console.log("Banner ID:", id);
        //console.log("Formik values before update:", values); // Debugging step

        setLoading(true);
        const token = await JSON.parse(localStorage.getItem("token"));

        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value) {
                    if (key === "start_date" || key === "end_date") {
                        formData.append(key, new Date(value).toISOString());
                    } else if (key === "image" && value instanceof File) {
                        formData.append("image", value);
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            //console.log("FormData being sent:", Object.fromEntries(formData.entries())); // Debugging step

            let response;
            if (id) {
                response = await axios.patch(`${baseURL}/api/banner/${id}`, formData, {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                response = await axios.post(`${baseURL}/api/banner`, formData, {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            if (response?.status === 201) {
                setLoading(false);
                formik.resetForm();
                toggleModal();
                getData();
                Swal.fire({
                    title: response?.data?.message,
                    icon: "success",
                    confirmButtonColor: "#d3178a",
                });
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                title: error?.response?.data?.message || "Something went wrong!",
                icon: "error",
                confirmButtonColor: "#d3178a",
            });
        }
    }
});




  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    aspect:
      formik.values.banner_type === "category_search_banner" ? 11 / 1 : 16 / 5,
  });
  const imgRef = useRef(null);

  const handleFileSelection = (event) => {
    const selectedFiles = Array.from(event.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (fileList) => {
    const newFiles = [];
    const fileReaders = [];
    const newSrcList = [];
    const newCropList = [];
  
    // Filter the files based on the banner type
    const filteredFiles =
      formik.values.banner_type === "landing_page_banner"
        ? fileList
        : [fileList[0]];
  
    filteredFiles.forEach((file, index) => {
      const reader = new FileReader();
      fileReaders.push(reader);
  
      reader.onload = (e) => {
        newFiles.push(file);
        newSrcList.push(e.target.result);
        newCropList.push({ aspect: 16 / 4 });
  
        if (newFiles.length === filteredFiles.length) {
          setFiles(newFiles);
          setImages(newSrcList);
          setCropList(newCropList);
  
          // **IMPORTANT: Update Formik’s image field**
          formik.setFieldValue("image", fileList.length > 1 ? newFiles : newFiles[0]);
        }
      };
  
      reader.readAsDataURL(file);
    });
  };
  
  /*
    const handleFiles = (fileList) => {
        if (fileList.length > 0) {
            const file = fileList[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => setImages([reader.result]));
            reader.readAsDataURL(file);
        }
       
    };
 */

  const onImageLoaded = (image, index) => {
    const { naturalWidth: width, naturalHeight: height } = image.currentTarget;
    const aspectRatio =
      formik.values.banner_type === "category_search_banner" ? 11 / 1 : 16 / 5;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCropList((prevCropList) => {
      const newCropList = [...prevCropList];
      newCropList[index] = crop;
      return newCropList;
    });
  };

  const onCropComplete = async (crop, index) => {
    const image = imgRefs.current[index];
    //console.log(image);
    const srcContent = image.src;
    let mimeType = "image/jpeg"; // default mime type;

    if (srcContent) {
      const dataUri = srcContent;
      // Check if the src attribute contains a data URI
      if (dataUri.startsWith("data:")) {
        // Extract the MIME type from the data URI
        const mimeMatch = dataUri.match(/^data:([^;]+);base64,/);
        if (mimeMatch && mimeMatch[1]) {
          mimeType = mimeMatch[1]; // This is the MIME type (e.g., image/gif)
        }
      }
    }
    //console.log(mimeType);
    let blobImg;
    if (mimeType === "image/gif") {
      const base64String = srcContent;
      // Convert base64 string to Blob
      blobImg = base64ToBlob("banner.gif", base64String, "image/gif");
      // blobImg= await cropGifImg(imgRef.current,crop,'banner.gif')
      // blobImg = await cropGifImage(imgRef.current, crop, "banner.gif");
    } else {
      blobImg = await generateCroppedImage(
        image,
        crop,
        "banner.jpeg",
        "image/jpeg"
      );
    }
    //console.log(blobImg);
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = blobImg;
      return newFiles;
    });
  };

  function cropGifImg(image, crop, fileName) {
    /*    const srcContent=image.src;
            //console.log(srcContent);
            const arrayBuffer = srcContent.arrayBuffer();
            const gif = parseGIF(arrayBuffer);
            const frames = decompressFrames(gif, true);
            //console.log("aa")
            const croppedFrames = frames.map(frame => {
             
                const frameCanvas = document.createElement("canvas");
                const scaleX = image.naturalWidth / image.width;
                const scaleY = image.naturalHeight / image.height;
                const pixelRatio = window.devicePixelRatio;
                frameCanvas.width = crop.width * pixelRatio;
                frameCanvas.height = crop.height * pixelRatio;
                const frameCtx = frameCanvas.getContext("2d");
                frameCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                frameCtx.imageSmoothingQuality = "high";
                frameCtx.putImageData(frame.patch, -crop.x * scaleX, -crop.y * scaleY);
                return frameCanvas;
            });

            return new Promise((resolve, reject) => {
                gifshot.createGIF({
                    images: croppedFrames,
                    gifWidth: crop.width,
                    gifHeight: crop.height,
                    numFrames: frames.length,
                    frameDuration: gif.lsd.gce.delay * 10 // delay is in 1/100th of a second
                }, function (obj) {
                    if (!obj.error) {
                        const blob = new Blob([obj.image], { type: 'image/gif' });
                        blob.name = fileName;
                        resolve(blob);
                    } else {
                        reject(obj.error);
                    }
                });
            });*/
  }

  // Function to handle GIF images
  function cropGifImage(image, crop, fileName) {
    /* return new Promise((resolve, reject) => {
        const gif = new GIF({
          workers: 2,
          quality: 10,
          width: crop.width,
          height: crop.height,
        });
    
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = crop.width;
        canvas.height = crop.height;
    
        // Draw the original image onto the canvas for cropping
        ctx.drawImage(
          image,
          crop.x, crop.y, crop.width, crop.height,
          0, 0, crop.width, crop.height
        );
    
        // Add the cropped frame to the GIF
        gif.addFrame(canvas, { copy: true });
    
        gif.on('finished', (blob) => {
          blob.name = fileName;
          resolve(blob);
        });
    
        gif.render();
      });*/
  }

  // Function to convert base64 string to Blob
  const base64ToBlob = (fileName, base64, mime) => {
    // Split the base64 string to remove the data URL part
    // //console.log(base64);
    const parts = base64.split(",");
    // //console.log(parts[1]);
    const byteString = atob(parts[1]);
    const mimeType = parts[0].match(/:(.*?);/)[1];

    // Create an ArrayBuffer and a Uint8Array from the byteString
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ia], { type: mimeType });
    blob.name = fileName; // Manually add the name property

    return blob;
  };

  const generateCroppedImage = (image, crop, fileName, mimeType) => {
    //console.log("filename: ", fileName);
    //console.log("mimeType", mimeType);
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    // New lines to be addefd
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas?.toBlob(
        (blob) => {
          blob.name = fileName;
          resolve(blob);
        },
        mimeType,
        1
      );
    });
  };

  const orderColumns = [
    {
      name: "Device Type",
      selector: (row) => `${row.device_type}`,
      sortable: true,
      center: true,
      cell: (row) => capitalize(row?.device_type),
    },
    {
      name: "Banner Type",
      selector: (row) => `${row.banner_type}`,
      sortable: true,
      center: true,
      width: "200px", 
      cell: (row) =>
        row?.banner_type,
        //  ? banner_types[row?.banner_type] : "N/A"
    },
    {
      name: "TITLE",
      selector: (row) => `${row.title}`,
      sortable: true,
      center: true,
      width: "250px",
      cell: (row) =>
        row?.title,
        //  ? banner_types[row?.banner_type] : "N/A"
    },
    {
      name: "Theme Type",
      selector: (row) => `${row.theme_type}`,
      sortable: true,
      center: true,
      cell: (row) => capitalize(row?.theme_type),
    },
    {
      name: "Preview",
      selector: (row) => row["full_name"],
      sortable: true,
      center: false,
      width: "200px",
      cell: (row) => (
        <Media className="d-flex align-items-center">
          <Image
            attrImage={{
              className: "rounded-circle w-[30px] h-[30px]",
              src: row?.image ? row?.image : dummyImg,
              alt: "Brand image",
            }}
          />
          <span
            onClick={() =>
              handleClickPreview([row?.image ? row.image : dummyImg])
            }
            className="ms-2 link-primary cursor-pointer"
          >
            {capitalize("Click here to preview")}
          </span>
        </Media>
      ),
    },

    {
      name: "CREATED DATE",
      selector: (row) => `${row.createdAt}`,
      cell: (row) => moment(row.createdAt).format("DD MMM, YYYY"),
      sortable: true,
      center: true,
    },
    {
      name: "STATUS",
      selector: (row) => `${row.updatedAt}`,
      sortable: true,
      center: true,
      cell: (row) => (
        <span
          style={{ fontSize: "13px" }}
          className={`badge badge-light-success`}
        >
          Active
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <UncontrolledDropdown className="action_dropdown">
            <DropdownToggle className="action_btn">
              <MoreVertical color="#000" size={16} />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  formik.resetForm();
                  getEditData(row);
                  setId(row?._id);
                  SetAddmodal(true);
                }}
              >
                Edit
                <FaPen />
              </DropdownItem>
              <DropdownItem
                className="delete_item"
                onClick={(rowData) => {
                  deleteBrand(row?._id);
                }}
              >
                Delete
                <FaTrashAlt />
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </>
      ),
      sortable: false,
      center: true,
    },
  ];
  return (
    <Fragment>
      <CardBody style={{ padding: "15px" }}>
        <Row xxl={12} className="pb-2">
          <Row>
            <Col md={6} lg={6} xl={6} xxl={6}>
              <div>
                <h4 className="mb-0">Hero’s Banner</h4>
              </div>
            </Col>
            <Col md={6} lg={6} xl={6} xxl={6}>
              <div className="file-content file-content1 justify-content-end">
                <div className="mb-0 form-group position-relative search_outer d-flex align-items-center">
                  <i className="fa fa-search" style={{ top: "unset" }}></i>
                  <input
                    className="form-control border-0"
                    style={{ maxWidth: "195px" }}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    type="text"
                    placeholder="Search..."
                  />
                </div>
                <Button
                  className="btn btn-primary d-flex align-items-center ms-3"
                  onClick={toggleModal}
                >
                  <PlusCircle />
                  Add Banner
                </Button>
              </div>
            </Col>
          </Row>
        </Row>
      </CardBody>

      <DataTable
        data={data}
        columns={orderColumns}
        striped={true}
        center={true}
        pagination
        paginationServer
        progressComponent={<Loader />}
        progressPending={isLoading}
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
      />

      <CommonModal
        isOpen={AddModal}
        title={id ? "Update Banner" : "Add a New Banner"}
        className="store_modal"
        toggler={toggleModal}
        size="xl"
      >
        <Container>
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col xl={6}>
                <FormGroup>
                  <Label className="font-medium text-base">
                    Device Type <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="select"
                    name="device_type"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.device_type}
                  >
                    <option
                      value=""
                      disabled
                      selected
                      label="Select Device Type"
                    />
                    <option value="mobile" label="Mobile" />
                    <option value="web" label="Website" />
                  </Input>
                  {formik.touched.device_type && formik.errors.device_type ? (
                    <span className="error text-danger">
                      {formik.errors.device_type}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>
              <Col xl={6}>
                <FormGroup>
                  <Label className="font-medium text-base">
                    Banner Type <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="select"
                    name="banner_type"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.banner_type}
                  >
                    <option
                      value=""
                      disabled
                      selected
                      label="Select Banner Type"
                    />
                    <option value="home_page" label="Home Page" />
                    <option
                      value="service_provider_list"
                      label="Service Provider List"
                    />
                    <option
                      value="service_detail_page"
                      label="Service Detail Page"
                    />
                  </Input>
                  {formik.touched.banner_type && formik.errors.banner_type ? (
                    <span className="error text-danger">
                      {formik.errors.banner_type}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>

              <Col xl={6}>
                <FormGroup>
                  <Label className="font-medium text-base">
                    Select Theme Type <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="select"
                    name="theme_type"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.theme_type}
                  >
                    <option
                      value=""
                      disabled
                      selected
                      label="Select Theme Type"
                    />
                    <option value="light" label="Light" />
                    <option value="dark" label="Dark" />
                  </Input>
                  {formik.touched.theme_type && formik.errors.theme_type ? (
                    <span className="error text-danger">
                      {formik.errors.theme_type}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>
              <Col xl={6}>
                <FormGroup>
                  <Label className="font-medium text-base">Title</Label>
                  <Input
                    name="title"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                    placeholder="Enter Banner Title"
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <span className="error text-danger">
                      {formik.errors.title}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>
              <Col xl={12}>
                <FormGroup>
                  <Label className="font-medium text-base">
                    Redirect URL <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="redirect_url"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.redirect_url}
                    placeholder="Enter Redirect URL"
                  />
                  {formik.touched.redirect_url && formik.errors.redirect_url ? (
                    <span className="error text-danger">
                      {formik.errors.redirect_url}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>
              <Col xl={6}>
                <FormGroup>
                  <Label className="font-medium text-base">
                    Start Date <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="date"
                    name="start_date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.start_date}
                  />
                  {formik.touched.start_date && formik.errors.start_date ? (
                    <span className="error text-danger">
                      {formik.errors.start_date}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>
              <Col xl={6}>
                <FormGroup>
                  <Label className="font-medium text-base">
                    End Date <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="date"
                    name="end_date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.end_date}
                  />
                  {formik.touched.end_date && formik.errors.end_date ? (
                    <span className="error text-danger">
                      {formik.errors.end_date}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>

              <Col xl={6}>
                <FormGroup>
                  <Label className="font-medium text-base">
                    Banner Image <span className="text-danger">*</span>
                  </Label>
                  <CardBody>
                    <Form>
                      <input
                        type="file"
                        onChange={handleFileSelection}
                        name="image"
                        hidden
                        accept="image/png, image/jpeg, image/gif"
                        ref={inputRef}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => inputRef.current.click()}
                      >
                        Browse Files
                      </button>
                    </Form>
                  </CardBody>
                  {formik.touched.identityImages &&
                  formik.errors.identityImages ? (
                    <span className="error text-danger">
                      {formik.errors.identityImages}
                    </span>
                  ) : (
                    ""
                  )}
                </FormGroup>
              </Col>
              <Col xl={12}>
                <div className="mt-3">
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <ReactCrop
                        key={index}
                        crop={cropList[index]}
                        onChange={(newCrop) =>
                          setCropList((prevCrops) => {
                            const newCrops = [...prevCrops];
                            newCrops[index] = newCrop;
                            return newCrops;
                          })
                        }
                        onComplete={() =>
                          onCropComplete(cropList[index], index)
                        }
                        aspect={16 / 4}
                        keepSelection={true}
                        minWidth={1920}
                        minHeight={500}
                      >
                        <img
                          ref={(el) => (imgRefs.current[index] = el)}
                          src={image}
                          onLoad={(e) => onImageLoaded(e, index)}
                          alt=""
                        />
                      </ReactCrop>
                    ))
                  ) : (
                    /* 
                                           src ? <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={() => onCropComplete(crop)} aspect={16 / 4} keepSelection={true} minWidth={1920} minHeight={500}  >
                                           <img ref={imgRef} src={src} onLoad={onImageLoaded} alt=''  />
                                       </ReactCrop>
                                           :*/
                    <img src={selectedImage} alt="" />
                  )}
                </div>
              </Col>
              <Col xl={12} className="modal_btm d-flex justify-content-end">
                <Button
                  className="cancel_Btn"
                  onClick={() => {
                    setImages([]);
                    SetAddmodal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
  type="button"
  onClick={() => {
    //console.log("Formik values:", formik.values);
    //console.log("Formik errors:", formik.errors);
    formik.handleSubmit();
  }}
>
  Submit
</Button>

              </Col>
            </Row>
          </Form>
        </Container>
      </CommonModal>

      <CommonModal
        isOpen={isPreview}
        className="store_modal"
        toggler={() => setIsPreview(!isPreview)}
        size="lg"
      >
        <Container>
          <Row>
            {selectedImages.map((image, index) => (
              <Col xl={12} md={12} sm={12} key={index}>
                <img src={image} className="w-100" alt={`banner-${index}`} />
              </Col>
            ))}
          </Row>
        </Container>
      </CommonModal>
    </Fragment>
  );
}

export default ContentManagementTable;
