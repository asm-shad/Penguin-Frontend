// components/modules/Admin/CustomerSupportManagement/CustomerSupportViewDetailDialog.tsx
import InfoRow from "@/components/shared/InfoRow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, getInitials } from "@/lib/formatters";
import { IUser } from "@/types/user.interface";
import {
  Calendar,
  Headphones,
  Key,
  Mail,
  Phone,
  User,
} from "lucide-react";

interface ICustomerSupportViewDialogProps {
  open: boolean;
  onClose: () => void;
  customerSupport: IUser | null;
}

const CustomerSupportViewDetailDialog = ({
  open,
  onClose,
  customerSupport,
}: ICustomerSupportViewDialogProps) => {
  if (!customerSupport) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-5xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Customer Support Profile</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Customer Support Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg mb-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={customerSupport?.profileImageUrl} alt={customerSupport?.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(customerSupport?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-1">{customerSupport?.name}</h2>
              <p className="text-muted-foreground mb-2 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4" />
                {customerSupport?.email}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge
                  variant={customerSupport?.userStatus === "INACTIVE" ? "destructive" : "default"}
                  className="text-sm"
                >
                  {customerSupport?.userStatus || "ACTIVE"}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Headphones className="h-3 w-3 mr-1" />
                  {customerSupport.role.replace("_", " ")}
                </Badge>
                {customerSupport?.needPasswordReset && (
                  <Badge variant="outline" className="text-sm border-orange-200 text-orange-600">
                    <Key className="h-3 w-3 mr-1" />
                    Password Reset Required
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-lg">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Phone Number"
                    value={customerSupport?.phone || "Not provided"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Email"
                    value={customerSupport?.email || "Not provided"}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-lg">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Gender"
                    value={
                      customerSupport?.gender
                        ? customerSupport.gender.charAt(0) +
                          customerSupport.gender.slice(1).toLowerCase()
                        : "Not specified"
                    }
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Key className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Password Reset"
                    value={customerSupport?.needPasswordReset ? "Required" : "Completed"}
                    // valueClassName={customerSupport?.needPasswordReset ? "text-orange-600" : "text-green-600"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Joined On"
                    value={formatDateTime(customerSupport?.createdAt || "")}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Last Updated"
                    value={formatDateTime(customerSupport?.updatedAt || "")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Headphones className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-lg">Account Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Headphones className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Role"
                    value={customerSupport?.role.replace("_", " ") || "N/A"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Account Status"
                    value={customerSupport?.userStatus || "ACTIVE"}
                    // valueClassName={
                    //   customerSupport?.userStatus === "ACTIVE" 
                    //     ? "text-green-600" 
                    //     : customerSupport?.userStatus === "INACTIVE"
                    //     ? "text-orange-600"
                    //     : "text-red-600"
                    // }
                  />
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Deleted"
                    value={customerSupport?.isDeleted ? "Yes" : "No"}
                    // valueClassName={customerSupport?.isDeleted ? "text-red-600" : "text-green-600"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerSupportViewDetailDialog;