import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import { H5 } from '../../../../../AbstractElements';
import { Button, Col, Container, Form, FormGroup, Input, Label, Pagination, PaginationItem, Row } from 'reactstrap';
import { DropdownItem, DropdownMenu, DropdownToggle, Media, UncontrolledDropdown } from 'reactstrap';
import { MoreVertical } from 'react-feather';
import { FaDownload, FaRegEye, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import moment from 'moment';
import { debounce } from 'lodash';
import Loader from '../../../../Loader/Loader';
import { FaPen, FaExchangeAlt } from 'react-icons/fa';

import {
    baseURL,
    imageURL,
    productBaseURL,
} from "../../../../../Services/api/baseURL";
import axios from 'axios';
import Swal from 'sweetalert2';
import CommonModal from "../../../../UiKits/Modals/common/modal";

const OrdersTable = ({ orderData, onSucess }) => {
    console.log(orderData, "orderData");
    const navigate = useNavigate();

    //console.log(orderData)

    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchText, setSearchText] = useState('');
    const [AddModal, SetAddmodal] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [formData, setFormData] = useState({
        endDate: ""
    });

    const debouncedSearch = React.useRef(
        debounce(async (searchTerm) => {
            setSearchText(searchTerm);
        }, 300)
    ).current;

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event.target.value);
    };

    const handleNavigate = (id) => {
        navigate(`/orders/${id}`);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const toggleModal = (subscription = null) => {
        if (subscription) {
            setSelectedSubscription(subscription);
            setFormData({ endDate: subscription?.endDate?.split("T")[0] }); // format date for input type="date"
        }
        SetAddmodal(!AddModal);
    };



    // function capitalizeFirstLetter(string) {
    //     return string?.charAt(0)?.toUpperCase() + string.slice(1);
    // }

    // const filteredData = orderData?.filter(order => {
    //     const address = order?.address;
    //     const addressMatches = (
    //         address?.addressFullName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //         address?.addressPhoneNumber?.includes(searchTerm) ||
    //         address?.addressPincode?.includes(searchTerm) ||
    //         address?.city?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //         address?.country?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //         address?.houseNo?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //         address?.locality?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //         address?.roadName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //         address?.state?.toLowerCase().includes(searchTerm?.toLowerCase())
    //     );

    //     const variantMatches = order?.products?.some(product => {
    //         return (
    //             product?.variant?.variantName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //             product?.variant?.variantCode?.toLowerCase().includes(searchTerm?.toLowerCase())
    //         );
    //     });

    //     const productMatches = order.products?.some(product => {
    //         if (product?.product) {
    //             return (
    //                 product.product.productName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //                 product.product.description?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //                 product.product.brand.brandName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //                 product.product.category.collection_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //                 product.product.subCategory.collection_id?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //                 product.product?.tags?.some(tag => tag?.tag?.toLowerCase().includes(searchTerm?.toLowerCase()))
    //             );
    //         } else {
    //             return false;
    //         }
    //     });

    //     return addressMatches || variantMatches || productMatches;
    // });
    const handleCancel = async (id) => {
        try {
            const response = await axios.post(`${baseURL}/api/usersubscription/${id}/cancel`);

            console.log(response, "response in cancel order");

            if (response?.data?.success === true) {
                Swal.fire({
                    icon: "success",
                    text: response?.data?.message,
                })

                onSucess()

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSubscription?._id || !formData?.endDate) {
            Swal.fire({ icon: "warning", title: "Missing data!" });
            return;
        }

        try {
            const response = await axios.patch(
                `${baseURL}/api/usersubscription/${selectedSubscription._id}/update`,
                { endDate: formData.endDate }
            );

            console.log(response, "response in extend");
            Swal.fire({
                icon: "success",
                text: response?.data?.message,
            });
            onSucess();
            SetAddmodal(false);

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "warning",
                title: error?.response?.data?.error || "Something went wrong",
            });
        }
    };

    const orderColumns = [
        {
            name: '#ORDER_ID',
            selector: row => row['sequence_number'],
            sortable: true,
            center: true,
            cell: (row) => (

                <div className='ellipses_text_1'>{row?._id}</div>
            )
        },
        {
            name: "CUSTOMER NAME",
            selector: (row) => row?.userId?.name || "Unspecified",
            sortable: true,
            center: true,
            cell: (row) => (
                <div>
                    {row?.userId?.name ? row.userId.name : "Unspecified"}
                </div>
            ),
        },

        {
            name: 'SUBSCRIPTION DATE',
            selector: row => `${row.startDate}`,
            sortable: true,
            center: true,
            cell: (row) => (
                moment(row.startDate).format('DD MMM, YYYY')
            )
        },
        {
            name: 'SUBSCRIPTION ENDDATE',
            selector: row => `${row.endDate}`,
            sortable: true,
            center: true,
            cell: (row) => (
                moment(row.endDate).format('DD MMM, YYYY')
            )
        },
        {
            name: 'DURATION',
            selector: row => `${row?.subscriptionPlanId?.duration}`,
            cell: (row) => (
                `${row?.subscriptionPlanId?.duration} months`
            ),
            sortable: true,
            center: true,
        },
        {
            name: 'PLAN NAME',
            selector: row => `${row?.subscriptionPlanId?.name}`,
            cell: (row) => (
                row?.subscriptionPlanId?.name
            ),
            sortable: true,
            center: true,
        },
        // {
        //     name: 'PAYMENT DETAILS',
        //     selector: row => `${row.payment_method}`,
        //     cell: (row) => (
        //         row.payment_method
        //     ),
        //     sortable: true,
        //     center: true,
        // },
        {
            name: 'PRICE',
            selector: row => `${row?.subscriptionPlanId?.price}`,
            cell: (row) => (
                ` ₹ ${row?.subscriptionPlanId?.price}`
            ),
            sortable: true,
            center: true,
        },
        {
            name: 'STATUS',
            selector: row => `${row?.status}`,
            cell: (row) => (
                row?.status
            ),
            sortable: true,
            center: true,
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
                                    onClick={() => toggleModal(row)}
                                >
                                    Extend
                                    <FaPen />
                                </DropdownItem>
                                <DropdownItem
                                    className="delete_item"
                                    onClick={() => handleCancel(row?._id)}
                                >
                                    Cancel
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
            <Row xxl={12}>
                <Row>
                    <Col md={12} lg={12} xl={12} xxl={12}>
                        <div className="file-content align-items-center justify-content-between mb-3">
                            <H5 attrH5={{ className: 'mb-0 font-semibold' }}>User Subscriptions</H5>
                            <div className='d-flex'>
                                {/* <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                                    <i className='fa fa-search'></i>
                                    <input className='form-control border-0' value={searchTerm} onChange={(e) => handleSearch(e)} type='text' placeholder='Search...' />
                                </div> */}
                                {/* <Input type='select' className='ms-3 sortBy' name='subCategory' >
                                    <option>Sort By</option>
                                </Input> */}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Row>

            <DataTable
                data={orderData}
                columns={orderColumns}
                // pagination
                progressPending={isLoading}
                progressComponent={<Loader />}
            />
            <CommonModal
                isOpen={AddModal}
                title="Extend Subscription"
                className="store_modal"
                toggler={toggleModal}
                size="md"
            >
                <Container>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xl={6}>
                                <FormGroup>
                                    <Label className="font-medium text-base">
                                        Extend Subscription<span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        name='endDate'
                                        onChange={handleChange}
                                        value={formData?.endDate}
                                        min={formData?.endDate}
                                    />

                                </FormGroup>
                            </Col>
                            <Col xl={12}>
                                <div className="d-flex justify-content-end">
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </CommonModal>

        </Fragment>
    )
}
export default OrdersTable