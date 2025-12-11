// app/(dashboard)/change-password/page.tsx
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ChangePasswordPage from "@/components/modules/MyProfile/ChangePasswordPage";

export default function ChangePasswordRoute() {
  return (
    <Suspense fallback={<ChangePasswordSkeleton />}>
      <ChangePasswordPage />
    </Suspense>
  );
}

function ChangePasswordSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Skeleton className="h-10 w-24 mb-6" />
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}