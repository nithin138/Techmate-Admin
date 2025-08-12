import React, { Fragment, useEffect, useState } from 'react';
import { Col, Card, CardBody, NavItem, NavLink, Nav, Input } from "reactstrap";
import DatePicker from 'react-datepicker';
import { Filter } from 'react-feather';
import { baseURL } from '../../../Services/api/baseURL';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useDataContext } from '../../../context/hooks/useDataContext';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const BarChartClass = () => {
    const { categoryData } = useDataContext();
    const [activeTab, setActiveTab] = useState('users');
    const [data, setData] = useState([]);
    const [storeData, setStoreData] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [totalDataCount, setTotalDataCount] = useState();
    const [loading, setLoading] = useState(false);
    const [revenueList, setRevenueList] = useState([]);

    const handleChange = date => {
        setStartDate(date);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };



    useEffect(() => {
        const fetchData = async () => {
            const token = await JSON.parse(localStorage.getItem("token"));
            let params = {};
            setLoading(true);
            if (startDate) params.month = moment(startDate).format('YYYY-MM');
            try {
                console.log(params)
                const response = await axios.get(`${baseURL}/api/dashboard/graphs`, {
                    params: params,
                    headers: {
                        Authorization: `${token}`,
                    }
                });
                console.log(response)

                if (response && response.data) {
                    let responseData = response?.data?.graphData;
                    console.log(responseData)
                    switch (activeTab) {
                        case 'users':
                            setTotalDataCount(0);

                            // Set user data directly
                            setData(responseData?.users); // if you also show this in a table or other UI
                            console.log(responseData?.users)
                            // Use the user response as the revenue list
                            setRevenueList(responseData?.users);

                            // Optional: sum counts if totalCount isn't provided
                            const totalUserCount = responseData?.users?.reduce((sum, item) => sum + item.count, 0) || 0;
                            setTotalDataCount(totalUserCount);

                            setLoading(false);
                            break;

                        case 'businesses':
                            setTotalDataCount(0);

                            // Sort based on ISO date string
                            const sortedBusinesses = [...responseData?.businesses].sort(
                                (a, b) => new Date(a._id) - new Date(b._id)
                            );
                            console.log(sortedBusinesses)
                            setData(sortedBusinesses);

                            // Set total count safely
                            const totalCount = responseData?.businesses?.reduce((sum, item) => sum + item.count, 0) || 0;
                            setTotalDataCount(totalCount);

                            setLoading(false);
                            break;

                        case 'subscriptions':
                            setTotalDataCount(0);

                            const sortedSubscriptions = [...responseData.subscriptions].sort(
                                (a, b) => new Date(a._id) - new Date(b._id)
                            );
                            console.log(sortedSubscriptions)
                            setData(sortedSubscriptions);

                            const totalSubscriptionCount = responseData?.subscriptions?.reduce((sum, item) => sum + item.count, 0) || 0;
                            setTotalDataCount(totalSubscriptionCount);

                            setLoading(false);
                            break;

                        default:
                            setData([]);
                            setTotalDataCount(0);
                            setLoading(false);
                            break;
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab, startDate, categoryId]);

    // useEffect(() => {
    //     fetchStores();
    // }, [])

    // const totalCount = data?.reduce((acc, curr) => acc + curr.count, 0);

    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string.slice(1);
    }
    // const handleReportDownload = () => {
    //     const unit = "pt";
    //     const size = "A4"; // Use A1, A2, A3 or A4
    //     const orientation = "portrait"; // portrait or landscape
    //     const doc = new jsPDF(orientation, unit, size);

    //     // Headers for each report
    //     const headers = ['Date', 'No. of Orders', 'Total Revenue'];
    //     let pdfData = [];

    //     // Extract data from the response for each report type
    //     const reports = ['revenue', 'order', 'customer'];
    //     reports.forEach(reportType => {
    //         // Extract data based on the report type
    //         let reportData = [];
    //         switch (reportType) {
    //             case 'revenue':
    //                 reportData = data || [];
    //                 break;
    //             case 'order':
    //                 reportData = data || [];
    //                 break;
    //             case 'customer':
    //                 reportData = data || [];
    //                 break;
    //             default:
    //                 reportData = [];
    //                 break;
    //         }

    //         // Add a section title for each report
    //         pdfData.push([{ content: `${capitalizeFirstLetter(reportType)} Data`, colSpan: 3, styles: { halign: 'center' } }]);

    //         // Add report data
    //         reportData.forEach(entry => {
    //             pdfData.push([
    //                 moment(entry?._id).format('MMMM Do YYYY'), // Assuming _id represents the date
    //                 entry?.count || 0,
    //                 entry?.totalCount || 0
    //             ]);
    //         });

    //         // Add an empty row as a separator between reports
    //         pdfData.push(['', '', '']);
    //     });

    //     // Add data to PDF
    //     doc.autoTable({
    //         head: [headers],
    //         body: pdfData
    //     });

    //     // Save PDF
    //     doc.save(`all_reports_${moment().format('YYYY-MM-DD')}.pdf`);
    // };

    // const downloadExcel = () => {
    //     // Extracting revenue data
    //     const revenueData = [
    //         ['Date', 'No. of Orders', 'Total Revenue']
    //     ];

    //     revenueList.forEach(item => {
    //         const date = `${item._id.year}-${item._id.month}-${item._id.day}`;
    //         revenueData.push([date, item.count, item.totalCount]);
    //     });

    //     const workbook = XLSX.utils.book_new();

    //     //console.log("data?.revenue?.data", data);

    //     // Add revenue sheet
    //     const revenueWorksheet = XLSX.utils.aoa_to_sheet(revenueData);
    //     XLSX.utils.book_append_sheet(workbook, revenueWorksheet, 'Revenue');

    //     // Convert workbook to buffer
    //     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    //     // Convert buffer to Blob
    //     const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    //     // Create download link and trigger download
    //     const excelFilename = `revenue_${moment().format('YYYY-MM-DD')}.xlsx`;
    //     const excelDownloadLink = document.createElement('a');
    //     excelDownloadLink.href = URL.createObjectURL(excelBlob);
    //     excelDownloadLink.download = excelFilename;
    //     excelDownloadLink.click();
    // };



    return (
        <Fragment>
            <Col xl="12" md="12">
                <Card>

                    <div className="card-header d-flex align-items-center justify-between" style={{ padding: '15px 30px' }}>
                        <Nav tabs className='product_variant_tabs'>
                            <NavItem>
                                <NavLink className={activeTab === 'users' ? 'active' : ''} onClick={() => handleTabClick('users')}>
                                    Users
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={activeTab === 'businesses' ? 'active' : ''} onClick={() => handleTabClick('businesses')}>
                                    Service Providers
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={activeTab === 'subscriptions' ? 'active' : ''} onClick={() => handleTabClick('subscriptions')}>
                                    Subscriptions
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <div className='d-flex align-items-center file-content file-content-dash'>
                            {/* <Input type='select'>
                                <option value=''>All Stores</option>
                                {storeData && storeData.length > 0 && storeData.map((data) => (
                                    <option key={data._id} value={data._id}>{data.storeName}</option>
                                ))}
                            </Input> */}
                            {/* <Input type='select' name='product_id' className='ms-2' onChange={(e) => setCategoryId(e.target.value)}>
                                <option value=''>All Category</option>
                                {categoryData && categoryData.length > 0 && categoryData.map((data) => (
                                    <option key={data._id} value={data._id}>{data.collection_name}</option>
                                ))}
                            </Input> */}
                            <DatePicker className="datepickerr form-control digits mx-2"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="MMM yyyy"
                                showMonthYearPicker
                                showIcon
                                placeholderText='Select Month'
                            />
                            {/* {
                                activeTab === 'revenue' &&
                                <button type='button' className='btn btn-secondary' onClick={downloadExcel}>
                                    Download Excel
                                </button>
                            } */}
                            {/* <Button type='button' className='filter_btn'>
                                <Filter color='#1D2433CC' size={16} />
                            </Button> */}
                        </div>
                    </div>

                    <CardBody className="chart-block" style={{ padding: '15px' }}>

                        {data && (
                            <div style={{ position: 'relative' }}>
                                <Bar style={{ height: "600px" }}
                                    data={{
                                        labels: Array.from({ length: moment(startDate).daysInMonth() }, (_, i) =>
                                            moment(startDate).startOf('month').add(i, 'days').format('DD')
                                        ),
                                        datasets: [
                                            {
                                                label: 'Count',
                                                data: Array.from({ length: moment(startDate).daysInMonth() }, (_, i) => {
                                                    const date = moment(startDate).startOf('month').add(i, 'days').format('YYYY-MM-DD');
                                                    const dayData = data.find(entry => entry._id === date);
                                                    return dayData ? dayData.count.toFixed(2) : 0;
                                                }),
                                                backgroundColor: "#2F6FED",
                                                borderRadius: 8,
                                                // borderWidth: 2,
                                                datalabels: {
                                                    color: '#2F6FED',
                                                    anchor: 'end',
                                                    align: 'top'
                                                }
                                            }
                                        ]
                                    }}
                                    options={{
                                        plugins: {
                                            legend: { display: false },
                                            title: {
                                                display: true,
                                                position: 'bottom',
                                                text: startDate ? moment(startDate).format('MMM YYYY') : 'Custom Chart Title',
                                                padding: { top: 20 }
                                            },
                                            datalabels:{
                                                display:false
                                            }
                                        },
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        layout: {
                                            padding: { top: 50, bottom: 20 }
                                        },


                                        scales: {
                                            x: {
                                                grid: {
                                                    display: false,
                                                },
                                            },
                                            y: {
                                                grid: {
                                                    display: false,
                                                },
                                                
                                            },
                                        }
                                    }}
                                />

                                <div >
                                    <h5 style={{ position: 'absolute', top: 0, left: 0, margin: '0' }} className='fw-bolder'>{capitalizeFirstLetter(activeTab)}</h5>
                                    <p style={{ position: 'absolute', top: 0, right: 0 }}>
                                        {activeTab !== 'customer' && (
                                            <span>
                                                <b>Total {capitalizeFirstLetter(activeTab)}:</b> {`${activeTab === 'revenue' ? '$' : ''}`}{totalDataCount ? totalDataCount?.toFixed(2) : 0}
                                            </span>
                                        )}
                                    </p>
                                    {/* <p>Total Order Count: {totalOrderCount}</p> */}
                                </div>
                            </div>
                        )}
                    </CardBody>







                    {/* <CardBody className="chart-block" style={{ padding: '15px' }}>
                        {data && (
                            <div style={{ position: 'relative' }}>
                                <Bar
                                    data={{
                                        labels: data.map(entry => `${entry._id.day}`),
                                        datasets: [{
                                            label: 'Count',
                                            data: data.map(entry => entry.count),
                                            backgroundColor: "rgb(211, 23, 138)",
                                            borderRadius: 5,
                                            borderWidth: 2,
                                            datalabels: {
                                                color: 'black',
                                                anchor: 'end',
                                                align: 'top'
                                            }
                                        }]
                                    }}
                                    options={{
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },

                                            title: {
                                                display: true,
                                                position: 'bottom',
                                                text: startDate ? moment(startDate).format('MMM YYYY') : 'Custom Chart Title',
                                                padding: {
                                                    // bottom: 20,
                                                    top: 20
                                                },
                                            },

                                        },

                                        maintainAspectRatio: false,
                                        responsive: true,
                                        layout: {
                                            padding: {
                                                top: 50,
                                                bottom: 20,
                                            },
                                        },
                                    }}
                                />
                                <div >
                                    <h5 style={{ position: 'absolute', top: 0, left: 0, margin: '0' }} className='fw-bolder'>{capitalizeFirstLetter(activeTab)}</h5>
                                    <p style={{ position: 'absolute', top: 0, right: 0 }}>
                                        {activeTab !== 'customer' && (
                                            <span>
                                                <b>Total {capitalizeFirstLetter(activeTab)}:</b> ${totalDataCount ? totalDataCount : 0}
                                            </span>
                                        )}
                                    </p>
                                    {/* <p>Total Order Count: {totalOrderCount}</p> */}
                    {/* </div>
                            </div>
                        )}
                    </CardBody> */}

                </Card>
            </Col>
        </Fragment>
    )
}

export default BarChartClass;
