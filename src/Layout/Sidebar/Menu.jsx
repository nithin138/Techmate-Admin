export const MENUITEMS = [
  {
    menutitle: 'Main Menus',
    menucontent: 'Dashboards,Widgets',
    Items: [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        type: 'link',
        active: true,
        path: `/dashboard`
      },
      {
        title: 'Users',
        icon: 'customer',
        type: 'link',
        active: false,
        path: `/customers`,
        // roles: ['admin'],
      },
      {
        title: 'Service Providers',
        icon: 'order',
        type: 'link',
        active: false,
        path: `/businesses`
      },
      {
        title: 'Products and services',
        icon: 'transaction',
        type: 'sub', // Parent menu item for Categories
        path: '',
        active: false,
        children: [
          {
            path: `/segments`,
            title: 'Segments',
            type: 'link',
            active: false,
          },
          {
            path: `/categories`,
            title: 'Categories',
            type: 'link',
            active: false,
          },
          {
            path: `/sub-categories`,
            title: 'Sub-categories',
            type: 'link',
            active: false,
          },
          {
            title: 'Products',
            icon: 'transaction',
            type: 'link',
            active: false,
            path: `/products`
          },
          {
            title: "Services",
            icon: "store",
            type: "link",
            path: `/services`,
            active: false,
          },
        ],
      },
       {
        title: 'Enquiries',
        icon: 'transaction',
        type: 'sub', // Parent menu item for Categories
        path: '',
        active: false,
        children: [
            {
        title: "Public Enquiries",
        icon: "store",
        type: "link",
        path: `/enquiries`,
        badge: "badge badge-light-danger",
        active: false,
        // roles: ['admin'],
      },
           {
        title: "Private Enquiries",
        icon: "store",
        type: "link",
        path: `/private-enquiries`,
        badge: "badge badge-light-danger",
        active: false,
        // roles: ['admin'],
      },
        ],
      },
      {
        title: "Reviews",
        icon: "store",
        type: "link",
        path: `/reviews`,
        badge: "badge badge-light-danger",
        active: false,
        // roles: ['admin'],
      },
      {
        title: "Posts",
        icon: "store",
        type: "link",
        path: `/posts`,
        badge: "badge badge-light-danger",
        active: false,
        // roles: ['admin'],
      },
      {
        title: "Blogs",
        icon: "store",
        type: "link",
        path: `/blogs`,
        badge: "badge badge-light-danger",
        active: false,
        // roles: ['admin'],
      },
      {
        title: 'Subscriptions',
        icon: 'transaction',
        type: 'sub', // Parent menu item for Categories
        path: '',
        active: false,
        children: [
          {
            title: "Subscription Plans",
            icon: "report",
            type: "link",
            path: `/subscription-plans`,
            badge: "badge badge-light-danger",
            active: false,
            // roles: ['admin'] ,
          },
          {
            title: "Subscription Records",
            icon: "report",
            type: "link",
            path: `/report`,
            badge: "badge badge-light-danger",
            active: false,
            // roles: ['admin'] ,
          },
        ],
      },
         {
        title: 'Referrals and rewards',
        icon: 'customer',
        type: 'sub', // Parent menu item for Categories
        path: '',
        active: false,
        children: [
          {
            path: `/referrals`,
            title: 'Referrals',
            type: 'link',
            active: false,
          },
          {
            path: `/withdrawls`,
            title: 'Withdrawls',
            type: 'link',
            active: false,
          },
        ]
        },
           {
        title: 'Roles and employees',
        icon: 'customer',
        type: 'sub', // Parent menu item for Categories
        path: '',
        active: false,
        children: [
          {
            path: `/roles`,
            title: 'Roles',
            type: 'link',
            active: false,
          },
          {
            path: `/employees`,
            title: 'Employees',
            type: 'link',
            active: false,
          },
        ]
        },
       {
        title: 'Support Tickets',
        icon: 'customer',
        type: 'link',
        active: false,
        path: `/tickets`,
        // roles: ['admin'],
      },
      // {
      //   title: 'Role Management',
      //   icon: 'role',
      //   type: 'link',
      //   active: false,
      //   path: `/role-management`,
      //   roles: ['admin']
      // },
      // {
      //   title: 'Role Management',
      //   icon: 'role',
      //   type: 'link',
      //   active: false,
      //   path: `/role-management`,
      //   roles: ['store']
      // },
      {
        title: 'CMS',
        icon: 'role',
        type: 'link',
        active: false,
        path: `/content-management`,
        // roles: ['admin']
      },
      // {
      //   title: 'Log Activity',
      //   icon: 'log',
      //   type: 'link',
      //   active: false,
      //   path: `/activity`
      // },
    ],
  },
  // {
  //   menutitle: 'Support',
  //   menucontent: 'Dashboards,Widgets',
  //   Items: [
  //     {
  //       title: 'Settings',
  //       icon: 'setting',
  //       type: 'link',
  //       active: true,
  //       path: `/setting`
  //     },
  //     // {
  //     //   title: 'Help',
  //     //   icon: 'help',
  //     //   type: 'link',
  //     //   active: false,
  //     //   path: `/help`
  //     // },
  //   ],
  // },
];
      // {
      //   title: 'vendors',
      //   icon: 'product',
      //   // type: 'link',
      //   active: false,
      //   // path: `/products`
      //   type: "sub",
      //   path: ``,
      //   badge: "badge badge-light-danger",
      //   // badgetxt: "6",
      //   // roles: ['admin'] ,
      //   children: [
      //     { path: `/products`, title: "Products", type: "link" },
      //     { path: `/brands`, title: "Brands", type: "link" },
      //     { path: `/collections`, title: "Collections", type: "link" },
      //     { path: `/sub-collections`, title: "Sub-Collections", type: "link" },
      //     { path: `/variants`, title: "Variants", type: "link" },

      //     // { path: `/items`, title: "Items", type: "link" },
      //     // {
      //     //   path: `/products`, title: "Products", type: "link"
      //     // },
      //     // { path: `/stocks`, title: "Stocks", type: "link" },
      //   ],
      //   roles: ['admin']
      // },
      // {
      //   title: 'Consultants',
      //   icon: 'product',
      //   // type: 'link',
      //   active: false,
      //   // path: `/products`
      //   type: "sub",
      //   path: ``,
      //   badge: "badge badge-light-danger",
      //   // badgetxt: "6",
      //   // roles: ['admin'] ,
      //   children: [
      //     { path: `/products`, title: "Products", type: "link" },
      //     { path: `/brands`, title: "Brands", type: "link" },
      //     { path: `/collections`, title: "Collections", type: "link" },
      //     { path: `/sub-collections`, title: "Sub-Collections", type: "link" },
      //     { path: `/variants`, title: "Variants", type: "link" },

      //     // { path: `/items`, title: "Items", type: "link" },
      //     // {
      //     //   path: `/products`, title: "Products", type: "link"
      //     // },
      //     // { path: `/stocks`, title: "Stocks", type: "link" },
      //   ],
      //   roles: ['store']
      // },
      // {
      //   title: 'Variants',
      //   icon: 'variant',
      //   type: 'link',
      //   active: false,
      //   path: `/variants`
      // },
      // {
      //   title: 'Brands',
      //   icon: 'brand',
      //   type: 'link',
      //   active: false,
      //   path: `/brands`
      // },
           
      // {
      //   title: 'Statistics',
      //   icon: 'statistic',
      //   type: 'link',
      //   active: false,
      //   path: `/statistics`
      // },
  
      // {
      //   title: 'Referrals and rewards',
      //   icon: 'customer',
      //   type: 'link',
      //   active: false,
      //   path: `/refer-and-earn`,
      //   // roles: ['admin'],
      // },