// components/dashboard/DashboardHeader.tsx
import { Settings, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const DashboardHeader = ({ title, description, actions }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-gray-500 mt-2">{description}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {actions || (
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;