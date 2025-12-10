// components/modules/Admin/CustomerManagement/CustomerViewDetailDialog.tsx (Updated)
import InfoRow from "@/components/shared/InfoRow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateTime, getInitials } from "@/lib/formatters";
import { IOrder, IOrderItem } from "@/types/order.interface";
import { IUser } from "@/types/user.interface";
import {
  Calendar,
  CreditCard,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  ShoppingBag,
  Star,
  User,
  Mail,
  Shield,
  Tag,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface ICustomerViewDialogProps {
  open: boolean;
  onClose: () => void;
  customer: IUser | null;
}

// Helper function to get status badge
const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
    PENDING: { variant: "outline", label: "Pending" },
    PROCESSING: { variant: "secondary", label: "Processing" },
    SHIPPED: { variant: "default", label: "Shipped" },
    DELIVERED: { variant: "default", label: "Delivered" },
    CANCELLED: { variant: "destructive", label: "Cancelled" },
    REFUNDED: { variant: "destructive", label: "Refunded" },
  };
  
  const config = statusConfig[status] || { variant: "outline", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
    case "PROCESSING":
      return <Clock className="h-4 w-4" />;
    case "SHIPPED":
      return <Truck className="h-4 w-4" />;
    case "DELIVERED":
      return <CheckCircle className="h-4 w-4" />;
    case "CANCELLED":
    case "REFUNDED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const CustomerViewDetailDialog = ({
  open,
  onClose,
  customer,
}: ICustomerViewDialogProps) => {
  if (!customer) {
    return null;
  }

  // Calculate stats from actual orders
  const orders: IOrder[] = customer.orders || [];
  const orderCount = orders.length;
  
  // Calculate financial stats
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const totalDiscount = orders.reduce((sum, order) => sum + (order.discountAmount || 0), 0);
  const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
  
  // Count orders by status
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Get recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5);

  // Get addresses
  const addresses = customer.userAddresses || [];
  const addressCount = addresses.length;
  
  // Get reviews and wishlist
  const reviewCount = customer.productReviews?.length || 0;
  const wishlistCount = customer.wishlists?.length || 0;
  
  // Get payment methods
  const paymentMethods = customer.payments || [];
  const uniquePaymentMethods = Array.from(new Set(paymentMethods.map(p => p.paymentMethod)));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Customer Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <TabsList className="px-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orderCount})</TabsTrigger>
            <TabsTrigger value="addresses">Addresses ({addressCount})</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 p-6 m-0">
              {/* Customer Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg mb-6">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={customer?.profileImageUrl} alt={customer?.name} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(customer?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-3xl font-bold mb-1">{customer?.name}</h2>
                  <p className="text-muted-foreground mb-2 flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    {customer?.email}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Badge
                      variant={customer?.userStatus === "INACTIVE" ? "destructive" : "default"}
                      className="text-sm"
                    >
                      {customer?.userStatus || "ACTIVE"}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      <User className="h-3 w-3 mr-1" />
                      Customer
                    </Badge>
                    {customer?.isDeleted && (
                      <Badge variant="destructive" className="text-sm">
                        Deleted
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Send Email
                  </Button>
                  <Button variant="outline" size="sm">
                    View Orders
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="text-2xl font-bold">{orderCount}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Total Spent</p>
                      <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3">
                    <Tag className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-500">Total Discount</p>
                      <p className="text-2xl font-bold">${totalDiscount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3">
                    <Star className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Avg. Order Value</p>
                      <p className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status Breakdown */}
              {orderCount > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Order Status Breakdown
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(statusCounts).map(([status, count]) => (
                        <div key={status} className="bg-white p-3 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(status)}
                              <span className="text-sm font-medium">{status}</span>
                            </div>
                            <span className="font-bold">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Personal Information */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <InfoRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={customer?.email || "Not provided"}
                  />
                  <InfoRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={customer?.phone || "Not provided"}
                  />
                  <InfoRow
                    icon={<User className="h-4 w-4" />}
                    label="Gender"
                    value={customer?.gender ? customer.gender.charAt(0) + customer.gender.slice(1).toLowerCase() : "Not specified"}
                  />
                  <InfoRow
                    icon={<Shield className="h-4 w-4" />}
                    label="Account Status"
                    value={customer?.userStatus || "ACTIVE"}
                    valueClassName={
                      customer?.userStatus === "ACTIVE" 
                        ? "text-green-600" 
                        : customer?.userStatus === "INACTIVE"
                        ? "text-orange-600"
                        : "text-red-600"
                    }
                  />
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Joined On"
                    value={formatDateTime(customer?.createdAt || "")}
                  />
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Last Updated"
                    value={formatDateTime(customer?.updatedAt || "")}
                  />
                </div>
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">Addresses</h4>
                  </div>
                  <p className="text-3xl font-bold mb-1">{addressCount}</p>
                  <p className="text-sm text-gray-500">Saved addresses</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">Reviews</h4>
                  </div>
                  <p className="text-3xl font-bold mb-1">{reviewCount}</p>
                  <p className="text-sm text-gray-500">Product reviews</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold">Wishlist</h4>
                  </div>
                  <p className="text-3xl font-bold mb-1">{wishlistCount}</p>
                  <p className="text-sm text-gray-500">Saved items</p>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="p-6 m-0">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Order History</h3>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/dashboard/orders?customer=${customer.id}`}>
                      View All Orders
                    </Link>
                  </Button>
                </div>
                
                {orderCount === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="bg-white p-4 rounded-lg border hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">Order #{order.orderNumber}</p>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-gray-500">
                              {formatDateTime(order.orderDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${order.totalPrice.toFixed(2)}</p>
                            {order.discountAmount > 0 && (
                              <p className="text-sm text-green-600">
                                Saved ${order.discountAmount.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        {order.orderItems && order.orderItems.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium mb-2">Items ({order.orderItems.length}):</p>
                            <div className="space-y-2">
                              {order.orderItems.slice(0, 2).map((item: IOrderItem) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <div>
                                    <span className="font-medium">{item.productName}</span>
                                    {item.variantInfo && (
                                      <span className="text-gray-500 ml-2">({item.variantInfo})</span>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div>{item.quantity} × ${item.unitPrice.toFixed(2)}</div>
                                    {item.discount > 0 && (
                                      <div className="text-green-600 text-xs">
                                        -${item.discount.toFixed(2)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {order.orderItems.length > 2 && (
                                <p className="text-sm text-gray-500">
                                  + {order.orderItems.length - 2} more items
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Shipping Information */}
                        {order.shippingAddress && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium mb-1">Shipping to:</p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress}
                              {order.shippingCity && `, ${order.shippingCity}`}
                              {order.shippingState && `, ${order.shippingState}`}
                              {order.shippingZipCode && ` ${order.shippingZipCode}`}
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-3 pt-3 border-t flex justify-end">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/dashboard/orders/${order.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="p-6 m-0">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>
                {addressCount === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No addresses saved</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((userAddress) => (
                      <div key={userAddress.id} className="bg-white p-4 rounded-lg border hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{userAddress.addressName}</p>
                            {userAddress.isDefault && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>{userAddress.address?.addressLine}</p>
                          <p>
                            {userAddress.address?.city}, {userAddress.address?.state} {userAddress.address?.zipCode}
                          </p>
                          <p className="text-gray-500">{userAddress.address?.country}</p>
                          {userAddress.email && (
                            <p className="text-gray-500 mt-2">
                              <Mail className="h-3 w-3 inline mr-1" />
                              {userAddress.email}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="p-6 m-0">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                
                {/* Payment Methods */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Payment Methods Used</h4>
                  {uniquePaymentMethods.length === 0 ? (
                    <p className="text-gray-500">No payment methods recorded</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {uniquePaymentMethods.map((method) => (
                        <Badge key={method} variant="outline">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Payments */}
                <div>
                  <h4 className="font-medium mb-3">Recent Payments</h4>
                  {paymentMethods.length === 0 ? (
                    <p className="text-gray-500">No payment history</p>
                  ) : (
                    <div className="space-y-3">
                      {paymentMethods.slice(0, 5).map((payment) => (
                        <div key={payment.id} className="bg-white p-3 rounded-lg border">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">${payment.amount?.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">
                                {payment.paymentMethod} • {formatDateTime(payment.createdAt)}
                              </p>
                            </div>
                            <Badge variant={payment.paymentStatus === "COMPLETED" ? "default" : "secondary"}>
                              {payment.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="p-6 m-0">
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="text-2xl font-bold">{orderCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Spent</p>
                      <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Avg. Order Value</p>
                      <p className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Discount</p>
                      <p className="text-2xl font-bold">${totalDiscount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Order #{order.orderNumber}</p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(order.orderDate)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${order.totalPrice.toFixed(2)}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Timeline */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3">Customer Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">Account Created</p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(customer.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {orderCount > 0 && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <ShoppingBag className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">First Order</p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(orders[orders.length - 1]?.orderDate)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {orderCount > 1 && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <ShoppingBag className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Latest Order</p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(orders[0]?.orderDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerViewDetailDialog;