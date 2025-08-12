// //Samp lePage
import Dashboard from '../Components/Pages/MainPages/Dashboard/Index';
// import Products from '../Components/Pages/MainPages/Products'
import Transactions from '../Components/Pages/MainPages/Transactions'
// import Statistics from '../Components/Pages/MainPages/Statistics'
import Statistics from '../Components/Pages/MainPages/Statistics';
import Customers from '../Components/Pages/MainPages/Customers';
import Enquiries from '../Components/Pages/MainPages/Enquiries';
import PrivateEnquiries from '../Components/Pages/MainPages/private-enquiries'
import Reviews from '../Components/Pages/MainPages/reviews'
import Tickets from '../Components/Pages/MainPages/support-tickets'

// import LogActivity from '../Components/Pages/MainPages/LogActivity'
// import Settings from '../Components/Pages/MainPages/Settings';
import Help from '../Components/Pages/MainPages/Help';
import Collections from '../Components/Pages/MainPages/Collections/Index';
import SubCollections from '../Components/Pages/MainPages/SubCollections/SubCollections';
import Store from '../Components/Pages/MainPages/Store/Store';
import StoreDetails from '../Components/Pages/MainPages/Store/StoreDetails';
import Items from '../Components/Pages/MainPages/Items/Items';
import Products from '../Components/Pages/MainPages/Products/Products'
import ProductDetails from '../Components/Pages/MainPages/Products/ProductDetails';
import Stocks from '../Components/Pages/MainPages/Stocks/Stocks'
import ViewStore from '../Components/Pages/MainPages/Store/view';
import BrandTable from '../Components/Pages/MainPages/Brands/brandTable';
import Brands from '../Components/Pages/MainPages/Brands';
import CreateProduct from '../Components/Pages/MainPages/Products/create';
import CreateService from '../Components/Pages/MainPages/Services/create';
import Variants from '../Components/Pages/MainPages/Variants/Variants';
import Orders from '../Components/Pages/MainPages/Orders/Index';
import Promotions from '../Components/Pages/MainPages/Promotions/Index'
import ErrorPage4 from '../Components/Pages/ErrorPages/ErrorPage404';
import ViewOrder from '../Components/Pages/MainPages/Orders/view';
import RoleManagement from '../Components/Pages/MainPages/RoleManagement';
import Reports from '../Components/Pages/MainPages/Reports';
import ContentManagement from '../Components/Pages/MainPages/ContentManagement';
import Coupons from '../Components/Pages/MainPages/Coupons';
import InventoryLog from '../Components/Pages/MainPages/Stocks/InventoryLog';
import Posts from '../Components/Pages/MainPages/Posts/posts'
import Services from '../Components/Pages/MainPages/Services/Services';
import ServiceDetails from '../Components/Pages/MainPages/Services/serviceDetails';
import IndustryDetails from '../Components/Pages/MainPages/Industries/view/index';
import IndustryEdit from '../Components/Pages/MainPages/Industries/edit/index';
import Categories from '../Components/Pages/MainPages/categories/Products'
import SubCategories from '../Components/Pages/MainPages/sub-categories/Products'
import Segments from '../Components/Pages/MainPages/segments/Products'
import Blogs from '../Components/Pages/MainPages/blogs/posts'
import CreateBlog from '../Components/Pages/MainPages/blogs/create/index'
import Referrals from '../Components/Pages/MainPages/referAndEarn/index'
import Employees from '../Components/Pages/MainPages/employees/index'
import Roles from '../Components/Pages/MainPages/roles/index'
import WithDrawals from '../Components/Pages/MainPages/Withdrawals/index'

import SubscriptionPlans from '../Components/Pages/MainPages/subscripton-plans/Products'
// new comps

import Industries from '../Components/Pages/MainPages/Industries/Index'

const userRole = JSON.parse(localStorage.getItem('role_name'))

let routes = [
  { path: `/dashboard`, Component: <Dashboard /> },
  { path: `/transactions`, Component: <Transactions /> },
  // { path: `/statistics`, Component: <Statistics /> },
  { path: `/transactions`, Component: <Transactions /> },
  { path: `/customers`, Component: <Customers /> },
    { path: `/enquiries`, Component: <Enquiries /> },
    {path:`/private-enquiries`,Component:<PrivateEnquiries />},

    {path:`/reviews`,Component:<Reviews />},

    {path:"/tickets",Component:<Tickets />},

  // { path: `/setting`, Component: <Settings /> },
  { path: `/help`, Component: <Help /> },

  //Industries Route Start
  { path: `/businesses`, Component: <Industries /> },
  { path: `/businesses/:id`, Component: <IndustryDetails /> },
  { path: `/businesses/edit/:id`, Component: <IndustryEdit /> },

  // Order Route Start
  { path: `/orders`, Component: <Orders /> },
  { path: `/orders/:id`, Component: <ViewOrder /> },



  // SubCategory Route Start
  { path: `/segments`, Component: <Segments /> },
  // Category Route Start
  { path: `/categories`, Component: <Categories /> },
  // Category Route Start
  { path: `/sub-categories`, Component: <SubCategories /> },



  // Product Route Start
  { path: `/products`, Component: <Products /> },
  { path: '/product/create', Component: <CreateProduct /> },
  { path: `/products/:id`, Component: <ProductDetails /> },
  { path: '/product/edit/:id', Component: <CreateProduct /> },

  // Variant Route Start 
  { path: `/variants`, Component: <Variants /> },

  // service Route Start
  { path: `/services`, Component: <Services /> },
  { path: '/service/create', Component: <CreateService /> },
  { path: `/services/:id`, Component: <ServiceDetails /> },
  { path: '/service/edit/:id', Component: <CreateService /> },



  // promotion route start
  { path: `/promotions`, Component: <Promotions /> },
  // post route start
{ path: `/posts`, Component: <Posts /> },

{ path: `/blogs`, Component: <Blogs /> },
{ path: `/createBlog`, Component: <CreateBlog /> },
{ path: `/createBlog/:id`, Component: <CreateBlog /> },


{path:"referrals", Component: <Referrals />},
{path:"withdrawls", Component: <WithDrawals />},

{path:"/employees", Component: <Employees />},
{path:"/roles", Component: <Roles />},



  // Stock Route Start 
  { path: `/stocks`, Component: <Stocks /> },
  { path: '/viewInventoryLog/:id', Component: <InventoryLog/>},

  { path: `/collections`, Component: <Collections /> },

  { path: `/sub-collections`, Component: <SubCollections /> },

  // Store Route Start 
  { path: `/store`, Component: <Store /> },
  { path: `/store/:storeName/:id`, Component: <ViewStore /> },

  // Brand Route Start 
  { path: `/brands`, Component: <Brands /> },

  // Report Route Start 
  { path: `/report`, Component: <Reports /> },
  {path:"/subscription-plans",Component: <SubscriptionPlans />},

  // Content Route Start 
  { path: `/content-management`, Component: <ContentManagement /> },

  // Role management Route Start 
  { path: `/role-management`, Component: <RoleManagement /> },

  // Coupon Route Start 
  { path: `/coupons`, Component: <Coupons /> },

  { path: '/', Component: <Dashboard /> },
  { path: `*`, Component: <ErrorPage4 /> }

];


export { routes };