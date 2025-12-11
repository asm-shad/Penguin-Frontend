// app/(dashboard)/my-profile/page.tsx
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import MyProfile from "@/components/modules/MyProfile/MyProfile";
import { getUserInfo } from "@/services/auth/getUserInfo";

export default async function MyProfilePage() {
  const userInfo = await getUserInfo();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-gray-500 mt-2">
          Manage your personal information and account settings
        </p>
      </div>

      <Suspense fallback={<ProfileSkeleton />}>
        <MyProfile userInfo={userInfo} />
      </Suspense>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-64 lg:col-span-1" />
      <Skeleton className="h-96 lg:col-span-2" />
    </div>
  );
}