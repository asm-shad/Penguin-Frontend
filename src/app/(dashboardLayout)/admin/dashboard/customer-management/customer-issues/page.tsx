
const CustomerIssuesPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">
          CUSTOMER ISSUES
        </h1>
        <div className="space-y-3">
          <p className="text-2xl font-semibold text-gray-700">
            Will be displayed here
          </p>
          <div className="inline-block px-6 py-3 bg-amber-100 border-2 border-amber-300 rounded-lg">
            <p className="text-lg font-bold text-amber-800">
              🚧 INTEGRATE IN FUTURE 🚧
            </p>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-8">
          This page is under development and will show customer support tickets, 
          complaints, and feedback in future updates.
        </p>
      </div>
    </div>
  );
};

export default CustomerIssuesPage;