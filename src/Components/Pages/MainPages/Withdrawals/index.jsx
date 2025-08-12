import { Fragment, lazy, Suspense } from 'react'
import Loader from '../../../Loader/Loader'
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'
import ProductsHeader from './productHeader';

import WithDrawlDataComponent from './WithDrawls'

// const LazyComponent = lazy(() => import('./Customers'))

const Customers = () => {
    return (
        <Fragment>
            <Container fluid={true} style={{paddingTop:'30px'}}>
            <ProductsHeader/>       
            <Row>
                    <Col sm='12'>
                        <Card>
                            <CardBody style={{padding:'15px'}}>
                                <WithDrawlDataComponent />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
               
               
            </Container>
        </Fragment>
   
    )
};

export default Customers;