import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { NavSection } from "@/types/dashboard.interface";
import DashboardSidebarContent from "./DashboardSidebarContent";
import { IUser } from "@/types/user.interface";

const DashboardSidebar = async () => {
  const userInfo = (await getUserInfo()) as IUser;

  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  return (
    <DashboardSidebarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardSidebar;
