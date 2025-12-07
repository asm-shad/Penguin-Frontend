/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/navigation.utils.ts
import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      items: [
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
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

// COUPON MANAGEMENT (Accessible by SUPER_ADMIN, ADMIN, PRODUCT_MANAGER)
export const couponManagementNavItems: NavSection[] = [
  {
    title: "Coupon Management",
    items: [
      {
        title: "All Coupons",
        href: "/admin/coupons",
        icon: "Percent",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Create Coupon",
        href: "/admin/coupons/create",
        icon: "PlusCircle",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Coupon Analytics",
        href: "/admin/coupons/analytics",
        icon: "BarChart3",
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
        href: "/admin/categories",
        icon: "Layers",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Add Category",
        href: "/admin/categories/add",
        icon: "FolderPlus",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      // Brands
      {
        title: "Brands",
        href: "/admin/brands",
        icon: "Tag",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Add Brand",
        href: "/admin/brands/add",
        icon: "TagPlus",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
    ],
  },
];

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
      {
        title: "Audit Logs",
        href: "/admin/audit-logs",
        icon: "FileText",
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
];

// ADMIN Nav Items (Admin inherits all management features)
export const adminNavItems: NavSection[] = [
  {
    title: "Admin Dashboard",
    items: [
      {
        title: "Admin Home",
        href: "/admin/dashboard",
        icon: "LayoutDashboard",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Sales Overview",
        href: "/admin/sales",
        icon: "TrendingUp",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Financial Reports",
        href: "/admin/reports",
        icon: "PieChart",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
];

// PRODUCT_MANAGER Nav Items (Product Manager only sees product-related stuff)
export const productManagerNavItems: NavSection[] = [
  {
    title: "Product Management",
    items: [
      {
        title: "Product Dashboard",
        href: "/product-manager/dashboard",
        icon: "LayoutDashboard",
        roles: ["PRODUCT_MANAGER"],
      },
      {
        title: "Add New Product",
        href: "/admin/products/add",
        icon: "PlusCircle",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "All Products",
        href: "/admin/products",
        icon: "Package",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Inventory Management",
        href: "/admin/inventory",
        icon: "PackageCheck",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Product Reviews",
        href: "/admin/reviews",
        icon: "Star",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
    ],
  },
  {
    title: "Product Variants",
    items: [
      {
        title: "Manage Variants",
        href: "/admin/variants",
        icon: "GitBranch",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Add Variant",
        href: "/admin/variants/add",
        icon: "GitBranchPlus",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
    ],
  },
];

// CUSTOMER_SUPPORT Nav Items
export const customerSupportNavItems: NavSection[] = [
  {
    title: "Support Dashboard",
    items: [
      {
        title: "Support Home",
        href: "/customer-support/dashboard",
        icon: "LayoutDashboard",
        roles: ["CUSTOMER_SUPPORT"],
      },
      {
        title: "New Tickets",
        href: "/admin/support-tickets/new",
        icon: "MessageSquare",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
      {
        title: "All Tickets",
        href: "/admin/support-tickets",
        icon: "Inbox",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
    ],
  },
  {
    title: "Customer Management",
    items: [
      {
        title: "Customer Issues",
        href: "/admin/customer-issues",
        icon: "AlertCircle",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
      {
        title: "Order Issues",
        href: "/admin/order-issues",
        icon: "ShoppingCart",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
      {
        title: "Return Requests",
        href: "/admin/returns",
        icon: "RotateCcw",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
    ],
  },
  {
    title: "Knowledge Base",
    items: [
      {
        title: "FAQs",
        href: "/admin/faqs",
        icon: "HelpCircle",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
      {
        title: "Guides",
        href: "/admin/guides",
        icon: "BookOpen",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
      {
        title: "Manage FAQ",
        href: "/admin/faqs/manage",
        icon: "HelpCircle",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
];

// ORDER MANAGEMENT (Accessible by SUPER_ADMIN, ADMIN, CUSTOMER_SUPPORT)
export const orderManagementNavItems: NavSection[] = [
  {
    title: "Order Management",
    items: [
      {
        title: "All Orders",
        href: "/admin/orders",
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
    title: "Customer Management",
    items: [
      {
        title: "All Customers",
        href: "/admin/customers",
        icon: "Users",
        roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"],
      },
      {
        title: "Customer Analytics",
        href: "/admin/customers/analytics",
        icon: "TrendingUp",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Customer Groups",
        href: "/admin/customer-groups",
        icon: "Users",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
];

// MARKETING MANAGEMENT (Accessible by SUPER_ADMIN, ADMIN, PRODUCT_MANAGER)
export const marketingManagementNavItems: NavSection[] = [
  {
    title: "Marketing Management",
    items: [
      {
        title: "Featured Products",
        href: "/admin/featured",
        icon: "Star",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
      {
        title: "Promotions",
        href: "/admin/promotions",
        icon: "Megaphone",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Email Campaigns",
        href: "/admin/email-campaigns",
        icon: "Mail",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
];

// Blog Section (Accessible by SUPER_ADMIN, ADMIN, PRODUCT_MANAGER)
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

// Regular USER Nav Items
export const userNavItems: NavSection[] = [
  {
    title: "Shopping",
    items: [
      {
        title: "Shop Products",
        href: "/shop",
        icon: "ShoppingBag",
        roles: ["USER"],
      },
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
        title: "My Wishlist",
        href: "/dashboard/wishlist",
        icon: "Heart",
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

// Helper function to get all navigation items based on role
export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  // SUPER_ADMIN: Has access to EVERYTHING
  if (role === "SUPER_ADMIN") {
    return [
      ...commonNavItems,
      ...superAdminNavItems,
      ...adminNavItems,
      ...productManagerNavItems,
      ...customerSupportNavItems,
      ...orderManagementNavItems,
      ...customerManagementNavItems,
      ...catalogManagementNavItems,
      ...couponManagementNavItems,
      ...marketingManagementNavItems,
      ...blogNavItems,
    ];
  }

  // ADMIN: Has access to all management features except super admin specific
  if (role === "ADMIN") {
    return [
      ...commonNavItems,
      ...adminNavItems,
      ...productManagerNavItems,
      ...customerSupportNavItems,
      ...orderManagementNavItems,
      ...customerManagementNavItems,
      ...catalogManagementNavItems,
      ...couponManagementNavItems,
      ...marketingManagementNavItems,
      ...blogNavItems,
    ];
  }

  // PRODUCT_MANAGER: Only product and catalog management
  if (role === "PRODUCT_MANAGER") {
    return [
      ...commonNavItems,
      ...productManagerNavItems,
      ...catalogManagementNavItems,
      ...couponManagementNavItems,
      ...blogNavItems,
    ];
  }

  // CUSTOMER_SUPPORT: Only customer and order management
  if (role === "CUSTOMER_SUPPORT") {
    return [
      ...commonNavItems,
      ...customerSupportNavItems,
      ...orderManagementNavItems,
      ...customerManagementNavItems,
    ];
  }

  // Regular USER
  if (role === "USER") {
    return [...commonNavItems, ...userNavItems];
  }

  return commonNavItems;
};

// Alternative: Get flattened navigation items for easier rendering
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