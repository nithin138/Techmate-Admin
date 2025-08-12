import React, { Fragment ,useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import axios from 'axios';
import { baseURL } from '../../../../../Services/api/baseURL';
import { useFormik } from 'formik';
import { Breadcrumbs, H3 } from '../../../../../AbstractElements';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useProductVariantContext } from '../../../../../context/hooks/useProductVariant';
import { useNavigate, useParams } from 'react-router';

function CreateProduct() {
    const { id } = useParams();  // Extracting blog ID from URL params
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, setOriginalData } = useProductVariantContext();
    const validationSchema = Yup.object().shape({
        blogName: Yup.string().when([], {
            is: () => !id, // Required only when `id` is not present (i.e., creating a new blog)
            then: (schema) => schema.required('Blog Name is required'),
        }),
        blogDescription: Yup.string().when([], {
            is: () => !id,
            then: (schema) => schema.required('Blog Description is required').min(80, 'Blog Description must be at least 80 characters'),
        }),
        blogImage: Yup.mixed().test('fileType', 'Only image files are allowed', (value) => {
            if (!value || typeof value === 'string') return true; // Allow empty value or existing image URL
            return ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(value.type);
        }).test('fileSize', 'Image size must be less than 5MB', (value) => {
            if (!value || typeof value === 'string') return true;
            return value.size <= 5 * 1024 * 1024;
        }),
    });
    
    const formik = useFormik({
        initialValues: {
            blogName: "",
            blogDescription: "",
            blogImage: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            //console.log("Submitting Blog Data:", values);
            try {
                setIsLoading(true);
                //console.log("Preparing FormData...");

                const formData = new FormData();
                formData.append("title", values.blogName);
                formData.append("description", values.blogDescription);

                if (values.blogImage && typeof values.blogImage !== "string") {
                    formData.append("image", values.blogImage);
                    //console.log("New image attached:", values.blogImage.name);
                }

                let res;
                if (id) {
                    //console.log(`Updating blog (ID: ${id})...`);
                    res = await axios.put(`${baseURL}/api/blog/${id}`, formData, {
                        headers: {
                            Authorization: `${token}`,
                            "Content-Type": "multipart/form-data",
                        }
                    });
                } else {
                    //console.log("Creating a new blog...");
                    res = await axios.post(`${baseURL}/api/blog`, formData, {
                        headers: {
                            Authorization: `${token}`,
                            "Content-Type": "multipart/form-data",
                        }
                    });
                }

                //console.log("API Response:", res);

                if (res?.status === 201 || res?.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: res?.data?.message || "Blog saved successfully!"
                    });
                    navigate('/blogs');
                    formik.resetForm();
                }
            } catch (error) {
                console.error("Error submitting blog:", error);
                Swal.fire({
                    icon: "error",
                    title: error?.response?.data?.message || "An error occurred"
                });
            } finally {
                setIsLoading(false);
            }
        }
    });
    const [preview, setPreview] = useState(formik.values.blogImage || null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            formik.setFieldValue("blogImage", file);
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    const handleRemoveImage = () => {
        formik.setFieldValue("blogImage", null);
    };

    // ** Validation Schema **
   

  
    const handleReset = () => {
        formik.resetForm();
        setData([])
        setOriginalData([])
    }
    // ** Fetch Blog Data for Edit Mode **
    useEffect(() => {
        if (id) {
            //console.log(`Fetching blog details for ID: ${id}`);
            setIsLoading(true);
            axios.get(`${baseURL}/api/blog/${id}?r=admin`, {
                headers: {
                    Authorization: `${token}`,
                }
            }).then((response) => {
                //console.log(response)
                const blog = response?.data?.blog;
                //console.log("Fetched Blog Data:", blog);
                formik.setValues({
                    blogName: blog.title || "",
                    blogDescription: blog.description || "",
                    blogImage: blog.image || null,  // Store image URL for preview
                });
            }).catch((error) => {
                console.error("Error fetching blog data:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error fetching blog details",
                });
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [id]);

    return (
        <Fragment>
            <Form className='theme-form product-form' onSubmit={formik.handleSubmit}>
                <Container fluid={true}>
                    <div className='page-title'>
                        <Row>
                            <Col xs='6' onClick={() => {navigate(-1)}} style={{cursor:"pointer"}}>
                                <H3>{id ? "Update Blog" : "Add a New Blog"}</H3>
                            </Col>
                            <Col xs='6'>
                                <div className='text-right'>
                                    {!id && <Button onClick={() => handleReset()} className='me-3 reset_btn'>Reset All</Button>}
                                    <Button className='save_btn' type='submit' >{!isLoading && (id ? "Update Details" : "Save Details")}
                                        {isLoading && (id ? "Updating..." : "Saving...")}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
                <Container fluid={true}>
                    <Row>
                        <Col sm='12'>
                            <Card>
                                <CardBody>

                                <Row>
    <Col md={12}>
        <FormGroup>
            <Label>Blog Name <span className='text-danger'>*</span> </Label>
            <Input 
                type='text' 
                placeholder='Enter Blog Name' 
                name='blogName' 
                onChange={formik.handleChange} 
                value={formik.values.blogName} 
                onBlur={formik.handleBlur} 
            />
            {formik.touched.blogName && formik.errors.blogName ? (
                <span className="error text-danger">{formik.errors.blogName}</span>
            ) : null}
        </FormGroup>
    </Col>

    <Col md={12}>
        <FormGroup>
            <Label>Blog Description <span className='text-danger'>*</span> </Label>
            <Input 
                type='textarea' 
                rows={4} 
                placeholder='Enter Blog Description' 
                name='blogDescription' 
                onChange={formik.handleChange} 
                value={formik.values.blogDescription} 
                onBlur={formik.handleBlur} 
            />
            {formik.touched.blogDescription && formik.errors.blogDescription ? (
                <span className="error text-danger">{formik.errors.blogDescription}</span>
            ) : null}
        </FormGroup>
    </Col>

    {/* Blog Image Upload */}
    <Col md={6}>
                            <FormGroup>
                                <Label>Blog Image <span className="text-danger">*</span></Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file = event.target.files[0];
                                        if (file) {
                                            formik.setFieldValue("blogImage", file);
                                        }
                                    }}
                                />
                                {formik.touched.blogImage && formik.errors.blogImage ? (
                                    <div className="text-danger">{formik.errors.blogImage}</div>
                                ) : null}
                            </FormGroup>
                        </Col>

                        {/* Display Image Preview and Replace Image Option */}
                        {formik.values.blogImage && (
                            <Col md={6}>
                                <div className="image-preview">
                                    <img
                                        src={typeof formik.values.blogImage === "string"
                                            ? formik.values.blogImage
                                            : URL.createObjectURL(formik.values.blogImage)}
                                        alt="Blog Preview"
                                        style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
                                    />
                                    <Button className="mt-2 btn-danger" onClick={handleRemoveImage}>
                                        Remove Image
                                    </Button>
                                </div>
                            </Col>)}
</Row>


                                    <Row>
                                        <Col>

                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* <Row >
                        <Col sm='12'>
                            <div className='mb-5'>
                                <Table />
                            </div>
                        </Col>
                    </Row> */}
                </Container>
            </Form>
        </Fragment>
    )
}

export default CreateProduct
 