import React from 'react';

const OrderIssuesPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">
          ORDER ISSUES
        </h1>
        <div className="space-y-3">
          <p className="text-2xl font-semibold text-gray-700">
            Order problems and complaints will appear here
          </p>
          <div className="inline-block px-6 py-3 bg-purple-100 border-2 border-purple-300 rounded-lg">
            <p className="text-lg font-bold text-purple-800">
              ⏳ COMING SOON ⏳
            </p>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-8">
          This section will handle all order-related issues including:<br />
          • Shipping delays<br />
          • Wrong items delivered<br />
          • Damaged products<br />
          • Return requests<br />
          • Payment problems
        </p>
      </div>
    </div>
  );
};

export default OrderIssuesPage;