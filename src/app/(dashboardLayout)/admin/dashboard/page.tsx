// app/(dashboardLayout)/admin/dashboard/page.tsx
import { Suspense } from 'react';

// CRITICAL: Add this line TOO
export const dynamic = 'force-dynamic';

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>page</div>
    </Suspense>
  );
};

export default Page;