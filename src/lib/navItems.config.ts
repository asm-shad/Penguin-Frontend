/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/navigation.utils.ts
import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

// ==================== COMMON NAV ITEMS (For ALL roles) ====================
export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      items: [
        {
          title: role === "USER" ? "Home" : "Dashboard",
          href: defaultDashboard,
          icon: role === "USER" ? "Home" : "LayoutDashboard",
          roles: [
            "SUPER_ADMIN",
            "ADMIN",
            "PRODUCT_MANAGER",
            "CUSTOMER_SUPPORT",
            "USER",
          ],
        },
        {
          title: "My Profile",
          href: `/my-profile`,
          icon: "User",
          roles: [
            "SUPER_ADMIN",
            "ADMIN",
            "PRODUCT_MANAGER",
            "CUSTOMER_SUPPORT",
            "USER",
          ],
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Key",
          roles: [
            "SUPER_ADMIN",
            "ADMIN",
            "PRODUCT_MANAGER",
            "CUSTOMER_SUPPORT",
            "USER",
          ],
        },
      ],
    },
  ];
};

// ==================== USER-SPECIFIC NAV ITEMS (Only for USER role) ====================
// User Account Management
export const userAccountNavItems: NavSection[] = [
  {
    title: "Account",
    items: [
      {
        title: "My Orders",
        href: "/my-orders",
        icon: "Package",
        roles: ["USER"],
      },
      {
        title: "Wishlist",
        href: "/wishlist",
        icon: "Heart",
        roles: ["USER"],
      },
      {
        title: "Addresses",
        href: "/my-addresses",
        icon: "MapPin",
        roles: ["USER"],
      },
    ],
  },
];

// Regular USER Shopping & Support
export const userNavItems: NavSection[] = [
  {
    title: "Shopping",
    items: [
      {
        title: "Categories",
        href: "/categories",
        icon: "Layers",
        roles: ["USER"],
      },
      {
        title: "Deals & Offers",
        href: "/deals",
        icon: "Percent",
        roles: ["USER"],
      },
      {
        title: "Featured Products",
        href: "/featured",
        icon: "Star",
        roles: ["USER"],
      },
    ],
  },
  {
    title: "My Account",
    items: [
      {
        title: "Order History",
        href: "/dashboard/orders",
        icon: "Package",
        roles: ["USER"],
      },
      {
        title: "Track Order",
        href: "/dashboard/track-order",
        icon: "Truck",
        roles: ["USER"],
      },
      {
        title: "My Reviews",
        href: "/dashboard/reviews",
        icon: "Star",
        roles: ["USER"],
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Help Center",
        href: "/help",
        icon: "HelpCircle",
        roles: ["USER"],
      },
      {
        title: "Contact Support",
        href: "/contact-support",
        icon: "MessageSquare",
        roles: ["USER"],
      },
      {
        title: "Return Items",
        href: "/returns",
        icon: "RotateCcw",
        roles: ["USER"],
      },
    ],
  },
];

// ==================== ADMIN-SPECIFIC NAV ITEMS (For staff roles) ====================
// SUPER_ADMIN Nav Items
export const superAdminNavItems: NavSection[] = [
  {
    title: "System Administration",
    items: [
      {
        title: "Super Admin Dashboard",
        href: "/super-admin/dashboard",
        icon: "Shield",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "Create Admin",
        href: "/super-admin/create-admin",
        icon: "UserPlus",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "System Analytics",
        href: "/super-admin/analytics",
        icon: "BarChart3",
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "All Users",
        href: "/admin/users",
        icon: "Users",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Staff Management",
        href: "/admin/staff",
        icon: "Briefcase",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
];

// ADMIN Nav Items
// export const adminNavItems: NavSection[] = [
//   {
//     title: "Admin Dashboard",
//     items: [
//       {
//         title: "Admin Home",
//         href: "/admin/dashboard",
//         icon: "LayoutDashboard",
//         roles: ["SUPER_ADMIN", "ADMIN"],
//       },
//       {
//         title: "Sales Overview",
//         href: "/admin/sales",
//         icon: "TrendingUp",
//         roles: ["SUPER_ADMIN", "ADMIN"],
//       },
//       {
//         title: "Financial Reports",
//         href: "/admin/reports",
//         icon: "PieChart",
//         roles: ["SUPER_ADMIN", "ADMIN"],
//       },
//     ],
//   },
// ];

// PRODUCT_MANAGER Nav Items
export const productManagerNavItems: NavSection[] = [
  {
    title: "Product Management",
    items: [
      {
        title: "Product Dashboard",
        href: "/admin/dashboard/product-management",
        icon: "LayoutDashboard",
        roles: ["SUPER_ADMIN", "ADMIN","PRODUCT_MANAGER"],
      },
      {
        title: "All Products",
        href: "/admin/dashboard/product-management/products",
        icon: "Package",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Inventory Management",
        href: "/admin/dashboard/product-management/inventory",
        icon: "PackageCheck",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Product Reviews",
        href: "/admin/dashboard/product-management/reviews",
        icon: "Star",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
    ],
  },
  // {
  //   title: "Product Variants",
  //   items: [
  //     {
  //       title: "Manage Variants",
  //       href: "/admin/variants",
  //       icon: "GitBranch",
  //       roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
  //     },
  //     {
  //       title: "Add Variant",
  //       href: "/admin/variants/add",
  //       icon: "GitBranchPlus",
  //       roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
  //     },
  //   ],
  // },
];

// CUSTOMER_SUPPORT Nav Items
// export const customerSupportNavItems: NavSection[] = [
//   {
//     title: "Support Dashboard",
//     items: [
//       {
//         title: "Support Home",
//         href: "/customer-support/dashboard",
//         icon: "LayoutDashboard",
//         roles: ["CUSTOMER_SUPPORT"],
//       },
//       {
//         title: "New Tickets",
//         href: "/admin/support-tickets/new",
//         icon: "MessageSquare",
//         roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
//       },
//       {
//         title: "All Tickets",
//         href: "/admin/support-tickets",
//         icon: "Inbox",
//         roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
//       },
//     ],
//   },
//   {
//     title: "Customer Management",
//     items: [
//       {
//         title: "Customer Management",
//         href: "/admin/dashboard/customer-management/catalog",
//         icon: "Package",
//         roles: ["SUPER_ADMIN", "ADMIN"],
//       },
//       {
//         title: "Customer Issues",
//         href: "/admin/dashboard/customer-management/customer-issues",
//         icon: "AlertCircle",
//         roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
//       },
//       {
//         title: "Order Issues",
//         href: "/admin/dashboard/customer-management/order-issues",
//         icon: "ShoppingCart",
//         roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
//       },
//       {
//         title: "Return Requests",
//         href: "/admin/dashboard/customer-management/returns",
//         icon: "RotateCcw",
//         roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
//       },
//     ],
//   },
//   {
//     title: "Knowledge Base",
//     items: [
//       {
//         title: "FAQs",
//         href: "/admin/faqs",
//         icon: "HelpCircle",
//         roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
//       },
//       {
//         title: "Guides",
//         href: "/admin/guides",
//         icon: "BookOpen",
//         roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
//       },
//       {
//         title: "Manage FAQ",
//         href: "/admin/faqs/manage",
//         icon: "HelpCircle",
//         roles: ["SUPER_ADMIN", "ADMIN"],
//       },
//     ],
//   },
// ];

// ==================== MANAGEMENT MODULES (Shared across multiple staff roles) ====================
// ORDER MANAGEMENT (Accessible by SUPER_ADMIN, ADMIN, CUSTOMER_SUPPORT)
export const orderManagementNavItems: NavSection[] = [
  {
    title: "Order Management",
    items: [
      {
        title: "All Orders",
        href: "/admin/dashboard/order-management",
        icon: "ShoppingCart",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
      {
        title: "Pending Orders",
        href: "/admin/orders/pending",
        icon: "Clock",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
      {
        title: "Process Orders",
        href: "/admin/orders/process",
        icon: "Truck",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
      {
        title: "Shipping",
        href: "/admin/shipping",
        icon: "Package",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
      {
        title: "Returns & Refunds",
        href: "/admin/returns",
        icon: "RotateCcw",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
    ],
  },
];

// CUSTOMER MANAGEMENT (Accessible by SUPER_ADMIN, ADMIN, CUSTOMER_SUPPORT)
export const customerManagementNavItems: NavSection[] = [
  {
    title: "Staff Management",
    items: [
      {
        title: "Admin",
        href: "/admin/dashboard/admin-management",
        icon: "UserCog",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
      {
        title: "Product Manager",
        href: "/admin/dashboard/product-manager-management",
        icon: "PackageSearch", // or "PackageCheck"
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Customer Support",
        href: "/admin/dashboard/customer-support-management",
        icon: "Headphones",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
];

// CATALOG MANAGEMENT (Accessible by SUPER_ADMIN, ADMIN, PRODUCT_MANAGER)
export const catalogManagementNavItems: NavSection[] = [
  {
    title: "Catalog Management",
    items: [
      // Categories
      {
        title: "Product Categories",
        href: "/admin/dashboard/category-management",
        icon: "Layers",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      // Brands
      {
        title: "Product Brands",
        href: "/admin/dashboard/brand-management",
        icon: "Tag",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Blog Categories",
        href: "/admin/dashboard/blogCategory-management",
        icon: "ListTree",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Coupon",
        href: "/admin/dashboard/coupon-management",
        icon: "TicketPercent",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
    ],
  },
];


// MARKETING MANAGEMENT (Accessible by SUPER_ADMIN, ADMIN, PRODUCT_MANAGER)
// export const marketingManagementNavItems: NavSection[] = [
//   {
//     title: "Marketing Management",
//     items: [
//       {
//         title: "Featured Products",
//         href: "/admin/featured",
//         icon: "Star",
//         roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
//       },
//       {
//         title: "Promotions",
//         href: "/admin/promotions",
//         icon: "Megaphone",
//         roles: ["SUPER_ADMIN", "ADMIN"],
//       },
//       {
//         title: "Email Campaigns",
//         href: "/admin/email-campaigns",
//         icon: "Mail",
//         roles: ["SUPER_ADMIN", "ADMIN"],
//       },
//     ],
//   },
// ];

// BLOG MANAGEMENT (Accessible by SUPER_ADMIN, ADMIN, PRODUCT_MANAGER)
export const blogNavItems: NavSection[] = [
  {
    title: "Blog Management",
    items: [
      {
        title: "Blog Posts",
        href: "/admin/blog/posts",
        icon: "FileText",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Write New Post",
        href: "/admin/blog/write",
        icon: "Edit",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Blog Categories",
        href: "/admin/blog/categories",
        icon: "Folder",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Add Blog Category",
        href: "/admin/blog/categories/add",
        icon: "FolderPlus",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Authors",
        href: "/admin/blog/authors",
        icon: "Users",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
    ],
  },
];

// ==================== MAIN FUNCTION: Get Navigation by Role ====================
export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
      return [
        ...commonNavItems,
        ...superAdminNavItems,
        // ...adminNavItems,
        ...productManagerNavItems,
        // ...customerSupportNavItems,
        ...orderManagementNavItems,
        ...customerManagementNavItems,
        ...catalogManagementNavItems,
        // ...marketingManagementNavItems,
        ...blogNavItems,
      ];

    case "ADMIN":
      return [
        ...commonNavItems,
        // ...adminNavItems,
        ...productManagerNavItems,
        // ...customerSupportNavItems,
        ...orderManagementNavItems,
        ...customerManagementNavItems,
        ...catalogManagementNavItems,
        // ...marketingManagementNavItems,
        ...blogNavItems,
      ];

    case "PRODUCT_MANAGER":
      return [
        ...commonNavItems,
        ...productManagerNavItems,
        ...catalogManagementNavItems,
        ...blogNavItems,
      ];

    case "CUSTOMER_SUPPORT":
      return [
        ...commonNavItems,
        // ...customerSupportNavItems,
        ...orderManagementNavItems,
        ...customerManagementNavItems,
      ];

    case "USER":
      return [
        ...commonNavItems,
        ...userAccountNavItems,
        ...userNavItems,
      ];

    default:
      return commonNavItems;
  }
};

// ==================== HELPER FUNCTIONS ====================
// Get flattened navigation items for easier rendering
export const getFlattenedNavItems = (role: UserRole) => {
  const navSections = getNavItemsByRole(role);
  const flattenedItems: any[] = [];

  navSections.forEach(section => {
    if (section.items) {
      section.items.forEach(item => {
        // Only include items that this role has access to
        if (item.roles.includes(role)) {
          flattenedItems.push({
            ...item,
            sectionTitle: section.title,
          });
        }
      });
    }
  });

  return flattenedItems;
};

// Check if user has access to a specific route
export const hasAccessToRoute = (
  role: UserRole, 
  routePath: string
): boolean => {
  const navItems = getFlattenedNavItems(role);
  return navItems.some(item => item.href === routePath);
};

// Get available routes for a role
export const getAvailableRoutes = (role: UserRole): string[] => {
  const navItems = getFlattenedNavItems(role);
  return navItems.map(item => item.href);
};

// Filter sections to only show sections with visible items for current role
export const getFilteredNavSections = (role: UserRole): NavSection[] => {
  const navSections = getNavItemsByRole(role);
  
  return navSections
    .map(section => {
      if (section.items) {
        const visibleItems = section.items.filter(item => 
          item.roles.includes(role)
        );
        return { ...section, items: visibleItems };
      }
      return section;
    })
    .filter(section => 
      // Keep sections that have items OR don't have items array (header-only sections)
      !section.items || section.items.length > 0
    );
};