/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// app/(dashboard)/my-profile/components/MyProfile.tsx
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Loader2, Save, Mail, Phone, User, MapPin, Calendar, Shield } from "lucide-react";
import { IUser } from "@/types/user.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { updateMyProfile } from "@/services/auth/auth.service";

interface MyProfileProps {
  userInfo: IUser;
}

const MyProfile = ({ userInfo }: MyProfileProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: userInfo.name || "",
    email: userInfo.email || "",
    phone: userInfo.phone || "",
    gender: userInfo.gender || "",
    address: userInfo.userAddresses?.[0]?.address?.addressLine || "",
    city: userInfo.userAddresses?.[0]?.address?.city || "",
    state: userInfo.userAddresses?.[0]?.address?.state || "",
    zipCode: userInfo.userAddresses?.[0]?.address?.zipCode || "",
    country: userInfo.userAddresses?.[0]?.address?.country || "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append("name", formData.name);
    if (formData.phone) submitData.append("phone", formData.phone);
    if (formData.gender) submitData.append("gender", formData.gender);
    
    // Add address data if provided
    if (formData.address || formData.city || formData.state || formData.zipCode || formData.country) {
      submitData.append("addressData", JSON.stringify({
        addressLine: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }));
    }

    // Add profile photo if selected
    const fileInput = e.currentTarget.querySelector('input[name="profilePhoto"]') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      submitData.append("profilePhoto", fileInput.files[0]);
    }

    startTransition(async () => {
      try {
        const result = await updateMyProfile(submitData);
        
        if (result.success) {
          toast.success("Profile updated successfully!");
          setPreviewImage(null);
          router.refresh();
        } else {
          toast.error(result.message || "Failed to update profile");
        }
      } catch (error: any) {
        console.log(error)
        toast.error("An error occurred while updating your profile");
      }
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "bg-purple-100 text-purple-800";
      case "ADMIN": return "bg-blue-100 text-blue-800";
      case "PRODUCT_MANAGER": return "bg-green-100 text-green-800";
      case "CUSTOMER_SUPPORT": return "bg-yellow-100 text-yellow-800";
      case "USER": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "INACTIVE": return "bg-yellow-100 text-yellow-800";
      case "DELETED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Summary & Photo */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {previewImage || userInfo.profileImageUrl ? (
                      <Image
                        src={previewImage || userInfo.profileImageUrl || ""}
                        alt={userInfo.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {userInfo.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      id="profilePhoto"
                      name="profilePhoto"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={isPending}
                    />
                  </label>
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">{userInfo.name}</h2>
                  <div className="flex items-center justify-center gap-2">
                    <Badge className={getRoleColor(userInfo.role)}>
                      {userInfo.role.replace("_", " ")}
                    </Badge>
                    <Badge className={getStatusColor(userInfo.userStatus)}>
                      {userInfo.userStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm">{userInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Member Since</p>
                      <p className="text-sm">{formatDate(userInfo.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Account Status</p>
                      <p className="text-sm capitalize">{userInfo.userStatus.toLowerCase()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/change-password">Change Password</a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/orders">View Orders</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isPending}
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isPending}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">Address Information</h3>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Address Line */}
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={isPending}
                        placeholder="123 Main Street, Apt 4B"
                        rows={2}
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={isPending}
                        placeholder="New York"
                      />
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={isPending}
                        placeholder="NY"
                      />
                    </div>

                    {/* ZIP Code */}
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        disabled={isPending}
                        placeholder="10001"
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled={isPending}
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t">
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="min-w-[150px]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info (if needed) */}
            {userInfo.role !== "USER" && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>
                    Role-specific information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {userInfo.role === "SUPER_ADMIN" && (
                      <>
                        <div className="space-y-2">
                          <Label>System Access Level</Label>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="font-medium text-purple-700">Full System Access</p>
                            <p className="text-sm text-purple-600">Complete control over all system functions</p>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {userInfo.role === "PRODUCT_MANAGER" && (
                      <>
                        <div className="space-y-2">
                          <Label>Product Management</Label>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="font-medium text-green-700">Product Catalog Access</p>
                            <p className="text-sm text-green-600">Manage products, inventory, and categories</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;