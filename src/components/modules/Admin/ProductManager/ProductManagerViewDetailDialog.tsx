// components/modules/Admin/ProductManagerManagement/ProductManagerViewDetailDialog.tsx
import InfoRow from "@/components/shared/InoRow";
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
  Key,
  Mail,
  Package,
  Phone,
  User,
} from "lucide-react";

interface IProductManagerViewDialogProps {
  open: boolean;
  onClose: () => void;
  productManager: IUser | null;
}

const ProductManagerViewDetailDialog = ({
  open,
  onClose,
  productManager,
}: IProductManagerViewDialogProps) => {
  if (!productManager) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-5xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Product Manager Profile</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Product Manager Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg mb-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={productManager?.profileImageUrl} alt={productManager?.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(productManager?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-1">{productManager?.name}</h2>
              <p className="text-muted-foreground mb-2 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4" />
                {productManager?.email}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge
                  variant={productManager?.userStatus === "INACTIVE" ? "destructive" : "default"}
                  className="text-sm"
                >
                  {productManager?.userStatus || "ACTIVE"}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Package className="h-3 w-3 mr-1" />
                  {productManager.role.replace("_", " ")}
                </Badge>
                {productManager?.needPasswordReset && (
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
                <Phone className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Phone Number"
                    value={productManager?.phone || "Not provided"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Email"
                    value={productManager?.email || "Not provided"}
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
                      productManager?.gender
                        ? productManager.gender.charAt(0) +
                          productManager.gender.slice(1).toLowerCase()
                        : "Not specified"
                    }
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Key className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Password Reset"
                    value={productManager?.needPasswordReset ? "Required" : "Completed"}
                    // valueClassName={productManager?.needPasswordReset ? "text-orange-600" : "text-green-600"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Joined On"
                    value={formatDateTime(productManager?.createdAt || "")}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Last Updated"
                    value={formatDateTime(productManager?.updatedAt || "")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Account Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Role"
                    value={productManager?.role.replace("_", " ") || "N/A"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Account Status"
                    value={productManager?.userStatus || "ACTIVE"}
                    // valueClassName={
                    //   productManager?.userStatus === "ACTIVE" 
                    //     ? "text-green-600" 
                    //     : productManager?.userStatus === "INACTIVE"
                    //     ? "text-orange-600"
                    //     : "text-red-600"
                    // }
                  />
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Deleted"
                    value={productManager?.isDeleted ? "Yes" : "No"}
                    // valueClassName={productManager?.isDeleted ? "text-red-600" : "text-green-600"}
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

export default ProductManagerViewDetailDialog;