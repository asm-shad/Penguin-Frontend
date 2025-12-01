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
        href: "/super-admin/users",
        icon: "Users",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "Staff Management",
        href: "/super-admin/staff",
        icon: "Briefcase",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "Audit Logs",
        href: "/super-admin/audit-logs",
        icon: "FileText",
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
];

// ADMIN Nav Items
export const adminNavItems: NavSection[] = [
  {
    title: "Admin Dashboard",
    items: [
      {
        title: "Admin Home",
        href: "/admin/dashboard",
        icon: "LayoutDashboard",
        roles: ["ADMIN"],
      },
      {
        title: "Sales Overview",
        href: "/admin/sales",
        icon: "TrendingUp",
        roles: ["ADMIN"],
      },
      {
        title: "Financial Reports",
        href: "/admin/reports",
        icon: "PieChart",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Store Management",
    items: [
      {
        title: "Products",
        href: "/admin/products",
        icon: "Package",
        roles: ["ADMIN"],
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: "Layers",
        roles: ["ADMIN"],
      },
      {
        title: "Brands",
        href: "/admin/brands",
        icon: "Tag",
        roles: ["ADMIN"],
      },
      {
        title: "Inventory",
        href: "/admin/inventory",
        icon: "PackageCheck",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Order Management",
    items: [
      {
        title: "All Orders",
        href: "/admin/orders",
        icon: "ShoppingCart",
        roles: ["ADMIN"],
      },
      {
        title: "Pending Orders",
        href: "/admin/orders/pending",
        icon: "Clock",
        badge: "12",
        roles: ["ADMIN"],
      },
      {
        title: "Returns & Refunds",
        href: "/admin/returns",
        icon: "RotateCcw",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Customer Management",
    items: [
      {
        title: "All Customers",
        href: "/admin/customers",
        icon: "Users",
        roles: ["ADMIN"],
      },
      {
        title: "Customer Support",
        href: "/admin/support-tickets",
        icon: "MessageSquare",
        badge: "5",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Marketing",
    items: [
      {
        title: "Coupons & Discounts",
        href: "/admin/coupons",
        icon: "Percent",
        roles: ["ADMIN"],
      },
      {
        title: "Featured Products",
        href: "/admin/featured",
        icon: "Star",
        roles: ["ADMIN"],
      },
    ],
  },
];

// PRODUCT_MANAGER Nav Items
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
        href: "/product-manager/products/add",
        icon: "PlusCircle",
        roles: ["PRODUCT_MANAGER"],
      },
      {
        title: "Product List",
        href: "/product-manager/products",
        icon: "List",
        roles: ["PRODUCT_MANAGER"],
      },
      {
        title: "Inventory Management",
        href: "/product-manager/inventory",
        icon: "PackageCheck",
        roles: ["PRODUCT_MANAGER"],
      },
      {
        title: "Product Reviews",
        href: "/product-manager/reviews",
        icon: "Star",
        roles: ["PRODUCT_MANAGER"],
      },
    ],
  },
  {
    title: "Catalog Management",
    items: [
      {
        title: "Categories",
        href: "/product-manager/categories",
        icon: "Layers",
        roles: ["PRODUCT_MANAGER"],
      },
      {
        title: "Brands",
        href: "/product-manager/brands",
        icon: "Tag",
        roles: ["PRODUCT_MANAGER"],
      },
      {
        title: "Product Variants",
        href: "/product-manager/variants",
        icon: "GitBranch",
        roles: ["PRODUCT_MANAGER"],
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
        href: "/customer-support/tickets/new",
        icon: "MessageSquare",
        badge: "8",
        roles: ["CUSTOMER_SUPPORT"],
      },
      {
        title: "All Tickets",
        href: "/customer-support/tickets",
        icon: "Inbox",
        roles: ["CUSTOMER_SUPPORT"],
      },
    ],
  },
  {
    title: "Customer Management",
    items: [
      {
        title: "Customer Issues",
        href: "/customer-support/issues",
        icon: "AlertCircle",
        roles: ["CUSTOMER_SUPPORT"],
      },
      {
        title: "Order Issues",
        href: "/customer-support/order-issues",
        icon: "ShoppingCart",
        roles: ["CUSTOMER_SUPPORT"],
      },
      {
        title: "Return Requests",
        href: "/customer-support/returns",
        icon: "RotateCcw",
        roles: ["CUSTOMER_SUPPORT"],
      },
    ],
  },
  {
    title: "Knowledge Base",
    items: [
      {
        title: "FAQs",
        href: "/customer-support/faqs",
        icon: "HelpCircle",
        roles: ["CUSTOMER_SUPPORT"],
      },
      {
        title: "Guides",
        href: "/customer-support/guides",
        icon: "BookOpen",
        roles: ["CUSTOMER_SUPPORT"],
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

// Blog Section (Common for admin, product manager, and super admin who can write blogs)
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
        title: "Authors",
        href: "/admin/blog/authors",
        icon: "Users",
        roles: ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER"],
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
      return [
        ...commonNavItems,
        ...superAdminNavItems,
        ...adminNavItems,
        ...blogNavItems,
      ];
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems, ...blogNavItems];
    case "PRODUCT_MANAGER":
      return [...commonNavItems, ...productManagerNavItems, ...blogNavItems];
    case "CUSTOMER_SUPPORT":
      return [...commonNavItems, ...customerSupportNavItems];
    case "USER":
      return [...commonNavItems, ...userNavItems];
    default:
      return commonNavItems;
  }
};
